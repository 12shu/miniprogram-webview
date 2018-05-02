const app = getApp()
import req from '../../utils/util.js'

Page({
  data: {
    url: '',
    title: '',
    imageUrl: ''
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: '/pages/index/index',
      imageUrl: this.data.imageUrl,
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (options.key) { //支付成功
      this.getUrl(2)
    }
    else {
      this.getUrl(1)
    }
  },
  getUrl: function (ind) {
    req.Get('pp/getMiniUri', {type: ind}).then((res) => {
      this.setData({
          url: res.data.data.split('&')[0].split('?')[0],
        title: res.data.data.split('&')[1],
        imageUrl: decodeURIComponent(res.data.data.split('&')[0].split('?')[1])
      })
      wx.hideLoading()
    })
  }
})
 