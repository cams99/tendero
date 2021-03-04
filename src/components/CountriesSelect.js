import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const { Option } = Select

function CountriesSelect(props) {
  return (
    <>
      <div className={'title-space-field'}>{props.title}</div>
      <Select
        getPopupContainer={trigger => trigger.parentNode}
        showSearch
        optionFilterProp="children"
        mode="multiple"
        className={'single-select product-custom-select'}
        placeholder={props.placeholder}
        size={'large'}
        style={{ width: '100%' }}
        value={props.country}
        onChange={value => props.handleChangeCountry(value)}
        onSearch={props.onSearchCountry}
      >
        {props.countries &&
          props.countries.map(data => (
            <Option key={data.id} value={data.id}>
              {data.name}
            </Option>
          ))}
      </Select>
    </>
  )
}

export default CountriesSelect

CountriesSelect.prototypes = {
  value: PropTypes.number,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  countries: PropTypes.array.isRequired,
}
