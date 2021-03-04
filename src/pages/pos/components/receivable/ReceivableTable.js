import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import PosSrc from '../../PosSrc'
import Utils from '../../../../utils/Utils'
import clientsSrc from '../../../clients/clientsSrc'

// Context
import { Context, useStore } from '../../../../context'

function ReceivableTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.activeKey === '2') {
      fetchReceivables(props.store.id)
    }
    // eslint-disable-next-line
  }, [props.activeKey])

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'client_name', // Field that is goint to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Descripción',
      dataIndex: 'description', // Field that is goint to be rendered
      render: text => <span>{text}</span>,
    },
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
      title: '',
      dataIndex: '', // Field that is goint to be rendered
      render: row =>
        hasPermissions([58]) && (
          <Button className={'pay-receivable'} onClick={e => handlePay(row)}>
            Pagar
          </Button>
        ),
    },
  ]

  const handlePay = row => {
    setLoading(true)

    clientsSrc
      .clientOptions({ id: row.client_id })
      .then(res => {
        const { nit, address, companies } = res.data.data[0]

        const pendingPayment = {
          ...row,
          email: companies[0]?.pivot.email,
          phone: companies[0]?.pivot.phone,
          nit,
          address,
        }

        props.pay(pendingPayment)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar los datos del cliente')
        setLoading(false)
      })
  }

  const fetchReceivables = storeId => {
    setLoading(true)

    PosSrc.getReceivables(storeId)
      .then(receivables => {
        setDataSource(setReceivables(receivables))
        setExistMoreInfo(receivables.data.next_page_url !== null)
        setNextPage(receivables.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar las ventas por cobrar')
        setLoading(false)
      })
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      PosSrc.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(setReceivables(response)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const setReceivables = receivables => {
    if (receivables !== 'Too Many Attempts.') {
      let _receivables = receivables.data.data || []
      return _receivables.map((d, i) => ({
        key: i,
        id: d.id,
        client_id: d.sell.client.id,
        client_name: d.sell.client.name,
        description: d.sell.description,
        date: Utils.formatDate(d.sell.date),
        total: d.sell.total,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  return (
    <>
      <h4 className={'section-space-list-bottom'}>Cuentas por cobrar</h4>
      <Table
        className={'CustomTableClass'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
        rowKey={(record, index) => index}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
    </>
  )
}

export default ReceivableTable
