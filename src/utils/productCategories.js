import api from '../api/api'
import url from '../api/env'

const getProductsCategories = async () =>
  api
    .get(`${url.stage.ProductCategory_options}?per_page=100`, {})
    .then(res => res)
    .catch(err => err)

const getProductsSubCategories = async () =>
  api
    .get(`${url.stage.ProductSubCategory_options}?per_page=100`, {})
    .then(res => res)
    .catch(err => err)

export default {
  getProductsCategories,
  getProductsSubCategories,
}
