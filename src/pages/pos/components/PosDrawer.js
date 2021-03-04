import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, Divider, Drawer, Input, Row, Typography, message, Select } from 'antd'
import GenericSelect from '../../../components/GenericSelect'
import Utils from '../../../utils/Utils'
import PosSrc from '../PosSrc'
import PosModalDeposit from './PosModalDeposit'
import DBService from '../../../utils/DBService'

// Context
import { Context } from '../../../context'

const { Option } = Select
const { Title } = Typography

function PosDrawer(props) {
  const [state, dispatch] = useContext(Context)
  const [shopsList, setShopsList] = useState([])
  const [storeTurnList, SetStoreTurnList] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [storeTurn, SetStoreTurn] = useState(null)
  const [storeCash, setStoreCash] = useState(0)
  const [confirmClose, setConfirmClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [closeLoading, setCloseLoading] = useState(false)
  const [spentCash, setSpentCash] = useState(null)
  const [spentCashInfo, setSpentCashInfo] = useState('')
  const [sellByCard, setSellByCard] = useState(null)
  const [storePos, setStorePos] = useState({})
  const [cashAvailable, setCashAvailable] = useState(null)
  const [openTurn, setOpenTurn] = useState(null)
  const [addDeposit, setAddDeposit] = useState(false)

  useEffect(() => {
    if (state.turn.is_open) {
      setOpenTurn(state.turn)
    } else {
      fetchShops()
    }
    // eslint-disable-next-line
  }, [state.turn])

  useEffect(() => {
    SetStoreTurnList([])
    SetStoreTurn(null)
    let shop = shopsList.find(shop => shop.id === selectedShop)
    setStoreCash(shop?.petty_cash_amount || 0)
    fetchStoreTurns()
    // eslint-disable-next-line
  }, [selectedShop])

  const fetchShops = () => {
    setLoading(true)
    PosSrc.getAllStores()
      .then(response => {
        setShopsList(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar tiendas')
        setLoading(false)
      })
  }

  const fetchStoreTurns = () => {
    PosSrc.getStoreTurns(selectedShop)
      .then(response => {
        SetStoreTurnList(response.data)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar tiendas')
        return false
      })
  }

  const onStart = status => {
    if (status) {
      if (selectedShop && storeTurn) {
        setCloseLoading(true)
        let data = {
          store_id: selectedShop,
          turn_id: storeTurn,
          open_petty_cash_amount: storeCash,
        }
        let store = shopsList.find(shop => shop.id === selectedShop)
        let turnInfo = storeTurnList.find(turn => turn.id === storeTurn)
        PosSrc.openStoreTurn(data)
          .then(response => {
            if (response.errors && Object.keys(response.errors).length > 0) {
              Object.keys(response.errors).forEach(key => {
                if (key === 'store_id') {
                  message.error(response.errors[key][0].replace('store_id', 'tienda'))
                } else {
                  message.error(response.errors[key])
                }
              })
            } else {
              setOpenTurn(response)
              dispatch({
                type: 'TURN OPENED',
                payload: response,
              })
              dispatch({
                type: 'TURN STORE',
                payload: store,
              })
              dispatch({
                type: 'TURN INFO',
                payload: turnInfo,
              })
              let turn = [
                {
                  turn: response,
                  store,
                  turnInfo,
                },
              ]
              DBService.add(turn, 'turn')
              props.infoStore(store, turnInfo)
              props.status(status)
            }
            setCloseLoading(false)
          })
          .catch(err => {
            console.log(err)
            message.error('No se pudo iniciar el turno')
            return false
          })
      } else {
        message.warning('Todos los campos son necesarios')
      }
    } else {
      onFinish()
    }
  }

  const onFinish = () => {
    let validate = false
    if ([spentCash, sellByCard, cashAvailable].includes('') || [spentCash, sellByCard, cashAvailable].includes(null)) {
      message.warning('Todos los campos son obligatorios')
    } else if ((!Number(spentCash) && !(spentCash >= 0)) || spentCash.includes('-') || spentCash.includes('+')) {
      message.warning('El campo ¿Cuánto hubo en gastos en efectivo que no fueron compras? solo acepta valores numéricos')
    } else if ((!Number(sellByCard) && !(sellByCard >= 0)) || sellByCard.includes('-') || sellByCard.includes('+')) {
      message.warning('El campo ¿Cuánto vendiste en tarjeta? solo acepta valores numéricos')
    } else if ((!Number(cashAvailable) && !(cashAvailable >= 0)) || cashAvailable.includes('-') || cashAvailable.includes('+')) {
      message.warning('El campo ¿Cuánto efectivo tienes en mano al cerrar el turno? solo acepta valores numéricos')
    } else {
      validate = true
    }
    if (validate) {
      DBService.getAll('sells').then(sells => {
        if (sells.length > 0) {
          saveOfflineSells(sells)
        }
      })
      setCloseLoading(true)
      let data = {
        expenses_in_not_purchases: spentCash,
        expenses_reason: spentCashInfo,
        card_sales: sellByCard,
        cash_on_hand: cashAvailable,
      }
      PosSrc.closeStoreTurn(state.turn.id, data)
        .then(response => {
          DBService.deleteAll('turn')
          setConfirmClose(true)
          setCloseLoading(false)
          message.success('El turno se ha cerrado correctamente')
          setStorePos(response)
        })
        .catch(err => {
          console.log(err)
          message.error('No se pudo cerrar el turno')
          return false
        })
    }
  }

  const saveOfflineSells = data => {
    let _data = {
      store_id: data[0].store_id,
      sells: data.map(d => ({
        seller_id: state.auth.id,
        store_turn_id: d.store_turn_id,
        payment_method_id: d.payment_method_id,
        description: d.description,
        name: d.name,
        nit: d.nit,
        phone: d.phone,
        email: d.email,
        items: d.items,
      })),
    }
    PosSrc.saveOfflineSells(_data)
      .then(response => {
        if (response) {
          DBService.deleteAll('sells')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onClose = () => {
    dispatch({ type: 'TURN' })
    props.status(false)
    setConfirmClose(false)
    SetStoreTurnList([])
    SetStoreTurn(null)
    setSelectedShop(null)
  }

  const onCancel = () => {
    SetStoreTurnList([])
    setSelectedShop(null)
    SetStoreTurn(null)
    setConfirmClose(false)
    props.closable()
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={onCancel} visible={props.visible} width={800} className={'pos-drawer'}>
        <div>
          <Title> {!props.open ? 'Iniciar turno' : 'Cierre de turno'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {!props.open ? (
            <React.Fragment>
              <Row gutter={16} className={'section-space-list'}>
                <Col sm={24}>
                  <div className={'title-space-field pl-2'}>Nombre de tienda</div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <GenericSelect
                    disabled={loading}
                    loading={loading}
                    data={shopsList}
                    handlerChange={option => setSelectedShop(option)}
                    value={selectedShop}
                    placeholder={'Elige una tienda'}
                  />
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field title-space-top'}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>Efectivo en tienda</div>
                  <Input disabled={true} value={`Q ${Utils.formatNumber(storeCash)}`} placeholder={'Efectivo en tienda'} size={'large'} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>Turno</div>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    disabled={storeTurnList?.length > 0 ? false : true}
                    loading={storeTurnList?.length > 0 ? false : true}
                    title={'Turno'}
                    value={storeTurn}
                    onChange={option => SetStoreTurn(option)}
                    placeholder={'Elige un turno'}
                    className={'single-select'}
                    size={'large'}
                    style={{ width: '100%' }}
                  >
                    {storeTurnList?.map(data => {
                      return (
                        <Option key={data.id} value={data.id}>
                          {`${data.start_time.slice(0, 5)} - ${data.end_time.slice(0, 5)}`}
                        </Option>
                      )
                    })}
                  </Select>
                </Col>
              </Row>
            </React.Fragment>
          ) : !confirmClose ? (
            <React.Fragment>
              <Row gutter={16} className={'section-space-list'}>
                <h4 className={'section-space-list-bottom pl-2'}>
                  {state.store.name} | {`${state.turnInfo.start_time.slice(0, 5)} - ${state.turnInfo.end_time.slice(0, 5)}`}
                </h4>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>¿Cuánto hubo en gastos en efectivo que no fueron compras?</div>
                  <Input placeholder={'Escribe la cantidad'} onChange={e => setSpentCash(e.target.value)} size={'large'} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>¿De qué fueron esos gastos?</div>
                  <Input placeholder={'Escribe una breve explicacion'} onChange={e => setSpentCashInfo(e.target.value)} size={'large'} />
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'} align="bottom">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>¿Cuánto vendiste en tarjeta?</div>
                  <Input placeholder={'Escribe la cantidad'} onChange={e => setSellByCard(e.target.value)} size={'large'} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field pl-2'}>¿Cuánto efectivo tienes en mano al cerrar el turno?</div>
                  <Input placeholder={'Escribe la cantidad'} onChange={e => setCashAvailable(e.target.value)} size={'large'} />
                </Col>
              </Row>
            </React.Fragment>
          ) : (
            <Row gutter={16}>
              <Col sm={11}>
                <h4 className={'section-space-list-bottom title-space-top'}>Cuadre en tarjeta</h4>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={18}>Venta en tarjeta según cierre</Col>
                  <Col sm={6} className={'total-quantity'}>
                    Q.{sellByCard}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={18}>Venta en tarjeta según POS</Col>
                  <Col sm={6} className={'total-quantity'}>
                    Q.{storePos.card_sales_pos}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col offset={18} sm={6} className={Number(sellByCard) === Number(storePos.card_sales_pos) ? 'total-quantity isOk' : 'total-quantity isnotOk'}>
                    {Number(sellByCard) === Number(storePos.card_sales_pos) ? 'Cuadrado' : 'No cuadra'}
                  </Col>
                </Row>
              </Col>
              <Col sm={1}>
                <div className="sell-divider"></div>
              </Col>
              <Col sm={12}>
                <h4 className={'section-space-list-bottom title-space-top'}>Cuadre en circulante</h4>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Turno empezó con</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.open_petty_cash_amount}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Gastado en compras</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.expenses_in_purchases}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Gastado en gastos (no compras)</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.expenses_in_not_purchases}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Depositado</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.deposits_total}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Vendido en efectivo</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.cash_sales}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Cobrado de cuentas por cobrar</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.cash_collected_in_receivables}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col sm={16}>Ajustes realizados</Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.cash_adjustments_total}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom final-section'}>
                  <Col offset={3} sm={13}>
                    Deberias tener
                  </Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.closed_petty_cash_amount}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col offset={3} sm={13}>
                    Tienes en tienda
                  </Col>
                  <Col sm={8} className={'total-quantity'}>
                    Q.{storePos.cash_on_hand}
                  </Col>
                </Row>
                <Row gutter={16} className={'section-space-list-bottom'}>
                  <Col
                    offset={16}
                    sm={8}
                    className={Number(storePos.closed_petty_cash_amount) === Number(storePos.cash_on_hand) ? 'total-quantity isOk' : 'total-quantity isnotOk'}
                  >
                    {Number(storePos.closed_petty_cash_amount) === Number(storePos.cash_on_hand) ? 'Cuadrado' : 'No cuadra'}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </div>
        <div>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="text-right">
                <div>
                  {!confirmClose && (
                    <Button type={'link'} className="cancel-button" onClick={() => onCancel()}>
                      Cancelar
                    </Button>
                  )}
                  {!confirmClose ? (
                    <Button
                      loading={closeLoading}
                      htmlType="submit"
                      className="title-tendero new-button"
                      onClick={!props.open ? () => onStart(true) : () => onStart(false)}
                    >
                      {!props.open ? 'Iniciar' : 'Confirmar datos'}
                    </Button>
                  ) : (
                    <Button htmlType="submit" className="title-tendero new-button" onClick={onClose}>
                      Finalizar
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Drawer>
      <PosModalDeposit storeId={props.storeId} storeTurnId={openTurn?.id} visible={addDeposit} onClose={() => setAddDeposit(false)} />
    </>
  )
}

export default PosDrawer
