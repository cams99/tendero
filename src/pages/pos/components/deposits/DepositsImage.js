import React, { useState } from 'react'
import { Button, Card, Popconfirm } from 'antd'
import { ZoomInOutlined, DeleteOutlined } from '@ant-design/icons/lib/icons'

const DepositsImage = props => {
  const [showOverlay, setShowOverlay] = useState(false)

  const setModalImage = () => {
    props.showImageInModal(props.img)
    setShowOverlay(false)
  }

  const handleDelete = () => {
    props.deleteImage(props.index)
    setShowOverlay(false)
  }

  return (
    <Card>
      {props.withOverlay ? (
        <>
          <img src={props.img.base64} alt={'deposit-' + props.index} />
          <div className={`deposit-image-overlay ${showOverlay ? 'visible' : ''}`}>
            <Button title="Ampliar Imagen" className="button see" onClick={setModalImage}>
              <ZoomInOutlined />
            </Button>
            <Popconfirm
              title="¿Desea eliminar la imagen?"
              onConfirm={handleDelete}
              onCancel={() => setShowOverlay(false)}
              okText="Si"
              cancelText="No"
            >
              <Button title="Eliminar Imagen" className="button delete" onClick={() => setShowOverlay(true)}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        </>
      ) : (
        <img src={props.img.base64} alt={'deposit-' + props.index} onClick={setModalImage} />
      )}
    </Card>
  )
}

export default DepositsImage
