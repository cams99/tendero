import axios from 'axios'
import url from '../api/env'

const sessionApp = (data, behavior) => {
  const appName = 'TenderoApp'
  switch (behavior) {
    case 'setter':
      localStorage.setItem(appName, JSON.stringify(data))
      break
    case 'remove':
      localStorage.removeItem(appName)
      break
    case 'removeAll':
      localStorage.clear()
      break
    case 'token':
      let token = JSON.parse(localStorage.getItem(appName))
      if (token.token) return token.token.access_token
      else token = null
      break
    default:
      // getter
      return JSON.parse(localStorage.getItem(appName))
  }
}

const refreshToken = async () =>
  await axios({
    url: `${url.stage.refresh}`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + sessionApp(null, 'token'),
      'Content-Type': 'application/json',
    },
  })
    .then(data => {
      if (data.errors) return data.errors[0].message
      else return data.data
    })
    .catch(err => {
      if (err.response && err.response.data) return err.response.data.message
      console.log('Unknown error', err)
    })

export default {
  sessionApp,
  refreshToken,
}
