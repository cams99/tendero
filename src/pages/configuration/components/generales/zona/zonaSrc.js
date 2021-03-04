import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getZone = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Zones}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newZone = async data =>
  api
    .post(url.stage.Zones, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editZone = async (stateId, data) =>
  api
    .put(`${url.stage.Zones}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeZone = async stateId =>
  api
    .remove(`${url.stage.Zones}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getZone,
  newZone,
  editZone,
  removeZone,
}
