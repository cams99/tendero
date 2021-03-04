import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getStoreType = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.storeType}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeStoreType = async flagId =>
  api
    .remove(`${url.stage.storeType}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editStoreType = async (flagId, data) =>
  api
    .put(`${url.stage.storeType}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newStoreType = async data =>
  api
    .post(url.stage.storeType, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getStoreType,
  removeStoreType,
  editStoreType,
  newStoreType,
}
