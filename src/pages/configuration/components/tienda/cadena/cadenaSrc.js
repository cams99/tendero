import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getChains = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.storeChain}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeChain = async flagId =>
  api
    .remove(`${url.stage.storeChain}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editChain = async (flagId, data) =>
  api
    .put(`${url.stage.storeChain}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newChain = async data =>
  api
    .post(url.stage.storeChain, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getChains,
  removeChain,
  editChain,
  newChain,
}
