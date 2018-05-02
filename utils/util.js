const METHOD = {
  GET: 'GET',
  POST: 'POST'
}
class Request {
  _baseUrl = 'https://dev.nooyii.com/quanminzhongshuiguo/'
  _header = {
    'content-type': 'application/x-www-form-urlencoded',
    token: null
  }

  interceptors = []

  constructor() {
  }

  intercept(res) {
    return this.interceptors
      .filter(f => typeof f === 'function')
      .every(f => f(res))
  }

  request({ url, method, header = {}, data }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: (this._baseUrl || '') + url,
        method: method || METHOD.GET,
        data: data,
        header: {
          ...this._header,
          ...header
        },
        success: res => this.intercept(res) && resolve(res),
        fail: reject
      })
    })
  }

  Get(url, data) {
    return this.request({ url, method: METHOD.GET, data })
  }
  Post(url, data) {
    return this.request({ url, method: METHOD.POST, data })
  }
  baseUrl(baseUrl) {
    this._baseUrl = baseUrl
    return this
  }
  header(token) {
    this._header = {
      'content-type': 'application/x-www-form-urlencoded',
      'token': token
    }
    return this
  }
  interceptor(f) {
    if (typeof f === 'function') {
      this.interceptors.push(f)
    }
    return this
  }
}
export default new Request
export { METHOD }
