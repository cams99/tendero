import React, { useState, useEffect } from 'react'
import { Modal, message, Row, Col, Input, Card, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons/lib/icons'
import Utils from '../../../utils/Utils'
import DepositsImage from './deposits/DepositsImage'
import DepositsModal from './deposits/DepositsModal'
import PosSrc from '../PosSrc'

function PosModalDeposit(props) {
  const [deposit, setDeposit] = useState({})
  const [visible, setVisible] = useState(false)
  const [visibleImage, setVisibleImage] = useState(false)
  const [modalImage, setModalImage] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setVisible(props.visible)
  }, [props.visible])

  const deleteImage = currentIndex => {
    const images = deposit.deposit_images.filter((img, i) => i !== currentIndex)
    const newState = { ...deposit, deposit_images: images }

    setDeposit(newState)
    message.success('Imagen eliminada!')
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

  const handleOk = () => {
    const data = {
      store_id: props.storeId,
      store_turn_id: props.storeTurnId,
      deposit_number: deposit.deposit_number,
      amount: deposit.amount,
      images: deposit?.deposit_images?.length > 0 ? deposit.deposit_images.map(img => ({ title: img.title, base64: img.base64 })) : [],
    }

    setLoading(true)
    PosSrc.storeDeposit(null, data)
      .then(res => {
        if (!res) throw new Error()
        message.success('Deposito cargado exitosamente.')
        onClose()
        setLoading(false)
        setDeposit({})
      })
      .catch(e => {
        message.error('No se ha podido cargar el deposito.')
        onClose()
        setLoading(false)
        setDeposit({})
      })
  }

  const onClose = () => {
    setVisible(false)
    props.onClose()
  }

  return (
    <>
      <DepositsModal visible={visibleImage} img={modalImage} onCancel={() => setVisibleImage(false)} />
      <Modal
        visible={visible}
        centered
        className={'add-deposit-modal'}
        title={'Nuevo Depósito'}
        closable={false}
        onOk={handleOk}
        onCancel={onClose}
        footer={[
          <Button key="back" className="cancel-button" onClick={onClose}>
            Cancelar
          </Button>,
          <Button key="submit" className="title-tendero new-button" type="primary" loading={loading} onClick={handleOk}>
            Guardar
          </Button>,
        ]}
      >
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field pl-2'}>Número de boleta</div>
            <Input
              placeholder={'Ingresa el No. de boleta'}
              size={'large'}
              name={'deposit_number'}
              value={deposit?.deposit_number}
              onChange={handleChange}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field pl-2'}>Cantidad</div>
            <Input placeholder={'Cantidad de depósito'} size={'large'} name={'amount'} value={deposit?.amount} onChange={handleChange} />
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
      </Modal>
    </>
  )
}

export default PosModalDeposit
