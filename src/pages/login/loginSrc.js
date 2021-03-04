import axios from 'axios'
import url from '../../api/env'
import api from '../../api/api'
import src from '../../context/cacheApp'
import Utils from '../../utils/Utils'

const authLogin = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(`${url.stage.login}`, {
      username: usernameOrEmail,
      password: password,
    })

    return response
  } catch (error) {
    console.error(error)
  }
}

const closeSession = async () => {
  try {
    const response = await axios.post(
      `${url.stage.logout}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + src.sessionApp(null, 'token'),
          'Content-Type': 'application/json',
        },
      }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}

const resetPassword = async data =>
  api
    .put(url.stage.reset, data)
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

const currentUser = async () =>
  api
    .get(url.stage.currentUser, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? Utils.clearForAuthError() : console.log(err)))

export default {
  authLogin,
  closeSession,
  currentUser,
  resetPassword,
}
