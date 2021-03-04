import React, { useEffect, useState } from 'react'
import ProductTabTable from './productTabTable'
import ProductDrawer from './productDrawer'
import ProductSrc from '../../productSrc'
import { message } from 'antd'

function ProductTab(props) {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [filterProd, setFilterProd] = useState([])

  useEffect(() => {
    if (props.keyTab === '1') {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.keyTab])

  function loadData() {
    setLoading(true)
    ProductSrc.read()
      .then(products => {
        setProducts(getProduct(products))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  const getProduct = products => {
    if (products !== 'Too Many Attempts.') {
      let _products = products.data || []
      return _products.map((d, i) => ({
        key: i,
        _id: d.id,
        company_id: d.company_id,
        productDescription: d.description,
        product_category_id: d.product_category_id,
        product_subcategory_id: d.product_subcategory_id,
        product_department: d.product_category.product_department,
        suggested_price: d.suggested_price,
        uom_id: d?.uom_id ? d.uom_id : null,
        brand_id: d.brand?.id ? d.brand_id : null,
        brand_name: d.brand?.name ? d.brand.name : null,
        all_countries_id: d.countries.length > 0 ? d.countries.map(c => (c.id !== null ? c.id : null)) : [],
        all_countries: d.countries.length > 0 ? d.countries.map(c => (c.name !== null ? c.name : '')).join(', ') : 0,
        minimal_expresion: d.minimal_expresion,
        is_inventoriable: d.is_inventoriable,
        is_taxable: d.is_taxable,
        product_category: d.product_category,
        product_subcategory: d.product_subcategory,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const showDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    ProductSrc.removeProduct(data._id)
      .then(r => {
        setLoading(false)
        if (r.message) {
          return message.error(r.message)
        }
        message.success('Producto Eliminando')
        loadData()
      })
      .catch(e => {
        message.error('Error')
        setLoading(false)
      })
  }
  const searchText = data => {
    let temp = products
    let obj = temp.filter(t => t.productDescription.toLowerCase().indexOf(data.toLowerCase()) > -1)
    setFilterProd(obj)
  }

  const onSaveButton = data => {
    ProductSrc.saveProduct(data)
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
          message.success('Producto Guardado')
          setVisible(false)
          loadData()
        }
      })
      .catch(e => {
        console.log(e)
        message.error('Error al guardar el producto')
        setLoading(false)
      })
  }

  const onEditButton = (data, id) => {
    ProductSrc.updateProduct(data, id)
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
          message.success('Producto Actualizado')
          setVisible(false)
          loadData()
        }
      })
      .catch(e => {
        setLoading(false)
        console.log(e)
      })
  }

  return (
    <>
      <ProductTabTable
        handlerShowDrawer={showDrawer}
        dataSource={filterProd.length > 0 ? filterProd : products}
        handlerEditRow={EditRow}
        loading={loading}
        handlerTextSearch={searchText}
        handlerDeleteRow={DeleteRow}
      />
      <ProductDrawer
        closable={onClose}
        visible={visible}
        cancelButton={onClose}
        saveButton={onSaveButton}
        editButton={onEditButton}
        edit={editMode}
        editData={editDataDrawer}
      />
    </>
  )
}
export default ProductTab
