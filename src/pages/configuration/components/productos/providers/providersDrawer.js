import React, { useEffect, useState } from 'react'
import Utils from '../../../../../utils/Utils'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
const { Option } = Select
const { Title } = Typography
function ProvidersDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')
  const [nit, setNit] = useState('')
  const [countryId, setCountryId] = useState(null)
  const [loading, setLoading] = useState(false)
  /*SELECT INFO*/
  const [countries, setCountries] = useState([])

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setNit(props.edit ? props.editData.nit : '')
    setCountryId(props.edit ? props.editData.country_id : null)

    if (props.edit && props.visible) {
      onSearchCountry('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchCountry('')
  }, [])

  /*HANDLERS*/
  const onSearchCountry = val => {
    setLoading(true)
    Utils.getCountryOption(val)
      .then(response => {
        setCountries(response.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSaveButton = () => {
    if ([name, nit, countryId].includes('') || [name, nit, countryId].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    } else if (!Number(nit.slice(0, -1)) || nit.includes('.') || nit.includes('-') || nit.includes('+')) {
      message.warning('El campo NIT solo acepta valores numéricos')
    } else if (!Number(nit.slice(-1).toLowerCase()) && nit.slice(-1).toLowerCase() !== 'k') {
      message.warning('El campo NIT solo acepta la letra k')
    }
    const data = {
      name: name,
      country_id: countryId,
      nit: nit,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar proveedor' : 'Nuevo proveedor'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre proveedor'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>NIT</div>
              <Input value={nit} onChange={value => setNit(value.target.value)} placeholder={'Escribir NIT'} size={'large'} />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>País al que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={countryId}
                onChange={value => setCountryId(value)}
                placeholder={'Selecciona país al que pertenece'}
                onSearch={onSearchCountry}
                size={'large'}
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
          </Row>
          {/*End Fields section*/}
        </div>
        <Divider className={'divider-custom-margins-users'} />
        {/*Footer buttons section*/}
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button type={'link'} className="cancel-button" onClick={() => props.cancelButton()}>
                  Cancelar
                </Button>
                <Button htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        {/*End Footer buttons section*/}
      </Drawer>
    </>
  )
}

export default ProvidersDrawer
