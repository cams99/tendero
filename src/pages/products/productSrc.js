import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const read = async filterName =>
  api
    .get(`${url.stage.products}?paginate=0`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const presentationTurn = async id =>
  api
    .get(`${url.stage.Presentations}/${id}/turns`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const savePresentationTurn = async (id, data) =>
  api
    .post(`${url.stage.Presentations}/${id}/turns`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const saveProduct = async data =>
  api
    .post(url.stage.products, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const updateProduct = async (data, id) =>
  api
    .put(`${url.stage.products}/${id}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const removeProduct = async id =>
  api
    .remove(`${url.stage.products}/${id}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  read,
  saveProduct,
  removeProduct,
  updateProduct,
  presentationTurn,
  savePresentationTurn,
}
