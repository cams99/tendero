import React from 'react'
import { Col, Row } from 'antd'
import DepositsTable from './DepositsTable'

function DepositsIndex(props) {
  return (
    <>
      <Row gutter={16} className={'sell-row'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <DepositsTable activeKey={props.activeKey} storeTurnId={props.storeTurnId} storeId={props.storeId} />
        </Col>
      </Row>
    </>
  )
}

export default DepositsIndex
