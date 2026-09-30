'use strict';
// 原始行程：用户上传的《国庆计划 · 语雀.pdf》。所有价格均为原计划金额。
const POIS={
 nanning:{name:'南宁东站',gcj:[22.841826,108.413527],source:'https://www.amap.com/place/B03030X7FB'},
 nandan:{name:'南丹县城（区域示意）',gcj:[24.975066,107.540578],source:'https://www.amap.com/place/B030A00589',area:true},
 danlu:{name:'丹炉山景区',gcj:[24.810130,107.470820],source:'https://www.amap.com/place/B0FFITA7UW'},
 gubu:{name:'谷埠市场',wgs:[24.3042,109.40132],source:'https://mapcarta.com/W1299261155'},
 qingyun:{name:'青云民生市场',gcj:[24.311663,109.408988],source:'https://www.amap.com/place/B0FFFAKLIM'},
 liuzhou:{name:'柳州站',gcj:[24.308107,109.388016],source:'https://www.amap.com/place/B030400803'},
 elephant:{name:'象鼻山景区',gcj:[25.267579,110.296573],source:'https://www.amap.com/place/B030506W0W'},
 zhujiang:{name:'竹江码头',wgs:[25.12957,110.42912],source:'https://mapcarta.com/N3823360126'},
 jinlong:{name:'金龙桥码头',gcj:[24.816835,110.394130],source:'https://www.amap.com/place/B030507V1B'},
 jiuxian:{name:'旧县综合码头',gcj:[24.777973,110.433214],source:'https://www.amap.com/place/B0IBC7XVU6'},
 shuangliu:{name:'双流义渡亭',gcj:[24.762875,110.442321],source:'https://www.amap.com/place/B0FFJDV24L'},
 gongnong:{name:'工农桥',gcj:[24.734469,110.491013],source:'https://www.amap.com/place/BZ89OK000R'},
 west:{name:'西街步行街',gcj:[24.775820,110.495811],source:'https://www.amap.com/place/BZ8AOK003O'},
 fuli:{name:'富里桥',gcj:[24.826747,110.388036],source:'https://www.amap.com/place/B0FFH5YPLB'},
 station:{name:'阳朔站',gcj:[24.960139,110.568081],source:'https://www.amap.com/place/B0FFFFY2I3'}
};
const conflicts=[
 ['10/1 到达南丹','正文是经广州到南宁；筹划里还有06:52深圳北直达南宁东的版本。南宁东—河池西一段正文明确写未买到票。请按实际订单与接驳安排出发。'],
 ['10/2 南丹去柳州','正文20:00出发、约23:00到；交通汇总18:00出发；筹划又写10/3早上07:15出发。当前日程暂按10/2晚去柳州展示。'],
 ['10/3 柳州去桂林','正文约22:00；交通汇总21:14—22:14；筹划D8470为21:59—22:59。请核对车票，暂不锁定班次。'],
 ['10/4 漓江游船','正文09:30，交通汇总09:00，筹划10:20。登船地点按竹江码头，具体检票与开船时间以船票为准。'],
 ['阳朔住宿晚数','正文写两晚¥2,200；住宿汇总是10/4、10/5、10/6三晚¥2,200。请核对入住10/4、退房10/7和总价。桂林维纳斯皇家酒店还需核对具体分店。'],
 ['10/7 返程','正文G3741为10:20—13:23；交通汇总另写03:45—06:15；筹划另列G2929为11:25—14:04。当前暂按正文时间展示，实际以车票为准。'],
 ['预算与票价','外丹线出现¥303、¥188、¥288等版本，包车/顺风车也有多种报价。预算表仍写“南丹2晚”，与柳州住宿版不一致；未确认费用不视为已支付。']
];
const hotels=[
 {date:'10/1 · 南丹 · 1晚',name:'锡福假日酒店',q:'南丹 锡福假日酒店 汽车总站店',price:'¥280',desc:'原计划金额；核对实际入住订单。'},
 {date:'10/2 · 柳州 · 1晚',name:'南天大酒店',q:'柳州 南天大酒店 飞鹅路55-1号',price:'¥368',desc:'与10/2晚到柳州版本一致；若改10/3早上出发，需要同步调整。'},
 {date:'10/3 · 桂林 · 1晚',name:'维纳斯皇家酒店',q:'桂林 维纳斯皇家酒店 象鼻山',price:'¥508',desc:'具体分店待确认：象鼻山日月双塔店、象鼻山两江四湖店地址不同。'},
 {date:'10/4—10/6 · 阳朔',name:'云歌酒店（遇龙河国家旅游度假区店）',q:'阳朔 云歌酒店 遇龙河国家旅游度假区店 旧县村',price:'¥2,200 · 晚数待确认',desc:'携程地址：白沙镇旧县村，贵子农家菜馆西南方向60米处。酒店地图用店名搜索，未将码头坐标冒充酒店位置。',source:'https://hotels.ctrip.com/hotels/130236911.html'}
];
const foodGroups={
 nandan:[['南丹粉店候选',['海宝割肉煮粉','鼎罐屯','德大米粉','练记螺蛳粉','吴氏老字号']],['南丹夜宵候选',['回忆烧烤','阿秋夜市','阿娇烧烤','陈姐鸭把菜','食香风味馆']]],
 liuzhou:[['视频路线候选',['祥梅螺蛳粉','罗忆螺蛳粉','刘姐炒螺蛳粉','融安滤粉 青云市场','华记肠粉','鸿章牛杂','梁七牛杂','每日鲜早古味','张记玉米汁','喜旧咖啡屋','张飞木薯羹']],['柳北嗦粉候选',['谭家螺蛳粉','阿牛哥螺蛳粉','杨妹螺蛳粉','辣么香螺蛳粉','红升螺蛳粉','一起吃原汤螺蛳粉']],['桂中 / 市中心候选',['肥仔林螺蛳粉','阿云螺蛳粉']],['柳南 / 柳江候选',['小韦砂锅粉','小韦螺蛳粉','太龙鲜煮粉','小公园螺蛳粉','罗氏鸭脚轩','红宝石螺蛳粉']],['本地小众候选',['新翔小区停车场门口螺蛳粉','大桥停车场螺蛳粉','秋水螺蛳粉','好巧螺蛳粉','铭哥螺蛳粉','车辆厂梁姐螺蛳粉','友来米粉','青云瘦子米粉']],['小吃 / 正餐候选',['何姐卷粉 弯塘路小学','阿亮卷粉','云岭58冰','羊角山酸奶','木薯一哥','黄氏大排档','一轩小火锅']],['茶麸洗头候选',['喔发屋茶麸洗头','巷语洗发','保利大江郡宫廷头疗茶麸洗发','壮瑶家族茶麸洗发']]]
};
function stop(time,name,type,desc,extra={}){return{time,name,type,desc,...extra};}
const DAYS=[
 {id:1,date:'10/1 周四',city:'南丹',title:'一路向广西，晚上逛南丹',sub:'深圳 / 广州 / 南宁 / 南丹 · 第一天以抵达为主',food:'nandan',route:['nanning','nandan'],notes:['出发路线和南宁接驳待确认。河池西未买到票的那一段，不能按已购车票执行。'],stops:[
 stop('06:17—10:45','深圳北出发，经广州到南宁东','交通','正文：06:17—06:58深圳北至广州南；07:56—10:45广州南至南宁东。',{q:'深圳北站',pending:'出发车次待确认',detail:'筹划另有06:52—10:39深圳北直达南宁东的版本。原计划价格¥149 + ¥800；是否两人合计请核对。'}),
 stop('10:45以后','南宁接驳，前往南丹','交通','按实际接驳方式出发。若仅有约两小时空档，在站附近吃饭更方便。',{poi:'nanning',pending:'河池段未买到票',detail:'原计划12:41—14:05南宁东至河池西，正文写未买到票。替代：12:00大巴，车程约4.5小时、¥200；去大巴站另约30分钟、¥20。顺风车约3小时、¥330。以上均为文档估算，堵车另计。'}),
 stop('下午 / 傍晚','到南丹，入住锡福假日酒店','住宿','先放行李、休息，再决定吃饭和散步。',{q:hotels[0].q,price:'原计划 ¥280',detail:'县城在地图中只标区域中心；酒店请点击店名导航核对。'}),
 stop('晚上','南丹小吃与夜宵','吃喝','粉店、烧烤、鸭把菜按当天胃口挑选，清单在下面。',{q:'南丹 阿秋夜市',detail:'原文想从10家店挑5家，覆盖10/1晚、10/2早与晚。这里只保留候选，不把每家都排成必须打卡。'})]},
 {id:2,date:'10/2 周五',city:'丹炉山',title:'越野摩托、峡道飞车、外丹线',sub:'南丹县城 / 三岔河越野基地 / 丹炉山 / 柳州',food:'nandan',route:['nandan','danlu'],notes:['暂按正文“10/2晚去柳州”展示，出发时刻与住宿仍待核对。三岔河基地入口未核实，用店名搜索。'],stops:[
 stop('08:00','起床、早餐，寄存行李','准备','原计划早上出门将行李寄存在酒店，游玩后回酒店取。',{q:hotels[0].q}),
 stop('09:00—10:30','三岔河越野摩托','景点','原计划从县城坐车约36分钟；体验后前往丹炉山。',{q:'南丹 三岔河越野基地',price:'原计划双人 ¥268',pending:'入口与包车待确认',detail:'原文基地至丹炉山约32km / 44分钟。包车路线：南丹县城—三岔河基地—丹炉山—南丹县城；筹划报价¥300，需核对是否覆盖全部路段。'}),
 stop('12:00','到丹炉山，午餐','吃喝','原文写凭飞车门票可免费吃粉，现场权益需核对。',{poi:'danlu'}),
 stop('12:30—13:00','峡道飞车','景点','原计划体验约10分钟，午餐后安排。',{poi:'danlu',price:'¥68 / 人 · 两人 ¥136',pending:'开放与票务待确认',detail:'文档写09:00—17:00可体验，未核实国庆当天营业安排。'}),
 stop('13:00—16:00','外丹线','景点','玻璃栈道、7D玻璃吊桥、溶洞、七彩滑道、炼丹遗址。原文已选外丹线。',{poi:'danlu',pending:'套票价格待确认',detail:'原文预计约3小时。票价出现美团双人¥303、闲鱼¥188，预算又写¥288。溪降已被放弃，不加入当天主路线。'}),
 stop('17:00左右','回南丹，取行李、吃饭','休息','原计划景区回酒店约38km / 57分钟，给晚间接驳留余量。',{q:hotels[0].q}),
 stop('20:00—23:00 · 暂定','南丹顺风车到柳州','交通','按正文版本晚间出发，入住南天大酒店。',{q:hotels[1].q,price:'顺风车约 ¥220—235 · 住宿 ¥368',pending:'日期与时间待确认',detail:'其他段落写18:00出发，筹划写10/3早07:15出发。请按实际约车和酒店订单统一。'})]},
 {id:3,date:'10/3 周六',city:'柳州',title:'留一天给柳州的吃喝',sub:'谷埠 / 青云 / 市中心 · 晚间动车去桂林',food:'liuzhou',route:['gubu','qingyun','liuzhou'],notes:['店名来自你们的清单，未完成大众点评 / 小红书实测调研。分店、营业、排队需临出发核对；不为每家店编造地址。'],stops:[
 stop('07:00以后','谷埠市场，早餐嗦粉','吃喝','按原计划早起，从市场早餐开始；两个人可以少量分着尝。',{poi:'gubu',detail:'想吃主线：螺蛳粉、酸嘢、豆花、糯米饭、卷粉、鸭脚煲、炒螺蛳粉、牛杂。下面保留完整候选店清单。'}),
 stop('上午 / 中午','青云市场与市中心小吃','吃喝','卷粉、糯米饭、豆花、木薯羹等按胃口选，顺路走。',{poi:'qingyun',detail:'融安滤粉原文标记“找不到”，保留为搜索候选，尚未定位具体店铺。'}),
 stop('下午','咖啡、休息，或茶麸洗头','休息','想体验茶麸洗头：喔发屋、巷语洗发等作为候选。',{q:'柳州 巷语洗发',detail:'其他候选：保利大江郡宫廷头疗茶麸洗发、壮瑶家族茶麸洗发。预约和营业时间未确认。'}),
 stop('晚餐','给鸭脚煲或炒螺蛳粉留肚子','吃喝','用晚餐收尾，之后取行李去柳州站。',{q:'柳州 鸭脚煲',detail:'原文另列黄氏大排档、一轩小火锅；不默认需要跑完所有候选。'}),
 stop('晚间 · 车次待确认','柳州站乘动车去桂林','交通','文档有21:14、21:59及约22:00三版，按实际车票安排行程。',{poi:'liuzhou',price:'原计划 ¥96',pending:'车次待确认',detail:'筹划D8470为21:59—22:59；交通汇总21:14—22:14。此处均仅转录计划，未验证实际时刻与余票。'}),
 stop('到站以后','入住桂林维纳斯皇家酒店','住宿','酒店在象鼻山附近，方便第二天去景区和码头。',{q:hotels[2].q,price:'原计划 ¥508',pending:'酒店分店待确认'})]},
 {id:4,date:'10/4 周日',city:'桂林 / 阳朔',title:'坐漓江游船，进入阳朔慢节奏',sub:'象鼻山 / 竹江码头 / 阳朔 / 旧县',route:['elephant','zhujiang','jiuxian'],notes:['游船时间未锁定。象鼻山是否能按07:00入园尚未核实；请先核对船票与入园时段，赶船时可放弃早间逛景区。'],stops:[
 stop('06:30—08:00 · 暂定','早餐，简单逛象鼻山','景点','原计划07:00—08:00游览，优先保证后续游船时间。',{poi:'elephant',pending:'早间入园时段待确认'}),
 stop('08:10—08:50 · 暂定','回酒店取行李，去竹江码头','交通','原文估算24km / 37分钟，国庆车程需留余量。',{poi:'zhujiang',detail:'开船有09:00 / 09:30 / 10:20三种记录。最终倒推酒店出发时间时，以船票的检票截止要求为准。'}),
 stop('上午—下午','漓江四星游船','景点','竹江码头登船，沿漓江前往阳朔龙头山码头。',{poi:'zhujiang',price:'原计划 ¥720 · 人数口径待核对',pending:'开船时间待确认',source:'https://www.liriver.com.cn/page/article/zxlj.jqdt/130',detail:'原计划09:30—14:00，重点上甲板看景。地图连接线不是游船航迹；到达时间依实际班次与航行情况变化。',reserve:'https://www.liriver.com.cn/'}),
 stop('到达阳朔后','龙头山码头下船','交通','取好行李，再叫车前往旧县村的酒店。',{q:'阳朔 龙头山码头'}),
 stop('下船以后','入住云歌酒店，午睡休息','住宿','酒店位于旧县村。抵达后先休息，不再叠加硬性项目。',{q:hotels[3].q,pending:'两晚 / 三晚待确认',detail:'原文14:30—16:00午睡只是参考。页面不将酒店强行标到县城或码头。'}),
 stop('16:00以后','遇龙河附近散步','景点','从酒店附近开始，走累就回去。原文标黄，保留为弹性安排。',{poi:'jiuxian',pending:'下午安排待定'}),
 stop('晚上 · 可选','西街，或酒店附近吃饭','吃喝','想热闹就去西街；不想挤就在旧县附近解决。',{poi:'west',alt:true})]},
 {id:5,date:'10/5 周一',city:'阳朔',title:'竹筏看山水，傍晚骑行',sub:'金龙桥 / 旧县 / 双流义渡 / 十里画廊 / 工农桥',route:['jinlong','jiuxian','shuangliu','gongnong'],notes:['原计划10/4晚上20:00预约10/5竹筏，放票规则与余票未验证。电动车租赁点、归还时间和返程路线需当天核对。'],stops:[
 stop('06:00—08:00','化妆、早餐，去金龙桥','准备','按原计划早起，打车前往金龙桥码头。',{poi:'jinlong'}),
 stop('08:00—09:30 · 暂定','遇龙河竹筏：金龙桥到旧县','景点','结束后找咖啡店休息，或回酒店。',{poi:'jinlong',price:'原计划双人 ¥320',pending:'预约时段待确认',reserve:'https://www.ysylh.cn/',source:'https://www.ysylh.cn/matou/2025/jinglongqiaoView.shtml',detail:'入口按钮为景区官网，不表示已预约。金龙桥到旧县为原计划线路，实际以购票页面和现场要求为准。'}),
 stop('09:30以后','旧县，咖啡与休息','休息','竹筏下船后不赶下一项，保留空档。',{poi:'jiuxian'}),
 stop('13:00—15:00','回酒店午睡','休息','下午再租电动车，避开整天连续游玩。',{q:hotels[3].q}),
 stop('15:20以后','租电动车，沿遇龙河骑行','景点','原计划：骥马村—遇龙河—双流义渡—十里画廊—工农桥。',{poi:'shuangliu',pending:'实际骑行道路待确认',detail:'酒店位于旧县村，原计划骑行起点却写骥马村；请结合租车点和实际位置决定从哪开始。地图仅展示已核实点位，未画可骑行道路。'}),
 stop('18:00左右','工农桥看晚霞','景点','天气合适就停一会儿；日落时刻与当天云量未核实。',{poi:'gongnong'}),
 stop('晚上 · 可选','西街吃饭，随便逛','吃喝','如果累了，改在酒店附近吃饭也可以。',{poi:'west',alt:true})]},
 {id:6,date:'10/6 周二',city:'阳朔',title:'今天不赶路，想停就停',sub:'富里桥 / 遇龙河 / 泳池 / 咖啡 · 自由组合',route:['fuli','jiuxian'],stops:[
 stop('08:30—09:30','睡到自然醒，早餐 / 早午餐','休息','按原计划晚一点起床。',{q:hotels[3].q}),
 stop('上午 · 二选一','富里桥看看山水','景点','如果想出门，去富里桥散步、拍照。',{poi:'fuli',alt:true}),
 stop('上午 · 二选一','继续沿遇龙河骑行','景点','哪里舒服就停哪里，不安排硬性打卡。',{poi:'jiuxian',alt:true}),
 stop('中午 / 下午','酒店泳池、咖啡、午睡','休息','把时间留给休息，泳池开放以酒店当天安排为准。',{q:hotels[3].q}),
 stop('16:00以后 · 随状态','遇龙河散步，或县城吃饭','吃喝','西街、咖啡店、拍照、酒店休息都可以，不必全部做。',{poi:'west',alt:true})]},
 {id:7,date:'10/7 周三',city:'回深圳',title:'收好行李，轻松回家',sub:'云歌酒店 / 阳朔站 / 深圳北 · 按车票倒推',route:['jiuxian','station'],notes:['暂按正文G3741 10:20—13:23展示，未经实际车票确认。阳朔站在兴坪一带，不能当成阳朔县城内的车站。'],stops:[
 stop('07:00—08:00 · 暂定','起床、早餐、退房','准备','核对身份证、随身物品，再检查房间。',{q:hotels[3].q}),
 stop('08:10—09:20 · 暂定','从酒店前往阳朔站','交通','原计划08:10—08:20出发，09:20前抵达。按实际车票和实时路况调整。',{poi:'station',pending:'送站时间待确认'}),
 stop('10:20—13:23 · 暂定','G3741：阳朔到深圳北','交通','主日程沿用正文版本，实际以已购车票为准。',{q:'深圳北站',price:'原计划 ¥531 · 人数口径待核对',pending:'返程车次待确认',detail:'筹划另列G2929 11:25—14:04，交通汇总另有03:45—06:15。不要根据此页面的暂定时间直接出发。',reserve:'https://www.12306.cn/'})]}
];
const TYPE={交通:'交通',住宿:'住宿',景点:'景点',吃喝:'吃喝',休息:'休息',准备:'准备'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const query=s=>encodeURIComponent(s);
const searchMap=s=>'https://uri.amap.com/search?keyword='+query(s)+'&callnative=1';
function gcjToWgs(lat,lng){
 const pi=Math.PI,a=6378245,ee=.006693421622965943;
 function tlat(x,y){let r=-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;r+=(20*Math.sin(y*pi)+40*Math.sin(y/3*pi))*2/3;r+=(160*Math.sin(y/12*pi)+320*Math.sin(y*pi/30))*2/3;return r;}
 function tlng(x,y){let r=300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3;r+=(20*Math.sin(x*pi)+40*Math.sin(x/3*pi))*2/3;r+=(150*Math.sin(x/12*pi)+300*Math.sin(x/30*pi))*2/3;return r;}
 let dlat=tlat(lng-105,lat-35),dlng=tlng(lng-105,lat-35),rad=lat/180*pi,magic=1-ee*Math.sin(rad)**2,sq=Math.sqrt(magic);dlat=dlat*180/((a*(1-ee))/(magic*sq)*pi);dlng=dlng*180/(a/sq*Math.cos(rad)*pi);return[lat-dlat,lng-dlng];
}
for(const p of Object.values(POIS))p.coords=p.wgs||gcjToWgs(...p.gcj);
let map=null,layer=null,currentDay=0,userMarker=null,toastTimer;
const content=document.getElementById('content'),tabs=document.getElementById('day-tabs');
const tabsData=[{id:0,date:'全程总览',city:'七天路线'},...DAYS];
for(const d of tabsData){const b=document.createElement('button');b.type='button';b.id='tab-'+d.id;b.dataset.day=d.id;b.setAttribute('role','tab');b.setAttribute('aria-controls','content');b.innerHTML=esc(d.date)+'<span>'+esc(d.city)+'</span>';b.addEventListener('click',()=>go(d.id));tabs.append(b);}
tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?7:(currentDay+(e.key==='ArrowRight'?1:7))%8;go(next);document.getElementById('tab-'+next).focus();});
function sources(){return '<div class="sources">依据：你上传的《国庆计划 · 语雀.pdf》。时间、价格与预约状态均按原文整理，未视为已下单。<br><a href="https://www.liriver.com.cn/page/article/zxlj.jqdt/130" target="_blank" rel="noopener">漓江景区码头说明</a><a href="https://www.ysylh.cn/matou/2025/jinglongqiaoView.shtml" target="_blank" rel="noopener">遇龙河线路</a><a href="https://hotels.ctrip.com/hotels/130236911.html" target="_blank" rel="noopener">云歌酒店地址</a><br>点位参考高德地图 / OpenStreetMap，部分地点用店名搜索。<br>照片：<a href="https://commons.wikimedia.org/wiki/File:Yangshuo_Yulong_River.JPG" target="_blank" rel="noopener">Kebailan / Wikimedia Commons · CC0</a></div>';}
function overview(){return '<img class="photo" src="yulong-river.jpg" alt="阳朔遇龙河畔的喀斯特山峰与河流" width="1600" height="1200"><h2 class="overview-title">先玩尽兴，再慢下来</h2><p class="overview-sub">南丹玩项目，柳州吃一天，最后把时间留给阳朔。</p><div class="stats"><div class="stat"><small>行程</small><strong>7天 / 6晚</strong></div><div class="stat"><small>人数</small><strong>2人</strong></div><div class="stat"><small>原计划总预算</small><strong>¥10,650起</strong></div><div class="stat"><small>信息状态</small><strong>7项待核对</strong></div></div><h3 class="section-title">每天去哪</h3>'+DAYS.map(d=>'<button class="overview-day" data-go="'+d.id+'"><span class="date">10/'+d.id+'</span><span><b>'+esc(d.city)+'</b><small>'+esc(d.title)+'</small></span></button>').join('')+'<h3 class="section-title">出发前核对 <small>避免按旧版本出发</small></h3>'+conflicts.map(([a,b])=>'<div class="warning"><b>'+esc(a)+'</b><p>'+esc(b)+'</p></div>').join('')+'<h3 class="section-title">住宿安排</h3>'+hotels.map(h=>'<div class="hotel"><small>'+esc(h.date)+'</small><h3>'+esc(h.name)+'</h3><p>'+esc(h.desc)+'</p><b>'+esc(h.price)+'</b><div class="actions"><a class="primary" href="'+searchMap(h.q)+'" target="_blank" rel="noopener">酒店导航</a>'+(h.source?'<a href="'+h.source+'" target="_blank" rel="noopener">查看地址</a>':'')+'</div></div>').join('')+'<h3 class="section-title">两人预算</h3><div class="budget"><table><thead><tr><th>项目</th><th>原计划金额</th></tr></thead><tbody>'+[['长途交通','¥1,900—2,200'],['包车 / 打车','¥1,100—1,500'],['6晚住宿','¥3,500—4,800'],['景点娱乐','¥1,750—2,150'],['吃喝','¥1,800—2,500'],['电动车 / 零碎','¥600—900'],['合计','¥10,650—14,050']].map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')+'</tbody></table></div><p class="budget-note">原文建议准备¥12,300—12,700。另一组分项记录：住宿¥3,356 + 交通¥2,988 + 景点¥1,012 = ¥7,356，未含完整吃喝与零碎，也未确认全部费用。两组预算口径不同，不重复相加。</p>'+sources();}
function card(s,i,d){const p=POIS[s.poi],q=s.q||(p&&!p.area?p.name+' '+(d.city.includes('柳州')?'柳州':d.city.includes('丹')?'南丹':'桂林 阳朔'):s.name+' '+d.city);return '<article class="stop '+(s.alt?'alt':'')+'"><div class="stop-top"><span class="time">'+esc(s.time)+'</span><span class="type">'+esc(s.type)+'</span></div><h3>'+esc(s.name)+'</h3><p>'+esc(s.desc)+'</p>'+(s.price?'<div class="price">'+esc(s.price)+'</div>':'')+(s.pending?'<span class="pending">'+esc(s.pending)+'</span>':'')+'<div class="actions"><button class="primary" data-nav="'+i+'">导航</button>'+(p?'<button data-point="'+s.poi+'">地图定位</button>':'')+((s.type==='吃喝'||s.type==='景点')?'<a href="https://www.xiaohongshu.com/search_result?keyword='+query(q)+'" target="_blank" rel="noopener">小红书</a>':'')+(s.type==='吃喝'?'<a href="https://m.dianping.com/searchshop?keyword='+query(q)+'" target="_blank" rel="noopener">大众点评</a>':'')+(s.reserve?'<a href="'+s.reserve+'" target="_blank" rel="noopener">'+(s.name.includes('G3741')?'12306':'景区官网')+'</a>':'')+'</div>'+(s.detail||s.source?'<details><summary>更多安排</summary><div class="detail-body">'+esc(s.detail||'')+(s.source?'<br><a href="'+s.source+'" target="_blank" rel="noopener">地点 / 线路依据</a>':'')+'</div></details>':'')+'</article>';}
function food(group,city){if(!group)return '';return '<h3 class="section-title">吃喝与体验候选</h3><p class="budget-note">全部来自原计划；以下是搜索入口，分店位置与营业状态尚未逐店确认。</p>'+foodGroups[group].map(([title,names])=>'<details class="candidate-group"><summary>'+esc(title)+' · '+names.length+'家</summary><div class="candidate-list">'+names.map(n=>'<div class="candidate"><span>'+esc(n)+'</span><a href="'+searchMap(city+' '+n)+'" target="_blank" rel="noopener">搜索地点</a></div>').join('')+'</div></details>').join('');}
function renderDay(d){const primary=d.stops.map((s,i)=>({s,i})).filter(x=>!x.s.alt),alt=d.stops.map((s,i)=>({s,i})).filter(x=>x.s.alt);return '<div class="day-title"><div class="day-number">DAY '+d.id+' · '+esc(d.date)+'</div><h2>'+esc(d.title)+'</h2><p>'+esc(d.sub)+'</p></div>'+(d.notes||[]).map(n=>'<div class="warning">'+esc(n)+'</div>').join('')+'<div class="timeline">'+primary.map(x=>card(x.s,x.i,d)).join('')+'</div>'+(alt.length?'<h3 class="section-title">弹性安排 <small>按天气与体力选择</small></h3><div class="timeline">'+alt.map(x=>card(x.s,x.i,d)).join('')+'</div>':'')+food(d.food,d.food==='nandan'?'南丹':'柳州')+sources();}
function go(id){currentDay=id;for(const b of tabs.children){const active=Number(b.dataset.day)===id;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;}content.setAttribute('aria-labelledby','tab-'+id);content.innerHTML=id?renderDay(DAYS[id-1]):overview();document.getElementById('map-label').textContent=id?DAYS[id-1].city+' · 当天地点':'广西全程 · 地点示意';renderMap();if(innerWidth<900)window.scrollTo({top:0,behavior:'instant'});}
function toast(msg){const e=document.getElementById('map-message');e.textContent=msg;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),6500);}
function renderMap(){if(!map)return;layer.clearLayers();const keys=currentDay?DAYS[currentDay-1].route:['nandan','danlu','gubu','elephant','jiuxian'];const pts=[];keys.forEach((key,i)=>{const p=POIS[key];if(!p)return;pts.push(p.coords);const icon=L.divIcon({className:'',html:'<div class="pin">'+(i+1)+'</div>',iconSize:[30,30],iconAnchor:[15,15]});L.marker(p.coords,{icon}).addTo(layer).bindPopup('<b>'+esc(p.name)+'</b><br><a href="'+(p.area?searchMap('南丹县'):p.source)+'" target="_blank" rel="noopener">查看地点</a>');});if(pts.length>1&&currentDay!==6)L.polyline(pts,{color:'#08719d',weight:3,opacity:.7,dashArray:'7 8'}).addTo(layer);const extras=currentDay?DAYS[currentDay-1].stops.filter(s=>s.alt&&s.poi&&!keys.includes(s.poi)):[];for(const s of extras){const p=POIS[s.poi];pts.push(p.coords);L.marker(p.coords,{icon:L.divIcon({className:'',html:'<div class="pin alt">备</div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(layer).bindPopup('<b>'+esc(p.name)+'</b><br>弹性安排');}if(pts.length)map.fitBounds(pts,{padding:[42,48],maxZoom:13});}
function showPoint(key){const p=POIS[key];if(!map){toast('地图尚未加载，请直接使用导航按钮。');return;}map.setView(p.coords,15);L.popup().setLatLng(p.coords).setContent('<b>'+esc(p.name)+'</b><br><a href="'+p.source+'" target="_blank" rel="noopener">查看地点</a>').openOn(map);if(innerWidth<900)document.querySelector('.map-column').scrollIntoView({behavior:'smooth',block:'start'});}
function openNav(s){const p=POIS[s.poi],d=DAYS[currentDay-1],q=s.q||(p?p.name+' '+(d.city==='柳州'?'柳州':s.poi==='nanning'?'南宁':'广西'):s.name+' '+d.city);document.getElementById('nav-title').textContent=s.name;const amap=p&&!p.area&&p.gcj?'https://uri.amap.com/marker?position='+p.gcj[1]+','+p.gcj[0]+'&name='+query(p.name)+'&coordinate=gaode&callnative=1':searchMap(q);document.getElementById('nav-links').innerHTML='<a class="nav-option" href="'+amap+'" target="_blank" rel="noopener">高德地图</a><a class="nav-option" href="https://maps.apple.com/?q='+query(q)+'" target="_blank" rel="noopener">Apple Maps</a><a class="nav-option" href="https://www.google.com/maps/search/?api=1&query='+query(q)+'" target="_blank" rel="noopener">Google Maps</a><p class="budget-note">'+(p&&!p.area?'请在地图应用中核对具体入口并选择路线。':'以名称搜索，请核对分店与地址再出发。')+'</p>';document.getElementById('nav-dialog').showModal();}
content.addEventListener('click',e=>{const g=e.target.closest('[data-go]'),n=e.target.closest('[data-nav]'),p=e.target.closest('[data-point]');if(g)go(Number(g.dataset.go));if(n)openNav(DAYS[currentDay-1].stops[Number(n.dataset.nav)]);if(p)showPoint(p.dataset.point);});
document.querySelector('.close-dialog').addEventListener('click',()=>document.getElementById('nav-dialog').close());
document.getElementById('nav-dialog').addEventListener('click',e=>{if(e.target.id==='nav-dialog'){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
document.getElementById('fit-map').addEventListener('click',()=>{if(map)renderMap();else toast('地图尚未加载。行程导航仍可使用。');});
document.getElementById('locate').addEventListener('click',()=>{if(!map){toast('地图尚未加载。');return;}if(!navigator.geolocation){toast('当前浏览器不支持定位，请使用导航入口。');return;}navigator.geolocation.getCurrentPosition(p=>{const ll=[p.coords.latitude,p.coords.longitude];if(userMarker)userMarker.setLatLng(ll);else userMarker=L.circleMarker(ll,{radius:8,color:'#fff',weight:3,fillColor:'#1686f0',fillOpacity:1}).addTo(map);map.setView(ll,15);toast('已定位当前位置。');},()=>toast('未能获取位置，请允许浏览器定位，或直接使用导航入口。'),{enableHighAccuracy:true,timeout:12000});});
const BASEMAPS=[
 {name:'标准地图',url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',options:{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}},
 {name:'地形地图',url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',options:{maxZoom:19,maxNativeZoom:17,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM · © <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}}
];
let basemap=null,basemapIndex=-1,basemapTimer;
const failedBasemaps=new Set();
function setBasemap(index,automatic=false){
 if(!map)return;
 if(!automatic)failedBasemaps.clear();
 clearTimeout(basemapTimer);
 if(basemap)map.removeLayer(basemap);
 basemapIndex=index;
 const source=BASEMAPS[index],tiles=L.tileLayer(source.url,source.options);
 basemap=tiles;
 let loaded=0,errors=0,switched=false;
 const button=document.getElementById('switch-map');
 button.title='当前底图：'+source.name+'；点击切换';
 button.setAttribute('aria-label',button.title);
 function fallback(){
  if(basemap!==tiles||switched)return;
  switched=true;
  clearTimeout(basemapTimer);
  failedBasemaps.add(index);
  const next=BASEMAPS.findIndex((_,i)=>!failedBasemaps.has(i));
  if(next>=0){toast('正在尝试备用底图…');setBasemap(next,true);}
  else toast('底图暂时无法连接。可以点击“切换底图”重试，或使用行程中的导航。');
 }
 tiles.on('tileload',()=>{
  if(basemap!==tiles)return;
  loaded++;
  clearTimeout(basemapTimer);
  document.querySelector('.map-fallback').hidden=true;
 }).on('tileerror',()=>{if(++errors>=3&&!loaded)fallback();});
 basemapTimer=setTimeout(()=>{if(!loaded)fallback();},12000);
 tiles.addTo(map);
}
document.getElementById('switch-map').addEventListener('click',()=>{if(map)setBasemap((basemapIndex+1)%BASEMAPS.length);else toast('地图尚未加载。行程导航仍可使用。');});
if(typeof L!=='undefined'){
 map=L.map('map',{zoomControl:false,attributionControl:true}).setView([24.8,109.4],7);
 L.control.zoom({position:'bottomright'}).addTo(map);
 layer=L.layerGroup().addTo(map);
 setBasemap(0);
}else{document.querySelector('.map-fallback p').textContent='地图加载失败。请使用行程卡片中的导航入口。';document.getElementById('map').style.display='none';}
go(0);
