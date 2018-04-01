import * as jwt from 'jsonwebtoken'
const jwtPublicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAo8v4veTClLfIML6J0I84
gKm6BFf954Dji5sMDSkbIlY82OaF9j4f97ZwArGIrQV/1At+JBfy/lgOXHIIgF9d
IuNqRaNQp2Qv8xv5P6nVh/GsCAuCQeGki2Nff/AqGJPvGH6Z0Gh0POrxy5QdGwOL
ECTaygK7xTe9DgSgPMi01ICNwalcTQvN3E3qqu8uOAclsfzjw/yP2tkv/oaAsBVW
1wiBggMvxX1zbuzg3bLM4ZU6WdamYq7AAMhuOEYTCqZUVadoX0LYHQfom9Hw/oEj
PiHwEqEvQfCIedlgJZYbZduHqNesA3UdQfcH0vaqq5XJV5C13J/1nhJWmXeccMhY
AbbhO8ot8cy12gdCGGmGKIk3MJ2uYIg3sGVOiVvw6VNyvBx5AUOnZvMPAlj24pty
zm5+M2ipgNMWqQHJkvyc0Red92o8HZLyzUyS/FZLTG1/Rg4nMGbYe316m+ZirxkK
lIcRa6iKFnGeZFVSZ6VEzokIa1I5nWJsJXmu4ZAZ44/wWE8LwrDYBrdm+B9Tw12D
k/nmPcmdKI5DPBRXZGi4j6tUFi8zDMmR6Bj2yYO0wfQe60kTi8caVCABnDfH9RxC
b2gel2wJBhkakwWiSs+adGxtdG3Uc/KC8b/ecaSYsy1vGhsyya6sZUoWCfEjuPZ0
nNpHAjJRQi8cqu0NW4WEZDECAwEAAQ==
-----END PUBLIC KEY-----
`

export default {
  user: {
    authenticated: false,
    data: null
  },

  login (context, creds, redirect) {
    if (localStorage.getItem('id_token')) {
      if (this.verify(localStorage.getItem('id_token'), jwtPublicKey)) {
        if (redirect) {
          context.$router.push(redirect)
        }
        return true
      } else {
        localStorage.removeItem('id_token')
        this.user.authenticated = false
        this.login()
      }
    } else {
      context.$http.post(context.apiEndpoint + '/users/login', creds).then((data, err) => {
        if (!err) {
          if (this.verify(data.body.token, jwtPublicKey)) {
            localStorage.setItem('id_token', data.body.token)
            this.user.authenticated = true
            if (redirect) {
              context.$router.push(redirect)
            }
            return true
          }
        }
      })
    }
  },

  signup (context, creds, redirect) {
    context.$http.post(context.apiEndpoint + '/users', creds, (data) => {
      localStorage.setItem('id_token', data.id_token)
      this.user.authenticated = true
      if (redirect) {
        this.router.push(redirect)
      }
    })
  },

  verify (token, key) {
    let decoded = jwt.verify(token, key)
    if (!decoded) {
      return false
    } else {
      this.user.data = decoded
      return true
    }
  },

  logout () {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  checkAuth () {
    let ljwt = localStorage.getItem('id_token')
    if (ljwt) {
      if (this.verify(ljwt, jwtPublicKey)) {
        this.user.authenticated = true
      } else {
        this.logout()
      }
    } else {
      this.user.authenticated = false
    }
    return this.user.authenticated
  },

  getApiLink (context) {
    return context.apiEndpoint
  },

  getAuthHeader () {
    if (this.checkAuth()) {
      return {
        'x-auth-token': localStorage.getItem('id_token')
      }
    }
  },

  getUser () {
    return this.user.data.user
  }
}
