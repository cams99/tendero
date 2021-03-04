import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Radio, Row, Typography } from 'antd'
import Countries from '../../../../utils/countrySrc'
import Brands from '../../../../utils/brandSrc'
import Product from '../../../../utils/productCategories'
import Utils from '../../../../utils/Utils'
import CountriesSelect from '../../../../components/CountriesSelect'
import GenericSelect from '../../../../components/GenericSelect'

const { Title } = Typography

function ProductDrawer(props) {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState([])
  const [brands, setBrands] = useState([])
  const [brand, setBrand] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [productSubCategories, setProductSubCategories] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [uoms, setUoms] = useState([])
  const [unit, setUnit] = useState([])
  const [price, setPrice] = useState(0)
  const [tax, setTax] = useState(false)
  const [toInventory, setToInventory] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (props.visible) {
      loadInfo()
    } else {
      clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const serializeData = () => {
    let _product = {
      description: description,
      is_all_countries: 0,
      brand_id: brand,
      product_category_id: category,
      product_subcategory_id: subCategory,
      is_taxable: tax,
      is_inventoriable: toInventory,
      uom_id: unit,
      suggested_price: price,
      countries: country,
    }
    let msn = Utils.isEmpty(_product)
    if (msn || country.length <= 0) {
      message.error(` Todos los campos son Obligatorios`)
      return false
    }
    if (props.edit) props.editButton(_product, props.editData._id)
    else props.saveButton(_product)
  }

  const clearAndClose = () => {
    clear()
    props.cancelButton()
  }

  const clear = () => {
    setUnit([])
    setBrand([])
    setCategory([])
    setSubCategory([])
    setCountry([])
    setPrice(0)
    setTax(false)
    setToInventory(false)
    setDescription('')
  }

  const loadInfo = () => {
    //contries
    Countries.getCountries()
      .then(c => {
        setCountries(c.data.data)
      })
      .catch(err => {
        console.log(err)
      })

    Brands.getBrands()
      .then(c => {
        setBrands(c.data.data)
      })
      .catch(err => {
        console.log(err)
      })

    Product.getProductsCategories()
      .then(c => {
        setProductCategories(c.data.data)
      })
      .catch(err => {
        console.log(err)
      })

    Product.getProductsSubCategories()
      .then(c => {
        setProductSubCategories(c.data.data)
      })
      .catch(err => {
        console.log(err)
      })

    Utils.getUoms()
      .then(c => {
        setUoms(c.data.data)
      })
      .catch(err => {
        console.log(err)
      })

    if (props.edit) {
      setDescription(props.editData.productDescription)
      setCountry(props.editData.all_countries_id)
      setBrand(props.editData.brand_id)
      setSubCategory(props.editData.product_category_id)
      setCategory(props.editData.product_subcategory_id)
      setPrice(props.editData.suggested_price)
      setUnit(props.editData.uom_id)
      setTax(props.editData.is_taxable === 1 ? true : false)
      setToInventory(props.editData.is_inventoriable === 1 ? true : false)
    }
  }

  const onSearchCountry = val => {
    Utils.getCountryOption(val)
      .then(response => {
        setCountries(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de Pais')
      })
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800} loading={props.loading}>
        <div>
          <Title> {props.edit ? 'Editar Producto' : 'Nuevo Producto'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={16} sm={16} md={16} lg={16}>
              <div className={'title-space-field'}>Descripcion</div>
              <Input
                value={props.edit || description !== '' ? description : ''}
                onChange={value => setDescription(value.target.value)}
                placeholder={'Descripcion del nuevo producto'}
                size={'large'}
              />
            </Col>

            <Col xs={8} sm={8} md={8} lg={8}>
              <CountriesSelect
                title={'Paises a los que aplica'}
                countries={props.edit || countries !== [] ? countries : []}
                country={props.edit || country !== [] ? country : []}
                handleChangeCountry={value => setCountry(value)}
                placeholder={'Elegir Pais'}
                onSearchCountry={onSearchCountry}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <GenericSelect
                title={'Marca*'}
                data={brands}
                value={props.edit || brand !== '' ? brand : ''}
                handlerChange={value => setBrand(value)}
                placeholder={'Elegir Marca'}
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <GenericSelect
                title={'Categoria*'}
                data={productCategories}
                value={props.edit || category !== '' ? category : ''}
                handlerChange={value => setCategory(value)}
                placeholder={'Elegir Categoria'}
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <GenericSelect
                title={'Subcategorias*'}
                data={productSubCategories}
                value={props.edit || subCategory !== '' ? subCategory : ''}
                handlerChange={value => setSubCategory(value)}
                placeholder={'Elegir Subcategoria'}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <GenericSelect
                title={'Unidad de medida*'}
                data={uoms}
                value={props.edit || unit !== '' ? unit : ''}
                handlerChange={value => setUnit(value)}
                placeholder={'Elegir Unidad de Medida'}
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Precio sugerido*</div>
              <Input
                value={props.edit || price !== '' ? price : ''}
                onChange={value => setPrice(value.target.value)}
                placeholder={'Escribir un precio'}
                size={'large'}
                type={'number'}
              />
            </Col>
          </Row>

          {/*End Fields section*/}

          {/*Radio button section*/}
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <span className={'label-bold-500 ratio-button-labels'}>¿Impacta inventario?</span>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Radio.Group
                className={'radio-group'}
                optionType="button"
                buttonStyle="solid"
                size={'large'}
                value={toInventory}
                onChange={value => setToInventory(value.target.value)}
              >
                <Radio.Button value={false}>No</Radio.Button>
                <Radio.Button value={true}>Si</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <span className={'label-bold-500 ratio-button-labels'}>¿Excento de impuestos?</span>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Radio.Group
                className={'radio-group'}
                optionType="button"
                buttonStyle="solid"
                size={'large'}
                value={tax}
                onChange={value => setTax(value.target.value)}
              >
                <Radio.Button value={false}>No</Radio.Button>
                <Radio.Button value={true}>Si</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        {/*End Radio button section*/}
        <div>
          <Divider className={'divider-custom-margins-users'} />
          {/*Footer buttons section*/}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="text-right">
                <div>
                  <Button type={'link'} className="cancel-button" onClick={clearAndClose} loading={props.loading}>
                    Cancelar
                  </Button>
                  <Button htmlType="submit" className="title-tendero new-button" onClick={serializeData} loading={props.loading}>
                    {props.edit ? 'Actualizar' : 'Guardar'}
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

export default ProductDrawer
