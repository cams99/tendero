import React, { useEffect, useState } from 'react'

import GeneralTable from '../../../../../components/Table'
import LoadMoreButton from '../../../../../components/LoadMoreButton'
import PaisDrawer from './paisDrawer'
import paisSrc from './paisSrc'
import { message } from 'antd'
import Utils from '../../../../../utils/Utils'

function Pais() {
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Moneda',
      dataIndex: 'currency_name', // Field that is goint to be rendered
      key: 'currency_name',
      render: text => <span>{text}</span>,
    },
  ]

  useEffect(() => {
    setLoading(true)
    paisSrc
      .getCountry('', 5)
      .then(response => {
        setDataSource(getCountries(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }, [])

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    paisSrc
      .getCountry('', 5)
      .then(response => {
        setDataSource(getCountries(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }

  const getCountries = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        name: d.name,
        currency_id: d.currency_id,
        currency_name: d.currency?.name,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const searchText = value => {
    setLoading(true)
    paisSrc.getCountry(value, 5).then(response => {
      setDataSource(getCountries(response))
      setNextPage(response.data.next_page_url)
      setExistMoreInfo(response.data.next_page_url !== null)
      setLoading(false)
    })
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setEditMode(true)
    setVisible(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    paisSrc
      .removeCountry(data.id)
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
          setDataSource(dataSource.concat(getCountries(response)))
          setNextPage(response.data.next_page_url)
          setExistMoreInfo(response.data.next_page_url !== null)
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          message.error('No se ha podido cargar la informacion')
        })
    }
  }

  const onClose = () => {
    setVisible(false)
  }

  const onSaveButton = (method, data, id) => {
    switch (method) {
      case true:
        paisSrc
          .editCountry(id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Utils.checkErrors(res)
            } else {
              message.success('Informacion actualizada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
          })
        break
      case false:
        paisSrc
          .newCountry(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Utils.checkErrors(res)
            } else {
              message.success('Informacion creada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al crear la informacion.')
          })
        break
      default:
        break
    }
  }

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
      <PaisDrawer closable={onClose} visible={visible} edit={editMode} editData={editDataDrawer} cancelButton={onClose} saveButton={onSaveButton} />
    </>
  )
}

export default Pais
