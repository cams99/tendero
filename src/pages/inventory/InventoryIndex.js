import React, { useEffect, useState, useContext } from 'react'
import { message } from 'antd'
import HeaderPage from '../../components/HeaderPage'
import { Tabs } from 'antd'

import InventoryTab from './components/inventory/InventoryTab'
import PurchasesTab from './components/purchases/PurchasesTab'
import TransfersTab from './components/transfers/TransfersTab'
import AdjustmentsTab from './components/adjustments/AdjustmentsTab'
import CountsTab from './components/counts/CountsTab'
import inventorySrc from './inventorySrc'

// Context
import { Context, useStore } from '../../context'

const { TabPane } = Tabs

function Inventory() {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [selectedOption, setSelectedOption] = useState(null)
  const [key, setKey] = useState(null)
  const [shopsList, setShopsList] = useState()

  useEffect(() => {
    const fetchShops = () => {
      inventorySrc
        .getAllStores()
        .then(response => {
          setShopsList(response.data)
        })
        .catch(err => {
          console.log(err)
          message.error('Error en al cargar tiendas')
        })
    }
    fetchShops()
  }, [])

  const onSelectOption = option => {
    setSelectedOption(option)
  }

  const onKey = key => {
    setKey(key)
  }

  return (
    <>
      <HeaderPage title={'Inventario'} />
      <Tabs id={'tenderoInventoryTabs'} className={'inventory-tab'} defaultActiveKey="1" onChange={onKey}>
        <TabPane tab="Inventario" key="1">
          <InventoryTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} keyTab={key} />
        </TabPane>
        {hasPermissions([25]) && (
          <TabPane tab="Compras" key="2">
            <PurchasesTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
        {hasPermissions([37]) && (
          <TabPane tab="Conteos" key="3">
            <CountsTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
        {hasPermissions([29]) && (
          <TabPane tab="Ajustes" key="4">
            <AdjustmentsTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
        {hasPermissions([33]) && (
          <TabPane tab="Transferencias" key="5">
            <TransfersTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
      </Tabs>
    </>
  )
}

export default Inventory
