/* 
map 按住alt 选中的目标区域 数据 用于修改 
地图编辑器 左侧和下侧 后添加, 用于编辑操控 Alt 选中区域的数据
*/
(function(){
var game_area=document.getElementById('game_area'); //map编辑区总面板
var str="<div class='map_list'><div class='map_lx'>地表</div><div class='map_lb_sj'><div class='map_id_xz' e-for='map'><eng e-event='onclick:list_dj' e-attr='index=$_index' lx=0><span>{{lx}}</span><span>- id</span><span>{{id}}</span></eng></div></div><div class='map_lx'>实体</div><div class='map_lb_sj'><div class='map_id_xz' e-for='solid'><eng e-event='onclick:list_dj' e-attr='index=$_index' lx=1><span>{{lx}}</span><span>- id</span><span>{{id}}</span></eng></div></div><div class='map_lx'>音频</div><div class='map_lb_sj'><div class='map_id_xz' e-for='audio'><eng e-event='onclick:list_dj' e-attr='index=$_index' lx=2><span>{{lx}}</span><span>- id</span><span>{{id}}</span></eng></div></div></div>";
var list=cjDom(str); //创建map 左侧列表区
    str=null;
    game_area.appendChild(list);

var map_bjq=G_cz.fun.map_bjq;//     
var app0=new Eng({
      el:list,
      data:{
            map:[], //lx=>0:图,1:切换动画,2:过渡动画 
            solid:[],//{lx:单图/动画,id:x}
            audio:[],//{lx:音源,id:x}  // 暂无 lx=>0:场景音源, 1:背景音乐
      },
      watcher:{
            
      },
      event:{
            //0:map,1:solid,2:yp
            list_dj:function(){
                  var t=this,g=t.$_gData,n=t.getAttribute('lx')<<0,i=t.getAttribute('index')<<0,d=t.$_data,a,b,c;
                      gFun.list_xz(n,i,d.lx);
            },
      },

});
var str="<div class='m_l_opt_area'><div class='m_l_opt' style='display:none;' e-base='img'><span>类型:</span><input type='text' disabled style='width:80px' e-change='lx'><span>id:</span><input type='text' disabled e-change='id'><span>楼层:</span><input type='text' e-change='f' e-event='onfocus:no_defocus'><span>宽:</span><input type='text' e-change='w' disabled><button e-event='onclick:wh_xg' style='width:20px;' a=0,>+</button><button e-event='onclick:wh_xg' style='width:20px;' a=1>-</button><span>高:</span><input type='text' e-change='h' disabled><button e-event='onclick:wh_xg' style='width:20px;' a=2>+</button><button e-event='onclick:wh_xg' style='width:20px;' a=3>-</button><span>X:</span><input type='text' e-change='x' disabled><span>Y:</span><input type='text' e-change='y' disabled><div style='height:6px;clear: both;'></div><button style='margin-left:132px;' e-event='onclick:move' m=0>左移</button><button e-event='onclick:move' m=1>右移</button><button e-event='onclick:move' m=2>上移</button><button e-event='onclick:move' m=3>下移</button><button class='m_ld_del' e-event='onclick:btn_del'>删除</button><button class='m_ld_up' e-event='onclick:btn_up'>上</button><button class='m_ld_down' e-event='onclick:btn_down'>下</button></div><div class='m_l_opt' style='display:none;' e-base='img_dh'><span>类型:</span><input type='text' disabled style='width:80px' e-change='lx'><span>id:</span><input type='text' disabled e-change='id'><span>楼层:</span><input type='text' e-change='f' e-event='onfocus:no_defocus'><span>帧数:</span><input type='text' style='width:30px;' e-change='fn' disabled><span>帧序/时:</span><input type='text' style='width:300px;font-size:12px;' e-change='fxj' e-id='dom_fxj' e-event='onfocus:no_defocus'><div style='height:1px;clear: both;'></div><span style='margin-left:136px;'>X:</span><input type='text' e-change='x' disabled><span>Y:</span><input type='text' e-change='y' disabled><div style='height:1px;clear: both;'></div><button style='margin-left:132px;' e-event='onclick:move' m=0>左移</button><button e-event='onclick:move' m=1>右移</button><button e-event='onclick:move' m=2>上移</button><button e-event='onclick:move' m=3>下移</button><button class='m_ld_del' e-event='onclick:btn_del'>删除</button><button class='m_ld_up' e-event='onclick:btn_up'>上</button><button class='m_ld_down' e-event='onclick:btn_down'>下</button></div><div class='m_l_opt' style='display:none;' e-base='yp'><span>类型:</span><input type='text' disabled style='width:80px' e-change='lx'><span>id:</span><input type='text' disabled e-change='id'><span>静默:</span><input type='checkbox' style='width:20px;' e-event='onclick:yp_check' yx=0 class='dom_yp_check'><span>范围:</span><input type='text' style='width:28px;' e-change='fw'><span>音量(0-100):</span><input type='text' style='width:28px;' e-change='yl'><span>循环:</span><input type='checkbox' style='width:20px;' e-event='onclick:yp_check' yx=1 class='dom_yp_check'><span>单次:</span><input type='checkbox' style='width:20px;' e-event='onclick:yp_check' yx=2 class='dom_yp_check'><button class='m_ld_del' e-event='onclick:btn_del'>删除</button></div></div>";
var optDom=cjDom(str);
var opt=optDom.getElementsByClassName('m_l_opt');// 0:单图 ,1:动画,2:音频
var check=opt[2].getElementsByClassName('dom_yp_check');//三个音频 checkbox  [静音, 循环,单次]
    str=null;
    game_area.appendChild(optDom);
    opt[2].style.display='block';

var app1=new Eng({
            el:optDom,
            data:{
                  t:0,//0:图片,1:切换动画,2:过渡动画 , 3:音频
                  //单图
                  img:{
                        lx:'',id:'',w:'',h:'',x:'',y:'',f:''  // 
                  },
                  //dh
                  img_dh:{
                        lx:'',id:'',f:'',fn:'',x:'',y:'',fxj:'' //fn:总帧数, fxj:帧序/时 格式=> n:time,n:time
                  },
                  //音频
                  audio:{
                        lx:'',id:'',fw:'',yl:'',jy:0,ms:0 // fw:范围,yl:音量(0-100) , jy=>0:否,1:是 ms=>0:单次,1:循环
                  }
            },
            watcher:{
                  //帧动画变更数据  切换动画:允许修改帧序/时  过渡动画:仅允许修改帧时
                  'img_dh.fxj':function(o,n,i,c){
                        var a,b,c,d,e,f=1,g,h,s=0,l,r,d1,d2,t; 
                              
                              if(reF===1){//手动修改  (只有切换动画才可以)
                                    t=i.$_gData.img_dh.lx==='切换动画'?1:0;   //1:切换动画,0:过渡动画
                                    r=/^\+?[1-9][0-9]*$/;//用于正则
                                    a=n.replace(/ /g,''); //去除空格
                                    // reF=0;//因为下面要在触发一次自动操作
                                    i.$_value=a;//这里
                                    a=a.split(','); //初次划分
                                    d1=[],d2=[]; //list , time
                                    l=a.length;
                                    h=i.$_gData.img_dh.fn;//总实际帧数
                                    if(t===0){//过渡
                                          d1=null;
                                          if(o.split(',').length!==l)l=0; //过渡动画,的时间长度必须等于原来的
                                    };     
                                    while(s<l){
                                          b=t===1?a[s].split(':'):a[s]; // 1:分割为[fpsN , time] 2:'time'
                                          if(t===1&&b.length===2){ //切换动画 修改(序:时,....)
                                                      //fpsN 帧序
                                                      c=b[0];
                                                      if(c==='0'||r.test(c)){
                                                            c=c<<0; 
                                                            if(c>=h)break;//超出帧长度
                                                            d1.push(c);

                                                      }else{
                                                            break;
                                                      };
                                                      //time 
                                                      c=b[1];
                                                      if(c==='0'||r.test(c)){
                                                            c=c<<0; 
                                                            if(c<0)break;//帧用时不能小于0
                                                            d2.push(c);
                                                      }else{
                                                            break;
                                                      };  
                                          }else if(t===0){//过渡动画 仅修改(时,时,....)
                                                      c=b; //time
                                                      if(c==='0'||r.test(c)){
                                                            c=c<<0; 
                                                            if(c<0)break;//帧用时不能小于0
                                                            d2.push(c);
                                                      }else{
                                                            break;
                                                      };  

                                          }else{//不合规的
                                                break;
                                          }; 
                                          s++;
                                          if(s===l)f=0;//正常执行到最后了
                                    };
                                    if(f===1){// 有数据格式错误
                                          tipFun('数据格式错误\r\r切换动画格式: 0:300,1:400,2:500 (帧序号:显示时间,...)\r备注: 帧序号从0开始小于总帧数\r\r过渡动画格式: 300,400,500 (时间,时间)\r备注: 过渡动画只能修改已有的对应显示时间,时间以逗号分隔,总长度必须等于原始长度',1);
                                          return;
                                    };
                                    // say(d1,d2);  //d1:[list],d2:[time]
                                    gFun.xg_dh_fps(d1,d2); //修改 切换动画

                              };
                   },
                  'audio.lx':function(o,n,i,c){},
                  //静音   0:非静音,1:静音
                  'audio.jy':function(o,n,i,c){
                        check[0].checked=n===0?false:true;
                  },
                  //模式 0:单次,1:循环
                  'audio.ms':function(o,n,i,c){
                        check[1].checked=n===1?true:false;
                        check[2].checked=n===0?true:false;
                  },
            },
            event:{
                  //防止小输入框输入导致 ,地图渲染暂停
                  no_defocus:function(){
                        map_bjq.bf_zt(2); //控制地图数据继续渲染    (0:不播放 ,1:暂停,2:播放)
                  },
                  //数据删除
                  btn_del:function(){
                        gFun.xg_sx_del(2);//删除
                        game_area.focus();
                  },
                  //数据上移 (同一个数据格内的自然顺序)
                  btn_up:function(){
                        gFun.xg_sx_del(1);//上移
                        game_area.focus();
                  },
                  //数据下移(同一个数据格内的自然顺序)
                  btn_down:function(){
                        gFun.xg_sx_del(0);//下移
                        game_area.focus();
                  },
                  //修改 单图 的宽高
                  wh_xg:function(){
                        var t=this,g=t.$_gData.img, n=t.getAttribute('a')<<0,a,b,c;
                        //n=> 0:w+,1:w-,2:h+,3:h-
                        gFun.xg_wh(n);//修改 单图宽高
                        game_area.focus();
                  },
                  //上下左右(0,1,2,3)移动操作对象(不允许超出 一个单map位)
                  move:function(e){
                  var t=this,g=t.$_gData, n=t.getAttribute('m')<<0,a,b,c;
                        gFun.xg_xy(n);
                        game_area.focus();
                  },
                  //音频 模式切换 或 静默选择
                  yp_check:function(){
                        var t=this,g=t.$_gData.audio,n=t.getAttribute('yx')<<0,a,b,c;
                        a=t.checked;
                        if(n===0){//是否静音
                              g.jy=a?1:0;
                        }else if(n===1){ //1:循环
                              g.ms=a?1:0;
                        }else{//2:单次
                              g.ms=a?0:1;
                        };
                  },
            },
});
var reF=0; //0:选中赋值 ,1:手动赋值 (针对 img_dh.fxj 属性,防止判断选中赋值)
var mapD=null ;// [ 0:map格所有数据 ,1:solid格所有数据 ,2:yp所有数据 ,3:编辑中的数据 ]  //储存当前地图的 选中格子的 数据 
var dT=null; //0:图片,1:动画,2:音频
var xzF=0;// 0:无选中修改对象,1:有
var gFun={
       //获取指定 位置 map  地表 和 实体位置的数据  (初始化  直接添加所有音源数据)
       map_xy:function(m,f){// [[mx,my],[sx,sy]]  f=1:直接使用mapD的数据
             var t=gFun,a=mapData,b,c,d,e,g,h,i,j,k,x,y,w,h,o;
                 if(f!==1){
                       mapD=[];
                       xzF=0;
                       reF=0;//自动赋值中
                 };     
                 //map ~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 if(f!==1){
                      b=m[0];
                      c=a[0];//map
                      d=c[b[1]][b[0]];
                      mapD[0]=d;
                 }else{
                      d=mapD[0]; 
                 };
                 i=0,l=d.length;
                 o=[];
                 while(i<l){
                       e=d[i];
                       w=e.length;
                       g=e[0];
                       if(w===1){//单图
                           //g=[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                              o.push({lx:'图片',id:g[0]});
                       }else if(w>1){//动画
                           //g=/[0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id]  
                              //0:lx=>0:单次,1:循环播放
                              //1:dh=>0:切换动画,1:过渡动画
                              //2:list=>[n,n,n,n] 帧序
                              //3:time=>[j,j,j,j] 帧时
                              //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
                              //6:id,
                              //7:gx
                              o.push({lx:g[1]?'过渡动画':'切换动画',id:g[6]});
                       };
                    i++;
                 };
                 app0.map=o;
                 //solid ~~~~~~~~~~~~~~~~~~~~~~~~~~
                 if(f!==1){
                        b=m[1];
                        c=a[1];//solid
                        d=c[b[1]][b[0]];
                        mapD[1]=d;
                 }else{
                       d=mapD[1];
                 };
                 i=0,l=d.length;
                 o=[];
                 while(i<l){
                       e=d[i];
                       w=e.length;
                       g=e[0];
                       if(w===1){//实体单图
                           //g=[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                              o.push({lx:'图片',id:g[0]});
                       }else if(w>1){//动画
                           //g=/[0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id]  
                              //0:lx=>0:单次,1:循环播放
                              //1:dh=>0:切换动画,1:过渡动画
                              //2:list=>[n,n,n,n] 帧序
                              //3:time=>[j,j,j,j] 帧时
                              //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
                              //6:id,
                              //7:gx
                              o.push({lx:g[1]?'过渡动画':'切换动画',id:g[6]});
                       };
                    i++;
                 };
                 app0.solid=o;
                 //音频 ~~~~~~~~~~~~~~~~~~~~~~~~~~
                 if(f!==1){

                 }else{

                 };

      },
      //选中列表时
      list_xz:function(n,i,s){ //n=>0:地表,1:实体,2:音频 ,i=>选中的index, ,s=>0:图片,1:切换动画,2:过渡动画 ,3:场景音源,4:背景音乐
          var t=this,a,b,c,d,e,f,g,h,l,j,k;
               if(s==='图片'){
                    t.opt_kg(0);
                    b=mapD[n][i];
                    a=b[0]; //对应数据  [0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                    app1.img={lx:s,id:a[0],w:a[4],h:a[5],f:a[9],x:a[2],y:a[3]};
                    mapD[3]=b;
                    dT=0;
                    map.matchDx(b);//通知标记选中目标
                    xzF=1;
               }else if(s==='切换动画'||s==='过渡动画'){
                  //   say('执行');  
                    f=s==='切换动画'?1:0;
                    t.opt_kg(1);
                    b=mapD[n][i];//选中数据
                    a=b[0]; //对应数据  [0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id]   信息帧,非fps
                    c=a[2],d=a[3]; //list , time
                    i=0,l=c.length;
                    e='';
                    while(i<l){
                          if(f===1){//fpsN:time,...
                              e+=c[i]+':'+d[i];
                          }else{ //time,time,time,
                              e+=d[i];    
                          }; 
                          i++;
                          if(i<l)e+=',';
                    };
                    reF=0;
                    app1.img_dh={lx:s,id:a[6],f:a[5],fn:l-1,fxj:e,x:0,y:0}; //这样的会触发两次 {} 一次,
                    reF=1;
                    mapD[3]=b;
                    dT=1;
                    map.matchDx(b);//通知标记选中目标
                    xzF=1;
               }else if(s==='场景音源'||s==='背景音乐'){
                     t.opt_kg(2);
               };
      },
      //修改 切换 动画 帧序
      xg_dh_fps:function(d1,d2){
           var a=mapD[3][0],b,c,d,e,f,g
               if(d1)a[2]=d1;
               a[3]=d2;
               a[4]=2; //重新初始化
      },
      //修改 选中目标的 x,y值 (移动)
      xg_xy:function(n){//0:左,1:右,2:上,3:下
            var a,b,c,d,s,e,f,g,h,i,j,k,l;
                a=mapD[3];
                if(dT===0){//img
                        a=a[0];//[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                        if(n<2){//x
                              a[2]+= n===0?-1:1;
                              app1.img.x=a[2];
                        }else{//y 2上 +1 因为从地平线向上计算
                              a[3]+=n===2?1:-1;  
                              app1.img.y=a[3];
                        };
                }else{//1 dh
                        //a=全dh数据
                        i=1,l=a.length;  //i=1 ,因为0索引记录了dh信息
                        while(i<l){
                              d=a[i];// 帧[d1,d2]
                              s=0,e=d.length;
                              while(s<e){
                                    g=d[s];// [0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy],
                                    if(n<2){//
                                          g[2]+= n===0?-1:1;
                                    }else{// 2上 +1 因为从地平线向上计算
                                          g[3]+=n===2?1:-1;  
                                    };
                              s++;  
                              };
                              i++;
                        };
                        if(n<2){//x
                             app1.img_dh.x+=n===0?-1:1;
                        }else{//y
                             app1.img_dh.y+=n===2?1:-1;   
                        };
                };
      },
      //修改 单图 的宽高
      xg_wh:function(n){ //n=> 0:w+,1:w-,2:h+,3:h-
            var a=app1.img,b,c,d,e,f,g,h,i,j,k,l;
                d=mapD[3][0];//[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]
                if(n<2){
                     a.w+=n===0?1:-1;
                     if(a.w<1)a.w=1; // 宽不允许小于1
                     d[4]=a.w;
                }else{
                        a.h+=n===2?1:-1;
                        if(a.h<1)a.w=1; // 高不允许小于1
                        d[5]=a.h;
                }; 
      },
      //修改顺序或删除 (针对 map 和 solid 里的单位格内自然顺序) 
      xg_sx_del:function(n){//n=>0:前移,1:上移,2:删除
          var t=this,a,b,c,d,e,f,g,i,l;
              a=mapD[dT]; //格内总数据  或 yp全部数据
              if(n<2){// 图/dh 位置移动
                  b=mapD[3];//当前数据
                  i=a.indexOf(b);//当前位置
                  if(i===-1)return; //不存在
                  l=a.length;//总长度
                  if(n===0){//下移  (因为层级降低)
                        if(i>0){//非置顶才可以上移
                              c=a[i-1];
                              a[i-1]=b;
                              a[i]=c;
                              t.map_xy(null,1);//重置列表
                        };   
                  }else{//1上移  (因为层级增加)
                        if(i<l-1){//非尾部才可以下移
                              c=a[i+1];
                              a[i+1]=b;
                              a[i]=c;
                              t.map_xy(null,1);//重置列表
                         }; 
                  }; 
              }else{//删除
                   b=mapD[3];//当前数据
                   a=mapD[dT];//总数据 
                   if(dT<2){//删除 图/dh
                        i=a.indexOf(b);//当前位置
                        if(i>-1){
                              a.splice(i,1);//删除
                              t.map_xy(null,1);//重置列表
                              t.opt_kg();//因删除 关闭属性面板
                        };  
                        xzF=0;    
                   }else{//删除音频

                   };
              };
      },
      //开关显示3个属性面板  0:图片,1:动画,2:音频
      opt_kg:function(n){
          var a=opt,i=0,l=3;
              xzF=0;
              while(i<l){
                 a[i].style.display=i===n?'block':'none';  
                 i++;
              }; 
      },
      //关闭  (关闭所有属性面板)  ~~~~~~~
      close:function(){
          var t=this;
              t.opt_kg();//关闭所有属性面板  
              mapD=null;
      },
};
G_cz.fun.map_xg_Fun=gFun;

(function(){
 var k={37:0,39:1,38:2,40:3};     
      // ESC 取消选中   
      window.addEventListener('keydown',function(e){
               if(xzF===0)return;//无选择目标
          var  a=e.keyCode,z,u;
               if(a===27){//取消选中数据
                     map.matchDx(null);//通知取消标记
                     gFun.opt_kg();//关闭选中面板
                     e.preventDefault();
                     e.stopPropagation();
               };
               //37:左,39:右,38:上,40:下
               z=k[a];
               if(z!==u){
                  gFun.xg_xy(z);
                  e.preventDefault();
                  e.stopPropagation();  
               };
      });
})();
})();