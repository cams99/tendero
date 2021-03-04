import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getStoreFormat = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.storeFormat}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeStoreFormat = async flagId =>
  api
    .remove(`${url.stage.storeFormat}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editStoreFormat = async (flagId, data) =>
  api
    .put(`${url.stage.storeFormat}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newStoreFormat = async data =>
  api
    .post(url.stage.storeFormat, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getStoreFormat,
  removeStoreFormat,
  editStoreFormat,
  newStoreFormat,
}
