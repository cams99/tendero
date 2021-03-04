import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getSocioEconomic = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.socioeconomicLevel}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newSocioEconomic = async data =>
  api
    .post(url.stage.socioeconomicLevel, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editSocioEconomic = async (stateId, data) =>
  api
    .put(`${url.stage.socioeconomicLevel}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeSocioEconomic = async stateId =>
  api
    .remove(`${url.stage.socioeconomicLevel}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getSocioEconomic,
  newSocioEconomic,
  editSocioEconomic,
  removeSocioEconomic,
}
