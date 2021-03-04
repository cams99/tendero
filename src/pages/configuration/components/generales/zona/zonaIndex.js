import React, { useEffect, useState } from 'react'

import GeneralTable from '../../../../../components/Table'
import LoadMoreButton from '../../../../../components/LoadMoreButton'
import ZonaDrawer from './zonaDrawer'
import { message } from 'antd'
import zonaSrc from './zonaSrc'
import Utils from '../../../../../utils/Utils'

function Zona() {
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
      title: 'País',
      dataIndex: 'country_name', // Field that is goint to be rendered
      key: 'country_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Region',
      dataIndex: 'region_name', // Field that is goint to be rendered
      key: 'region_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Departamento/estado',
      dataIndex: 'state_name', // Field that is goint to be rendered
      key: 'state_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Municipio/Localidad',
      dataIndex: 'muni_name', // Field that is goint to be rendered
      key: 'muni_name',
      render: text => <span>{text}</span>,
    },
  ]

  const getZones = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        name: d.name,
        country_id: d.municipality?.state?.region?.country_id,
        country_name: d.municipality?.state?.region?.country?.name,
        region_name: d.municipality?.state?.region?.name,
        region_id: d.municipality?.state?.region_id,
        state_name: d.municipality?.state?.name,
        state_id: d.municipality?.state_id,
        muni_name: d.municipality?.name,
        muni_id: d.municipality_id,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  useEffect(() => {
    setLoading(true)
    zonaSrc
      .getZone('', 5)
      .then(response => {
        setDataSource(getZones(response))
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
    zonaSrc
      .getZone('', 5)
      .then(response => {
        setDataSource(getZones(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }

  const searchText = value => {
    setLoading(true)
    zonaSrc.getZone(value, 5).then(response => {
      setDataSource(getZones(response))
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
    zonaSrc
      .removeZone(data.id)
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
          setDataSource(dataSource.concat(getZones(response)))
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
        zonaSrc
          .editZone(id, data)
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
        zonaSrc
          .newZone(data)
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
      <ZonaDrawer closable={onClose} visible={visible} edit={editMode} editData={editDataDrawer} cancelButton={onClose} saveButton={onSaveButton} />
    </>
  )
}

export default Zona
