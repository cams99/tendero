import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography, DatePicker } from 'antd'
import Utils from '../../../utils/Utils'
import moment from 'moment'
import clientsSrc from '../clientsSrc'

// Context
import { Context } from '../../../context'

const { Title } = Typography
const { Option } = Select

function ClientsDrawer(props) {
  const [{ auth }] = useContext(Context)
  const [name, setName] = useState('')
  const [country, setCountry] = useState(null)
  const [clientTypeID, setClientTypeID] = useState(null)
  const [nit, setNit] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [sexId, setSexId] = useState(null)
  const [birthDate, setBirthDate] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setCountry(props.edit && props.editData?.country ? props.editData.country_id : null)
    setClientTypeID(props.edit ? props.editData.type : null)
    setNit(props.edit ? props.editData.nit : '')
    setEmail(props.edit ? props.editData.email : '')
    setPhone(props.edit ? props.editData.phone : '')
    setAddress(props.edit ? props.editData.address : '')
    setSexId(props.edit ? props.editData.sex : null)
    setBirthDate(props.edit ? props.editData.birthdate : '')

    if (props.visible) {
      onSearchCountry('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchCountry = val => {
    setLoading(true)
    if (auth.role_id > 1) {
      clientsSrc
        .getCountries(auth.company.country_id)
        .then(response => {
          setCountries(response.data.data)
        })
        .catch(err => {
          console.log(err)
          message.error('No se ha podido cargar la informacion de Pais')
        })
    } else {
      Utils.getCountryOption(val)
        .then(response => {
          setCountries(response.data.data)
        })
        .catch(err => {
          console.log(err)
          message.error('No se ha podido cargar la informacion de Pais')
        })
    }
    setLoading(false)
  }

  const onSaveButton = () => {
    let validate = false
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()
    today = `${yyyy}-${mm}-${dd}`

    if (
      [name, country, clientTypeID, nit, address, sexId, birthDate, email, phone].includes('') ||
      [name, country, clientTypeID, nit, address, sexId, birthDate, email, phone].includes(null)
    ) {
      message.warning('Todos los campos son obligatorios')
    } else if (!Number(nit.slice(0, -1)) || nit.includes('.') || nit.includes('-') || nit.includes('+')) {
      message.warning('El campo NIT solo acepta valores numéricos')
    } else if (!Number(nit.slice(-1).toLowerCase()) && nit.slice(-1).toLowerCase() !== 'k') {
      message.warning('El campo NIT solo acepta la letra k')
    } else if (!Utils.validateEmail(email)) {
      message.warning('Ingresa un email valido')
    } else if (!Number(phone) || phone.includes('.') || phone.includes('-') || phone.includes('+')) {
      message.warning('El campo Telefono solo acepta valores numéricos')
    } else if (birthDate === today) {
      message.warning('La fecha de nacimiento no puede ser igual a hoy')
    } else {
      validate = true
    }

    const data = {
      name: name,
      type: clientTypeID,
      country_id: country,
      address: address,
      sex: sexId,
      birthdate: birthDate,
      nit: nit,
      email,
      phone,
    }
    if (validate) props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  const onChangeBirthDate = (date, dateString) => {
    setBirthDate(dateString)
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <div>
        <Title>{props.edit ? 'Editar Cliente' : 'Nuevo Cliente'}</Title>
        <Divider className={'divider-custom-margins-users'} />
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Nombre</div>
            <Input value={name} placeholder={'Nombre'} size={'large'} onChange={value => setName(value.target.value)} />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Pais</div>
            <Select
              showSearch
              loading={loading}
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
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              value={clientTypeID}
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              onChange={value => setClientTypeID(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={'INDIVIDUAL'}>Persona individual</Option>
              <Option value={'CORPORATION'}>Empresa</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>NIT</div>
            <Input value={nit} placeholder={'Escribir NIT'} size={'large'} onChange={value => setNit(value.target.value)} />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Email</div>
            <Input value={email} placeholder={'Escribir email'} size={'large'} type={'email'} onChange={value => setEmail(value.target.value)} />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Telefono</div>
            <Input value={phone} placeholder={'Escribir telefono'} size={'large'} onChange={value => setPhone(value.target.value)} />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Direccion</div>
            <Input value={address} placeholder={'Escribir direccion'} size={'large'} onChange={value => setAddress(value.target.value)} />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Genero</div>
            <Select
              value={sexId}
              className={'single-select'}
              placeholder={'Seleccionar genero'}
              size={'large'}
              style={{ width: '100%' }}
              onChange={value => setSexId(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={'MALE'}>Masculino</Option>
              <Option value={'FEMALE'}>Femenino</Option>
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha de nacimiento</div>
            <DatePicker
              placeHolder={'Selecciona Fecha'}
              size={'large'}
              format={'YYYY-MM-DD'}
              className={'date-picker-custom'}
              disabledDate={current => current && current > moment().endOf('day')}
              value={birthDate !== '' ? moment(birthDate, 'YYYY-MM-DD') : ''}
              onChange={onChangeBirthDate}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Reconocimiento facial</div>
            <Input size={'large'} disabled={true} />
          </Col>
        </Row>
        {/*End Fields section*/}
      </div>
      <div>
        <Divider className={'divider-custom-margins-users'} />
        {/*Footer buttons section*/}
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button onClick={props.cancelButton} type={'link'} className="cancel-button">
                  Cancelar
                </Button>

                <Button onClick={onSaveButton} className="title-tendero new-button">
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {/*End Footer buttons section*/}
    </Drawer>
  )
}

export default ClientsDrawer
