import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getProductSubCategory = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.ProductSubCategory}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newProductSubCategory = async data =>
  api
    .post(url.stage.ProductSubCategory, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editProductSubCategory = async (stateId, data) =>
  api
    .put(`${url.stage.ProductSubCategory}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeProductSubCategory = async stateId =>
  api
    .remove(`${url.stage.ProductSubCategory}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getProductSubCategory,
  newProductSubCategory,
  editProductSubCategory,
  removeProductSubCategory,
}
