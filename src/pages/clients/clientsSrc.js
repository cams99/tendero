import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const getClient = async (params) => {
  const queryParams = { per_page: 5, ...params }
  const paramsTemplate = Object.keys(queryParams).flatMap(k => queryParams[k] ? `${[k]}=${queryParams[k]}` : []).join('&');

  return api
    .get(`${url.stage.Client}?${paramsTemplate}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))
}

const newClient = async data =>
  api
    .post(url.stage.Client, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editClient = async (stateId, data) =>
  api
    .put(`${url.stage.Client}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeClient = async stateId =>
  api
    .remove(`${url.stage.Client}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const getCountries = async id =>
  api
    .get(`${url.stage.countries_options}?id=${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const me = async () =>
  api
    .get(`${url.stage.currentUser}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const clientOptions = async (params) => {
  const paramsTemplate = Object.keys(params).flatMap(k => params[k] ? `${[k]}=${params[k]}` : []).join('&');

  return api
    .get(`${url.stage.Client_options}?${paramsTemplate}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))
}

export default {
  getClient,
  newClient,
  editClient,
  removeClient,
  getCountries,
  me,
  clientOptions,
}
