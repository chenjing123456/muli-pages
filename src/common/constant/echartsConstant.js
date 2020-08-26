
export let  pieOption = {
  color:[],
  title: {
      text: '',
      left: '23%',
      top: 'center',
      textStyle: {
          fontSize: '25',
          fontWeight: 'bold'
      },
  },
  tooltip: {
      trigger: 'item',
      // formatter: "{b}: {c}家 "
  },
  legend: {
      orient: 'vertical',
      right:50,
      top: 40,
      bottom: 20,
      icon:'circle',
      textStyle:{
          color:'#666',
      },
      formatter: function (name) {

      },

  },
  series: [
      {
          name:'',
          type:'pie',
          center:['32%','50%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
              normal: {
                  show: false,
                  color:'#333',
                  position: 'center',
                  formatter: "{c}\n{b}"
              },
              emphasis: {
                  show: false,
                  textStyle: {
                      fontSize: '25',
                      fontWeight: 'bold'
                  }
              }
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          data:[]
      }
  ]
};

