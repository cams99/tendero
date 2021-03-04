import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'

import Utils from '../../../../../utils/Utils'

const { Option } = Select

const { Title } = Typography

function PaisDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')
  const [currencyId, setCurrencyId] = useState(null)
  /*SELECT INFO*/
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setCurrencyId(props.edit ? props.editData.currency_id : null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchCurrency('')
  }, [])

  /*HANDLERS*/
  const onSearchCurrency = val => {
    Utils.getCurrenciesOption(val)
      .then(response => {
        setCurrencies(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSaveButton = () => {
    if ([name, currencyId].includes('') || [name, currencyId].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
      currency_id: currencyId,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar País' : 'Nuevo País'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre País'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Moneda</div>
              <Select
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={currencyId}
                onChange={value => setCurrencyId(value)}
                placeholder={'Seleccionar moneda'}
                size={'large'}
                onSearch={onSearchCurrency}
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

export default PaisDrawer
