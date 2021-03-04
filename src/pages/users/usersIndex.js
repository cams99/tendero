//libraries
import React, { useEffect, useState, useContext } from 'react'
import { message } from 'antd'
//components
import UserTable from '../users/components/userTable'
import HeaderPage from '../../components/HeaderPage'
import UserDrawer from './components/userDrawer'
import LoadMoreButton from '../../components/LoadMoreButton'
import UserPermissions from './components/userPermissions'
import userSrc from './userSrc'

import { Context } from '../../context'

function Users() {
  const [{ auth }] = useContext(Context)
  const [dataSource, setDataSource] = useState([])
  const [visible, setVisible] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(0)

  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadUserData = () => {
    setLoading(true)
    setVisible(false)
    userSrc
      .read('', 5)
      .then(response => {
        setDataSource(getUsers(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(e => {
        message.error('No se ha podido cargar la informacion')
        console.log(e)
      })
  }

  const EditRow = data => {
    setLoading(true)
    userSrc
      .showUser(data._id)
      .then(response => {
        setEditDataDrawer(getUsers(response, true)[0])
        setEditMode(true)
        setVisible(true)
        setLoading(false)
      })
      .catch(e => {
        message.error('No se ha podido cargar la informacion')
        console.log(e)
        setLoading(false)
      })
  }

  const getUsers = (users, edit = false) => {
    if (users !== 'Too Many Attempts.') {
      let _users = !edit ? users.data.data || [] : [users]
      return _users.map((d, i) => ({
        key: i,
        _id: d.id,
        _name: d.name,
        _perfilInicialId: d.role !== null && typeof d.role.name !== undefined ? d.role_id : null,
        _perfilInicial: d.role !== null && typeof d.role.name !== undefined ? d.role.name : null,
        _email: d.email,
        _telefono: d.phone,
        _empresa: d.company !== null && typeof d.company.name !== undefined ? d.company_id : null,
        _empresaNombre: d.company !== null && typeof d.company.name !== undefined ? d.company.name : null,
        _username: d.username,
        _stores_ids: d?.stores || []
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      userSrc.userNextPage(nextPage).then(response => {
        setDataSource(dataSource.concat(getUsers(response)))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
    }
  }

  const searchText = data => {
    setLoading(true)
    userSrc
      .read(data, 5)
      .then(response => {
        setDataSource(getUsers(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en la busqueda')
      })
  }

  const showDrawer = () => {
    setEditMode(false)
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onCancelButton = () => {
    setVisible(false)
  }

  const checkErrors = res => {
    Object.keys(res.errors).map(key => {
      switch (key) {
        case 'email':
          message.error(res.errors[key][0].replace('email', 'Email'))
          break
        case 'username':
          message.error(res.errors[key][0].replace('username', 'Username'))
          break
        default:
          message.error(res.errors[key])
          break
      }
      return null
    })
  }

  const onSaveButton = (data, user_id, method) => {
    setLoading(true)
    switch (method) {
      case true:
        userSrc.updateUser(data, user_id).then(res => {
          if (res.errors && Object.keys(res.errors)?.length > 0) {
            checkErrors(res)
            setLoading(false)
          } else {
            message.success('Usuario actualizado')
            setVisible(false)
            loadUserData()
          }
        })
        break
      case false:
        userSrc.saveUser(data).then(res => {
          if (res.errors && Object.keys(res.errors)?.length > 0) {
            checkErrors(res)
            setLoading(false)
          } else {
            message.success('Usuario creado')
            setVisible(false)
            loadUserData()
          }
        })
        break
      default:
        break
    }
  }

  const DeleteRow = data => {
    setLoading(true)
    userSrc
      .removeUser(data._id)
      .then(response => {
        message.success(`${response.name} se ha elminado.`)
        setLoading(false)
        loadUserData()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
        setLoading(false)
      })
  }

  const editPermissions = data => {
    setUserId(data._id)
    setShowPermissions(true)
  }

  return (
    <div>
      <HeaderPage titleButton={'Nuevo usuario'} title={'Usuarios'} showDrawer={showDrawer} permissions={6} create={auth.company?.allow_add_users}/>
      <UserTable
        dataSource={dataSource}
        handlerTextSearch={searchText}
        loading={loading}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerEditPermissions={editPermissions}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <UserDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onCancelButton}
        saveButton={onSaveButton}
      />
      <UserPermissions
        closable={() => {
          setShowPermissions(false)
        }}
        visible={showPermissions}
        userId={userId}
      />
    </div>
  )
}

export default Users
