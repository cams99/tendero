import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getProviders = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Providers}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newProviders = async data =>
  api
    .post(url.stage.Providers, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editProviders = async (stateId, data) =>
  api
    .put(`${url.stage.Providers}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeProviders = async stateId =>
  api
    .remove(`${url.stage.Providers}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getProviders,
  newProviders,
  editProviders,
  removeProviders,
}
