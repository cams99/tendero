import React, { useEffect, useState } from 'react'
import ComboTabTable from './comboTabTable'
import ComboDrawer from './comboDrawer'
import comboSrc from './comboSrc'
import { message } from 'antd'
import Utils from '../../../../utils/Utils'
import LoadMoreButton from '../../../../components/LoadMoreButton'

function ComboTab(props) {
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.keyTab === '4') {
      loadData()
    }
    // eslint-disable-next-line
  }, [props.keyTab])

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    comboSrc
      .getCombos('', 5)
      .then(response => {
        setDataSource(getComboData(response))
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
    comboSrc.getCombos(value, 5).then(response => {
      setDataSource(getComboData(response))
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
    comboSrc
      .removeCombos(data.id)
      .then(response => {
        message.success(`${response.description} se ha elminado.`)
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
          setDataSource(dataSource.concat(getComboData(response)))
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
        comboSrc
          .editCombos(id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Object.keys(res.errors).map(key => {
                if (key === 'description') {
                  return message.error(res.errors[key][0].replace('description', 'Descripcion'))
                } else {
                  return message.error(res.errors[key])
                }
              })
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
        comboSrc
          .newCombos(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Object.keys(res.errors).map(key => {
                if (key === 'description') {
                  return message.error(res.errors[key][0].replace('description', 'Descripcion'))
                } else {
                  return message.error(res.errors[key])
                }
              })
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

  const getComboData = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        company_id: d.company_id,
        description: d.description,
        suggested_price: d.suggested_price,
        presentations_ids: d.presentations?.map(value => {
          return value.id
        }),
        presentations: d.presentations,
        presentation_combos_stores_turns: d.presentation_combos_stores_turns,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  return (
    <>
      <ComboTabTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchText}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerShowDrawer={handlerShowDrawer}
      />
      <LoadMoreButton handlerButton={moreInfo} moreInfo={existMoreInfo} />
      <ComboDrawer closable={onClose} visible={visible} edit={editMode} editData={editDataDrawer} cancelButton={onClose} saveButton={onSaveButton} />
    </>
  )
}
export default ComboTab
