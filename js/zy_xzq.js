/* 
地图资源选择器 面板 功能区

*/

(function(){
var mDom=document.getElementById('map_sc_xzq');//整个功能区
var button=mDom.getElementsByClassName('map_sc_mk')[0].getElementsByTagName('button');//子功能按钮 [图片/音频, 组合动画 , 天气效果 , NPC , 触发器  ]
var treeML=mDom.getElementsByClassName('map_sc_tree')[0];//目录树区域  ( 动画 , 图/音 ,  共用)
var zy_tp_yp=mDom.getElementsByClassName('map_sc_img_zy')[0];//图片和音列表资源选择区
var sxMk=mDom.getElementsByClassName('map_sx_mk');;//参数面板 [0:img参板 , 1:音频参板 ,2:帧动画演示区,3:帧参板 ]

var app=new Eng({
      el:mDom,
      data:{
          //资源 目录树 ( 图片/音频 , 动画, )
          mlTree:[
               /*  {  name:'', //主目录
                    show:false,//  false:初始隐藏二级目录  show 影响 state
                    state:'＋', // 默认 + (提示展开)
                    child:[{name:''}]
                } */
          ],
          //图片/音频 资源区
          zy_tp_yp:[
               //{src,id,w,h,t},
          ],
          //img属性模板 
          sx_mk_0:{
               id:'',w:'',h:'',t:'',jx:0,xz:[0,0,0], //t:(1:img , 2:音频)     xz:三个参数[0=>(0:地表,1:实体,2:装饰) , 1=>(0:左下,1:右下,2:左上,3:右上) , 2=>(0:唯一,1:重复,2:随机,3:随机重复)]
               //jx=>0:非1镜像                       
          },
          //音频属性模板
          sx_mk_1:{
               id:'',xz:1, //xz=>0:背景音,1:地图音源
          },
          //帧动画属性
          sx_mk_2:{
              id:'',fn:'',fx:'',lx:'', xz:0,   //xz=> 0:地表 1:实体 2:实体
          },
          //
          dhData:[
               // {x:10,y:60,w:40,h:40,src:'0.png',yf:false,xs:true,jx:false,wy:0},
          ],

      },
      watcherFor:{
            //目录树
            mlTree:function(items,cache){
                var a,b,c,d,e,f,g,h,i,j,k,l;
                    a=items.$_data; //当前数据
                    b=a.show;
                    if(b===true){//展开
                        a.state='━';
                    }else{//收缩状态
                        a.state='+';
                    };
                    c=a.name;
                    a=a.child;
                    i=0,l=a.length;
                    while(i<l){
                        d=a[i];
                        d.path=c+'/'+d.name;
                        i++;
                    }; 
            },
            
      },
      watcher:{
          //area0 img镜像按钮
          'sx_mk_0.jx':function(o,n,i,c){
               if(n===0)i.img_jx.checked=false;
          },
      },
      event:{
          //关闭销毁整个面板
           ui_close:function(){
               say('123123');
              gFun.destroy();//关闭所有, 清空数据
           },
          //目录树~~~~~~~~~~~~~~~~~~~~~~~~~
          //点击 展开或收缩 二级列表 (源目录 和 动图目录)
            zk_ss:function(){
                var t=this,d=t.$_data,i=t.$_items,a,b,c,u,f,index;
                    //'＋','━'
                    f=d.show;
                    d.show=f?false:true; 
                    t.textContent=f?'＋':'━';
            },
            //选择二级目录 (显示对应资源  普通资源 / 帧动画 /  )
            xz_zml:function(){
                var t=this,gf=gFun,a=gf.gn,b;
                    b=t.getAttribute('path').split('/')
                    if(a===0){//显示 图片/音频 资源
                         gf.tpYpShow(b); //显示具体资源列表
                    }else if(a===1){
                         gf.dhShow(b); //显示帧动画
                    };
            },
            //area0 点击选中img/音频资源
            xz_zy_0:function(){
                var t=this,d=t.$_data;
                    gFun.zy_xz_0(d);// 显示对应属性面板
            },
            //area0 img类型选择 (地表,地面)
            xz_lx_img:function(){
                var t=this,a,b=app.sx_mk_0.xz;
                    a=t.getAttribute('lx').split(','); //[n1,n2] n1=0=(n2>0:地表,1:实体,2:装饰) ,n1=1=(n2>0:左下,1:右下,2:左上,3:右上), n1=2=(n2>0:唯一,1:重复,2:随机,3:随机重复) 
                    a[0]=a[0]<<0;
                    a[1]=a[1]<<0;
                    b[a[0]]=a[1];
                    gFun.zy_xz_cz(0);//去重 选中的checked
            },
            //area0 audio类型选择
            xz_lx_audio:function(){
                var t=this,a,b=app.app.sx_mk_0;
                    a=t.getAttribute('lx'); //0:img,1:audio
                    b.xz=a;//
                    gFun.zy_xz_cz(1);
            },
            //area0 img类型点击镜像按钮
            jx_check:function(){
                var t=this,a;
                    a=t.checked;
                    app.sx_mk_0.jx=a?1:0;// 1:镜像,0:非镜像
            },
            //area1 图片加载
            imgload:function(){
                var t=this,d=t.$_data,g=t.$_gData,c=t.$_cache,a,b,e,f,x,y;
                    // say('img 加载~~~~~')
                    //d={x,y,w,h,yf,src} //修改自身的 x,y,w,属性
                    a=t.style;
                    x=d.x,y=d.y;
                    a.width=d.w+'px';
                    a.height=d.h+'px';
                    a.left=x+'px';
                    a.bottom=y+'px';
                    a.display='block';
                    a.transform=d.jx?'scaleX(-1)':'';
                    a.opacity=d.xs?'':0.3;//隐藏的透明显示(非播放时)
            },
            //area1 动画类型选择 (地表,实体,附加装饰:暂禁)
            xz_dh_lx:function(){
                var t=this,a,b=app.sx_mk_2;
                    a=t.getAttribute('lx')<<0; //0:地表,1:实体,2:装饰
                    b.xz=a;
                    gFun.dhLxXz();//切换选中的 checkbox
                    gFun.zy_dh(); //切换类型 重新发送数据
            },
            //area1 动画滚轮翻页
            dh_wheel:function(e){
                var a=e.wheelDelta;
                    if(a>0){//上翻
                        gFun.dhFpsShow(2,1);// (2上翻,1下翻), 1:翻页
                    }else{//下翻
                        gFun.dhFpsShow(1,1);// (2上翻,1下翻), 1:翻页
                    };
            },
      },
      created:function(i,c){

      }
});

//公共方法~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gFun={
    gn:-1,  //当前使用中的功能列表  0:图片/音频, 1:帧动画 2:
    switch:function(n){ //开关 ,根据功能区 , 开关dom显示区域
        var t=this,a=t.gn;
           if(a>-1){//存在之前打开的功能区
               if(n===a)return; //禁止无意义重复打开
               if(a===0){//关闭 图片/音频 功能区
                    t.tpYpClose();//关闭 图片/音频功能区
               }else if(a===1){ //
                    t.dhCLose();//关闭 dh功能区
               }else if(a===2){

               };
               t.gn=-1;
           };
            t.gn=n; //记录当前开启的功能区
            if(n===0){//打开 图片/音频 功能区
                 t.imgYpinit()
            }else if(n===1){//打开帧动画功能区
                 t.dh_init();
            }else if(n===2){

            }; 
    },
    //普通 图片和音频功能区
    tpYpArea:function(){
        var t=this,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O;
            //A:G_cfg.img_tree.data
            //B:项目path 
            //C:图片属性区选框 [ 4,5,6:(地表,实体,附属装饰组) ; 7,8,9,10:(左下,右下,左上,右上对齐祖) ; 11,12,13,14:(唯一,重复,随机,随机重复)]
            //D:音频属性区选框 [ 1:背景音,2:地图音源]
            //O: 选中对象的属性
            //图片和img 资源初始化  (生成目录树数据)
            t.imgYpinit=function(){
                var O=G_cfg,a,b,c,d,e,f,k,v,o,p;
                    //生成 app.treeF的数据
                    a=O.img_tree.data,d=[];
                    A=a,B='./|'+O.project.path+'/img/';
                    if(a){//存在目录树
                        for(k in a){
                            c=a[k];
                            b={name:k,show:false};
                            e=[];
                            for(v in c){
                                e.push({name:v});
                            };
                            b.child=e;//
                            d.push(b);
                        };
                        app.mlTree=d;
                    }; 
                     
                     treeML.style.display='block'; //显示目录区
                     zy_tp_yp.style.display='block';//显示 图片资源区 
                     C=sxMk[0].getElementsByTagName('input');//图片属性区选框
                     D=sxMk[1].getElementsByTagName('input');//音频属性选框

                     G_cz.fun.zy_xz=t.zy_img_yp;// 对应此时的数据模块
           };
           //根据目录路径 显示图片/音频资源
            t.tpYpShow=function(a){//a:[path/pth]
             var b,c,d,e,f,g,h,i,j,k,l,m,n;
                 b=A[a[0]][a[1]]; //{{id:N,size:[w,h],src:'N.png',t:(1图2音频)}}
                 d=[];
                 for(k in b){
                      c=b[k];//{id:N,size:[w,h],src:'N.png',t:(1图2音频)}
                      d.push({
                          id:c.id,
                          w:c.size[0],
                          h:c.size[1],
                          src:B+c.src,
                          t:c.t===1?0:1   // 0图,1音
                      });                      
                 };
                 app.zy_tp_yp=d;
            },
            //选中 图片/img 和资源 
            t.zy_xz_0=function(a){// a={t,w,h,id}
                var b,c,d,e,f,g,h,i,j,k;
                    if(a.t===0){//img
                        sxMk[0].style.display='block';//展开img属性
                        sxMk[1].style.display='none';//隐藏音频属性
                        t.zy_xz_cz(0);//重置默认选择
                        O={id:a.id,w:a.w,h:a.h,t:a.t,jx:0,xz:[0,0,0]};// xz:默认选择方式 [(0:地表,1:实体,2:装饰) ; (0:左下,1:右下,2:左上,3:右上) ; (0:唯一,1:重复,2:随机,3:随机重复)]
                        app.sx_mk_0=O;
                        t.zy_xz_cz(0);//重置默认选择
                    }else if(a.t===1){//音频
                        sxMk[0].style.display='none';//隐藏img属性
                        sxMk[1].style.display='block';//展开音频属性
                        t.zy_xz_cz(1);//重置默认选择
                        O={id,xz:1}; //xz=> 0:背景音 1:音源
                        app.sx_mk_1=O;
                        t.zy_xz_cz(1);//重置默认选择
                    };
                    // say(O);
                    t.zy_img_yp();//发送初始数据
            };
            //资源选择重置 , 因切换选中 (重置checked ,避免多选)
            t.zy_xz_cz=function(n){ //0:img ,2:音频
                var a,b,c,d,i,l;
                    a=app.sx_mk_0.xz;
                    if(n===0){//img
                       //a=[0,0,0] 
                        i=4,l=7,c=0;
                        while(i<l){//4,5,6
                            C[i].checked=c===a[0]?true:false;
                            i++,c++;
                        };
                        i=7,l=11,c=0;
                        while(i<l){//7,8,9,10
                            C[i].checked=c===a[1]?true:false;
                            i++,c++;
                        };
                        i=11,l=15,c=0;
                        while(i<l){//11,12,13,14
                            C[i].checked=c===a[2]?true:false;
                            i++,c++;
                        };
                    }else if(n===1){//音频
                         //a=> 0:背景音,1:音源
                         D[1].checked=a===0?true:false;
                         D[2].checked=a===1?true:false;
                    };
                    t.zy_img_yp();//每次修改发送数据
            };
            //推送当前 使用的数据 到map编辑器(map_editor.js)
            t.zy_img_yp=function(){
                var a,b=O,c,d,e,f,g;
                    if(!b)return;
                    //a=[0:zw,1:zh,2:w,3:h,4:mw,5:mh,6:sw,7:sh]
                    if(b.t===0){//img
                        //[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f]; //imgN=>(0:正常,1:镜像),f=>楼层
                           d=[b.id,b.jx,0,0,b.w,b.h,1,0,0,1]; //默认都在1层      
                           a=[0,reNew(b.xz),[d]];  //0:普通图片,1:(待填充数据类型,处理方式),2:数据  
                           G_cz.fun.map_bjq.mbj_get_d(a);
                           G_cz.fun.npcFun.getImg(d);
                    }else{//音频

                    };
            };
            //该功能区关闭
            t.tpYpClose=function(){
                    O=null;
                    G_cz.fun.map_bjq.mbj_get_d(O);//关闭时发送一个空数据,避免关闭时添加仍然失效
                    app.mlTree=[];//清空目录树
                    app.zy_tp_yp=[];//清空显示资源列表
                    treeML.style.display='none'; //显示目录区
                    zy_tp_yp.style.display='none';
                    sxMk[0].style.display='none';//隐藏 图片属性
                    sxMk[1].style.display='none';//隐藏 音频属性 
            };      
    },
    //帧动画 区
    fpsDhArea:function(){
        var t=this,A,B,C,D,E,F,G,H,I,J,K,L,M,N,X,Y,ID,ST;
            //A:动画数据 {id:{}}
            //B:目录数据  根指向  id_data
            //C:OBJ dh全部数据
            //D:fps 帧数据(全部)
            //L:帧数据长度
            //P:基础路径 img的
            //X,Y:
            //E:[inputx3] 0:地表,1实体,2装饰
            //帧动画初始化
            t.dh_init=function(){
                var O=G_cfg,a,b,c,d,e,f,k,v,o,p
                    a=O.img_pj_dh,d=[];
                    A=a.id_data;
                    B=a.ml_tree;
                    a=B;
                    P='./|'+O.project.path+'/img/';//项目img路径
                    for(k in a){
                        c=a[k];
                        b={name:k,show:false};
                        e=[];
                        for(v in c){
                            e.push({name:v});
                        };
                        b.child=e;//
                        d.push(b);
                    };
                    app.mlTree=d;
                    treeML.style.display='block'; //显示目录区 
                    sxMk[2].style.display='block';//帧动画区
                    sxMk[3].style.display='block';//帧属性
                    E=sxMk[3].getElementsByClassName('dom_lx');//地表,实体,装饰_类型选择
            };
            //根据目录路径 显示动画资源  (设置基点线 , 基点位置 )
            t.dhShow=function(a){//a:[path/pth]
                var b,c,d,e,f,g,h,i,j,k,l,m,n;
                    b=B[a[0]][a[1]];// dhId
                    ID=b;
                    C=A[b]; //{t:(true:循环播放,false:单次),dh:(0切换1过渡),jd:[x,y],id:[包含imgId暂未],list:[帧序],time:[帧时],fps:[帧数据],gx:[过渡关系]}
                    X=C.jd[0],Y=C.jd[1];//基点 x,y
                    D=C.fps;//
                    L=D.length;//帧数据长度
                    I=0; //初始播放帧
                    // id:'',fn:'',fx:'',lx:'', xz:0,
                    app.sx_mk_2={id:b,fn:D.length,fx:C.list.join(','),lx:C.dh===0?'切换':'过渡', xz:1}//id,帧数,帧序,类型,选中:()
                    t.dhFpsShow(0);//
                    t.dhLxXz();//动画类型选择,重置为默认实体
                    t.zy_dh();
            };
            //显示指定帧的数据
            t.dhFpsShow=function(a,f){//f=>1:滚轮翻帧,0:指定帧 (a=帧index)  
                var b,c,d,e,g,h,i,j,k,l,m,n;
                    clearTimeout(ST);
                    if(f===1){//滚轮翻页
                        if(a===1){;//下一帧
                            I++;
                            if(I>=L)I=0;
                        }else if(a===2){//上一帧
                            I--;
                            if(I<0)I=L-1;
                        };
                   }else{//指定页
                        I=a; 
                   };
                   ST=setTimeout(function(){//避免无意义翻页
                        b=D[I]; //显示帧数据
                        d=[];
                        i=0,l=b.length;
                        while(i<l){
                            c=b[i]; //[imgId,w,h,x,y,jx,yy,xs,wy],
                            d.push({
                                src:P+c[0]+'.png',
                                w:c[1],h:c[2],x:c[3]+X,y:c[4]+Y,
                                jx:c[5]?true:false,
                                yf:c[6]?true:false,
                                xs:c[7]?true:false,
                                wy:c[8],
                            });
                            i++;
                        };
                       app.dhData=d;
                   },100);
            };
            //动画类型选择
            t.dhLxXz=function(){
                var a,b,c,d,e,g,h,i=0,l=3,m,n;
                    a=app.sx_mk_2.xz; //0:地表1实体2附着装饰
                     while(i<l){
                         E[i].checked=a===i?true:false;
                         i++;
                     };
            },
            //向map 编辑器传递动画数据
            t.zy_dh=function(){
                  var a=app.sx_mk_2.xz,b,c,d=[[]],s,e,f,g,i=0,l=L,o;
                    //a=> 0:地表 , 1:实体 , 2:附着装饰(暂禁)
                       while(i<l){
                           b=D[i];//[  [imgId,w,h,x,y,jx,yy,xs,wy],.. ]
                           c=[];
                           d.push(c);
                           s=0,e=b.length;
                           while(s<e){
                               o=b[s];//[0:imgId,1:w,2:h,3:x,4:y,5:jx,6:yy,7:xs,8:wy]
                               c.push([o[0],o[5],o[3],o[4],o[1],o[2],o[7],o[6],o[8]]); //[0:imgId,1:imgN,2:x,3:y,4:w,5:h,6:xs,7:yy,8:wy,9:f(此处无)],
                             s++;
                           };
                        i++;
                       };
                       d[0]=[C.t?1:0,C.dh,C.list,C.time,2,1,ID,C.gx];
                        //0:lx=>0:单次,1:循环播放
                        //1:dh=>0:切换动画,1:过渡动画
                        //2:list=>[n,n,n,n] 帧序
                        //3:time=>[j,j,j,j] 帧时
                        //4:bf=> 0:停止 1:播放中,2:初始化   (生成5,6值 ,初次执行时,避免判断第0帧直接略过 , 储存地图时 5,6值delete, 该值若为1改成 2, 0仍旧是0)
                        //5:f=>  0,1,2,3,4  层 ( 默认 1, 通常是  )
                        //6:id+> dhId
                        //7:gx
                        G_cz.fun.map_bjq.mbj_get_d([1,a,d]);//传递数据

            };
            //该功能模块关闭
            t.dhCLose=function(){
                    G_cz.fun.map_bjq.mbj_get_d(null); //关闭时传递空数据 (防止添加仍然有效)
                    app.mlTree=[];
                    app.dhData=[];
                    app.sx_mk_2={};
                    treeML.style.display='none'; //目录区 
                    sxMk[2].style.display='none';//帧动画区
                    sxMk[3].style.display='none';//帧属性
            };
            
    },
    //关闭销毁整个 ui 面板, 清空数据
    destroy:function(){
        var t=this,l=4,a=app;
            mDom.style.display='none';//关闭整个区域
            while(l--){
                sxMk[l].display='none'; //关闭4个属性面板  //参数面板 [0:img参板 , 1:音频参板 ,2:帧动画演示区,3:帧参板 ]
            };
            zy_tp_yp.style.display='none';//关闭图片音频资源选择区 
            treeML.style.display='none'; //关闭目录树   ( 动画,图/音,  共用)
            G_cz.fun.map_bjq.mbj_get_d(null);//关闭时发送一个空数据,避免关闭时地图添加仍然失效
            a.mlTree=[];//清空目录树
            a.zy_tp_yp=[];//清空 图/音 资源区
            a.dhData=[];//清空动画演示区

    },
};


gFun.tpYpArea();
gFun.fpsDhArea();
G_cz.xzqFun=gFun;


//点击 (图片/音频) 按钮
button[0].onclick=function(){
       gFun.switch(0);// 0:启用 图片/音频 功能区
};
button[1].onclick=function(){
       gFun.switch(1);// 0:启用 帧动画 功能区
};









})();