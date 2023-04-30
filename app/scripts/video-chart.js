var videoChart = echarts.init(document.getElementById('video-chart'));
var videoOption;

var getData = [
    {"times":"1","scheduleTime":90},{"times":"2","scheduleTime":90},{"times":"3","scheduleTime":89},
    {"times":"4","scheduleTime":89},{"times":"5","scheduleTime":89},{"times":"6","scheduleTime":87},
    {"times":"7","scheduleTime":86},{"times":"8","scheduleTime":86},{"times":"9","scheduleTime":84},
    {"times":"10","scheduleTime":84},{"times":"11","scheduleTime":83},{"times":"12","scheduleTime":82},
    {"times":"13","scheduleTime":81},{"times":"14","scheduleTime":80},{"times":"15","scheduleTime":80},
    {"times":"16","scheduleTime":80},{"times":"17","scheduleTime":80},{"times":"18","scheduleTime":76},
    {"times":"19","scheduleTime":76},{"times":"20","scheduleTime":76},{"times":"21","scheduleTime":76}]
index = 13;
videoOption = {
    title: {
        text: '遗传算法每次调度耗时情况',
        left: 'center',
        top: 10,
        textStyle:{
            fontSize:14,
        }
    },
    tooltip : {
        trigger: 'axis'
    },
    xAxis : [{
        type : 'category',
        name: '迭代\n次数\n（次）',
        boundaryGap : false,
        data : function (){
            var list = [];
            for (var i = 0; i < index; i++) {
                list.push(getData[i].times);
            }
            return list;
        }()
    }],
    yAxis : [{
        type : 'value',
        name: '耗时(分钟)',
        show: true
    }],
    series : [{
        name:'',
        type:'line',
        smooth: true,
        data:function (){
            var list = [];
            for (var i = 0; i < index; i++) {
                list.push(getData[i].scheduleTime);
            }
            return list;
        }()
    }]
};


var interval = setInterval(function (){
    if (index == getData.length - 1) {
        clearInterval(interval);
    }
    var data = videoOption.series[0].data;
    data.shift();
    data.push(getData[index].scheduleTime);
    videoOption.xAxis[0].data.shift();
    videoOption.xAxis[0].data.push(getData[index++].times);
    videoOption && videoChart.setOption(videoOption);
}, 1000);

