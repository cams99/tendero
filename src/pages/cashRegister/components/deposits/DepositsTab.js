import React from 'react'

//components
import DepositsTable from './DepositsTable'
import CashRegisterTabHeader from '../CashRegisterTabHeader'
import CashRegisterTabsContent from '../CashRegisterTabsContent'

function DepositsTab(props) {
  const searchHandler = e => {}

  return (
    <div>
      <CashRegisterTabHeader
        shopsList={props.shopsList}
        selectedOption={props.selectedOption}
        setSelectedOption={option => {
          props.setSelectedOption(option)
        }}
        search={true}
        onSearch={searchHandler}
      />
      <CashRegisterTabsContent component={DepositsTable} selectedOption={props.selectedOption} shopsList={props.shopsList} />
    </div>
  )
}

export default DepositsTab
