import React, { useState, useContext } from 'react'
import { Form, Input, Button, Row, message } from 'antd'
import { Context } from '../../context'
import src from '../../context/cacheApp'
import env from '../../api/env'
import CryptoAES from 'crypto-js/aes'
import CryptoJSAesJson from '../../config/cryptojs-aes-format'
import loginSrc from './loginSrc'

function Login() {
  const [_, dispatch] = useContext(Context) // eslint-disable-line
  const [loading, setLoading] = useState(false)

  const handleSubmit = async values => {
    try {
      setLoading(true)
      let usernameE = CryptoAES.encrypt(JSON.stringify(values.username), env.passphrase, { format: CryptoJSAesJson }).toString()
      let passwordE = CryptoAES.encrypt(JSON.stringify(values.password), env.passphrase, { format: CryptoJSAesJson }).toString()

      loginSrc.authLogin(usernameE, passwordE).then(auth => {
        if (!auth?.data) {
          message.error(auth?.message || 'Ocurrio un error')
          setLoading(false)
          return
        }
        src.sessionApp(auth.data, 'setter')
        dispatch({
          type: 'AUTH FETCHED',
          payload: auth.data,
        })
        setLoading(false)
      })
    } catch (err) {
      dispatch({ type: 'AUTH' })
      setLoading(false)
      message.error(err)
    }
  }

  const onFinishFailed = errorInfo => {
    errorInfo.errorFields.map(error => message.error(error.errors))
  }

  return (
    <Row type="flex" justify="center" align="middle" className={'login-row-container'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="tendero-logo-lg.png" className={'login-logo-lg'} alt={'moocho'} />

        <div className={'login-container'}>
          <Form
            name="login-form"
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            style={{ width: '400px' }}
            labelAlign={'left'}
            labelCol={{ xs: 24, sm: 24, md: 24, lg: 24 }}
            wrapperCol={{ xs: 24, sm: 24, md: 24, lg: 24 }}
            colon={false}
          >
            <Form.Item
              style={{ textAlign: 'left' }}
              label="Usuario"
              name="username"
              rules={[
                {
                  message: 'Ingresa un username valido',
                  type: 'string',
                },
              ]}
            >
              <Input placeholder={'Escribe tu usuario'} size={'large'} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'left' }} label="Contraseña" name="password">
              <Input.Password placeholder={'Escribe tu contraseña'} size={'large'} />
            </Form.Item>

            <div className={'login-button-container'} style={{ paddingBottom: '25px' }}>
              <Button type={'link'} className={'login-btn-link'}>
                ¿No recuerdas tu contraseña? Contacta con el administrador de tu cuenta
              </Button>
            </div>

            <div className={'login-button-container'}>
              <Form.Item>
                <Button
                  style={{ width: '200px' }}
                  className="bottom-login login-btn"
                  disabled={loading}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                >
                  Iniciar sesion
                </Button>
              </Form.Item>
              <span className={'login-btn-link title-space-top'}>V - {process.env.REACT_APP_VERSION}</span>
            </div>
          </Form>
        </div>
      </div>
    </Row>
  )
}
export default Login
