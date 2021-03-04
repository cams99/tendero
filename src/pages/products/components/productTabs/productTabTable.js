import React, { useContext } from 'react'
import { Button, Card, Col, Divider, Input, Popconfirm, Popover, Row, Table } from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../../../../context'

function ProductTabTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }
  const columns = [
    {
      title: 'Lista de productos',
      dataIndex: 'productDescription', // Field that is goint to be rendered
      key: 'productDescription',
      align: 'left',
      render: text => <span>{text}</span>,
    },
    {
      align: 'right',
      title: '',
      dataIndex: '_id', // Field that is goint to be rendered
      key: '_id',
      render: (row, data) => (
        <span>
          <Popover
            placement="left"
            content={
              <div>
                {hasPermissions([23]) && (
                  <span className={'user-options-items'} onClick={() => props.handlerEditRow(data)}>
                    Editar
                  </span>
                )}
                {hasPermissions([23]) && hasPermissions([24]) && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                {hasPermissions([24]) && (
                  <Popconfirm
                    title="Estas seguro de borrar el elemento selccionado?"
                    onConfirm={() => props.handlerDeleteRow(data)}
                    okText="Si"
                    cancelText="No"
                  >
                    <span className={'user-options-items'}>Eliminar</span>
                  </Popconfirm>
                )}
              </div>
            }
            trigger="click"
          >
            {(hasPermissions([23]) || hasPermissions([24])) && (state.auth.role_id === 1 || state.auth.company_id === data.company_id) && (
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            )}
          </Popover>
        </span>
      ),
    },
  ]

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={18} lg={14}>
          <Input
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Buscar"
            style={{ width: '70%', height: '40px' }}
            size={'large'}
            onChange={e => getFilteredData(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={10} className="product-header-elements-container">
          {hasPermissions([22]) &&
            (state.auth.company?.allow_add_products !== undefined ? (state.auth.company?.allow_add_products === 1 ? true : false) : true) && (
              <Button className="title-tendero new-button product-margin-header-button" onClick={props.handlerShowDrawer}>
                Nuevo Producto
              </Button>
            )}
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  loading={props.loading}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey="key"
                  expandable={{
                    rowExpandable: record => record.productDescription !== null,
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p style={{ margin: 0 }}>
                          <b>Paises donde aplica: </b> {record.all_countries}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Marca a la que pertenece: </b> {record.brand_name}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Categoria a la que pertenece: </b> {record.product_category.name}{' '}
                        </p>
                        <b>Departamento al que pertenece: </b> {record.product_department.name} <p style={{ margin: 0 }}></p>
                        <p style={{ margin: 0 }}>
                          <b>Subcategoria a la que pertenece: </b>
                          {record.product_subcategory.name}{' '}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Excento de impuestos: </b> {record.is_taxable === 1 ? 'Si' : 'No'}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Impacta inventario?: </b> {record.is_inventoriable === 1 ? 'Si' : 'No'}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Expresion minima: </b> {record.minimal_expresion}
                        </p>
                        <p style={{ margin: 0 }}>
                          <b>Precio sugerido: </b> {record.suggested_price}
                        </p>
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? <DownOutlined onClick={e => onExpand(record, e)} /> : <RightOutlined onClick={e => onExpand(record, e)} />,
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProductTabTable
