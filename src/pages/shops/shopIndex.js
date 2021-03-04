import React, { useEffect, useState, useContext } from 'react'
import HeaderPage from '../../components/HeaderPage'
import ShopTable from '../shops/components/shopTable'
import { message } from 'antd'
import ShopsDrawer from './components/shopsDrawer'
import shopSrc from './shopSrc'
import LoadMoreButton from '../../components/LoadMoreButton'
import Utils from '../../utils/Utils'

import { Context } from '../../context'

function Shops() {
  const [{ auth }] = useContext(Context)
  const [dataSource, setDataSource] = useState([])
  const [turns, setTurns] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    loadShopInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (visible) {
      searchTurns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const searchTurns = () => {
    let turnData = []
    Utils.getTurns('')
      .then(response => {
        response.data.data.map(dat => {
          let parseData = {
            key: dat.id,
            store_id: dat.store_id,
            name: dat.name,
            start_time: dat.start_time,
            end_time: dat.end_time,
            is_active: dat.is_active,
            is_default: dat.is_default,
          }
          
          if (editMode && Object.keys(editDataDrawer._turns_ids).length > 0 && editDataDrawer._turns_ids.includes(parseData.key)) {
            turnData.push(parseData)
          }
          return true
        })
        setTurns(turnData)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido obtener la lista de turnos')
      })
  }

  const loadShopInfo = () => {
    setVisible(false)
    setLoading(true)
    shopSrc
      .read('', 5)
      .then(response => {
        setDataSource(getStores(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la informacion.')
      })
  }

  const getStores = stores => {
    if (stores !== 'Too Many Attempts.') {
      let _stores = stores.data.data || []

      return _stores.map((d, i) => ({
        key: i,
        _id: d.id,
        _shop: d.name,
        _enterprise: validatePositions(d.company, 'name') ? d.company.name : null,
        _enterprise_id: validatePositions(d.company, 'id') ? d.company_id : null,
        _location: validatePositions(d.state, 'name') ? d.state.name : null,
        _address: d.address,
        _petty_cash_amount: d.petty_cash_amount,
        _store_type_id: validatePositions(d.store_type, 'id') ? d.store_type_id : null,
        _store_type_name: validatePositions(d.store_type, 'name') ? d.store_type.name : null,
        _store_chain_id: validatePositions(d.store_chain, 'id') ? d.store_chain_id : null,
        _store_chain_name: validatePositions(d.store_chain, 'name') ? d.store_chain.name : null,
        _store_flag_id: validatePositions(d.store_flag, 'id') ? d.store_flag_id : null,
        _store_flag_name: validatePositions(d.store_flag, 'name') ? d.store_flag.name : null,
        _location_type_id: validatePositions(d.location_type, 'id') ? d.location_type_id : null,
        _location_type_name: validatePositions(d.location_type, 'name') ? d.location_type.name : null,
        _store_format_id: validatePositions(d.store_format, 'id') ? d.store_format_id : null,
        _store_format_name: validatePositions(d.store_format, 'name') ? d.store_format.name : null,
        _size: d.size,
        _socioeconomic_level_id: validatePositions(d.socioeconomic_level, 'id') ? d.socioeconomic_level_id : null,
        _socioeconomic_level_name: validatePositions(d.socioeconomic_level, 'name') ? d.socioeconomic_level.name : null,
        _state_id: validatePositions(d.state, 'id') ? d.state_id : null,
        _state_name: validatePositions(d.state, 'name') ? d.state.name : null,
        _municipality_id: validatePositions(d.municipality, 'id') ? d.municipality_id : null,
        _municipality_name: validatePositions(d.municipality, 'name') ? d.municipality.name : null,
        _zone_id: validatePositions(d.zone, 'id') ? d.zone_id : null,
        _zone_name: validatePositions(d.zone, 'name') ? d.zone.name : null,
        _latitute: d.latitute,
        _longitude: d.longitude,
        _turns_names: validatePositions(d.turns, '', true)
          ? d.turns.map(srcData => {
              return `${srcData.name} | ${srcData.start_time}hrs - ${srcData.end_time}hrs`
            })
          : [],
        _turns_ids: validatePositions(d.turns, '', true)
          ? d.turns.map(srcData => {
              return srcData.id
            })
          : {},
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const validatePositions = (data, strPosition, boolObject = false) => {
    if (data !== null && data !== undefined) {
      let boolPosition = false
      if (strPosition !== '' && typeof data[strPosition] !== 'undefined') {
        boolPosition = true
      } else if (boolObject) {
        Object.keys(data).length > 0 ? (boolPosition = true) : (boolPosition = false)
      }
      return boolPosition
    }
    return false
  }

  const searchText = data => {
    setLoading(true)
    shopSrc.read(data, 5).then(response => {
      setDataSource(getStores(response))
      setNextPage(response.data.next_page_url)
      setExistMoreInfo(response.data.next_page_url !== null)
      setLoading(false)
    })
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    shopSrc
      .storeDelete(data._id)
      .then(response => {
        message.success(`${response.name} se ha elminado.`)
        loadShopInfo()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
      })
  }

  const showDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }
  const onClose = () => {
    setVisible(false)
  }

  const onSaveTurns = () => {
    setVisible(false)
    loadShopInfo()
  }

  const checkErrors = res => {
    Object.keys(res.errors).map(key => {
      switch (key) {
        case 'name':
          message.error(res.errors[key][0].replace('name', 'Nombre'))
          break
        case 'latitute':
          message.error(res.errors[key][0].replace('latitute', 'Latitud'))
          break
        case 'longitude':
          message.error(res.errors[key][0].replace('longitude', 'Longitud'))
          break
        default:
          message.error(res.errors[key])
          break
      }
      return null
    })
  }

  const onSaveButton = (data, method) => {
    switch (method) {
      case true:
        shopSrc
          .updateStore(data.id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
            } else {
              message.success('Informacion actualizada.')
              setVisible(false)
              loadShopInfo()
            }
          })
          .catch(err => {
            console.log(err)
            message.error('Error al actualizar la informacion.')
          })
        break
      case false:
        shopSrc
          .saveStore(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
            } else {
              message.success('Informacion creada.')
              setVisible(false)
              loadShopInfo()
            }
          })
          .catch(err => {
            console.log(err)
            message.error('Error al crear la informacion.')
          })
        break
      default:
        break
    }
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      shopSrc.storeNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(getStores(response)))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
    }
  }

  return (
    <>
      <HeaderPage titleButton={'Nueva tienda'} title={'Tiendas'} showDrawer={showDrawer} permissions={10} create={auth.company?.allow_add_stores} />
      <ShopTable isLoading={loading} dataSource={dataSource} handlerTextSearch={searchText} handlerEditRow={EditRow} handlerDeleteRow={DeleteRow} />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <ShopsDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
        saveTurns={onSaveTurns}
        turns={turns}
      />
    </>
  )
}

export default Shops
