import React, { useState, useContext, useEffect } from 'react'
import { Button, Col, Divider, Drawer, Row, Typography, message, Table } from 'antd'
import GenericSelect from '../../../../components/GenericSelect'
import InventoryList from '../InventoryList'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'
import { Context } from '../../../../context'
import moment from 'moment'

const { Title } = Typography

function CountsDrawer(props) {
  const [selectedShop, setSelectedShop] = useState(null)
  const [isSummary, setIsSummary] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [productsList, setProductsList] = useState([])
  const [productsInfo, setProductsInfo] = useState([])
  const [loading, setLoading] = useState(false)

  const [{ auth }] = useContext(Context)

  useEffect(() => {
    if (props.fetchData) {
      setSelectedShop([])
      setProductsList([])
    }
  }, [props.fetchData])

  const columns = [
    {
      title: 'Productos',
      dataIndex: 'product', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Contado',
      dataIndex: 'count', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'En inventario',
      dataIndex: 'inventory', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Diferencia',
      dataIndex: 'diff', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
  ]

  const onSave = () => {
    if (Utils.validateNull(selectedShop) || productsList.some(p => Utils.validateNull(p.product) || Utils.validateNull(p.quantity))) {
      return message.warning('Todos los campos son obligatorios')
    } else if (productsList.some(p => Utils.validateNumber(p.quantity))) {
      return message.warning('El campo Nueva Cantidad solo acepta valores numéricos enteros')
    }
    setLoading(true)
    setIsSummary(true)
    inventorySrc
      .getInventory(selectedShop)
      .then(inventory => {
        setDataSource(setDataCount(setInventory(inventory)))
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la información, Intente nuevamente')
        setLoading(false)
      })
  }

  const onCancel = () => {
    setSelectedShop([])
    setProductsList([])
    props.closable()
  }

  const onAdjust = isAdjust => {
    if (isAdjust) {
      let products = dataSource.map(p => ({
        id: p.key,
        quantity: p.count,
      }))
      let token = JSON.parse(localStorage.getItem('TenderoApp')).token.access_token
      let user_id = auth.id ? auth.id : Utils.parseJwt(token).sub
      let date = moment().format().slice(0, 10)
      let data = {
        created_by: user_id,
        store_id: selectedShop,
        status: 'OPEN',
        count_date: date,
        products,
      }
      props.closable(data, 'save')
    }
    setIsSummary(false)
  }

  const getProducts = products => {
    let _products = products.map((p, i) => ({
      id: i + 1,
      product: p.product,
      quantity: p.units,
    }))
    setProductsList(_products)
  }

  const getProductsInfo = products => {
    let _products = products?.map(p => ({
      id: p.id,
      name: p.description,
    }))
    setProductsInfo(_products)
  }

  const setInventory = inventory => {
    if (inventory !== 'Too Many Attempts.') {
      let _inventory = inventory.data.data || []
      return _inventory.map(d => ({
        product_id: d.product_id,
        name: d.product_description,
        quantity: d.quantity,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const setDataCount = inventory => {
    return productsList.map(product => {
      let inventoryQuantity = inventory.find(p => product.product === p.product_id) || 0
      let productInfo = productsInfo.find(p => product.product === p.id)
      let diff = product.quantity - (inventoryQuantity.quantity || 0)
      if (diff > 0) diff = `+${diff}`
      return {
        key: productInfo.id,
        product: productInfo.name,
        count: product.quantity,
        inventory: inventoryQuantity.quantity || 0,
        diff,
      }
    })
  }

  return (
    <Drawer placement="right" closable={false} onClose={onCancel} visible={props.visible} width={800}>
      {isSummary ? (
        <>
          <div>
            <Title> {'Resumen de conteo'} </Title>
            <Divider className={'divider-custom-margins-users'} />
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  className={'CustomTableClass'}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  loading={loading}
                  rowKey={(record, index) => index}
                />
              </Col>
            </Row>
          </div>
          <div>
            <Divider className={'divider-custom-margins-users'} />
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="text-right d-flex justify-end align-center">
                  <span className={'mr-3'}>¿Deseas ajustar tu inventario?</span>
                  <div>
                    <Button
                      type={'link'}
                      className="title-tendero new-button no-ajustar-btn product-margin-header-button"
                      onClick={() => onAdjust(false)}
                    >
                      No ajustar
                    </Button>
                    <Button htmlType="submit" className="title-tendero new-button" onClick={() => onAdjust(true)}>
                      Ajustar
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div>
            <Title> {'Nuevo conteo'} </Title>
            <Divider className={'divider-custom-margins-users'} />
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <GenericSelect
                  title={'¿Para qué tienda es?'}
                  data={props.shopsList}
                  value={selectedShop}
                  handlerChange={option => {
                    setSelectedShop(option)
                  }}
                  placeholder={'Elige una tienda'}
                />
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-list'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <InventoryList listType={'COUNT'} visible={props.visible} products={getProducts} productsInfo={getProductsInfo} />
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
                      Guardar y continuar
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Drawer>
  )
}

export default CountsDrawer

CountsDrawer.defaultProps = {
  shopsList: [],
  loading: false,
}
