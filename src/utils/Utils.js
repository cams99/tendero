import { message } from 'antd'
import api from '../api/api'
import url from '../api/env'

const fileToBase64 = file => {
  if (file) {
    const contentType = `data:${file.type};base64,`

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = readerEvt => {
        try {
          resolve(contentType + btoa(readerEvt.target.result))
        } catch (err) {
          reject(err)
        }
      }

      reader.readAsBinaryString(file)
    })
  }
}

const validateEmail = email => {
  const excludedChars = [
    '!',
    '$',
    '#',
    '%',
    '^',
    '&',
    '*',
    '+',
    '=',
    '{',
    '}',
    '‘',
    '|',
    '/',
    '?',
    '§',
    '`',
    '~',
    '¡',
    '™',
    '£',
    '¢',
    '∞',
    '¶',
    '•',
    'ª',
    'º',
    '–',
    '≠',
    '“',
    '’',
    'æ',
    '«',
    '≤',
    '≥',
    '÷',
    '±',
    "'",
    '"',
  ]

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(String(email).toLowerCase()) && !excludedChars.some(char => email.indexOf(char) > -1)
}

const validateNit = nit => String(nit).length > 0 || nit.toUpperCase() === 'CF'

const parseJwt = token => {
  if (!token || typeof token !== 'string') return

  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}
// retorna true si el JWT esta vigente y false si expiro
const checkJwtExpiration = (payload, preventTime = 30) => {
  if (!payload || !payload.exp) return

  const now = parseInt(Date.now() / 1000) // transforma de milisegundos a segundos

  return now < payload.exp - preventTime
}

const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const camelCaseize = str => {
  if (typeof str !== 'string') return ''
  const charsArrOne = ["'", '|', '°', '¬', '!', '@', '·', '#', '$', '~', '%', '½', '&', '/', '(', ')']
  const charsArrTwo = ['=', '?', '\\', '¿', '¡', '¸', '+', '*', '´', '¨', '{', '}', '[', ']', '^', '`']
  const charsArrThree = ['-', '_', '.', ':', ',', ';', '─', '<', '>']
  const charsToRemove = charsArrOne.concat(charsArrTwo, charsArrThree)
  let result = removeAccents(str)
  // get rid charsToRemove
  result = result.split('').map(char => {
    if (charsToRemove.indexOf(char) > -1) return ' '
    return char
  })
  // set correct casing
  result = result
    .join('')
    .trim()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })

  return result.join('').trim()
}

const getAge = date => {
  let birthday = new Date(date)
  let today = new Date()
  return parseInt((today - birthday) / (1000 * 60 * 60 * 24 * 365))
}

const clearForAuthError = () => {
  window.localStorage.clear()
  window.location.reload()
}

// get info for Commons services
const getCurrenciesOption = async filterName =>
  api
    .get(`${url.stage.currencies_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getCountryOption = async filterName =>
  api
    .get(`${url.stage.countries_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getEnterpriseOption = async filterName =>
  api
    .get(`${url.stage.companies_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStoreTypeOption = async filterName =>
  api
    .get(`${url.stage.storeType_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStoreChainOption = async filterName =>
  api
    .get(`${url.stage.storeChain_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStoreFlag = async filterName =>
  api
    .get(`${url.stage.storeFlag_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getLocation = async filterName =>
  api
    .get(`${url.stage.Location_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStoreFormat = async filterName =>
  api
    .get(`${url.stage.storeFormat_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getSocioeconomicLevel = async filterName =>
  api
    .get(`${url.stage.socioeconomicLevel_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getState = async filterName =>
  api
    .get(`${url.stage.states_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getZone = async filterName =>
  api
    .get(`${url.stage.Zones_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getMunicipalities = async filterName =>
  api
    .get(`${url.stage.Municipality_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getRegionsByCountryId = async (filterName, countryId) =>
  api
    .get(`${url.stage.Region}?per_page=100&name=${filterName}%&country_id=${countryId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStateByRegionId = async (filterName, regionId) =>
  api
    .get(`${url.stage.states}?per_page=100&name=${filterName}%&region_id=${regionId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getMunicipalitiesByStateId = async (filterName, stateId) =>
  api
    .get(`${url.stage.Municipality}?per_page=100&name=${filterName}%&state_id=${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getMakersOptions = async filterName =>
  api
    .get(`${url.stage.Makers}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getProductDepartamentOptions = async filterName =>
  api
    .get(`${url.stage.ProductDepartament}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getProductCategoryOptions = async (filterName, stateId) =>
  api
    .get(`${url.stage.ProductCategory}?per_page=100&name=${filterName}%&product_department_id=${stateId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getStoreOption = async filterName =>
  api
    .get(`${url.stage.stores_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getNextPage = async urlNextPage =>
  api
    .get(`${urlNextPage}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getCompanies = async filterName =>
  api
    .get(`${url.stage.companies}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getProductsOption = async filterName =>
  api
    .get(`${url.stage.products}?per_page=100&description=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getPresentationsOption = async filterName =>
  api
    .get(`${url.stage.Presentations}?per_page=100&description=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getUoms = async () =>
  api
    .get(`${url.stage.Uoms_options}?per_page=100`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getUomsOption = async filterName =>
  api
    .get(`${url.stage.Uoms_options}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const isEmpty = obj => {
  for (let key in obj) {
    if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
      return key
    }
  }
  return false
}

const isEmptyCombos = obj => {
  for (let key in obj) {
    if (obj[key] === '' || obj[key] === null || obj[key] === undefined || obj[key].length === 0) {
      return key
    }
  }
  return false
}

const isObjEmpty = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return JSON.stringify(obj) === JSON.stringify({})
}

const getTurns = async filterName =>
  api
    .get(`${url.stage.Turns}?per_page=100&name=${filterName}%`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const getTurnsById = async (filterName, shopId) =>
  api
    .get(`${url.stage.Turns}?per_page=100&name=${filterName}%&store_id=${shopId}`, {})
    .then(res => res)
    .catch(err => (err === 'Unauthenticated.' ? clearForAuthError() : console.log(err)))

const formatDate = date => {
  let _date
  if (date) {
    _date = date.slice(0, 10).split('-').reverse().join('/')
  }
  return _date
}

const formatNumber = number => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const validateNumber = number => !Number(number) || number.includes('.') || number.includes('-') || number.includes('+')
const validateNull = data => !data || data === '' || data.length === 0

const checkErrors = res => {
  Object.keys(res.errors).map(key => {
    switch (key) {
      case 'name':
        message.error(res.errors[key][0].replace('name', 'Nombre'))
        break
      case 'nit':
        message.error(res.errors[key][0].replace('nit', 'NIT'))
        break
      case 'abbreviation':
        message.error(res.errors[key][0].replace('abbreviation', 'Abreviación'))
        break
      default:
        message.error(res.errors[key])
        break
    }
    return null
  })
}
const deepEqualCompare = (a, b) => {
  let keyA, keyB
  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    var count = [0, 0]
    for (keyA in a) count[0]++
    for (keyB in b) count[1]++
    if (count[0] - count[1] !== 0) {
      return false
    }
    for (keyA in a) {
      if (!(keyA in b) || !deepEqualCompare(a[keyA], b[keyA])) {
        return false
      }
    }
    for (keyB in b) {
      if (!(keyB in a) || !deepEqualCompare(b[keyB], a[keyB])) {
        return false
      }
    }
    return true
  } else {
    return a === b
  }
}

export default {
  validateEmail,
  camelCaseize,
  checkJwtExpiration,
  clearForAuthError,
  getCurrenciesOption,
  getCountryOption,
  getEnterpriseOption,
  getStoreTypeOption,
  getStoreChainOption,
  getStoreFlag,
  getLocation,
  getStoreFormat,
  getSocioeconomicLevel,
  getState,
  getZone,
  getMunicipalities,
  getNextPage,
  getRegionsByCountryId,
  getAge,
  getStateByRegionId,
  getMunicipalitiesByStateId,
  getMakersOptions,
  getProductDepartamentOptions,
  getProductCategoryOptions,
  getStoreOption,
  getUoms,
  isEmpty,
  getCompanies,
  getTurns,
  getProductsOption,
  getPresentationsOption,
  getUomsOption,
  getTurnsById,
  isEmptyCombos,
  isObjEmpty,
  parseJwt,
  removeAccents,
  formatDate,
  fileToBase64,
  formatNumber,
  jsUcfirst,
  validateNit,
  validateNumber,
  validateNull,
  checkErrors,
  deepEqualCompare,
}
