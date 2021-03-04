import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getRegion = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Region}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newRegion = async data =>
  api
    .post(url.stage.Region, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editRegion = async (stateId, data) =>
  api
    .put(`${url.stage.Region}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeRegion = async stateId =>
  api
    .remove(`${url.stage.Region}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getRegion,
  newRegion,
  editRegion,
  removeRegion,
}
