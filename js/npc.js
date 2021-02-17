/* 
NPC编辑器操作相关
*/
(function(){
var openF=1; // 0:关闭,1:启用状态
var mDom=document.getElementById('npc_');//整个功能区
var xzDom=mDom.getElementsByClassName('npc_lx_check')[0].getElementsByTagName('input'); // 动作类型 和 面向选择 的checboxDom
var npc_show=mDom.getElementsByClassName('npc_show')[0];//npc 图片编辑框 容器
var npc_add=mDom.getElementsByClassName('npc_add')[0];// 可移动 npc 编辑框

var GD,PD,ZD; //GD=>npc全部数据, PD:当前使用分类(GD.c[类名])   ZD:当前编辑中的的NPC数据
/* 
ZD={
      a:[],//动作Id 顺位查重 
      b:'npcID',
      c:'姓名',
      d:= dzD,
      e:{装备数据}  
}
*/
var dzD,dZ;  //dzD:当前npc的所有动作数据, dZ:单个动作的数据
/* dzD={//基于dzMZ 的动作动画数据
      '动作名称0':dZ
      'dzMz1':...
      'dzMz2':...
 }
   dZ={//基于动作名称
            a:'dzId',
            b:'动作名称', 
            c:[], //每帧显示时间
            d:['x','x2','y2'], //0:中轴(左面向), 1,2:状态buf基本位置
            t:[-1,-1],// 0=>(-1:自定义,0:站立,1:行走,2:哈欠/懒腰,3:攻击/施法),1=>(-1:无面向,0:左,1:右,2:上,3:下)
            e:[//dh数据
                  [//第0帧 
                        [imgId,w,h,x,y,jx,yy,xs,wy],
                  ],    
            ],
      },
*/
 var zbD; //当前npc的装备数据
 var zyImg,img;// zyImg:待添加img资源 ,img:当前操作中的img
 var pth, xzImg; //项目路径  , xzImg;当前选中的img对象
var app; 
var gFun={
      st:null, //定时器
      st1:null,//定时器2
      st2:null,//定时器3 (播放)
      //当打开时, 获取npc 列表
      init:function(){
            var a=G_cfg,b,c,d,e,f,g,h,i,j,k,l,m,n;
                openF=1;
                pth='./|'+G_cfg.project.path+'/img/';
                if(!a.npc){//未创建npc 数据时
                   a.npc={
                        a:[],//npcId顺位查重
                        b:[],//大类名列表
                        c:{//基于大类名的 ,npc名
                        //     '大类名':{ 
                        //           'npc姓名':'id'
                        //     }
                        },
                        d:{//基于npc id 的数据集合
                        }     
                   };
                };
                GD=a.npc;
                a=a.npc;
                b=a.b.slice(0);//复制大类名
                app.npc_fl=b;
                //延迟app 模拟 分类和子类列表选择
                setTimeout(function(){
                    d_fl.onchange(); //触发npc分类选择重定向  
                },100);
      },

      //获取 顺序非重复id ,并记录
      getId:function(d){// d => [对应的id集合]
            var a,b,c,f,g,h,i=0,l,u;
                  a=d;
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
      },

      //显示刷新npc 列表 (因为切换分类,或创建 ,并触发一次选中)
      sx_npc_lb:function(){
            var a,b,c,d=[],e,f,g,k,o;
                o=PD;
                for(k in o){
                      //k:npc名
                     v=o[k];// npcId
                     d.push({a:k,b:v});
                };
                app.npc_mz=d;
                d_mz.onchange();//触发一次选中 既有值
      },

      //显示npc 动作名称列表 并 可显示指定动作  (因 选择npc,选择分类 或 添加动作触发)
      npc_dz_d:function(dz){ //dz:显示指定动作数据(添加动作时) , 无指定时 默认第一个动作(若有)
          var t=this,a,b,c,d,e,f,g,h,i,j,k,l,m,o,p,q;
              a=ZD.d; //全部动作数据集合
              dzD=a;  //选中npc 全部动作列表
              d=[]; //动作列表
              t.imgXzOrSf();//释放选中图片
              for(k in a){ //k:动作名称
                  d.push(k);
              };
              app.dz_fl=d;//赋值动作分类名称 列表数据    
              t.npc_dz_fps(dz||a[d[0]],-1); //默认第一个动作 ,-1:无指定帧
      },

      //显示指定动作, 并指定帧数   (单动作数据,帧 -1初始化)
      npc_dz_fps:function(o,n){//o:单个动作数据 , n:要显示帧索引( -1: 初始化并显示0帧, >-1: 仅显示指定帧 )
           var a,b,c,d,e,f,g,h,i,j,k,l,m,u;
               dZ=o;
               if(!o){//空数据 ,同时清空已显示帧数据
                     app.fps=[];
                     return; 
               };     
               a=app.cfg;
               if(n===-1){//动作初始化 (赋值  中心轴  buf点等数据 )
                   b=o.d; //[中轴,bufX,bufY]
                   a.x2=b[0],a.x3=b[1],a.y3=b[2];
                   a.fn=o.e.length; //总帧数
                   n=a.fn===0?-1:0;// 默认显示第0帧, 否则-1无
                   app.lx=o.t[0],app.mx=o.t[1];//动作类型, 面向
               };
               a.nn=n; //当前显示帧索引
               a.sj=o.c[n]===u?400:o.c[n];//当前帧显示时间
               d=o.e[n]||[];//当前帧全部 图片数据
               app.fps=reNew(d);//赋值帧数据
      },

      //npc img 数据储存 (延迟,防无限触发) 
      img_yc_save:function(dz){//指向的 dz名称 ,以此为镜像数据生成依据
            var t=this,a=app,b=a.cfg,c,d,e,f,g,h,i,j,k,l,m,n;
                 clearTimeout(t.st);//每次调用清空
                if(b.f===0)return;//没有选中图 
              //延迟储存,防止无意义性能损耗, 储存整个cfg
                t.st=setTimeout(function(){
                      if(dZ&&xzImg){ // 存在动作 和 选中的img
                            n=b.nn; //当前帧 
                            i=xzImg.getAttribute('index')<<0; //选中img的索引
                            d=dZ.e[n];//当前帧
                            if(d&&d[i]){
                                  d=d[i];//[0:imgId,1:w,2:h,3:x,4:y,5:jx,6:yy,7:xs,8:wy] //img属性
                                  d[1]=b.w,d[2]=b.h,d[3]=b.x,d[4]=b.y,d[5]=b.jx,d[6]=b.yy,d[8]=b.wy;
                                  gFun.npc_dz_fps(dZ,n);//同时刷新显示fps
                            };
                      };
                },50);
      },
      //延迟存储 帧时间 和中心轴 ,以及buff点  (然后刷新帧数据)
      fps_yc_save:function(){
                if(!app)return; //
            var t=this,a=app,b=a.cfg,c,d,e,f,g,h,i,j,k,l,m,n;
                clearTimeout(t.st1);//每次调用清空
               if(!dZ)return;//没有编辑中的动作
               t.st1=setTimeout(function(){
                     n=b.nn;//当前帧
                     if(n>-1){//存在
                          dZ.c[n]=a.sj;//修改时间
                     };
                     d=dZ.d; //[x,x2,y2] //0:中轴(左面向), 1,2:状态buf基本位置
                     d[0]=b.x2,d[1]=b.x3,d[2]=b.y3;
                     gFun.npc_dz_fps(dZ,n);//同时刷新显示fps
               },50);
      },

      //因切换对象 (创建类,切换类,npc选择,npc删除),在下一个之前重置 app.cfg, ZD=null,dzD=null,dZ=null,zbD=null,zbD=nul ,img=null;
      qhNull:function(){
         var t=this,a,o=app;
            img=null;
            ZD=null,dzD=null,dZ=null,zbD=null,zbD=null;
             a={
                  fn:0,nn:-1,sj:400, 
                  f:0,w:0,h:0,x:0,y:0,jx:0,yy:0,wy:0,
                  x2:20, 
                  x3:20,y3:80,
            };
            o.cfg=a;
            o.lx=-1;
            o.mx=-1;
           
            t.imgXzOrSf();//清除img选择
      },

      //外部调用获取img 图属性
      getImg:function(o){//o = [0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]; //imgN=>(0:正常,1:镜像),f=>楼层
              //[imgId, w,h,x,y,jx,yy,xs,wy
              if(openF===0)return;//非启用状态
              zyImg=[o[0],o[4],o[5],o[2],o[3],0,0,1,0];
      },
      
      //添加帧图片
      addImg:function(){
            var t=this,a=app.cfg,b,c,d,e,f;
                  b=a.nn;//当前帧
                  if(b>-1&&a.fn>0){//有可操作使用帧
                        dZ.e[b].push(reNew(zyImg)); //推送图片到当前帧
                        t.npc_dz_fps(dZ,b);//刷新当前帧
                  };    
      },

      //img 选中 或 释放 ( esc主动,或 切换 类,npc,帧,删除, 或关闭 )
      imgXzOrSf:function(o,f){;//o:[0:imgId,1:w,2:h,3:x,4:y,5:jx,6:yy,7:xs,8:wy] ,//0:imgID,1:w,2:h,3:x,4:y,5:jx镜像(0:否,1:是),7:显示(此无)(0:隐藏,1:显示),8:wy(位移轴 -5~5)
                               //f=>1:选中, 其它:释放
           var a=app.cfg,b,c,d,e,g,h,i;
               if(f===1){//选中
                  a.f=1; //有选中图片
                  a.w=o[1],a.h=o[2],a.x=o[3],a.y=o[4],a.jx=o[5],a.yy=o[6],a.wy=o[8];  
               }else{
                  if(xzImg)xzImg.style.border='';//清除选中框
                  xzImg=null;
                  a.f=0;//无选中
                  a.w=0,a.h=0,a.x=0,a.y=0,a.jx=0,a.yy=0,a.wy=0;   
               }; 
      },
      
      //创建动作镜像  (无效! 改为手动设置无需玩家创建了)
      /* cj_dz_jx:function(o){//o:源数据
         var a=dZ,b,c,d,e,f,g,h,i,j,k,l,m,n,x,x2,y2;   
          if(a&&o!==dZ){//当前动作,且和源目标不是同一个
                e=a.e;
                if(e.length>0){//当前动作非空, 不能作为镜像数据存储地址
                      tipFun('待赋值目标动作 不为空!',1);
                    return;  
                };
                if(o.e.length<1){//源镜像不能为空
                      tipFun('源动作数据 为空!',1);
                      return;
                };
                a.c=reNew(o.c);//直接复制帧时间



          }else{
                tipFun('待赋值的目标动作不存在 或  自身无法成为自身的镜像',1);
          };  
      }, */
      //动作类型 面向 储存  (同时 切换checkbox dom 选择显示状态)
      dz_mx_save:function(d){// [0,1]  
         var a,b,c,e,f,g,h,i,j,k,l,m,n;
            a=xzDom;//
            n=d[1];//d[0]=0=>(-1:自定义,0:站立,1:行走,2:哈欠/懒腰,3:攻击,4:施法), d[1]=1=>(-1:无面向,0:左,1:右,2:上,3:下)
            if(d[0]===0){//0:类型
                  i=0,l=6;
                  if(dZ)dZ.t[0]=n;
                  n+=1;//0,1,2,3,4,5  (对位dom 索引)
            }else{//1:面向
                  i=6,l=11;
                  if(dZ)dZ.t[1]=n;
                  n+=7;// 6,7,8,9,10,11 (对位dom 索引)   //+7因为 dom 从索引6开始, n从-1开始  所以6+1=7
            };
            while(i<l){
                c=a[i]
                c.checked=i===n?true:false;
                i++;
            };
                
      },

     //调整辅助背景格子尺寸 (外部调用)
      reSize:function(d){// [[w,h],[w,h]] 0:map,1:solid
            if(app){
                  app.map=d[0];
                  app.solid=d[1];
            };
      },

      //播放当前动作 (任意行为都会打断)
      play:function(f){ //f=1直接阻止 继续播放
           var t=this,a,b,c,d,e,g,h,i,j,k,l,m,n,fun; 
               clearTimeout(t.st2);
               if(f===1)return;
               t.imgXzOrSf();//释放选中
               if(!dZ||dZ.c.length<2){ //无动作 或 帧数小于2 则无效
                   tipFun('无数据 或 总帧数小于2',1);
                    return;
               };
               c=dZ.c;//[帧时间集合]
               l=c.length; //i:当前帧,总时间
               i=-1;
               fun=function(){
                        i++;  
                        if(i>=l)i=0; 
                        n=c[i];//当前帧显示时间
                        t.npc_dz_fps(dZ,i);//显示指定帧
                        t.st2=setTimeout(function(){
                              fun();
                        },n);
               };
               fun();
      },

      //当关闭时
      close:function(){
            var t=this;
                  xzImg=null;
                  openF=0;//功能区关闭
                  zyImg=null,img=null,cF=0;
                  GD=null,PD=null,ZD=null,dzD=null,dZ=null,zbD=null,zbD=null;
                  t.qhNull();
      }
};

G_cz.fun.npcFun=gFun;

//4个 select dom
var d_fl,d_mz,d_dz,d_dz_jx; //分类,名字,  动作,动作镜像   select dom标签
 app=new Eng({
      el:mDom,
      data:{
          map:[40,40],  //mao格尺寸 默认[40x40]
          solid:[40,40],//solid格尺寸 默认[40x40] 
          name:'', //npc 分类名 或 姓名  
           //npc分类 [ '类名' ]
          npc_fl:[
          ],
          //npc 名字 ['名字']
          npc_mz:[   //{a:npc名字,b:npcID}
          ],
          lx:-1, //(-1:自定义,0:站立,1:行走,2:哈欠/懒腰,3:攻击/施法)
          mx:-1, //(-1:无面向,0:左,1:右,2:上,3:下) 
          //当前帧图片数据全部数据
          fps:[
            // {
            //   src:src,
            //   d:[imgId, w,h,x,y,jx,yy,xs,wy] ,//0:imgID,1:w,2:h,3:x,4:y,5:jx镜像(0:否,1:是),6:显示(此无)(0:隐藏,1:显示),7:wy(位移轴 -5~5) 
            // }
          ],
          //动作分类 
          dz_fl:[
            //     '站立-左','站立-右','站立-上','站立-下',
            //     '行走-左','行走-右','行走-上','行走-下',
          ],
          //赋值上一个
          dz_fl2:[],
          dz_name:'', // 待添加动作名称
          cfg:{
                fn:0,nn:-1,sj:400, //fn:总帧数,nn:当前帧,sj:帧显示时间,默认400  
                f:0,w:0,h:0,x:0,y:0,jx:0,yy:0,wy:0, //f=>0:无选中图,1:有选中图  ; whxy=>图片的的 宽高xy属性, jx镜像(默否), yy阴影(默否),wy位移(默0)
                x2:20, //中心轴 默认20 (无效,改为手动设置了)
                x3:20,y3:80,// 浮动buff 状态位置 , 基于中心轴相对于左面向  默认20,80  (buf中心点会有 -4px 居中,因为提示方块8px矩形)
          }
      },
      watcher:{
            //map 格背景 (调整背景格尺寸)
            map:function(o,n,i,c){
               var a,b,d,e,f,g,h,j,k,l,m;
                   if(n instanceof Array){//
                        a=i.d_bg_map.style;
                        a.backgroundSize=n[0]+'px '+n[1]+'px';
                   };
            },
            //solid 格背景(调整背景格尺寸)
            solid:function(o,n,i,c){
               var a,b,d,e,f,g,h,j,k,l,m;
                  if(n instanceof Array){//
                        a=i.d_bg_solid.style;
                        a.backgroundSize=n[0]+'px '+n[1]+'px';
                       
                  };
            },
            //动作分类数据, 复制赋值到 dz_fl2  (无效 改为手动设置,无需镜像源了)
           /* dz_fl:function(o,n,i,c){
                 var a,b,d=[],e,f,g,h,j,k,l,m;
                     a=0,l=n.length;
                     while(a<l){
                         b=n[a];
                         d[a]=b;  
                         a++;  
                     };
                     i.$_gData.dz_fl2=d;
           }, */
         /*'cfg.':function(o,n,i,c){
               var a,b,d,e,f,g,h,j,k,l,m;
           },*/
           //转化 fps 帧数据
           fps:function(o,n,i,c){
                var a,b,c,d,s=0,l=n.length;
                    if(l>0){
                         d=[] 
                         while(s<l){
                               a=n[s];//[imgId, w,h,x,y,jx,yy,7:xs,8:wy] 
                               d.push({
                                     src:pth+a[0]+'.png',
                                     d:a
                               });
                              s++;
                         };
                         i.$_value=d;    
                    }else{
                         i.$_value=[];
                    };
           },
           //动作类型选择
           'lx':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                       gFun.dz_mx_save([0,n]);
            },
            //动作面向选择
            'mx':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                      gFun.dz_mx_save([1,n]);
            },
            //当前帧显示时间变化 (同时就该对应帧时间)
            'cfg.sj':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(dZ){ //存在要修改的img值
                              k=/^\+?[0-9][0-9]*$/;//包含0的正整数
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>9000){
                                          n=o;
                                          tipFun('该值 的允许范围 0 ~ 9000 , 0=永久',1)
                                    };
                              }else{
                                    n=400
                              }
                        }else{
                              n=400;  
                        };
                        i.$_value=n;
                        if(dZ){
                              a=i.$_gData.cfg.nn;//当前帧索引
                              if(a>-1){
                                    dZ.c[a]=n; //修改帧时间
                              }
                        }
            },
           //是否图片镜像 1:是,0否
           'cfg.jx':function(o,n,i,c){
                var a,b,d,e,f,g,h,j,k,l,m;
                    a=i.d_jx;//checkbox dom
                    a.checked=n?true:false;
                    if(dZ){
                         e=i.$_gData.cfg;
                         b=e.nn;//当前帧
                         if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
                    };
           },
           //是否图为阴影层 1:是,0否
           'cfg.yy':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                      a=i.d_yy;//checkbox dom
                      a.checked=n?true:false;
                      if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
                      
            },
            //位移轴 默认0    -5 ~ +5范围
           'cfg.wy':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(xzImg){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>5||n<-5){
                                          n=0;
                                          tipFun('该值 的允许范围 -5 ~ 5',1)
                                    };
                              };
                        }else{
                              n=0;  
                        };
                        i.$_value=n;
                        if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
           },
           'cfg.w':function(o,n,i,c){
                 var a,b,d,e,f,g,h,j,k,l,m;
                     if(xzImg){ //存在要修改的img值
                        k=/^\+?[1-9][0-9]*$/ ;//正整数
                        if(k.test(n)){//符合要求
                              n=n<<0;
                        }else{
                             n=1;
                             tipFun('该值能不小于1',1); 
                        };
                     }else{
                         n=0;  
                     };
                     i.$_value=n;
                     if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
           },
           'cfg.h':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(xzImg){ //存在要修改的img值
                              k=/^\+?[1-9][0-9]*$/ ;//正整数
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                              }else{
                              n=1;
                              tipFun('该值能不小于1',1); 
                              };
                        }else{
                              n=0;  
                        };
                        i.$_value=n;
                        if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
            }, 
            'cfg.x':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(xzImg){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>300||n<-300){
                                          n=o;
                                          tipFun('该值 的允许范围 -300 ~ 300',1)
                                    };
                              };
                        }else{
                              n=0;  
                        };
                        i.$_value=n;
                        if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
            },
            'cfg.y':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(xzImg){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>300||n<-300){
                                          n=o;
                                          tipFun('该值 的允许范围 -300 ~ 300',1)
                                    };
                              };
                        }else{
                              n=0;  
                        };
                        i.$_value=n;
                        if(xzImg)gFun.img_yc_save();//选中图片属性延迟存储
             },
             //中心轴 (暂时无效, 改为玩家手动设置每个动作的中心)
           /*  'cfg.x2':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(dZ){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>200||n<-200){
                                          n=o;
                                          tipFun('该值 的允许范围 -300 ~ 300',1)
                                    };
                              }else{
                                    n=20;  
                              };
                        }else{
                              n=20;  
                        };
                        i.$_value=n;
                        i.d_mid.style.left=n+'px';
                        gFun.fps_yc_save();//延迟存储 帧时间 和中心轴 ,以及buff点
            }, */
            //状态buf x点
            'cfg.x3':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(dZ){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>300||n<-300){
                                          n=o;
                                          tipFun('该值 的允许范围 -300 ~ 300',1)
                                    };
                              }else{
                                  n=20;  
                              };
                        }else{
                              n=20;  
                        };
                        i.$_value=n;
                        i.d_buf.style.left=n+'px';
                        gFun.fps_yc_save();//延迟存储 帧时间 和中心轴 ,以及buff点
            },
            //状态buf y点
            'cfg.y3':function(o,n,i,c){
                  var a,b,d,e,f,g,h,j,k,l,m;
                        if(dZ){ //存在要修改的img值
                              k=/^[0-9]*$/ ;//整数不区分正负
                              if(k.test(n)){//符合要求
                                    n=n<<0;
                                    if(n>300||n<-300){
                                          n=o;
                                          tipFun('该值 的允许范围 -300 ~ 300',1)
                                    };
                              }else{
                                    n=80;
                              };
                        }else{
                              n=80;  
                        };
                        i.$_value=n;
                        i.d_buf.style.bottom=n+'px';
                        gFun.fps_yc_save();//延迟存储 帧时间 和中心轴 ,以及buff点
            },
      },
      event:{
            //创建npc 大类 (select会定向到新分类)
            cj_dl:function(){
                 var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                     d=a.name.trim();;// npc姓名
                     if(d){
                           e=GD.b; //已有大类列表
                           if(e.indexOf(d)<0){//非重复可用
                                    e.push(d);
                                    a.npc_fl=e.slice(0); //
                                    PD={}
                                    GD.c[d]=PD;//当前使用分类 
                                    gFun.qhNull();//因切换对象 ,在下一个之前重置数据
                                    b.d_fl.selectedIndex=e.length-1; //指向新创建的 分类
                                    gFun.sx_npc_lb();//显示对应分类列表的npc列表
                                    a.name='';
                              return
                           };
                     };
                     tipFun('非法 或 重复的分类命名',1); 
            },
            //创建npc 姓名 (select不会定向到新npc)
            cj_mz:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n,u;
                        d=a.name.trim();;// npc姓名
                        if(d&&PD){//合法名 并且 有使用中的分类
                              if(PD[d]===u){ //非重复 npc 姓名
                                   e=gFun.getId(GD.a); //获取NPCID    
                                   PD[d]=e;
                                   GD.d[e]={//基于npcID的数据
                                          a:[],//动作Id 顺位查重 
                                          b:e, //npcId
                                          c:d,//命名
                                          d:{},//动作数据-(基于动作名称)
                                          e:{},//装备数据
                                    };
                                   gFun.sx_npc_lb();//刷新npc 列表
                                   a.name='';
                                return;
                              };
                        };
                        tipFun('非法 或 重复的npc命名',1); 
            },
            //npc大类选择 
            n_fl_select:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                      i=t.selectedIndex;
                      if(i>-1){
                            d=a.npc_fl[i];//选中的分类名
                            PD=GD.c[d];   //当前分类数据
                            gFun.qhNull();//因切换对象 ,在下一个之前重置数据
                            gFun.sx_npc_lb();//显示对应分类列表的npc列表
                      };
            },
            //npc 选择
            n_mz_select:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                      i=t.selectedIndex;
                      if(i>-1){
                            gFun.qhNull();//因切换对象 ,在下一个之前重置数据
                            d=a.npc_mz[i];//选中的npc {a:npcMz,b:npcId}
                            ZD=GD.d[d.b];// npc数据
                            //处理显示npc 已编辑部分的 数据 
                            gFun.npc_dz_d();//显示npc 动作名称列表,并显示第一个动作的 第一帧
                      };
            },
            //双击删除大类, 必须先清空其下npc才行
            del_dl:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                      if(PD){//存在选择大类时
                          d=JSON.stringify(PD);
                          if(d==='{}'){//空的大类, 允许删除
                              i=b.d_fl.selectedIndex;//选中的大类
                              e=a.npc_fl[i]; //待删除大类命名
                              delete GD.c[e]; //删除大类数据
                              a.npc_fl.splice(i,1);//app中 删除
                              a.npc_fl='update';//刷新
                              b.d_fl.onchange();//触发一次重定向分类
                              return;
                          };
                          tipFun('必须先清空 其分类下的所有 NPC !!!',1);
                      };
            },
            //双击删除npc 
            del_mz:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                        if(PD){//存在选择大类时
                          
                              i=b.d_mz.selectedIndex;//选中的npc索引
                              if(i>-1){ //存在选中
                                    e=a.npc_mz[i]; //待删除npc {a:名字,b:id};
                                    d=e.a;//名字
                                    delete PD[d]; //删除 从npc分类中
                                    delete GD.d[e.b]; //删除 从id数据中
                                    a.npc_mz.splice(i,1);//app中 删除
                                    a.npc_mz='update';//刷新
                                    gFun.qhNull();//因切换对象 ,在下一个之前重置数据
                                    b.d_mz.onchange();//触发一次重定向npc (指向其它npc)
                                    
                                    return;
                              };
                              tipFun('必须先清空 其分类下的所有 NPC !!!',1);
                        };
            },
            //dz类型 面向选择  (checbox)
            dz_lx_mx:function(){
                 var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                     d=t.getAttribute('t').split(','); //[-1,-1]
                     d[0]=d[0]<<0,d[1]=d[1]<<0;
                    
                     if(d[0]===0){//修改动作类型 d[0]=>(-1:自定义,0:站立,1:行走,2:哈欠/懒腰,3:攻击,4:施法),
                         a.lx=d[1];
                     }else{//1 修改面向   d[1]=(-1:无面向,0:左,1:右,2:上,3:下)
                         a.mx=d[1];
                     };
            },
            //添加新动作
            btn_add_dz:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n,u; 
                      e=a.dz_name.trim();//动作名称 
                      if(e&&ZD){//存在可操作对象
                           if(ZD.d[e]===u){//未使用的名称
                                    d=gFun.getId(ZD.a); //获取顺位id
                                    ZD.d[e]={
                                          a:d, //动作id
                                          b:e, //动作名称
                                          c:[], //每帧显示时间
                                          d:[20,20,80], //0:中轴(左面向), 1,2:状态buf基本位置  ,默认 20,20,80
                                          t:[-1,-1],//默认自定义动作 ,  无面向
                                          e:[]//dh数据   
                                    };
                                    gFun.npc_dz_d(ZD.d[e]);//刷新动作列表, 并显示当前新动作
                                    g=a.dz_fl;//[动作名称集合]
                                    i=g.indexOf(e);
                                    k=b.d_dz;//selectDOm
                                    k.selectedIndex=i; //显示 该动作名称
                                    a.dz_name='';
                           }else{
                                tipFun('已有动作!!!');
                           };
                      };
            },
            //动作列表选择变化
            dz_select:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n,u; 
                      m=t.value;//动作名称
                      if(dzD&&dzD[m]){ //存在动作数据
                          d=dzD[m];
                          gFun.npc_dz_d(d);//显示指定动作
                      };
            },
            //删除动作 (双击)
            btn_del_dz:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n,u; 
                       e=b.d_fl.value;//动作名称 
                      if(e&&dZ){ //dz:当前动作
                            //dzD:动作集合
                           if(dzD[dZ.b]){//存在这个动作
                               delete dzD[dZ.b]; //删除 动作
                               i=ZD.a[dZ.a];// 查找当前 动作id 的索引位
                               ZD.a.splice(i,1);//删除当前id (标记未使用)
                               gFun.npc_dz_d();//刷新动作列表
                               a.dz_name='';
                           }else{
                               tipFun('动作不存在');   
                           }; 
                      };
            },
            //废弃,改成全部手动设置
            //生成动作镜像( 双击基于某个动作的镜像)   选择时: d_dz_jx=>disabled=true ,  d_area.style.pointerEvents=true 
            /* dz_jx:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n; 
                      d=b.d_dz_jx.$_value; //镜像动作名称
                      if(dzD[d]){//存在的动作数据
                          gFun.cj_dz_jx(dzD[d]); //
                      };

            }, */
            //添加帧 (向当前动作)
            add_fps:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n,r; 
                      if(dZ){//有当前正在编辑的的动作
                              e=a.cfg;
                              n=e.sj;// 时间
                              r=/^[0-9]*$/; //0-??? 的整数
                             if(r.test(n)){ 
                                    gFun.imgXzOrSf();//释放选中图片
                                    n=n<<0;
                                    e.sj=n;
                                    dZ.c.push(n);//添加对应帧时间
                                    d=dZ.e; //帧集合
                                    d.push([]); //添加帧
                                    
                                    e.fn=d.length;//总帧数
                                    e.nn=d.length-1;//指示当前帧
                                    gFun.npc_dz_fps(dZ,e.nn);// 当前动作 , 指定帧 
                             }else{
                                   tipFun('时间值 错误, 必须 >=0的 整数, 其中0表示无限 ')
                             };
                      };
            },
            //删除帧
            del_fps:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                  if(dZ){//存在使用编辑中的动作
                        e=a.cfg;//属性集合
                        l=e.fn;//当前总帧数
                        if(l>0){
                              n=e.nn;//当前显示的帧
                              dZ.c.splice(n,1); //删除当前帧计时
                              dZ.e.splice(n,1);//删除帧数据
                              l--,e.fn=l;// 总帧数-1;
                              if(l===0){//空帧
                                    n=-1;
                              }else if(n===l){//删除的帧 是最后一帧 
                                    n=l-1;
                              }else{};// 还是继续显示当前 n 值 帧
                              gFun.imgXzOrSf();//释放选中的 img
                              gFun.npc_dz_fps(dZ,n);// 当前动作 , 指定帧
                              if(n===-1)e.nn=-1; //防止被覆盖 -1 提示没有当前帧
                        };
                  }; 
            },
            //上一帧
            pre_fps:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                        if(dZ){//有当前正在编辑的的动作
                              d=a.cfg;
                              l=d.fn;//总帧数
                              if(l>1){//大于1才有翻帧意义
                                  n=d.nn;//当前帧
                                  n--;
                                  if(n<0)n=l-1;
                                  d.nn=n;
                                  gFun.imgXzOrSf();//释放选中图片
                                  gFun.npc_dz_fps(dZ,d.nn);// 当前动作 , 指定帧 
                              };
                        }; 
            },
            //下一帧
            next_fps:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                        if(dZ){//有当前正在编辑的的动作
                              d=a.cfg;
                              l=d.fn;//总帧数
                              if(l>1){//大于1才有翻帧意义
                                 n=d.nn;//当前帧
                                 n++;
                                 if(n===l)n=0;
                                 d.nn=n;
                                 gFun.imgXzOrSf();//释放选中图片
                                 gFun.npc_dz_fps(dZ,d.nn);// 当前动作 , 指定帧 
                              };
                        };
            },
            //当前帧向前移动
            fps_move_pre:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                        if(dZ){//有当前正在编辑的的动作
                              d=a.cfg;
                              l=d.fn;//总帧数
                              if(l>1){//大于1才有翻帧意义
                                    n=d.nn;//当前帧
                                    if(n===0)return; //已经是最前了
                                    gFun.imgXzOrSf();//释放选中图片
                                    d.nn--;
                                    e=dZ.e;//全部帧
                                    f=e[n]; //当前帧数据
                                    g=e[n-1];//上一帧数据
                                    //调换
                                    e[n]=g;
                                    e[n-1]=f;
                              };
                        }; 
            },
            //当前帧向后移动
            fps_move_next:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n; 
                        if(dZ){//有当前正在编辑的的动作
                              d=a.cfg;
                              l=d.fn;//总帧数
                              if(l>1){//大于1才有翻帧意义
                                    n=d.nn;//当前帧
                                    if(n===l-1)return; //已经是最后了
                                    gFun.imgXzOrSf();//释放选中图片
                                    d.nn++;
                                    e=dZ.e;//全部帧
                                    f=e[n]; //当前帧数据
                                    g=e[n+1];//后一帧数据
                                    //调换
                                    e[n]=g;
                                    e[n-1]=f;
                              };
                        }; 
            },
            //播放 (任何其它操作都会打断 )
            play:function(){ 
                  gFun.play();
            },
            //点击 向当前帧添加 图片 
            addImg:function(){
                  if(cF===1&&dZ&&zyImg){ //符合条件
                         gFun.addImg();
                  };
            },
            //当图片加载完
            imgLoad:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d=t.$_data.d,e,f,g,h,i,j,k,l,m,n; 
                     //d=[imgId,w,h,x,y,jx,yy,xs,wy] ,//0:imgID,1:w,2:h,3:x,4:y,5:jx镜像(0:否,1:是),6:显示(此无)(0:隐藏,1:显示),7:wy(位移轴 -5~5) 
                     e=t.style;
                     e.width=d[1]+'px';
                     e.height=d[2]+'px';
                     e.left=d[3]+'px';
                     e.bottom=d[4]+'px'; //从下往上算
                     e.transform=d[5]===1?'scale(-1,1)':''; //d[5]===1存在镜像
            },
            //选中img图片
            imgXz:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d=t.$_data.d,e,f,g,h,i,j,k,l,m,n; 
                     //d=[imgId,w,h,x,y,jx,yy,xs,wy] ,//0:imgID,1:w,2:h,3:x,4:y,5:jx镜像(0:否,1:是),6:显示(此无)(0:隐藏,1:显示),7:wy(位移轴 -5~5)
                     xzImg=t;
                     t.style.border='1px solid red';
                     gFun.imgXzOrSf(d,1);//选中
                     
            },
            //(双击)删除选中图片
            img_del:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d=t.$_data.d,e,f,g,h,i,j,k,l,m,n; 
                      if(dZ&&xzImg){
                            e=a.cfg;
                            if(e.f===1){//有选中的图片
                                n=e.nn;//当前帧
                                g=dZ.e[n]; //当前帧数据
                                if(g){
                                     i=xzImg.getAttribute('index')<<0;
                                     if(i>-1){//当前有选中的图片数据索引
                                          g.splice(i,1); //s删除
                                          c.index=-1;
                                          gFun.npc_dz_fps(dZ,n);//刷新显示 当前帧的数据
                                     }; 
                                }
                                gFun.imgXzOrSf();//清除img选中
                            };
                      };
            },
            //img镜像 切换
            xz_jx:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                      d=t.checked;
                      a.cfg.jx=d?1:0;
            },
            //img阴影层 切换
            xz_yy:function(){
                  var t=this,a=t.$_gData,b=t.$_items,c=t.$_cache,d,e,f,g,h,i,j,k,l,m,n;
                      d=t.checked;
                      a.cfg.yy=d?1:0;
            },
      },
      created:function(i,c){
            d_fl=i.d_fl,
            d_mz=i.d_mz,
            d_dz=i.d_dz,
            d_dz_jx=i.d_dz_jx;
      }
});

gFun.init();// test
//npc 可移动编辑框~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
(function(){
 var x=200,y=80,x2=200,y2=80,st=npc_add.style; //x,y:初始 left ,bottom  ,x2,y2:移动后的坐标,移动结束后覆盖x,y     
 var sx=0,sy=0;//初始点击位置
 var mF=0; 
    //移动开始     
    npc_add.addEventListener('mousedown',function(e){
           mF=1; 
           sx=e.pageX,sy=e.pageY; //初始点击位置
    });
    npc_add.addEventListener('mousemove',function(e){
            if(mF===0)return;
          var dx,dy;
              dx=e.pageX,dy=e.pageY; //新位置
              x2=x+dx-sx;
              y2=y-(dy-sy); //从下往上
              st.left=x2+'px';
              st.bottom=y2+'px';
              
    });
    //结束移动判断
    npc_add.addEventListener('mouseup',function(e){
          if(mF===0)return;
           mF=0,x=x2,y=y2;
    });
    //结束移动判断
    npc_add.addEventListener('mouseout',function(){
            if(mF===0)return;
             mF=0,x=x2,y=y2;
    });
    //整个容器框 双击 复位
    npc_show.ondblclick=function(){
           x=200,y=80  
            st.left=x+'px';
            st.bottom=y+'px';
    };
})();


var cF=0; //1:允许添加,0:禁止
//快捷键操作~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
(function(){

      
window.addEventListener('keydown',function(e){
         if(openF===0)return;
     var a=e.keyCode;
  
         if(a===17){//ctrl
             cF=1;
         };
         if(a===27){//esc 取消选中
            if(xzImg){
                  gFun.imgXzOrSf();//释放选中图片
            };
         };
});
window.addEventListener('keyup',function(e){
      if(openF===0)return;
      var a=e.keyCode;
         if(a===17){//ctrl
            cF=0;
         };
});
window.addEventListener('blur',function(e){
      if(openF===0)return;
       cF=0;
      
});
//add... 优先级高
mDom.addEventListener('mousedown',function(){
      
      gFun.play(1);//停止播放 
});

})();


})();