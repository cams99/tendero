import React from 'react'
import { Col, Row } from 'antd'

const InventoryTabsContent = ({ keyTab, fetchData, loading, onEdit, selectedOption, component: TabContentComponent }) => (
  <Row gutter={16} className={'section-space-field'}>
    {selectedOption ? (
      <Col span={24} className={'margin-top-15'}>
        {<TabContentComponent keyTab={keyTab} fetchData={fetchData} loading={loading} onEdit={onEdit} selectedOption={selectedOption} />}
      </Col>
    ) : (
      <Col span={24} className={'empty-section-container'}>
        <div className={'empty-section'}>
          <span className={'empty-section-message'}>Por favor selecciona una tienda</span>
        </div>
      </Col>
    )}
  </Row>
)

export default InventoryTabsContent
