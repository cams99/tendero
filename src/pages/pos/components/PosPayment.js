import React, { useEffect, useState, useContext } from 'react'
import { Col, Row, Input, Card, message } from 'antd'
import { TagOutlined, DollarOutlined, FundOutlined, CreditCardOutlined } from '@ant-design/icons'
import UISpinner from '../../../components/UISpinner'
import PosSrc from '../PosSrc'
import DBService from '../../../utils/DBService'
import Utils from '../../../utils/Utils'
import PosPaymentModal from './PosPaymentModal'
import clientsSrc from '../../clients/clientsSrc'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Context
import { Context, useStore } from '../../../context'

const { TextArea } = Input

function PosPayment(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [method, setMethod] = useState({})
  const [receivedCash, setReceivedCash] = useState(0)
  const [total, setTotal] = useState(0)
  const [creditDescription, setCreditDescription] = useState('')
  const [otherDescription, setOtherDescription] = useState('')
  const [clientName, setClientName] = useState('')
  const [nit, setNit] = useState(null)
  const [address, setAddress] = useState(null)
  const [phone, setPhone] = useState(null)
  const [email, setEmail] = useState(null)
  const [clientsList, setClientsList] = useState([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)
  const [visible, setVisible] = useState(null)

  useEffect(() => {
    setTotal(props.total)
    fetchPaymentMethods()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (props.saveSell) {
      let validate = true
      if ([clientName, nit, phone, address, email].some(v => !v)) {
        validate = false
        message.warning('Todos los campos son obligatorios')
      }
      if (method.name === 'CASH' && Number(receivedCash) < Number(total)) {
        validate = false
        message.warning('El monto recibido es inferior al total')
      }
      if (!Utils.validateEmail(email)) {
        validate = false
        message.warning('Ingrese un email valido')
      }
      if (!Utils.validateNit(nit)) {
        validate = false
        message.warning('Ingrese un NIT valido')
      }
      if (Utils.validateNumber(phone)) {
        validate = false
        message.warning('Ingrese un Teléfono valido')
      }

      if (!validate) {
        return props.sellUnsaved && props.sellUnsaved()
      }

      let items = props.productsList.map(p => ({
        id: p.product,
        quantity: parseInt(p.units),
        unit_price: parseFloat(p.price),
        type: p.type,
      }))

      let data = {
        store_id: props.store.id,
        store_turn_id: state.turn.id,
        payment_method_id: method.id,
        description: method.name === 'CREDIT' ? creditDescription : otherDescription,
        name: clientName,
        nit: nit.toUpperCase(),
        address,
        phone,
        email,
        items,
      }

      props.closeSell(data, validate)
    } else {
      props.sellUnsaved && props.sellUnsaved()
    }
    // eslint-disable-next-line
  }, [props.saveSell])

  useEffect(() => {
    if (props.completeSell) {
      if (method.name === 'CASH' && Number(receivedCash) < Number(total)) {
        message.warning('El monto recibido es inferior al total')
        return props.sellUncompleted && props.sellUncompleted()
      }

      let data = {
        store_id: props.store.id,
        store_turn_id: state.turn.id,
        payment_method_id: method.id,
      }
      props.paySell(data, props.sellInfo.id)
    } else {
      props.sellUncompleted && props.sellUncompleted()
    }
    // eslint-disable-next-line
  }, [props.completeSell])

  useEffect(() => {
    if (props.edit) {
      setTotal(props.sellInfo.total)
      setClientName(props.sellInfo.client_name)
      setNit(props.sellInfo.nit)
      setAddress(props.sellInfo.address)
      setPhone(props.sellInfo.phone)
      setEmail(props.sellInfo.email)
    }
    // eslint-disable-next-line
  }, [props.sellInfo])

  const fetchPaymentMethods = () => {
    setLoadingPaymentMethods(true)
    PosSrc.getAllPaymentMethods()
      .then(async response => {
        if (!response) {
          let _paymentMethods = await DBService.getAll('paymentMethods')
          setPaymentMethods(_paymentMethods)
          setMethod(_paymentMethods.find(p => p.name === 'CASH'))
        } else {
          setPaymentMethods(response.data)
          setMethod(response.data.find(p => p.name === 'CASH'))
          DBService.add(response.data, 'paymentMethods')
        }
        setLoadingPaymentMethods(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar los medios de pago')
        setLoadingPaymentMethods(false)
      })
  }

  const searchByNit = e => {
    if (e.key === 'Enter' || e === 'searchButton') {
      if (!Utils.validateNit(nit)) return message.warning('Ingrese un NIT valido')
      setLoadingClients(true)

      clientsSrc
        .clientOptions({ nit })
        .then(response => {
          if (response === 'Unauthenticated.') throw new Error('Unauthenticated')
          if (!response.data || !response.data.data || response.data.data.length === 0) {
            setAddress(null)
            setPhone(null)
            setEmail(null)
            setClientName('')
            setLoadingClients(false)
            return message.warning('El NIT que ingreso no se encuentra registrado')
          }

          const { address, name, companies } = response.data.data[0]

          setAddress(address)
          setPhone(companies[0] && companies[0]?.pivot?.phone)
          setEmail(companies[0] && companies[0]?.pivot?.email)
          setClientName(name)
          setLoadingClients(false)
        })
        .catch(e => {
          console.log(e)
          message.error('No se ha podido cargar la informacion del cliente.')
          setLoadingClients(false)
        })
    }
  }

  const SearchButton = <SearchOutlined className="search-addon-after" onClick={e => searchByNit('searchButton')} />
  const LoadingSpinner = <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />

  const addClient = data => {
    setClientsList([...clientsList, data])
    setVisible(false)
  }

  const iconMethod = icon => {
    let iconCorrect
    switch (icon) {
      case 'CASH':
        iconCorrect = <DollarOutlined />
        break

      case 'CARD':
        iconCorrect = <CreditCardOutlined />
        break

      case 'CREDIT':
        iconCorrect = <TagOutlined />
        break

      default:
        iconCorrect = <FundOutlined />
        break
    }
    return iconCorrect
  }

  const cash = () => {
    return (
      <>
        <Row gutter={16}>
          <Col sm={12}>
            <div className={'title-space-field title-space-top pl-2'}>Efectivo recibido</div>
            <Input
              prefix={'Q'}
              value={receivedCash}
              onChange={e => setReceivedCash(e.target.value)}
              placeholder={'Ingresa el monto recibido'}
              size={'large'}
            />
            <div className={'title-space-field title-space-top pl-2'}>Total</div>
            <Input disabled={true} value={`Q ${Number(total).toFixed(2)}`} size={'large'} />
          </Col>
          <Col sm={12} className={'cash-change'}>
            Cambio: <span>Q {Number(receivedCash - total < 0 ? 0 : receivedCash - total).toFixed(2)}</span>
          </Col>
        </Row>
      </>
    )
  }

  const card = () => {
    return (
      <>
        <Row gutter={16}>
          <Col sm={24}>
            <div className={'title-space-field title-space-top pl-2'}>1) Haz el cobro en tu dispositivo para cobros con tarjeta.</div>
            <div className={'title-space-field title-space-top pl-2'}>2) Luego, termina la operación presionando el botón "Finalizar venta".</div>
          </Col>
        </Row>
      </>
    )
  }

  const credit = () => {
    return (
      <>
        <Row gutter={16}>
          <Col sm={24}>
            <div className={'title-space-field title-space-top pl-2'}>Datos de cobro</div>
            <TextArea onChange={e => setCreditDescription(e.target.value)} placeholder={'Descripción de crédito/vale'} size={'large'} rows={3} />
          </Col>
        </Row>
      </>
    )
  }

  const other = () => {
    return (
      <>
        <Row gutter={16}>
          <Col sm={24}>
            <Input onChange={e => setOtherDescription(e.target.value)} placeholder={'Descripción'} size={'large'} />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <PosPaymentModal visible={visible} addClient={addClient} visibleStatus={status => setVisible(status)} />
      <h4 className={'section-space-list-bottom'}>{props.edit ? 'Pago de cuenta por cobrar' : 'Cobro de producto'}</h4>
      <Row gutter={16}>
        <Col sm={12} className={loadingPaymentMethods && 'payment-methods'}>
          {loadingPaymentMethods ? (
            <UISpinner />
          ) : (
            <>
              <div className={'title-space-field title-space-top pl-2'}>Método de pago</div>
              <Row gutter={20} align={'top'}>
                {paymentMethods.map((value, id) =>
                  (value.name === 'CREDIT' && props.edit) || (value.name === 'CREDIT' && !hasPermissions([58])) ? (
                    ''
                  ) : (
                    <Col sm={8} key={id}>
                      <Card onClick={() => setMethod(value)} className={method.name === value.name && 'active'}>
                        {iconMethod(value.name)}
                        {Utils.jsUcfirst(value.name)}
                      </Card>
                    </Col>
                  )
                )}
                <Col sm={24}>
                  {method.name === 'CASH' && cash()}
                  {method.name === 'CARD' && card()}
                  {hasPermissions([58]) && method.name === 'CREDIT' && !props.edit && credit()}
                  {method.name !== 'CASH' && method.name !== 'CARD' && method.name !== 'CREDIT' && other()}
                </Col>
              </Row>
            </>
          )}
        </Col>
        <Col sm={2}>
          <div className="sell-divider"></div>
        </Col>
        <Col sm={10}>
          <Row gutter={16}>
            <div className={'title-space-field title-space-top pl-2'}>Facturación</div>
            <Col sm={24} className={'client-info'}>
              <Input
                disabled={props.edit}
                onKeyDown={searchByNit}
                addonAfter={loadingClients ? LoadingSpinner : SearchButton}
                onChange={e => setNit(e.target.value)}
                value={nit}
                placeholder={'NIT (presiona enter para buscar)'}
                size={'large'}
              />
              <Input
                disabled={props.edit}
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder={'Nombre cliente'}
                size={'large'}
              />
              <Input disabled={props.edit} value={address} onChange={e => setAddress(e.target.value)} placeholder={'Dirección'} size={'large'} />
              <Input disabled={props.edit} value={phone} onChange={e => setPhone(e.target.value)} placeholder={'Teléfono'} size={'large'} />
              <Input disabled={props.edit} value={email} onChange={e => setEmail(e.target.value)} placeholder={'Correo electrónico'} size={'large'} />
              <div className="total-bill">
                <div>
                  TOTAL A PAGAR
                  <span>Q {Number(total).toFixed(2)}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default PosPayment
