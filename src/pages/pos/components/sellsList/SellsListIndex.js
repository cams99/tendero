import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Popover, Input, Row, Col, Divider, message } from 'antd'
import { MoreOutlined, SearchOutlined } from '@ant-design/icons/lib/icons'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import Utils from '../../../../utils/Utils'
import SellsListModal from './SellsListModal'
import SellsListInvoiceModal from './SellsListInvoiceModal'
import PosSrc from '../../PosSrc'

// Context
import { Context, useStore } from '../../../../context'

function SellsListIndex(props) {
  const [state, dispatch] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleInvoice, setVisibleInvoice] = useState(false)
  const [invoice, setInvoice] = useState({})
  const [infoRow, setInfoRow] = useState({})

  useEffect(() => {
    if (props.activeKey === '4') {
      fetchSellsList(props.store.id)
    }
    // eslint-disable-next-line
  }, [props.activeKey])

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Cantidad',
      dataIndex: 'total', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Factura',
      dataIndex: 'invoice', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Método de pago',
      dataIndex: 'payment_method', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'invoice', // Field that is goint to be rendered
      render: text => <span>{`${text}.pdf`}</span>,
    },
    {
      align: 'right',
      title: '',
      dataIndex: 'key', // Field that is goint to be rendered
      render: (id, data) => (
        <span>
          {(hasPermissions([48]) || data.invoice_link) && (
            <Popover
              placement="left"
              content={
                <div>
                  {hasPermissions([48]) && (
                    <>
                      <span className={'user-options-items'} onClick={() => onDelete(data)}>
                        Anular Factura
                      </span>
                      {data.invoice_link && <Divider className={'divider-enterprise-margins'} type={'horizontal'} />}
                    </>
                  )}
                  {data.invoice_link && (
                    <span className={'user-options-items'} onClick={() => onPrint(data)}>
                      Ver Factura
                    </span>
                  )}
                </div>
              }
              trigger="click"
            >
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            </Popover>
          )}
        </span>
      ),
    },
  ]

  const fetchSellsList = storeId => {
    setLoading(true)
    PosSrc.getSells(storeId)
      .then(response => {
        setDataSource(setSells(response))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al cargar las ventas')
        setLoading(false)
      })
  }

  const setSells = sells => {
    if (sells !== 'Too Many Attempts.') {
      let _sells = sells.data.data || []
      return _sells.map((d, i) => ({
        key: i,
        id: d.id,
        date: Utils.formatDate(d.date),
        total: d.total,
        invoice: d.sell_invoice.invoice,
        invoice_link: d.invoice_link,
        payment_method: d.sell_payment?.payment_method.name,
        status: Utils.jsUcfirst(d.status),
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const onSearch = e => {}

  const onDelete = data => {
    if (visible) {
      setLoading(true)
      PosSrc.sellDelete(infoRow.id)
        .then(response => {
          message.success('Se ha eliminado la venta')
          getCash(response.store_id)
        })
        .catch(err => {
          console.log(err)
          message.error('Error al eliminar la venta')
          setLoading(false)
        })
      setVisible(false)
    } else {
      setVisible(true)
      setInfoRow(data)
    }
  }

  const getCash = id => {
    PosSrc.getStoreCash(id).then(response => {
      dispatch({
        type: 'TURN CASH',
        payload: response.data[0],
      })
      fetchSellsList(props.store.id)
    })
  }

  const onPrint = data => {
    if (data) {
      setInvoice(data)
      setVisibleInvoice(true)
    } else {
      setInvoice({})
      setVisibleInvoice(false)
    }
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      PosSrc.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(setSells(response)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  return (
    <>
      <h4 className={'section-space-list-bottom'}>Lista de ventas</h4>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Input
            prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
            placeholder="Buscar factura"
            className={'tendero-table-search custom-search'}
            size={'large'}
            onChange={e => onSearch(e)}
          />
        </Col>
      </Row>
      <Table
        className={'CustomTableClass'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
        rowKey={(record, index) => index}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <SellsListModal visible={visible} onDelete={onDelete} visibleStatus={status => setVisible(status)} />
      <SellsListInvoiceModal visible={visibleInvoice} invoice={invoice} visibleStatus={status => onPrint(status)} />
    </>
  )
}

export default SellsListIndex
