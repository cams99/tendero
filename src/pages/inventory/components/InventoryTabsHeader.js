import React, { useContext } from 'react'
import { Col, Row, Input, Select, Button } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'

// Context
import { Context, useStore } from '../../../context'

const { Option } = Select

function InventoryTabsHeader(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  return (
    <Row gutter={16}>
      <Col xs={7} sm={7} md={7} lg={7}>
        <Select
          value={props.selectedOption}
          className={'single-select'}
          placeholder={'Selecciona una tienda'}
          size={'large'}
          style={{ width: '100%' }}
          onChange={option => {
            props.setSelectedOption(option)
          }}
        >
          {props.shopsList.map((option, i) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={11} sm={11} md={11} lg={11}>
        {props.selectedOption !== null && (
          <Input
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Buscar"
            className={'tendero-table-search custom-search'}
            size={'large'}
            onChange={e => {
              props.onSearch(e)
            }}
          />
        )}
      </Col>
      <Col xs={6} sm={6} md={6} lg={6} className="text-right">
        {props.selectedOption !== null &&
          props.buttonLabel &&
          props.buttonHandler &&
          hasPermissions([props.createPermissions]) && (
            <Button className={'title-tendero new-button'} onClick={props.buttonHandler}>
              {props.buttonLabel}
            </Button>
          )}
      </Col>
    </Row>
  )
}

export default InventoryTabsHeader

InventoryTabsHeader.defaultProps = {
  selectedOption: null,
  buttonLabel: null,
  shopsList: [],
}
