import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../../../utils/Utils'

const { Option } = Select

const { Title } = Typography

function MunicipioDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')
  const [countryId, setCountryId] = useState(null)
  const [regionId, setRegionId] = useState(null)
  const [stateId, setStateId] = useState(null)
  const [loading, setLoading] = useState(false)

  /*SELECT INFO*/
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])

  const [regionSelectEnable, setRegionSelectEnable] = useState(true)
  const [statesSelectEnable, setStatesSelectEnable] = useState(true)

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setCountryId(props.edit ? props.editData.country : null)
    setRegionId(props.edit ? props.editData.region : null)
    setStateId(props.edit ? props.editData.state_id : null)

    if (props.edit && props.visible) {
      onSearchFilters('', '', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchCountry('')
    onSearchRegions('')
    onSearchState('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*HANDLERS*/
  const onSearchCountry = val => {
    setRegionSelectEnable(true)
    Utils.getCountryOption(val)
      .then(response => {
        setCountries(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchFilters = (countryName, regionName, stateName) => {
    setLoading(true)
    Utils.getCountryOption(countryName)
      .then(response => {
        setCountries(response.data.data)
      })
      .then(_ => {
        Utils.getRegionsByCountryId(regionName, props.editData.country).then(response => {
          setRegions(response.data.data)
        })
      })
      .then(_ => {
        Utils.getStateByRegionId(stateName, props.editData.region).then(response => {
          setStates(response.data.data)
          setLoading(false)
          setRegionSelectEnable(false)
          setStatesSelectEnable(false)
        })
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchRegions = filterName => {
    setStatesSelectEnable(true)
    Utils.getRegionsByCountryId(filterName, countryId)
      .then(response => {
        setRegions(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchState = val => {
    Utils.getStateByRegionId(val, regionId)
      .then(response => {
        setStates(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onChangeCountry = _countryId => {
    setCountryId(_countryId)
    Utils.getRegionsByCountryId('', _countryId).then(response => {
      setRegionId(null)
      setStateId(null)
      setRegions(response.data.data)
      setRegionSelectEnable(false)
      setStatesSelectEnable(true)
    })
  }

  const onChangeRegion = _regionId => {
    setRegionId(_regionId)
    Utils.getStateByRegionId('', _regionId).then(response => {
      setStateId(null)
      setStates(response.data.data)
      setStatesSelectEnable(false)
    })
  }

  const onSaveButton = () => {
    if ([name, countries, regions, states].includes('') || [name, countries, regions, states].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
      state_id: stateId,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
    onClose()
  }

  const onClose = () => {
    setName('')
    setCountryId(null)
    setRegionId(null)
    setStateId(null)
    setRegionSelectEnable(true)
    setStatesSelectEnable(true)
    props.closable()
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={onClose} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar Municipio/Localidad' : 'Nuevo Municipio/Localidad'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre Municipio/Localidad'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>País al que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={countryId}
                onChange={value => onChangeCountry(value)}
                onSearch={onSearchCountry}
                placeholder={'Selecciona país al que pertenece'}
                size={'large'}
              >
                {countries &&
                  countries.map(data => {
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
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Region a la que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                disabled={regionSelectEnable}
                className={'single-select'}
                style={{ width: '100%' }}
                value={regionId}
                onChange={value => onChangeRegion(value)}
                onSearch={onSearchRegions}
                placeholder={'Selecciona region al que pertenece'}
                size={'large'}
              >
                {regions &&
                  regions.map(data => {
                    return (
                      <Option key={data.id} value={data.id}>
                        {data.name}
                      </Option>
                    )
                  })}
              </Select>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Departamento/Estado a la que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                disabled={statesSelectEnable}
                className={'single-select'}
                style={{ width: '100%' }}
                value={stateId}
                onChange={value => setStateId(value)}
                onSearch={onSearchState}
                placeholder={'Selecciona Departamento/Estado al que pertenece'}
                size={'large'}
              >
                {states &&
                  states.map(data => {
                    return (
                      <Option key={data.id} value={data.id}>
                        {data.name}
                      </Option>
                    )
                  })}
              </Select>
            </Col>
          </Row>
          {/*End Fields section*/}
        </div>
        <Divider className={'divider-custom-margins-users'} />
        {/*Footer buttons section*/}
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button type={'link'} className="cancel-button" onClick={onClose}>
                  Cancelar
                </Button>
                <Button loading={loading} htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        {/*End Footer buttons section*/}
      </Drawer>
    </>
  )
}

export default MunicipioDrawer
