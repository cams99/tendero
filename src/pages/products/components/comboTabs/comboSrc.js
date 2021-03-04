import api from '../../../../api/api'
import url from '../../../../api/env'
import Utils from '../../../../utils/Utils'

const getCombos = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Combos}?per_page=${pageNumber}&description=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newCombos = async data =>
  api
    .post(url.stage.Combos, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editCombos = async (stateId, data) =>
  api
    .put(`${url.stage.Combos}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeCombos = async stateId =>
  api
    .remove(`${url.stage.Combos}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getCombos,
  newCombos,
  editCombos,
  removeCombos,
}
