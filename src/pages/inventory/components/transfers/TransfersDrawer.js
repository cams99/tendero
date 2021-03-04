import React, { useState, useEffect } from 'react'
import { Button, Col, Divider, Drawer, message, Row, Typography } from 'antd'
import GenericSelect from '../../../../components/GenericSelect'
import InventoryList from '../InventoryList'
import UISpinner from '../../../../components/UISpinner'

const { Title } = Typography

function TransfersDrawer(props) {
  const [selectedOriginShop, setSelectedOriginShop] = useState(null)
  const [selectedDestinyShop, setSelectedDestinyShop] = useState(null)
  const [productsList, setProductsList] = useState([])

  useEffect(() => {
    clear()
  }, [props.visible])

  const clear = () => {
    setSelectedOriginShop(null)
    setSelectedDestinyShop(null)
  }

  const onSave = () => {
    let validate = false
    if (selectedOriginShop && selectedDestinyShop) {
      validate = true
    } else {
      message.warning("Todos los campos son necesarios")
    }
    let data = {
      origin_store_id: selectedOriginShop,
      destiny_store_id: selectedDestinyShop,
      presentations: productsList,
    }
    if (validate) props.closable(data, 'save')
  }

  const validateOption = option => {
    if (selectedOriginShop === option) {
      setSelectedDestinyShop(null)
    }
  }

  const onCancel = () => {
    props.closable()
  }

  const getProducts = products => {
    let _products = products.map(p => ({
      id: p.product,
      quantity: p.units,
    }))
    setProductsList(_products)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        {props.loading && (
          <div className="loading-spinner">
            <UISpinner />
          </div>
        )}
        <div>
          <Title> {'Nueva transferencia'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <GenericSelect
                title={'¿Cuál es la tienda origen?'}
                data={props.shopsList}
                value={selectedOriginShop}
                handlerChange={option => {
                  setSelectedOriginShop(option)
                }}
                placeholder={'Elige una tienda'}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <GenericSelect
                title={'¿Hacia qué tienda se mueve el inventario?'}
                data={props.shopsList}
                value={selectedDestinyShop}
                handlerChange={option => {
                  setSelectedDestinyShop(option)
                  validateOption(option)
                }}
                placeholder={'Elige una tienda'}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <InventoryList listType={'TRANSFER'} visible={props.visible} products={getProducts} />
            </Col>
          </Row>
        </div>
        <div>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="text-right">
                <div>
                  <Button type={'link'} className="cancel-button" onClick={() => onCancel()}>
                    Cancelar
                  </Button>
                  <Button htmlType="submit" className="title-tendero new-button" onClick={() => onSave()}>
                    Transferir
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  )
}

export default TransfersDrawer

TransfersDrawer.defaultProps = {
  shopsList: [],
  loading: false,
}
