import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getProductCategory = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.ProductCategory}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newProductCategory = async data =>
  api
    .post(url.stage.ProductCategory, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editProductCategory = async (stateId, data) =>
  api
    .put(`${url.stage.ProductCategory}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeProductCategory = async stateId =>
  api
    .remove(`${url.stage.ProductCategory}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getProductCategory,
  newProductCategory,
  editProductCategory,
  removeProductCategory,
}
