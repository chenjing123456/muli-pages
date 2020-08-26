


// 东阳街道经纬度
import { regionJson } from './../../../static/plugins/region/amap.dongyang'

/**
 * 渲染散点
 *circleData:散点数据
 *multiIcon:是否显示多种不同样式散点
 */
import scatterPoint1 from '../../assets/images/scatterPoint1.png'
import scatterPoint2 from '../../assets/images/scatterPoint2.png'
import scatterPoint3 from '../../assets/images/scatterPoint3.png'
import scatterPoint4 from '../../assets/images/scatterPoint4.png'
export let region = []
let json
export const getMapJson = (chartMap) => { // 初始化地区
  // json = require('./../../../static/plugins/region/haiyan.json');

  new echarts.registerMap('haiyan', json)

  region = json['features'].map(v => { return { name: v.properties.name, code: v.id } }).reverse()

  mapSelectWithDataIndex(chartMap)
}

export const mapSelectWithDataIndex = (chartMap, selectIndex) => {
  let temp = region.map(v => {
    return {
      name: v.name,
      value: 100
    }
  })
  chartMap.setOption({
    series: [
      {
        itemStyle: {
          normal: {
            areaColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(45, 185, 255, 0.81)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(0, 111, 223, 1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            borderColor: 'rgba(255,255,255,1)',
            borderWidth: 1.5,
            borderType: 'solid'
          },
          emphasis: {
            areaColor: 'rgba(110, 151, 50, .85)',
            borderColor: '#47F7FF',
            borderWidth: 1.5,
            borderType: 'solid'
          }
        },
        type: 'map',
        map: 'haiyan',
        data: temp,
        label: {
          normal: {
            show: true,
            color: '#fff'
          },
          emphasis: {
            show: true,
            color: '#fff'
          }
        }
      }],
    geo: {
      map: 'haiyan'
    }
  })

  if (selectIndex === 0 || selectIndex > 0) {
    chartMap.dispatchAction({
      type: 'mapSelect',
      seriesIndex: 0,
      dataIndex: selectIndex
    })
  }
}

export const initMap = function (chartMap, id, isHot = false) {
  chartMap = echarts.init(document.getElementById(id))
  if (isHot) {
    chartMap.setOption(mapOption)
  }
  getMapJson(chartMap)
  chartMap.setOption({
    series: [{
      itemStyle: {
        emphasis: {
          areaColor: '#1c91ff'
        }
      }
    }]
  })
  window.addEventListener('resize', function (e) {
    chartMap.resize()
  })
  return chartMap
}

export const mapOption = {
  tooltip: {
    show: true,
    trigger: 'item'
  },
  visualMap: {
    min: 100,
    max: 250,
    right: '5%',
    bottom: '5%',
    text: ['指标高', '指标低'],
    seriesIndex: [0],
    inRange: {
      color: ['#0071FF', '#49A4FF', '#9DE0FF', '#FFE091', '#FFBE15', '#FF6600']
    },
    calculable: true,
    realtime: false,
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'PingFangSC-Semibold'
    },
    padding: 5
  },
  geo: {
    map: 'haiyan',
    label: {
      normal: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      }
    },
    itemStyle: {
      normal: {
        borderColor: '#fff'
      },
      emphasis: {
        areaColor: null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 20,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  },
  series: [
    {
      itemStyle: {
        normal: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(45, 185, 255, 0.81)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(0, 111, 223, 1)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          borderColor: 'rgba(255,255,255,1)',
          borderWidth: 1.5,
          borderType: 'solid'
        },
        emphasis: {
          areaColor: '#1c91ff',
          borderColor: '#00FFFF',
          borderWidth: 2,
          borderType: 'solid'
        }
      },
      type: 'map',
      map: 'haiyan',
      name: '',
      data: [],
      label: {
        normal: {
          show: true,
          color: '#fff'
        },
        emphasis: {
          show: true,
          color: '#fff'
        }
      }
    }
  ]
}

// 地图对象
let amap = {}
// 海盐乡镇polygons覆盖物 polylines覆盖物四周折线
let polygons = []; let polylines = []

/**
 *将百度地图转为高德地图
 */
var x_pi = 3.14159265358979324 * 3000.0 / 180.0
function baiduTomars (baidu_point) {
  // var mars_point={lng:0,lat:0};
  // var x=baidu_point.lng-0.0065;
  // var y=baidu_point.lat-0.006;
  // var z=Math.sqrt(x*x+y*y)- 0.00002 * Math.sin(y * x_pi);
  // var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  // baidu_point.lng=z * Math.cos(theta);
  // baidu_point.lat=z * Math.sin(theta);

  var x = baidu_point[0] - 0.0065
  var y = baidu_point[1] - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  baidu_point[0] = z * Math.cos(theta)
  baidu_point[1] = z * Math.sin(theta)
  // return mars_point;
}

// let c= [[119.948679,29.495396],[119.949685,29.49703],[119.951554,29.498539],[119.955722,29.499294],[119.959027,29.499797],[119.96492,29.500551],[119.971819,29.500928],[119.978143,29.501808],[119.981449,29.50206],[119.983605,29.500928],[119.984899,29.499419],[119.98648,29.497533],[119.987486,29.495396],[119.988492,29.492755],[119.988923,29.489988],[119.987917,29.488353],[119.987055,29.48697],[119.986767,29.485964],[119.986623,29.484832],[119.986336,29.484078],[119.985186,29.483197],[119.983605,29.481185],[119.979581,29.479676],[119.97685,29.478921],[119.973975,29.477915],[119.969376,29.476783],[119.96607,29.477161],[119.963196,29.47867],[119.956584,29.481562],[119.950691,29.483072],[119.94796,29.48785],[119.947529,29.493384]]
// c.map(cu=>{
//     baiduTomars(cu);
// })
// console.log(JSON.stringify(c))

/**
 * 初始化地图
 */
export let initAmap = function (id) {
  amap = new AMap.Map(id, {
    resizeEnable: true,
    center: regionJson.mapCenter,
    // center: [120.24185, 29.28942], // 中心点坐标
    mapStyle: 'amap://styles/d5364a675861fbc8e08d91b93773a5d5',
    viewMode: '3D',
    zoom: 11.4,
    pitch: 50
  })
  return amap
}
/*
    初始化钉钉端地图
 */
export let initAmapH5 = function (id) {
  amap = new AMap.Map(id, {
    resizeEnable: true,
    center: [120.351760,29.249722], // 中心点坐标
    mapStyle: 'amap://styles/d5364a675861fbc8e08d91b93773a5d5',
    zoom: 10
  })
  return amap
}

/**
 * 渲染海盐城镇区域
 */
export let rendPolygon = () => {
  regionJson['districts'].map(cu => {
    if (cu.name == '开发区' || cu.name == '水晶园区') {
      var polygon = new AMap.Polygon({
        path: JSON.parse(cu.polyline),
        fillColor: 'rgba(130, 206, 255, 0.75)',
        cursor: 'pointer',
        strokeColor: '#023049',
        strokeOpacity: 1,
        strokeWeight: 2.5,
        extData: {
          town: cu.name,
          center: cu.center
        },
        zIndex: 12
      })
    } else {
      // 生成行政区划polygon
      var polygon = new AMap.Polygon({
        path: JSON.parse(cu.polyline),
        fillColor: 'rgba(130, 206, 255, 0.75)',
        cursor: 'pointer',
        strokeColor: '#023049',
        strokeOpacity: 1,
        strokeWeight: 2.5,
        extData: {
          town: cu.name,
          center: cu.center
        },
        zIndex: 10
      })
    }
    polygons.push(polygon)
  })
  amap.add(polygons)
  return polygons
}

/**
 * 渲染城市名
 */
export let rendCityName = function () {
  let textLayer = new AMap.LabelsLayer({
    rejectMapMask: true,
    // 标注避让
    collision: true,
    // 开启标注淡入动画
    animation: true,
    zIndex: 120
  })
  amap.add(textLayer)
  regionJson.districts.forEach(item => {
    let labelsMarker = new AMap.LabelMarker({
      zooms: [3, 20],
      position: item.center,
      text: {
        content: item.name,
        style: {
          fillColor: 'white',
          fontWeight: 'normal',
          fontSize: 14,
          zooms: [3, 20]
        }
      }
    })
    textLayer.add(labelsMarker)
  })
}
export let renderCircle = function (circleData, multiIcon = false, index = 0, size = 30) {
  let style = [
    {
      url: scatterPoint1,
      anchor: new AMap.Pixel(1, 1),
      size: new AMap.Size(size, size)
    }, {
      url: scatterPoint2,
      anchor: new AMap.Pixel(1, 1),
      size: new AMap.Size(size, size)
    }, {
      url: scatterPoint3,
      anchor: new AMap.Pixel(1, 1),
      size: new AMap.Size(size, size)
    }, {
      url: scatterPoint4,
      anchor: new AMap.Pixel(1, 1),
      size: new AMap.Size(size, size)
    }
  ]; let setStyle = {}
  if (multiIcon) {
    setStyle = style
  } else {
    setStyle = style[index]
  }
  if (circleData && circleData.length > 0) {
    var mass = new AMap.MassMarks(circleData, {
      opacity: 0.8,
      zIndex: 111,
      cursor: 'pointer',
      style: setStyle
    })
    mass.setMap(amap)
  }
}

/**
 * 清空散点
 */
export let clearMassMarkers = function () {
  let layers = amap.getLayers()
  if (layers && layers.length > 0) {
    let massMarkerLayers = layers.filter(cu => {
      return cu.CLASS_NAME == 'AMap.MassMarks'
    }) || []
    amap.remove(massMarkerLayers)
  }
}
