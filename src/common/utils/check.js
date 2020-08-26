// 所有的验证方式都写在这

// 表单验证方式，提示文案统一

// 非空，必填
export const notEmpty = (str) => ({ required: true, message: '请输入' + str, trigger: 'blur' })
export const notEmptySelect = (str) => ({ required: true, message: '请选择' + str, trigger: 'change' })

// 不能有空格
export const noBlank = () => ({ pattern: /^(\S)+$/, message: '不能有空格', trigger: 'blur' })

// 筛选
export const notSelect = (str) => ({ required: true, message: '请选择' + str, trigger: 'change' })

// 必须为数字
export const isNumberBetween = (min, max) => {
  let reg = new RegExp(`^(\d){${min},${max}}$`)
  return ({ pattern: /^(\d){}$/, message: `必须为${min}至${max}的数字`, trigger: 'blur' })
}
// 必须是数字
export const mustNumber = () => {
  return ({ type: 'number', message: `必须为数字`, trigger: 'blur' })
}

// 手机号 /^1[3456789]\d{9}$/
export const isPhone = () => ({ pattern: /^1[3456789]\d{9}$/, message: '不是合法的手机号', trigger: 'blur' })

// 链接
export const isHttp = (str) => ({ required: true, pattern: /^(http|https)\S*/, message: '开头必须是http或者https', trigger: 'blur' })

// 必须正整数
export const isInteger = (str) => {
  return ({ pattern: /^[0-9]+$/, message: str + `必须为整数`, trigger: 'blur' })
}
// 必须为数字，可以是小数
export const isDecimal = () => {
  return ({ pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: `必须为数字`, trigger: 'blur' })
}

// 保留两位小数
export const fixedTwoNum = (str) => {
  return ({ pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: str + `保留两位小数`, trigger: 'change' })
}

// 必须为数字，可以是小数，但是必须是保留两位小数点的数字
export const isDecimalTwo = () => {
  return ({ pattern: /^[0-9]+(.[0-9]{2})?$/, message: `必须为数字,只可保留两位小数`, trigger: 'blur' })
}

// 9位数字，最多两位小数
export const isDecimalWithFixedTwo = (str) => {
  return ({ pattern: /^[0-9]{0,11}([.]{1}[0-9]{0,2}){0,1}$/, message: str + `必须为数字, 并且整数部分最多11位，小数部分最多2位`, trigger: 'change' })
}
// 邮箱验证 /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export const isMail = () => {
  return ({ pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: `邮箱格式不正确`, trigger: 'blur' })
}

/**
 * 验证是不是数字
 * @param val
 * @returns {boolean}
 */
export const isNumber = (val) => {
  if (val === null || val === undefined || Math.abs(val) === Infinity) return false
  return !isNaN(parseFloat(val - 0))
}

/**
 * 验证正整数
 * @param num
 * @returns {boolean}
 */
export const isPosInteger = (num) => {
  num = num - 0
  return num !== 0 && /^[0-9]+$/.test(num)
}

/**
 * 验证手机号
 * @param phone
 * @returns {boolean}
 */
export const checkPhone = (phone) => {
  return /^1[3,4,5,6,7,8][0-9]{9}$/.test(phone)
}

export const checkTelPhone = (tp) => {
  return /^(0\d{2,3}(-|\s|)\d{7,8})$/.test(tp)
}

// 验证密码6-16位，区分大小写
export const checkPassword = (password) => {
  // return /^(\d{6,16})|((?! )(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9_]{6,16})$/.test(password)
  return /^(?=.*[a-zA-Z])(?=.*[\d])[\w\W]{6,16}$/.test(password)
}

export const isEmptyString = (str) => {
  // return /^(\d{6,16})|((?! )(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9_]{6,16})$/.test(password)
  return !str || str.trim().length === 0
}

/**
 * 验证字符串中是否包含字母
 * @param str
 * @returns {boolean}
 */
export const hasLetter = (str) => {
  return /[a-z]/i.test(str + '')
}

/**
 * 判断字符串是否以数字开头
 * @param str
 * @returns {boolean}
 */
export const isStartWithNum = (str) => {
  return /^[1-9]/.test(str)
}

/*
 *去除word粘贴的样式
 */
export const delWordLabel = (src) => {
  if (!src) {
    return ''
  }
  src = src.replace(/[ ]|[\r\n]/g, '')
  src = src.replace(/@font-face.*/g, '')
  let handleJson = src.replace(/<.*?>/g, '')
  // console.log(handleJson);
  return handleJson
}

export const nowInDateBetwen = (d1, d2) => {
  if (!d1 || !d2) {
    return false
  }
  // 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(d1.replace(/-/g, '/'))// 将-转化为/，使用new Date
  var dateEnd = new Date(d2.replace(/-/g, '/'))// 将-转化为/，使用new Date
  var dateBegin = new Date(d1)// 将-转化为/，使用new Date
  var dateEnd = new Date(d2)// 将-转化为/，使用new Date
  var dateNow = new Date()// 获取当前时间

  var beginDiff = dateNow.getTime() - dateBegin.getTime()// 时间差的毫秒数
  var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000))// 计算出相差天数

  var endDiff = dateEnd.getTime() - dateNow.getTime()// 时间差的毫秒数
  var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000))// 计算出相差天数
  if (endDayDiff < 0) { // 已过期
    // console.log('已过期');
    return false
  }
  if (beginDayDiff < 0) { // 没到开始时间
    // console.log('没到开始时间');
    return false
  }
  return true
}
