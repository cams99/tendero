import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'

function InventoryTable(props) {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    fetchInventory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption])

  useEffect(() => {
    if (props.keyTab === '1') fetchInventory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.keyTab])

  const fetchInventory = () => {
    setLoading(true)
    inventorySrc
      .getInventory(props.selectedOption)
      .then(inventory => {
        setDataSource(setInventory(inventory))
        setExistMoreInfo(inventory.data.next_page_url !== null)
        setNextPage(inventory.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar el inventario.')
        setLoading(false)
      })
  }

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'product', // Field that is goint to be rendered
      key: 'product',
      render: text => <span style={{ textAlign: 'left' }}>{text ? text : 'Sin nombre'}</span>,
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity', // Field that is goint to be rendered
      key: 'quantity',
      render: text => <span>{text ? text : 'Sin cantidad'}</span>,
    },
    {
      title: 'Última salida',
      dataIndex: 'last_output', // Field that is goint to be rendered
      key: 'last_output',
      render: text => <span>{text ? text : 'Sin salida'}</span>,
    },
    {
      title: 'Última entrada',
      dataIndex: 'last_input', // Field that is goint to be rendered
      key: 'last_input',
      render: text => <span>{text ? text : 'Sin entrada'}</span>,
    },
    {
      title: 'Última conteo',
      dataIndex: 'last_count', // Field that is goint to be rendered
      key: 'last_count',
      render: text => <span>{text ? text : 'Sin conteo'}</span>,
    },
  ]

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      inventorySrc.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(setInventory(response)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setInventory = inventory => {
    if (inventory !== 'Too Many Attempts.') {
      let _inventory = inventory.data.data || []
      return _inventory.map((d, i) => ({
        key: i,
        product_id: d.product_id,
        product: d.product_description,
        quantity: d.quantity,
        last_output: Utils.formatDate(d.last_output),
        last_input: Utils.formatDate(d.last_input),
        last_count: Utils.formatDate(d.last_count),
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  // const searchHandler = value => {
  //   setLoading(true)
  //   inventorySrc
  //     .read(value, props.selectedOption)
  //     .then(result => {
  //       setDataSource(getFlags(result))
  //       setNextPage(result.data.next_page_url)
  //       setExistMoreInfo(result.data.next_page_url !== null)
  //       setLoading(false)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       message.error('No se ha podido filtrar la información')
  //       setLoading(false)
  //     })
  // }

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

export default InventoryTable
