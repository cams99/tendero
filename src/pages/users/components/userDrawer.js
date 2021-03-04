import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Transfer, Typography, Popover } from 'antd'
import EyeTwoTone from '@ant-design/icons/lib/icons/EyeTwoTone'
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined'
import Utils from '../../../utils/Utils'
import userSrc from '../userSrc'

// Context
import { Context } from '../../../context'

const { Title } = Typography
const { Option } = Select
const validateMessageFields = 'Por favor, verifique los campos obligatorios'

function UserDrawer(props) {
  const [{ auth }] = useContext(Context)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [enterprises, setEnterprises] = useState(null)

  //shop transfer
  const [rolesList, setRolesList] = useState(null)
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [loadingTransferData, setLoadingTransferData] = useState(true)
  const [loading, setLoading] = useState(true)

  // _stores_ids
  const loadUserInformation = () => {
    setName(props.edit ? props.editData._name : '')
    setEmail(props.edit ? props.editData._email : '')
    setRole(props.edit ? props.editData._perfilInicialId : null)
    setPhone(props.edit ? props.editData._telefono : null)
    setCompanyId(props.edit ? props.editData._empresa : null)
    setUserName(props.edit ? props.editData._username : '')
    setPassword('')
    setConfirmPassword('')
    if (props.edit) getStores(props.editData._empresa)
  }

  useEffect(() => {
    loadUserInformation()
    if (props.visible) {
      getRoles()
      onSearchEnterprise(props.edit ? props.editData._empresaNombre : '')
      if (auth.role_id !== 1) {
        setCompanyId(auth.company_id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    if (props.visible) {
      getStores(companyId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, companyId])

  const onSearchEnterprise = val => {
    val !== null ? (val = '') : (val = '')

    Utils.getEnterpriseOption(val)
      .then(response => {
        setEnterprises(response.data.data)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion de empresa')
      })
  }

  const onChangeTransfer = targetKeys => {
    setTargetKeys(targetKeys)
  }

  const getStores = id => {
    setLoadingTransferData(true)
    setMockData([])
    setTargetKeys([])
    let targetKeys = []
    let mockData = []
    userSrc.getStoreOption(id)
      .then(response => {
        let _response = response.data.data
        _response.map(response => {
          let data = {
            key: response.id,
            title: response.name,
          }

          if (props.editData && props.editData._stores_ids.length > 0) {
            if (props.edit && props.editData._stores_ids.some(store => store.id === data.key)) {
              targetKeys.push(data.key)
            }
          }

          mockData.push(data)
          setLoadingTransferData(false)
          return true
        })
      })
      .then(_ => {
        setMockData(mockData)
        setTargetKeys(targetKeys)
      })
      .catch(err => {
        console.log(err)
        message.error('No se han podido cargar las tiendas')
      })
  }

  const getRoles = () => {
    setLoading(true)
    userSrc
      .getRoles()
      .then(response => {
        setRolesList(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error al guardar la compra')
        setLoading(false)
      })
  }

  const saveData = () => {
    //validations

    if (name === '' || email === '' || username === '') {
      return message.warning(validateMessageFields)
    } else if (phone === null || role === null || companyId === null) {
      return message.warning(validateMessageFields)
    } else if (password !== confirmPassword) {
      return message.warning('Contraseñas no coinciden')
    } else if (password.length < 8 && (!props.edit || password.length > 0)) {
      return message.warning('La contraseña debe tener al menos 8 caracteres')
    }

    if (!Utils.validateEmail(email)) {
      return message.warning('Ingresa un email valido')
    }

    //create request
    let requestData
    if (props.edit && password.length === 0) {
      requestData = {
        name: name,
        role_id: role,
        email: email,
        phone: phone,
        company_id: companyId,
        username: username,
        stores: targetKeys,
      }
    } else {
      requestData = {
        name: name,
        role_id: role,
        email: email,
        phone: phone,
        company_id: companyId,
        username: username,
        password: password,
        password_confirmation: confirmPassword,
        stores: targetKeys,
      }
    }
    let id = props.editData ? props.editData._id : null
    props.saveButton(requestData, id, props.edit) 
  }

  const contentPopHover = () => {
    return (
      <div>
        <p>La contraseña debe tener al menos 8 caracteres</p>
      </div>
    )
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <Title> {props.edit ? 'Editar Usuario' : 'Nuevo Usuario'} </Title>
      <Divider className={'divider-cxustom-margins-users'} />
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={'title-space-field'}>Nombre</div>
          <Input value={name} placeholder={'Nombre'} size={'large'} onChange={value => setName(value.target.value)} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={'title-space-field'}>Email</div>
          <Input value={email} placeholder={'Email'} size={'large'} onChange={value => setEmail(value.target.value)} type={'email'} />
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <div className={'title-space-field'}>Perfil Inicial*</div>
          <Select
            disabled={loading}
            loading={loading}
            className={'single-select'}
            placeholder={'Perfil Inicial'}
            size={'large'}
            style={{ width: '100%' }}
            value={role}
            onChange={value => {
              setRole(value)
              if (value === 1) {
                setCompanyId(auth.company_id)
              } else if (auth.role_id === 1) {
                setCompanyId(null)
              }
            }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            {rolesList &&
              rolesList.map(data => (
                <Option key={data.id} value={data.id}>
                  {data.name}
                </Option>
              ))}
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <div className={'title-space-field'}>Telefono*</div>
          <Input placeholder={'Escribir telefono'} size={'large'} type={'number'} value={phone} onChange={value => setPhone(value.target.value)} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={'title-space-field'}>Empresa*</div>
          <Select
            disabled={auth.role_id !== 1 || role === 1}
            showSearch
            optionFilterProp="children"
            className={'single-select'}
            placeholder={'Empresa'}
            size={'large'}
            style={{ width: '100%' }}
            value={companyId}
            onChange={value => setCompanyId(value)}
            onSearch={onSearchEnterprise}
            getPopupContainer={trigger => trigger.parentNode}
          >
            {enterprises &&
              enterprises.map(data => {
                return (
                  <Option key={data.id} value={data.id}>
                    {data.name}
                  </Option>
                )
              })}
          </Select>
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <div className={'title-space-field'}>Username*</div>
          <Input value={username} placeholder={'Nombre'} size={'large'} onChange={value => setUserName(value.target.value)} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <div className={'title-space-field'}>Password*</div>
          <Popover content={contentPopHover} trigger="hover">
            <Input.Password
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              type={'password'}
              placeholder={'Password'}
              size={'large'}
              value={password}
              onChange={value => setPassword(value.target.value)}
            />
          </Popover>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <div className={'title-space-field'}>Confirmar Password*</div>
          <Input.Password
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            type={'password'}
            placeholder={'Confirmar Password'}
            size={'large'}
            value={confirmPassword}
            onChange={value => setConfirmPassword(value.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-list'}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className={'label-bold-500'} style={{ marginLeft: '10px' }}>
            Tiendas disponibles
          </span>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <span className={'label-bold-500'} style={{ marginLeft: '20px' }}>
            Tiendas asignadas al usuario
          </span>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Transfer
            disabled={loadingTransferData}
            dataSource={mockData}
            showSearch
            listStyle={{
              width: '100%',
              height: 250,
            }}
            targetKeys={targetKeys}
            onChange={onChangeTransfer}
            render={item => `${item.title}`}
          />
        </Col>
      </Row>
      <Divider className={'divider-custom-margins-users'} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button type={'link'} onClick={() => props.cancelButton()} className="cancel-button">
                Cancelar
              </Button>

              <Button className="title-tendero new-button" onClick={() => saveData()}>
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Drawer>
  )
}

export default UserDrawer
