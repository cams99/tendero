import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getMunicipio = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Municipality}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newMunicipio = async data =>
  api
    .post(url.stage.Municipality, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editMunicipio = async (stateId, data) =>
  api
    .put(`${url.stage.Municipality}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeMunicipio = async stateId =>
  api
    .remove(`${url.stage.Municipality}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getMunicipio,
  newMunicipio,
  editMunicipio,
  removeMunicipio,
}
