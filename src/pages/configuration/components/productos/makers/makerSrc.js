import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getMakers = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Makers}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newMakers = async data =>
  api
    .post(url.stage.Makers, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editMakers = async (stateId, data) =>
  api
    .put(`${url.stage.Makers}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeMakers = async stateId =>
  api
    .remove(`${url.stage.Makers}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getMakers,
  newMakers,
  editMakers,
  removeMakers,
}
