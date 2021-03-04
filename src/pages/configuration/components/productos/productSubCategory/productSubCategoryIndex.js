import React, { useEffect, useState } from 'react'
import GeneralTable from '../../../../../components/Table'
import LoadMoreButton from '../../../../../components/LoadMoreButton'
import ProductSubCategoryDrawer from './productSubCategoryDrawer'
import productSubCategorySrc from './productSubCategorySrc'
import { message } from 'antd'
import Utils from '../../../../../utils/Utils'

function ProductSubCategory() {
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    productSubCategorySrc
      .getProductSubCategory('', 5)
      .then(result => {
        setDataSource(getParseData(result))
        setNextPage(result.data.next_page_url)
        setExistMoreInfo(result.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }, [])

  const loadData = () => {
    setLoading(true)
    setVisible(false)
    productSubCategorySrc
      .getProductSubCategory('', 5)
      .then(result => {
        setDataSource(getParseData(result))
        setNextPage(result.data.next_page_url)
        setExistMoreInfo(result.data.next_page_url !== null)
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
      title: 'Departamento de productos al que pertenece',
      dataIndex: 'product_department_name', // Field that is goint to be rendered
      key: 'product_department_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Categoría a la que pertenece',
      dataIndex: 'product_category_name', // Field that is goint to be rendered
      key: 'product_category_name',
      render: text => <span>{text}</span>,
    },
  ]

  const getParseData = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        name: d.name,
        product_category_id: d.product_category_id,
        product_category_name: d.product_category?.name,
        product_department_id: d.product_category?.product_department_id,
        product_department_name: d.product_category?.product_department?.name,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const searchText = value => {
    setLoading(true)
    productSubCategorySrc
      .getProductSubCategory(value, 5)
      .then(result => {
        setDataSource(getParseData(result))
        setNextPage(result.data.next_page_url)
        setExistMoreInfo(result.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido filtrar la informacion')
      })
  }

  const EditRow = data => {
    setEditMode(true)
    setVisible(true)
    setEditDataDrawer(data)
  }
  const DeleteRow = data => {
    setLoading(true)
    productSubCategorySrc
      .removeProductSubCategory(data.id)
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
          setDataSource(dataSource.concat(getParseData(response)))
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
  const onSaveButton = (method, data, storeId) => {
    switch (method) {
      case true:
        productSubCategorySrc
          .editProductSubCategory(storeId, data)
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
        productSubCategorySrc
          .newProductSubCategory(data)
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
      <ProductSubCategoryDrawer
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

export default ProductSubCategory
