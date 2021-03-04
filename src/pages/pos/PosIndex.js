import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Tabs, message, Spin } from 'antd'
import { ShoppingCartOutlined, DollarOutlined, BookOutlined, MenuOutlined, CreditCardOutlined } from '@ant-design/icons'
import HeaderPage from '../../components/HeaderPage'
import PosDrawer from './components/PosDrawer'
import SellIndex from './components/sell/SellIndex'
import ReceivableIndex from './components/receivable/ReceivableIndex'
import DepositsIndex from './components/deposits/DepositsIndex'
import SellsListIndex from './components/sellsList/SellsListIndex'
import PosSrc from './PosSrc'
import DBService from '../../utils/DBService'

// Context
import { Context, useStore } from '../../context'

const { TabPane } = Tabs

function POS(props) {
  const [state, dispatch] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [showPosDrawer, setShowPosDrawer] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [status, setStatus] = useState(false)
  const [activeKey, setActiveKey] = useState('6')
  const [storeInfo, setStoreInfo] = useState(null)
  const [turnInfo, setTurnInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    isOpenTurn()
    // eslint-disable-next-line
  }, [])

  const isOpenTurn = () => {
    DBService.getAll('turn').then(turn => {
      if (turn.length > 0) {
        PosSrc.getStoreTurn(turn[0].turn.id).then(res => {
          if (res?.is_open === 1) {
            PosSrc.getStoreCash(res.store_id).then(response => {
              dispatch({
                type: 'TURN OPENED',
                payload: turn[0].turn,
              })
              dispatch({
                type: 'TURN STORE',
                payload: turn[0].store,
              })
              dispatch({
                type: 'TURN INFO',
                payload: turn[0].turnInfo,
              })
              dispatch({
                type: 'TURN CASH',
                payload: response.data[0],
              })
              setStoreInfo(turn[0].store)
              setTurnInfo(turn[0].turnInfo)
              setDisabled(false)
              setStatus(true)
              setActiveKey('5')
              setLoading(false)
            })
          } else {
            DBService.deleteAll('turn')
            DBService.deleteAll('sells')
            setLoading(false)
          }
        })
      } else {
        setLoading(false)
      }
    })
  }

  const showDrawer = () => {
    setShowPosDrawer(true)
  }
  const setTurn = status => {
    if (status) {
      setDisabled(false)
      setStatus(true)
      setActiveKey('5')
    } else {
      setDisabled(true)
      setStatus(false)
      setActiveKey('6')
    }
    setShowPosDrawer(false)
  }

  const infoStore = (store, turn) => {
    setStoreInfo(store)
    setTurnInfo(turn)
    PosSrc.getAllProducts(store.id, turn.id)
      .then(async products => {
        DBService.add(products.data, 'products')
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los productos.')
      })
    PosSrc.getAllClients()
      .then(response => {
        DBService.add(response.data, 'clients')
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar los clientes')
      })
    PosSrc.getAllPaymentMethods()
      .then(response => {
        DBService.add(response.data, 'paymentMethods')
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar los medios de pago')
      })
  }

  return (
    <>
      <Spin spinning={loading}>
        <HeaderPage title={'POS'} pos={true} showDrawer={showDrawer} open={status} store={storeInfo} turnInfo={turnInfo} />
        <PosDrawer
          closable={() => setShowPosDrawer(false)}
          visible={showPosDrawer}
          open={status}
          status={setTurn}
          infoStore={infoStore}
          storeId={storeInfo?.id}
          storeTurnId={turnInfo?.id}
        />
        <Tabs
          id={'tenderoPosTabs'}
          type={'card'}
          tabPosition={'left'}
          activeKey={activeKey}
          onTabClick={key => setActiveKey(key)}
          disabled={disabled}
        >
          {hasPermissions([46]) && (
            <TabPane
              tab={
                <span className="icon-tabs-pos">
                  <ShoppingCartOutlined /> Venta
                </span>
              }
              key="1"
              disabled={disabled}
            >
              <SellIndex closeTab={status => setActiveKey(status)} store={storeInfo} turn={turnInfo} />
            </TabPane>
          )}
          {hasPermissions([57]) && (
            <TabPane
              tab={
                <span className="icon-tabs-pos">
                  <BookOutlined /> Por cobrar
                </span>
              }
              key="2"
              disabled={disabled}
            >
              <ReceivableIndex activeKey={activeKey} store={storeInfo} turn={turnInfo} />
            </TabPane>
          )}
          {hasPermissions([41]) && (
            <TabPane
              tab={
                <span className="icon-tabs-pos">
                  <DollarOutlined /> Depósitos
                </span>
              }
              key="3"
              disabled={disabled}
            >
              <DepositsIndex activeKey={activeKey} storeId={storeInfo?.id} storeTurnId={turnInfo?.id} />
            </TabPane>
          )}
          {hasPermissions([45]) && (
            <TabPane
              tab={
                <span className="icon-tabs-pos">
                  <MenuOutlined /> Lista de ventas
                </span>
              }
              key="4"
              disabled={disabled}
            >
              <SellsListIndex activeKey={activeKey} store={storeInfo} />
            </TabPane>
          )}
          <TabPane key="5" disabled={true}>
            <CreditCardOutlined className={'icon-tab-disabled'} />
            <span className="text-tab-disabled">Selecciona una opción</span>
          </TabPane>
          <TabPane key="6" disabled={true}>
            <Row gutter={16} className={'section-space-field'}>
              <Col span={24} className={'empty-section-container'}>
                <div className={'empty-section'}>
                  <span className={'empty-section-message'}>Por favor inicia un turno para empezar a vender</span>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Spin>
    </>
  )
}

export default POS
