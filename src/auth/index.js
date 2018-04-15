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

  async login (context, creds, redirect) {
    if (localStorage.getItem('id_token')) {
      if (await this.verify(localStorage.getItem('id_token'), jwtPublicKey)) {
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
      try {
        const userData = await context.$http.post(context.apiEndpoint + '/users/login', creds)
        localStorage.setItem('id_token', userData.body.token)
        this.user.authenticated = true
        context.$notify({
          group: 'responses',
          type: 'success',
          'animation-type': 'velocity',
          title: 'Authentication',
          text: 'You logged in!',
          reverse: true
        })
        if (redirect) {
          context.$router.push(redirect)
        }
        return true
      } catch (e) {
        console.log(e)
        switch (e.status) {
          case 400:
            context.$notify({
              group: 'responses',
              type: 'error',
              'animation-type': 'velocity',
              title: 'Authentication',
              text: 'Server received corrupted data. Try again.',
              reverse: true
            })
            break
          case 403:
            context.$notify({
              group: 'responses',
              type: 'error',
              'animation-type': 'velocity',
              title: 'Authentication',
              text: 'Incorrect user email or password.',
              reverse: true
            })
            break
          default:
            context.$notify({
              group: 'responses',
              type: 'error',
              'animation-type': 'velocity',
              title: 'Authentication',
              text: 'Undefined error',
              reverse: true
            })
            break
        }
        return false
      }
    }
  },

  async signup (context, creds, redirect) {
    try {
      const userData = await context.$http.post(context.apiEndpoint + '/users', creds)
      localStorage.setItem('id_token', userData.id_token)
      this.user.authenticated = true
      if (redirect) {
        this.router.push(redirect)
      }
    } catch (e) {
      return false
    }
  },

  async verify (token, key) {
    try {
      const decoded = await jwt.verify(token, key)
      return decoded
    } catch (e) {
      return false
    }
  },

  logout () {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
  },

  async checkAuth () {
    const ljwt = localStorage.getItem('id_token')
    if (ljwt) {
      this.user.data = await this.verify(ljwt, jwtPublicKey)
      if (this.user.data) {
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

  async getAuthHeader () {
    if (await this.checkAuth()) {
      return {
        'x-auth-token': localStorage.getItem('id_token')
      }
    }
  },

  async getUser () {
    const ljwt = localStorage.getItem('id_token')
    if (ljwt) {
      this.user.data = await this.verify(ljwt, jwtPublicKey)
      return this.user.data.user
    }
    return false
  },

  async updateToken (context) {
    try {
      if (await this.checkAuth()) {
        const response = await context.$http.get(context.apiEndpoint + '/users/updtoken', { headers: this.getAuthHeader() })
        if (await this.verify(response.body.token, jwtPublicKey)) {
          localStorage.setItem('id_token', jwtPublicKey)
          this.user.authenticated = true
          return true
        }
      }
    } catch (e) {
      return false
    }
  }
}
