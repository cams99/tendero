import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getProductDepartament = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.ProductDepartament}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newProductDepartament = async data =>
  api
    .post(url.stage.ProductDepartament, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editProductDepartament = async (stateId, data) =>
  api
    .put(`${url.stage.ProductDepartament}/${stateId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeProductDepartament = async stateId =>
  api
    .remove(`${url.stage.ProductDepartament}/${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getProductDepartament,
  newProductDepartament,
  editProductDepartament,
  removeProductDepartament,
}
