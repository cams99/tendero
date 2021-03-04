import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Divider, Drawer, Input, Radio, Row, Select, Typography, message } from 'antd'
import Utils from '../../../utils/Utils'

// Context
import { Context } from '../../../context'

const { Title } = Typography
const { Option } = Select

function EnterpriseDrawer(props) {
  const [{ auth }] = useContext(Context)
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [regime, setRegime] = useState('')
  const [nit, setNit] = useState(null)
  const [phone, setPhone] = useState(null)
  const [country, setCountry] = useState(null)
  const [currency, setCurrency] = useState(null)
  const [address, setAddress] = useState('')
  const [allowCreateProducts, setAllowCreateProducts] = useState(false)
  const [allowCreateShops, setAllowCreateShops] = useState(false)
  const [allowCreateUsers, setAllowCreateUsers] = useState(false)
  const [allowElectronicInvoice, setAllowElectronicInvoice] = useState(false)

  const [countries, setCountries] = useState(null)
  const [currencies, setCurrencies] = useState(null)

  const loadInformation = () => {
    setName(props.edit ? props.editData.name : '')
    setBusinessName(props.edit ? props.editData.reason : '')
    setRegime(props.edit ? props.editData.regime : '')
    setNit(props.edit ? props.editData.nit : null)
    setPhone(props.edit ? props.editData.phone : null)
    setAddress(props.edit ? props.editData.address : '')
    setCountry(props.edit ? props.editData.pais_id : null)
    setCurrency(props.edit ? props.editData.currency_id : null)

    setAllowCreateProducts(props.edit ? props.editData.allow_add_products !== 0 : false)
    setAllowCreateShops(props.edit ? props.editData.allow_add_stores !== 0 : false)
    setAllowCreateUsers(props.edit ? props.editData.uses_fel !== 0 : false)
    setAllowElectronicInvoice(props.edit ? props.editData.is_electronic_invoice !== 0 : false)
  }

  useEffect(() => {
    loadInformation()

    if (props.visible) {
      onSearchCountry(props.edit ? props.editData.pais : '')
      onSearchCurrency(props.edit ? props.editData.currency_name : '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let data = {
      name: validateParams(name, 'Nombre') ? name : undefined,
      reason: validateParams(businessName, 'Razon social') ? businessName : undefined,
      regime,
      nit: validateParams(nit, 'NIT', false, 'nit') ? nit : undefined,
      phone: validateParams(phone, 'Telefono', false, 'phone') ? phone : undefined,
      address: validateParams(address, 'Direccion') ? address : undefined,
      country_id: validateParams(country, 'Pais') ? country : undefined,
      currency_id: validateParams(currency, 'Moneda') ? currency : undefined,
      allow_add_products: allowCreateProducts ? 1 : 0,
      allow_add_stores: allowCreateShops ? 1 : 0,
      allow_fel: allowElectronicInvoice ? 1 : 0,
      allow_add_users: allowCreateUsers ? 1 : 0,
      company_id: props.edit ? props.editData.company_id : 0,
    }

    let boolValidate = true
    for (let k in data) {
      if (boolValidate) {
        if (k !== 'regime') {
          const d = data[k]
          d === '' || d === undefined || d === null ? (boolValidate = false) : (boolValidate = true)
        }
      }
    }
    if (boolValidate) {
      props.saveButton(data, props.edit)
    }
  }

  const validateParams = (val, strMessage, boolInteger = false, nitMessage) => {
    if (val === '' || val === null) {
      if (boolInteger) {
        return !Number.isInteger(val * 1) || val * 1 <= 0 ? message.warning(strMessage) : true
      }
      return message.warning(`El campo ${strMessage} no debe estar vacio`)
    } else if (nitMessage === 'nit') {
      if (!Number(nit.slice(0, -1)) || nit.includes('.') || nit.includes('-') || nit.includes('+')) {
        message.warning('El campo NIT solo acepta valores alfanuméricos')
        return false
      } else if (!Number(nit.slice(-1).toLowerCase()) && nit.slice(-1).toLowerCase() !== 'k') {
        message.warning('El campo NIT solo acepta la letra k')
        return false
      } else {
        return true
      }
    } else if (nitMessage === 'phone') {
      if (Utils.validateNumber(phone)) {
        message.warning('El campo Telefono solo acepta valores numéricos')
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const onSearchCountry = val => {
    const strSearch = val === null || val === '' ? '' : val
    Utils.getCountryOption(strSearch)
      .then(response => {
        setCountries(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchCurrency = val => {
    Utils.getCurrenciesOption(val)
      .then(response => {
        setCurrencies(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Moneda')
      })
  }

  return (
    <Drawer className={'entreprise-drawer'} placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <Row gutter={16}>
        <Title> {props.edit ? 'Editar Empresa' : 'Nueva Empresa'} </Title>
        <Divider className={'divider-custom-margins-users'} />
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nombre</div>
            <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre'} size={'large'} />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Razon Social*</div>
            <Input
              value={businessName}
              onChange={value => setBusinessName(value.target.value)}
              placeholder={'Escribe la razon social'}
              size={'large'}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Régimen</div>
            <Input value={regime} onChange={value => setRegime(value.target.value)} placeholder={'Escribe el régimen'} size={'large'} />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>NIT*</div>
            <Input value={nit} onChange={value => setNit(value.target.value)} placeholder={'Escribir NIT'} size={'large'} />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Telefono*</div>
            <Input value={phone} onChange={value => setPhone(value.target.value)} placeholder={'Escribir telefono'} size={'large'} />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Pais*</div>
            <Select
              showSearch
              optionFilterProp="children"
              className={'single-select'}
              placeholder={'Elegir Pais'}
              size={'large'}
              style={{ width: '100%' }}
              value={country}
              onChange={value => setCountry(value)}
              onSearch={onSearchCountry}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {countries &&
                countries.map(data => {
                  return (
                    <Option key={data.id} value={data.id}>
                      {data.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Moneda*</div>
            <Select
              showSearch
              optionFilterProp="children"
              className={'single-select'}
              placeholder={'Elegir Moneda'}
              size={'large'}
              style={{ width: '100%' }}
              value={currency}
              onChange={value => setCurrency(value)}
              onSearch={onSearchCurrency}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {currencies &&
                currencies.map(data => {
                  return (
                    <Option key={data.id} value={data.id}>
                      {data.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Direccion*</div>
            <Input value={address} onChange={value => setAddress(value.target.value)} placeholder={'Escribir direccion'} size={'large'} />
          </Col>
        </Row>

        {/*End Fields section*/}

        {/*Radio button section*/}
        {!(auth.role_id > 1) && (
          <>
            <Row gutter={16} className={'section-space-list'}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className={'label-bold-500 ratio-button-labels'}>¿Podrá crear sus propios productos y presentaciones?</span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Radio.Group
                  className={'radio-group'}
                  optionType="button"
                  buttonStyle="solid"
                  size={'large'}
                  value={allowCreateProducts}
                  onChange={value => setAllowCreateProducts(value.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Si</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-list'}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className={'label-bold-500 ratio-button-labels'}>¿Podrá crear propias tiendas?</span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Radio.Group
                  className={'radio-group'}
                  optionType="button"
                  buttonStyle="solid"
                  size={'large'}
                  value={allowCreateShops}
                  onChange={value => setAllowCreateShops(value.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Si</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-list'}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className={'label-bold-500 ratio-button-labels'}>¿Podrá crear sus propios usuarios?</span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Radio.Group
                  className={'radio-group'}
                  optionType="button"
                  buttonStyle="solid"
                  size={'large'}
                  value={allowCreateUsers}
                  onChange={value => setAllowCreateUsers(value.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Si</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-list'}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <span className={'label-bold-500 ratio-button-labels'}>¿Facturara de forma electronica?</span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Radio.Group
                  disabled={props.edit && allowElectronicInvoice}
                  className={'radio-group'}
                  optionType="button"
                  buttonStyle="solid"
                  size={'large'}
                  value={allowElectronicInvoice}
                  onChange={value => setAllowElectronicInvoice(value.target.value)}
                >
                  <Radio.Button value={false}>No</Radio.Button>
                  <Radio.Button value={true}>Si</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          </>
        )}
        {/*End Radio button section*/}
      </Row>

      {/*Footer buttons section*/}
      <Row gutter={16}>
        <Divider className={'divider-custom-margins-users'} />
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button type={'link'} className="cancel-button" onClick={() => props.cancelButton()}>
                Cancelar
              </Button>
              <Button htmlType="submit" className="title-tendero new-button" onClick={() => saveData()}>
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      {/*End Footer buttons section*/}
    </Drawer>
  )
}

export default EnterpriseDrawer
