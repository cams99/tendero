import api from '../../api/api'
import url from '../../api/env'
import Utils from '../../utils/Utils'

const read = async (filterName, pageNumber) =>
  api
    .get(`${url.stage.companies}?per_page=${pageNumber}&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const readByCompanyId = async companyId =>
  api
    .get(`${url.stage.companies}/${companyId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const enterpriseNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const enterpriseDelete = async companyId =>
  api
    .remove(`${url.stage.companies}/${companyId}`, {})
    .then(res => res)
    .catch(err => err)

const saveCompany = async data =>
  api
    .post(url.stage.companies, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const updateCompany = async (data, companyId) =>
  api
    .put(`${url.stage.companies}/${companyId}`, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  read,
  readByCompanyId,
  enterpriseNextPage,
  enterpriseDelete,
  saveCompany,
  updateCompany,
}
