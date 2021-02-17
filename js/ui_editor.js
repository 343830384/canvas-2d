/* 
UI拖拽编辑器
*/
//存储UI编号的


(function(){
//创建ui相关~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
var cfg,bod=document.body;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

var tipArea=document.getElementById('ui_editor');
var last; //上一个提示目标
var openF=0; // 功能区未打开
var gFun={
      //初始化
      init:function(){
           openF=1;//功能区展开
           app.ui_mb=reNew(G_cfg.ui);
      },
      //关闭ui编辑器面板 (并储存)
      destroy:function(){
           var a,b,c,d,l;
               openF=0;//功能区关闭
               G_cfg.ui=reNew(app.ui_mb); //赋值 ui模板数据
              
               a=game_main.getElementsByClassName('ui_game');
               l=a.length;
               while(l--){
                   delDom(a[l]);//删除所有展开中的ui dom 面板 
               };
               apItem.$_cache={//清空缓存
                 select:[],open_ui:{},xz_uid:null, xz_zid:null
              };
              app.ui_mb=[];//清空
              app.ui_option={};//清空
      },
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
};

//悬浮 提示文本
var tsWb={
      0:'创建新的UI面板,用于布置构建游戏UI界面菜单\r\r例如:对话面板,背包面板,按钮面板,属性面板等...\r\r右侧设置初始窗口的宽高',
      1:'设置UI面板宽高,默认400\r\r参数:数字或百分比.例:123,例:30%',
      2:'按住鼠标拖拽至打开的UI面板,进行布局设置\r\r可用作: 文本(建议短文本),背景框,按钮....\r\r特殊:支持在容器域中, 以自身宽高 根据 容器域的尺寸 克隆生成自动排列的指定数量的自身',
      3:'按住鼠标拖拽至打开的UI面板,进行布局设置\r\r可用作: 文本按钮,背景按钮,按钮....\r\r特殊:支持在容器域中, 以自身宽高 根据 容器域的尺寸 克隆生成自动排列的指定数量的自身\r\r备注:原生按钮,其它和左侧功能差不多',
      4:'按住鼠标拖拽至打开的UI面板,进行布局设置\r\r可用作: 输入(单行),文本单行内容呈现,(支持背景)',
      5:'按住鼠标拖拽至打开的UI面板,进行布局设置\r\r可用作: 输入(多行),文本内容呈现(大量),(支持背景)',
      6:'按住鼠标拖拽至打开的UI面板,进行布局设置\r\r可用作: 区域划分,区域背景 或 作为包裹子元素的容器\r\r特殊:其子元素支持自动克隆排列 , 一般用于大量同类规律元素的排列展示, 如:背包物品...',
      7:'该UI面板的唯一id,用于数值,交互等各类事件的 属性 查询和赋值...',
      8:'勾选展开该UI面板,进行布置修改....',
      9:'双击删除该UI面板',
      10:'勾选该参数类, 则提交修改时生效, 否则无视...\r\r注意:并非所有参数都必须设置',
      11:'设置:目标的宽度\r\r参数:数字或百分比.例:123,例:30%',
      12:'设置:目标的高度\r\r参数:数字或百分比.例:123,例:30%',
      13:'设置:显示边框的目标为圆角(值越大边角越圆,最大生效值为宽高最小值的一半)\r\r通常用于采用背景色的目标,使用背景图应当在PS等软件中进行边缘裁切,而非此处\r\r注意:特殊用!非必需!可忽略',
      14:'设置:相对于容器左边的偏移\r\r参数:数字或百分比.例:123,例:30%\r\r注意:用于非克隆生成目标的位置调整,不允许溢出容器',
      15:'设置:相对于容器顶边的偏移\r\r参数:数字或百分比.例:123,例:30%\r\r注意:用于非克隆生成目标的位置调整,不允许溢出容器',
      16:'设置:显示边框的宽度\r\r注意:非必需!',
      17:'设置:边框的颜色,必须先设置边框的有效宽度才能生效\r\r参数: #xxxxxx ; (r,g,b) ; (r,g,b,a)',
      18:'设置:允许实机游戏中对UI元素进行拖拽(默认禁止)\r\r注意:该参数,用于特殊创意类开发,如果你不知道怎么用,没有针对的开发创意,请千万不要勾选此项!!因为它会造成你的UI界面元素满屏乱飞 (随意拖拽造成的)',
      19:'设置:允许玩家输入文字(默认禁止),仅对 输入框 和 文本域 两个元素生效',
      20:'设置:自动克隆复制生成指定数量的自身,并依据父元素容器的宽高进行自动排列\r\r注意:当设置了该参数时, x和y参数将会失效 , px和py参数则会生效(默认值0)',
      21:'设置:被克隆复制元素,相对于上一个克隆元素的水平间距\r\r注意:值必须为正,默认0',
      22:'设置:被克隆复制元素,相对于上一个克隆元素的垂直间距\r\r注意:值必须为正,默认0',
      23:'勾选该参数类, 则提交修改时生效, 否则无视...\r\r注意:并非所有参数都必须设置\r(对于不需要文字信息变更的区域,尽量使用固定背景图代替)',
      24:'设置:字体样式\r\r备注:如非必须,没必要设置\r\r注意:系统不存在的字体,需手动在素材分类中选择添加',
      25:'设置:文字大小,默认12',
      26:'设置:文字是否加粗',
      27:'设置:文字行高,影响每行文字的行间距',
      28:'设置:行内文字水平方向位置\r\r参数:左;中;右',
      29:'设置:行内文字垂直方向位置\r\r参数:上;中;下',
      30:'设置:文字间距\r\r备注:如有必要',
      31:'设置:文字颜色\r\r参数:#xxxxxx ; (r,g,b) ; (r,g,b,a)',
      32:'设置:文本内容相对于文本容器边界的距离\r\r参数:0,0,0,0 (上,右,下,左)',
      33:'设置:文本动画更新的频率\r\r参数:单位/毫秒(1秒=1000毫秒)\r\r备注:动画显示全部文字的更新间隔,多用于对话',
      34:'设置:文本每次更新增加的显示字数(默认5)备注:尽量设置大点...',
      35:'勾选该参数类, 则提交修改时生效, 否则无视...\r\r注意:背景图 与 背景色 互斥,如不需要可以不设置\r(背景图透明度,请在PS等软件内设置)',
      36:'设置:基础背景图, 宽高默认为元素容器的宽高( = 基本参数的宽高)\r\r参数:已编辑图片id',
      37:'设置:图片宽度,默认是元素容器的宽,\r\r备注:特殊需求单独设置',
      38:'设置:图片高度,默认是元素容器的高,\r\r备注:特殊需求单独设置',
      39:'设置:图片水平方向上的位置偏移\r\r备注:因单独设置了图片的宽高,背景图片默认位于左上角,无法居中',
      40:'设置:图片垂直方向上的位置偏移\r\r备注:因单独设置了图片的宽高,背景图片默认位于左上角,无法居中',
      41:'设置:当鼠标于其上 悬浮 时显示的背景图\r\r备注:特殊需求\r\r参数:已编辑图片id',
      42:'设置:当按键 按住 时显示的背景图\r\r备注:特殊需求\r\r参数:已编辑图片id',
      43:'设置:当按键 弹起 时显示的背景图\r\r备注:特殊需求\r\r参数:已编辑图片id',
      44:'设置:不断变换的背景图\r\r备注:特殊需求\r\r参数格式:图id1;图id2;图片id3.....\r\r备注:分号分割每个图id,英文分号',
      45:'设置:变换背景的间隔\r\r参数:单位毫秒,默认1000',
      46:'设置:基础背景色\r\r参数:(r,g,b) , (r,g,b,a) 或 #xxxxxx',
      47:'设置:当鼠标于其上 悬浮 时显示的背景色\r\r备注:特殊需求\r\r参数:(r,g,b) , (r,g,b,a) 或 #xxxxxx',
      48:'设置:当按键 按住 时显示的背景色\r\r备注:特殊需求\r\r参数:(r,g,b) , (r,g,b,a) 或 #xxxxxx',
      49:'设置:当按键 弹起 时显示的背景色\r\r备注:特殊需求\r\r参数:(r,g,b) , (r,g,b,a) 或 #xxxxxx',
      50:'设置:不断变换的背景色\r\r备注:特殊需求\r\r参数格式:颜色1;颜色2;颜色3.....\r(颜色=(r,g,b) , (r,g,b,a) 或 #xxxxxx)\r\r备注:分号分割每个颜色,英文分号',
      51:'设置:变换背景色的间隔\r\r参数:单位毫秒,默认1000',
      52:'勾选该参数类, 则提交修改时生效, 否则无视\r\r备注:用于触发已定义的事件',
      53:'设置:当按键click(按下并弹起),触发的事件列表\r\r参数:事件id1;事件id2.....',
      54:'设置:当按键 按下 ,触发的事件列表\r\r参数:事件id1;事件id2.....\r(英文 ; 分号分隔)',
      55:'设置:当按键 弹起 ,触发的事件列表\r\r参数:事件id1;事件id2.....\r(英文 ; 分号分隔)',
      56:'设置:当鼠标 悬浮 其上,触发的事件列表\r\r参数:事件id1;事件id2.....\r(英文 ; 分号分隔)',
      57:'设置:当按键/元素 被鼠标拖拽移动时,触发的事件列表\r\r参数:事件id1;事件id2.....\r(英文 ; 分号分隔)\r\r备注:特殊创意类用途,具体应用场景不明,自行研究.....',
      58:'设置:快捷键(注意大小写)',
      59:'选中的元素id, 0为面板本身',
      60:'选中元素的临时描述 (不需要或发布时需删除)\r\r建议:可作为区域的文字说明,  但如有个性化需求,请制作背景图片替代',
      61:'双击提交 选中类参数 的变更',
      62:'设置:相对于容器右边的偏移\r\r参数:数字或百分比.例:123,例:30%\r\r注意:用于非克隆生成目标的位置调整,不允许溢出容器',
      63:'设置:相对于容器底边的偏移\r\r参数:数字或百分比.例:123,例:30%\r\r注意:用于非克隆生成目标的位置调整,不允许溢出容器',
      64:'设置:元素的相对位置偏移\r\r',
      65:'UI面板id',
      66:'双击删除选中的子元素',
      67:'',
      68:'',
      69:'',
      70:'',
      71:'',
      72:'',
      73:'',
      74:'',
      75:'',
      76:'',
      77:'',
      78:'',
      79:'',
      80:'',
      81:'',
      82:'',
      83:'',
      84:'',
      85:'',
      86:'',
      87:'',
      88:'',
      89:'',
      90:'',
      91:'',
      92:'',
      93:'',
      94:'',
      95:'',
      96:'',
      97:'',
      98:'',
      99:'',
      100:'',
      101:'',

};

//鼠标 悬浮 提示 
tipArea.addEventListener('mouseover',function(e){
    var a=e.target,u;
        if(a===last)return;//同一个对象dom禁止反复触发提示
        last=a;
        a=a.getAttribute('tip');
        if(a!==null){ //有提示
                tipFun(tsWb[a]);
                e.stopPropagation();
        }else{
                tips.style.display='none';
        };
});
//获取ui 模板唯一 id (按顺序获取,未使用的)    
var getUiId=function(){
    var a=app.ui_mb,i=0,l,d,n=-1,f=0;
        l=a.length;
        if(l===0)return 0; //无则默认0
        while(i<l){
            d=a[i].ui_id<<0; //当前元素id
            if(d>n)n=d; //获取当前 id 最大值
            i++;
        };
         n++; //顺位+1
        return n;
};

//获取新的 ui data数据
var cjNewUiData=function(t,zId,pId,w,h,ms){
   var a,b,c,d,e,f,g,o; 
        o={ //模板内元素 id=0 = 基础面板参数 , 初始仅 赋值 basic和id 类若干参数, 默认  x:'40%',y:'50%'
            type:t,    //类型 0:ui面板本身,1:普通文本div,2:button按钮,3:input框,4:文本域,5:div容器域 
            child:[],  //同辈子元素(若有, 仅限type=5 容器才有)
            pId:pId,   //ui面板 id
            zId:zId,   //元素 id
            ms:ms||'',     
            basic:{w:w,h:h,l:'',r:'',t:'',b:'',ml:'',mt:'',mr:'',mb:'',yj:'',bk:'',bs:'',tz:false,sr:true,zd:'',px:'',py:''},   //tz:默认允许,sr:输入默认禁止
            font:{zt:'',dx:'',jc:true,hg:'',sp:'',cz:'',jj:'',ys:'',bj:'',pl:'',gx:''},
            bg_img:{
                bg:'',bg_w:'',bg_h:'',bg_px:'',bg_py:'',
                hbg:'',hbg_w:'',hbg_h:'',hbg_px:'',hbg_py:'',
                dbg:'',dbg_w:'',dbg_h:'',dbg_px:'',dbg_py:'', 
                ubg:'',ubg_w:'',ubg_h:'',ubg_px:'',ubg_py:'', 
                bbg:'',bpl:'',bbg_w:'',bbg_h:'',bbg_px:'',bbg_py:''
            },
            bg_color:{bg:'',hbg:'',dbg:'',ubg:'',bbg:'',bpl:''},
            event:{click:[],c_key:'',down:[],d_key:'',up:[],u_key:'',hover:[],move:[]}
       };
       return o;
};

var game_main=document.getElementById('game_main');// 游戏实机区域
var apItem;
//ui_editor 
var app=new Eng({
       el:'ui_editor',
       cache:{
           select:[],//选中的提交类
           open_ui:{//展开修改中的ui面板 (基于模板id)   
                  //ui_id:uiDom 对象  
           }, 
           xz_uid:null,//选中的UI_id
           xz_zid:null,//选中的UI_zid
       },
       data:{
           //ui模板
           ui_mb:[
               /*  {
                    ui_id:n,//ui面板id 唯一  (从0开始,顺序补位)
                    ui_ys_id:0,    //ui面板 元素id ,默认从0开始  (创建一个 新的就++) 
                    ui_bz:'',      //  ui备注
                    data:{ //所有子数据 (第一层是模板本身)
                           
                        type:t,    //类型 0:ui面板本身,1:普通文本div,2:button按钮,3:input框,4:文本域,5:div容器域 
                        child:[],  //同辈子元素(若有, 仅限type=5 容器才有)
                        pId:pId,   //ui面板 id
                        zId:zId,   //元素 id
                        ms:'',     //描述
                        //基本参数
                        basic:{  
                            w:'',h:'',
                            yj:'',//圆角
                            l:'',r:'',t:'',b:'',  // left,right,top,bottom
                            ml:'',mt:'',mr:'',mb:'', //margin
                            bk:'',//边宽 0:无
                            bs:'',//边颜色
                            tz:true,//默认禁止拖拽
                            sr:true,// 默认禁止输入 
                            zd:'',//自动生成 数量大于0时生效
                            px:'',//自动生成左边距
                            py:'',//自动生成右边距
                        },
                        //文字参数
                        font:{
                            zt:'',//字体
                            dx:'',//大小
                            jc:true,//默认加粗
                            hg:'',//行高
                            sp:'',//水平居 ( 左 中 右 )
                            cz:'',//垂直居 ( 上 中 下 )
                            jj:'',//文字间距
                            ys:'',//文字颜色
                            bj:'',//内容边距 左,右,上,下
                            pl:'',//文字动画更新频率间隔
                            gx:'',//每次间隔更新的字数总量
                        },
                        //背景图
                        bg_img:{
                            bg:'',bg_w:'',bg_h:'',bg_px:'',bg_py:'',bg_pp:false, //背景图,宽,高,px,py,平铺F
                            hbg:'',hbg_w:'',hbg_h:'',hbg_px:'',hbg_py:'', //hove
                            dbg:'',dbg_w:'',dbg_h:'',dbg_px:'',dbg_py:'', //down
                            ubg:'',ubg_w:'',ubg_h:'',ubg_px:'',ubg_py:'', //up
                            bbg:'',bpl:'',bbg_w:'',bbg_h:'',bbg_px:'',bbg_py:''//变换的
                        },
                        //背景色
                        bg_color:{
                            bg:'',
                            hbg:'', //hover
                            dbg:'', //down
                            ubg:'', //up
                            bbg:'',bpl:''//变换的
                        },
                        //事件
                        event:{
                            click:[],c_key:'', down:[],d_key:'',up:[],u_key:'',hover:[],move:[]
                        }
                            
                    },//data END~~~
                }  */
              
           ],
           //属性面板全部数据
           ui_option:{ //e-change=''  e-attr='' readonly
                type:0,    //类型 0:ui面板本身,1:普通div,2:button按钮,3:input框,4:文本域,5:div容器域 
                child:[],  //同辈子元素(若有, 仅限type=5 容器才有)
                pId:'',   //ui面板 id
                zId:'',   //子元素id 0即面板本身
                ms:'',
                //基本参数
                basic:{  
                    w:'',h:'',
                    yj:'',//圆角
                    l:'',r:'',t:'',b:'',  // left,right,top,bottom
                    ml:'',mt:'',mr:'',mb:'', //margin
                    bk:'',//边宽 0:无
                    bs:'',//边颜色
                    tz:true,//默认禁止拖拽
                    sr:true,// 默认禁止输入 
                    zd:'',//自动生成 数量大于0时生效
                    px:'',//自动生成左边距
                    py:'',//自动生成右边距
                },
                //文字参数
                font:{
                    zt:'',//字体
                    dx:'',//大小
                    jc:true,//默认加粗
                    hg:'',//行高
                    sp:'',//水平居 ( 左 中 右 )
                    cz:'',//垂直居 ( 上 中 下 )
                    jj:'',//文字间距
                    ys:'',//文字颜色
                    bj:'',//内容边距 左,右,上,下
                    pl:'',//文字动画更新频率间隔
                    gx:'',//每次间隔更新的字数总量
                },
                //背景图
                bg_img:{
                    bg:'',bg_w:'',bg_h:'',bg_px:'',bg_py:'',bg_pp:false,
                    hbg:'',hbg_w:'',hbg_h:'',hbg_px:'',hbg_py:'', //hove
                    dbg:'',dbg_w:'',dbg_h:'',dbg_px:'',dbg_py:'', //down
                    ubg:'',ubg_w:'',ubg_h:'',ubg_px:'',ubg_py:'', //up
                    bbg:'',bpl:'',bbg_w:'',bbg_h:'',bbg_px:'',bbg_py:''//变换的
                },
                //背景色
                bg_color:{
                    bg:'',
                    hbg:'', //hove
                    dbg:'', //down
                    ubg:'', //up
                    bbg:'',bpl:''//变换的
                },
                //事件
                event:{
                    click:[],
                    c_key:'', //快捷键
                    down:[],
                    d_key:'',
                    up:[],
                    u_key:'',
                    hover:[],
                    move:[]
                }
           } 
       },
       watcher:{
             //基本参数
            /* 
            'ui_option.id.':function(o,n,i,c){
            },
            'ui_option.basic.':function(o,n,i,c){
            },
            'ui_option.font.':function(o,n,i,c){
            },
            'ui_option.bg_img.':function(o,n,i,c){
            },
            'ui_option.bg_color.':function(o,n,i,c){
            },
            'ui_option.event.':function(o,n,i,c){
            },
            */
           //背景平铺按钮
           'ui_option.bg_img.bg_pp':function(o,n,i,c){
               var a=i.bg_pp_btn;
                   a.checked=n;
           },
           //意味着全新的数据,复位
        //    'ui_option.id':function(o,n,i,c){
        //       var d=['bg_img','bg_color','font','basic','event'],l=5;
        //           while(l--){
        //              i[d[l]].checked=false;
        //           };
        //    },
           //拖拽开关
           'ui_option.basic.tz':function(o,n,i,c){
                    i.basic_tz.checked=n;
            },
            //输入开关
            'ui_option.basic.sr':function(o,n,i,c){
                 i.basic_sr.checked=n;
            },
            //自动生成
            'ui_option.basic.zd':function(o,n,i,c){
                var a=n<<0,g=i.$_gData.ui_option.basic;
                    if(a<=0){
                        a=''
                    }else{
                        g.x='',g.y=''; //自动生成 导致 x,y 失效 
                    };    
                    i.$_value=a;
                    
            },
            //font 边距padding  左,右,上,下
            'ui_option.font.bj':function(o,n,i,c){
                if(n){
                    n=n.trim();
                    var a=n.split(',');
                        if(a.length===4){

                        }else{
                            tipFun('正确的边填充数据格式为: 1,2,3,4    (左右上下)',1);  //html实际中设置为 左上右下 ,此处为了方便
                            i.$_value='';
                        };
                };
            },
       },
       event:{
           ui_close:function(){//点击关闭
                    this.parentNode.parentNode.style.display='none';
                    gFun.destroy();//关闭存储
           },
           //var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data;
           //ui 模板相关##############################################################################################################################################
           //点击背景是否平铺按钮
           bg_pp:function(){
               var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,a,b,d,f;
                   a=g.ui_option.bg_img;
                   b=a.bg_pp;
                   a.bg_pp=b?false:true;//     
           },
           //双击 创建新的UI面板
           cj_ui:function(e){
               var t=this,a,w,h,d,o,n,i=t.$_items,c=t.$_cache,g=t.$_gData;
                   a=t.parentNode.getElementsByTagName('input');//宽高按钮
                   w=a[0].value<<0;
                   if(w<=0)w='400';
                   h=a[1].value<<0;
                   if(h<=0)h='400';
                   n=getUiId();
                    d=cjNewUiData(0,0,n,w,h,'ui面板-'+n);//模板类型, 元素id , ui_id, width,height '描述'
                    o={
                        ui_id:n,//ui面板id 唯一  (从0开始,顺序补位)
                        ui_ys_id:0,    //ui面板 元素id ,默认从0开始  (创建一个 新的就++) 
                        ui_bz:'',//  ui备注
                        data:d //所有子数据 (第一层是模板本身)
                    };
                    g.ui_mb.push(o);
                    g.ui_mb='update';
           },
           //选择要展示 或关闭 的
           xz_ui:function(){
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,a,p,o,k;
                // p=t.parentNode.getAttribute('index')<<0; //p index
                o=game_main;// 所有模板的父元素
                // say(d.data.pId);
                if(t.checked){//创建 ui模板\
                    //循环所有子元素=
                     a=cjUiDom(d.data,o); //dom数据,父dom
                     c.open_ui[d.ui_id]=a;//
                     a.ui_p_data=d; //父元素数据
                }else{//关闭 删除 打开的 ui面板
                     o.removeChild(c.open_ui[d.ui_id]);//文档流中删除
                     c.open_ui[d.ui_id]=null; // 内存中删除
                };
           },
           //选择模板 子元素
           xz_ui_zys:function(){

           },
           //删除 ui面板 
           del_ui:function(){
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,p,o,m;
                p=t.parentNode.getAttribute('index')<<0;
                g.ui_mb.splice(p,1);
                g.ui_mb='update';
                //同时判断删除以创建的dom
                m=c.open_ui[d.ui_id];
                if(m){//删除已经创建了的模板
                    o=game_main;
                    o.removeChild(m);//文档流中删除
                    c.open_ui[d.ui_id]=null; // 内存中删除
                };
           },
           //删除 ui子元素
           del_ui_zys:function(){
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,pd,pi;
                // say(d.zId);
                if(d.basic.zd)return; //自动创建元素不允许该方式删除
                if(d.zId&&seleYsMb){ //子元素(非模板) 
                    delDom(seleYsMb);//删除
                    pd=seleYsMb.ui_p_data.child; //所在父元素地址
                    pi=pd.indexOf(seleYsMb.ui_data);//具体所引
                    if(pi>-1)pd.splice(pi,1); //删除
                    g.ui_option={};//清空选中显示数据
                };
                seleYsMb=null
           },
           //提交修改的数据
           tj_data:function(e){
            var t=this,i=t.$_items,c=t.$_cache,g=t.$_gData,d=t.$_data,a,b,c,r,i,l,f;
                c=d.zId;
                if(c!==''){ //有选中的元素
                       a=reNew(d);
                       b=seleYsMb.ui_p_data;// 父元素数据
                       r=b.child;
                       if(r){//说明是子元素
                            l=r.length;
                            while(l--){
                                if(r[l].zId===c){
                                    r[l]=a;//赋值新数据 
                                    cjUiDom(a,null,seleYsMb);
                                    return;
                                };
                            };
                       }else{//模板元素本身
                            b.data=a;//赋值新数据
                            cjUiDom(a,null,seleYsMb);
                       };

                };
           },
           //当拖拽开始 ,记录 目标类型
           dragStart:function(e){
            var a=e.target,b,c,d,e,p,f=0;
                b=a.getAttribute('lx')<<0; //获取拖拽类型 
                if(b>0){//大于0的才是
                    dragLx=b;
                };
           },
           //ui 模板相关 END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           //拖拽开关(已经禁用 通过按住alt 拖动)
           basic_tz:function(){
            //    var t=this,a,g=t.$_gData;
            //        a=t.checked; //选中状态
            //        g.ui_option.basic.tz=a;
           },
           //输入开关
           basic_sr:function(e){
                var t=this,a,g=t.$_gData;
                    a=t.checked; //选中状态
                    g.ui_option.basic.sr=a;
           },
           //大类 提交 选择  (背景图 和 背景色 互斥)
           select:function(){
                 var t=this,a,f,i=t.$_items,c=t.$_cache.select,n,z;
                     a=t.getAttribute('lx');
                     f=t.checked;
                     if(f===true){//添加要提交的对象
                         c.push(a);
                     }else{//删除要提交的对象
                         n=c.indexOf(a);
                         if(n>-1)c.splice(n,1);//删除
                     };
                     if(f===true){
                          if(a=='bg_img'){
                             z='bg_color'
                          }else if(a=='bg_color'){
                             z='bg_img';  
                          }else{
                              return;
                          };
                          i[z].checked=false; //背景图 与 背景色互斥
                          n=c.indexOf(z);
                          if(n>-1)c.splice(n,1);//删除
                     };
           },

       },
       created:function(items , cache){
           apItem=items;
           G_cz.fun.uiFun=gFun;//

           /*  
             items.{ //id dom列表
                  basic_tz:拖拽 input 选框
                  basic_sr:输入 input 选框
                  bg_img :  选择 背景图 框
                  bg_color: 选择 背景色 框
                  font: 选择 文字 框
                  basic: 选择 基本参数 框
                  event: 选择 事件 框 
             }
           */
       }
});

//属性参数对应 dom style参数表
var sMap={
       w:['width',0],// 0:判断px或百分比
       h:['height',0],
       l:['left',0],
       r:['right',0],
       t:['top',0],
       b:['bottom',0],
       yj:['borderRadius',0],
    //    px:['marginLeft',0],     本质上是 left的 再计算
    //    py:['marginTop',0],      本质上是 top 的 再计算
       bk:['border',3],//3:判断border
       bs:['borderColor',3], // 边框颜色
       zt:['fontFamily'], //字体 /* 暂无 */
       dx:['fontSize',0], //字大小
       jc:['fontWeight',4], //4:加错
       hg:['lineHeight',0],
       jj:['letterSpacing',0],//文字间距
       ys:['color'],//文字颜色
       bj:['padding',1],//内容边距 (上,右,下,左)   
       ml:['marginLeft',0], //margin 
       mt:['marginTop',0], //margin 
       mr:['marginRight',0], //margin 
       mb:['marginBottom',0], //margin 
       sp:['textAlign',2],    //水平居 ( 左 中 右 )  left center right
       cz:['verticalAlign',2],//垂直居 ( 上 中 下 )  top middle bottom
       bg:['background',5], //判断 颜色还是背景图
       bg_wh:['backgroundSize',6],//背景图大小  ( wPx||w% ,hPx||h% )
       bg_pos:['backgroundPosition',6],// backgroundPosition  (top,left) (x||%,y||%)
       bg_pp:['backgroundRepeat',7],//背景是否平铺
};

//设置 style 属性, 依据 sMap
var stylefun=function(dom,k,n,n2){//s:style  k:styleMap的key, n具体值
    var a,b,c,d,e,f,g,v;
        v=sMap[k];
        if(v[1]===0){//判断是 px 还是 百分比
                if(n.search('%')>-1){//百分比值
                    
                }else if(n!==''){//px
                    n+='px'; 
                }else{
                    n='';
                };
                dom.style[v[0]]=n;
        }else if(v[1]===1){//边填充或margin  n=上,右,下,左
                 n=n.trim();
                 a=n.split(',');
                 if(a.length===4){//转为左上右下
                     n=a.join(','); 
                 }else{
                     n='';
                 };
               dom.style[v[0]]=n;
        }else if(v[1]===2){//水平或垂直
                n=n.trim();
                if(k==='sp'){//水平
                    a={'左':'left','中':'center','右':'right'}; 
                    n=a[n]||'';
                }else{
                    a={'上':'top','中':'middle','下':'bottom'}; 
                    n=a[n]||'';
                };
                dom.style[v[0]]=n;
        }else if(v[1]===3){//border
                n=n.trim();
                if(n.search('%')>-1){//百分比值
                    n+=' solid';
                }else if(n!==''){//px
                    n+='px solid'; 
                }else{
                    n='0'; //不存在边框
                };
                dom.style[v[0]]=n;
        }else if(v[1]===4){//文字加粗 n=>true?blod:'';
              dom.style[v[0]]=n?'blod':'';
        }else if(v[1]===5){//background
              n=n.trim();
              a=/^[0-9]*$/;
              if(n!==''&&a.test(n)){ //背景图
                // dom.style[v[0]]='url();'
                  dom.style[v[0]]='url(./|'+G_cfg.project.path+'/img/'+n+'.png)';//dom.style.background=url(./|项目path/img/n.png)
              }else{//背景色
                  dom.style[v[0]]=n;  //dom.style.background=颜色
              };

        }else if(v[1]===6){//backgroundSize  (n:w,n2:h) ; backgroundPosition  (n:px,n2:py)
               n=n.trim(),n2=n2.trim();
            //    say(n,n2);
               if(n.search('%')>-1){//百分比值
                  
               }else if(n!==''){
                    n+='px' 
               }else{
                    // n='auto';
                    n='';
               };
               if(n2.search('%')>-1){//百分比值
                  
               }else if(n2!==''){
                     n2+='px' 
               }else{//无则默认auto
                    // n2='auto';
                    n2='';
               };
               n+=' '+n2;  // ='0px 0px'||'0% 0%';
               dom.style[v[0]]=n;
        }else if(v[1]===7){//backgroundRepeat 
              dom.style[v[0]]=n?'repeat':'no-repeat';
              
        }else{//通用的

        };

        // s[v[0]]=n; // 等于 obj.styl.属性 = n

};

//初始创建ui面板 及其子元素
var cjUiDom=function(d,p,z){//d:数据,p:父dom,  z:dom自身,此时不再创建新dom ,仅做属性修改 
    var a,b,c,e,str,f,g,h,i,j,k,l,m,n,t,u,pw,ph,zw,zh,zx,zy,zw2,zh2,wn,hn,zd,bg='',zl,zi;
        t=d.type;//类型 0:ui面板本身,1:普通文本div,2:button按钮,3:input框,4:文本域,5:div容器域 
        
            if(t===0){//模板本身
                str="<div class='ui_game' ui_id="+d.pId+"></div>";
                bg='rgba(5,53,252,.6)';//默认背景色,当不存在设置的bg时, 方便开发区分
            }else if(t===1){ //普通文本div
                str='<div class="mk_txt"></div>';
                bg='#FFC5C0';
            }else if(t===2){//button按钮
                str='<button class="mk_btn"></button>';
                bg='#EAEAEA';
            }else if(t===3){//input框
                str='<input type="text" class="mk_input">';
                bg='#53DED5'; 
            }else if(t===4){
                str='<textarea class="mk_txtarea"></textarea>';
                bg='#E0F4E1';
            }else if(t===5){
                str='<div class="mk_container"></div>';
                bg='rgba(243,245,71,0.4)';
            }else{
                return; //不存在的
            };
            if(!z){ //全新的创建  
                a=cjDom(str);
            }else{//针对已有的修改,不再创建新dom
                a=z;
            };
        //推入文档流 (新创建的 情况下 ,以及非自动创建元素(自动创建上面投入文档流)) (需先推入文档流,否则会造成查找父元素出错)
        if(!z)p.appendChild(a);
        // console.error('此处 改为 id 路径索引, 根据 模板id 指向 打开的模板,以及路径深度, 通过该方式查值, 防止数据突然 失效 ')

        a.ui_data=d;//数据 绑定到 dom
        a.ui_path=[d.pId,d.zId]; //模板id,元素id (用于 ui_data 丢失时,获取数据)
        c=a.style;
        
        //basic相关##########################################################################################################
        e=['w','h','l','r','t','b','ml','mt','mr','mb','yj','bk','bs']; //主框没有 px,py
        l=e.length;
        c=d.basic; //     basic={w:w,h:h,l:'',r:'',t:'',b:'',mg:'',yj:'',bk:'',bs:'',tz:false,sr:true,zd:'',px:'',py:''},  
        while(l--){
            k=e[l]; //key值
            n=c[k]; //value
            stylefun(a,k,n); 
        };
        //默认都 允许 若拽#######
      
          a.setAttribute('ui_drag',1); //可拖拽
       
        
        //检查是否允许输入 , 针对 type= 3和4   修改 dom.readOnly ###############
         if(t===3||t===4){
                if(c.sr){ //true :禁止输入  (新创默认都是 禁止)
                     a.readOnly=true;
                }else{//false 允许输入
                     a.readOnly=false;
                };
         };
        //判断 bg ############################################################################################################## 
        c=d.bg_img; //背景图相关
        if(c.bg){//存在背景图   处理bg  bg_wh=>bg_w bg_h 和 bg_pos=>bg_px,bg_py
            //  say(c.bg)
                stylefun(a,'bg',c.bg); 
                // say(c.bg_w,c.bg_h,c.bg_px,c.bg_py);
                stylefun(a,'bg_wh',c.bg_w,c.bg_h); //背景图宽高
                stylefun(a,'bg_pos',c.bg_px,c.bg_py);;//背景图位置调整
                stylefun(a,'bg_pp',c.bg_pp);// 是否平铺    
        }else{//不存在时,设置为开发 (类型基本背景色) (开发用,方便视觉区分)
                a.style.background=bg;
        };
       //font  ############################################################################
         //判断字体 
         if(c.zt){//字体需要单独判断引入
             say('判断字体缺失~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
         };
         //pl,gx:更新频率和更新字数,在其它地方设置 (多用于用于对话)
         c=d.font; // font:{zt:'',dx:'',jc:true,hg:'',sp:'',cz:'',jj:'',ys:'',bj:'',pl:'',gx:''},
         e=['dx','jc','sp','cz','jj','ys','hg','bj'];
           //大小,加错F,水平,垂直,间距,颜色,文本内容边距
         l=e.length;
         while(l--){
            k=e[l]; //key值
            n=c[k]; //value
            stylefun(a,k,n); 
        };
        //pl:'',gx:'' 文字频率 和 更新 在其它面板处理  

        

        //创建子元素  (只有 5容器 和 0模板 类型才允许有子元素 , 并且为全新创建)##################################
        if(!z){
            if(t===5||t===0){//5,0 类型 才有子元素
                b=d.child;
                if(b){//存在子元素
                    i=0,l=b.length;
                    while(i<l){
                        cjUiDom(b[i],a);// 子数据, 父容器元素
                        i++;
                    };
                };
            };
        };

        //检查是否为 自动排列元素 (判断父元素的type 是否为5)  是的话进行复制排列####
        c=d.basic; //
        if(c.zd>0){
            zi=0,zl=c.zd;//zi计数  zl创建数
            g=a.parentNode;
            h=g.ui_data;
            if(h&&h.type===5){//只有容器元素内才允许 子元素排列  (备注: 子元素数量不允许超过当前范围 , 后期如果允许的话 ,考虑将子元素 给位  position:absolute;display:inline-block,  只允许margin属性生效)
                    g.innerHTML='';//清空所有子元素
                    //判断父元素 w,h
                    //判断w,h 与 px,py偏移
                    // pw=h.basic.w<<0;
                    // ph=h.basic.h<<0;
                    // zw=c.w<<0,zh=c.h<<0,zx=c.px<<0,zy=c.py<<0;
                    // zw2=zw+zx;//横向宽度
                    // zh2=zh+zy;//竖向高度
                    // wn=(pw/zw2)<<0;//每行允许个数
                    // hn=(ph/zh2)<<0;//没列允许个数
                    i=0;
                    a.style.position='relative';// 改为 相对定位
                    a.style.display='inline-block';
                    stylefun(a,'w',c.w);
                    stylefun(a,'h',c.h);
                    stylefun(a,'ml',c.px);
                    stylefun(a,'mt',c.py);
                    hn=c.zd<<0;
                    while(i<hn){
                            // l=0;
                            // while(l<wn){
                                    //'w','h','l','t'
                                    zd=a.cloneNode(true);
                                    zd.ui_data=d;     
                                    zd.ui_path=[d.pId,d.zId];
                                    // n=zw,n+='';
                                    // stylefun(zd,'w',n);
                                    // n=zh,n+='';
                                    // stylefun(zd,'h',n);
                                    // n=zw2*l+zx,n+='';
                                    // stylefun(zd,'l',n);
                                    // n=zh2*i+zy,n+='';
                                    // stylefun(zd,'t',n);
                                    g.appendChild(zd);
                                    zi++;
                                    if(zi>=zl){ //达到数量结束
                                        i=hn;
                                        seleYsMb=null; //因为创建删除旧的
                                        app.ui_option={};//同上,清空数据
                                        break;
                                    };
                                // l++;
                            // };
                            i++;
                    };  
            };
         };
       


        return a; //返回创建的dom 
};

//获得 子元素id  
var getZsId=function(id){ //模板id
    var a=app.ui_mb,i=0,l,d,n=-1,f=0;
        l=a.length;
        while(i<l){
            d=a[i].ui_id<<0; //当前元素id
            if(d===id){
                d=a[i].ui_ys_id<<0;  //子元素id
                d++;
                a[i].ui_ys_id=d;
                return d;//返回新的元素id  (该模板下 顺位++)
            };
            i++;
        };
       
         
         
};

var dragLx=null;// 拖拽目标类型 ( dragStart 中确定)

//拖拽进入 放置目标元素区域 (必须阻止浏览器默认行为, 否则不会触发 ondrop)
game_main.ondragover=function(e){
      e.preventDefault();
};

//检查赋值到 dom上的ui_data是否,因数组数据'update'而丢失, 丢失的话则重新绑定  (跟组ui_path=[pId,zId])
var checkData=function(o,d){//数据,dom
    var a,b,c,e,f,g,i=0,l,u;
        if(o.type===u||d.ui_p_data===u){//数据已丢失
            o=d.ui_path;
            b=o[0],c=o[1];// pId,zId
            a=app.ui_mb;
            l=a.length;
            while(i<l){
                 e=a[i];
                 if(e.ui_id==b){//匹配到面板
                    a=e.data;
                    checloop(a,c,d,e);
                   return;
                 };    
                i++;
            };
        };
};

//上面的补充方法
var checloop=function(a,b,c,p){//data,zId,Dom ,pData
      var d,e,f,g,h,i,j,k,l,m,n;
         if(a.zId===b){
             c.ui_data=a;
             c.ui_p_data=p;//父数据, 父元素指向的有所不同 , 子=父.child[*]  ,模板=父.data
             return; 
         };
         d=a.child;
         i=0,l=d.length;
         while(i<l){
             e=d[i];
             checloop(e,b,c,a);
             i++;
         }; 
};

//拖拽结束 (判断目标 并且 放置)
game_main.ondrop=function(e){
    var a=e.target,b,c,d,e,p,n,m,o,u;
        if(dragLx>0){
            b=a.ui_data;
            if(b){//可放置目标
                // debugger;
                checkData(b,a); //检查数据是否丢失
                b=a.ui_data;//防止重新赋值的对象变化
                // console.error('此处 改为 id 路径索引, 根据 模板id 指向 打开的模板,以及路径深度, 通过该方式查值, 防止数据突然 失效 ')
                 p=b.type;//类型
                 if(p===0||p===5){ //只有0模板 和 5 容器允许添加子元素 
                        c=b.pId<<0; // ui_id
                        n=getZsId(c);;//新元素 zid
                        o={//基本宽高 ,不同类型的
                            1:['100','18'], //默认的wh
                            2:['100','18'],
                            3:['100','18'],
                            4:['100','50'],
                            5:['100','80'],
                        };
                        m=o[dragLx];
                        d=cjNewUiData(dragLx,n,c,m[0],m[1],'');//新数据
                        b.child.push(d);
                        o=cjUiDom(d,a);
                        if(o)o.ui_p_data=b;//子数据的父数据
                 }; 
            };
             
        };
        dragLx=0;
};
var seleYsMb=null; //选中修改的 ui元素dom目标

//点击目标 获取dom 数据 
game_main.onclick=function(e){
    var a=e.target,b,c,d,e,p,f=0;
        d=a.ui_data;
        if(d){ //存在数据
            checkData(d,a);//检查数据是否丢失
            d=a.ui_data;//防止重新赋值的对象变化
            b=reNew(d); 
            app.ui_option=b;//赋值数据
            seleYsMb=a;
        };
};

//编辑器内 拖拽 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
(function(){
    var mb,mf,dx=0,dy=0,zw=0,zh=0,pw=0,ph=0,bw=0,bh=0 ,kf=0;
    var mx,my;// mx.my:初始鼠标点击区域
        //kf=>1:当按住 alt键时,才允许拖动ui面板布局
        window.addEventListener('keydown',function(e){
             if(openF===0)return;//功能区未打开
             var k=e.keyCode;
                 if(k===18)kf=1;//允许拖拽布局
                //  say(k)

        });
        window.addEventListener('keyup',function(e){
            if(openF===0)return;//功能区未打开
            var k=e.keyCode;
               if(k===18){
                   kf=0;//禁止
                   mf=0;
                   mb=null;
               };   
        });
        //mb:拖拽目标,mf:(1:允许拖拽0:释放)
       //命中的拖拽目标 ,  mf=>1:有选择,0:未命中
        window.addEventListener('mousedown',function(e){
            if(openF===0)return;//功能区未打开
                if(kf===0)return; //禁止布局
                 var a=e.target,b,c,d,e,p,f=0;
                    b=a.getAttribute('ui_drag');
                    mb=null,mf=0;
                    if(b==='1'){//命中拖拽按钮
                        mx=e.pageX,my=e.pageY;
                       // 
                       c=a.parentNode; //目标容器元素
                       pw=c.clientWidth;  //容器宽度 (父元素)
                       ph=c.clientHeight; //容器高度 (父元素)
                    //    say(pw,ph);
                       dx=a.style.left.replace('px','')<<0;
                       dy=a.style.top.replace('px','')<<0;;  //初始top
                    
                       zw=a.offsetWidth;  //自身宽度
                       zh=a.offsetHeight; //自身高度
                    //    say(zw,zh);
                       bw=pw-zw; //不溢出的情况下, 允许向右拖动的范围
                       bh=ph-zh;// 不溢出的情况下, 允许向下拖动的范围
                    //    say()
                       f=1;
                    }else{
                       return;
                    };   
                    if(f===1){//命中拖拽元素
                          mb=a,mf=1;
                          e.stopPropagation();
                          e.preventDefault();
                    };  
        });
        //拖拽目标释放
        window.addEventListener('mouseup',function(){
            if(openF===0)return;//功能区未打开
           mf=0;
           mb=null; 
        });
        //拖拽目标释放
        window.addEventListener('blur',function(){
             if(openF===0)return;//功能区未打开
              mf=0;
              mb=null;
              kf=0; 
        });
        //拖拽目标移动
        window.addEventListener('mousemove',function(e){
            if(openF===0)return;//功能区未打开
              if(mf===1){
                  var x,y,cx=e.pageX,cy=e.pageY;
                      x=cx-mx,y=cy-my;
                    //   say(x,y)
                      x=dx+x;
                      if(x<0)x=0;
                      if(x>bw)x=bw;
                      y=dy+y;
                      if(y<0)y=0;
                      if(y>bh)y=bh;

                      mb.style.left=x+'px';
                      mb.style.top=y+'px';
                      e.stopPropagation();
                      e.preventDefault();
              };
        });
  })();
})();


/* 
编辑器_ui面板 以及子元素 拖拽_部分  (不允许溢出 容器 范围 )
*/

