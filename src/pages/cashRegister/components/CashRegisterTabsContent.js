import React from 'react'
import { Col, Row } from 'antd'

const CashRegisterTabsContent = ({ fetch, adjust, turn, shopsList, search, fetchData, loading, onAdjust, selectedOption, component: TabContentComponent }) => (
  <Row gutter={16} className={'section-space-field'}>
    {selectedOption ? (
      !adjust ? (
        <Col span={24} className={'margin-top-15'}>
          {<TabContentComponent shopsList={shopsList} fetchData={fetchData} loading={loading} onAdjust={onAdjust} selectedOption={selectedOption} />}
        </Col>
      ) : turn?.is_open ? (
        <Col span={24} className={'margin-top-15'}>
          {<TabContentComponent fetch={fetch} shopsList={shopsList} fetchData={fetchData} loading={loading} onAdjust={onAdjust} selectedOption={selectedOption} />}
        </Col>
      ) : (
        <Col span={24} className={'empty-section-container'}>
          <div className={'empty-section'}>
            <span className={'empty-section-message'}>Por favor abre el turno en la seccion POS</span>
          </div>
        </Col>
      )
    ) : (
      <Col span={24} className={'empty-section-container'}>
        <div className={'empty-section'}>
          {!adjust ? (
            <span className={'empty-section-message'}>Por favor selecciona una tienda o realiza una busqueda</span>
          ) : turn?.is_open ? (
            <span className={'empty-section-message'}>Por favor selecciona una tienda</span>
          ) : (
            <span className={'empty-section-message'}>Por favor abre el turno en la seccion POS</span>
          )}
        </div>
      </Col>
    )}
  </Row>
)

export default CashRegisterTabsContent
