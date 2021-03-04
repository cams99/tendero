import React, { useContext } from 'react'
import { Button, Col, Row, Typography } from 'antd'
import Utils from '../utils/Utils'

// Context
import { Context, useStore } from '../context'

const { Title } = Typography

function HeaderPage(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const handlerShowDrawer = () => {
    props.showDrawer()
  }

  return (
    <Row type="flex" justify="center" align="top" className="margin-top-40">
      {!props.pos ? (
        <>
          <Col xs={24} sm={24} md={12} lg={20}>
            <Title>{props.title}</Title>
          </Col>
          <Col xs={24} sm={24} md={12} lg={{ span: 4, offset: 0 }} className="text-right">
            {hasPermissions([props.permissions]) && (props.create !== undefined ? (props.create === 1 ? true : false) : true) && props.title && (
              <Button className="title-tendero new-button" onClick={handlerShowDrawer}>
                {props.titleButton}
              </Button>
            )}
          </Col>
        </>
      ) : (
        <>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Title>{props.title}</Title>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} className="text-right">
            {props.open && (
              <Row className={'pos-store-information'}>
                <Col span={24}>
                  <span className="store-name">{props.store.name}</span>
                  <span className="store-spacer">|</span> {`${props.turnInfo.start_time.slice(0, 5)} - ${props.turnInfo.end_time.slice(0, 5)}`}
                </Col>
                <Col span={24} className={'store-payment-methods'}>
                  <div>
                    <span>Efectivo:</span> Q{' '}
                    {state.storeCash.petty_cash_amount
                      ? Utils.formatNumber(state.storeCash.petty_cash_amount)
                      : Utils.formatNumber(props?.store.petty_cash_amount)}
                  </div>
                  <div>
                    <span>Tarjeta:</span> Q 0
                  </div>
                  <div>
                    <span>Otros:</span> Q 0
                  </div>
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={24} sm={12} md={4} lg={4} className="text-right">
            {hasPermissions([45]) && (
              <Button className="title-tendero new-button" onClick={handlerShowDrawer}>
                {!props.open ? 'Iniciar turno' : 'Cerrar turno'}
              </Button>
            )}
          </Col>
        </>
      )}
    </Row>
  )
}

export default HeaderPage
