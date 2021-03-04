import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Radio, Row, Select, Typography } from 'antd'
import Utils from '../../../../utils/Utils'

const { Title } = Typography
const { Option } = Select

function SkuDrawer(props) {
  const [description, setDescription] = useState('')
  const [productId, setProductId] = useState(null)
  const [sku, setSku] = useState('')
  const [season, setSeason] = useState(false)
  const [loadingField, setLoadingField] = useState(true)
  const [products, setProducts] = useState([])

  useEffect(() => {
    setDescription(props.edit ? props.editData.description : '')
    setProductId(props.edit ? props.editData.presentation_id : null)
    setSku(props.edit ? props.editData.code : '')
    setSeason(props.edit ? props.editData.seasonal_product === 1 : false)

    if (props.visible) {
      onSearchPresentations(props.edit ? props.editData.presentation_name : '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchPresentations = val => {
    val = val === null ? '' : val
    Utils.getPresentationsOption(val)
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
    let _sku = {
      code: sku,
      description: description,
      presentation_id: productId,
      seasonal_product: season,
    }

    let msn = Utils.isEmpty(_sku)
    if (msn) {
      return message.error(` Todos los campos son Obligatorios`)
    }
    props.saveButton(props.edit, _sku, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-tabs'}>
          <Title> {props.edit ? 'Editar SKU' : 'Nuevo SKU'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Descripcion</div>
              <Input value={description} onChange={value => setDescription(value.target.value)} placeholder={'Descripcion de SKU'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>SKU*</div>
              <Input value={sku} onChange={value => setSku(value.target.value)} placeholder={'Escribir SKU'} size={'large'} />
            </Col>
          </Row>
          {/*End Fields section*/}
          {/*Radio button section*/}
          <Row gutter={16} className={'section-space-list section-space-list-bottom'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Producto al que pertenece</div>
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
                onSearch={onSearchPresentations}
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
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row gutter={16} className={'sku-label-season-element'}>
                <Col xs={12} sm={12} md={12} lg={12} className="text-right">
                  <span className={'label-bold-500 presentation-ratio-button-labels'}>¿Es de temporada?</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Radio.Group
                    className={'radio-group'}
                    optionType="button"
                    buttonStyle="solid"
                    size={'large'}
                    value={season}
                    onChange={value => setSeason(value.target.value)}
                  >
                    <Radio.Button value={false}>No</Radio.Button>
                    <Radio.Button value={true}>Si</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          {/*End Radio button section*/}
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
          {/*End Footer buttons section*/}
        </div>
      </Drawer>
    </>
  )
}

export default SkuDrawer
