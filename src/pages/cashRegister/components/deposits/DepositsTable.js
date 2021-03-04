import React, { useEffect, useState } from 'react'
import { Table, Col, Row, Card, message } from 'antd'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import cashRegisterSrc from '../../cashRegisterSrc'
import Utils from '../../../../utils/Utils'
import DepositsImage from './DepositsImage'
import DepositsModal from './DepositsModal'

function InventoryTable(props) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [modalImage, setModalImage] = useState({})

  useEffect(() => {
    fetchDeposits(props.selectedOption)
    // eslint-disable-next-line
  }, [props.selectedOption])

  const fetchDeposits = storeId => {
    setLoading(true)
    cashRegisterSrc
      .getDeposits(storeId)
      .then(response => {
        setDataSource(setDeposits(response))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se han podido cargar los depositos.')
        setLoading(false)
      })
  }

  const showImageInModal = img => {
    setModalImage(img)
    setVisible(true)
  }

  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'store_name', // Field that is goint to be rendered
      key: 'store_name',
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Usuario',
      dataIndex: 'user_name', // Field that is goint to be rendered
      key: 'user_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'No. boleta',
      dataIndex: 'invoce', // Field that is goint to be rendered
      key: 'invoice',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      key: 'date',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount', // Field that is goint to be rendered
      key: 'amount',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'deposit_images', // Field that is goint to be rendered
      key: 'deposit_images',
      render: images => (
        <div className="images-container">
          {images.length > 0 &&
            images.map((img, i) => (
              <DepositsImage
                key={i}
                withOverlay={false}
                img={img}
                index={i}
                alt={'deposito' + i}
                showImageInModal={selectedImg => showImageInModal(selectedImg)}
                className="table-image"
              />
            ))}
        </div>
      ),
    },
  ]

  const setDeposits = (deposits) => {
    if (deposits !== 'Too Many Attempts.') {
      let _deposits = deposits.data.data || []
      return _deposits.map((d, i) => ({
        key: i,
        store_name: props.shopsList.find(s => s.id === d.store_id).name,
        user_name: d.creator.name,
        invoce: d.deposit_number,
        date: Utils.formatDate(d.date),
        amount: d.amount,
        deposit_images: d.deposit_images,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setExistMoreInfo(false)
      setLoading(true)
      cashRegisterSrc.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(setDeposits(response)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  return (
    <>
      <DepositsModal visible={visible} img={modalImage} onCancel={() => setVisible(false)} />
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  id={'deposits-table'}
                  className={'CustomTableClass'}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  loading={loading}
                  rowKey="key"
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
