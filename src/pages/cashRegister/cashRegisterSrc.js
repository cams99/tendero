import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const getAllStores = async () =>
  api
    .get(`${url.stage.stores_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllUsers = async () =>
  api
    .get(`${url.stage.users}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getDeposits = async id =>
  api
    .get(`${url.stage.deposits}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getStore = async id =>
  api
    .get(`${url.stage.storesCash}?id=${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newCashAdjustment = async data =>
  api
    .post(`${url.stage.cashAdjustment}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getAllStores,
  getDeposits,
  getAllUsers,
  getNextPage,
  getStore,
  newCashAdjustment,
}
