import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const getAllStores = async () =>
  api
    .get(`${url.stage.stores_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllPaymentMethods = async () =>
  api
    .get(`${url.stage.paymentMethod_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllProviders = async () =>
  api
    .get(`${url.stage.Providers_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getTransfers = async id => {
  return api
    .get(`${url.stage.transfers}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))
}

const storeTransfer = async data =>
  api
    .post(`${url.stage.transfers}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllProducts = async () =>
  api
    .get(`${url.stage.products_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllPresentations = async () =>
  api
    .get(`${url.stage.Presentations_options}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getCounts = async id =>
  api
    .get(`${url.stage.counts}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAllPurchases = async id =>
  api
    .get(`${url.stage.purchases}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getPurchase = async id =>
  api
    .get(`${url.stage.purchases}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getInventory = async (id, paginate = true) =>
  api
    .get(`${url.stage.inventory}?store_id=${id}&${paginate ? 'per_page=5' : 'paginate=0'}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getAdjustments = async id =>
  api
    .get(`${url.stage.adjustments}?store_id=${id}&per_page=5`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const savePurchase = async data =>
  api
    .post(url.stage.purchases, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editPurchase = async (id, data) =>
  api
    .put(`${url.stage.purchases}/${id}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearFoAuthError() : console.log(err)))

const saveAdjustment = async data =>
  api
    .post(url.stage.adjustments, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const saveCounts = async data =>
  api
    .post(url.stage.counts, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const read = async (filterName, id) =>
  api
    .get(`${url.stage.inventory}?store_id=${id}&per_page=5&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const searchPresentations = async value =>
  api
    .get(`${url.stage.Presentations_options}?presentation_description=${value}%&sku_code=${value}%&paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getAdjustments,
  getAllPaymentMethods,
  getAllProducts,
  getAllPresentations,
  getAllProviders,
  getAllStores,
  getCounts,
  getAllPurchases,
  getPurchase,
  getInventory,
  getNextPage,
  getTransfers,
  storeTransfer,
  savePurchase,
  editPurchase,
  saveAdjustment,
  saveCounts,
  read,
  searchPresentations,
}
