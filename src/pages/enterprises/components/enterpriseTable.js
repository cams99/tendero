import React, { useContext } from 'react'
import { Table, Col, Input, Button, Row, Card, Popover, Divider, Popconfirm } from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../../../context'

const { Search } = Input

/***
 *
 * @param props
 * @returns {*}
 * @constructor
 * allow_add_products: 1
   allow_add_stores: 1
   country_id: 3
   created_at: "2020-07-14T21:13:23.000000Z"
   currency_id: 5
   deleted_at: null
   id: 1
   is_electronic_invoice: 0
   name: "Hirthe Group"
   nit: "38484554"
   phone: "8767553"
   reason: "Distinctio quia dolor vel id consequatur et. Quo rerum voluptas illum quidem voluptatem. Dolor eos in ex similique illo recusandae corrupti deserunt."
   updated_at: "2020-07-14T21:13:23.000000Z"
   uses_fel: 1
 */
function EnterpriseTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Regimen',
      dataIndex: 'regime', // Field that is goint to be rendered
      key: 'regime',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Nit',
      dataIndex: 'nit', // Field that is goint to be rendered
      key: 'nit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Telefono',
      dataIndex: 'phone', // Field that is goint to be rendered
      key: 'phone',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Pais',
      dataIndex: 'pais', // Field that is goint to be rendered
      key: 'pais',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Moneda',
      dataIndex: 'currency_name', // Field that is goint to be rendered
      key: 'currency_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Direccion',
      dataIndex: 'address', // Field that is goint to be rendered
      key: 'address',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement="left"
              style={{ zIndex: 'auto' }}
              content={
                <div>
                  {hasPermissions([3]) && (
                    <span className={'user-options-items'} onClick={() => handlerEditRow(data)}>
                      Editar
                    </span>
                  )}
                  {hasPermissions([3, 4]) && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                  {hasPermissions([4]) && (
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
              {(hasPermissions([3]) || hasPermissions([4])) && (
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
  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  return (
    <>
      <Row>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Search
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Presiona enter para buscar"
            className={'tendero-table-search custom-search'}
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
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  loading={props.loading}
                  rowKey="key"
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Podra crear sus propios productos? </b> {record.allow_add_products !== 0 ? 'Si' : 'No'}
                        </p>
                        <p>
                          <b>Podra crear sus propias tiendas? </b> {record.allow_add_stores !== 0 ? 'Si' : 'No'}{' '}
                        </p>
                        <p>
                          <b>Podra crear sus propios usuarios ?</b> {record.uses_fel !== 0 ? 'Si' : 'No'}{' '}
                        </p>
                        <p>
                          <b>Facturara de forma electronica ?</b> {record.is_electronic_invoice !== 0 ? 'Si' : 'No'}{' '}
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

export default EnterpriseTable
