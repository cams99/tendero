import api from '../api/api'
import url from '../api/env'

const getCountries = async () =>
  api
    .get(`${url.stage.countries_options}?per_page=100`, {})
    .then(res => res)
    .catch(err => err)

export default {
  getCountries,
}
