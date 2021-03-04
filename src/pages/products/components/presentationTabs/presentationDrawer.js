import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Radio, Row, Select, Typography } from 'antd'
import Utils from '../../../../utils/Utils'

const { Title } = Typography
const { Option } = Select
function PresentationDrawer(props) {
  const [description, setDescription] = useState('')
  const [productId, setProductId] = useState(null)
  const [minimalGroup, setMinimalGroup] = useState(false)
  const [numberOfUnits, setNumberOfUnits] = useState('')
  const [price, setPrice] = useState('')
  const [loadingField, setLoadingField] = useState(true)
  const [products, setProducts] = useState([])

  useEffect(() => {
    setDescription(props.edit ? props.editData.description : '')
    setProductId(props.edit ? props.editData.product_id : null)
    setMinimalGroup(props.edit ? props.editData.is_grouping === 1 : false)
    setNumberOfUnits(props.edit ? props.editData.units : '')
    setPrice(props.edit ? props.editData.price : '')

    if (props.visible) {
      onSearchProducts(props.edit ? props.editData.product_name : '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchProducts = val => {
    val = val === null ? '' : val
    Utils.getProductsOption(val)
      .then(response => {
        setProducts(response.data.data)
        setLoadingField(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de fabricantes')
      })
  }

  const onSave = () => {
    let _presentation = {
      product_id: productId,
      description: description,
      price: price,
      is_grouping: minimalGroup ? 1 : 0,
      units: minimalGroup ? numberOfUnits : 1,
    }

    let msn = Utils.isEmpty(_presentation)
    if (msn) {
      return message.error(`Todos los campos son Obligatorios`)
    } else if (minimalGroup && numberOfUnits <= 1) {
      return message.error(`El número de unidades debe ser mayor a 1`)
    }
    props.saveButton(props.edit, _presentation, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-tabs'}>
          <Title> {props.edit ? 'Editar presentacion' : 'Nueva Presentacion'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Descripcion</div>
              <Input
                value={description}
                onChange={value => setDescription(value.target.value)}
                placeholder={'Descripcion del nuevo producto'}
                size={'large'}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Producto al que pertenece*</div>
              <Select
                disabled={loadingField}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                placeholder={'Seleccionar producto al que pertenece'}
                size={'large'}
                style={{ width: '100%' }}
                value={productId}
                onChange={value => setProductId(value)}
                onSearch={onSearchProducts}
                getPopupContainer={trigger => trigger.parentNode}
              >
                {products &&
                  products.map(data => {
                    return (
                      <Option key={data.id} value={data.id}>
                        {data.description}
                      </Option>
                    )
                  })}
              </Select>
            </Col>
          </Row>
          {/*End Fields section*/}
          {/*Radio button section*/}
          <Row gutter={16} className={'section-space-list section-space-list-bottom'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <span className={'label-bold-500 presentation-ratio-button-labels'}>¿Es agrupacion de la expresion minima del producto?</span>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Radio.Group
                className={'radio-group'}
                optionType="button"
                buttonStyle="solid"
                size={'large'}
                value={minimalGroup}
                onChange={value => setMinimalGroup(value.target.value)}
              >
                <Radio.Button value={false}>No</Radio.Button>
                <Radio.Button value={true}>Si</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          {/*End Radio button section*/}

          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={16} sm={16} md={16} lg={16}>
              <div className={'title-space-field'}>Numero de unidades de la expresion minima del producto</div>
              <Input
                disabled={!minimalGroup}
                value={minimalGroup ? numberOfUnits : 1}
                onChange={value => setNumberOfUnits(value.target.value)}
                placeholder={'Escribir numero de unidades de la expresion minima del producto'}
                size={'large'}
                type={'number'}
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Precio sugerido</div>
              <Input
                value={price}
                onChange={value => setPrice(value.target.value)}
                placeholder={'Escribe un precio'}
                size={'large'}
                type={'number'}
              />
            </Col>
          </Row>
          {/*End Fields section*/}
        </div>
        <div>
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
        </div>
        {/*End Footer buttons section*/}
      </Drawer>
    </>
  )
}

export default PresentationDrawer
