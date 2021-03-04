import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getLocationType = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.locationType}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeLocationType = async flagId =>
  api
    .remove(`${url.stage.locationType}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editLocationType = async (flagId, data) =>
  api
    .put(`${url.stage.locationType}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newLocationType = async data =>
  api
    .post(url.stage.locationType, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getLocationType,
  removeLocationType,
  editLocationType,
  newLocationType,
}
