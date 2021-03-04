import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Popconfirm, Row, Select, Table, Typography, Spin } from 'antd'
import Utils from '../../../../utils/Utils'

const { Title } = Typography
const { Option } = Select

function ComboDrawer(props) {
  const [dynamicTableDataSource, setDynamicTableDataSource] = useState([])

  const [description, setDescription] = useState('')
  const [includePresentations, setIncludePresentations] = useState([])
  const [suggestedPrice, setSuggestedPrice] = useState('')
  const [loadingField, setLoadingField] = useState(true)
  const [loadingFieldTurns, setLoadingFieldTurns] = useState(true)

  const [presentations, setPresentations] = useState('')

  const [shops, setShops] = useState([])
  const [turns, setTurns] = useState([])

  useEffect(() => {
    if (props.visible) {
      onSearchPresentations('')
      onSearchShops('')
      onSearchTurns('')

      setDescription(props.edit ? props.editData.description : '')
      setIncludePresentations(
        props.edit && props.editData?.presentations
          ? props.editData.presentations.map(value => {
              return value?.id ? value.id : null
            })
          : []
      )
      setSuggestedPrice(props.edit ? props.editData.suggested_price : '')

      setDynamicTableDataSource(
        props.edit && props?.editData && props.editData?.presentation_combos_stores_turns
          ? props.editData.presentation_combos_stores_turns.map(value => {
              let _dataSource = {
                suggested_price: value.suggested_price,
                store_id: value?.store && value.store?.id ? value.store.id : null,
                turns: [value?.turn && value.turn?.id ? value.turn.id : ''],
              }
              return _dataSource
            })
          : []
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchPresentations = val => {
    Utils.getPresentationsOption(val)
      .then(response => {
        setPresentations(response.data.data)
        setLoadingField(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de presentaciones')
      })
  }

  const onSearchShops = val => {
    Utils.getStoreOption(val)
      .then(response => {
        setShops(response.data.data)
        setLoadingField(false)
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
        setLoadingField(false)
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
          shop: null,
          schedule: [],
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
        tmpState[indexRow].suggested_price = value
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
      title: 'Precio sugerido',
      dataIndex: 'price', // Field that is goint to be rendered
      key: 'price',
      render: (text, record, indexRow) => (
        <Input
          value={record.suggested_price}
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
          disabled={loadingFieldTurns || !record.store_id}
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
          <Popconfirm title={'Seguro de eliminar?'} onConfirm={() => deleteItem(index)}>
            <span style={{ color: 'red' }}>Eliminar</span>
          </Popconfirm>
        </>
      ),
    },
  ]
  // END HANDLERS DYNAMIC TABLE

  const onSave = () => {
    let _combos = {
      description: description,
      suggested_price: suggestedPrice,
      presentations: includePresentations,
      prices: dynamicTableDataSource,
    }

    let msn = Utils.isEmptyCombos(_combos)
    if (msn) {
      message.error(`Todos los campos son Obligatorios`)
      return false
    } else if (!Number(suggestedPrice) || suggestedPrice.includes('-') || suggestedPrice.includes('+')) {
      message.warning(`El campo Precio sugerido debe ser un número`)
    }

    let _valida = false
    dynamicTableDataSource.map(dataSrc => {
      if (
        [dataSrc.suggested_price, dataSrc.store_id, dataSrc.turns].includes(null) ||
        [dataSrc.suggested_price, dataSrc.store_id, dataSrc.turns].includes(undefined) ||
        [dataSrc.suggested_price, dataSrc.store_id, dataSrc.turns].includes('') ||
        dataSrc.turns.length === 0
      ) {
        _valida = true
      } else if (!Number(dataSrc.suggested_price) || dataSrc.suggested_price.includes('-') || dataSrc.suggested_price.includes('+')) {
        message.warning(`El campo Precio sugerido en la tabla de turnos debe ser un número`)
      }
      return true
    })
    if (_valida) {
      return message.warning('Debes completar la informacion de turnos.')
    }

    props.saveButton(props.edit, _combos, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <Spin spinning={loadingField}>
          <div className={'products-container-combo-tabs'}>
            <Title> {props.edit ? 'Editar Combo' : 'Nuevo Combo'} </Title>
            <Divider className={'divider-custom-margins-users'} />
            {/*Fields section*/}
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field'}>Descripcion</div>
                <Input
                  value={description}
                  onChange={value => setDescription(value.target.value)}
                  placeholder={'Descripcion del combo'}
                  size={'large'}
                />
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className={'title-space-field'}>Presentaciones que incluye*</div>
                <Select
                  showSearch
                  disabled={loadingField}
                  optionFilterProp="children"
                  mode="multiple"
                  className={'single-select product-custom-select'}
                  placeholder={'Seleccionar presentaciones'}
                  size={'large'}
                  style={{ width: '100%' }}
                  value={includePresentations}
                  onChange={value => setIncludePresentations(value)}
                  onSearch={onSearchPresentations}
                >
                  {presentations &&
                    presentations.map(data => {
                      return (
                        <Option key={data.id} value={data.id}>
                          {data.description}
                        </Option>
                      )
                    })}
                </Select>
              </Col>
            </Row>
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={8} sm={8} md={8} lg={8}>
                <div className={'title-space-field'}>Precio sugerido*</div>
                <Input
                  value={suggestedPrice}
                  onChange={value => setSuggestedPrice(value.target.value)}
                  placeholder={'Escribir un precio'}
                  size={'large'}
                />
              </Col>
            </Row>
            {/*End Fields section*/}

            {/*Dinamic Table*/}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  className={'CustomTableClass'}
                  pagination={false}
                  columns={columns}
                  dataSource={dynamicTableDataSource.map((x, index) => ({ ...x, index }))}
                  rowKey={'index'}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Button type="dashed" className={'shop-add-turn'} onClick={handlerAdd}>
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
                  <Button type={'link'} className="cancel-button" onClick={() => props.cancelButton()}>
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
export default ComboDrawer
