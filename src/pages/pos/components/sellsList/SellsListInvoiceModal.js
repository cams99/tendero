import React, { useState } from 'react'
import { Modal, Spin } from 'antd'

const SellsListInvoiceModal = ({ invoice, visible, visibleStatus }) => {
  const [loading, setLoading] = useState(true)
  const handleCancel = () => {
    visibleStatus(false)
    setLoading(true)
  }
  return (
    <Modal visible={visible} centered className={'invoice-modal'} onCancel={handleCancel} title={`${invoice.invoice}.pdf`}>
      {invoice.invoice_link && (
        <Spin spinning={loading}>
          <object
            data={`https://docs.google.com/viewer?url=${invoice.invoice_link}&embedded=true`}
            onLoad={() => setLoading(false)}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <p>Tu navegador no tiene el plugin para previsualizar documentos pdf.</p>
            <p>
              Puedes descargarte el archivo desde <a href={invoice.invoice_link}>aquí</a>
            </p>
          </object>
        </Spin>
      )}
    </Modal>
  )
}

export default SellsListInvoiceModal
