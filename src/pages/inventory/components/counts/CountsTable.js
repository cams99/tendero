import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'

function CountsTable(props) {
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.fetchData) fetchCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption, props.fetchData])

  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'store_name', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Usuario',
      dataIndex: 'user_name', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'column', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
  ]

  const fetchCounts = () => {
    setLoading(true)
    inventorySrc
      .getCounts(props.selectedOption)
      .then(counts => {
        setDataSource(setCounts(counts))
        setExistMoreInfo(counts.data.next_page_url !== null)
        setNextPage(counts.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los conteos.')
        setLoading(false)
      })
  }

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setExistMoreInfo(false)
      setLoading(true)
      inventorySrc.getNextPage(nextPage).then(counts => {
        setDataSource(dataSource.concat(setCounts(counts)))
        setExistMoreInfo(counts.data.next_page_url !== null)
        setNextPage(counts.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setCounts = counts => {
    if (counts !== 'Too Many Attempts.') {
      let _counts = counts.data.data || []
      return _counts.map((d, i) => ({
        key: i,
        store_name: d.store.name,
        user_name: d.user.name,
        date: Utils.formatDate(d.count_date),
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

export default CountsTable
