import axios from 'axios'
import src from '../context/cacheApp'
import Utils from '../utils/Utils'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

const makeRequestApi = async (url, method, data) => {
  let storage = src.sessionApp()
  const tokenPayload = Utils.parseJwt(storage?.token?.access_token)

  if (!Utils.checkJwtExpiration(tokenPayload)) {
    await src.refreshToken().then(response => {
      if (response) {
        storage.token = response
        src.sessionApp(storage, 'setter')
      } else {
        storage = null
        src.sessionApp(null, 'remove')
      }
    })
  }

  return await axios({
    url: url,
    method: method,
    headers: {
      Authorization: 'Bearer ' + storage?.token?.access_token,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  })
    .then(data => {
      if (data.errors) return data.errors[0].message
      else return data.data
    })
    .catch(err => {
      if(err?.response?.statusText === "Unauthorized"
        || err?.response?.data?.message === "Unauthenticated."
      ){
        Utils.clearForAuthError()
      }
      console.log('Unknown error', err)
      return err.response.data
    })
}

const get = (url, data) => makeRequestApi(url, GET, data)
const post = (url, data) => makeRequestApi(url, POST, data)
const put = (url, data) => makeRequestApi(url, PUT, data)
const remove = (url, data) => makeRequestApi(url, DELETE, data)

export default {
  makeRequestApi,
  get,
  post,
  put,
  remove,
}
