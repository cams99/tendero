import React from 'react'
import { Modal } from 'antd'

const DepositsModal = ({ img, visible, onCancel }) => (
  <Modal visible={visible} centered className={'deposit-modal'} onCancel={onCancel} title={img.title}>
    <img src={img.base64} alt={'deposit'} style={{ width: '100%' }} />
  </Modal>
)

export default DepositsModal
