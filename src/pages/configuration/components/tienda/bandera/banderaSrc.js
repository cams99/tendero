import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getFlags = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.storeFlag}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeFlag = async flagId =>
  api
    .remove(`${url.stage.storeFlag}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editFlag = async (flagId, data) =>
  api
    .put(`${url.stage.storeFlag}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newFlag = async data =>
  api
    .post(url.stage.storeFlag, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getFlags,
  removeFlag,
  editFlag,
  newFlag,
}
