import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const getAllStores = async () =>
  api
    .get(`${url.stage.storesCash}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllProducts = async (storeId, turnId) =>
  api
    .get(`${url.stage.stores}/${storeId}/turns/${turnId}/items?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllClients = async () =>
  api
    .get(`${url.stage.Client_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllPaymentMethods = async () =>
  api
    .get(`${url.stage.paymentMethod_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getStoreTurns = async id =>
  api
    .get(`${url.stage.Turns_options}?store_id=${id}&paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const openStoreTurn = async data =>
  api
    .post(`${url.stage.storeTurns}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const closeStoreTurn = async (id, data) =>
  api
    .put(`${url.stage.storeTurns}/${id}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const getStoreTurn = async id =>
  api
    .get(`${url.stage.storeTurns}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const getStoreCash = async id =>
  api
    .get(`${url.stage.storesCash}?id=${id}&paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const getClosedStoreTurn = async id =>
  api
    .get(`${url.stage.storeTurns}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const saveSell = async data =>
  api
    .post(`${url.stage.sells}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const saveOfflineSells = async data =>
  api
    .post(`${url.stage.sellsOffline}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getReceivables = async id =>
  api
    .get(`${url.stage.sellPayments}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const completeSell = async (id, data) =>
  api
    .put(`${url.stage.sellPayments}/${id}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const getSells = async id =>
  api
    .get(`${url.stage.sells}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const sellDelete = async id =>
  api
    .remove(`${url.stage.sells}/${id}`, {})
    .then(res => res)
    .catch(err => err)

const getAllDeposits = async id =>
  api
    .get(`${url.stage.deposits}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getDeposit = async id => {
  return api
    .get(`${url.stage.deposits}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))
}

const storeDeposit = async (id, data) => {
  const depositId = id ? '/' + id : ''
  return api
    .post(url.stage.deposits + depositId, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))
}

const editDeposit = async (id, data) =>
  api
    .put(`${url.stage.deposits}/${id}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const searchPresentations = async (storeId, turnId, value) =>
  api
    .get(
      `${url.stage.stores}/${storeId}/turns/${turnId}/items?presentation_combo_description=${value}%&presentation_description=${value}%&sku_code=${value}%&paginate=0`,
      {}
    )
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getAllStores,
  getAllProducts,
  getAllClients,
  getAllPaymentMethods,
  getStoreTurns,
  openStoreTurn,
  getStoreTurn,
  saveSell,
  saveOfflineSells,
  getReceivables,
  completeSell,
  getNextPage,
  getSells,
  sellDelete,
  getAllDeposits,
  getDeposit,
  storeDeposit,
  closeStoreTurn,
  getClosedStoreTurn,
  searchPresentations,
  editDeposit,
  getStoreCash,
}
