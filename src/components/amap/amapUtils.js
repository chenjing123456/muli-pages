// import {sytleID} from './amap'
//风险概览地图
/**
 * 企业风险散点事件
 * map：地图
 * pointClick：散点点击事件
 * pointData：散点数据
 *  */
export const pointShow = function(map,pointClick,pointData){
    let circle=[];
    pointData.forEach(current => {
        let fillColor=current.riskLevel==5?'#FF7C2F':(current.riskLevel==4?'#FD9F67':'#FFFB8C');
        let options={
            map:map,
            zIndex:1000,
            center: new AMap.LngLat(current.center.split(',')[0], current.center.split(',')[1]), // 圆心位置
            radius: 5000,  //半径
            strokeColor: "#FFFB8C",  //线颜色
            strokeOpacity: 0.5,  //线透明度
            strokeWeight: 6,  //线粗细度
            fillColor: fillColor,  //填充颜色
            fillOpacity: 1 //填充透明度
        }
        let singleCircle=new AMap.Circle(options);
        circle.push(singleCircle);
        singleCircle.on('mouseover',function(){
            var infoWindow = new AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                content: createInfoWindow(current),
                offset: new AMap.Pixel(16, -20),
            });
            infoWindow.open(map,current.center.split(','));
        })
        singleCircle.on('mouseout', function () {
            map.clearInfoWindow();
        });
        singleCircle.on('click', function (ev) {
            pointClick(current)
            map.clearInfoWindow();
        });
    })
    map.add(circle);
}
//风险概览、企业风险信息窗体
function createInfoWindow(ev) {
    let str1=``,str2=``,str3=``;
    ev.riskLabel.forEach(current=>{
        str1+=`<span >${current}</span>`
    })
    for(let i=0;i<ev.riskLevel;i++){
        str2+=`<i class='iconfont icon-shandian' style='color:#FFAB01'></i>`
    }
    for(let i=0;i<5-ev.riskLevel;i++){
        str3+=`<i class='iconfont icon-shandian' style='color:rgba(0,255,255,0.2)'></i>`
    }
    var info=`
        <div class='ent-row custom-info'>
            <div class='ent-name'>`+ev.entName+`</div>
            <div class='risk-label'>`+str1+`</div>
            <div class='risk-content'>
                <span>风险指数 <span class='risk-index'>`+ev.riskIndex+`</span></span>
                <span>风险等级 `+str2+str3+`</span>
            </div>
        </div>
    `;
    return info;
}
