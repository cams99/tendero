import React, { useEffect, useState, useContext } from 'react'
import { Col, Row, Input, Select, Button, List, message, Spin } from 'antd'
import debounce from 'lodash/debounce'
import PosSrc from '../../PosSrc'
import DBService from '../../../../utils/DBService'

// Context
import { Context, useStore } from '../../../../context'

const { Option } = Select

function SellProductList(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const initDataSource = JSON.stringify([{ id: 1, product: null, units: '', price: '', total: 0, type: '' }])
  const [productsList, setProductsList] = useState([])
  const [dataSource, setDataSource] = useState(JSON.parse(initDataSource))
  const [data, setData] = useState([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.store.id, props.turn.id])

  useEffect(() => {
    props.products(dataSource)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])

  useEffect(() => {
    if (props.edit) setDataSource(props.productsList)
    // eslint-disable-next-line
  }, [props.edit])

  useEffect(() => {
    if (props.isSellCancelled) {
      props.uncancellSell && props.uncancellSell()
      setDataSource(JSON.parse(initDataSource))
    }
    // eslint-disable-next-line
  }, [props.isSellCancelled])

  const fetchProducts = async () => {
    PosSrc.getAllProducts(props.store.id, props.turn.id)
      .then(async products => {
        if (!products) {
          let _productsList = await DBService.getAll('products')
          setProductsList(_productsList)
        } else {
          setProductsList(products.data)
          DBService.add(products.data, 'products')
        }
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

  const onSetProduct = (product, row) => {
    let typeInfo = product.split('-')
    let productInfo = productsList.find(p => p.id === Number(typeInfo[0]) && p.type === typeInfo[1])
    onSetData(productInfo?.id, row.id, 'product')
    onSetData(productInfo?.type, row.id, 'type')
    onSetData(productInfo?.price, row.id, 'price')
    onSetData(row.price * (row.units !== '' ? row.units : 0), row.id, 'total')
  }

  const onSetPrice = (e, row) => {
    onSetData(e, row.id)
    onSetData(row.price * (row.units !== '' ? row.units : 0), row.id, 'total')
  }

  const onSetUnits = (e, row) => {
    onSetData(e, row.id)
    onSetData(row.price * (row.units !== '' ? row.units : 0), row.id, 'total')
  }

  const onSetData = (e, rowId, name) => {
    const inputName = name ? name : e.target.name
    const value = name ? e : e.target.value
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
    PosSrc.searchPresentations(props.store.id, props.turn.id, value)
      .then(res => {
        const data = res.data.map(p => ({
          id: p.id,
          description: p.description,
          price: p.price,
          type: p.type,
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
      <h4 className={'section-space-list-bottom'}>Lista de productos</h4>
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
              <Col sm={9}>
                {row.id === 1 && <div className={'title-space-field pl-2'}>Productos</div>}
                <Select
                  className={'single-select'}
                  showSearch
                  value={productsList?.find(p => p.id === row.product && p.type === row.type)?.description}
                  placeholder="Nombre o SKU del producto"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounce(fetchPresentations, 800)}
                  onChange={e => {
                    handleChange(e)
                    onSetProduct(e, row)
                  }}
                  size={'large'}
                  style={{ width: '100%' }}
                >
                  {data.map((d, i) => (
                    <Option key={i} value={`${d.id}-${d.type}`}>
                      {d.description}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col sm={4}>
                {row.id === 1 && <div className={'title-space-field text-center'}>Precio unitario</div>}
                <Input
                  disabled={!row.product ? true : !hasPermissions([51])}
                  value={row.price}
                  onChange={e => onSetPrice(e, row)}
                  placeholder={'Precio unitario'}
                  name={'price'}
                  size={'large'}
                  min="0"
                  type="number"
                />
              </Col>
              <Col sm={4}>
                {row.id === 1 && <div className={'title-space-field text-center'}>No. Unidades</div>}
                <Input
                  disabled={!row.product && true}
                  value={row.units}
                  onChange={e => onSetUnits(e, row)}
                  placeholder={'No. Unidades'}
                  name={'units'}
                  size={'large'}
                  min="0"
                  type="number"
                />
              </Col>
              <Col sm={3}>
                {row.id === 1 && <div className={'title-space-field text-center'}>Total</div>}
                <Input
                  disabled={true}
                  value={`Q ${(row.units * row.price)?.toFixed(2)}`}
                  placeholder={'Q 0.00'}
                  name={'total'}
                  size={'large'}
                  min="0"
                  className="total-product"
                />
              </Col>
              <Col sm={3} className={'center-flex-div'}>
                <Button type={'link'} className="title-space-bottom cancel-button px-0 m-0" onClick={e => onDelete(e, row.id)}>
                  Eliminar
                </Button>
              </Col>
            </Row>
          </List.Item>
        )}
        footer={
          <Row gutter={16} className={'section-space-field'}>
            <Col sm={1}></Col>
            <Col sm={9}>
              <div className="title-tendero dashed-border-button" onClick={onAdd}>
                <svg className={'svg'} viewBox="0 0 300 100" preserveAspectRatio="none">
                  <path className={'path'} d="M0,0 300,0 300,100 0,100z" />
                </svg>
                <span className={'text'}>Agregar Producto</span>
              </div>
            </Col>
            <Col sm={14}></Col>
          </Row>
        }
      />
    </>
  )
}

export default SellProductList
