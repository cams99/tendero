import React, { useContext } from 'react'
import { Table, Col, Input, Button, Row, Card, Popover, Divider, Popconfirm } from 'antd'

import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../../../context'

const { Search } = Input

function ShopTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)

  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  const columns = [
    {
      title: 'Tienda',
      dataIndex: '_shop', // Field that is goint to be rendered
      key: '_shop',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Empresa',
      dataIndex: '_enterprise', // Field that is goint to be rendered
      key: '_enterprise',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Departamento/estado',
      dataIndex: '_location', // Field that is goint to be rendered
      key: '_location',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Direccion',
      dataIndex: '_address', // Field that is goint to be rendered
      key: '_address',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: '_id', // Field that is goint to be rendered
      key: '_id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement="left"
              content={
                <div>
                  {hasPermissions([11]) && (
                    <span className={'user-options-items'} onClick={() => handlerEditRow(data)}>
                      Editar
                    </span>
                  )}
                  {hasPermissions([11]) && hasPermissions([12]) && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                  {hasPermissions([12]) && (
                    <Popconfirm
                      title="Estas seguro de borrar el elemento selccionado?"
                      onConfirm={() => handlerDeleteRow(data)}
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
              {(hasPermissions([11]) || hasPermissions([12])) && (
                <Button shape={'circle'} className={'enterprise-settings-button'}>
                  <MoreOutlined />
                </Button>
              )}
            </Popover>
          }
        </span>
      ),
    },
  ]
  return (
    <>
      <Row>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Presiona enter para buscar"
            style={{ width: '70%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  loading={props.isLoading}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey="_id"
                  expandable={{
                    rowExpandable: record => record._description !== null,
                    expandedRowRender: record => (
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <div className={'text-left'}>
                            <p style={{ margin: 0 }}>
                              <b>Monto que mantiene en caja chica: </b>
                              {record._petty_cash_amount}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Cadena: </b> {record._store_chain_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Bandera: </b> {record._store_flag_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Tipo de ubicacion: </b> {record._location_type_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Formato de tienda: </b> {record._store_format_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Tamaño de tienda (en mt2): </b> {record._size}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Nivel socioeconomico: </b> {record._socioeconomic_level_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Municipio/Localidad: </b> {record._municipality_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Zona/Barrio: </b> {record._zone_name}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Latitud: </b> {record._latitute}{' '}
                            </p>
                            <p style={{ margin: 0 }}>
                              <b>Longitud:" </b> {record._longitude}{' '}
                            </p>
                          </div>
                        </Col>
                        {record._turns_names.length > 0 && (
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <div className={'text-left'}>
                              <p style={{ margin: 0 }}>
                                <b>Turnos:</b>
                              </p>
                              {record._turns_names.map((turnName, i) => {
                                return (
                                  <p key={i} style={{ margin: 0 }}>
                                    {' '}
                                    {turnName}{' '}
                                  </p>
                                )
                              })}
                            </div>
                          </Col>
                        )}
                      </Row>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      record._description !== null &&
                      (expanded ? <DownOutlined onClick={e => onExpand(record, e)} /> : <RightOutlined onClick={e => onExpand(record, e)} />),
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

export default ShopTable
