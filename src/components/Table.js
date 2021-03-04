import React, { useState, useContext } from 'react'
import { Table, Col, Input, Button, Row, Card, Popover, Divider, Popconfirm } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../context'

const { Search } = Input

function GeneralTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)

  let columnTmp = props.columns

  const handlerControls = [
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      align: 'right',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement="left"
              content={
                <div>
                  {hasPermissions([props.editPermissions]) && (
                    <span className={'user-options-items'} onClick={() => handlerEditRow(data)}>
                      Editar
                    </span>
                  )}
                  {hasPermissions([props.editPermissions]) && hasPermissions([props.deletePermissions]) && (
                    <Divider className={'divider-enterprise-margins'} type={'horizontal'} />
                  )}
                  {hasPermissions([props.deletePermissions]) && (
                    <Popconfirm
                      title="Estas seguro de borrar el elemento selccionado?"
                      onConfirm={() => handlerDeleteRow(data)}
                      okText="Si"
                      cancelText="No"
                    >
                      <span className={'user-options-items'}>Eliminar</span>
                    </Popconfirm>
                  )}
                  {props.assign && (
                    <>
                      <Divider className={'divider-enterprise-margins'} type={'horizontal'} />
                      <span className={'user-options-items'} onClick={() => handlerAssignRow(data)}>
                        Asignar Precios
                      </span>
                    </>
                  )}
                </div>
              }
              trigger="click"
              getPopupContainer={trigger => trigger.parentNode}
            >
              {(hasPermissions([props.editPermissions]) || hasPermissions([props.deletePermissions])) &&
                (!props.companyPermissions || state.auth.role_id === 1 || state.auth.company_id === data.company_id) && (
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

  const [dataColumns] = useState(columnTmp.concat(handlerControls))

  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerAssignRow = row => {
    props.handlerAssignRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  const handlerShowDrawer = () => {
    props.handlerShowDrawer()
  }

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
        <Col xs={6} sm={6} md={6} lg={6} className="text-right">
          {hasPermissions([props.createPermissions]) && (props.create !== undefined ? (props.create === 1 ? true : false) : true) && (
            <Button className="title-tendero new-button" style={{ width: '150px' }} onClick={handlerShowDrawer}>
              Nuevo
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
                  className={`CustomTableClass ${props.assign && 'presentations'}`}
                  dataSource={props.dataSource}
                  columns={dataColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default GeneralTable
