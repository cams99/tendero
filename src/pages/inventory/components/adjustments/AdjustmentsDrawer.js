import React, { useState, useEffect } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Typography } from 'antd'
import GenericSelect from '../../../../components/GenericSelect'
import InventoryList from '../InventoryList'
import Utils from '../../../../utils/Utils'
import inventorySrc from '../../inventorySrc'

const { Title } = Typography

function AdjustmentsDrawer(props) {
  const [selectedShop, setSelectedShop] = useState(null)
  const [reason, setReason] = useState('')
  const [products, setProducts] = useState([])
  const [disabled, setDisabled] = useState(true)
  const [productsList, setProductsList] = useState([])
  const [productsInventory, setProductsInventory] = useState([])
  const [productsQuantity, setProductsQuantity] = useState([{ id: 1, quantity: 0 }])

  useEffect(() => {
    if (props.visible && !Utils.isObjEmpty(productsList)) {
      let _dataSource = JSON.parse(JSON.stringify(productsList))
      _dataSource.forEach(product => {
        let inventory = products.find(p => product.product === p.product_id)
        if (inventory !== undefined) {
          product.remaining = inventory.quantity
        } else {
          product.remaining = 0
        }
      })
      setProductsInventory(_dataSource)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList])

  const onSave = () => {
    let products = productsInventory.map(product => ({
      id: product.product,
      quantity: productsQuantity.find(p => p.id === product.id).quantity,
    }))
    if (Utils.validateNull(selectedShop) || Utils.validateNull(reason) || products.some(p => Utils.validateNull(p.id) || Utils.validateNull(p.quantity))) {
      return message.warning('Todos los campos son obligatorios')
    } else if (products.some(p => Utils.validateNumber(p.quantity))) {
      return message.warning('El campo Nueva Cantidad solo acepta valores numéricos enteros')
    }

    let data = {
      store_id: selectedShop,
      description: reason,
      products,
    }
    props.closable(data, 'save')
    onCancel()
  }

  const onCancel = () => {
    setSelectedShop(null)
    setReason('')
    setProductsList([])
    setProductsInventory([])
    setDisabled(true)
    props.closable()
  }

  const getProducts = products => {
    const _products = products.map((p, i) => ({
      id: i + 1,
      product: p.product,
      quantity: p.units,
    }))

    setProductsList(_products)
  }

  const newQuantity = (e, row) => {
    let _productQuantity = JSON.parse(JSON.stringify(productsQuantity))
    if (!_productQuantity.find(p => p.id === row)) {
      _productQuantity = [..._productQuantity, { id: row, quantity: e.target.value }]
    } else {
      _productQuantity.find(p => p.id === row).quantity = e.target.value
    }
    setProductsQuantity(_productQuantity)
  }

  const getProductStore = option => {
    inventorySrc
      .getInventory(option, false)
      .then(res => {
        setProducts(setProductsStore(res))
        setProductsList([])
        if (res.data.length === 0) {
          message.warning('No existen productos para esta tienda')
        } else {
          setDisabled(false)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  const setProductsStore = products => {
    if (products !== 'Too Many Attempts.') {
      let _products = products.data || []
      return _products.map(d => ({
        id: d.product_id,
        product_id: d.product_id,
        quantity: d.quantity,
        description: d.product_description,
      }))
    } else {
      console.log('accedio el numero de consultas')
    }
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={onCancel} visible={props.visible} width={800}>
        <div>
          <Title> {'Nuevo ajuste'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <GenericSelect
                title={'¿Para qué tienda es?'}
                data={props.shopsList}
                value={selectedShop}
                handlerChange={option => {
                  setDisabled(true)
                  setSelectedShop(option)
                  getProductStore(option)
                }}
                placeholder={'Elige una tienda'}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={'title-space-field title-space-top pl-2'}>¿Cuál es la razón de este ajuste?</div>
              <Input
                value={reason}
                onChange={e => {
                  setReason(e.target.value)
                }}
                placeholder={'Escribe la razón del ajuste'}
                size={'large'}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <InventoryList
                listType={'ADJUSTMENT'}
                visible={props.visible}
                products={getProducts}
                productsInventory={productsInventory}
                newQuantity={newQuantity}
                productList={products}
                disabled={disabled}
              />
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
                    Ajustar
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

export default AdjustmentsDrawer

AdjustmentsDrawer.defaultProps = {
  loading: false,
  shopsList: [],
}
