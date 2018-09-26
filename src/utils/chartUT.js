/**
 * chart的utils
 * @author：chenxin
 */
import moment from 'moment'

/**
 * 根据年&周数返回当周的startDate和endDate
 * year:  年份
 * index: 周数
 * return: ['2015-02-12','2015-02-19']
 */
export const weekFormat = function(year, index) {
  index = Number(index)
  var d = new Date(year, 0, 1)
  while (d.getDay() !== 1) {
    d.setDate(d.getDate() + 1)
  }
  var to = new Date(year + 1, 0, 1)
  var i = 1
  var arr = []

  // eslint-disable-next-line
  for (var from = d; from < to; ) {
    if (i === index) {
      arr.push(moment(from).format('YYYY-MM-DD'))
    }
    var j = 6
    while (j > 0) {
      from.setDate(from.getDate() + 1)
      if (i === index && j === 1) {
        arr.push(moment(from).format('YYYY-MM-DD'))
      }
      j--
    }
    if (i === index) {
      return arr
    }
    from.setDate(from.getDate() + 1)
    i++
  }
}

/**
 * 根据年&月份返回当月的startDate和endDate
 * year:  年份
 * month: 月份
 * return: ['2015-02-12','2015-02-19']
 */
export const monthFormat = function(year, month) {
  month = month - 1
  month = Number(month)
  const from = new Date(year, month, 1)
  var to = new Date(year, month + 1, 1)

  to.setDate(to.getDate() - 1)
  return [moment(from).format('YYYY-MM-DD'), moment(to).format('YYYY-MM-DD')]
}

/**
 * 根据年返回当年的startDate和endDate
 * year:  年份
 * month: 月份
 * return: ['2015-02-12','2015-02-19']
 */
export const yearFormat = function(year) {
  year = Number(year)
  const from = new Date(year, 0, 1)
  var to = new Date(year + 1, 0, 1)

  to.setDate(to.getDate() - 1)
  return [moment(from).format('YYYY-MM-DD'), moment(to).format('YYYY-MM-DD')]
}

export const options = {
  options: {
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: '#8d8d8d'
        }
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        data: [],
        type: 'line',
        itemStyle: {
          normal: {
            color: '#f0c332', // 小圆点
            lineStyle: {
              color: '#272727',
              width: 1
            }
          }
        }
      }
    ]
  }
}
