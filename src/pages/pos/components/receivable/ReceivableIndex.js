import React, { useState, useContext } from 'react'
import { Col, Row, Button, Divider, message } from 'antd'
import ReceivableTable from './ReceivableTable'
import PosPayment from '../PosPayment'
import PosSrc from '../../PosSrc'

// Context
import { Context } from '../../../../context'

function ReceivableIndex(props) {
  // eslint-disable-next-line
  const [_, dispatch] = useContext(Context)
  const [payStatus, setPayStatus] = useState(false)
  const [completeSell, setCompleteSell] = useState(false)
  const [sellInfo, setSellInfo] = useState([])
  const [loadingSell, setLoadingSell] = useState(false)

  const payInfo = row => {
    setSellInfo(row)
    setPayStatus(true)
  }

  const paySell = (data, sellId) => {
    setCompleteSell(false)
    setLoadingSell(true)
    PosSrc.completeSell(sellId, data)
      .then(response => {
        message.success('Se ha guardado el pago exitosamente')
        getCash(response.sell.store_id)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido guardar el pago')
        setLoadingSell(false)
      })
  }

  const getCash = id => {
    PosSrc.getStoreCash(id).then(response => {
      dispatch({
        type: 'TURN CASH',
        payload: response.data[0],
      })
      setLoadingSell(false)
      setPayStatus(false)
    })
  }

  return (
    <>
      <Row gutter={16} className={'sell-row'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {!payStatus ? (
            <ReceivableTable activeKey={props.activeKey} completeSell={completeSell} pay={payInfo} store={props.store} />
          ) : (
            <PosPayment
              edit={true}
              sellUncompleted={_ => setCompleteSell(false)}
              sellInfo={sellInfo}
              completeSell={completeSell}
              store={props.store}
              turn={props.turn}
              paySell={paySell}
            />
          )}
        </Col>
        {payStatus && (
          <>
            <Divider className={'divider-custom-margins-users'} />
            <Col sm={24}>
              <div className="pay-buttons">
                <Button type={'link'} className="cancel-button" onClick={() => setPayStatus(false)}>
                  Cancelar
                </Button>
                <Button loading={loadingSell} htmlType="submit" className="title-tendero new-button" onClick={() => setCompleteSell(true)}>
                  Finalizar pago
                </Button>
              </div>
            </Col>
          </>
        )}
      </Row>
    </>
  )
}

export default ReceivableIndex
