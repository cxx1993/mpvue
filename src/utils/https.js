/**
 *
 *
 */

var rootDocment = 'http://localhost:9090/'
var header = {
  Accept: 'application/json',
  'content-type': 'application/json',
  Authorization: null
}

let loadingState = false

function shortReq(method) {
  return function({ url, cb, fb }) {
    if (!loadingState) {
      wx.showLoading({
        title: '加载中'
      })
    }

    loadingState = true
    wx.request({
      url: rootDocment + url,
      method,
      header: header,
      success: function(res) {
        return typeof cb === 'function' && cb(res.data)
      },
      fail: function(err) {
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof fb === 'function' && fb(err)
      },
      complete: function() {
        wx.hideLoading()
        loadingState = false
      }
    })
  }
}

function longReq(method) {
  return function({ url, data, cb, fb }) {
    let hd = header
    wx.getStorage({
      key: 'token',
      success: function(res) {
        // console.log('get token:', res.data)
        if (res.data) {
          hd['x-access-token'] = res.data // 把token放入header
        }
      }
    })

    if (!loadingState) {
      wx.showLoading({
        title: '加载中'
      })
    }

    loadingState = true

    wx.request({
      url: rootDocment + url,
      header: hd,
      data: data,
      method,
      success: function(res) {
        if (res.data.token) {
          // 如果有token，存储token
          wx.setStorage({
            key: 'token',
            data: res.data.token
          })
        }

        return typeof cb === 'function' && cb(res.data)
      },
      fail: function(err) {
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof fb === 'function' && fb(err)
      },
      complete: function() {
        wx.hideLoading()
        loadingState = false
      }
    })
  }
}

const getReq = shortReq('get')
const putReq = longReq('put')
const delReq = longReq('delete')
const postReq = longReq('post')

module.exports = {
  getReq,
  delReq,
  postReq,
  putReq,
  header: header
}
