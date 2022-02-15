import axios from 'axios'
import Cookies from 'js-cookie'

const ENDPOINT_PATH = process.env.VUE_APP_API_URL

export default {
  login (email, password) {
    const user = {
      auth: {
        email: email,
        password: password
      }
    }
    return axios.post(ENDPOINT_PATH + '/auth/login', user).then(response => {
      localStorage.removeItem('user_tk')
      localStorage.setItem('user_tk', response.data.jwt)
    })
  },

  authHeader () {
    const user = localStorage.getItem('user_tk')
    if (user) {
      return { Authorization: 'Bearer ' + user }
    } else {
      return {}
    }
  },

  postHeader () {
    const user = localStorage.getItem('user_tk')
    if (user) {
      return { Authorization: 'Bearer ' + user, 'Content-Type': 'application/json' }
    } else {
      return {}
    }
  },

  fileHeader () {
    const user = localStorage.getItem('user_tk')
    if (user) {
      return { Authorization: 'Bearer ' + user, 'Content-Type': 'multipart/form-data' }
    } else {
      return {}
    }
  },

  setCookie (nombre, valor) {
    Cookies.set(nombre, valor, { sameSite: 'lax', secure: false })
  },
  getCookie (nombre) {
    return Cookies.get(nombre)
  },
  deleteCookie (nombre) {
    Cookies.remove(nombre)
  }
}
