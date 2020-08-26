import img from '@/assets/images/microPoint.png'
// import AMap from 'AMap'
import {
  jiaozhou
} from './lngLat/amap.jiaozhou'
import { setLocalStorage, toHtmlStr } from '../../common/utils'

let jzMapper = {}
jiaozhou.districts.map(v => {
  jzMapper[v.name] = v
})

const mapper = {
  // '胶州市':jiaozhou,
  ...jzMapper
}

console.log('mapper')
console.log(mapper)

const processMapper = {

}
const district = new AMap.DistrictSearch({
  level: 'province',
  showbiz: false,
  extensions: 'all',
  subdistrict: 3
})
export const sytleID = '140c5762696519e9d4c23cbcc1d74d60'
export const regionLevel = ['street', 'district', 'city', 'province']

export const wzLevel = ['city', 'district', 'garden', 'company']

let map = {}
// 初始化背景地图
export const mapInit = (id = 'index-overView', opts = {}, styleId = 'amap://styles/f147564119361754e6372bfbef57548a') => { // fc35552908a5c4f34b7330621230b0bd
  // if(Object.keys(map).length === 0){
  map = new AMap.Map(id, Object.assign({
    mapStyle: styleId,
    zoom: 8,
    center: [119.92388, 36.251768]
    // pitch: 50,
    // viewMode: '3D',
    // features: ['bg', 'road'],
  }, opts))
  // }
  return map
}

// 高德坐标转百度坐标
function bd_encrypt (gg_lng, gg_lat) {
  let X_PI = Math.PI * 3000.0 / 180.0
  let x = gg_lng; let y = gg_lat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
  let bd_lng = z * Math.cos(theta) + 0.0065
  let bd_lat = z * Math.sin(theta) + 0.006
  return {
    bd_lat: bd_lat,
    bd_lng: bd_lng
  }
}

function createLngLat (polyline) {
  let result = []
  let arr = polyline.split('|').filter(v => v.length)
  let arr1 = arr.map(v => {
    return v.split(';').map(v1 => v1.split(',').map(v2 => (v2 - 0)))
  })
  result = arr1.filter(v => v.length > 0)

  return result
}

function createAMapResponse (areaName) {
  let districts = mapper[areaName].districts
  let v = mapper[areaName]
  processMapper[areaName] = {
    adcode: v.adcode,
    center: v.center.split(',').map(v => (v - 0)),
    districtList: processLngLat(v.districts),
    boundaries: (v.polyline ? createLngLat(v.polyline) : []),
    name: v.name,
    level: v.level
  }

  return processMapper[areaName]
}

function processLngLat (districts) {
  return districts.map(v => {
    return {
      adcode: v.adcode,
      center: v.center.split(',').map(v => (v - 0)),
      districtList: processLngLat(v.districts),
      boundaries: (v.polyline ? createLngLat(v.polyline) : []),
      name: v.name,
      level: v.level
    }
  })
}

const filterCode = ['340506', '340521', '340523', '340503', '340504', '340522'] // ["博望区", "当涂县", "和县", "花山区", "雨山区", "含山县"]

export const getBounds = ({
  searchName,
  opts
}) => {
  if (opts) {
    opts.level && district.setLevel(opts.level)
    opts.subdistrict && district.setSubdistrict(opts.subdistrict)
  }
  return new Promise((resolve, reject) => {
    if (processMapper[searchName]) {
      resolve(processMapper[searchName])
    } else if (mapper[searchName]) {
      resolve(createAMapResponse(searchName))
    } else {
      district.search(searchName, function (status, result) {
        // console.log(result);
        if (status == 'complete') {
          let district = null
          if (result.districtList.length > 1) {
            district = result.districtList.filter(v => filterCode.indexOf(v.adcode) > -1)[0]
          } else {
            district = result.districtList[0]
          }

          let { adcode, center, districtList, level, name, boundaries } = district
          resolve({
            adcode,
            center: [center.lng, center.lat],
            districtList,
            boundaries,
            name,
            level
          })
        } else {
          reject(result)
        }
      })
    }
  })
}
let zhejiangInfo = {}
async function initZhejInfo (para) {
  let rtn = await getBounds({
    searchName: para.name || '浙江省',
    level: 'province'
  }).then(res => res.districtList[0])
  return rtn
}
// 获取浙江边界以及下属行政信息
export const getZheJBounds = (para) => {
  if (Object.keys(zhejiangInfo).length === 0) {
    zhejiangInfo = initZhejInfo(para)
  }
  // console.log(zhejiangInfo)
  return zhejiangInfo
}
// 渲染城市名
// 渲染边界线
export const renderPolyline = (bounds, {
  strokeColor,
  strokeWeight
} = {
  strokeColor: '#FFFEC43B',
  strokeWeight: 4
}) => {
  console.log(bounds)
  if (!bounds || (bounds && bounds.length == 0)) {
    return
  }
  let arr = []
  for (let i = 0, l = bounds.length; i < l; i++) {
    let p = new AMap.Polyline({
      path: bounds[i]

    })
    arr.push(p)
  }
  let overlayGroup = new AMap.OverlayGroup(arr)
  overlayGroup.setOptions({
    strokeColor: strokeColor,
    strokeWeight: strokeWeight
  })
  map.add(overlayGroup)
  // 添加高度面
  let object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 })
  map.add(object3Dlayer)
  let height = 0
  let color = 'rgba(155, 90, 0, 0.08)'// rgba
  let wall = new AMap.Object3D.Wall({
    path: bounds,
    height: height,
    color: color
  })
  wall.transparent = true
  object3Dlayer.add(wall)
}

export const filterBounds = (res) => {
  let districtList = null
  let filterLen = 0

  let arr = res.boundaries.filter(v => {
    return v.length > filterLen
  })

  return {
    bounds: arr,
    name: res.name,
    adcode: res.adcode,
    center: res.center
  }
}
// let preClearPolygons = [];
// let preClearpolylines = [];
/**
 * 渲染行政覆盖物
 * citys 城市名称数组：[]
 * opts
 * usePolyline : 是否使用边界线，默认true
 * polyLineOpts : 边界线配置项
 * polygonOpts : 覆盖物配置项
 * mapClearFlag:是否清空所有覆盖物标志，默认为空清空所有
 * linearColor:各区块颜色是否为渐变
 * commonFillColor: 各区块颜色不一样，由polygonOpts设置各区块样式
 *  */
export const rendPolygon = ({
  citys,
  opts,
  usePolyline = true,
  polyLineOpts = {},
  polygonOpts = {},
  mapClearFlag = true,
  linearColor = false,
  commonFillColor = false
} = {
  citys,
  opts,
  usePolyline,
  polyLineOpts,
  polygonOpts,
  linearColor,
  commonFillColor
}) => {
  if (mapClearFlag) {
    // map.clearMap();
  }
  let polygons = []
  return Promise.all(citys.map((v) => { // 获取边界线经纬度
    return getBounds({
      searchName: v,
      opts
    })
  })).then(res => { // 过滤边界线经纬度
    return res.map(v => {
      return filterBounds(v)
    })
  }).then(res => { // 绘制polygon和polyline
    res.map(({
      bounds,
      name,
      adcode
    }) => {
      let v = bounds
      let Opt = opts
      for (let i = 0, l = v.length; i < l; i++) {
        let opts = {
          strokeWeight: 3,
          path: v[i],
          fillOpacity: 0.5,
          fillColor: 'rgba(195, 244, 255, 0.46)',
          strokeColor: '#0015A5',
          strokeOpacity: 1
        }

        opts.strokeOpacity = (usePolyline ? 0.6 : 0)
        opts.extData = {
          areaName: name,
          adcode: adcode,
          ...opts.extData
        }
        opts = { ...opts, ...polygonOpts }
        // console.log('11111111111111111'+name);
        let polygon = new AMap.Polygon(opts)
        polygons.push(polygon)
        // console.log('2222222222222222222'+name);
        // console.log(polygons);
      }

      // for (let i = 0, l = v.length; i < l; i++) {
      //     if(usePolyline){
      //         // console.log(v[i])
      //         let opts = {
      //             path:v[i],
      //             strokeColor:'#FFFEC43B',
      //             strokeWeight:2,
      //             strokeOpacity:.3,
      //             map:map
      //         }
      //         Object.assign(opts,polyLineOpts);
      //         new AMap.Polyline(opts)
      //     }
      //
      // }
    })
    // preClearPolygons = [...polygons];
    // console.log(polygons);
    map.add(polygons)

    let streets = res.map(v => { return { name: v.name, center: v.center } })

    return { polygons, streets }
  })

  // return polygons;
}
/**
 * 风险概览图标散点
 * map：地图,
 * pointClick：散点点击事件
 * pointDtaa：散点数据
 *  */
let iconCircle = []
// export const iconPoint = (map, pointClick, pointData) => {
export const iconPoint = (map, pointClick, pointData, type = 1) => {
  if (iconCircle) {
    iconCircle.forEach(current => {
      current.setMap(null)
      current = null
    })
  }
  let startIcon = new AMap.Icon({
    size: new AMap.Size(23, 60), // 图标尺寸
    image: img// 图标的取图地址
    // imageSize: new AMap.Size(23, 60),// 图标所用图片大小
    // imageOffset: new AMap.Pixel(-12, 0)// 图标取图偏移量
  })
  pointData.forEach(current => {
    let singleIconCircle = new AMap.Marker({
      position: new AMap.LngLat(current.lng, current.lat),
      icon: startIcon,
      offset: new AMap.Pixel(-7, -52)
    })
    singleIconCircle.setMap(map)
    iconCircle.push(singleIconCircle)
    // if(type==1){//infowindow-重点企业分析
    //     pointEvent(map,'riskOverview',singleIconCircle,current,pointClick);
    // }else if(type==2){//土地专题分析
    //     pointEventLand(map,'riskOverview',singleIconCircle,current,pointClick)
    // }
  })
  // map.add(iconCircle);
}
/**
 * 企业风险散点
 * map：地图
 * pointClick：散点点击事件
 * pointData：散点数据
 *  */
let circle = []
export const pointShow = (map, pointClick, pointData) => {
  if (circle) {
    circle.forEach(current => {
      current.setMap(null)
      current = null
    })
  }

  pointData.forEach(current => {
    let icon = new AMap.Icon({
      size: new AMap.Size(17, 17),
      image: img,
      imageSize: new AMap.Size(17, 17),
      imageOffset: new AMap.Pixel(0, 0)
    })
    let singleCircle = new AMap.Marker({
      position: new AMap.LngLat(current.lng, current.lat),
      icon: icon,
      offset: new AMap.Pixel(0, 0),
      extData: current
    })
    singleCircle.setMap(map)
    circle.push(singleCircle)
    // pointEvent(map, singleCircle, current, pointClick);
  })

  return circle
}
// 风险概览、企业风险信息窗体
function createInfoWindow (ev) {
  let str1 = ``
  let str2 = ``
  let str3 = ``
  ev.warnList && ev.warnList.forEach((current, i) => {
    if (i > 2) return
    if (i >= 2) {
      str1 += `<span >...</span>`
      return
    }
    str1 += `<span >${current.themeName + current.warnLevel}</span>`
  })
  for (let i = 0; i < ev.riskLevels; i++) {
    str2 += `<i class='iconfont icon-shandian' style='color:#FFAB01'></i>`
  }
  for (let i = 0; i < 3 - ev.riskLevels; i++) {
    str3 += `<i class='iconfont icon-shandian' style='color:rgba(0,255,255,0.2)'></i>`
  }

  let info = `
        <div class='ent-row custom-info'>
            <div class='ent-name'>` + ev.entName + `</div>
            <div class='risk-label'>` + str1 + `</div>
            <div class='risk-content'>
                <span>风险指数 <span class='risk-index'>` + parseFloat(ev.score).toFixed(1) + `</span></span>
                <span>风险等级 ` + str2 + str3 + `</span>
            </div>
        </div>
    `
  return info
}
/**
 * 散点事件
 * map：地图
 * type：不同页面设置不同样式
 * pointClick：散点点击事件
 * singleCircle：当前散点
 * current：点前点击的散点数据
 *  */
let singnalCity = null

function pointEvent (map, singleCircle, current, pointClick) {
  // singleCircle.on('mouseover', function () {
  //     let infoWindow = new AMap.InfoWindow({
  //         isCustom: true, //使用自定义窗体
  //         content: `
  //         <div class="messageInfo"><i class="iconfont iconweigaizaotishengqiye"></i>${current.parkName}</div>
  //   `,
  //         offset: new AMap.Pixel(5, 0),
  //     });
  //     infoWindow.open(map, [current.lng, current.lat]);
  //
  // })
  // singleCircle.on('mouseout', function () {
  //     map.clearInfoWindow();
  //
  // });
  singleCircle.on('click', function (ev) {
    pointClick(current)
    let infoWindow = new AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: `
            <div class="messageInfo"><i class="iconfont iconweigaizaotishengqiye"></i>${current.parkName}</div>
      `,
      offset: new AMap.Pixel(5, 0)
    })
    infoWindow.open(map, [current.lng, current.lat])
  })
}
function createLandInfoWindow (current, map) {
  let info = document.createElement('div')
  info.className = 'landInfoMsg'
  let first = document.createElement('div')
  first.innerText = current.entName
  info.appendChild(first)

  let sec = document.createElement('div')
  sec.innerText = '|'
  info.appendChild(sec)

  let three = document.createElement('div')
  three.className = 'ent'
  let thrSpan = document.createElement('span')
  if (current.entType === 'A') {
    thrSpan.className = 'enttype A'
  } else if (current.entType === 'B') {
    thrSpan.className = 'enttype B'
  } else if (current.entType === 'C') {
    thrSpan.className = 'enttype C'
  } else if (current.entType === 'D') {
    thrSpan.className = 'enttype D'
  }
  let fSpan = document.createElement('span')
  fSpan.innerText = '档'
  thrSpan.innerText = current.entType
  three.appendChild(thrSpan)
  three.appendChild(fSpan)
  info.appendChild(three)
  let four = document.createElement('div')
  four.className = 'land_icon'
  let fIcon = document.createElement('i')
  fIcon.className = 'el-icon-arrow-right'
  four.appendChild(fIcon)
  info.appendChild(four)
  four.onclick = function (e) {
    window.location.href = `/entFile.html#/entFileMain/entDetail?entName=${current.entName}&creditCode=${current.creditCode}`
  }
  let five = document.createElement('div')
  five.className = 'land_icon bord'
  let fIcon1 = document.createElement('i')
  fIcon1.className = 'el-icon-close'
  fIcon1.onclick = function () {
    map.clearInfoWindow()
  }
  five.appendChild(fIcon1)
  info.appendChild(five)
  return info
}
function pointEventLand (map, type, singleCircle, current, pointClick) {
  singleCircle.on('mouseover', function () {
    let infoWindow = new AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: createLandInfoWindow(current, map),
      offset: new AMap.Pixel(150, -10)
    })

    infoWindow.open(map, [current.lng, current.lat])
  })
  map.on('mouseout', function () {
    map.clearInfoWindow()
  })
  map.on('click', function () {
    map.clearInfoWindow()
  })
  singleCircle.on('click', function (ev) {
    pointClick(current)
    map.clearInfoWindow()
  })
}
/**
 * 根据散点位置高亮当前城市
 * map:地图
 * singleCircle：散点
 */
function renderSingnalPolygon (map, singleCircle) {
  map.plugin('AMap.Geocoder', function () {
    let geocoder = new AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: '330000'
    })
    let lnglat = [singleCircle.getPosition().lng, singleCircle.getPosition().lat]
    geocoder.getAddress(lnglat, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // result为对应的地理位置详细信息
        // console.log(result);
        let opts = {
          level: 'city',
          subdistrict: 1
        }
        rendPolygon({
          citys: [result.regeocode.addressComponent.city],
          opts,
          mapClearFlag: false,
          usePolyline: false,
          polygonOpts: {
            strokeWeight: 3,
            fillOpacity: 0.8,
            fillColor: '#00FFFB',
            strokeColor: '#00FFFB',
            strokeOpacity: 0.8
          }
        }).then(res => {
          singnalCity = res
        })
      }
    })
  })
}

/**
 * 设置3d柱状图
 * map:地图实例
 * list：柱状图显示位置和高度数据
 */
export const barLayer = (map, list) => {
  let layer = new Loca.ScatterPointLayer({
    map: map,
    eventSupport: true
  })
  layer.setData(list.slice(0, 5000), {
    lnglat: 'coord'
  })
  let colors = [
    '#FB9509',
    '#FB9509',
    '#FB9509',
    '#FB9509',
    '#FB9509'
  ]
  layer.setOptions({
    fitView: true,
    // 设定棱柱体顶点数量
    vertex: 4,
    // 单位米
    unit: 'meter',
    light: {
      // 环境光
      ambient: {
        // 光照颜色
        color: '#ffffff',
        // 光照强度，范围 [0, 1]
        intensity: 0.5
      },
      // 平行光
      directional: {
        color: '#ffffff',
        // 光照方向，是指从地面原点起，光指向的方向。
        // 数组分别表示 X 轴、Y 轴、Z 轴。
        // 其中 X 正向朝东、Y 正向朝南、Z 正向朝地下。
        direction: [1, -1.5, 2],
        intensity: 0.6
      }
    },
    style: {
      // 正多边形半径
      radius: 500,
      height: {
        key: 'value',
        value: [0, 20000]
      },
      // 顶边颜色
      color: {
        key: 'value',
        scale: 'quantile',
        value: colors
      },
      opacity: 1,
      // 旋转角度，单位弧度
      rotate: Math.PI / 180 * 45
    },
    selectStyle: {
      color: '#FB9509',
      opacity: 0.9
    }
  })
  layer.on('mouseover', (ev) => {
    let infoWindow = new AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: barWinStyle(ev.rawData),
      offset: new AMap.Pixel(110, -40)
    })
    infoWindow.open(map, ev.rawData.coord.split(','))
  })
  layer.on('mouseout', function () {
    map.clearInfoWindow()
  })
  layer.render()
  return layer
}

export const barWinStyle = (data) => {
  let info = `<div class='bar-info-win'>
        <div>` + (data.index + 1) + `</div><div>` + data.name + ` ` + data.unit + ` ： ` + data.value + `</div>
    </div>`
  return info
}

export const getCenter = (name, center) => {
  if (name === '雨山区') {
    return center.offset(0, -5000)
  } else if (name === '花山区') {
    return center.offset(0, +2500)
  } else if (name === '博望区') {
    return center.offset(-3000, 0)
  } else if (name === '当涂县') {
    return center.offset(5000, -3000)
  }

  return center
}
/**
 * 渲染马鞍山地图
 */
export const renderMaAnShanBoundry = (callback = (data) => {}) => {
  getBounds({ searchName: '马鞍山市' }).then(res => {
    // map.setCenter([118.507906, 31.689362]);
    // renderPolyline(res.boundaries,{
    //     strokeColor:'#012785',
    //     strokeWeight:4
    // });
    // console.log(res);
    setLocalStorage('originalBounds', JSON.stringify(res.boundaries))

    res.districtList.map(v => {
      new AMap.Text({
        map: map,
        position: getCenter(v.name, v.center),
        text: v.name,
        style: {
          'background-color': 'transparent',
          'color': '#ffffff',
          'border-width': 0,
          'font-size': '50%'
        }
      })
    })
    return res.districtList.map(v => v.name)
  }).then(res => {
    renderMaAnShanDistrict(res).then(({ polygons, streets }) => {
      callback(polygons, streets)
    })
  })
}
/**
 * 渲染马鞍山区县
 */
export const renderMaAnShanDistrict = (citys) => {
  let opts = {
    level: 'city',
    subdistrict: 1
  }
  return rendPolygon({
    citys: citys,
    opts,
    usePolyline: true,
    mapClearFlag: true,
    linearColor: false,
    polygonOpts: {
      fillColor: '#64E5FF',
      fillOpacity: 0.9,
      strokeOpacity: 0.4,
      strokeColor: '#012785',
      strokeWeight: 4
    }
  })
}

/**
 * 设置地图中心点
 */
export const setMapCenterSpot = (map, lng, lat) => {
  // 数组
  let _arr = [lng, lat]
  // 设置
  map.setCenter(_arr)
}
/**
 * 设置地图缩放级别
 */
export const setMapZoom = (map, zoom) => {
  map.setZoom(zoom)
}
/**
 * 设置地图俯仰角，3D视图有效
 */
export const setMapPitch = (map, pitch) => {
  map.setPitch(pitch)
}
// 清除所有覆盖物
export const clearMap = (map) => {
  map.clearMap()
}
