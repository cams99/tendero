import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getUoms = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Uoms}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newUoms = async data =>
  api
    .post(url.stage.Uoms, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editUoms = async (stateId, data) =>
  api
    .put(`${url.stage.Uoms}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeUoms = async stateId =>
  api
    .remove(`${url.stage.Uoms}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getUoms,
  newUoms,
  editUoms,
  removeUoms,
}
