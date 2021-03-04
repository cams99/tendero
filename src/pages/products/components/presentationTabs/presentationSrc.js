import api from '../../../../api/api'
import url from '../../../../api/env'
import Utils from '../../../../utils/Utils'

const getPresentations = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Presentations}?per_page=${pageNumber}&description=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newPresentations = async data =>
  api
    .post(url.stage.Presentations, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editPresentations = async (stateId, data) =>
  api
    .put(`${url.stage.Presentations}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removePresentations = async stateId =>
  api
    .remove(`${url.stage.Presentations}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getPresentations,
  newPresentations,
  editPresentations,
  removePresentations,
}
