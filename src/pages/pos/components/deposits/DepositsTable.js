import React, { useEffect, useState, useContext } from 'react'
import moment from 'moment'
import Utils from '../../../../utils/Utils'
import { Table, Button, Popover, Input, Row, Col, Card, Divider, message } from 'antd'
import { MoreOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons/lib/icons'
import LoadMoreButton from '../../../../components/LoadMoreButton'
import DepositsModal from './DepositsModal'
import PosSrc from '../../PosSrc'
import DepositsImage from './DepositsImage'

// Context
import { Context, useStore } from '../../../../context'

function DepositsTable(props) {
  const [state, dispatch] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [dataSource, setDataSource] = useState([])
  const [deposit, setDeposit] = useState({})
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [depositsList, setDepositsList] = useState(true)
  const [editDeposit, setEditDeposit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalImage, setModalImage] = useState({})

  useEffect(() => {
    if (props.activeKey === '3') {
      setVisible(false)
      fetchDeposits()
    }
    // eslint-disable-next-line
  }, [props.activeKey])

  const columns = [
    {
      title: 'No. boleta',
      dataIndex: 'deposit_number', // Field that is going to be rendered
      render: text => <span style={{ textAlign: 'left' }}>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      render: date => <span>{moment(date).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'deposit_images',
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
    {
      align: 'right',
      title: '',
      dataIndex: 'id',
      render: (id, row) =>
        hasPermissions([43]) && (
          <span>
            {
              <Popover
                placement="left"
                content={
                  <div>
                    <span className={'user-options-items'} onClick={() => onEdit(row)}>
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

  const fetchDeposits = () => {
    setLoading(true)
    PosSrc.getAllDeposits(props.storeId)
      .then(deposits => {
        setDataSource(deposits.data.data)
        setExistMoreInfo(deposits.data.next_page_url !== null)
        setNextPage(deposits.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        message.error('No se ha podido cargar los depositos.')
        setLoading(false)
      })
  }

  const onSearch = e => {}

  const onCreate = () => {
    setDepositsList(false)
  }

  const onEdit = row => {
    setDepositsList(false)
    setEditDeposit(true)
    setDeposit(row)
  }

  const checkErrors = res => {
    Object.keys(res.errors).map(key => {
      if (key === 'deposit_number') {
        message.error(res.errors[key][0].replace('deposit number', 'Número de boleta'))
      } else {
        message.error(res.errors[key])
      }
      return null
    })
  }

  const finishDeposit = () => {
    if (Utils.validateNull(deposit.deposit_number) || Utils.validateNull(deposit.amount) || Utils.validateNull(deposit.deposit_images)) {
      return message.warning('Todos los campos son obligatorios')
    } else if (
      !Number(deposit.deposit_number) ||
      deposit.deposit_number.includes('.') ||
      deposit.deposit_number.includes('-') ||
      deposit.deposit_number.includes('+')
    ) {
      return message.warning('El campo Número de boleta solo acepta valores numéricos')
    } else if (!Number(deposit.amount) || deposit.amount.includes('-') || deposit.amount.includes('+')) {
      return message.warning('El campo Cantidad solo acepta valores numéricos')
    }

    const id = editDeposit ? deposit.id : null
    const data = {
      store_id: editDeposit ? deposit.store_id : props.storeId,
      store_turn_id: state.turn.id,
      deposit_number: deposit.deposit_number,
      amount: deposit.amount,
      images:
        deposit?.deposit_images?.length > 0
          ? deposit.deposit_images.map(img => ({
              title: img.title,
              base64: img.base64,
            }))
          : [],
    }

    setLoading(true)
    switch (editDeposit) {
      case true:
        PosSrc.editDeposit(id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Depósito actualizado exitosamente.')
              getCash(res.store_id)
            }
          })
          .catch(e => {
            message.error('No se ha podido actualizar el depósito.')
            setDepositsList(true)
            setLoading(false)
            setDeposit({})
            setEditDeposit(false)
          })
        break
      case false:
        PosSrc.storeDeposit(id, data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Depósito cargado exitosamente.')
              getCash(res.store_id)
            }
          })
          .catch(e => {
            message.error('No se ha podido cargar el depósito.')
            setDepositsList(true)
            setLoading(false)
            setDeposit({})
            setEditDeposit(false)
          })
        break
      default:
        break
    }
  }

  const getCash = id => {
    PosSrc.getStoreCash(id).then(response => {
      dispatch({
        type: 'TURN CASH',
        payload: response.data[0],
      })
      setDepositsList(true)
      setDeposit({})
      setEditDeposit(false)
      setLoading(false)
      fetchDeposits()
    })
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      PosSrc.getNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(response.data.data))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setDeposit({ ...deposit, [name]: value })
  }

  const handleFileInput = async e => {
    e.persist()
    let images = Array.from(e.target.files).map(async file => ({
      title: file.name,
      base64: await Utils.fileToBase64(file),
    }))
    images = await Promise.all(images)
    images = [...(deposit.deposit_images || []), ...images]

    const newState = { ...deposit, deposit_images: images }
    setDeposit(newState)
    e.target.value = null
  }

  const showImageInModal = img => {
    setModalImage(img)
    setVisible(true)
  }

  const deleteImage = currentIndex => {
    const images = deposit.deposit_images.filter((img, i) => i !== currentIndex)
    const newState = { ...deposit, deposit_images: images }

    setDeposit(newState)
    message.success('Imagen eliminada!')
  }

  const cancelDeposit = () => {
    setDepositsList(true)
    setDeposit({})
    setEditDeposit(false)
  }

  return (
    <>
      <DepositsModal visible={visible} img={modalImage} onCancel={() => setVisible(false)} />
      {depositsList ? (
        <>
          <h4 className={'section-space-list-bottom'}>Depósitos</h4>
          <Row gutter={16}>
            <Col xs={19} sm={19} md={19} lg={19}>
              <Input
                prefix={<SearchOutlined className={'tendero-table-search-icon'} />}
                placeholder="Buscar boleta"
                className={'tendero-table-search custom-search'}
                size={'large'}
                onChange={e => onSearch(e)}
              />
            </Col>
            <Col xs={5} sm={5} md={5} lg={5}>
              {hasPermissions([42]) && (
                <Button className={'pay-receivable new-deposit'} onClick={onCreate}>
                  Nuevo depósito
                </Button>
              )}
            </Col>
          </Row>
          <Table
            id={'deposits-table'}
            className={'CustomTableClass'}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={loading}
            rowKey={(record, index) => index}
          />
          <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
        </>
      ) : (
        <>
          <h4 className={'section-space-list-bottom'}>{editDeposit ? 'Editar depósito' : 'Nuevo depósito'}</h4>
          <Row gutter={16}>
            <Col xs={11} sm={11} md={11} lg={11}>
              <div className={'title-space-field pl-2'}>Número de boleta</div>
              <Input
                placeholder={'Ingresa el No. de boleta'}
                value={deposit.deposit_number}
                size={'large'}
                name={'deposit_number'}
                onChange={handleChange}
              />
            </Col>
            <Col xs={7} sm={7} md={7} lg={7}>
              <div className={'title-space-field pl-2'}>Cantidad</div>
              <Input placeholder={'Cantidad de depósito'} value={deposit.amount} size={'large'} name={'amount'} onChange={handleChange} />
            </Col>
          </Row>
          <Row gutter={16} className={'deposit-images'}>
            {deposit?.deposit_images?.length > 0 &&
              deposit.deposit_images.map((img, i) => (
                <DepositsImage
                  key={i}
                  index={i}
                  img={img}
                  showImageInModal={img => showImageInModal(img)}
                  deleteImage={index => deleteImage(index)}
                  withOverlay={true}
                />
              ))}
            <Card className={'add-deposit-image'}>
              <PlusOutlined />
              Subir
              <label htmlFor="image-upload-input" className="image-upload">
                <input type="file" id="image-upload-input" accept=".jpeg, .jpg, .png" onChange={handleFileInput} multiple />
              </label>
            </Card>
          </Row>
          <Row gutter={16} className={'deposit-images'}>
            <Divider className={'divider-custom-margins-users'} />
            <Col sm={24}>
              <div className="pay-buttons">
                <Button type={'link'} className="cancel-button" onClick={cancelDeposit}>
                  Cancelar
                </Button>
                <Button loading={loading} htmlType="submit" className="title-tendero new-button" onClick={finishDeposit}>
                  {editDeposit ? 'Actualizar deposito' : 'Finalizar deposito'}
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default DepositsTable
