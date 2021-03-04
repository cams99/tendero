import React from 'react'
import { Col, Row, Input, Select } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
const { Option } = Select

function CashRegisterTabsHeader(props) {
  return (
    <Row gutter={16}>
      <Col xs={7} sm={7} md={7} lg={7}>
        <Select
          disabled={!props.turn?.is_open && !props.search && true}
          value={props.search ? props.selectedOption : !props.turn?.is_open ? null : props.selectedOption}
          className={'single-select'}
          placeholder={'Selecciona una tienda'}
          size={'large'}
          style={{ width: '100%' }}
          onChange={option => {
            props.setSelectedOption(option)
          }}
        >
          {props.shopsList?.map((option, i) => (
            <Option key={option.id} value={option.id}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={11} sm={11} md={11} lg={11}>
        {props.search && (
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
    </Row>
  )
}

export default CashRegisterTabsHeader
