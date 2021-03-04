import React, { useState } from 'react'
import { message } from 'antd'

//components
import TransfersTable from './TransfersTable'
import TransfersDrawer from './TransfersDrawer'
import InventoryTabsHeader from '../InventoryTabsHeader'
import InventoryTabsContent from '../InventoryTabsContent'
import inventorySrc from '../../inventorySrc'

function TransfersTab(props) {
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)

  const searchHandler = e => {
    // TODO: ACA HAY QUE HACER DEBOUNCING
  }

  const saveNewTransfer = data => {
    setFetchData(false)
    setLoading(true)
    inventorySrc
      .storeTransfer(data)
      .then(response => {
        if (response.errors && Object.keys(response.errors).length > 0) {
          Object.keys(response.errors).map(error => (
            message.error(response.errors[error])
          ))
          setLoading(false)
        } else {
          message.success('Información creada.')
          setShowDrawer(false)
          setLoading(false)
          setFetchData(true)
        }
      })
      .catch(err => {
        console.log(err)
        message.error('Error al guardar la compra')
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
        buttonLabel={'Nueva transferencia'}
        buttonHandler={() => {
          setShowDrawer(true)
        }}
        createPermissions={34}
      />
      <InventoryTabsContent 
        fetchData={fetchData} 
        loading={loading} 
        component={TransfersTable} 
        selectedOption={props.selectedOption} 
      />
      <TransfersDrawer
        shopsList={props.shopsList}
        closable={(data, request) => {
          if (request === 'save') return saveNewTransfer(data)
          setShowDrawer(false)
        }}
        visible={showDrawer}
        loading={loading}
      />
    </div>
  )
}

export default TransfersTab

TransfersTab.defaultProps = {
  selectedOption: null,
  shopsList: [],
}
