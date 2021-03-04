import React, { useEffect, useState } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../../../utils/Utils'

const { Option } = Select
const { Title } = Typography

function MetodoPagoDrawer(props) {
  const [name, setName] = useState('')
  const [companies, setCompanies] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setCompanyId(props.edit ? props.editData.company_id : null)
    onSearchCompany('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onSearchCompany = val => {
    setLoading(true)
    Utils.getCompanies(val)
      .then(response => {
        setLoading(false)
        setCompanies(response.data.data)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        message.error('No se ha podido cargar la informacion de Compañia')
      })
  }

  const onSaveButton = () => {
    if (!(name && companyId)) {
      return message.warning('Todos los campos son obligatorios')
    }

    const data = { name, company_id: companyId }

    props.saveButton(props.edit, data, props.edit ? props.editData.id : null)
  }

  return (
    <>
      <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
        <div className="products-container-combo-tabs">
          <Title>{props.edit ? 'Editar método de pago' : 'Nuevo método de pago'}</Title>
          <Divider className="divider-custom-margins-users" />
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Nombre</div>
              <Input value={name} onChange={value => setName(value.target.value)} placeholder={'Nombre Método de Pago'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className={'title-space-field'}>Compañia</div>
              <Select
                showSearch
                optionFilterProp="children"
                onSearch={onSearchCompany}
                value={companyId}
                className={'single-select'}
                placeholder={'Seleccionar Compañia'}
                size={'large'}
                style={{ width: '100%' }}
                onChange={setCompanyId}
              >
                {companies &&
                  companies.map(data => {
                    return (
                      <Option key={data.id} value={data.id}>
                        {data.name}
                      </Option>
                    )
                  })}
              </Select>
            </Col>
          </Row>
        </div>
        <Divider className={'divider-custom-margins-users'} />
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="text-right">
              <div>
                <Button type="link" className="cancel-button" onClick={() => props.cancelButton()}>
                  Cancelar
                </Button>
                <Button loading={loading} htmlType="submit" className="title-tendero new-button" onClick={() => onSaveButton()}>
                  Guardar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  )
}

export default MetodoPagoDrawer
