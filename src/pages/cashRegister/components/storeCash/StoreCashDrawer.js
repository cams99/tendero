import React, { useState, useContext } from 'react'
import { Button, Col, Divider, Drawer, Input, Row, Typography } from 'antd'

//Context
import { Context } from '../../../../context'

const { Title } = Typography

function StoreCashDrawe(props) {
  const [{ turn }] = useContext(Context)
  const [storeCash, setStoreCash] = useState(null)
  const [reason, setReason] = useState('')

  const onAdjust = () => {
    let data = {
      store_id: props.adjust.id,
      store_turn_id: turn.id,
      amount: storeCash - props.adjust.store_cash,
      description: reason,
    }
    props.closable(data, 'save')
  }

  const onCancel = () => {
    props.closable()
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div>
          <Title>Ajuste de efectivo</Title>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16} className={'section-space-list'}>
            <Col sm={12}>
              <div className={'title-space-field title-space-top pl-2'}>Efectivo actual en tienda</div>
              <Input value={`Q ${props.adjust.store_cash}`} disabled={true} size={'large'} />
            </Col>
            <Col sm={12}>
              <div className={'title-space-field title-space-top pl-2'}>¿Cuánto efectivo tiene realmente la tienda?</div>
              <Input onChange={e => setStoreCash(e.target.value)} size={'large'} placeholder="Escribe el total del efectivo en tienda" />
            </Col>
            <Col sm={24}>
              <div className={'title-space-field title-space-top pl-2'}>¿Por qué se esta ajustando el efectivo?</div>
              <Input onChange={e => setReason(e.target.value)} size={'large'} placeholder="Escribe la razon por la cual se hace el ajuste" />
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
                  <Button htmlType="submit" className="title-tendero new-button" onClick={onAdjust}>
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

export default StoreCashDrawe
