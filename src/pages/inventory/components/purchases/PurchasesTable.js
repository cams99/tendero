import React, { useEffect, useState, useContext } from 'react'
import { Table, Col, Button, Row, message, Card, Popover } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import inventorySrc from '../../inventorySrc'
import Utils from '../../../../utils/Utils'

// Context
import { Context, useStore } from '../../../../context'

function PurchasesTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.fetchData) fetchPurchases()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedOption, props.fetchData])

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  const fetchPurchases = () => {
    setLoading(true)
    inventorySrc
      .getAllPurchases(props.selectedOption)
      .then(purchases => {
        setDataTable(setPurchases(purchases))
        setExistMoreInfo(purchases.data.next_page_url !== null)
        setNextPage(purchases.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se han podido cargar las compras.')
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
      title: 'Tipo de ingreso',
      dataIndex: 'comments', // Field that is goint to be rendered
      render: text => <span>Compra</span>,
    },
    {
      title: 'No. Factura',
      dataIndex: 'invoice', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      align: 'right',
      title: '',
      dataIndex: 'key', // Field that is goint to be rendered
      render: (id, data) =>
        hasPermissions([27]) && (
          <span>
            {
              <Popover
                placement="left"
                content={
                  <div>
                    <span className={'user-options-items'} onClick={() => props.onEdit(dataSource[id].id)}>
                      Editar
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

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setExistMoreInfo(false)
      setLoading(true)
      inventorySrc.getNextPage(nextPage).then(purchases => {
        setDataTable(dataTable.concat(setPurchases(purchases)))
        setExistMoreInfo(purchases.data.next_page_url !== null)
        setNextPage(purchases.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setPurchases = purchases => {
    if (purchases !== 'Too Many Attempts.') {
      let _purchases = purchases.data.data || []
      setDataSource(_purchases)
      return _purchases.map((d, i) => ({
        key: i,
        store: d.store.name,
        user: d.user.name,
        date: Utils.formatDate(d.date),
        comments: d.comments,
        invoice: d.invoice,
        provider: d.provider.name,
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
                  dataSource={dataTable}
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

export default PurchasesTable
