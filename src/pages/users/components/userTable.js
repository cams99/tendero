import React, { useContext } from 'react'
import { Table, Col, Input, Button, Row, Card, Popover, Divider, Popconfirm } from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../../../context'

const { Search } = Input

function UserTable(props) {
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
      title: 'Nombre',
      dataIndex: '_name', // Field that is goint to be rendered
      key: '_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Perfil inicial',
      dataIndex: '_perfilInicial', // Field that is goint to be rendered
      key: '_perfilInicial',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: '_email', // Field that is goint to be rendered
      key: '_nit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Telefono',
      dataIndex: '_telefono', // Field that is goint to be rendered
      key: '_telefono',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Empresa',
      dataIndex: '_empresaNombre', // Field that is goint to be rendered
      key: '_empresaNombre',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Username',
      dataIndex: '_username', // Field that is goint to be rendered
      key: '_username',
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
                  {hasPermissions([7]) && (
                    <>
                      <span className={'user-options-items'} onClick={() => handlerEditRow(data)}>
                        Editar
                      </span>
                      <Divider className={'divider-enterprise-margins'} type={'horizontal'} />
                      <span className={'user-options-items'} onClick={() => props.handlerEditPermissions(data)}>
                        Editar permisos
                      </span>{' '}
                    </>
                  )}
                  {hasPermissions([7]) && hasPermissions([8]) && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                  {hasPermissions([8]) && (
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
              {(hasPermissions([7]) || hasPermissions([8])) && (
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
                  loading={props.loading}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey="_id"
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Tiendas asociadas</b>
                        </p>
                        {record._stores_name.map((data, i) => {
                          return <p key={i}>{data}</p>
                        })}
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      record._stores_name?.length > 0 &&
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

export default UserTable
