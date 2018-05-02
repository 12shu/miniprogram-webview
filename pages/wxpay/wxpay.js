import req from '../../utils/util.js'
Page({
  data: {
    payData: {},
    userInfo: {},
    showBtn: 0
  },
  onLoad: function () {
    this.checkToken()
  },
  getUserInfo: function (e) {
    if (e.detail.iv) {
      this.setData({
        'userInfo.iv': e.detail.iv,
        'userInfo.encryptedData': e.detail.encryptedData,
        showBtn: 0
      })
      this.getToken()
    }
    else {
      wx.showModal({
        title: '警告',
        content: '若不授权微信登录，则无法使用相关功能，请重新进行授权操作。',
        cancelText: '不授权',
        confirmText: '授权',
        success: function (res) {
          if (res.cancel) {
            wx.navigateBack()
          }
        }
      })  
    }
  },
  getToken: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let data = {
            js_code: res.code,
            iv: this.data.userInfo.iv,
            encryptedData: this.data.userInfo.encryptedData,
            auth: 1
          }
          req.Post('comm/addUnionId', data).then((res) => {
            wx.hideLoading()
            if (res.data && res.data.status == 1) {
              wx.setStorageSync('token', res.data.token)
              req.header(res.data.token)
              that.reqPay()
            }
            else {
              wx.showModal({
                title: '提示',
                content: '登录失败，请稍后再试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  }
                }  
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '登录失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },
  checkToken: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const token = wx.getStorageSync('token') || ''
    if (token) {
      req.header(token)
      req.Post('pp/checkToken', { token: token }).then((res) => {
        wx.hideLoading()
        if (res.data.status) {
          this.reqPay()
        }
        else {
          this.setData({
            showBtn: 1
          })
        }
      })
    }
    else {
      wx.hideLoading()
      this.setData({
        showBtn: 1
      })
    }
  },
  reqPay: function () {
    req.Post('weChat/unifiedOrder', { 'type': 'mini', 'pay_type': 'public_plant' }).then((res) => {
      wx.requestPayment({
        'timeStamp': res.data.timestamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'appId': 'wx2bbbba04bbd2385d',
        'signType': 'MD5',
        'paySign': res.data.paySign,
        'success': function (res) {
          wx.showModal({
            title: '提示',
            content: '支付成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../index/index?key=#paySuccess'
                })
              }
            }
          })
        },
        'fail': function (res) {
          wx.showModal({
            title: '提示',
            content: '支付失败，请稍后再试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      })
    })
  }
})