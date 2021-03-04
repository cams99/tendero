import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'

function InventoryTable(props) {
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.fetchData) fetchTransfer(props.selectedOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption, props.fetchData])

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  const columns = [
    {
      title: 'Tienda origen',
      dataIndex: 'origin_store_name', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Tienda destino',
      dataIndex: 'destiny_store_name', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Usuario',
      dataIndex: 'user_name', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
  ]

  const fetchTransfer = (transferId = null) => {
    setLoading(true)
    inventorySrc
      .getTransfers(transferId)
      .then(transfers => {
        setDataSource(setTransfers(transfers))
        setExistMoreInfo(transfers.data.next_page_url !== null)
        setNextPage(transfers.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar las transferencias.')
        setLoading(false)
      })
  }

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setExistMoreInfo(false)
      setLoading(true)
      inventorySrc.getNextPage(nextPage).then(transfers => {
        setDataSource(dataSource.concat(setTransfers(transfers)))
        setExistMoreInfo(transfers.data.next_page_url !== null)
        setNextPage(transfers.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setTransfers = transfers => {
    if (transfers !== 'Too Many Attempts.') {
      let _transfers = transfers.data.data || []
      setDataSource(_transfers)
      return _transfers.map((d, i) => ({
        key: i,
        origin_store_name: d.origin_store_name,
        destiny_store_name: d.destiny_store_name,
        date: Utils.formatDate(d.date),
        user_name: d.user_name,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  className={'CustomTableClass'}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  loading={loading}
                  rowKey={(record, index) => index}
                />
                <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default InventoryTable
