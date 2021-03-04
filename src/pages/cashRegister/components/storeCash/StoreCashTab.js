import React, { useState, useContext } from 'react'
import { message } from 'antd'

//components
import StoreCashTable from './StoreCashTable'
import CashRegisterTabHeader from '../CashRegisterTabHeader'
import CashRegisterTabsContent from '../CashRegisterTabsContent'
import StoreCashDrawer from './StoreCashDrawer'
import cashRegisterSrc from '../../cashRegisterSrc'

// Context
import { Context } from '../../../../context'

function StoreCashTab(props) {
  const [{ turn }, dispatch] = useContext(Context)
  const [adjust, setAdjust] = useState({})
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetch, setFetch] = useState(true)

  const onAdjust = data => {
    setAdjust(data)
    setShowDrawer(true)
  }

  const saveNewAdjust = data => {
    setLoading(true)
    setFetch(false)
    cashRegisterSrc
      .newCashAdjustment(data)
      .then(response => {
        message.success('Se guardo el ajuste correctamente')
        getCash(response.store_id)
      })
      .catch(err => {
        console.log(err)
        message.error('No se pudo guardar el ajuste')
        setLoading(false)
      })
  }

  const getCash = id => {
    cashRegisterSrc.getStore(id).then(response => {
      dispatch({
        type: 'TURN CASH',
        payload: response.data.data[0],
      })
      setFetch(true)
      setLoading(false)
    })
  }

  return (
    <div>
      <CashRegisterTabHeader
        shopsList={props.shopsList}
        selectedOption={props.selectedOption}
        setSelectedOption={option => {
          props.setSelectedOption(option)
        }}
        search={false}
        turn={turn}
      />
      <CashRegisterTabsContent
        loading={loading}
        component={StoreCashTable}
        selectedOption={props.selectedOption}
        onAdjust={onAdjust}
        turn={turn}
        adjust={true}
        fetch={fetch}
      />
      <StoreCashDrawer
        closable={(data, request) => {
          setShowDrawer(false)
          if (request === 'save') saveNewAdjust(data)
        }}
        visible={showDrawer}
        adjust={adjust}
      />
    </div>
  )
}

export default StoreCashTab
