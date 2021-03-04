import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd'

function PosPaymentModal(props) {
  const [name, setName] = useState(null)

  const handleCancel = () => {
    props.visibleStatus(false)
  }

  const handleOk = () => {
    let data = {
      id: null,
      name
    }
    props.addClient(data)
    setName(null)
  }

  return (
    <>
      <Modal
        visible={props.visible}
        centered
        footer={[
          <Button key="back" onClick={handleCancel} className={'cancel-button'}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} className={'title-tendero new-button'}>
            Agregar
          </Button>
        ]}
        onCancel={handleCancel}
        className={'sellList-modal'}
      >
        <Input onChange={e => setName(e.target.value)} placeholder={'Nuevo Cliente'} size={'large'} />
      </Modal>
    </>
  )
}

export default PosPaymentModal
