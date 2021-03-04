import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Typography } from 'antd'
import Utils from '../../../../utils/Utils'
import GenericSelect from '../../../../components/GenericSelect'
import InventoryList from '../InventoryList'
import inventorySrc from '../../inventorySrc'

const { Title } = Typography

function PurchasesDrawer(props) {
  const [selectedShop, setSelectedShop] = useState(null)
  const [total, setTotal] = useState('')
  const [billNumber, setBillNumber] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [providersList, setProvidersList] = useState([
    { id: 1, name: 'proveedor 1' },
    { id: 2, name: 'proveedor 2' },
  ])
  const [provider, setProvider] = useState(null)
  const [paymentMethodsList, setPaymentMethodsList] = useState([])
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [productsList, setProductsList] = useState([])

  useEffect(() => {
    inventorySrc
      .getAllPaymentMethods()
      .then(response => {
        setPaymentMethodsList(response.data)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al cargar metodos de pago')
      })

    inventorySrc
      .getAllProviders()
      .then(response => {
        setProvidersList(response.data)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al cargar los proveedores')
      })
  }, [])

  const onSave = () => {
    let data = {
      provider_id: provider,
      store_id: selectedShop,
      invoice: billNumber,
      serial_number: serialNumber,
      payment_method_id: paymentMethod,
      presentations: productsList,
    }
    let totalList = 0
    productsList.map(product => (totalList += product.quantity * product.unit_price))
    if (provider === null || selectedShop === null || billNumber === '' || serialNumber === '' || paymentMethod === null || total === '') {
      return message.warning('Todos los campos son obligatorios')
    } else if (totalList !== Number(total)) {
      return message.warning('La suma de los costos por producto no cuadra con el monto total de la compra')
    }
    props.closable(data, 'save')
  }

  const onEdit = () => {
    let data = [
      props.edit.id,
      {
        provider_id: provider,
        store_id: selectedShop,
        invoice: billNumber,
        serial_number: serialNumber,
        payment_method_id: paymentMethod,
      },
    ]
    if (provider === null || selectedShop === null || billNumber === '' || serialNumber === '' || paymentMethod === null) {
      return message.warning('Todos los campos son obligatorios')
    }
    props.closable(data, 'edit')
  }

  const getProducts = products => {
    let _products = products.map(p => ({
      id: p.product,
      quantity: p.units,
      unit_price: p.price,
    }))
    setProductsList(_products)
  }

  const onCancel = () => {
    props.closable()
  }

  const clear = () => {
    setSelectedShop(null)
    setBillNumber('')
    setSerialNumber('')
    setProvider(null)
    setPaymentMethod(null)
    setTotal('')
  }

  useEffect(() => {
    clear()
    if (props.visible && !Utils.isObjEmpty(props.edit)) {
      // TODO: Setear esta info en el dataSource de la tabla para despues consumirlo aqui
      setSelectedShop(props.edit?.store_id)
      setBillNumber(props.edit?.invoice)
      setSerialNumber(props.edit?.serial_number)
      setProvider(props.edit?.provider_id)
      setPaymentMethod(props.edit?.payment_method_id)
      let listTotal = 0
      props.edit.purchase_details.map(product => listTotal += Number(product.total))
      setTotal(listTotal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, props.edit])

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div>
          <Title> {Utils.isObjEmpty(props.edit) ? 'Nueva Compra' : 'Editar Compra'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field pl-2'}>¿Para qué tienda es?</div>
              <GenericSelect
                data={props.shopsList}
                value={selectedShop}
                handlerChange={option => {
                  setSelectedShop(option)
                }}
                placeholder={'Elige una tienda'}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field pl-2'}>Monto total de la compra</div>
              <Input
                disabled={!Utils.isObjEmpty(props.edit)}
                value={total}
                onChange={e => setTotal(e.target.value)}
                placeholder={'Escribir el monto total de la compra'}
                size={'large'}
                type="number"
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field title-space-top'}>
            <Col xs={6} sm={6} md={6} lg={6}>
              <div className={'title-space-field pl-2'}>No. Factura</div>
              <Input
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                placeholder={'Escribir No. Factura'}
                size={'large'}
                type="number"
              />
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <div className={'title-space-field pl-2'}>No. Serie</div>
              <Input
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder={'Escribir No. Serie'}
                size={'large'}
                type="number"
              />
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <GenericSelect
                title={'Proveedor'}
                data={providersList}
                value={provider}
                handlerChange={option => {
                  setProvider(option)
                }}
                placeholder={'Elige un proveedor'}
              />
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <GenericSelect
                title={'Método de pago'}
                data={paymentMethodsList}
                value={paymentMethod}
                handlerChange={option => {
                  setPaymentMethod(option)
                }}
                placeholder={'Elegir un método'}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <InventoryList listType={'ENTRY'} visible={props.visible} edit={props.edit} products={getProducts} total={total} />
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
                  <Button
                    htmlType="submit"
                    className="title-tendero new-button"
                    onClick={props.visible && !Utils.isObjEmpty(props.edit) ? () => onEdit() : () => onSave()}
                  >
                    {props.visible && !Utils.isObjEmpty(props.edit) ? 'Editar' : 'Guardar'}
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

export default PurchasesDrawer

PurchasesDrawer.defaultProps = {
  edit: {},
  shopsList: [],
}
