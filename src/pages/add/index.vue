<template>
  <div>
    <form>
      <i-input @change="bindChange($event,'balance')" :value="balance" title="金额" type="textarea" placeholder="输入操作金额..." />
      <div class="iconFormControl">
        <span>图标</span>
        <view class="iconBtn">
          <i-button size="small" inline @click="toggleRight1" type="success" styles="transform: scale(0.8,0.8);">
            <i-icon :type="classifyMess._id?'brush':'add'" />
          </i-button>
          <view class="chooseIcon">
            <i-icon :type="classifyMess.stName" size="18" />
            {{classifyMess.name}}
          </view>
        </view>
      </div>
      <i-input @change="bindChange($event,'content')" :value="content" title="描述" type="textarea" placeholder="输入描述..." />
      <i-button @click="handleSubmit" type="primary" styles="background:#f9d348 !important">提交</i-button>
    </form>

    <!-- 抽屉窗 -->
    <i-drawer mode="right" :visible="showRight1" @close="toggleRight1">
        <view class="drawer-container">
            <i-tabs :current="current" color="#f9d348" @change="handleTabChange">
              <i-tab key="0" title="支出"></i-tab>
              <i-tab key="1" title="收入"></i-tab>
            </i-tabs>
            <view class="ct">
              <i-button 
                v-for="item in iconList" 
                v-if="item.type == current"
                :key="item._id"
                size="small" inline 
                styles="background-color:rgba(249, 211, 72, 0.8) !important"
                @click="iconChoose(item._id, item.name, item.stName)"
                type="success">
                <i-icon :type="item.stName" slot="icon" size="18" color="#666666"/>
                <span style="color:#666666;margin-left:5px;font-size:13px">{{item.name}}</span>
              </i-button>
              <!-- <view v-for="item in iconList" :key="item._id" class="icon">
                <i-icon :type="item.stName" v-if="item.type == current" slot="icon" size="35" color="grey"/>
              </view> -->
            </view>
        </view>
    </i-drawer>
    <i-toast id="toast" />
  </div>
</template>

<script>
import _ from 'lodash'
import https from '../../utils/https'
const { postReq, getReq, putReq } = https
const { $Toast } = require('../../../static/iview/base/index')

export default {
  data() {
    return {
      radio: [
        {
          id: 0,
          checked: true,
          name: '支出'
        },
        {
          id: 1,
          name: '收入'
        }
      ],
      _id: '', // 编辑 - update的id
      showRight1: false,
      current: '0',
      balance: '', // 金额
      content: '', // 描述
      type: 0, // 操作类型，默认0 - 支出
      classifyMess: {}, // 选中图标信息
      iconList: [] // 图标list
    }
  },

  components: {},

  methods: {
    iconChoose(_id, name, stName) {
      this.toggleRight1() // 关闭抽屉
      // console.log(id,name,stName)
      this.classifyMess = {
        _id,
        name,
        stName
      }
    },
    handleTabChange({ target }) {
      this.current = target.key
    },
    bindChange(e, key) {
      // console.log(e, target)
      this[key] = e.target.detail.value
    },
    // 抽屉显隐
    toggleRight1() {
      this.showRight1 = !this.showRight1
    },
    // 表单提交
    handleSubmit() {
      const { current, balance, content } = this
      const classifyId = this.classifyMess._id
      const userId = '5b87b6d045f91d3d7aaaa36a'
      if (!(balance && content && classifyId)) {
        $Toast({
          content: '数据不完整！'
        })
      }
      const data = {
        userId,
        type: current,
        balance,
        content,
        classifyId
      }
      // 提交表单
      if (this._id) {
        // 编辑
        putReq({
          url: `records/update/${this._id}`,
          data,
          cb: res => {
            this.afterDataChange()
            wx.navigateBack()
            $Toast({
              content: res.message,
              type: 'success'
            })
          }
        })
      } else {
        // 新增
        postReq({
          url: 'records/add',
          data,
          cb: res => {
            this.afterDataChange()
            $Toast({
              content: res.message,
              type: 'success'
            })
          }
        })
      }
    },
    // 查找单条数据
    findOne(id) {
      getReq({
        url: `records/find/${id}`,
        cb: res => {
          this.balance = res.result.balance
          // this.classifyId = res.result.classifyId
          this.type = res.result.type
          this.content = res.result.content

          const classifyMess = _.find(this.iconList, function(o) {
            return o._id === res.result.classifyId
          })

          this.classifyMess = classifyMess
        }
      })
    },
    // 更改list后的操作
    afterDataChange() {
      wx.navigateBack()
      this.globalData.shouldIndexUpdate = true // 全局修改 -- 进入record页update
    }
  },

  onLoad: function(query) {
    let title = query.id ? '编辑' : '新增'
    this._id = query.id
    wx.setNavigationBarTitle({ title }) // 设置title
    new Promise((resolve, reject) => {
      // 全局变量中是否能缓存数据iconlist
      wx.getStorage({
        key: 'iconlist',
        complete: function(res) {
          if (res.data && res.data.length) {
            resolve(res.data)
          }
          reject() // eslint-disable-line
        }
      })
    })
      .then(res => {
        this.iconList = res
        query.id && this.findOne(query.id)
      })
      .catch(() => {
        // 重新获取数据
        postReq({
          url: 'classify/list',
          data: {},
          cb: res => {
            // console.log(res)
            const { docs } = res.result
            if (docs.length) {
              this.iconList = docs
              query.id && this.findOne(query.id)
              // 放进storage
              wx.setStorage({
                key: 'iconlist',
                data: docs
              })
            }
          }
        })
      })
  }
}
</script>

<style scoped lang='scss'>
.drawer-container {
  width: 55vw;
  height: 100vh;
  background: #fff;
}
.icon {
  display: inline;
  background: #efefef;
  padding: 5px;
  width: 75px;
  height: 75px;
  overflow: hidden;
  text-align: center;
  border-radius: 50%;
  margin: 0 3px;
  ._i-icon {
  }
}
.iconFormControl {
  display: inline-block;
  font-size: 14px;
  color: #495060;
  padding: 7px 15px;
  ._span {
    min-width: 65px;
    padding-right: 10px;
  }
  .iconBtn {
    display: inline-block;
  }
  .chooseIcon {
    display: inline-block;
    .i-class {
      color: #000;
    }
  }
}
</style>
