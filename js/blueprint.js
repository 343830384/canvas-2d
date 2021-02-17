(function(){
var openF=0; //整个功能区  1:打开,0:关闭   (默认0 ,test:1)  
var mDom=document.getElementById('blueprint'); //整个蓝图层
var lu=mDom.getElementsByClassName('lu_content')[0];//蓝图区域 整个(移动缩放模板)
var lu_bar=mDom.getElementsByClassName('lu_bar')[0];//顶部 事件类型分类 显示选择区
var lu_list_area=mDom.getElementsByClassName('lu_list_area')[0];//整个子选项区
var lu_list_bar=lu_list_area.getElementsByClassName('lu_list_bar'); //0:地图,1:UI,2:NPC,3:任务,4:物品,5: 几个分类事件功能区
var lu_crud_lx=mDom.getElementsByClassName('lu_crud_lx')[0]; //增删改查 创建蓝图区域
var svg=mDom.getElementsByClassName('lu_svg')[0];  // 
var xywh=[0,0,1920,1000]; // [x,y,w,h] 当前编辑蓝图的默认 位置 和 宽高 

var QD=null;//所有 蓝图/逻辑区数据
var DD=null;//当前编辑 蓝图数据 
    /* {  //示例
        
        a:'蓝图id',
        b:'蓝图描述',
        c:[x,y,w,h], //蓝图位置和宽高
        d:[], //子元素id 列表 ,用于查重
        e:{//子元素
            id0:ZD
        }
    }; */
var ZD=null;// 选中的 蓝图子数据
{ //zd= > 全示例
 /* {
           a:'子元素id',        //都有 (基于当前蓝图)
           b:[x,y], 子元素位置 默认初始化0,0
           t:类型=>{      //直接0-n 下面为分类标注
                   0:地图,1:地图触发器,2:地图数据修改,3:天气/时间修改,4:音效修改,5:地图切换
                 },
           d:[
               [[逻辑数据], [svg数据]], //每条数据
           ]
       }
      0:{//地图
             a:id,
             t:0,
             b:[0,0], //当前子元素的默认 x,y  , 宽高没必要, 因为 
             d:[
                 [[-2], [[10,154],[191,154]],[]] // 0: [条件], 1:[svg锚点],2:[[zdId,dN,N], ] //svg连接数据,值对应1的索引 
                  //0=> -2:无默认; -1:全部 ; 大于0=指定地图id(每个用 , 分隔) 1=> 左右锚点相对位置 (基于子元素左上角)
             ], 
      },
      1:{//地图触发器
            a:id,
            t:1,
            b:[0,0],
            d:[
                [ [ [地图0,...][[坐标n],...],[[时间n],...],[天气0,天气1] ],[[svg],..,[]]
            ]
      },
     
    */
};  
//事件大类 工具条 开关
lu_bar.addEventListener('click',function(e){
    var a=e.target,b=a.getAttribute('n'),c;
        if(b!==null){
              b=b<<0;//0:地图,1:UI,2:NPC,3:任务,4:物品
              c=lu_list_bar[b];//对应的区域
              b=c.getAttribute('f')<<0; //0:关,1:开
              c.style.display=b===1?'none':'block';
              c.setAttribute('f',b?0:1);
        };
});
//事件子元素 点击 添加
lu_list_area.addEventListener('click',function(e){
      var a=e.target,b=a.tagName,c,d,e,f;
          if(b==='BUTTON'){
              c=a.getAttribute('e');
              //0-9=>0:地图,1:地图触发器,2:地图数据修改,3:天气/时间修改,4:音效修改,5:地图切换
              //10-19=>
              //20-29=>
              //30-39=>
              //40-49=>
              //50-59=>
              f=MK[c]; //对应的添加方法
              if(f)f();//
          };
});

//公共方法
var gFun={
     //G_cfg 上查询已有 蓝图id 列表  (打开面板时调查)
     init:function(){
           var a=G_cfg.logic,b,c,d,e,f,g,h,i=0,l;
               QD=a,d=[,]; 
               if(a.id){
                   l=a.length;
                   while(i<l){
                       b=a[i]; //{a:id,b:描述,..}
                       d.push({a:b.a,b:b.b,c:''});
                       i++;
                   };
               }else{
                   a.id=[]; //初始化创建默认数据 (未使用的原因)
               };
               APP.list=d;
     },
     //获取 顺序id  蓝图/子元素id 非重复id 获取
     getId:function(d){// d => G_cfg.logic.id(蓝图id) 或 其子元素.b
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
     //创建新蓝图
     cj_lt:function(){
         var t=this,a=QD.id,b;
             t.clear();//清空之前的蓝图数据
             b=t.getId(a);
             QD[b]={ //创建新的蓝图
                 a:b, //id
                 b:'空描述',//子元素id 查重顺序列表
                 c:[0,0,1920,1000],//蓝图 默认 x,y,w,h
                 d:[], //子元素id查重
                 e:{}//子元素id数据区
             }; //
             DD=QD[b];
             xywh=DD.c;//新蓝图默认宽高
             t.lt_cz_xywh()//重置蓝图位置 和 宽高
             
     },
     //创建子元素 (要依据每种类型判断)
     cj_zd:function(){

     },
     //重置蓝图宽高和位置
     lt_cz_xywh:function(){
         var a=lu.style;
             a.width=xywh[2]+'px';
             a.height=xywh[3]+'px';
             a.transform='translate(0px,0px) scale(1,1)';
     },
     //因切换/创建蓝图 先清除缓存dom 和 svg
     clear:function(){
        var a,b,c,d,e,f;
            ZD=null;
            a=lu.childNodes,b=a.length;
            // 清空子元素面板 ,不包括svg [0]那个
            while(b--){
                if(b>0)delDom(a[b]); //0是 svg
            }; 
            svg.innerHTML=''; 
     },
     //关闭
     close:function(){
         var a,b,c,d,e,f;
             QD=null,DD=null,ZD=null;//清空当前编辑中的数据
             a=lu.childNodes,b=a.length;
          // 清空子元素面板 ,不包括svg [0]那个
             while(b--){
                 if(b>0)delDom(a[b]); //0是 svg
             };
             //清空svg
             svg.innerHTML='';
     }

};

//针对 蓝图 增删改查按钮区域 
var APP=new Eng({
    el:lu_crud_lx,
    data:{
        list:[// 已创建蓝图列表
            // {a:'id',b:'描述',c:'id , 描述........'},
        ],
        ms:'', //描述
        now:0,//当前操作数据下标 , < 1= 无
    },
    watcher:{
        //修改描述说明 
        ms:function(o,n,i,c){
             if(DD){//存在操作蓝图对象
                var a,b,d;
                    a=c.now,b=i.$_gData;
                    DD.b=n;
                    if(a>-1){
                        d=b.list[a];
                        d.b=n
                        d.c=d.a+' , '+d.b;
                    }
             };
        },
    },
    watcherFor:{
        //拼接描述
        list:function(i,c){
            var a,b,d,e,f,g,l;
                b=i.$_index;
                if(b>0){ //0索引 为站位
                    a=i.$_data;
                    a.c=a.a+' , '+a.b;
                }else{
                    d=i.$_items.list_dom;
                    d.selectedIndex=-1;// 重置显示位为空
                };
        },
    },
    event:{
        //增加新蓝图
        add:function(){
            var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d=t.$_cache,e,f,g,h,i,j,k;
                gFun.cj_lt();
                b.list.push({a:DD.a,b:DD.b,c:''});
                b.list='update';
                e=c.list_dom;
                i=b.list.length-1;//当前下标
                e.selectedIndex=i;
                b.ms=b.list[i].b;//赋值描述
                b.now=i;
                
                
        },
        //保存蓝图
        save:function(){
            var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d=t.$_cache,e,f,g,h,i,j,k;
                if(DD){

                };
        },
        //删除蓝图
        del:function(){
            var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d=t.$_cache,e,f,g,h,i,j,k;
                if(DD){

                };
        },
        //列表选择
        select:function(){
            var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d=t.$_cache,e,f,g,h,i,j,k;
                
        },
    },
    created:function(i,c){
        
    }
});

gFun.init();// test 蓝图数据读取加载

//移动控制部分 (整个蓝图和子模块)###################################################################################################################################
(function(){
var XY=[],x,y,dx=0,dy=0,dx2=0,dy2=0,sf=1,px,py,F=0,zw,zh,mw,mh,dom,lus=lu.style;  
//x,y 初始点击目标的坐标   px,py,:left,top(子模块) zw,zh(子模块宽高)  mw,mh(整个蓝图尺寸)  dx,dy(蓝图初始位置) sf=1(蓝图初始缩放)
//F: 1:整体,2:子,0:无    dom:当前选中目标的style  lus:蓝图style
mw=lu.offsetWidth,mh=lu.offsetHeight;
//父元素双击 dx,dy 复位左上顶点,缩放复位
mDom.ondblclick=function(e){
    dx=0,dy=0,sf=1;
    lus.transform='translate('+dx+'px,'+dy+'px) scale('+sf+','+sf+')';
    XY[0]=0,XY[1]=0;
    e.stopPropagation();
    e.preventDefault();
};
//子元素双击 缩放复位
lu.ondblclick=function(e){
    sf=1;
    lus.transform='translate('+dx+'px,'+dy+'px) scale('+sf+','+sf+')';
    e.stopPropagation();
    e.preventDefault();
};
// var fun=function(){
//      lus.transform='translate('+dx+'px,'+dy+'px) scale('+sf+','+sf+')';
// };
//点击   
lu.addEventListener('mousedown',function(e){
       var a=e.target,b=a.getAttribute('lx'),f=0;
           if(b==='m'){//lu 自身整个模块
                f=1;
                F=1;//整个蓝图
                XY=xywh; //基于蓝图
                dx=XY[0],dy=XY[1]; 
           }else{// 可移动子模块
            // say('zzz')
                f=1;
                F=2;//子目标 
                // XY= 记忆子元素
           };
           if(f===1){
                  dom=a.style;
                  x=e.pageX,y=e.pageY;
                  px=dom.left.replace('px','')<<0;
                  py=dom.top.replace('px','')<<0;
                  // say(px,py)
                  e.stopPropagation();
                //   e.preventDefault();
           };
});

lu.addEventListener('mousemove',function(e){
     if(F===0)return; //没有选中目标
    var nx,ny,w,ha,b,c,d,e,f,g,h;
        nx=e.pageX,ny=e.pageY;
        w=nx-x,h=ny-y; 
        if(F===2){//子模块 (要判断是否溢出 , 对蓝图宽高进行相应调整, 其中左上方向移动时, 其它元素要相应进行负方向移动  移动结束延 迟时间后 才允许绘制关系连线)

        }else{//整个蓝图
            dx2=dx+w ,dy2=dy+h;//缓存最后操作值
            dom.transform='translate('+dx2+'px,'+dy2+'px) scale('+sf+','+sf+')';
            XY[0]=dx2,XY[1]=dy2;
       };
        
});
/* 
lu.addEventListener('mousemove',function(e){
    if(F===0)return; //没有选中目标

}); */

//滚轮
lu.addEventListener('wheel',function(e){
     if(openF===0)return;
     var a=e.target;
         if(a===lu){
            if(e.wheelDelta>0){
            sf+=0.1;
            if(sf>2)sf=2; 
            }else{
            sf-=0.1;
            if(sf<0.2)sf=0.2;
            };
            lus.transform='translate('+dx+'px,'+dy+'px) scale('+sf+','+sf+')';
            e.preventDefault();
        }else{

        }; 
});

//鼠标弹起
window.addEventListener('mouseup',function(e){
      if(openF===0)return;
      F=0,dom=null;
    // dx=dx2,dy=dy2;
  
});

//快捷键 按下
window.addEventListener('keydown',function(e){
      if(openF===0)return;

});

//快捷键 弹起
window.addEventListener('keyup',function(e){
       if(openF===0)return;
});

//失去焦点
window.addEventListener('blur',function(e){
       if(openF===0)return;
       F=0,dom=null,dx=dx2,dy=dy2;
});


})();

//模块对象 返回区##################################################################################################################################################
var MK={};

(function(){
 //获取区   
 var M=mDom.getElementsByClassName('lu_dom_area')[0];
 //基于class返回对象
 var get=function(a,b,f){ //f=> 1:全部class对象,0:唯一(默认)
      var c=a.getElementsByClassName(b);
          return f===1?c:c[0];

 }; 
 //0_格式化子组数据  n1,n2...;..   = [ [n1,n2...] , ... ]    
 var format0=function(a,n){//a:待整理解析字符串, n:子组长度
      var b,c,d,e,f,g,h,i,j,k,l,m,o,p,q,r,s;
            a=a.split(';');
            l=a.length,i=0;
            r=/^\+?[0-9][0-9]*$/;
            p=[],s='';
            while(i<l){
                d=a[i];// x1,x2,y1,y2;
                e=d.split(','),g=0,m=e.length;
                q=[]
                if(m===n){
                    while(g<m){
                            o=e[g];
                            if(r.test(o)){//是 >-1的整数
                                o=o<<0;
                                q.push(o);
                            }else{//违规类型数值
                                break;
                            };
                        g++;
                    };
                    p.push(q);
                    s+=q.join(',');
                    if(i!==l-1)s+=';';
                };
                i++;
            };
            if(p.length){//存在数据
                return [p,s];    //  p=>[[n1,n2,..],..  ]    s=>n1,n2,..;...  整理后的字符串
            };
            return 0;
 };
 //1_格式化数据  n1,n2...   = [n1,n2,...]    
 var format1=function(a){//a:待整理解析字符串
    var b,c,d,e,f,g,h,i,j,k,l,m,o,p,q,r,s;
          a=a.split(',');
          l=a.length,i=0;
          r=/^\+?[0-9][0-9]*$/;
          p=[],s='';
          while(i<l){
              d=a[i];//值
              if(r.test(d)){ //符合范围内的包含0的正整数
                   d=d<<0;
                   p.push(d);
                   s+=d;
                   if(i!==l-1)s+=',';
              };
              i++;
          };
          if(p.length){//存在数据
              return [p,s];    //  p=>[n1,n2,..  ]    s=>n1,n2,...  整理后的字符串
          };
          return 0;
};
 //var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d,e,f,g,h,i,j,k;
 /* 
 var a=get(M,'lu_map_cfq'),b,c,d,e,f,g,h,i,j,k,l,m,n,id;
        if(DD===null)return; //没有当前蓝图
        a=a.cloneNode(true);
        id=gFun.getId(DD.d); //获取子元素唯一 id
        DD.e[id]={
             a:id, //子元素id
             t:1,  //类型
             b:[0,0],//初始x,y  ,宽高没必要 , 因为自动右加 300, 下加300
             d:[
                 [ [条件根据类型不同], [[svg锚点],],[[连接zdID,tjN,N],] ], //每条可连接的svg 逻辑
             ]
        }
        a=null;
 */

//地图~~~~~~~~
MK['0']=function(D){
    var a=get(M,'lu_map'),b,c,d,e,f,g,h,i,j,k,l,m,n,id,data,F;
        if(DD===null)return; //没有当前蓝图
        a=a.cloneNode(true);
        if(D){
            id=D.a;
            data={
                id:id, //所在 蓝图的 子元素id
                list:[//可选列表
                    // {a:'mapID',b:'mapDes',c:'输出 id +描述'}
                ], 
                idrr:[], //-2:无 ; -1:全部 ; 限定(id0,id1,id2)
                idstr:'无', //输出id列表,若有 ,默认无
                f:0, //1:全选,0:非
            };
            b=D.d[0][0]; // map数据
            if(b[0]>-1){ //有限定数据
                data.idrr=b.slice(0);
            }else{//全选 或 空
                data.f=b[0]===-1?1:0;  //-1:全选
            }

        }else{
            id=gFun.getId(DD.d); //获取元素唯一 id
            DD.e[id]={
                a:id,//id
                t:0,
                b:[0,0], //当前子元素的默认 x,y  , 宽高没必要, 因为 
                d:[
                    [[-2], [[10,154],[191,154]],[]] // 0: [条件], 1:[svg锚点],2:[[id,N,N], ] //svg连接数据,值对应1的索引 
                    //0=> -2:无默认; -1:全部 ; 大于0=指定地图id(每个用 , 分隔) 1=> 左右锚点相对位置 (基于子元素左上角)
                ], 
            };
            D=DD.e[id];
            data={
                id:id, //所在 蓝图的 子元素id
                list:[//可选列表
                    // {a:'mapID',b:'mapDes',c:'输出 id +描述'}
                ], 
                idrr:[], //-2:无 ; -1:全部 ; 限定(id0,id1,id2)
                idstr:'无', //输出id列表,若有 ,默认无
                f:0, //1:全选,0:非
            };
        };
        new Eng({
            el:a,
            data:{
                id:id, //所在 蓝图的 子元素id
                list:[//可选列表
                    // {a:'mapID',b:'mapDes',c:'输出 id +描述'}
                ], 
                idrr:[], //-2:无 ; -1:全部 ; 限定(id0,id1,id2)
                idstr:'无', //输出id列表,若有 ,默认无
                f:0, //1:全选,0:非
            },
            watcher:{
                //限定地图 id 
                'idrr':function(o,n,i,c){
                     var a=i.$_gData,b,d,e,f,g,l,r;
                         if(n==='update'){//因为是后触发 "update" 更新, 所以检测o值
                                l=o.length;
                                if(l>0){//当存在限定地图时
                                        b=0,d=[];
                                        while(b<l){
                                            e=o[b]; //其值,都是点击添加,所以都是>-1数数
                                            if(e>-1)d.push(e); // 大于-1的才是地图
                                            b++;
                                        };
                                         if(d.length){
                                             DD.e[id].d[0][0]=d;
                                             a.idstr=d.join(',');
                                         }else{
                                             i.$_value=[];//直接清空
                                             a.idstr='无';
                                         };
                                }else{
                                     a.idstr=a.f===1?'全部':'无';
                                };
                        };
                },
                //是否 全选
                'f':function(o,n,i,c){
                     var a=i.$_gData,b,d,e,f,g;
                         b=i.d_all;//全选dom
                         b.checked=n?true:false;

                         if(n===1){ //全选时,清空 已选列表, 同时记录
                            DD.e[id].d[0][0]=[-1]; //全选
                            b.idstr='全部';//
                            f=1  
                         }else if(n===0){
                            DD.e[id].d[0][0]=[-2]; //无
                            b.idstr='无';//
                            f=1;
                         };
                         if(f)b.idrr=[];//全选清空
                },
            },
            event:{
                //是否全选
                all:function(){
                    var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d,e,f,g,h,i,j,k;
                        d=t.checked;
                        b.f=d?1:0;
                },
                //添加指定 id 地图 (非重复/全选时无效)
                add:function(){
                    var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d,e,f,g,h,i,j,k;
                        d=c.dom; //selectdom
                        e=d.selectedIndex;//选中的下标
                        g=b.list[e];
                        if(g){//
                            h=g.a<<0;//mapId
                            k=b.idrr;
                            if(k.indexOf(h)<0){//非重复
                                k.push(h);
                                b.idrr='update';
                            };
                        };
                },
                //删除指定 id 地图(全选时无效)
                del:function(){
                    var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d,e,f,g,h,i,j,k;
                        d=c.dom; //selectdom
                        e=d.selectedIndex;//选中的下标
                        g=b.list[e];
                        if(g){//
                            h=g.a<<0;//mapId
                            k=b.idrr;
                            i=k.indexOf(h);
                            if(i>-1){//存在
                                k.splice(i,1);//删除
                                b.idrr='update';
                            };
                        };
                },
                //刷新 地图列表列表 (因为前台操作地图发生变化)
                ref:function(){
                    var t=this,a=t.$_data,b=t.$_gData,c=t.$_items,d,e,f,g,h,i,l,j,k;
                        d=[],e=G_cfg.map,g=e.id,i=0;
                        if(g){
                            l=g.length;
                            while(i<l){
                                f=g[i]; //mapID
                                h=e[f].a;//map描述
                                d.push({a:f,b:h,c:f+' , '+h});
                                i++;
                            };
                            b.list=d;
                        };
                },
                //svg 连接线
                e_svg:function(){
                    var t=this,a,b,c,d,e,f,g,h,i,j,k,l,m,n;
                        a=t.getAttribute('t'); // l:左,r:右
                        
                }
            },
            created:function(i,c){         
            }
        });
        lu.appendChild(a);//推送入 蓝图区
      
};

//地图_触发器
MK['1']=function(D){ //D;已有数据 
    var a=get(M,'lu_map_cfq'),b,c,d,e,f,g,h,i,j,k,l,m,n,id,data,F=0;
        if(DD===null)return; //没有当前蓝图
        a=a.cloneNode(true);
        if(D){
                F=1; //赋值数据
                id=D.a;
                data={
                    map:'',
                    zb:'',
                    sj:'',
                    tq:''
                };
                b=D.d[0][0]; //[地图,坐标,时间,天气]
                c=b[0];//地图
                data.map=c.join(',');

                c=b[1];//坐标
                i=0,l=c.length,m='';
                while(i<l){
                    d=c[i];//[x1,x2,y1,y2]
                    m+=d.join(',');
                    i++;
                    if(i!==l)m+=';';
                };
                data.zb=m;
                c=b[2];//时间
                i=0,l=c.length,m='';
                while(i<l){
                    d=c[i];//[n1.n2]
                    m+=d.join(',');
                    i++;
                    if(i!==l)m+=';';
                };
                data.sj=m;
                c=b[3];//天气
                i=0,l=c.length,m='',n=['晴','阴','雨','雪'];
                while(i<l){
                    d=c[i];//0:晴,1:阴,2:雨,3:雪
                    m+=n[d];
                    i++;
                    if(i!==l)m+=',';
                };
                data.sj=m;
        }else{
            id=gFun.getId(DD.d); //获取子元素唯一 id
            DD.e[id]={
                a:id,
                t:1,
                b:[0,0],
                d:[
                    [ [ [],[],[],[] ] , [[10,181],[191,181]],[]],   // 0=>[地图,坐标,时间,天气], 1:[svg ],2:[svgGx]
                ]
            };
            D=DD.e[id];
            data={
                map:'',//地图 id0,id1,....
                zb:'', //坐标  x1,x2,y1,y2 ; ...
                sj:'', //时间  0,24 ; ......
                tq:'', //
            };
        };
        new Eng({
            el:a,
            data:data,
            watcher:{
                //地图id   [id0,id1,id2,....]
                map:function(o,n,i,c){
                    var a,b,d,e,f,g,h,l,m,o,p,q,r;
                    if(F===1&&n!==''){
                        i.c_map.checked=true;//因为有数据,选中状态
                    }else if(n!==''){
                         a=format1(n); // a=[[id1,id2,...], '字符串' ]
                         if(a!==0){
                            DD.e[id].d[0][0][0]=a[0];
                            i.$_value=a[1];
                         }else{
                            DD.e[id].d[0][0][0]=[];
                            i.$_value='';
                         };
                    }else{
                         DD.e[id].d[0][0][0]=[];
                         i.$_value='';
                    };
                },
                //坐标范围 [ [x1,x2,y1,y2],...]
                zb:function(o,n,i,c){
                    var a,b,d,e,f,g,h,l,m,o,p,q,r;
                        if(F===1&&n!==''){
                            i.c_zb.checked=true;//因为有数据,选中状态
                        }else if(n!==''){
                            a=format0(n,4); //4个一组子数据    [ 0:[[x1,x2,y1,y2],..], 1:'格式化后的数据' ]
                            if(a!==0){
                                DD.e[id].d[0][0][1]=a[0];
                                i.$_value=a[1];
                            }else{
                                DD.e[id].d[0][0][1]=[];//空数据
                                i.$_value='';
                            };
                        }else{
                            DD.e[id].d[0][0][1]=[];// 空数据
                            i.$_value='';
                        };
                },
                //时间 [[n1,n2],...]
                sj:function(o,n,i,c){
                    var a,b,d,e,f,g,h,l,m,o,p,q,r;
                        if(F===1&&n!==''){
                            i.c_sj.checked=true;
                        }else if(n!==''){
                            a=format0(n,2); //     [0:[ [n1-n2],.. ], 1:'格式话后的数据']
                            if(a!==0){
                                DD.e[id].d[0][0][2]=a[0];
                                i.$_value=a[1];
                            }else{
                                DD.e[id].d[0][0][2]=[];//空数据
                                i.$_value='';
                            };
                        }else{
                            DD.e[id].d[0][0][2]=[];//空数据
                            i.$_value='';
                        };
                },
                //天气 0:晴,1:阴,2:雨,3:雪
                tq:function(o,n,i,c){
                    var a,b,d,e,f,g,h,l,m,o,p,q,r,u;
                        if(F===1&&n!==''){
                            i.c_tq.checked=true;
                        }else if(n!==''){
                            a=n.split(',');
                            d=['晴','阴','雨','雪'];
                            b=0,l=a.length;
                            p=[],q=[];
                            while(b<l){
                                e=d[a[b]];
                                if(e!==u){//可存在数据
                                    p.push(e);
                                    q.push(a[b]);
                                };
                                b++;
                            };
                            if(p.length){//数据有效
                                DD.e[id].d[0][0][3]=p;
                                i.$_value=q.join(',');
                            };
                        }else{
                                DD.e[id].d[0][0][3]=[];
                                i.$_value='';
                        };
                }, 
            },
            event:{
                //开关map ID条件
                e_map:function(){
                    var t=this,a=t.$_gData,b=t.$_items,c,d,e,f;
                        c=t.checked;
                        d=b.d_map;// 
                        if(c===true){
                            d.disabled=false;//解锁
                        }else{
                           d.disabled=true;
                           a.map=''; //锁住,即停止使用,清空数据
                        };
                },
                //开关坐标条件
                 e_zb:function(){
                     var t=this,a=t.$_gData,b=t.$_items,c,d,e,f;
                         c=t.checked;
                         d=b.d_zb;// 
                         if(c===true){
                             d.disabled=false;//解锁
                         }else{
                            d.disabled=true;
                            a.zb=''; //锁住,即停止使用,清空数据
                         };
                 },
                 //开关时间条件
                 e_sj:function(){
                    var t=this,a=t.$_gData,b=t.$_items,c,d,e,f;
                        c=t.checked;
                        d=b.d_sj;// 
                        if(c===true){
                            d.disabled=false;//解锁
                        }else{
                        d.disabled=true;
                        a.zb=''; //锁住,即停止使用,清空数据
                        };
                 },
                 //开关天气条件
                 e_tq:function(){
                    var t=this,a=t.$_gData,b=t.$_items,c,d,e,f;
                         c=t.checked;
                         d=b.d_tq;// 
                         if(c===true){
                             d.disabled=false;//解锁
                         }else{
                            d.disabled=true;
                            a.zb=''; //锁住,即停止使用,清空数据
                         };
                 }
            }
        });
        lu.appendChild(a);//推送入 蓝图区
}







})();


})();