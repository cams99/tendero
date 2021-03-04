import api from '../../../../../api/api'
import url from '../../../../../api/env'
import Utils from '../../../../../utils/Utils'

const getPaymentMethod = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.paymentMethod}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removePaymentMethod = async flagId =>
  api
    .remove(`${url.stage.paymentMethod}/${flagId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const editPaymentMethod = async (flagId, data) =>
  api
    .put(`${url.stage.paymentMethod}/${flagId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const newPaymentMethod = async data =>
  api
    .post(url.stage.paymentMethod, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  getPaymentMethod,
  removePaymentMethod,
  editPaymentMethod,
  newPaymentMethod,
}
