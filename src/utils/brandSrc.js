import api from '../api/api'
import url from '../api/env'

const getBrands = async () =>
  api
    .get(`${url.stage.Brands_options}?per_page=100`, {})
    .then(res => res)
    .catch(err => err)

export default {
  getBrands,
}
