import Enterprises from '../pages/enterprises/enterprisesIndex'
import Users from '../pages/users/usersIndex'
import Clients from '../pages/clients/clientsIndex'
import Shops from '../pages/shops/shopIndex'
import Configuration from '../pages/configuration/configurationIndex'
import Products from '../pages/products/productIndex'
import Inventory from '../pages/inventory/InventoryIndex'
import POS from '../pages/pos/PosIndex'
import CashRegister from '../pages/cashRegister/CashRegisterIndex'

const menu_routes = [
  {
    name: 'Empresas',
    key: 'enterprises',
    icon: 'enterprises',
    route: '/enterprises',
    component: Enterprises,
    profilePermissions: [1],
  },
  {
    name: 'Usuarios',
    key: 'users',
    icon: 'users',
    route: '/users',
    component: Users,
    profilePermissions: [5],
  },
  {
    name: 'Tiendas',
    key: 'shops',
    icon: 'shops',
    route: '/shops',
    component: Shops,
    profilePermissions: [9],
  },
  {
    name: 'Productos',
    key: 'products',
    icon: 'products',
    route: '/products',
    component: Products,
    profilePermissions: [21],
  },
  {
    name: 'Clientes',
    key: 'clients',
    icon: 'clients',
    route: '/clients',
    component: Clients,
    profilePermissions: [61],
  },
  {
    name: 'Configuracion',
    key: 'configurations',
    icon: 'configurations',
    route: '/configurations',
    component: Configuration,
    profilePermissions: [65],
  },
  {
    name: 'Inventario',
    key: 'inventory',
    icon: 'inventory',
    route: '/inventory',
    component: Inventory,
    profilePermissions: [25],
  },
  {
    name: 'Caja',
    key: 'cash-register',
    icon: 'cashRegister',
    route: '/cash-register',
    component: CashRegister,
    profilePermissions: [41],
  },
  {
    name: 'POS',
    key: 'pos',
    icon: 'pos',
    route: '/pos',
    component: POS,
    profilePermissions: [45],
  },
]

export { menu_routes }
