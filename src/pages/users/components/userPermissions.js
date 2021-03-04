import React, { useState, useEffect, useContext } from 'react'
import { Table, Checkbox, Button, Col, Divider, Drawer, message, Row, Typography } from 'antd'
import userPermissionsSrc from '../userSrc'
import Utils from '../../../utils/Utils'
import { Context } from '../../../context'
const { Title } = Typography

function UserPermissions(props) {
  // eslint-disable-next-line 
  const [_, dispatch] = useContext(Context)
  const [permissionsList, setPermissionsList] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [tableDataSource, setTableDataSource] = useState([])
  const [loading, setLoading] = useState(true)

  const columns = [
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'key',
      align: 'left',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Ver',
      dataIndex: 'ver',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="ver"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Crear',
      dataIndex: 'crear',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="crear"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Editar',
      dataIndex: 'editar',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="editar"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Eliminar',
      dataIndex: 'eliminar',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="eliminar"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
  ]

  const generateTableDataSource = () => {
    return permissionsList.reduce((result, val, index) => {
      const rowDTO = value => {
        const valueName = value.name.toLowerCase()
        return {
          key: Utils.camelCaseize(value.group),
          accion: value.group,
          [`${valueName}Id`]: value.id,
          [valueName]: userPermissions.length > 0 ? userPermissions.some(v => v.id === value.id) : false,
        }
      }

      if (index === 1) result = [rowDTO(result)]
      const permission = rowDTO(val)

      if (!result.some(v => v.key === permission.key)) {
        result.push(permission)
        return result
      }
      return result.map(rowData => {
        if (rowData.key === permission.key) return Object.assign(rowData, permission)
        return rowData
      })
    })
  }

  useEffect(() => {
    if (props.visible) {
      setLoading(true)
      userPermissionsSrc
        .getUserPermissions(props.userId)
        .then(response => {
          setUserPermissions(response.data)
        })
        .catch(err => {
          console.log(err)
          message.error('No se han podido cargar los permisos')
        })

      userPermissionsSrc
        .getPermissionsList()
        .then(response => {
          setPermissionsList(response.data)
        })
        .catch(err => {
          console.log(err)
          message.error('No se han podido cargar los permisos')
        })
    }
    return setUserPermissions([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    // Asumiendo que no deben existir usuarios que no tengan ningun permisos asignado
    // userPermissions   deberia cambiar por   userPermissions.length > 0
    if (permissionsList.length > 0 && userPermissions) {
      const dataSource = generateTableDataSource()
      setTableDataSource(dataSource)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, permissionsList])

  const onCancel = () => {
    props.closable()
  }

  const savePermissions = () => {
    setLoading(true)
    const permissionsIds = tableDataSource
      .flatMap(v => [v.ver && v.verId, v.crear && v.crearId, v.editar && v.editarId, v.eliminar && v.eliminarId])
      .filter(v => !!v)

    userPermissionsSrc
      .storeUserPermissions(props.userId, permissionsIds)
      .then(response => {
        userPermissionsSrc.currentUser().then(user => {
          message.success('Permisos modificados exitosamente')
          dispatch({
            type: 'AUTH FETCHED',
            payload: user,
          })
          setLoading(false)
          setUserPermissions([])
          setPermissionsList([])
          props.closable()
        })
      })
      .catch(e => {
        message.error('No se ha podido modificar los permisos')
        console.log(e)
      })
  }

  const handlePermissionsChange = (e, changedRow) => {
    const changedTableDataSource = tableDataSource.map(row => {
      if (row.key === changedRow.key) return Object.assign(row, { [e.target.name]: e.target.checked })
      return row
    })

    setTableDataSource(changedTableDataSource)
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <Title> {'Editar permisos'} </Title>
      <Divider className={'divider-cxustom-margins-users'} />
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Table
            id="edit-permissions-table"
            loading={loading}
            className={'CustomTableClass'}
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
      <Divider className={'divider-custom-margins-users'} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button type={'link'} className="cancel-button" onClick={onCancel}>
                Cancelar
              </Button>

              <Button className="title-tendero new-button" onClick={savePermissions}>
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Drawer>
  )
}

export default UserPermissions
