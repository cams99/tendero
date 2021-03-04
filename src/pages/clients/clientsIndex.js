import React, { useEffect, useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import ClientTable from './components/clientTable'
import ClientsDrawer from '../clients/components/clientsDrawer'
import { message } from 'antd'
import LoadMoreButton from '../../components/LoadMoreButton'
import Utils from '../../utils/Utils'
import clientsSrc from './clientsSrc'

function Clients() {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])

  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [loading, setLoading] = useState(false)

  const showDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }
  const onClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    setVisible(false)
    setLoading(true)
    clientsSrc
      .getClient()
      .then(response => {
        if (response === 'Unauthenticated.') {
          throw new Error('Unauthenticated')
        }
        setDataSource(setCountryName(response.data.data))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la informacion.')
      })
  }, [])

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    clientsSrc
      .getClient()
      .then(response => {
        if (response === 'Unauthenticated.') {
          throw new Error('Unauthenticated')
        }
        setDataSource(setCountryName(response.data.data))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la informacion.')
      })
  }

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setLoading(true)
      setExistMoreInfo(null)
      Utils.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(setCountryName(response.data.data)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const searchTextFinder = data => {
    setLoading(true)
    clientsSrc
      .getClient({ name: `${data}%` })
      .then(response => {
        setDataSource(setCountryName(response.data.data))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en la busqueda')
      })
  }

  const setCountryName = data => {
    const _data = []
    for (let k in data) {
      const d = data[k]
      d?.country && d.country?.name ? (d.country_name = d.country.name) : (d.country_name = '')
      d.email = d.companies[0]?.pivot?.email || ''
      d.phone = d.companies[0]?.pivot?.phone || ''
      _data.push(d)
    }
    return _data
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    clientsSrc
      .removeClient(data.id)
      .then(response => {
        message.success(`${response.name} se ha elminado.`)
        loadData()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
      })
  }

  const checkErrors = res => {
    Object.keys(res.errors).map(key => {
      switch (key) {
        case 'nit':
          message.error(res.errors[key][0].replace('nit', 'NIT'))
          break
        default:
          message.error(res.errors[key])
          break
      }
      return null
    })
  }

  const onSaveButton = (method, data, dataId) => {
    setLoading(true)
    switch (method) {
      case true:
        clientsSrc
          .editClient(dataId, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Informacion actualizada.')
              setVisible(false)
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
          })
        break
      case false:
        clientsSrc
          .newClient(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Informacion creada.')
              setVisible(false)
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
          })
        break
      default:
        break
    }
  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo Cliente'} title={'Clientes'} showDrawer={showDrawer} permissions={62} />
      <ClientTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <ClientsDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
      />
    </>
  )
}

export default Clients
