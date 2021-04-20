import React, { FC, Fragment } from 'react'
import { Form, Select, Input } from 'antd'
import { select } from '@storybook/addon-knobs'

import { WorldAddress } from '../../typings'
// TODO: Think how to i18n that
import { estadosPt, pais } from '../../constants'
import {
  useAltIntl,
  TypedIntlRules,
  prepareRules,
  IntlRules,
} from '../../intlConfig'

const { Item } = Form
const { Option } = Select

type Props = {
  rules: TypedIntlRules<WorldAddress>
}

const AddressFields: FC<Props> = ({ rules: intlRules }) => {
  const intl = useAltIntl()

  const rules = prepareRules(intlRules as IntlRules, intl)
  const selecionado = ''

  return (
    <Fragment>
      <div className="flex w-100 justify-center">
        {/* <div className="w-40 mr2">
          <Item
            label={intl.formatMessage({ id: 'address.country' })}
            name="country"
          >
            <Select size="large" id='selectedPais'>
              {pais.map(({ pais }) => (
                <Option key={pais} value={pais}>
                  {pais}
                </Option>
              ))}
            </Select>
          </Item>
        </div> */}
        <div className="w-80 mr2">
          <Item
            name="street"
            rules={rules.street}
            label={intl.formatMessage({ id: 'address.street' })}
          >
            <Input
              size="large"
              placeholder={intl.formatMessage({
                id: 'address.streetPlaceholder',
              })}
            />
          </Item>
        </div>
        <div className="w-20">
          <Item
            label={intl.formatMessage({ id: 'address.number' })}
            name="number"
            rules={rules.number}
          >
            <Input size="large" autoComplete="cc-csc" />
          </Item>
        </div>
      </div>
      <div className="flex w-100 justify-center">
        <div className="w-40 mr2">
          <Item
            label={intl.formatMessage({ id: 'address.complement' })}
            name="complement"
          >
            <Input
              size="large"
              placeholder={intl.formatMessage({
                id: 'address.complementPlaceholder',
              })}
            />
          </Item>
        </div>
        <div className="w-50">
          <Item
            label={intl.formatMessage({ id: 'address.district' })}
            name="district"
          >
            <Input size="large" />
          </Item>
        </div>
      </div>
      <div className="flex w-100 justify-center">
        <div className="w-60 mr2">
          <Item
            name="city"
            label={intl.formatMessage({ id: 'address.city' })}
            rules={rules.city}
          >
            <Input size="large" />
          </Item>
        </div>
        <div className="w-40">
          <Item
            name="state"
            label={intl.formatMessage({ id: 'address.state' })}
            rules={rules.state}
          >
            <Select size="large">
              {estadosPt.map(({ uf, value }) => (
                <Option key={uf} value={uf}>
                  {value}
                </Option>
              ))}
            </Select>
          </Item>
        </div>
      </div>
    </Fragment>
  )
}

export default AddressFields
