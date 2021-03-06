import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import GeneralTable from '../../../../../components/Table'
import LoadMoreButton from '../../../../../components/LoadMoreButton'
import Utils from '../../../../../utils/Utils'
import cadenaSrc from './cadenaSrc'
import CadenaDrawer from './cadenaDrawer'

function Cadena() {
  const [dataSource, setDataSource] = useState([])
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    setLoading(true)
    setVisible(false)
    cadenaSrc
      .getChains('', 5)
      .then(result => {
        setDataSource(getChains(result))
        setNextPage(result.data.next_page_url)
        setExistMoreInfo(result.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la información')
      })
  }

  const searchText = value => {
    setLoading(true)
    cadenaSrc
      .getChains(value, 5)
      .then(result => {
        setDataSource(getChains(result))
        setNextPage(result.data.next_page_url)
        setExistMoreInfo(result.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido filtrar la informacion')
      })
  }

  const getChains = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        name: d.name,
      }))
    } else {
      message.error('Se excedió el límite de peticiones, espera y recarga la aplicación')
    }
  }

  const EditRow = data => {
    setEditMode(true)
    setVisible(true)
    setEditDataDrawer(data)
  }

  const DeleteRow = data => {
    setLoading(true)
    cadenaSrc
      .removeChain(data.id)
      .then(response => {
        message.success(`${response.name} se ha elminado.`)
        loadData()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
      })
  }

  const handlerShowDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }

  const moreInfo = () => {
    if (existMoreInfo) {
      setLoading(true)
      Utils.getNextPage(nextPage)
        .then(response => {
          setDataSource(dataSource.concat(getChains(response)))
          setNextPage(response.data.next_page_url)
          setExistMoreInfo(response.data.next_page_url !== null)
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          message.error('No se ha podido cargar la información')
        })
    }
  }

  const onClose = () => {
    setVisible(false)
  }

  const onSaveButton = (method, data, flagId) => {
    switch (method) {
      case true:
        cadenaSrc
          .editChain(flagId, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Utils.checkErrors(res)
            } else {
              message.success('Información actualizada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la información.')
          })
        break
      case false:
        cadenaSrc
          .newChain(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Utils.checkErrors(res)
            } else {
              message.success('Información actualizada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al crear la información.')
          })
        break
      default:
        break
    }
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{text}</span>,
    },
  ]

  return (
    <>
      <GeneralTable
        columns={columns}
        dataSource={dataSource}
        handlerTextSearch={searchText}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerShowDrawer={handlerShowDrawer}
        loading={loading}
        createPermissions={66}
        editPermissions={67}
        deletePermissions={68}
      />
      <LoadMoreButton handlerButton={moreInfo} moreInfo={existMoreInfo} />
      <CadenaDrawer closable={onClose} visible={visible} edit={editMode} editData={editDataDrawer} cancelButton={onClose} saveButton={onSaveButton} />
    </>
  )
}

export default Cadena
