import React from 'react'
import { Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons/lib/icons'

function DepositsModal(props) {
  const handleCancel = () => {
    props.visibleStatus(false)
  }

  const handleOk = () => {
    props.onDelete()
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
            Anular
          </Button>,
        ]}
        onCancel={handleCancel}
        className={'sellList-modal'}
      >
        <ExclamationCircleOutlined />
        <span>¿Estás seguro que deseas anular esta factura?</span>
        <span>Esta acción es irreversible.</span>
      </Modal>
    </>
  )
}

export default DepositsModal
