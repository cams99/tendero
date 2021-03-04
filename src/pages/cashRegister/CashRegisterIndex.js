import React, { useEffect, useState, useContext } from 'react'
import { message } from 'antd'
import HeaderPage from '../../components/HeaderPage'
import { Tabs } from 'antd'
import DepositsTab from './components/deposits/DepositsTab'
import StoreCashTab from './components/storeCash/StoreCashTab'
import CashRegisterSrc from './cashRegisterSrc'

// Context
import { Context, useStore } from '../../context'

const { TabPane } = Tabs

function CashRegister() {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [selectedOption, setSelectedOption] = useState(null)
  const [shopsList, setShopsList] = useState([])

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = () => {
    CashRegisterSrc.getAllStores()
      .then(response => {
        setShopsList(response.data)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en al cargar tiendas')
      })
  }

  const onSelectOption = option => {
    setSelectedOption(option)
  }

  return (
    <>
      <HeaderPage title={'Caja'} />
      <Tabs id={'tenderoInventoryTabs'} className={'inventory-tab cashRegister-tab'}>
        {hasPermissions([41]) && (
          <TabPane tab="Depósitos" key="1">
            <DepositsTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
        {hasPermissions([53]) && (
          <TabPane tab="Efectivo en tienda" key="2">
            <StoreCashTab shopsList={shopsList} selectedOption={selectedOption} setSelectedOption={onSelectOption} />
          </TabPane>
        )}
      </Tabs>
    </>
  )
}

export default CashRegister
