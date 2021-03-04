import React from 'react'

//components
import InventoryTable from './InventoryTable'
import InventoryTabsHeader from '../InventoryTabsHeader'
import InventoryTabsContent from '../InventoryTabsContent'

function InventoryTab(props) {
  const searchHandler = e => {
    // TODO: ACA HAY QUE HACER DEBOUNCING
  }

  return (
    <div>
      <InventoryTabsHeader
        shopsList={props.shopsList}
        selectedOption={props.selectedOption}
        setSelectedOption={option => {
          props.setSelectedOption(option)
        }}
        onSearch={searchHandler}
      />
      <InventoryTabsContent keyTab={props.keyTab} component={InventoryTable} selectedOption={props.selectedOption} />
    </div>
  )
}

export default InventoryTab

InventoryTab.defaultProps = {
  edit: {},
  shopsList: [],
}
