<template>
  <div class="container" >
    <!--wxml-->
<!-- If only the user's profile photo/nickname is required, "<open-data />" can be used -->
    <!-- <view> -->
      <open-data class="userinfo-avatar" type="userAvatarUrl"></open-data>
      <open-data class="userinfo-nick" type="userNickName"></open-data>
    <!-- </view> -->


    <button style="opacity:0" v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>

    <!-- mpvue可以用v-model，但是iview不可以用v-model -->
    <!-- <form class="form-container">
      <input type="text" class="form-control" v-model="username" placeholder="用户名" />
      <input type="password" class="form-control" v-model.lazy="password" placeholder="密码" />
    </form> -->

    <!-- 微信openID关联平台账号 -->
    <form v-show="showf1">
      <i-panel title="账号绑定">
        <!-- {{username}} -->
      <i-input @change="bindChangeUsername" :value="username" title="用户名" maxlength='20' placeholder="请输入用户名..." />
      <i-input type="password" @change="bindChangePassword" :value="password" title="密码" maxlength='20' placeholder="请输入密码..." />
      </i-panel>
      <i-button @click="handleSubmit" type="warning" shape="circle" size="small">登录</i-button>
      <view data-show="2" class="toggle" @click="handleToggleClick">没有账号？</view>
    </form>

    <form v-show="showf2">
      <i-panel title="注册新用户">
      <i-input @change="bindChangeUsername" :value="username" title="用户名" maxlength='20' placeholder="请输入用户名..." />
      <i-input type="password" @change="bindChangePassword" :value="password" title="密码" maxlength='20' placeholder="请输入密码..." />
      </i-panel>
      <i-button @click="handleSubmit" type="success" shape="circle" size="small">注册</i-button>
      <view data-show="1" class="toggle" @click="handleToggleClick">已有账号</view>
    </form>

  </div>
  
</template>

<script>
// === form data
import https from '../../utils/https'
import { isEmptyObject } from '../../utils/index'

export default {
  data() {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      userInfo: {},
      username: '陈昕',
      password: '123456',
      signature: '',
      showf1: false, // 第一个表单是否显示
      showf2: false // 第二个表单是否显示
    }
  },

  methods: {
    bindGetUserInfo(e) {
      console.log(e.detail)
    },
    bindChangeUsername(e) {
      this.username = e.target.detail.value
    },
    bindChangePassword(e) {
      this.password = e.target.detail.value
    },
    handleToggleClick(e) {
      // 两个表单的切换
      const { show } = e.target.dataset
      if (show === '1') {
        this.showf1 = true
        this.showf2 = false
      }
      if (show === '2') {
        this.showf1 = false
        this.showf2 = true
      }
    },
    handleSubmit(e) {
      const { username } = this // signature
      // console.log(username, password, signature)
      // 查询用户名是否存在
      https.postReq({
        url: 'users/findOne',
        data: {
          username
        },
        cb: res => {
          if (isEmptyObject(res.result)) {
            // 未注册 - to 注册
            this.registerUser()
          } else {
            // 已注册 - 带值update
            this.updateUser()
          }
          console.log(res)
        }
      })
      // 登录&绑定微信ID
      // https.postReq({
      //   url: 'u/login',
      //   data: {
      //     query: {
      //       username,
      //       password
      //     }
      //   },
      //   cb: res => {}
      // })
    },

    // 注册registerUser
    registerUser() {
      const { username, password, signature } = this // signature
      https.postReq({
        url: 'users/add',
        data: {
          username,
          password,
          signature
        },
        cb: res => {
          console.log('======registerUser======')
          console.log(res)
        }
      })
    },

    // 更新用户信息，传入signature
    updateUser() {},

    // 根据signature判断用户是否存在
    loginBySignature() {
      https.postReq({
        url: 'u/login',
        data: {
          query: {
            signature: this.signature
          }
        },
        cb: res => {
          if (isEmptyObject(res.result)) {
            // 登录失败不存在signature的用户
            this.showf1 = true
          } else {
            // 登陆成功
            console.log('======loginBySignature=======')
            console.log(res)
          }
        }
      })
    }
  },

  onLoad: function() {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // const logs = wx.getStorageSync('logs')
              that.signature = res.signature
              that.loginBySignature()
            }
          })
        }
      }
    })
  },
  created() {}
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 158rpx;
  height: 158rpx;
  margin: 20rpx;
  border-radius: 50%;
}
.userinfo-nick {
  font-size: 32rpx;
  color: grey;
  text-align: center;
}
.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.toggle {
  text-align: right;
  padding: 10px 0;
  font-size: 12px;
  color: grey;
}
</style>
