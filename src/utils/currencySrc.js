import api from "../api/api";
import url from "../api/env"

const getCurrencies = async () =>
  api.get(url.stage.currencies,{})
    .then( res => res )
    .catch(err => err )

export default {
  getCurrencies
}