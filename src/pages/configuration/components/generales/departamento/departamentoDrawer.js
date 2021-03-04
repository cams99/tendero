import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../../../utils/Utils'

const { Option } = Select
const { Title } = Typography

function DepartamentoDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')
  const [countryId, setCountryId] = useState(null)
  const [regionId, setRegionId] = useState(null)
  const [regionSelectEnable, setRegionSelectEnable] = useState(true)
  /*SELECT INFO*/
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(false)
  /*HANDLERS*/
  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setCountryId(props.edit ? props.editData.country : null)
    setRegionId(props.edit ? props.editData.region : null)
    setRegionSelectEnable(true)
    if (props.edit && props.visible) {
      onSearchCountryAndRegion('', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchCountry('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearchCountryAndRegion = (countryName, regionName) => {
    setLoading(true)
    Utils.getCountryOption(countryName)
      .then(response => {
        setCountries(response.data.data)
      })
      .then(_ => {
        Utils.getRegionsByCountryId(regionName, props.editData.country).then(response => {
          setRegions(response.data.data)
        })
        setRegionSelectEnable(false)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchRegion = val => {
    Utils.getRegionsByCountryId(val, countryId)
      .then(response => {
        console.log(response)
        setRegions(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

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

  const onChangeCountry = _countryId => {
    setCountryId(_countryId)
    Utils.getRegionsByCountryId('', _countryId).then(response => {
      setRegionId(null)
      setRegions(response.data.data)
      setRegionSelectEnable(false)
    })
  }

  const onSaveButton = () => {
    if ([name, regionId].includes('') || [name, regionId].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
      region_id: regionId,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar Departamento/Estado' : 'Nuevo Departamento/Estado'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre Departamento/Estado'} size={'large'} />
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
                onSearch={onSearchCountry}
                onChange={value => onChangeCountry(value)}
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
                className={'single-select'}
                style={{ width: '100%' }}
                value={regionId}
                onSearch={onSearchRegion}
                onChange={value => setRegionId(value)}
                placeholder={'Selecciona region al que pertenece'}
                size={'large'}
                disabled={regionSelectEnable}
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
          </Row>
          {/*End Fields section*/}
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

export default DepartamentoDrawer
