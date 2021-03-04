import React, { useState, useEffect } from 'react'
import { message } from 'antd'

//components
import PurchasesTable from './PurchasesTable'
import PurchasesDrawer from './PurchasesDrawer'
import InventoryTabsHeader from '../InventoryTabsHeader'
import InventoryTabsContent from '../InventoryTabsContent'
import inventorySrc from '../../inventorySrc'

function PurchasesTab(props) {
  const [showDrawer, setShowDrawer] = useState(false)
  const [editPurchase, setEditPurchase] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchData, setFetchData] = useState(true)

  useEffect(() => {
    if (showDrawer === false) setEditPurchase({})
  }, [showDrawer])
  const searchHandler = e => {
    // TODO: ACA HAY QUE HACER DEBOUNCING
  }

  const onEditPurchase = id => {
    setLoading(true)
    inventorySrc
      .getPurchase(id)
      .then(purchase => {
        setEditPurchase(purchase)
        setShowDrawer(true)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la compra.')
        setLoading(false)
      })
  }

  const saveNewPurchase = data => {
    setFetchData(false)
    setLoading(true)
    inventorySrc
      .savePurchase(data)
      .then(response => {
        message.success('Información creada.')
        setFetchData(true)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al guardar la compra')
        setLoading(false)
      })
  }

  const editPurchaseData = data => {
    setFetchData(false)
    setLoading(true)
    inventorySrc
      .editPurchase(data[0], data[1])
      .then(response => {
        message.success('Información actualizada.')
        setFetchData(true)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al editar la compra')
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
        buttonHandler={() => {
          setShowDrawer(true)
        }}
        buttonLabel={'Nueva compra'}
        createPermissions={26}
      />
      <InventoryTabsContent
        fetchData={fetchData}
        loading={loading}
        onEdit={onEditPurchase}
        component={PurchasesTable}
        selectedOption={props.selectedOption}
      />
      <PurchasesDrawer
        shopsList={props.shopsList}
        closable={(data, request) => {
          setShowDrawer(false)
          if (request === 'save') saveNewPurchase(data)
          if (request === 'edit') editPurchaseData(data)
        }}
        visible={showDrawer}
        edit={editPurchase}
      />
    </div>
  )
}

export default PurchasesTab

PurchasesTab.defaultProps = {
  selectedOption: null,
  shopsList: [],
}
