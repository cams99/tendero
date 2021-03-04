import api from '../../api/api'
import url from '../../api/env'

const read = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.stores}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => err)

const storeDelete = async storeId =>
  api
    .remove(`${url.stage.stores}/${storeId}`, {})
    .then(res => res)
    .catch(err => err)

const storeNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => err)

const saveStore = async data =>
  api
    .post(url.stage.stores, data)
    .then(res => res)
    .catch(err => err)

const updateStore = async (storeId, data) =>
  api
    .put(`${url.stage.stores}/${storeId}`, data)
    .then(res => res)
    .catch(err => err)

// TURNS SECTION
const readTurns = async storeId =>
  api
    .get(`${url.stage.Turns}?store_id=${storeId}`, {})
    .then(res => res)
    .catch(err => err)

const saveTurns = async data =>
  api
    .post(url.stage.Turns, data)
    .then(res => res)
    .catch(err => err)

const removeTurns = async turnId =>
  api
    .remove(`${url.stage.Turns}/${turnId}`, {})
    .then(res => res)
    .catch(err => err)

const updateTurns = async (turnId, data) =>
  api
    .put(`${url.stage.Turns}/${turnId}`, data)
    .then(res => res)
    .catch(err => err)

export default {
  read,
  storeDelete,
  storeNextPage,
  saveStore,
  updateStore,
  readTurns,
  saveTurns,
  removeTurns,
  updateTurns,
}
