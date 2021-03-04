import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getBrands = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.Brands}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newBrands = async data =>
  api
    .post(url.stage.Brands, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editBrands = async (stateId, data) =>
  api
    .put(`${url.stage.Brands}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeBrands = async stateId =>
  api
    .remove(`${url.stage.Brands}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getBrands,
  newBrands,
  editBrands,
  removeBrands,
}
