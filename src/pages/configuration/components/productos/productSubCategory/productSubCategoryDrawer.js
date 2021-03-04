import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../../../utils/Utils'

const { Option } = Select
const { Title } = Typography

function ProductSubCategoryDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')
  const [departamentId, setDepartamentId] = useState(null)
  const [cateogoryId, setCateogoryId] = useState(null)
  const [categorySelectEnable, setCategorySelectEnable] = useState(true)
  /*SELECT INFO*/
  const [departaments, setDepartaments] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  /*HANDLERS*/
  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setDepartamentId(props.edit ? props.editData.product_department_id : null)
    setCateogoryId(props.edit ? props.editData.product_category_id : null)
    setCategorySelectEnable(true)
    if (props.edit && props.visible) {
      onSearchDepartamentAndCategory(
        props.edit && props.editData?.product_department_name ? props.editData.product_department_name : '',
        props.edit && props.editData?.product_department_name ? props.editData.product_department_name : ''
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    onSearchProductDepartament('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearchDepartamentAndCategory = (deptoName, categoryName) => {
    setLoading(true)
    Utils.getProductDepartamentOptions(deptoName)
      .then(response => {
        setDepartaments(response.data.data)
      })
      .then(_ => {
        if (props.editData?.product_department_id) {
          Utils.getProductCategoryOptions(categoryName, props.editData.product_department_id).then(response => {
            response.data?.data ? setCategories(response.data?.data) : setCategories()
          })
        }
        setCategorySelectEnable(false)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchCategory = val => {
    Utils.getProductCategoryOptions(val, departamentId)
      .then(response => {
        console.log(response)
        setCategories(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onSearchProductDepartament = val => {
    setCategorySelectEnable(true)
    Utils.getProductDepartamentOptions(val)
      .then(response => {
        setDepartaments(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  const onChangeCountry = _departamentId => {
    setDepartamentId(_departamentId)
    Utils.getProductCategoryOptions('', _departamentId).then(response => {
      setCateogoryId(null)
      setCategories(response.data.data)
      setCategorySelectEnable(false)
    })
  }

  const onSaveButton = () => {
    if ([name, cateogoryId, departamentId].includes('') || [name, cateogoryId, departamentId].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
      product_category_id: cateogoryId,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar subcategoría de productos' : 'Nueva subcategoría de productos'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre de subcategoría'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Departamento de productos al que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={departamentId}
                onSearch={onSearchProductDepartament}
                onChange={value => onChangeCountry(value)}
                placeholder={'Selecciona departamento de productos'}
                size={'large'}
              >
                {departaments &&
                  departaments.map(data => {
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
              <div className={'title-space-field'}>Categoría a la que pertenece</div>
              <Select
                loading={loading}
                showSearch
                optionFilterProp="children"
                className={'single-select'}
                style={{ width: '100%' }}
                value={cateogoryId}
                onSearch={onSearchCategory}
                onChange={value => setCateogoryId(value)}
                placeholder={'Selecciona region al que pertenece'}
                size={'large'}
                disabled={categorySelectEnable}
              >
                {categories &&
                  categories.map(data => {
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

export default ProductSubCategoryDrawer
