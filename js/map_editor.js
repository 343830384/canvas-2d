(function(){
//地图数组数据 行列 发生变化    
var mapBg=function(t,a,b,n){
// Array.prototype.mapBg=function(a,b,n){//a=>0,1:上或下追加一行 ;  2,3:左或右追加一列 , b:1:添加,0:删除 , n:添加的(行/列) 个数
    var c,d,e,f,g,i,l,u;
        if(n===u)n=1;//至少一个单位(行/列)
        if(b===1){//添加
             if(a<2){//添加行
                    l=t[0].length;//每行的列数
                    i=0,c=[];
                    while(i<l){
                        c[i]=[];
                        i++;
                    };
                    if(a===0){//添加到头
                        while(n--){
                            t.splice(0,0,reNew(c));
                        };
                    }else{//添加到尾
                            while(n--){
                                t.push(reNew(c));
                            };
                    };
                    c=null;
             }else{//添加列
                  l=t.length;//总行数 (每行的左右添加)
                  while(n--){
                        i=0;
                        while(i<l){
                            if(a===2){//2添加到左
                                t[i].splice(0,0,[]);
                            }else{//3添加到右
                                t[i].push([]);
                            };
                            i++;
                        };
                  };
             };
        }else{//删除
                if(a<2){//删除行
                        if(a===0){//删除头
                            while(n--){
                                 t.splice(0,1);
                            };
                        }else{//删除尾
                                while(n--){
                                    t.pop();
                                };
                        };
                        c=null;
                }else{//删除列
                    l=t.length;//总行数 (每行的左右添加)
                    while(n--){
                            i=0;
                            while(i<l){
                                if(a===3){//删除左
                                    t[i].splice(0,1);
                                }else{//删除右
                                    t[i].pop();
                                };
                                i++;
                            };
                    };
                };
        };
};
var BF=0; //0:不播放 ,1:暂停,2:播放
var DH=requestAnimationFrame;
var Dj=new Date().getTime();
var fps=0;
var Dh=function(){ //减少不必要的数据长度 
    var j=new Date().getTime()-Dj;
        fps++;
        if(fps===1){ //每秒 60/fps 帧
            fps=0;
            if(BF===2){//播放 (通知map绘制)
                map.draw(j);
            }else if(BF===1){//暂停 (通知map暂停 ) 同时修改 BF=0
                map.ztSJ(j);
            };
        };
     DH(Dh);  
}; 
DH(Dh);   
var qF=1;//允许ajax请求
var ajax=function(n,p,id,d){//n=> 0:读地图,1:存地图, p:数据路径 d:地图数据
        if(qF===0)return;//上个请求执行中,禁止请求
        if(n===1&&kF===0){
            tipFun('不符合规范的地图数据尺寸, 请检查 绘制单位 是否能够被整除',1);
             return;
        };
        qF=0;//请求中
        $_ajax({
            type:'post',
            dataType:'json',
            url:'?'+'map_cz',  
            data:{ 
                data:{
                    t:n,//0:读,1:存,2:删
                    pth:p,//数据路径
                    id:id,//mapId
                    d:d,  //map数据
                }
            },
            success:function(d){
                if(n===0){//d=mapData
                    GX=1;
                    gFun.newData(d);
                }else if(n===1){//存储成功
                    G_save();//存储一次 关于 G_cfg.map的修改
                }else{//2 删
                    G_save();//存储一次 关于 G_cfg.map的修改
                };
                qF=1;//请求完成
            },
            error:function(d){
                if(n===1)console.log('%c储存地图失败~','color:yellow');
                
                qF=1;//请求完成
            }
        });
};
var game_area=document.getElementById('game_area'); //map编辑区总面板
var game_main=document.getElementById('game_main'); //游戏程序窗口区
var canvas=game_main.getElementsByTagName('canvas');//[游戏层 , 特殊全屏天气层(浮在最上面的),楼层路径 , map格子层, 逻辑格子层 ]  L=5
var ctx=[];//
    ctx[0]=canvas[0].getContext('2d');//0游戏层
    ctx[1]=canvas[1].getContext('2d');//1覆盖天气层
    ctx[2]=canvas[1].getContext('2d');//2楼层路径标记层
    ctx[3]=canvas[2].getContext('2d');//3地图单位辅助层
    ctx[4]=canvas[3].getContext('2d');//4逻辑单位辅助层
var fzK=[]; //0 :地图单位辅助框, 1:逻辑单位辅助框
    fzK[0]=new Image();//
    fzK[1]=new Image();
    fzK[2]=new Image();
    fzK[3]=new Image();
    fzK[0].src='../img/辅助图/0.png';
    fzK[1].src='../img/辅助图/1.png';
    fzK[2].src='../img/辅助图/2.png';
    fzK[3].src='../img/辅助图/3.png';
var mF=1,sF=1; //地图辅助显示(1显0关) ; 逻辑辅助显示(1显,0关) ; 

var openF=0;//作用区域是否生效 1:生效,0:失效
var apItem;
var kF=0; //1:允许存地图 (符合整除关系) 0:不符合存储条件
mapData=null;// 当前地图数据  [0:map,1:solid,2:[floor障碍],3:[zw,zh,w,h,mw,mh,sw,sh]]
var GX=0; //0:新地图需要生产数据, 1:已有地图,无需更新初始化新图数据
var showF=1; //默认编辑 楼层1
var gFun={
     st:null,// setTimeOut 延迟计时器, 防止高频无意义计算
     //外部控制 调用播放
     bf_zt:function(n){//0:不播放 ,1:暂停,2:播放
        BF=n
     },
     //当展开项目时生成的 map网格 和 逻辑网格 视图
     init:function(){
         var t=this;
              kF=0;
             clearTimeout(t.st);
             //防止高频无意义计算
             t.st=setTimeout(function(){
                var a=app.map_cfg,w,h,mw,mh;
                    w=a.w,h=a.h;//内容窗宽高
                    mw=a.mw,mh=a.mh;//地图单位宽高
                    if(w%mw===0&&h%mh===0){ //地图单位可被整除
                         w=a.sw,h=a.sh; //逻辑单位宽高
                         if(mw%w===0&&mh%h===0){//逻辑单位可被整除
                              t.mapInit();//调整界面以及绘制
                              kF=1;//符合 
                         };
                    };

             },150);
     },
     //地图列表数据初始化
     list_init:function(){
         var a=G_cfg.map,b,c,d=[],e,i=0,l,u;
                if(a!==u){
                        b=a.id
                        l=b.length;
                        while(i<l){
                            c=b[i];
                            d.push({ id:c,name:a[c].a });
                            i++;
                        };
                };
              d.splice(0,0,{id:-1,name:''});//头部插入一个空数据  
              app.map_cfg.list=d; //赋值 地图列表 数据
     },
     //界面,内容,辅助线全部重新生成和调整  (必须全部参数生效 , 相互整除的前提下,才调用)
     mapInit:function(){
        var t=this,a=app.map_cfg,zw,zh,w,h,mw,mh,sw,sh,px,py,d,i,l=5,x,y,mg,lg,ct;
                zw=a.zw,zh=a.zh;//程序窗口宽高
                game_main.style.width=zw+'px';
                game_main.style.height=zh+'px'; 
                w=a.w,h=a.h;//内容窗宽高
                px=((zw-w)/2)<<0,py=((zh-h)/2)<<0;
            //修改canvas 尺寸 并且居中显示
                while(l--){
                    d=canvas[l];
                    d.width=w;
                    d.height=h;
                    d.style.left=px+'px';
                    d.style.top=py+'px';
                };
                t.fzDraw();//绘制辅助网格
              if(GX===0)t.mapDataInit();//需要生成 新的 基本地图数据 (针对未保存的地图)
              
     },
     //辅助线绘制
     fzDraw:function(){
        var t=this,a=app.map_cfg,zw,zh,w,h,mw,mh,sw,sh,px,py,d,i,l=4,x,y,mg,lg,ct;
            w=a.w,h=a.h;//内容窗宽高
                //绘制网格
                if(a.sjqh===1){//正视角
                    mg=fzK[0],lg=fzK[1];//地图单位框,逻辑单位框
                }else{//斜视角
                    mg=fzK[2],lg=fzK[3];//地图单位框,逻辑单位框
                };

                //计算绘制 地图单位辅助网格
                ct=ctx[3];
                ct.clearRect(0,0,w,h);
                if(mF===1){//允许绘制
                    mw=a.mw,mh=a.mh;//地图单位尺寸
                    x=w/mw;//横向个数
                    y=h/mh;//垂直个数
                    i=0;
                    while(i<y){
                        zh=mh*i; //垂直绘制高度
                        l=0; 
                        while(l<x){
                            ct.drawImage(mg,mw*l,zh,mw,mh);
                            l++;
                        };
                        i++;
                    };
                };
                //计算绘制 逻辑单位辅助网格
                ct=ctx[4];
                ct.clearRect(0,0,w,h);
                if(sF===1){
                    sw=a.sw,sh=a.sh;//地图单位尺寸
                    x=w/sw;//横向个数
                    y=h/sh;//垂直个数
                    i=0;
                    while(i<y){
                        zh=sh*i; //垂直绘制高度
                        l=0; 
                        while(l<x){
                            ct.drawImage(lg,sw*l,zh,sw,sh);
                            l++;
                        };
                        i++;
                    };
               };
     },
     //地图数据初始化 (初创的默认空数据 单位面积 依照游戏窗口面积 与单位面积 比值自动生成)
     mapDataInit:function(){
        var t=this,a=app.map_cfg,w,h,mw,mh,sw,sh,dw,dh,dw2,dh2,o,d,c,i,l,x,y;
            w=a.w,h=a.h;//程序窗口
            mw=a.mw,mh=a.mh; //map网格
            sw=a.sw,sh=a.sh; //逻辑网格
            dw=w/mw,dh=h/mh; //map  地面数据宽高
            dw2=w/sw,dh2=h/sh; //逻辑 实体数据宽高
            o=[]//总数据  [map ,solid,floor]
            //创建map数据
            y=0,d=[]
            while(y<dh){
                x=0;
                c=[];
                  while(x<dw){
                      c[x]=[]; //x轴
                      x++;
                  };
                 d[y]=c; //y轴 
                y++;
            };
            o[0]=d;
            //创建solid 逻辑格数据
            y=0,d=[]
            while(y<dh2){
                x=0;
                c=[];
                  while(x<dw2){
                      c[x]=[]; //x轴
                      x++;
                  };
                 d[y]=c; //y轴 
                y++;
            };
            o[1]=d;
            o[2]=[reNew(d),reNew(d),reNew(d),reNew(d),reNew(d)];//楼层障碍层 共有 5层 0,1,2,3,4 (用于设置每层的 障碍地图)
            o[3]=[a.zw,a.zh,w,h,mw,mh,sw,sh]; //[zw,zh,w,h,mw,mh,sw,sh]
          
            t.list_init();//地图列表数据初始化
            t.newData(o); //通知新地图数据
     },
     //用于新地图数据传递, 同时通知相关 进行调整
     newData:function(o){
        var d; 
          mapData=o;//
          this.mbj_gx(o);//地图参数数据更新
          map.newMap(o); //通知新地图产生
          G_cz.fun.map_xg_Fun.close();//通知选中编辑数据,地图切换,进行清空
          d=o[3];
          G_cz.fun.npcFun.reSize([[d[4],d[5]],[d[6],d[7]]]); //通知npc 背景格尺寸更新 [[mw,mh],[sw,sh] ] 
     },
     //map 行列增,删 , 存储 相关
     map_cz_init:function(){
         var t=this,A,B,C,D,E,F,G,H=1,L=3,I,J,K,M,N,P;
                A=game_area.getElementsByClassName('game_bar')[0].getElementsByTagName('input');
                B=game_area.getElementsByClassName('game_bar')[0].getElementsByClassName('app_d0');//[0-4:互斥编辑层, 5-9:显示选中层 ]
                C=[1,1,1,1,1];// 对应B 5-9 1代表显示选中层 ,将要传递给map的,默认全显示
                //A = [0:mapId,1:mapName,(2:zw,3:zh,4:w,5:h),6:sjz,7:sjx,(8:mw,9:mh,10:sw,11:sh),(12,13:map,solid单位面积)  (14:行上,15:行下),(16:列左,17:列右)]
                //其中 8-11 已存地图时禁止修改, 新图未保存时可修改
                //已有地图禁止编辑 map 和 逻辑 单位尺寸
                t.input_jy=function(f){
                    var i=8,l=11+1;
                        while(i<l){
                            A[i].disabled=f?true:false;
                            i++;
                        };
                };
                //保存当前map,保存当前编辑中的地图 (已有的直接保存, 新的提示要保存的地图名称)
                t.save_map=function(){
                    var a=app.map_cfg,b,c,d,p;
                        c=a.name;//地图名称
                        if(c===''){
                                tipFun('地图名称不能为空',1);
                                return;
                        };
                        if(kF===0){
                            tipFun('不符合规范的地图数据尺寸, 请检查 绘制单位 是否能够被整除',1);
                            return;
                        };
                        p=G_cfg.project.path;//项目路径
                        b=a.id;
                        if(b!==''){ //已有地图保存
                              G_cfg.map[b].a=c;//可能的修改地图名称
                        }else{//新地图保存 (因为没有id,依次判断是新图)
                              b=t.id_map();//获取当前地图id
                              G_cfg.map[b]={
                                    a:c,e:{},u:{}
                              };
                              a.id=b;
                        };
                        console.log('%c储存地图~','color:yellow');
                        GX=1;//当前使用的是已有图,
                        d=t.save_cl(); //处理后的地图数据 (删除冗余)
                        ajax(1,p,b,d);
                        t.list_init();//更新地图列表 (因为新增目录 和 可能的名称修改)
                };
                //创建新地图
                t.cj_map=function(){
                  var a=app.map_cfg;
                        a.name='',//清空mapName
                        a.id=''; //清空id
                        t.init();//基于当前地图创建新图
                };
                //删除地图 (已有)
                t.del_map=function(){
                    var a=app.map_cfg,b=G_cfg.map,c,p,i,list,l,d;
                        c=a.id;//地图id
                        list=a.list;//列表
                        p=G_cfg.project.path;//项目路径
                        if(c!==-1){//可删除   //-1占位空格
                                ajax(2,p,c);
                                i=b.id.indexOf(c);
                                if(i>-1)b.id.splice(i,1);//删除此id
                                delete b[c]; //删除对应数据
                                a.id='',a.name='';
                                l=list.length;
                                while(l--){
                                    d=list[l];
                                    if(d.id===c){
                                        list.splice(l,1);//删除
                                        a.list='update';
                                        break;
                                    };
                                };
                                GX=0;//新未定义地图状态
                                t.init();//基于当前地图创建新图 ,因为不会自动指向其它地图,所以生成一个新的空地图,基于当前参数
                        };
                };
                //获取 mapID  的顺位补缺 (创建新 map 时用)
                t.id_map=function(){
                    var a,b,c,d,e,f,g,h,i=0,l,u;
                        a=G_cfg.map.id;
                        l=a.length;
                        b=a[l-1]; //当前顺位最大值
                        if(b===u){ //空值返回0
                            a.push(0);
                            return 0;
                        };
                        if(b===l-1){//顺位无缺
                            a.push(l);
                            return l; //返回顺位id
                        };
                        //查缺
                        while(i<l){
                            c=a[i];
                            if(c!==i){//理应 c===i , 不相等, 说明此处缺了i
                                a.splice(i,0,i);//补位,按顺序
                                return i; //返回缺位id
                            };
                            i++;
                        };
                };
                //读取地图 (当选择 map列表时)
                t.read_map=function(i){//map id
                    var p;
                        p=G_cfg.project.path;//项目路径
                        ajax(0,p,i);
                };
                //开关属性调整 (非保存状态的地图允许属性修改, 已保存不容许,只能通过行列增删)
                t.kg_map=function(){

                };
                //修改地图 宽高, (头或尾)追加行或列   (行列都属于地图单位)
                t.mapSize=function(k,r){// 0,1:上,下行 ;  2,3:左,右列 ,r:1:添加,0:删除
                   var a=mapData,b,c,d,e,f,g,h,i,j,l,m,n,o,p,q,w,h;
                       if(a){//存在地图数据
                                b=a[3];//[0:zw,1:zh,2:w,3:h,4:mw,5:mh,6:sw,7:sh]
                                c=a[2];//楼层[0,1,2,3,4] //依据solid逻辑格
                                if(r===1){//添加
                                        if(k<2){//添加行
                                            mapBg(a[0],k,r,1);//map数据调整
                                            h=b[5]/b[7]; //换算逻辑行的高度
                                            mapBg(a[1],k,r,h);//solid数据调整
                                            l=5; //5个逻辑楼层
                                            while(l--){
                                                mapBg(c[l],k,r,h);//逻辑层数据调整
                                            };
                                        }else{//添加列
                                            mapBg(a[0],k,r,1);//map数据调整
                                            h=b[4]/b[6]; //换算成逻辑格列数
                                            mapBg(a[1],k,r,h);//solid数据调整
                                            l=5;
                                            while(l--){
                                                mapBg(c[l],k,r,h);//逻辑层数据调整
                                            };
                                        };
                                }else{//删除
                                        if(k<2){//删行
                                                if(a[0].length===1)return; //至少有一行
                                                mapBg(a[0],k,r,1);//map数据调整
                                                h=b[5]/b[7]; //换算逻辑行的高度
                                                mapBg(a[1],k,r,h);//solid数据调整
                                                l=5;
                                                while(l--){
                                                    mapBg(c[l],k,r,h);//逻辑层数据调整
                                                };
                                        }else{//删列
                                               if(a[0].length===1)return; //至少有一列
                                                mapBg(a[0],k,r,1);//map数据调整
                                                h=b[4]/b[6]; //换算成逻辑格列数
                                                mapBg(a[1],k,r,h);//solid数据调整
                                                l=5;
                                                while(l--){
                                                    mapBg(c[l],k,r,h);//逻辑层数据调整
                                                };
                                        };
                                };//if(r===1) END~~~~~~~~
                                t.mbj_gx(a);
                                map.newMap(a); //因修改 地图绘制参数全部重新生成
                       };
                };
                //t.mapSize 前置方法
                t.mapSize0=function(n){//0,1:行增,行删, 2,3:列增,列删
                    var k,r=1;
                        r=n===1||n===3?0:1; 
                        k=n<2?H:L;
                        t.mapSize(k,r);
                };
                //添加模式选择(用于互斥选择)
                t.mapTjMsXz=function(n){//0,1:左右 2,3:上下
                     
                     if(n<2){
                        H=n;
                        A[14].checked=n===0?true:false;
                        A[15].checked=n===1?true:false;
                     }else{
                        L=n;
                        A[16].checked=n===2?true:false;
                        A[17].checked=n===3?true:false;
                     }; 
                };  
                //map单位面积
                t.mapDwMj=function(m,s){
                    A[12].value=m;
                    A[13].value=s;
                };
                //floor 层单击选择
                t.foor_dj=function(n){//0-4:互斥 ,5-9:修改C并且传递给map
                     if(n<5){
                         if(showF==n){//禁止勾选掉
                             B[n].checked=true;
                         }else{
                             B[showF].checked=false;
                             showF=n;
                             B[n].checked=true;
                         };
                     }else{
                          C[n-5]=B[n].checked?1:0;
                          //
                          map.showGx(C); //更新map 绘制数据的层显示 对应数据
                     };
                };     

     },
     //map 基本数据变化,位移点击绘制,计算等等
     map_bj_init:function(){
         var t=this ,zmw,zmh,zsw,zsh,mw,mh,sw,sh,mwp,mhp,swp,shph,A,B,C,D,E,F,G,H,I,J,K,M,x=0,y=0,u;
            //基于格=> zmw,zmh:总map宽高 , zsw,zsh:总solid狂高, mw,mh:视窗map格宽高, sw,zh:视窗solid宽高
            //mwp,mhp : map 格px尺寸 ;  swp,shp:solid 格px尺寸
            //x,y: 基于map格的移动
            //D:当前可填充地图数据
            //地图参数发生变化
             t.mbj_gx=function(m){
                 var a=app.map_cfg,z=m[3];
                     //z//[0:zw,1:zh,2:w,3:h,4:mw,5:mh,6:sw,7:sh]
                     a.zw=z[0],a.zh=z[1],a.w=z[2],a.h=z[3],a.mw=z[4],a.mh=z[5],a.sw=z[6],a.sh=z[7];
                     zmw=m[0][0].length, zmh=m[0].length;
                     zsw=m[1][0].length, zsh=m[1].length;
                     mw=z[2]/z[4],  mh=z[3]/z[5];
                     sw=z[2]/z[6],  sh=z[3]/z[7];
                     mwp=z[4],mhp=z[5]; //map 格px尺寸
                     swp=z[6],shp=z[7]; //solid 格px尺寸
                     x=0,y=0; //地图xy网格位置归为
                     t.mapDwMj(zmw+'x'+zmh,zsw+'x'+zsh);
                        say('地图参数 =>    map总宽高: ',zmw,zmh);
                        say('地图参数 =>  solid总宽高: ',zsw,zsh);
                    //  say('地图参数 =>  视窗map宽高: ',mw,mh);
                    //  say('地图参数 =>视窗solid宽高: ',sw,sh);
             };

             //位移 基于map格 
             t.mbj_gx_pos=function(n){//0,1:左右 , 2,3:上下
                    if(n<2){//0,1:左右
                            if(n===0){
                                x--;if(x<0)x=0;
                            }else{
                                x++;if(x>=zmw-mw)x=zmw-mw; //
                            };
                    }else{//2,3:上下
                            if(n===2){
                                 y--;if(y<0)y=0;
                            }else{
                                 y++;if(y>=zmh-mh)y=zmh-mh;
                            };
                    };
                    // say(x,y);
                    map.pos(x,y);
             };

             // 按住ctrl时添加 ; alt获取目标位数据(并发送到map_xy_data.js) ; 其它:仅获取鼠标位置
             t.mbj_dj_xy=function(p,q,f){//p,q= x,y坐标 ,f=1:仅输出返回 当前坐标值
                  var a,b,c,d,e,g,h,m=[[],[]];
                      if(zmw===u)return; 
                      a=p/mwp;
                      b=a<<0;
                    //   if(a>b)b++; //不用计算溢出,因为本身从索引0开始计算 <<0 值就是当前格
                      b+=x;
                      if(b>=zmw)return; //超出
                      m[0][0]=b;// mx
                      a=q/mhp;
                      b=a<<0;
                      b+=y;
                      if(y>=zmh)return;
                      m[0][1]=b;// my
                      //
                      a=p/swp;
                      b=a<<0;
                      b+=x;
                      if(b>=zsw)return; //超出
                      m[1][0]=b;// sx
                      a=q/shp;
                      b=a<<0;
                      b+=y;
                      if(y>=zsh)return;
                      m[1][1]=b;// sy
                      if(f===1)return m;
                    //   say(JSON.stringify(m));
                      if(CF===1){//ctrl 按下时同时放置数据
                          t.mbj_map_add(m);
                      }if(AF===1){//alt 按下,获取选中位置目标数据
                          G_cz.fun.map_xg_Fun.map_xy(m);
                      };
             };

             //当前待填充数据 (由外部推送)
             t.mbj_get_d=function(d){
                 D=d; //[t,1,2] 
                 /* 
                   0:t={
                        0:{//img
                            1:[0,1,2], //0,1,2对应值[ 0=>(0:地表,1:实体,2:装饰(暂禁)), 1=>全禁了(0:左下,1:右下,2:左上,3:右上), 2=>(0:唯一,1:重复,2:随机(暂禁),3:随机重复(暂禁))]
                            2:[[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]] //数据
                        },
                        1:{//dh
                            1:(0:地表,1:实体,2:装饰(暂禁)),
                            2:[//dh数据
                                [0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id,7:gx], //索引0 记录动画信息
                                [],[],..//帧数据 
                            ]
                        }
                   }
                 */
             };

             t.mbj_map_add=function(z){// [[mx,my] , [sx,xy]]
                 if(!D)return;
                 var a=D,b=app.map_cfg,c,d,e,f,g,h,i,j,k,l,m,n;
                     if(a[0]===0){//img
                            c=a[1];
                            if(c[0]===0){//map
                                m=mapData[0][z[0][1]][z[0][0]];
                            }else{//solid
                                m=mapData[1][z[1][1]][z[1][0]];
                            };
                            d=reNew(a[2]); //[ [] ]
                            //m对应数据格式
                            if(c[2]===0){//唯一 ,查重
                                l=m.length;
                                while(l--){
                                    e=m[l];
                                    if(e[0][0]===d[0][0])return; //有重复id ,禁止添加
                                };
                            };
                            d[0][9]=showF;//修改显示的层级
                            m.push(d);
                     }else if(a[0]===1){//dh
                            c=a[1];//0:地表,1:实体,2:装饰(暂禁)
                            if(c===0){//map
                                m=mapData[0][z[0][1]][z[0][0]];
                            }else{//solid
                                m=mapData[1][z[1][1]][z[1][0]];
                            };
                            d=reNew(a[2]); //待填充数据
                            d[0][5]=showF; //设置动画floor
                            m.push(d);
                     }else{//yp

                     };
             };


     },
     //map 数据储存处理 (记录程序宽高, 删除dh生成数据并初始化)
     save_cl:function(){
         var a=app.map_cfg,o=mapData,i,l,w,h,b,c,d,s,e,f,g,j=2,k,m,n;
             b=mapData[3]; //[zw,zh,w,h,mw,mh,sw,sh]
             b[0]=a.zw,b[1]=a.zh,b[2]=a.w,b[3]=a.h;
             o=reNew(o);
             while(j--){
                    c=o[j]; //0:map 1:solid
                    h=c.length,w=c[0].length;
                    i=0;
                    while(i<h){
                        d=c[i];//行全部数据
                        s=0;
                        while(s<w){
                            g=d[s];//格全部数据
                            e=0,l=g.length;
                            while(e<l){
                                m=g[e];
                                n=m.length;
                                if(n>1){//dh
                                    k=m[0];//[0:lx,1:dh,2:list,3:time,4:bf,5:f,6:id,7:gx,8-10]
                                    //删除8-10数据
                                    k.splice(8) ;
                                    if(k[4]===1)k[4]=2; //播放中的动画 设置成初始化  ,0停止的不处理
                                };
                                e++;
                            };
                            s++;
                        };
                        i++;
                    };
            };  
          return o;  
     }
    
};
G_cz.fun.map_bjq=gFun; //供外部调用

gFun.map_bj_init();


// var app;//  app:地图编辑器 
 var app=new Eng({
        el:'game_area',
        data:{
                map_cfg:{//地图属性配置部分
                    id:'',name:'', //地图id,地图名称
                    list:[], //已存储地图列表  {id:,name:}
                    zw:800,zh:600,w:800,h:600,//程序窗口 => 总宽,总高,  内容窗口=>宽,高  py:内容窗口距离程序窗口顶部的距离
                    sjqh:1, //默认正视角
                    mw:40,mh:40,sw:40,sh:40,  //map网格宽高, 逻辑网格宽高
                    map_size:'',solid_size:'' //网格单位面积
                },
        },
        watcher:{
            //  'map_cfg.':function(o,n,i,c){},
            'map_cfg.id':function(o,n,i,c){
                 if(gFun.input_jy)gFun.input_jy(n===''?0:1); //空时允许编辑,有id时禁用
            },
            //视角切换值   1:正视角,0:斜视角
            'map_cfg.sjqh':function(o,n,i,c){
                var a=i.sj_z,b=i.sj_x;
                    a.checked=n?true:false;
                    b.checked=n?false:true; 
                    gFun.init();
            },
            //zw 程序
            'map_cfg.zw':function(o,n,i,c){
                var n=n<<0;
                    if(n<800){//总宽不能少于800
                        tipFun('程序窗口宽度不能少于800',1);
                        n=o;
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //zh 程序
            'map_cfg.zh':function(o,n,i,c){
                var n=n<<0;
                    if(n<600){//总高不能少于600
                        tipFun('程序窗口宽度不能少于800',1);
                        n=o;
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //w 内容
            'map_cfg.w':function(o,n,i,c){
                var n=n<<0;
                    if(n<600){
                        n=600;
                        tipFun('内容窗口宽度不能小于600',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //h 内容
            'map_cfg.h':function(o,n,i,c){
                var n=n<<0;
                    if(n<400){
                        n=400;
                        tipFun('内容窗口宽度不能小于400',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //mw 地图单位
            'map_cfg.mw':function(o,n,i,c){
                var n=n<<0;
                    if(n<20){
                        n=20;
                        tipFun('地图单位尺寸 宽度不允许小于20',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //mh 地图单位
            'map_cfg.mh':function(o,n,i,c){
                var n=n<<0;
                    if(n<20){
                        n=20;
                        tipFun('地图单位尺寸 高度不允许小于16',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //sw 逻辑单位
            'map_cfg.sw':function(o,n,i,c){
                var n=n<<0;
                    if(n<5){
                        n=5;
                        tipFun('逻辑单位尺寸 宽度不允许小于5',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
            //sh 逻辑单位
            'map_cfg.sh':function(o,n,i,c){
                var n=n<<0;
                    if(n<4){
                        n=4;
                        tipFun('逻辑单位尺寸 高度不允许小于4',1); 
                    };
                    i.$_value=n;
                    gFun.init();
            },
        },
        event:{
            //视角正斜切换
            sjqh:function(e){
                var t=this,a,b,c,d=t.$_gData;
                    a=d.map_cfg.sjqh;
                    d.map_cfg.sjqh=a?0:1;
            },
            //显示隐藏(ui面板, 地图辅助格, 逻辑辅助格 ,  )
            showOff:function(){
                var t=this,a,b,c;
                    a=t.checked;
                    b=t.getAttribute('show')<<0;
                    if(b===1){// 地图辅助显示开关
                        mF=a?1:0;
                        gFun.fzDraw();
                    };
                    if(b===2){//逻辑辅助显示开关
                        sF=a?1:0;
                        gFun.fzDraw();
                    };
            },
            //储存map
            save_map:function(){
                gFun.save_map();
            },
            //创建新地图
            cj_map:function(){
               var t=this;
                    GX=0;
                    gFun.cj_map();
                    t.$_items.map_list.selectedIndex=-1;//
            },
            //删除地图(已有)
            del_map:function(){
                var t=this;
                    gFun.del_map();
                    t.$_items.map_list.selectedIndex=-1;//
            },
            //地图列表选择变化
            list_change:function(){
                var t=this,i,d,n,g;
                     i=t.selectedIndex;//选中的下标
                     if(i>0){
                        d=t.options[i];
                        n=d.getAttribute('id')<<0;//待 读取 mapID
                        gFun.read_map(n);//
                        g=app.map_cfg;
                        g.id=n,g.name=d.textContent;
                     };
            },
            //地图窗口激活 (游戏执行)
            game_jh:function(){
                 BF=2
                // say(1)
            },
            //地图窗口失焦 (游戏暂停)
            game_zt:function(){
                // say(2)
                BF=1;
            },
            //点击操作  (获取点击点数据 或 绘制)
            draw_dj:function(e){
                var t=this,x,y,d; 
                    //offset
                    d=offset(t.children[1]); //获取canvas的位置  d={left:xx,top:xx};
                    x=e.pageX,y=e.pageY; 
                    x=x-d.left,y=y-d.top;
                    gFun.mbj_dj_xy(x,y);//计算点击对应数据 格坐标
            },
            //提示操作 实时提示鼠标对应的数据位置
            draw_ts:function(e){
                var t=this,i=t.$_items,x,y,d,m,mxy=i.map_xy,sxy=i.solid_xy; 
                    //offset
                    d=offset(t.children[1]); //获取canvas的位置  d={left:xx,top:xx};
                    x=e.pageX,y=e.pageY; 
                    x=x-d.left,y=y-d.top;
                    m=gFun.mbj_dj_xy(x,y,1);//[[mx,my],[sx,sy]] 
                    if(m){
                        mxy.value=m[0].join('x');
                        sxy.value=m[1].join('x');
                    };
            },
            //map 尺寸修改 类型选择  0,1:左右 2,3:上下
            map_size:function(){
                var t=this,a,b,c,d,e,f,g;
                    a=t.getAttribute('lx')<<0;
                    gFun.mapTjMsXz(a); 
            },
            //添加删除行列按钮
            map_bg:function(){
                var t=this,a,b,c,d,e,f,g;
                    a=t.getAttribute('lx')<<0;
                    gFun.mapSize0(a); 
            },
            //floor checkbox 选择操作  静默,   (循环,单次 互斥)
            floor_cz:function(){
                var t=this,a,b,c,d,e,f,g;
                    a=t.getAttribute('lx')<<0;
                    gFun.foor_dj(a);
            },
        },
        created:function(i,c){
            apItem=i;
        }
});
gFun.map_cz_init();

//提示文本
var tsWb={
    //0 没有0 方便判断
    1:['    设置程序窗口的宽和高\r\r    注意:允许的最小值(宽:800*高600) ,之后设定的 地图单位尺寸, 也必须能够被 整除 才能使所有参数生效'],
    2:['    设置内容窗口的宽和高\r\r    备注: UI界面的布局允许溢出, 内容窗口居中显示 \r\r    注意: 允许的最小值(宽:600*高400), 不能大于程序窗口 , 且之后设置的 地图单位 必须能够被该值整除, 才能使所有参数生效'],
    3:['    设置游戏视角为正视角或45度视角\r\r    备注:仅会影响辅助线的显示方式, 无论是正视角 还是 45度视角, 游戏内都是2D画面, 3d逻辑'],
    4:['    设置地图单位尺寸\r\r    备注: 游戏场景地图素材的的基本布局参考单位, 主要针对地表元素格子, 场景内其它元素都应以此做为参考( 就是比例合适, 不要太突兀, 开发者主观把握)\r\r    其后设置的逻辑单位尺寸必须能够被该值整除'],
    5:['    设置逻辑单位尺寸\r\r    注意:  逻辑单位密度决定了, npc等实体单位的空间站位和碰撞体积检测, 以及移动单位, 还有技能范围的判定.  \r\r    备注:逻辑单位密度 = 地图单位尺寸面积÷逻辑单位尺寸面积(整除) , 不是越小密度越高越好, 合适的基础上密度越低越好']

};
//悬浮提示
game_area.addEventListener('mouseover',function(e){
    var a=e.target,n,c;
        n=a.getAttribute('tip')<<0;
        if(n>0){//
            c=tsWb[n];
            if(c){
                 tipFun(c[0],c[1]);
            };
        };
});
var CF=0,AF=0; //ctrl 和 alt 选中状态 (彼此互斥)
// key 键计算 ~~~~~~
(function(){
var m={
       65:0,68:1,87:2,83:3, //上下左右移动地图
};    
// 移动操作 ,非播放时,不生效  ,  添加删除, 非快捷键时,不生效    
window.addEventListener('keydown',function(e){
    var  a=e.keyCode,z,u;
         if(a===18){//按住alt时 是 鼠标单击 选中数据
                AF=1;
                if(CF===1)CF=0;
                e.preventDefault();
         };
         if(a===17){//按住 ctrl时  鼠标单击放置数据
                CF=1;
                if(AF===1)AF=0;
                e.preventDefault();
         };
         if(BF===2){//播放时才允许 快捷键细调
                //
                //左右上下(adws):65,68,87,83 移动地图
                z=m[a];
                if(z!==u){
                    gFun.mbj_gx_pos(z);
                };
                
                //左右上下(方向键)37,39,38,40   -:189 , +:197   (调整物体的上下左右位置 , 以及大小 )
         };
});

window.addEventListener('keyup',function(e){
    var  a=e.keyCode;
         if(a===18)AF=0;
         if(a===17)CF=0;
});

window.addEventListener('blur',function(){
         CF=0,AF=0;
});

})();
})(); 