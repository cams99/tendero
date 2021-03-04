import React, { useState } from 'react'
import { message } from 'antd'

//components
import CountsTable from './CountsTable'
import CountsDrawer from './CountsDrawer'
import InventoryTabsHeader from '../InventoryTabsHeader'
import InventoryTabsContent from '../InventoryTabsContent'
import inventorySrc from '../../inventorySrc'

function CountsTab(props) {
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)

  const searchHandler = e => {
    // TODO: ACA HAY QUE HACER DEBOUNCING
  }

  const saveNewCount = data => {
    setFetchData(false)
    setLoading(true)
    inventorySrc
      .saveCounts(data)
      .then(response => {
        message.success('Información actualizada.')
        setFetchData(true)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al actualizar la información')
        setLoading(false)
      })
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
        buttonLabel={'Nuevo conteo'}
        buttonHandler={() => {
          setShowDrawer(true)
        }}
        createPermissions={38}
      />
      <InventoryTabsContent 
        fetchData={fetchData} 
        loading={loading} 
        component={CountsTable} 
        selectedOption={props.selectedOption} 
      />
      <CountsDrawer
        shopsList={props.shopsList}
        closable={(data, request) => {
          setShowDrawer(false)
          if (request === 'save') saveNewCount(data)
        }}
        visible={showDrawer}
        fetchData={fetchData}
      />
    </div>
  )
}

export default CountsTab

CountsTab.defaultProps = {
  selectedOption: null,
  shopsList: [],
}
