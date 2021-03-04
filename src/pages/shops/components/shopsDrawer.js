import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Button, Col, Divider, Drawer, Input, Row, Select, Typography, Tabs, TimePicker, Popconfirm, message, Spin } from 'antd'
import DynamicTable from '../../../components/DynamicTable'
import Utils from '../../../utils/Utils'
import shopSrc from '../shopSrc'
const { Title } = Typography
const { TabPane } = Tabs
const { Option } = Select

function ShopsDrawer(props) {
  const [dataSource, setDataSource] = useState([])
  const [name, setName] = useState('')
  const [enterpriseId, setEnterpriseId] = useState('')
  const [address, setAddress] = useState('')
  const [pettyCashAmount, setPettyCashAmount] = useState('')
  const [storeTypeId, setStoreTypeId] = useState('')
  const [storeChainId, setStoreChainId] = useState('')
  const [storeFlagId, setStoreFlagId] = useState('')
  const [locationTypeId, setLocationTypeId] = useState('')
  const [storeFormatId, setStoreFormatId] = useState('')
  const [size, setSize] = useState('')
  const [socioeconomicLevelId, setSocioeconomicLevelId] = useState('')
  const [stateId, setStateId] = useState('')
  const [municipalityId, setMunicipalityId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [latitute, setLatitute] = useState('')
  const [longitude, setLongitude] = useState('')
  /*Info for selects*/
  const [enterprises, setEnterprises] = useState([])
  const [storeType, setStoreType] = useState([])
  const [storeChain, setStoreChain] = useState([])
  const [storeFlag, setStoreFlag] = useState([])
  const [storeLocation, setStoreLocation] = useState([])
  const [storeFormat, setStoreFormat] = useState([])
  const [storeSocioeconomicLevel, setStoreSocioeconomicLevel] = useState([])
  const [storeState, setStoreState] = useState([])
  const [storeZone, setStoreZone] = useState([])
  const [storeMunicipality, setStoreMunicipality] = useState([])

  const [loadingField, setLoadingField] = useState(true)
  const [loading, setLoading] = useState(true)

  const loadStoreInfo = () => {
    setName(props.edit ? props.editData._shop : '')
    setEnterpriseId(props.edit ? props.editData._enterprise_id : null)
    setAddress(props.edit ? props.editData._address : '')
    setPettyCashAmount(props.edit ? props.editData._petty_cash_amount : '')
    setStoreTypeId(props.edit ? props.editData._store_type_id : null)
    setStoreChainId(props.edit ? props.editData._store_chain_id : null)
    setStoreFlagId(props.edit ? props.editData._store_flag_id : null)
    setLocationTypeId(props.edit ? props.editData._location_type_id : null)
    setStoreFormatId(props.edit ? props.editData._store_format_id : null)
    setSize(props.edit ? props.editData._size : '')
    setSocioeconomicLevelId(props.edit ? props.editData._socioeconomic_level_id : null)
    setStateId(props.edit ? props.editData._state_id : null)
    setMunicipalityId(props.edit ? props.editData._municipality_id : null)
    setZoneId(props.edit ? props.editData._zone_id : null)
    setLatitute(props.edit ? props.editData._latitute : '')
    setLongitude(props.edit ? props.editData._longitude : '')
  }

  useEffect(() => {
    loadStoreInfo()
    if (props.visible) {
      onSearchEnterprise('')
      onSearchStoreType('')
      onSearchStoreChain('')
      onSearchStoreFlag('')
      onSearchStoreLocation('')
      onSearchStoreFormat('')
      onSearchStoreSocioeconomicLevel('')
      onSearchStoreState('')
      onSearchStoreMunicipality('')
      onSearchStoreZone('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])
  
  useEffect(() => {
    let turns = JSON.stringify(props.turns)
    setDataSource(JSON.parse(turns))
    setLoading(false)
  }, [props.turns])

  const onSearchEnterprise = val => {
    Utils.getEnterpriseOption(val)
      .then(response => {
        setEnterprises(response.data.data)
        setLoadingField(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de empresa')
      })
  }

  const onSearchStoreType = val => {
    Utils.getStoreTypeOption(val)
      .then(response => {
        setStoreType(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de tipo de negocio')
      })
  }

  const onSearchStoreChain = val => {
    Utils.getStoreChainOption(val)
      .then(response => {
        setStoreChain(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Cadena')
      })
  }

  const onSearchStoreFlag = val => {
    Utils.getStoreFlag(val)
      .then(response => {
        setStoreFlag(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Bandera')
      })
  }

  const onSearchStoreLocation = val => {
    Utils.getLocation(val)
      .then(response => {
        setStoreLocation(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Tipo de ubicacion')
      })
  }

  const onSearchStoreFormat = val => {
    Utils.getStoreFormat(val)
      .then(response => {
        setStoreFormat(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de formato de tienda')
      })
  }

  const onSearchStoreSocioeconomicLevel = val => {
    Utils.getSocioeconomicLevel(val)
      .then(response => {
        setStoreSocioeconomicLevel(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de nivel socio-economico')
      })
  }

  const onSearchStoreState = val => {
    Utils.getState(val)
      .then(response => {
        setStoreState(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Departamento/Estado')
      })
  }

  const onSearchStoreMunicipality = val => {
    Utils.getMunicipalities(val)
      .then(response => {
        setStoreMunicipality(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Municipio/Localidad')
      })
  }

  const onSearchStoreZone = val => {
    Utils.getZone(val)
      .then(response => {
        setStoreZone(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Zona/Barrio')
      })
  }

  const handlerAdd = () => {
    setDataSource(
      dataSource.concat([
        {
          name: '',
          start_time: '',
          end_time: '',
        },
      ])
    )
  }

  const checkErrors = res => {
    if (res.errors && Object.keys(res.errors)?.length > 0) {
      Object.keys(res.errors).map(key => {
        switch (key) {
          case 'name':
            message.error(res.errors[key][0].replace('name', 'Nombre'))
            break
          default:
            message.error(res.errors[key])
            break
        }
        return null
      })
      return false
    } else {
      return true
    }
  }

  const saveTurns = () => {
    let _valida = false
    if (dataSource.length === 0) {
      return message.warning('Debes completar la informacion.')
    }
    dataSource.map(dataSrc => {
      if (
        [dataSrc.name, dataSrc.start_time, dataSrc.end_time].includes(undefined) ||
        [dataSrc.name, dataSrc.start_time, dataSrc.end_time].includes('')
      ) {
        _valida = true
      }
      return true
    })
    if (_valida) return message.warning('Debes completar la informacion.')

    setLoading(true)
    let turns = async () =>
      await dataSource.map(validateMethod => {
        if (validateMethod.key === undefined) {
          let dataToSave = {
            name: validateMethod.name,
            start_time: validateMethod.start_time,
            end_time: validateMethod.end_time,
            store_id: validateMethod.store_id,
            is_active: validateMethod.is_active,
            is_default: validateMethod.is_default,
          }
          return shopSrc
            .saveTurns(dataToSave)
            .then(res => checkErrors(res))
            .catch(err => {
              console.log(err)
              message.error('No se pudo guarda la informacion de turnos.')
              setLoading(false)
            })
        } else {
          let dataToUpdate = {
            name: validateMethod.name,
            start_time: validateMethod.start_time,
            end_time: validateMethod.end_time,
            store_id: validateMethod.store_id,
            is_active: validateMethod.is_active,
            is_default: validateMethod.is_default,
          }
          return shopSrc
            .updateTurns(validateMethod.key, dataToUpdate)
            .then(res => checkErrors(res))
            .catch(err => {
              console.log(err)
              message.error('No se pudo actualizar la informacion de turnos.')
              setLoading(false)
            })
        }
      })

    turns().then(async res => {
      let boolean = await Promise.all(res)
      if (!boolean.includes(false)) {
        message.success('Turnos actualizados.')
        props.saveTurns()
      }
      setLoading(false)
    })
  }

  const deleteItem = index => {
    setDataSource(dataSource.filter((item, ind) => ind !== index))

    if (dataSource.filter((item, ind) => ind === index)[0].key !== undefined) {
      shopSrc.removeTurns(dataSource.filter((item, ind) => ind === index)[0].key).then(response => {
        message.success(`Turno elminado.`)
      })
    } else {
      message.success(`Turno elminado.`)
    }
  }

  const handleChangeValues = (value, indexRow, key, type) => {
    let tmpState = [...dataSource]
    switch (type) {
      case 'name':
        tmpState[indexRow].name = value
        tmpState[indexRow].store_id = props.editData._id
        tmpState[indexRow].is_active = 1
        tmpState[indexRow].is_default = 0
        break
      case 'startDate':
        tmpState[indexRow].start_time = value
        tmpState[indexRow].store_id = props.editData._id
        tmpState[indexRow].is_active = 1
        tmpState[indexRow].is_default = 0
        break
      case 'endDate':
        tmpState[indexRow].end_time = value
        tmpState[indexRow].store_id = props.editData._id
        tmpState[indexRow].is_active = 1
        tmpState[indexRow].is_default = 0
        break
      default:
        break
    }
    setDataSource(tmpState)
  }

  const columns = [
    {
      title: 'Nombre*',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: (text, record, indexRow) => (
        <Input
          value={record.name}
          size={'large'}
          placeholder={'Ingresa nombre'}
          onChange={event => handleChangeValues(event.target.value, indexRow, record._id, 'name')}
        />
      ),
    },
    {
      title: 'Inicio',
      dataIndex: 'start_time', // Field that is goint to be rendered
      key: 'start_time',
      render: (text, record, indexRow) => (
        <TimePicker
          value={record.start_time !== '' ? moment(record.start_time, 'HH:mm:ss') : ''}
          className={'single-time-picker'}
          placeholder={'00:00'}
          style={{ width: '100%' }}
          format={'HH:mm:ss'}
          onChange={(event, stringDate) => handleChangeValues(stringDate, indexRow, record._id, 'startDate')}
        />
      ),
    },
    {
      title: 'Finalizacion',
      dataIndex: 'end_time', // Field that is goint to be rendered
      key: 'end_time',
      render: (text, record, indexRow) => (
        <TimePicker
          value={record.end_time !== '' ? moment(record.end_time, 'HH:mm:ss') : ''}
          F
          className={'single-time-picker'}
          placeholder={'00:00'}
          style={{ width: '100%' }}
          format={'HH:mm:ss'}
          onChange={(event, stringDate) => handleChangeValues(stringDate, indexRow, record._id, 'endDate')}
        />
      ),
    },
    {
      title: '',
      dataIndex: '_name',
      render: (text, record, index) => (
        <>
          <Popconfirm title={'Seguro de eliminar?'} onConfirm={() => deleteItem(index)}>
            <span style={{ color: 'red' }}>Eliminar</span>
          </Popconfirm>
        </>
      ),
    },
  ]

  const saveStoreData = () => {
    if (!Utils.deepEqualCompare(dataSource, props.turns)) {
      return message.warning('Existen cambios en los turnos, guárdalos antes de continuar')
    }
    if (
      [
        name,
        enterpriseId,
        address,
        pettyCashAmount,
        storeTypeId,
        storeChainId,
        storeFlagId,
        locationTypeId,
        storeFormatId,
        size,
        socioeconomicLevelId,
        stateId,
        municipalityId,
        zoneId,
        latitute,
        longitude,
      ].includes('') ||
      [
        name,
        enterpriseId,
        address,
        pettyCashAmount,
        storeTypeId,
        storeChainId,
        storeFlagId,
        locationTypeId,
        storeFormatId,
        size,
        socioeconomicLevelId,
        stateId,
        municipalityId,
        zoneId,
        latitute,
        longitude,
      ].includes(null)
    ) {
      return message.warning('Todos los campos son obligatorios')
    }

    let data = {
      id: props.edit ? props.editData._id : null,
      name: name,
      company_id: enterpriseId,
      address: address,
      petty_cash_amount: pettyCashAmount,
      store_type_id: storeTypeId,
      store_chain_id: storeChainId,
      store_flag_id: storeFlagId,
      location_type_id: locationTypeId,
      store_format_id: storeFormatId,
      size: size,
      socioeconomic_level_id: socioeconomicLevelId,
      state_id: stateId,
      municipality_id: municipalityId,
      zone_id: zoneId,
      latitute: latitute,
      longitude: longitude,
    }
    props.saveButton(data, props.edit)
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <Title> {props.edit ? 'Editar Tienda' : 'Nueva Tienda'}</Title>
      <Divider className={'divider-custom-margins-users'} />
      <Tabs id={'tenderoShopTabs'} className="shop-drawer" defaultActiveKey="1">
        <TabPane tab="Datos" key="1">
          <Spin spinning={loadingField}>
            <div className={'shops-container-tabs'}>
              {/*Fields section*/}
              <Row className={'section-space-field'} gutter={16}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field'}>Nombre*</div>
                  <Input value={name} placeholder={'Nombre'} size={'large'} onChange={value => setName(value.target.value)} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className={'title-space-field'}>Empresa*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchEnterprise}
                    value={enterpriseId}
                    className={'single-select'}
                    placeholder={'Elegir empresa'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setEnterpriseId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {enterprises &&
                      enterprises.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div className={'title-space-field'}>Direccion*</div>
                  <Input value={address} placeholder={'Escbribir direccion'} size={'large'} onChange={value => setAddress(value.target.value)} />
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Monto en caja chica*</div>
                  <Input
                    disabled={props.edit && props.editData._petty_cash_amount}
                    value={pettyCashAmount}
                    placeholder={'Escribir monto'}
                    size={'large'}
                    type={'number'}
                    onChange={value => setPettyCashAmount(value.target.value)}
                  />
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Tipo de negocio*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreType}
                    value={storeTypeId}
                    className={'single-select'}
                    placeholder={'Seleccionar tipo'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setStoreTypeId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeType &&
                      storeType.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Cadena*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreChain}
                    value={storeChainId}
                    className={'single-select'}
                    placeholder={'Seleccionar cadena'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setStoreChainId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeChain &&
                      storeChain.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Bandera*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreFlag}
                    value={storeFlagId}
                    className={'single-select'}
                    placeholder={'Seleccionar bandera'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setStoreFlagId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeFlag &&
                      storeFlag.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Tipo de ubicacion*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreLocation}
                    value={locationTypeId}
                    className={'single-select'}
                    placeholder={'Seleccionar ubicacion'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setLocationTypeId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeLocation &&
                      storeLocation.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Formato de tienda*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreFormat}
                    value={storeFormatId}
                    className={'single-select'}
                    placeholder={'Seleccionar formato'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setStoreFormatId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeFormat &&
                      storeFormat.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Tamaño de tienda (mt²)*</div>
                  <Input
                    value={size}
                    placeholder={'Escribir tamaño'}
                    size={'large'}
                    type={'number'}
                    onChange={value => setSize(value.target.value)}
                  />
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Nivel socioeconomico*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreSocioeconomicLevel}
                    value={socioeconomicLevelId}
                    className={'single-select'}
                    placeholder={'Elegir nivel socioeconomico'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setSocioeconomicLevelId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeSocioeconomicLevel &&
                      storeSocioeconomicLevel.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Departamento/Estado*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreState}
                    value={stateId}
                    className={'single-select'}
                    placeholder={'Seleccionar departamento/estado'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => {
                      setStateId(value)
                      setMunicipalityId(null)
                      setZoneId(null)
                    }}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeState &&
                      storeState.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Municipio/Localidad*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreMunicipality}
                    value={municipalityId}
                    className={'single-select'}
                    placeholder={'Seleccionar municipio/localidad'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => {
                      setMunicipalityId(value)
                      setZoneId(null)
                    }}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeMunicipality &&
                      storeMunicipality.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Zona/Barrio*</div>
                  <Select
                    disabled={loadingField}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearchStoreZone}
                    value={zoneId}
                    className={'single-select'}
                    placeholder={'Seleccionar zona/barrio'}
                    size={'large'}
                    style={{ width: '100%' }}
                    onChange={value => setZoneId(value)}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {storeZone &&
                      storeZone.map(data => {
                        return (
                          <Option key={data.id} value={data.id}>
                            {data.name}
                          </Option>
                        )
                      })}
                  </Select>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Latitud*</div>
                  <Input
                    value={latitute}
                    placeholder={'Escribir latitud'}
                    size={'large'}
                    type={'number'}
                    onChange={value => setLatitute(value.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={16} className={'section-space-field'}>
                <Col xs={8} sm={8} md={8} lg={8}>
                  <div className={'title-space-field'}>Longitud*</div>
                  <Input
                    value={longitude}
                    placeholder={'Escribir longitud'}
                    size={'large'}
                    type={'number'}
                    onChange={value => setLongitude(value.target.value)}
                  />
                </Col>
              </Row>
              {/*End Fields section*/}
            </div>
          </Spin>
        </TabPane>
        <TabPane disabled={!props.edit} tab="Turnos" key="2">
          <Spin spinning={loading}>
            <div className={'shops-container-tabs'}>
              <DynamicTable columns={columns} data={dataSource} />
              <Row gutter={16} className={'section-space-list'}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button disabled={!props.edit} type="dashed" className={'shop-add-turn'} onClick={handlerAdd}>
                    Agregar turno
                  </Button>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Button disabled={!props.edit} className={'shop-add-turn'} onClick={saveTurns}>
                    Guardar turno
                  </Button>
                </Col>
              </Row>
            </div>
          </Spin>
        </TabPane>
      </Tabs>
      <Divider className={'divider-custom-margins-users'} />
      {/*Footer buttons section*/}
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button onClick={() => props.cancelButton()} type={'link'} className="cancel-button">
                Cancelar
              </Button>
              <Button loading={loadingField} className="title-tendero new-button" onClick={() => saveStoreData()}>
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      {/*End Footer buttons section*/}
    </Drawer>
  )
}
export default ShopsDrawer
