import React, { useContext, useEffect, useState } from 'react'
import { Menu } from 'antd'
import {
  HomeOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  ShoppingOutlined,
  IdcardOutlined,
  SettingOutlined,
  ProjectOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { menu_routes } from './Menu_routes'

// Context
import { Context, useStore } from '../context'

function MenuView() {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const history = useHistory()
  const [key, setKey] = useState("")

  useEffect(() => {
    let actualPath = menu_routes.find(m => m.route === history.location.pathname)
    if (hasPermissions(actualPath.profilePermissions)) {
      setKey(actualPath.key)
    } else {
      let path = menu_routes.find(m => hasPermissions(m.profilePermissions))
      setKey(path.key)
    }
    // eslint-disable-next-line
  }, [])

  let returnIcon = iconName => {
    switch (iconName) {
      case 'enterprises':
        return <HomeOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'users':
        return <UsergroupAddOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'shops':
        return <ShopOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'products':
        return <ShoppingOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'clients':
        return <IdcardOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'configurations':
        return <SettingOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'inventory':
        return <ProjectOutlined style={{ color: '#01c01e', fontSize: '18px', transform: 'rotate(-90deg)' }} />
      case 'pos':
        return <CreditCardOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      case 'cashRegister':
        return <WalletOutlined style={{ color: '#01c01e', fontSize: '18px' }} />
      default:
        return <React.Fragment></React.Fragment>
    }
  }

  return (
    <Menu mode="inline" selectedKeys={[key]} style={{ height: '100%', paddingTop: '20px' }}>
      {menu_routes &&
        menu_routes.length > 0 &&
        menu_routes.map((option, i) => (
          hasPermissions(option.profilePermissions) && (
            <Menu.Item key={option.key} icon={returnIcon()} onClick={() => setKey(option.key)} >
              <Link to={option.route}>
                {returnIcon(option.icon)}
                <span style={{ paddingLeft: '13px' }}>{option.name}</span>
              </Link>
            </Menu.Item>
          )
        ))}
    </Menu>
  )
}
export default MenuView
