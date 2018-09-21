/**
 * 提供list的mixins
 */
import https from '../utils/https'

const { postReq } = https

export default {
  data() {
    return {
      currentPage: 1, // 当前页数  默认是1
      total: 0, // 总页数
      docs: [], // 原始数据list
      loadMoreIng: false, // 是否正在加载
      isEnd: false // 是否触底，没有更多
    }
  },
  methods: {
    /**
     * 获取数据
     * @param {function} cb.fb 成功/失败的回调函数
     */
    getData: function(cb, fb) {
      const { url, query, loadMoreIng } = this

      if (!loadMoreIng) {
        this.loadMoreIng = true
        postReq({
          url,
          data: query,
          cb: res => {
            // console.log(res)
            const { docs, total } = res.result
            this.docs = docs
            this.total = total
            cb && typeof cb === 'function' && cb()
            this.loadMoreIng = false
          },
          fb: err => {
            console.log(('err:', err))
            fb && typeof fb === 'function' && fb()
          }
        })
      } else {
        console.log('正在加载了...')
      }
    }
  }
}
