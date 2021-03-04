import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Popconfirm, Row, Select, Table, Typography, Spin, Checkbox } from 'antd'
import Utils from '../../../../utils/Utils'
import productSrc from '../../productSrc'

const { Title } = Typography
const { Option } = Select

function PresentationAssignDrawer(props) {
  const [dynamicTableDataSource, setDynamicTableDataSource] = useState([])

  const [description, setDescription] = useState('')
  const [suggestedPrice, setSuggestedPrice] = useState('')
  const [loadingField, setLoadingField] = useState(true)
  const [loadingFieldTurns, setLoadingFieldTurns] = useState(true)
  const [applyAll, setApplyAll] = useState(false)
  const [globalPrice, setGlobalPrice] = useState(null)
  const [company, setCompany] = useState('')

  const [shops, setShops] = useState([])
  const [turns, setTurns] = useState([])

  useEffect(() => {
    if (props.visible) {
      fetchPresentation(props.data)
      onSearchShops('')
      onSearchTurns('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const fetchPresentation = data => {
    setLoadingField(true)
    productSrc
      .presentationTurn(data.id)
      .then(response => {
        setDescription(response.description)
        setCompany(response.company.name)
        setSuggestedPrice(response.price)
        setDynamicTableDataSource(setPrices(response.prices))
        setLoadingField(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de tiendas')
      })
  }

  const onSearchShops = val => {
    Utils.getStoreOption(val)
      .then(response => {
        setShops(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de tiendas')
      })
  }
  const onSearchTurns = val => {
    Utils.getTurns(val)
      .then(response => {
        setTurns(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de tiendas')
      })
  }

  // HANDLERS DYNAMIC TABLE
  const handlerAdd = () => {
    setDynamicTableDataSource(
      dynamicTableDataSource.concat([
        {
          price: null,
          store_id: null,
          turns: [],
        },
      ])
    )
  }
  const deleteItem = index => {
    setDynamicTableDataSource(dynamicTableDataSource.filter((item, ind) => ind !== index))
  }
  const handleChangeValues = (value, indexRow, key, type) => {
    let tmpState = [...dynamicTableDataSource]
    switch (type) {
      case 'price':
        tmpState[indexRow].price = value
        break
      case 'shop':
        setLoadingFieldTurns(true)
        tmpState[indexRow].store_id = value
        Utils.getTurnsById('', value)
          .then(response => {
            setTurns(response.data.data)
            setLoadingFieldTurns(false)
          })
          .catch(err => {
            console.log(err)
            message.error('No se ha podido cargar la informacion de turnos')
          })
        break
      case 'schedule':
        tmpState[indexRow].turns = value
        break
      default:
        break
    }
    setDynamicTableDataSource(tmpState)
  }

  const columns = [
    {
      title: 'Precio',
      dataIndex: 'price', // Field that is goint to be rendered
      key: 'price',
      render: (text, record, indexRow) => (
        <Input
          disabled={applyAll}
          value={record.price}
          size={'large'}
          placeholder={'Ingresa precio'}
          onChange={event => handleChangeValues(event.target.value, indexRow, record._id, 'price')}
        />
      ),
    },
    {
      title: 'Tienda a la que aplica',
      dataIndex: 'shop', // Field that is goint to be rendered
      key: 'shop',
      render: (text, record, indexRow) => (
        <Select
          disabled={applyAll}
          className={'single-select'}
          placeholder={'Selecciona una tienda'}
          size={'large'}
          style={{ width: '100%' }}
          value={record.store_id}
          getPopupContainer={trigger => trigger.parentNode}
          onChange={value => {
            handleChangeValues(value, indexRow, record.store_id, 'shop')
            handleChangeValues('', indexRow, record.turns, 'schedule')
          }}
        >
          {shops &&
            shops.map(data => {
              return (
                <Option key={data.id} value={data.id}>
                  {data.name}
                </Option>
              )
            })}
        </Select>
      ),
    },
    {
      title: 'Horarios al que aplica',
      dataIndex: 'schedule', // Field that is goint to be rendered
      key: 'schedule',
      render: (text, record, indexRow) => (
        <Select
          disabled={loadingFieldTurns || applyAll || !record.store_id}
          mode={'multiple'}
          className={'single-select product-custom-select'}
          placeholder={'Selecciona un horario'}
          size={'large'}
          style={{ width: '100%' }}
          value={!record.turns ? [] : record.turns}
          onChange={value => handleChangeValues(value, indexRow, record.turns, 'schedule')}
        >
          {turns &&
            turns.map(data => {
              return (
                <Option key={data.id} value={data.id}>
                  {data.start_time} - {data.end_time}
                </Option>
              )
            })}
        </Select>
      ),
    },
    {
      title: '',
      dataIndex: '_id',
      render: (text, record, index) => (
        <>
          <Popconfirm disabled={applyAll} title={'Seguro de eliminar?'} onConfirm={() => deleteItem(index)}>
            <span style={{ color: 'red' }}>Eliminar</span>
          </Popconfirm>
        </>
      ),
    },
  ]
  // END HANDLERS DYNAMIC TABLE

  const onSave = () => {
    let _prices
    if (applyAll) {
      if (!Number(globalPrice) || globalPrice.includes('-') || globalPrice.includes('+')) {
        message.warning(`El campo Precio global debe ser un número`)
        return false
      }
      _prices = {
        apply_for_all: 1,
        global_price: globalPrice,
        prices: [],
      }
    } else {
      let _valida = false
      dynamicTableDataSource.map(dataSrc => {
        if (
          [dataSrc.price, dataSrc.store_id, dataSrc.turns].includes(null) ||
          [dataSrc.price, dataSrc.store_id, dataSrc.turns].includes(undefined) ||
          [dataSrc.price, dataSrc.store_id, dataSrc.turns].includes('') ||
          dataSrc.turns.length === 0
        ) {
          _valida = true
        } else if (!Number(dataSrc.price) || dataSrc.price.includes('-') || dataSrc.price.includes('+')) {
          message.warning(`El campo Precio en la tabla de turnos debe ser un número`)
        }
        return true
      })
      if (dynamicTableDataSource.length === 0 || _valida) {
        return message.warning('Debes completar la informacion de turnos.')
      }
      console.log(dynamicTableDataSource)
      _prices = {
        apply_for_all: 0,
        global_price: 0,
        prices: setPrices(dynamicTableDataSource, 'save'),
      }
    }

    productSrc
      .savePresentationTurn(props.data.id, _prices)
      .then(response => {
        if (response.errors && Object.keys(response.errors).length > 0) {
          Object.keys(response.errors).map(error => message.error(response.errors[error]))
        } else {
          message.success('Informacion guardada.')
          onClose()
        }
      })
      .catch(e => {
        console.log(e)
        message.error('Error al guardar la informacion.')
      })
  }

  const setPrices = (prices, action = 'received') => {
    if (action === 'save') {
      return prices.map(p => ({
        price: p.price,
        turns: p.turns.map(t => ({
          id: t,
        })),
      }))
    } else {
      return prices.map(p => ({
        price: p.price,
        store_id: p.store_id,
        turns: p.turns.map(t => t.id),
      }))
    }
  }

  const onClose = () => {
    setGlobalPrice(null)
    setApplyAll(false)
    props.closable()
  }

  return (
    <>
      <Drawer placement="right" closable={false} className={'assign-prices'} onClose={onClose} visible={props.visible} width={800}>
        <Spin spinning={loadingField}>
          <div className={'products-container-combo-tabs'}>
            <Title>Asignar precios</Title>
            <Divider className={'divider-custom-margins-users'} />
            {/*Fields section*/}
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field'}>Presentación</div>
                <Input value={description} disabled={true} placeholder={'Nombre de presentación'} size={'large'} />
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field'}>Catálogo</div>
                <Input value={company} disabled={true} placeholder={'Nombre de catálogo'} size={'large'} />
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={6} sm={6} md={6} lg={6}>
                <div className={'title-space-field'}>Precio sugerido actual</div>
                <Input value={suggestedPrice} disabled={true} placeholder={'Precio'} size={'large'} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col offset={11} xs={6} sm={6} md={6} lg={6}>
                <div className={'title-space-field'}>Precio global</div>
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field'}>
              <Col className={'checkbox'} xs={2} sm={2} md={2} lg={2}>
                <Checkbox checked={applyAll} onChange={e => setApplyAll(e.target.checked)}></Checkbox>
              </Col>
              <Col xs={9} sm={9} md={9} lg={9}>
                <div className={'title-space-field bold black'}>¿Aplicar un precio a todas las tiendas y turnos?</div>
                <div className={'title-space-field bottom'}>Bloqueará toda excepción creada abajo</div>
              </Col>
              <Col className={'checkbox'} xs={6} sm={6} md={6} lg={6}>
                <Input
                  disabled={!applyAll}
                  value={globalPrice}
                  onChange={e => setGlobalPrice(e.target.value)}
                  placeholder={'Precio'}
                  size={'large'}
                />
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field top-padding'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field bold black'}>Excepciones</div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field bottom'}>
                  Si deseas asignar un precio especial a una tienda o turno en específico, agrégalo en la siguiente sección
                </div>
              </Col>
            </Row>
            {/*End Fields section*/}

            {/*Dinamic Table*/}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  disabled={applyAll}
                  className={'CustomTableClass'}
                  pagination={false}
                  columns={columns}
                  dataSource={dynamicTableDataSource.map((x, index) => ({ ...x, index }))}
                  rowKey={'index'}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Button disabled={applyAll} type="dashed" className={'shop-add-turn'} onClick={handlerAdd}>
                  + Agregar tienda
                </Button>
              </Col>
            </Row>
            {/*End Dinamic Table*/}
          </div>
          <Divider className={'divider-custom-margins-users'} />
          {/*Footer buttons section*/}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="text-right">
                <div>
                  <Button type={'link'} className="cancel-button" onClick={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button htmlType="submit" className="title-tendero new-button" onClick={() => onSave()}>
                    Guardar
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          {/*End Footer buttons section*/}
        </Spin>
      </Drawer>
    </>
  )
}
export default PresentationAssignDrawer
