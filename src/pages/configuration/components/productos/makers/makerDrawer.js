import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Typography } from 'antd'

const { Title } = Typography

function MakersDrawer(props) {
  /*VALUES*/
  const [name, setName] = useState('')

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  /*HANDLERS*/

  const onSaveButton = () => {
    if ([name].includes('') || [name].includes(null)) {
      return message.warning('Todos los campos son obligatorios')
    }
    const data = {
      name: name,
    }
    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className={'products-container-combo-tabs'}>
          <Title> {props.edit ? 'Editar Fabricante' : 'Nuevo Fabricante'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          {/*Fields section*/}
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Ingrese nombre del fabricante'} size={'large'} />
            </Col>
          </Row>
          {/*End Fields section*/}
        </div>
        <Divider className={'divider-custom-margins-users'} />
        {/*Footer buttons section*/}
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button type={'link'} className="cancel-button" onClick={() => props.cancelButton()}>
                  Cancelar
                </Button>
                <Button htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        {/*End Footer buttons section*/}
      </Drawer>
    </>
  )
}
export default MakersDrawer
