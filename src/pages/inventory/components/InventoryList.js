import React, { useEffect, useState, useReducer } from 'react'
import { Col, Row, Input, Select, Button, List, message, Spin } from 'antd'
import inventorySrc from '../inventorySrc'
import Utils from '../../../utils/Utils'
import debounce from 'lodash/debounce'
const { Option } = Select

const initialState = {
  productCol: 12,
  unitsCol: 4,
  priceCol: 4,
  newQuantityColHide: true,
  remainingColHide: true,
}

const styleReducer = (style, action) => {
  switch (action.type) {
    case 'ENTRY':
      return {
        productCol: 8,
        unitsCol: 4,
        priceCol: 4,
        totalCol: 4,
        newQuantityColHide: true,
        remainingColHide: true,
      }
    case 'COUNT':
      return {
        productCol: 15,
        unitsCol: 5,
        priceColHide: true,
        totalColHide: true,
        newQuantityColHide: true,
        remainingColHide: true,
      }
    case 'ADJUSTMENT':
      return {
        productCol: 12,
        unitsColHide: true,
        totalColHide: true,
        priceColHide: true,
        remainingCol: 4,
        newQuantityCol: 4,
      }
    case 'TRANSFER':
      return {
        productCol: 15,
        unitsCol: 5,
        priceColHide: true,
        totalColHide: true,
        newQuantityColHide: true,
        remainingColHide: true,
      }
    default:
      throw new Error('Must set a listType prop in InventoryList component')
  }
}

function InventoryList(props) {
  const initDataSource = JSON.stringify([{ id: 1, product: null, units: '', price: '' }])
  const [productsList, setProductsList] = useState([])
  const [dataSource, setDataSource] = useState(JSON.parse(initDataSource))
  const [style, dispatch] = useReducer(styleReducer, initialState)
  const [data, setData] = useState([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (props.listType === 'ENTRY' || props.listType === 'TRANSFER') {
      getPresentations()
    } else {
      getProducts()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (dataSource !== props.productsInventory) {
      props.products(dataSource)
    }
    if (props.listType === 'COUNT') {
      props.productsInfo(productsList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])

  useEffect(() => {
    if (props.listType === 'ADJUSTMENT' && props.productsInventory.length > 0) {
      if (props.productsInventory[0].product_id !== null) {
        setDataSource(props.productsInventory)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.productsInventory])

  useEffect(() => {
    props.visible && dispatch({ type: props.listType })
    // TODO: Agregar una key 'products' al dataSource de la tabla para despues consumirlo dentro del condicional   setProductsList(props.edit.products)
    if (typeof props.edit === 'object' && !Utils.isObjEmpty(props.edit)) {
      // TODO: Setear lista de productos   setDataSource(props.edit)
      const formatProductsList = data => {
        let _productsList
        if (props.listType === 'ENTRY') {
          _productsList = data.map(p => ({
            id: p.item_line + 1,
            product: p.presentation.description,
            units: p.quantity,
            price: p.unit_price,
          }))
        } else {
          _productsList = data.map(p => ({
            id: p.item_line + 1,
            product: p.product_id,
            units: p.quantity,
            price: p.unit_price,
          }))
        }
        setDataSource(_productsList)
      }
      formatProductsList(props.edit.purchase_details)
    }

    return () => {
      setDataSource(JSON.parse(initDataSource))
    }
    // react-hooks/exhaustive-deps
  }, [props.visible, props.edit, props.listType, initDataSource])

  useEffect(() => {
    setDataSource(JSON.parse(initDataSource))
    setProductsList(props.productList)
    // eslint-disable-next-line
  }, [props.productList])

  const getProducts = () => {
    inventorySrc
      .getAllProducts()
      .then(products => {
        setProductsList(products.data)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los productos.')
      })
  }

  const getPresentations = () => {
    setData([])
    inventorySrc
      .getAllPresentations()
      .then(presentations => {
        setProductsList(presentations.data)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los productos.')
      })
  }

  const onAdd = () => {
    const newRow = Object.assign(JSON.parse(initDataSource)[0], { id: dataSource.length + 1 })
    const newDataSource = [...dataSource, newRow]
    setDataSource(newDataSource)
  }

  const onSetData = (e, rowId, name) => {
    const inputName = name ? name : e.target.name
    const value = name ? parseInt(e) : e.target.value
    const newDataSource = dataSource.map(row => {
      if (row.id === rowId) {
        return Object.assign(row, { [inputName]: value })
      }
      return row
    })
    setDataSource(newDataSource)
  }

  const onDelete = (e, rowId) => {
    if (dataSource.length === 1) return
    let newDataSource = dataSource.filter(row => row.id !== rowId)
    newDataSource.map((row, i) => (row.id = i + 1))
    setDataSource(newDataSource)
  }

  const fetchPresentations = value => {
    setData([])
    setFetching(true)
    inventorySrc
      .searchPresentations(value)
      .then(res => {
        const data = res.data.map(p => ({
          id: p.id,
          description: p.description,
        }))
        setData(data)
        setFetching(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar las presentaciones.')
      })
  }

  const handleChange = value => {
    setFetching(false)
  }

  return (
    <>
      <h4 className={'section-space-list-bottom'}>Productos</h4>
      <List
        id={'inventory-list'}
        size="small"
        rowKey="id"
        dataSource={dataSource}
        renderItem={row => (
          <List.Item>
            <Row gutter={16} align="bottom" className={'section-space-field w-100'} key={row.id}>
              <Col sm={1}>
                <div className={'title-space-bottom text-bold'}>{row.id}</div>
              </Col>
              <Col sm={style.productCol}>
                <div className={'title-space-field pl-2'}>Elige un producto</div>
                {props.listType === 'ENTRY' || props.listType === 'TRANSFER' ? (
                  <Select
                    disabled={props.visible && (!Utils.isObjEmpty(props.edit) || props.total === '') ? true : false}
                    className={'single-select'}
                    showSearch
                    value={row.product}
                    placeholder="Nombre o SKU de presentación"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={debounce(fetchPresentations, 800)}
                    onChange={e => {
                      handleChange(e)
                      onSetData(e, row.id, 'product')
                    }}
                    size={'large'}
                    style={{ width: '100%' }}
                  >
                    {data.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.description}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    disabled={props.visible && (!Utils.isObjEmpty(props.edit) || props.total === '' || props.disabled) ? true : false}
                    value={row.product}
                    className={'single-select'}
                    placeholder={'Nombre de producto'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={product => onSetData(product, row.id, 'product')}
                  >
                    {productsList &&
                      productsList.map(product => (
                        <Option key={product.id} value={product.id}>
                          {product.description}
                        </Option>
                      ))}
                  </Select>
                )}
              </Col>
              <Col sm={style.unitsCol} style={{ display: style.unitsColHide ? 'none' : 'block' }}>
                <div className={'title-space-field text-center'}>No. Unidades</div>
                <Input
                  disabled={props.visible && (!Utils.isObjEmpty(props.edit) || props.total === '') ? true : false}
                  value={row.units}
                  onChange={e => onSetData(e, row.id)}
                  placeholder={'No. Unidades'}
                  name={'units'}
                  size={'large'}
                />
              </Col>
              <Col sm={style.priceCol} style={{ display: style.priceColHide ? 'none' : 'block' }}>
                <div className={'title-space-field text-center'}>Costo unitario</div>
                <Input
                  disabled={props.visible && (!Utils.isObjEmpty(props.edit) || props.total === '') ? true : false}
                  value={row.price}
                  onChange={e => onSetData(e, row.id)}
                  placeholder={'Precio unitario'}
                  name={'price'}
                  size={'large'}
                  type="number"
                />
              </Col>
              <Col sm={style.totalCol} style={{ display: style.totalColHide ? 'none' : 'block' }}>
                <div className={'title-space-field text-center'}>Total</div>
                <Input disabled={true} value={Number(row.units * row.price).toFixed(2)} placeholder={'Total'} name={'total'} size={'large'} />
              </Col>
              <Col sm={style.remainingCol} style={{ display: style.remainingColHide ? 'none' : 'block' }}>
                <div className={'title-space-field text-center'}>En inventario</div>
                <Input
                  disabled={true}
                  value={row.remaining}
                  onChange={e => onSetData(e, row.id)}
                  placeholder={'Cantidad'}
                  name={'remaining'}
                  size={'large'}
                />
              </Col>
              <Col sm={style.newQuantityCol} style={{ display: style.newQuantityColHide ? 'none' : 'block' }}>
                <div className={'title-space-field text-center'}>Nueva cantidad</div>
                {props.disabled ? (
                  <Input
                    disabled={props.disabled}
                    value={''}
                    onChange={e => props.newQuantity(e, row.id)}
                    placeholder={'Cantidad'}
                    name={'newQuantity'}
                    size={'large'}
                  />
                ) : (
                  <Input
                    onChange={e => props.newQuantity(e, row.id)}
                    placeholder={'Cantidad'}
                    name={'newQuantity'}
                    size={'large'}
                  />
                )}
              </Col>
              <Col sm={3} className={'center-flex-div'}>
                {props.visible && !Utils.isObjEmpty(props.edit) ? (
                  ''
                ) : (
                  <Button type={'link'} className="title-space-bottom cancel-button px-0 m-0" onClick={e => onDelete(e, row.id)}>
                    Eliminar
                  </Button>
                )}
              </Col>
            </Row>
          </List.Item>
        )}
        footer={
          props.visible && !Utils.isObjEmpty(props.edit) ? (
            ''
          ) : (
            <Row gutter={16} className={'section-space-field'}>
              <Col sm={1}></Col>
              <Col sm={10}>
                <div className="title-tendero dashed-border-button" onClick={onAdd}>
                  <svg className={'svg'} viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path className={'path'} d="M0,0 300,0 300,100 0,100z" />
                  </svg>
                  <span className={'text'}>Agregar Producto</span>
                </div>
              </Col>
              <Col sm={13}></Col>
            </Row>
          )
        }
      />
    </>
  )
}

export default InventoryList

InventoryList.defaultProps = {
  edit: {},
}
