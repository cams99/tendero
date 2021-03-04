import React, { useState, useContext } from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Col, Row, Select, Tabs } from 'antd'

import GeneralIndex from './components/generales/generalIndex'
import ProductIndex from './components/productos/productIndex'

// Context
import { Context, useStore } from '../../context'

const { TabPane } = Tabs
const { Option } = Select

function Configuration() {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [generalOption, setGeneralOption] = useState(null)
  const [shopOption, setShopOption] = useState(null)
  const [productOption, setProductOption] = useState(null)

  return (
    <>
      <HeaderPage title={'Configuraciones'} />
      <Tabs id={'tenderoConfigurationTabs'} defaultActiveKey="1">
        <TabPane tab="Generales" key="1">
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Select
                value={generalOption}
                className={'single-select'}
                placeholder={'Selecciona una configuracion'}
                size={'large'}
                style={{ width: '40%' }}
                onChange={value => setGeneralOption(value)}
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={'departamento'}>Departamento/Estado</Option>
                <Option value={'municipio'}>Municipio/Localidad</Option>
                <Option value={'nivelsocioeconomico'}>Niveles socioeconómicos</Option>
                <Option value={'paises'}>Países</Option>
                <Option value={'regiones'}>Regiones</Option>
                <Option value={'zona'}>Zona/Barrio</Option>
              </Select>
            </Col>
          </Row>
          {/*CONTAINER*/}
          <Row gutter={16} className={'section-space-field'}>
            {generalOption ? (
              <Col span={24} className={'margin-top-30'}>
                {<GeneralIndex option={generalOption} />}
              </Col>
            ) : (
              <Col span={24} className={'empty-section-container'}>
                <div className={'empty-section'}>
                  <span className={'empty-section-message'}>Por favor selecciona una configuracion a editar</span>
                </div>
              </Col>
            )}
          </Row>
          {/*END CONTAINER*/}
        </TabPane>
        <TabPane tab="Tiendas" key="2">
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Select
                value={shopOption}
                className={'single-select'}
                placeholder={'Selecciona una configuracion'}
                size={'large'}
                style={{ width: '40%' }}
                onChange={value => setShopOption(value)}
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={'bandera'}>Bandera</Option>
                <Option value={'cadena'}>Cadena</Option>
                <Option value={'formatotienda'}>Formato de tienda</Option>
                {hasPermissions([13]) && <Option value={'metodopago'}>Metodo de pago</Option>}
                <Option value={'tiponegocio'}>Tipo de Negocio</Option>
                <Option value={'tipoubicacion'}>Tipo de ubicacion</Option>
              </Select>
            </Col>
          </Row>
          {/*CONTAINER*/}
          <Row gutter={16} className={'section-space-field'}>
            {shopOption ? (
              <Col span={24} className={'margin-top-30'}>
                {<GeneralIndex option={shopOption} />}
              </Col>
            ) : (
              <Col span={24} className={'empty-section-container'}>
                <div className={'empty-section'}>
                  <span className={'empty-section-message'}>Por favor selecciona una configuracion a editar</span>
                </div>
              </Col>
            )}
          </Row>
          {/*END CONTAINER*/}
        </TabPane>
        <TabPane tab="Productos" key="3">
          <Row gutter={16}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Select
                value={productOption}
                className={'single-select'}
                placeholder={'Selecciona una configuracion'}
                size={'large'}
                style={{ width: '40%' }}
                onChange={value => setProductOption(value)}
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={'categoriaproducto'}>Categorias de producto</Option>
                <Option value={'departamentoproducto'}>Departamento de producto</Option>
                <Option value={'fabricanteproducto'}>Fabricantes</Option>
                <Option value={'marcaproducto'}>Marca</Option>
                <Option value={'proveedorproducto'}>Proveedores</Option>
                <Option value={'subcategoriaproducto'}>Subcategorias de productos</Option>
                <Option value={'unidaddemedidaproducto'}>Unidad de medida</Option>
              </Select>
            </Col>
          </Row>
          {/*CONTAINER*/}
          <Row gutter={16} className={'section-space-field'}>
            {productOption ? (
              <Col span={24} className={'margin-top-30'}>
                {<ProductIndex option={productOption} />}
              </Col>
            ) : (
              <Col span={24} className={'empty-section-container'}>
                <div className={'empty-section'}>
                  <span className={'empty-section-message'}>Por favor selecciona una configuracion a editar</span>
                </div>
              </Col>
            )}
          </Row>
          {/*END CONTAINER*/}
        </TabPane>
      </Tabs>
    </>
  )
}

export default Configuration
