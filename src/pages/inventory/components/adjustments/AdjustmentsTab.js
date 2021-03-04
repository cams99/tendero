import React, { useState } from 'react'
import { message } from 'antd'

//components
import AdjustmentsTable from './AdjustmentsTable'
import AdjustmentsDrawer from './AdjustmentsDrawer'
import InventoryTabsHeader from '../InventoryTabsHeader'
import InventoryTabsContent from '../InventoryTabsContent'
import inventorySrc from '../../inventorySrc'

function AdjustmentsTab(props) {
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchData, setFetchData] = useState(true)

  const searchHandler = e => {
    // TODO: ACA HAY QUE HACER DEBOUNCING
  }

  const saveNewAdjustment = data => {
    setFetchData(false)
    setLoading(true)
    inventorySrc
      .saveAdjustment(data)
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
        buttonLabel={'Nuevo ajuste'}
        buttonHandler={() => setShowDrawer(true)}
        createPermissions={30}
      />
      <InventoryTabsContent fetchData={fetchData} loading={loading} component={AdjustmentsTable} selectedOption={props.selectedOption} />
      <AdjustmentsDrawer
        shopsList={props.shopsList}
        closable={(data, request) => {
          setShowDrawer(false)
          if (request === 'save') saveNewAdjustment(data)
        }}
        visible={showDrawer}
      />
    </div>
  )
}

export default AdjustmentsTab

AdjustmentsTab.defaultProps = {
  shopsList: [],
  selectedOption: null,
}
