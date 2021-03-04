import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const { Option } = Select

function GenericSelect(props) {
  return (
    <>
      {props.title && <div className={'title-space-field pl-2'}>{props.title}</div>}
      <Select
        getPopupContainer={trigger => trigger.parentNode}
        showSearch
        optionFilterProp="children"
        className={'single-select'}
        placeholder={props.placeholder}
        size={'large'}
        style={{ width: '100%' }}
        value={props.value}
        onChange={value => props.handlerChange(value)}
        disabled={props.disabled}
        loading={props.loading}
      >
        {props.data &&
          props.data.map(data => {
            return (
              <Option key={data.id} value={data.id}>
                {data.name}
              </Option>
            )
          })}
      </Select>
    </>
  )
}

export default GenericSelect

GenericSelect.prototypes = {
  value: PropTypes.number,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  data: PropTypes.array.isRequired,
}
