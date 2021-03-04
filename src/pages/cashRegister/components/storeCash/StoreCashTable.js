import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, Popover, Button, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import { MoreOutlined } from '@ant-design/icons'
import cashRegisterSrc from '../../cashRegisterSrc'

function StoreCashTable(props) {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  // eslint-disable-next-line
  const [nextPage, setNextPage] = useState('')
  // eslint-disable-next-line
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    fetchStore(props.selectedOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption, props.fetch])

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  const fetchStore = (storeId) => {
    setLoading(true)
    cashRegisterSrc
      .getStore(storeId)
      .then(response => {
        setDataSource(setStore(response))
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se han podido cargar los depositos.')
        setLoading(false)
      })
  }

  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'store_name', // Field that is goint to be rendered
      key: 'store_name',
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Efectivo en tienda',
      dataIndex: 'store_cash', // Field that is goint to be rendered
      key: 'store_cash',
      render: text => <span>Q {text}</span>,
    },
    {
      align: 'right',
      title: '',
      dataIndex: 'key', // Field that is goint to be rendered
      render: (id, data) => (
        <span>
          {
            <Popover
              placement="left"
              content={
                <div>
                  <span className={'user-options-items'} onClick={() => props.onAdjust(data)}>
                    Ajustar efectivo
                  </span>
                </div>
              }
              trigger="click"
            >
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            </Popover>
          }
        </span>
      ),
    },
  ]

  const setStore = store => {
    if (store !== 'Too Many Attempts.') {
      let _store = store.data.data || []
      return _store.map((d, i) => ({
        key: i,
        id: d.id,
        store_name: d.name,
        store_cash: d.petty_cash_amount, 
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const handlerMoreButton = () => {}

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table className={'CustomTableClass'} dataSource={dataSource} columns={columns} pagination={false} loading={loading} rowKey="key" />
                <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default StoreCashTable
