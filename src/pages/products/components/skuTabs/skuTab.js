import React, { useEffect, useState, useContext } from 'react'

import SkuDrawer from './skuDrawer'
import { message } from 'antd'
import Utils from '../../../../utils/Utils'
import GeneralTable from '../../../../components/Table'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import skuSrc from './skuSrc'

// Context
import { Context } from '../../../../context'

function SkuTab(props) {
  const [{ auth }] = useContext(Context)
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.keyTab === '3') {
      loadData()
    }
    // eslint-disable-next-line
  }, [props.keyTab])

  const columns = [
    {
      title: 'Descripcion',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: text => <span>{text}</span>,
    },
    {
      title: 'SKU',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Presentación a la que pertence',
      dataIndex: 'presentation_name', // Field that is goint to be rendered
      key: 'presentation_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Es de temporada?',
      dataIndex: 'seasonal_product', // Field that is goint to be rendered
      key: 'seasonal_product',
      render: text => <span>{text === 1 ? 'Sí' : 'No'}</span>,
    },
  ]

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    skuSrc
      .getSkus('', 5)
      .then(response => {
        setDataSource(getSkuData(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }

  const getSkuData = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        company_id: d.company_id,
        presentation_id: d.presentation_id,
        product_id: validatePositions(d.presentation, 'product') ? d.presentation.product_id : null,
        product_name: validatePositions(d.presentation, 'product') ? d.presentation.product.description : null,
        description: d.description,
        code: d.code,
        presentation_name: validatePositions(d.presentation, 'description') ? d.presentation.description : null,
        seasonal_product: d.seasonal_product,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const validatePositions = (objValidate, strPosition) => {
    if (objValidate !== null && typeof objValidate[strPosition] !== 'undefined') {
      return true
    }
    return false
  }

  const searchText = value => {
    setLoading(true)
    skuSrc.getSkus(value, 5).then(response => {
      setDataSource(getSkuData(response))
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
    setVisible(false)
    skuSrc
      .removeSkus(data.id)
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
          setDataSource(dataSource.concat(getSkuData(response)))
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
        skuSrc
          .editSkus(id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Object.keys(res.errors).map(key => {
                if (key === 'code') {
                  return message.error(res.errors[key][0].replace('code', 'SKU'))
                } else {
                  return message.error(res.errors[key])
                }
              })
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
        skuSrc
          .newSkus(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              Object.keys(res.errors).map(key => {
                if (key === 'code') {
                  return message.error(res.errors[key][0].replace('code', 'SKU'))
                } else {
                  return message.error(res.errors[key])
                }
              })
            } else {
              message.success('Informacion creada.')
              setVisible(false)
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
        create={auth.company?.allow_add_products}
        createPermissions={22}
        editPermissions={23}
        deletePermissions={24}
        companyPermissions={true}
      />
      <LoadMoreButton handlerButton={moreInfo} moreInfo={existMoreInfo} />
      <SkuDrawer closable={onClose} visible={visible} edit={editMode} editData={editDataDrawer} cancelButton={onClose} saveButton={onSaveButton} />
    </>
  )
}

export default SkuTab
