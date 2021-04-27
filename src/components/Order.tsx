import React, { FC, useCallback, useMemo, Fragment, useState } from 'react'
import {
  Affix,
  Alert,
  Button,
  Form,
  Divider,
  Input,
  Spin,
  Layout,
  DatePicker,
  Checkbox,
} from 'antd'
import { SendOutlined } from '@ant-design/icons'
import * as firebase from 'firebase/app'
import slugify from 'slugify'
import { useQueryParam, BooleanParam } from 'use-query-params'
import 'firebase/analytics'

import {
  WorldAddress,
  Product,
  Category,
  ShippingMethod,
  Order as OrderType,
} from '../typings'
import { useAltIntl, Message } from '../intlConfig'
import ProductList, { UISection } from './order/ProductList'
import Totalizer from './Totalizer'
import OrderSummary from './OrderSummary'
import PaymentSelector from './customer/PaymentSelector'
import { useTenantConfig } from '../contexts/TenantContext'
import { generateLink, log, isTenantOpen } from '../utils'
import SelectShipping from './order/SelectShipping'
import { useOrder } from '../contexts/order/OrderContext'
import { useInitialShipping } from './order/useInitialShipping'
import SEO from './SEO'
import TenantHeader from './order/TenantHeader'

const { Footer } = Layout
const { TextArea } = Input
const { Item } = Form

interface TempFormData extends WorldAddress {
  name: string
  info?: string
  scheduling?: Moment
  shippingMethod?: ShippingMethod
}

const Order: FC = () => {
  const intl = useAltIntl()
  const [debug] = useQueryParam('debug', BooleanParam)
  const [orderForm] = Form.useForm()
  const { tenant, loading, products } = useTenantConfig()
  const [{ order }, dispatch] = useOrder()
  const shippingAddress = order?.shipping?.address
  const [isAddressOnViewport, setAddressOnViewport] = useState(false)

  const [isScheduled, setIsScheduled] = useState(false)

  // Dirty hack to initially select a shipping method
  useInitialShipping(tenant, order, dispatch)

  const enviarPedido = useCallback(() => {
    if (!order || !tenant) return

    const whatsappLink = generateLink(order, tenant)

    try {
      const analytics = firebase.analytics()

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      analytics.logEvent('purchase', {
        tenant: tenant?.name,
        value: order.totalizers?.totalPrice ?? 0 / 100,
        currency: 'POR',
      })
    } catch (e) {
      log(e)
      log('Erro ao enviar evento ao Analytics')
    }

    const win = window.open(whatsappLink, '_blank')

    win?.focus()
  }, [order, tenant])

  const hasValidOrder =
    (order?.totalizers?.totalPrice ?? 0) > 0 && order?.payment

  const fallbackProducts: Product[] = useMemo(
    () =>
      tenant?.items?.map((item) => ({
        ...item,
        userId: ',',
        description: item.items?.join('\n\n'),
        category: 0,
        highlight: false,
      })) ?? [],
    [tenant]
  )

  const sections = useMemo(() => {
    const productItems = !tenant?.migrated ? fallbackProducts : products

    const categoryItems = tenant?.migrated
      ? tenant?.categories
      : ([{ name: 'noop', slug: 'noop', live: true }] as Category[])

    if (!productItems || !categoryItems) return []

    const productsMap = productItems.filter(Boolean).reduce((acc, product) => {
      acc[product.id ?? ''] = product

      return acc
    }, {} as Record<string, Product>)

    return tenant?.sites?.zap.categoryIds
      .filter(({ visible }) => !!visible)
      .map((index) => ({
        category: categoryItems[index.element],
        categoryIndex: index.element,
      }))
      .filter(({ category }) => category.live)
      .map(({ category, categoryIndex }) => {
        const { name } = category
        const productIds = tenant?.sites?.zap.productMap[categoryIndex] ?? []

        return {
          name,
          slug: slugify(name, { lower: true }),
          products: productIds
            .filter(({ visible }) => visible)
            .map(({ element }) => productsMap[element])
            .filter(({ live }) => !!live),
        } as UISection
      })
      .filter(({ products: sectionProducts }) => !!sectionProducts?.length)
  }, [products, tenant, fallbackProducts])

  const tenantOpen =
    (tenant?.live && isTenantOpen(tenant?.openingHours ?? { intervals: [] })) ||
    debug

  return (
    <div>
      <SEO title={tenant?.name} />
      {loading && (
        <div className="flex flex-column items-center pt3">
          <Spin />
          <span>
            <Message id="order.loading" />
          </span>
        </div>
      )}
      {!loading && (
        <Fragment>
          {!tenantOpen && !tenant?.showOnClose && (
            <div className="ma3">
              <Alert
                type="warning"
                className="ma3"
                message={intl.formatMessage({ id: 'order.closedForBuzz' })}
              />
            </div>
          )}
          {(tenantOpen || tenant?.showOnClose) && (
            <Layout className="pb3">
              <TenantHeader />
              <div
                className="flex justify-center"
                style={{ marginTop: '10px' }}
              >
                <div className="w-100 ph2 ph0-l w-50-l">
                  {!tenantOpen && (
                    <Alert
                      type="warning"
                      message={intl.formatMessage({ id: 'order.semiClosed' })}
                    />
                  )}
                  <ProductList sections={sections ?? []} />
                  <Divider />
                  <Form
                    scrollToFirstError
                    onFinish={() => {
                      enviarPedido()
                    }}
                    form={orderForm}
                    onValuesChange={(_, data) => {
                      const formData = data as TempFormData

                      const {
                        name,
                        info,
                        shippingMethod,
                        scheduling,
                      } = formData

                      const partialOrder: Partial<OrderType> = {
                        customer: {
                          name,
                        },
                        info,
                        ...(shippingMethod && {
                          shipping: {
                            type: shippingMethod,
                            address: shippingAddress,
                            price:
                              shippingMethod === 'DELIVERY'
                                ? tenant?.shippingStrategies?.deliveryFixed
                                    ?.price ?? 0
                                : 0,
                          },
                        }),
                        scheduling: isScheduled
                          ? scheduling?.format('DD-MM-YYYY HH:mm')
                          : undefined,
                      }

                      dispatch({
                        type: 'SET_PARTIAL_ORDER',
                        args: partialOrder,
                      })
                    }}
                    layout="vertical"
                  >
                    <SelectShipping
                      id="shipping-selector"
                      onViewPort={(isIt) => setAddressOnViewport(isIt)}
                    />
                    <Divider />
                    <Item name="info" label="Outras informações?">
                      <TextArea
                        className="mv2"
                        placeholder="Ex: Não quero item X ou Y"
                      />
                    </Item>
                    <Item name="scheduled">
                      <Checkbox
                        checked={isScheduled}
                        onChange={() => setIsScheduled(!isScheduled)}
                      >
                        <Message id="order.scheduling.check" />
                      </Checkbox>
                    </Item>
                    <Item
                      name="scheduling"
                      label={intl.formatMessage({
                        id: 'order.scheduling.info',
                      })}
                      rules={[{ required: isScheduled }]}
                    >
                      <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm"
                        disabled={!isScheduled}
                      />
                    </Item>
                    <Item
                      name="name"
                      label="Seu nome"
                      rules={[{ required: true }]}
                    >
                      <Input size="large" className="mv2" />
                    </Item>
                    {!!order?.items.length && (
                      <>
                        <Affix offsetBottom={-5} className="mt4">
                          <Totalizer
                            order={order}
                            shouldDisplayButton={!isAddressOnViewport}
                          />
                        </Affix>
                        <OrderSummary order={order} />
                        <Divider />
                        <PaymentSelector />
                      </>
                    )}
                    <div className="flex justify-center">
                      <Button
                        icon={<SendOutlined />}
                        htmlType="submit"
                        type="primary"
                        className="mt4"
                        size="large"
                        shape="round"
                        disabled={!hasValidOrder && !tenantOpen}
                      >
                        Enviar Pedido
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
              <Footer className="tc mt2">
                <b>Click Entregas ©2021 </b> - Gostou?{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://clickentregas.pt"
                >
                  Consulte-nos
                </a>
              </Footer>
            </Layout>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default Order
