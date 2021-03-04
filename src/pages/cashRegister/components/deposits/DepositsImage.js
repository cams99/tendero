import React from 'react'
import { Card } from 'antd'

const DepositsImage = props => {

  const setModalImage = () => {
    props.showImageInModal(props.img)
  }

  return (
    <Card>
      <img src={props.img.base64} alt={'deposit-' + props.index} onClick={setModalImage} />
    </Card>
  )
}

export default DepositsImage