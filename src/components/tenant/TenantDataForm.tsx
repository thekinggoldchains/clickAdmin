/* eslint-disable react/jsx-handler-names */
import React, { FC, useMemo } from 'react'
import { Form, Button, Select } from 'antd'
import InputMask from 'react-input-mask'

import ImageUploadOriginal from '../common/ImageUpload'
import ColorPicker from '../common/ColorPicker'
import TextInputOriginal from '../common/TextInput'
import {
  Message,
  useAltIntl,
  IntlRules,
  IntlSelect,
  prepareRules,
  prepareSelect,
} from '../../intlConfig'
import { forwardRef } from './products/ProductForm'
import { TenantConfig } from '../../typings'
import SlugFormItem from './SlugFormItem'

const { Item } = Form
const { Option } = Select

type TenantMetadata = Pick<
  TenantConfig,
  'name' | 'slug' | 'whatsapp' | 'instagram' | 'logoSrc' | 'color'
>

type Props = {
  loading?: boolean
  initialData?: TenantMetadata
  onSubmit?: (data: TenantMetadata) => Promise<void>
}

type IpApiResponse = {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  timezone: string
  query: string
}

const ImageUpload = forwardRef<
  React.ComponentPropsWithoutRef<typeof ImageUploadOriginal>
>(ImageUploadOriginal)

const TextInput = forwardRef<
  React.ComponentPropsWithoutRef<typeof TextInputOriginal>
>(TextInputOriginal)

const intlRules: IntlRules = {
  name: [
    {
      required: true,
      message: 'tenant.data.nameRequired',
    },
    {
      min: 4,
      message: 'tenant.data.nameMin',
    },
    {
      max: 30,
      message: 'tenant.data.nameMax',
    },
  ],
  slug: [
    {
      required: true,
      message: 'tenant.data.slugRequired',
    },
    {
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/g,
      message: 'tenant.data.slugPattern',
    },
  ],
  whatsapp: [{ required: true, message: 'tenant.data.whatsappRequired' }],
  instagram: [
    {
      pattern: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/g,
      message: 'tenant.data.instagramPattern',
    },
  ],
  required: [
    {
      required: true,
      message: 'mandatoryField',
    },
  ],
}

const intlCategories: IntlSelect = [
  {
    name: 'tenant.category.lanchonete',
    value: 'lanchonete',
  },
  {
    name: 'tenant.category.lavanderia',
    value: 'Lavanderia',
  },
  {
    name: 'tenant.category.lava-rapido',
    value: 'Lava-Rápido',
  },
  {
    name: 'tenant.category.hamburgueria',
    value: 'hamburgueria',
  },
  {
    name: 'tenant.category.pizzaria',
    value: 'pizzaria',
  },
  {
    name: 'tenant.category.loja',
    value: 'loja',
  },
  {
    name: 'tenant.category.restaurante',
    value: 'restaurante',
  },
  {
    name: 'tenant.category.mercado',
    value: 'mercado',
  },
  {
    name: 'tenant.category.marmitas',
    value: 'marmitas',
  },
  {
    name: 'tenant.category.cafe',
    value: 'cafe',
  },
  {
    name: 'tenant.category.doceria',
    value: 'doceria',
  },
  {
    name: 'tenant.category.foodTruck',
    value: 'foodTruck',
  },
  {
    name: 'tenant.category.bar',
    value: 'bar',
  },
  {
    name: 'tenant.category.petiscaria',
    value: 'petiscaria',
  },
  {
    name: 'tenant.category.pastelaria',
    value: 'pastelaria',
  },
  {
    name: 'tenant.category.sorveteria',
    value: 'sorveteria',
  },
]

const TenantDataForm: FC<Props> = ({ initialData, onSubmit, loading }) => {
  const intl = useAltIntl()
  const rules = useMemo(() => prepareRules(intlRules, intl), [intl])
  const categories = useMemo(() => prepareSelect(intlCategories, intl), [intl])
  let phoneNumberMask = '+999 999 999 999'

  fetch(`http://ip-api.com/json`)
    .then((response) => response.json())
    .then(({ countryCode }: IpApiResponse) => {
      if (countryCode === 'BR') {
        phoneNumberMask = '+99 99 99999 9999'
      }
    }
  )

  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(data) => {
        onSubmit?.(data as TenantConfig).then(() => {
          form.resetFields()
        })
      }}
      initialValues={initialData}
    >
      <Item label={<Message id="tenant.name" />} name="name" rules={rules.name}>
        <TextInput />
      </Item>
      <div className="flex flex-column flex-row-l">
        <div className="w-100 w-50-l mr1">
          <SlugFormItem
            disabled={!!loading}
            form={form}
            currentSlug={initialData?.slug ?? ''}
          />
        </div>
        <div className="w-100 w-50-l">
          <Item
            label={<Message id="tenant.category" />}
            name="category"
            rules={rules.required}
          >
            <Select
              disabled={loading}
              size="large"
              placeholder={<Message id="tenant.categoryPlaceholder" />}
            >
              {categories?.map(({ name, value }) => (
                <Option value={value} key={value}>
                  {name}
                </Option>
              ))}
            </Select>
          </Item>
        </div>
      </div>
      <div className="flex flex-column flex-row-l">
        <div className="w-100 w-50-l mr0 mr1-l">
          <Item
            label={<Message id="tenant.whatsapp" />}
            name="whatsapp"
            rules={rules.whatsapp}
          >
            <InputMask disabled={loading} mask={phoneNumberMask}>
              <TextInput
                placeholder={intl.formatMessage({
                  id: 'tenant.whatsappPlaceholder',
                })}
              />
            </InputMask>
          </Item>
        </div>
        <div className="w-100 w-50-l mr0 mr1-l">
          <Item
            label={<Message id="tenant.instagram" />}
            name="instagram"
            rules={rules.instagram}
          >
            <TextInput disabled={loading} addonBefore="@" />
          </Item>
        </div>
      </div>
      <div className="flex flex-column flex-row-l">
        <div className="w-100 w-70-l">
          <Item
            label={<Message id="tenant.logoSrc" />}
            name="logoSrc"
            rules={rules.logoSrc}
          >
            <ImageUpload disabled={loading} large />
          </Item>
        </div>
        <div className="w-100 w-30-l pl0 pl4-l">
          <Item
            label={<Message id="tenant.color" />}
            name="color"
            rules={rules.color}
          >
            <ColorPicker />
          </Item>
        </div>
      </div>
      <Button
        loading={loading}
        size="large"
        type="primary"
        block
        htmlType="submit"
      >
        <Message id="save" />
      </Button>
    </Form>
  )
}

export default TenantDataForm
