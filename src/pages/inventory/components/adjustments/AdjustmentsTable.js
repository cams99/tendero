import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'


function AdjustmentsTable(props) {
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.fetchData) fetchAdjustment(props.selectedOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption, props.fetchData])

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  const fetchAdjustment = (transferId = null) => {
    setLoading(true)
    inventorySrc
      .getAdjustments(transferId)
      .then(adjustments => {
        setDataSource(setAdjustments(adjustments))
        setExistMoreInfo(adjustments.data.next_page_url !== null)
        setNextPage(adjustments.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los ajustes.')
        setLoading(false)
      })
  }

  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'store', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Usuario',
      dataIndex: 'user', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Razón',
      dataIndex: 'reason', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
  ]

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setExistMoreInfo(false)
      setLoading(true)
      inventorySrc.getNextPage(nextPage).then(adjustments => {
        setDataSource(dataSource.concat(setAdjustments(adjustments)))
        setExistMoreInfo(adjustments.data.next_page_url !== null)
        setNextPage(adjustments.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setAdjustments = adjustments => {
    if (adjustments !== 'Too Many Attempts.') {
      let _adjustments = adjustments.data.data || []
      return _adjustments.map((d, i) => ({
        key: i,
        store: d.store_name,
        user: d.user_name,
        date: Utils.formatDate(d.date),
        reason: d.description,
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

export default AdjustmentsTable
