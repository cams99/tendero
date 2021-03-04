import React, { useEffect, useState } from 'react'
import Utils from '../../../../../utils/Utils'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'

const { Option } = Select
const { Title } = Typography

function BrandsDrawer(props) {
  // getMakersOptions
  /*VALUES*/
  const [name, setName] = useState('')
  const [makerId, setMakerId] = useState(null)
  const [loading, setLoading] = useState(false)
  /*SELECT INFO*/
  const [makers, setMakers] = useState([])

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setMakerId(props.edit ? props.editData.maker_id : null)

    if (props.edit && props.visible) {
      onSearchMakers('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchMakers('')
  }, [])

  /*HANDLERS*/
  const onSearchMakers = val => {
    setLoading(true)
    Utils.getMakersOptions(val)
      .then(response => {
        setMakers(response.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de fabricantes')
      })
  }

  const onSaveButton = () => {
    if ([name, makerId].includes('') || [name, makerId].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
      maker_id: makerId,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar Marca' : 'Nueva Marca'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre de marca'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Fabricante</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={makerId}
                onChange={value => setMakerId(value)}
                placeholder={'Seleccionar fabricante'}
                onSearch={onSearchMakers}
                size={'large'}
              >
                {makers &&
                  makers.map(data => {
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
                <Button htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
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

export default BrandsDrawer
