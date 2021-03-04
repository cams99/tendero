import api from '../../../../api/api'
import url from '../../../../api/env'
import Utils from '../../../../utils/Utils'

const getSkus = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Skus}?per_page=${pageNumber}&description=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newSkus = async data =>
  api
    .post(url.stage.Skus, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editSkus = async (stateId, data) =>
  api
    .put(`${url.stage.Skus}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeSkus = async stateId =>
  api
    .remove(`${url.stage.Skus}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getSkus,
  newSkus,
  editSkus,
  removeSkus,
}
