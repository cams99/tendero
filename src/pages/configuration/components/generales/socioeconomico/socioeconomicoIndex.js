import React, { useEffect, useState } from 'react'

import GeneralTable from '../../../../../components/Table'
import LoadMoreButton from '../../../../../components/LoadMoreButton'
import SocioEconomicDrawer from './socioeconomicoDrawer'
import { message } from 'antd'
import socioeconomicoSrc from './socioeconomicoSrc'
import Utils from '../../../../../utils/Utils'

function SocioEconomic() {
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    setLoading(true)
    socioeconomicoSrc
      .getSocioEconomic('', 5)
      .then(response => {
        setDataSource(getSocioEcoData(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }, [])

  const getSocioEcoData = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        name: d.name,
        country_names: d.countries
          ?.map(data => {
            return data.name
          })
          .join(', '),
        countries_ids: d.countries?.map(data => {
          return data.id
        }),
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    socioeconomicoSrc
      .getSocioEconomic('', 5)
      .then(response => {
        setDataSource(getSocioEcoData(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Países a los que aplica',
      dataIndex: 'country_names', // Field that is goint to be rendered
      key: 'country_names',
      render: text => <span>{text}</span>,
    },
  ]

  const searchText = value => {
    setLoading(true)
    socioeconomicoSrc.getSocioEconomic(value, 5).then(response => {
      setDataSource(getSocioEcoData(response))
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
    socioeconomicoSrc
      .removeSocioEconomic(data.id)
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
          setDataSource(dataSource.concat(getSocioEcoData(response)))
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
        socioeconomicoSrc
          .editSocioEconomic(id, data)
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
        socioeconomicoSrc
          .newSocioEconomic(data)
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
      <SocioEconomicDrawer
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

export default SocioEconomic
