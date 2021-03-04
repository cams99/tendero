import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getCountry = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.countries}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newCountry = async data =>
  api
    .post(url.stage.countries, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editCountry = async (stateId, data) =>
  api
    .put(`${url.stage.countries}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeCountry = async stateId =>
  api
    .remove(`${url.stage.countries}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getCountry,
  newCountry,
  editCountry,
  removeCountry,
}
