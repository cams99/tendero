import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../../../utils/Utils'

const { Option } = Select
const { Title } = Typography

function BanderaDrawer(props) {
  const [name, setName] = useState('')
  const [storeChain, setStoreChain] = useState([])
  const [storeChainId, setStoreChainId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setStoreChainId(props.edit ? props.editData.store_chain_id : null)
    onSearchStoreChain('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchStoreChain = val => {
    setLoading(true)
    Utils.getStoreChainOption(val)
      .then(response => {
        setLoading(false)
        setStoreChain(response.data.data)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        message.error('No se ha podido cargar la información de Cadena')
      })
  }

  const onSaveButton = () => {
    if (!(name && storeChainId)) {
      return message.warning('Todos los campos son obligatorios')
    }

    const data = { name, store_chain_id: storeChainId }

    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className="products-container-combo-tabs">
          <Title>{props.edit ? 'Editar Bandera' : 'Nueva Bandera'}</Title>
          <Divider className="divider-custom-margins-users" />
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre Bandera'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Cadena a la que pertenece</div>
              <Select
                showSearch
                optionFilterProp="children"
                onSearch={onSearchStoreChain}
                value={storeChainId}
                className={'single-select'}
                placeholder={'Seleccionar cadena a la que pertenece'}
                size={'large'}
                style={{ width: '100%' }}
                onChange={setStoreChainId}
              >
                {storeChain &&
                  storeChain.map(data => {
                    return (
                      <Option key={data.id} value={data.id}>
                        {data.name}
                      </Option>
                    )
                  })}
              </Select>
            </Col>
          </Row>
        </div>
        <Divider className={'divider-custom-margins-users'} />
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button type="link" className="cancel-button" onClick={() => props.cancelButton()}>
                  Cancelar
                </Button>
                <Button loading={loading} htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  )
}

export default BanderaDrawer
