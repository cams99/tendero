import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const read = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.users}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getStoreOption = async id =>
  api
    .get(`${url.stage.stores_options}?per_page=100&company_id=${id}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const showUser = async id =>
  api
    .get(`${url.stage.users}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const userNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const saveUser = async data =>
  api
    .post(url.stage.users, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const updateUser = async (data, userId) =>
  api
    .put(`${url.stage.users}/${userId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeUser = async userId =>
  api
    .remove(`${url.stage.users}/${userId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getPermissionsList = async () =>
  api
    .get(`${url.stage.permissions}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getUserPermissions = async userId =>
  api
    .get(`${url.stage.userPermissions(userId)}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const storeUserPermissions = async (userId, permissionsIds) =>
  api
    .post(`${url.stage.userPermissions(userId)}?paginate=0`, { permissions: permissionsIds })
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getRoles = async () =>
  api
    .get(`${url.stage.roles}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const currentUser = async () =>
  api
    .get(url.stage.currentUser, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  read,
  getStoreOption,
  showUser,
  userNextPage,
  saveUser,
  updateUser,
  removeUser,
  getPermissionsList,
  getUserPermissions,
  storeUserPermissions,
  getRoles,
  currentUser,
}
