import React, { useContext } from 'react'
import { Button, Card, Col, Divider, Input, Popconfirm, Popover, Row, Table } from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
import { Context, useStore } from '../../../../context'

const { Search } = Input

function ComboTabTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const columns = [
    {
      title: 'Lista de combos',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      align: 'left',
      render: text => <span>{text}</span>,
    },
    {
      align: 'right',
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement="left"
              content={
                <div>
                  {hasPermissions([23]) && (
                    <span className={'user-options-items'} onClick={() => handlerEditRow(data)}>
                      Editar
                    </span>
                  )}
                  {hasPermissions([23]) && hasPermissions([24]) && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                  {hasPermissions([24]) && (
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
              {(hasPermissions([23]) || hasPermissions([24])) && (state.auth.role_id === 1 || state.auth.company_id === data.company_id) && (
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
        <Col xs={24} sm={24} md={18} lg={14}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Presiona enter para buscar"
            style={{ width: '70%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
        <Col xs={24} sm={24} md={6} lg={10} className="product-header-elements-container">
          {hasPermissions([22]) &&
            (state.auth.company?.allow_add_products !== undefined ? (state.auth.company?.allow_add_products === 1 ? true : false) : true) && (
              <Button className="title-tendero new-button product-margin-header-button" onClick={props.handlerShowDrawer}>
                Nuevo Combo
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
                  rowKey="id"
                  expandable={{
                    expandedRowRender: record => (
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <div className={'text-left'}>
                            <p style={{ margin: 0 }}>
                              <b>Presentaciones que incluye:</b>
                            </p>
                            {record.presentations?.map((value, i) => {
                              return (
                                <p key={i} style={{ margin: 0 }}>
                                  {' '}
                                  {value.description}{' '}
                                </p>
                              )
                            })}
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <div className={'text-left'}>
                            <p>
                              <b>Precio sugerido,tienda y turno al que aplica:</b>
                            </p>
                            {record.presentation_combos_stores_turns?.map((value, i) => {
                              return (
                                <p key={i}>
                                  {value.suggested_price} | {value.store.name} | {value.turn.start_time}hrs - {value.turn.end_time}hrs
                                </p>
                              )
                            })}
                          </div>
                        </Col>
                      </Row>
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

export default ComboTabTable
