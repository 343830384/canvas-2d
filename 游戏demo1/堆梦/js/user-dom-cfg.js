


var VmSJ=function(o){
    var t=this;
        t.dom=o.domMap;
        t.el=o.el;
        t.xt=o; 
       return t;
};
VmSJ.prototype.addEvent=function(o){
     var t=this,n=o.n,arr=o.arr,dom=t.dom,l=arr.length,fun=o.fun,k,d;
         while(l--){
            k=arr[l];
            d=dom[n][k];
            fun[k]=d; 
         };
         t[o.key]=fun;           
         o=null;
};





var mapDom=document.getElementById('map');



var uiDom=document.getElementById('ui');


var map=mapDom.getContext('2d');     
    map.lineWidth=1;
    map.strokeStyle="black";



var ui=uiDom.getContext('2d');




var allIdObj={}; 
var initImgObj; 
var w=800 ,h=600; 





var layout0={ 
    w:w, h:h,bg:'rgb(219,207,4)',    
    $c:{
        $list:['bar'],
        bar:{
            w:0,h:20,l:0,b:20,bg:'blue'
        }
    },
};
var layout1={ 
   w:w,h:h,bg:'rgb(219,207,4)',    
    $c:{  
        $list:['dmSm','select','sexS','bbSm'], 
        
        dmSm:{
            w:70,h:50,xm:1,t:100,font:'30px bolder 华文行楷',txt:'堆梦',color:'#F508F8'
         },
        
        bbSm:{
            w:380,h:220,xm:1,t:30,bg:'rgb(216,179,32',s:1,
            $c:{
               $list:['bbsm'],
               bbsm:{
                w:380,h:220,xm:1,font:'11px ',color:'#C52510',hh:1,zh:16,   
                txt:'||    之前发在抖音上的测试demo,试验移动端性能|(微信只能本地测试, 角色类需要版号!!) ||    注意:因本地图片也会涉及跨域, 可以使用demo根目录的 web简易服务器启动, 或自行搭建||    W,A,S,D移动,鼠标点击操作'
               }
            }
         },
        
        select:{
            w:120, h:120, xm:1,b:0,
            $c:{
                $list:['txt'],
                txt:{ 
                    w:120, h:120, xm:1,
                    yb:{ 
                        w:100,h:30,font:'21px', color:'red',pl:1,hh:0,zh:18,zxm:1,zym:1,xm:1,ym:1,ml:0,mt:5,border:[1,'blue'],bg:'rgb(198,247,247)',
                        arr:[1,['继续','说明','新的开始',] ],click:1, 
                    },
                }
            }
        },
        
        sexS:{
            w:220,h:100,xm:1,ym:1,bg:'rgb(219,207,4)',s:1,
            border:[1,'blue'],
            $c:{
                $list:['xbTx','xbN','xbV'],
                xbTx:{
                    w:200,h:30,xm:1,zxm:1,zym:1,font:'13px bloder',color:'rgb(167,15,27)',hh:1,zh:16,txt:'一旦选择便难以反悔!!|开启的梦境也只能在梦境中结束!'
                },
                xbN:{
                    w:60,h:30,l:10,b:10,font:'20px',zxm:1,zym:1,
                    txt:'男',bg:'rgb(216,179,32)',click:1
                },
                xbV:{
                    w:60,h:30,r:10,b:10,font:'20px',zxm:1,zym:1,
                    txt:'女',bg:'rgb(216,179,32)',click:1
                }
            }
        },        
    },
};
var layout2={
    w:w, h:h,
    $c:{
        $list:['head','zjpt','arrow','btn','editor','option','cT','cL','cR','cB','eitPy','gnCd','gnUI','rwRzPy','dhk','tsk0','tsk1'],
        cT:{w:w,h:40,t:0,bg:'black'}, 
        cL:{w:10,h:h,l:0,bg:'black'}, 
        cR:{w:50,h:h,r:0,bg:'black'}, 
        cB:{w:w,h:40,b:0,bg:'black'}, 
        head:{
          w:160,  h:40, t:40,r:50,
          $c:{
             $list:['touX','xueT','lanT'],
             touX:{
                 w:30,h:30,t:5,r:10, bimg:[8400,0,30,30,0,0],click:1,
                
             },
             xueT:{
                 w:100,h:8,t:9,l:10,bg:'red',
                 $c:{
                    $list:['xTxt'],
                    xTxt:{
                        t:-4,l:8,
                        font:'11px',txt:'200 / 200'
                    }
                 }
             },
             lanT:{
                 w:100,h:8,t:24,l:10,bg:'blue',
                 $c:{
                    $list:['lTxt'],
                    lTxt:{
                        t:-4,l:8,color:'rgb(6,182,61)',
                        font:'11px',txt:'200 / 200'
                    }
                 }
             },
             
          },
        },
        zjpt:{ 
           w:30,h:30,l:40,t:120,
           $c:{
               $list:['jlGg','fxYx'],
               jlGg:{
                    w:30,h:30,t:0,l:0, bimg:[8410,1,30,30,0,0],click:1,
               },
               fxYx:{
                    w:30,h:30,t:50,l:0, bimg:[8410,0,30,30,0,0],click:1,
               },
           }
        },
        btn:{
          w:120, h:260,r:50,b:40,
          $c:{
             $list:['btn0','btn1','btn2','btn3','btn4','btn5'],
             
             btn0:{
                 w:36,h:36,r:10,b:220,font:'12px',color:'red',click:1,
                 bimg:[8400,8,36,36,0,0],
             },
             btn1:{
                 w:36,h:36,r:10,b:170,bimg:[8402,5,36,36,0,0],font:'14px ',color:'red',click:1,
             },
             
             btn4:{
                 w:36,h:36,r:75,b:20,bimg:[8400,9,36,36,0,0],font:'14px',color:'red',click:1,
             },
             btn3:{
                 w:36,h:36,r:65,b:70,bimg:[8400,9,36,36,0,0],font:'14px',color:'red',click:1,
             },
             btn2:{
                 w:36,h:36,r:15,b:100,bimg:[8400,9,36,36,0,0],font:'14px',color:'red',click:1,
             },
             btn5:{ 
                 w:36,h:36,r:10,b:30,font:'12px',color:'red',click:1,
                 bimg:[8400,7,36,36,0,0],
                
             },
             
          },
        },
        eitPy:{
             w:84,h:36,xm:1,t:44,s:1,
             $c:{
                $list:['eitBtn','save'],
                save:{ 
                    w:36,h:36,bimg:[8402,8,30,30,3,6],click:1,   
                },
                eitBtn:{
                    w:36,h:36,r:0,bimg:[8402,0,36,36,0,0],click:1,     
                }
             }
        },
        arrow:{
        
        w:0,h:0,l:10,b:40,s:1, 
          $c:{
              $list:['rocker'],
              rocker:{
                  w:0,h:0
                
                
                
              }
          }
        },
        
        editor:{
            w:200,h:300,xm:1,ym:1,bimg:[8401,3,200,300,0,0],s:1,
            $c:{
                $list:['ePre','eNext','preF','nextF','mapE','jzE','closeE'],
                closeE:{
                   w:20,h:20,l:166,t:4,click:1,
                }, 
                ePre:{
                   w:30,h:30,l:160,t:73,click:1,
                },
                eNext:{
                   w:30,h:30,l:160,t:126,click:1,
                },
                preF:{
                   w:41,h:24,l:156,t:198,click:1,
                },
                nextF:{
                   w:41,h:24,l:156,t:253,click:1,
                },
                mapE:{
                   w:144,h:92,l:5,t:5,
                   yb:{
                      w:130,h:16,ml:7,mt:6,zym:1,zh:11,click:1,
                      font:'13px',color:'black',border:[1,'rgb(97,9,24)'],
                      
                      arr:[1,['水泥地板水','水泥地板','水泥地板','水泥地板'],0,-1]    
                   } 
                },
                jzE:{
                   w:144,h:192,l:5,t:102,
                   yb:{
                      w:130,h:16,ml:7,mt:7,zym:1,zh:11,click:1,
                      font:'13px',color:'black',border:[1,'blue'],
                      
                      arr:[1,['水泥地板','水泥地板','水泥地板','水泥地板','水泥地板','水泥地板','水泥地板','水泥地板'],0,-1]    
                   } 
                },
            }
        },
        
        option:{ 
             w:300,h:300,xm:1,ym:1,s:1,
             
            $c:{
                $list:['zb','res','info'],
                zb:{
                    w:100,h:200,l:0,
                    bimg:[8401,0,100,200,0,0],
                    
                    $c:{
                       
                       $list:['z0','z1','z2','z3','z4','z5','z6','z7','mbsz'],
                       z0:{
                          w:17,h:17,l:15,t:54,click:1,
                       },
                       z1:{
                          w:17,h:17,l:39,t:15,click:1, 
                       },
                       z2:{
                          w:17,h:17,l:38,t:41,click:1,
                       },
                       z3:{
                          w:17,h:17,l:37,t:63,click:1,
                       },
                       z4:{
                          w:17,h:17,l:38,t:92,click:1,
                       },
                       z5:{
                          w:17,h:17,l:66,t:42,click:1,
                       },  
                       z6:{
                          w:13,h:13,l:17,t:17,click:1,
                       },
                       z7:{
                          w:13,h:13,l:67,t:17,click:1,
                       },
                       
                       mbsz:{
                           w:100,h:68,t:112,
                           yb:{
                               w:26,h:11,ml:24,
                               font:'10px',
                               arr:[1,[200,200,0,0,0,0,0,0,0,0,0] ],
                            
                           }
                       }
                    },
                },
                res:{
                   w:200,h:200,r:0,
                   bimg:[8401,1,200,200,0,0],
                   $c:{
                      $list:['bags','bmap','closeB'],
                      bags:{ 
                          w:202,h:29,l:-2,t:2,
                          yb:{  
                              w:29,h:29,ml:4,click:1,border:[1,'red'],
                              
                              arr:[0,[8401,4,22,22,4,3],1,0],  
                          } 
                      },
                      closeB:{
                          w:20,h:20,l:172,t:6,click:1,border:[1,'red'],    
                      },
                      bmap:{ 
                          w:208,h:170,l:-2,t:32,
                          yb:{
                              w:28,h:28,ml:5,mt:5,click:1,font:'12px',zh:11,color:'red', border:[1,'red'],
                              
                            arr:[2,[],-1,-1], 
                          }
                      },
                   },   
                },
                info:{
                   w:250,h:100,b:0,  
                   hh:1,
                   ml:8,
                   
                   font:'11px',color:'rgb(3,67,25)',
                   bimg:[8401,2,300,100,0,0],
                   $c:{ 
                      $list:['pre','next'],
                      pre:{
                          w:30,h:30,r:-48,t:15,click:1,
                          bimg:[8400,3,30,30,0,0],
                      },
                      next:{
                          w:30,h:30,r:-48,t:60,click:1,
                          bimg:[8400,4,30,30,0,0],
                      },
                   },
                },
            },  
        },
        
        gnCd:{
            w:132,h:36,xm:1,b:42,
            $c:{
                $list:['zyBtn','shBtn','mrBtn'],
                
                zyBtn:{ 
                    w:36,h:36,click:1,bimg:[8404,10,36,36,0,0],
                    
                },
                shBtn:{
                    w:36,h:36,l:46,click:1,bimg:[8405,0,36,36,0,0],
                    
                },
                mrBtn:{
                    w:36,h:36,l:96,click:1,bimg:[8403,4,36,36,0,0],
                }

            }
        },
        
        gnUI:{
            w:300,h:220,xm:1,ym:1,s:1,
            $c:{
                $list:['shCl','shTm','shFy','shSm'],
                
                shCl:{
                    w:140,h:140,bimg:[8406,0,140,140,0,0],
                    $c:{
                        $list:['shCl0','shCl1'],
                        
                        shCl0:{
                            w:132,h:104,l:4,t:4,
                            $c:{
                                $list:['shCl00','shCl01'],
                                
                                shCl00:{
                                    w:44,h:44,xm:1,b:0,bimg:[-1,-1,44,44,0,0]
                                },
                                
                                shCl01:{
                                    w:132,h:104,
                                    
                                    yb:{
                                        w:22,h:22,ml:0,mt:4,font:'10px',zh:7,color:'#063A86',
                                        
                                        arr:[2,[  ],-1,-1],
                                    }
                                },
                            },
                        },
                        
                        shCl1:{
                            w:0,h:10,l:4,t:121,bg:'#1CBD07', 
                        },

                    }
                },
                
                shTm:{
                    w:120,h:140,l:140,bimg:[8406,1,120,140,0,0],
                    
                    yb:{
                       w:112,h:16,ml:4,mt:6,zh:12,font:'11px bolder',color:'red',click:1,border:[1,'blue'],
                       arr:[1,[ ],0,-1]
                    },  
                },
                
                shFy:{
                    w:40,h:140,l:260,bimg:[8406,2,40,140,0,0],
                    $c:{
                       $list:['shFy0','shFy1','shFy2'],
                       
                       shFy0:{
                          w:16,h:16,l:13,t:6,click:1,
                       },
                       
                       shFy1:{
                          w:26,h:25,l:7,t:61,click:1,
                       },
                       
                       shFy2:{
                          w:26,h:25,l:7,t:108,click:1,
                       },
                    }, 
                },
                
                shSm:{
                    w:300,h:80,b:0,bimg:[8406,3,300,80,0,0],
                   
                    $c:{
                        $list:['shSm0','shSm1'],
                        
                        shSm0:{
                            w:230,h:72,l:4,t:4,font:'11px bolder',color:'rgb(2,62,23)',hh:1,ml:6,
                            
                         
                        },
                        
                        shSm1:{
                            w:42,h:42,t:20,l:250,click:1,bimg:[8406,4,42,42,0,0]
                        }
                    }
                },
            },
        },
        
        rwRzPy:{
            w:300,h:300,xm:1,ym:1,s:1,
            $c:{
                $list:['rrp0','rrp1','rrp2','rjpBtn'], 
                
                rrp0:{
                    w:260,h:300,bimg:[8407,0,260,300,0,0],s:1,
                    $c:{
                       $list:['rrpLb','rrpWb'],
                       
                       rrpLb:{
                           w:270,h:292,l:4,t:4,
                           yb:{
                              w:230,h:20,mt:2,zym:1,pl:1,zh:13,font:'12px',color:'rgb(139,31,8)',click:1,border:[1,'blue'],
                              arr:[1,[],0,-1]
                           }     
                       },
                       
                       rrpWb:{
                           w:260,h:292,l:4,t:4,hh:1,zh:15,font:'12px',color:'rgb(139,31,8)',
                           txt:'',

                        },
                    }
                },
                
                rrp1:{
                    w:260,h:300,bimg:[8407,0,260,300,0,0],s:1,
                    $c:{
                       $list:['jy0','jy1','jy2'],
                       
                       jy0:{
                           w:20,h:20,l:8,t:4,
                           yb:{
                              w:20,h:20,mt:6,zym:1,zh:13,pl:1,font:'12px bold',color:'rgb(121,26,6)',border:[1,'rgba(10,158,27,0.8)'],
                              arr:[2,[ ['',[8461,0,20,20,0,0]],['',[8461,0,20,20,0,0]],['',[8461,0,20,20,0,0]],  ] ,-1,0]
                           }     
                       },
                       
                       jy1:{
                           w:170,h:20,l:32,t:4,
                           yb:{
                              w:170,h:20,mt:6,zym:1,pl:1,zh:13,font:'12px bold',color:'rgb(121,26,6)',click:1,border:[1,'rgba(10,158,27,0.8)'],
                              arr:[1,['葵花种子'] ,0,0]  
                           } 
                       },
                       
                       jy2:{
                         w:50,h:20,l:206,t:4,
                           yb:{
                              w:50,h:20,mt:6,zym:1,pl:1,zh:8,font:'11px bold',color:'rgb(121,26,6)',border:[1,'rgba(10,158,27,0.8)'],
                              arr:[1,[3234,3,3,] ,[8450,0,10,10,35,5],0]
                           } 

                       },
                    }
                },
                
                rrp2:{
                    w:260,h:300,bimg:[8407,0,260,300,0,0],s:1,
                    $c:{
                       $list:['py0','py1',],
                       
                       py0:{
                           w:70,h:20,l:30,t:4,
                           yb:{
                              w:70,h:20,mt:6,zym:1,zh:11,pl:1,font:'12px',color:'rgb(121,26,6)',border:[1,'rgba(10,158,27,0.8)'],
                              arr:[1,[] ,[8407,11,10,10,-14,5],-1] 
                           }     
                       },
                       
                       py1:{
                           w:120,h:20,l:122,t:4,
                           yb:{
                              w:120,h:20,mt:6,zym:1,pl:1,zh:11,font:'12px',color:'rgb(121,26,6)',click:1,border:[1,'rgba(10,158,27,0.8)'],
                              arr:[1,[] ,0,-1] 
                           } 

                       },
                    }
                },
                
                rjpBtn:{
                    w:40,h:300,l:260,bimg:[8407,1,40,300,0,0],
                    $c:{
                        $list:['rrp10','rrp11','rrp12','rrp13','rrp14'],
                        rrp13:{
                            w:30,h:30,xm:1,t:86,click:1,
                        },
                        rrp14:{
                            w:30,h:30,xm:1,t:139,click:1,
                        },
                        rrp10:{
                             w:40,h:67,xm:1,t:0,click:1,bimg:[8407,2,27,52,6,15],
                             $c:{
                                $list:['rrpGb'],
                                rrpGb:{
                                    w:13,h:13,r:0,t:0,color:'rgb(175,24,7)',txt:'✖',font:'12px bloder'
                                }
                             }
                        },
                        rrp11:{ 
                             w:32,h:32,xm:1,t:200,click:1,bimg:[8407,6,32,32,0,0]
                        },
                        rrp12:{ 
                             w:32,h:32,xm:1,t:255,click:1,bimg:[8407,5,32,32,0,0]
                        }
                        
                    }
                }  
            }
        },
        
        dhk:{
            w:554,h:120,xm:1,b:40,click:1,s:1,
            $c:{
                $list:['dhWl','dhBl','dhBr'], 
                dhBl:{
                    w:2,h:120,bimg:[8408,2,2,120,0,0]
                },
                dhBr:{
                    w:2,h:120,r:0,bimg:[8408,2,2,120,0,0]
                },
                dhWl:{ 
                  w:550,h:120,l:2,bimg:[8408,1,550,120,0,0],
                  $c:{
                      $list:['dhWb','dhLb'],
                        dhWb:{ 
                        w:80,h:60,l:4,t:20,hh:1,
                        font:'15px',color:'rgb(135,40,8)',
                        txt:'?? --',
                     },
                    dhLb:{
                        w:450,h:110,l:90,t:5,
                        yb:{
                            w:450,h:35,hh:1,font:'12px',zh:14,color:'rgb(14,55,164)',click:1,border:[1,'red'],
                            
                            arr:[1,[],0,-1]
                        }
                    },
                  } 
               },
            }
        },   
        
        tsk0:{
            w:300,h:50,xm:1,b:40,bimg:[8408,0,300,50,0,0],s:1,
            $c:{
               $list:['tskw0'],
               tskw0:{ 
                   w:270,h:46,l:20,t:5,click:1, 
                   hh:1,font:'11px',color:'rgb(14,55,164)',
                   txt:''    
               } 
            },
        },
        
        tsk1:{
            w:300,h:50,xm:1,ym:1,bimg:[8408,0,300,50,0,0],s:1,
            $c:{
               $list:['tskw1'],
               tskw1:{ 
                   w:270,h:46,l:20,t:5,click:1, 
                   hh:1,font:'11px',color:'rgb(25,68,182)',
                   txt:'大叔大叔的大叔大叔的大叔大叔的大叔大'    

               } 
            },
        },
 } 
};

var layCfg={
    length:3,
    0:layout0,
    1:layout1,
    2:layout2,
};

var xnDom=new DomVm({
    dom:uiDom,
    el:ui,
    width:w,
    height:h,
    showN:0,  
    layer:layCfg,
});

var xnEvt=new VmSJ(xnDom); 



var dhDl=TOOL.dhDl; 



var jdbar=xnDom.domMap[0].bar;

var loadJd=function(a,b){ 
       var c;
           if(a!==b){
               c=b/a;
               c=c.toFixed(2)*1;
           }else{
               xnDom.showN=1;
               xnDom.img=allIdObj; 
               xnDom.drawAll();
           };
           jdbar.w= (w*c)<<0;
           xnDom.reLocal(jdbar);
    };







 
imgLoad.init(allImgData,loadJd,function(){ 
  
        gSaveXg(0); 
        
        
        
        
        
        TOOL.fpsArr[0]=[0,2];
        TOOL.funArr[0]=function(t){
               if(FF===0)return;
            
               
                mapBrushWorkerPost([0, keyNow]); 
                
                
                
                
                
                
                
                
                if(tsF===1){ 
                    if(t-tsJ>3000){
                        tsJ=t; 
                        xnEvt.tsK();
                    }; 
                };
        };
        TOOL.animation();
});





xnEvt.addEvent({ 
    n:2, 
    arr:['editor','option'], 
    key:'eitBtn', 
    fun:function(f){ 
        var mt=this, xt=mt.xt,t=mt.eitBtn,e=t.editor,b=t.option,g=gCfg,o=g.opt,j=o.jnQh,x=xnEvt,z=zdyEvt;
            
            
             if(f===1){
                  if(x.editXg.d){
                      j[3]=0;
                      
                  }else{
                      j[3]=1;  
                  };
                  if(o.bag)x.bagKg();
                  x.gnQh(3);
                  mt.mbKg(2);
             }else{
                 j[3]=0;
                 if(e.s===0){
                     e.s=1, 
                     xt.switch(e);
                 };
                 x.editXg();
                  
                  mt.mbKg(1);
             };
    },
});



xnEvt.addEvent({
    n:2,
    arr:['btn'],
    key:'gnQh',
    fun:function(n){
       var mt=this, xt=mt.xt,t=mt.gnQh,b=t.btn,g=gCfg,o=g.opt,j=o.jnQh,k=g.skill,q,z,c,a,l=6,d,v,i;
        
           n=n||0;
           v=j[n];
           o.gn=n;
           if(n===1){
                 d=[[8403,3],[8402,5],[8403,2],0,[8403,1],[8403,0]];  
           }else if(n===0){ 
                 d=v?k.kj:k.jn; 
           }else if(n===2){
                 d=v?[[8404,9],[8402,5],[8404,8],[8404,7],[8404,6],[8404,5]]:[[8404,4],[8402,5],[8404,3],[8404,2],[8404,0],[8404,1]]; 
           }else if(n===3){
                 d=v?[0,0,0,0,0,[8402,7]]:[[8402,6],[8402,5],[8402,1],[8402,3],[8402,2],[8402,4]];
           }else if(n===4){
               
               d=v?[[8405,5],[8402,5],0,0,[8405,4],[8405,1]]:[0,[8402,5],[8405,6],[8405,3],[8405,2],[8405,7]]; 
               
               
           };
          
          z=b.xy;
          mt.el.clearRect(z[0],z[1],z[2]-z[0],z[3]-z[1] ); 
          
          c=b.$c,a=c.$list; 
               while(l--){
                   q=c[a[l]];
                   i=q.bimg; 
                   z=d[l];
                   if(n===0&&!z){  
                       z=[8400,9]; 
                   };
                   i[0]=z[0],i[1]=z[1];
               };
               xt.reLocal(b);
    }
});


xnEvt.addEvent({
   n:2,
   arr:['editor','mapE','jzE','option'],
   key:'editXg',
   fun:function(n,d){ 
      var mt=this, xt=mt.xt,t=mt.editXg,e=t.editor,m=t.mapE.yb.arr,j=t.jzE.yb.arr,cd=t.option,g=gCfg,opt=g.opt ,o,c,u,b,p;
          if(n===1){
              d=[
                 ['土地','水面','土地','水面','水面5'], 
                 {
                   a:['桌子1','板凳','桌子1','板凳','桌子1','板凳','桌子1','板凳','板凳9'], 
                   0:{
                       a:['花瓶','小桌子','花瓶','小桌子','花瓶','小桌子','花瓶','小桌子','花瓶','小桌子10',],
                       1:{
                           a:['笔记本']
                       }
                   }  
                 }
              ];
              
              
              if(!d)return; 
              e.s=0; 
              t.d=d;
              t.a=[];

              o=zdyEvt.jzCl(d[1],t.a); 
              t.o=[d[0],o,[],[],0,0];
              zdyEvt.editFy(t.o);
              m[1]=t.o[2];
              j[1]=t.o[3];
              xnEvt.editXz();
              if(opt.bag===1){ 
                  xnEvt.bagKg();
              };
              
          }else if(n===2){
             
              c=t.o;
              if(c){
                  if(d===1){
                      c[4]++,c[5]++;
                  }else{
                      c[4]--,c[5]--;
                  };
                  zdyEvt.editFy(c);
                  m[1]=c[2] , j[1]=c[3];
                  xnEvt.editXz();
              }else{
                  return;
              }; 
          }else if(n===3){
               c=t.d;
               if(c){
                      p=d===1?-1:j[3];
                      if(d||p>-1){ 
                          o=zdyEvt.jzCl(c[1],t.a,p);
                          if(o!==0){
                              b=t.o;
                              b[1]=o,b[5]=0; 
                              zdyEvt.editFy(b);
                              m[1]=b[2];
                              j[1]=b[3];
                              xnEvt.editXz();
                          }else{
                              return;
                          };
                      }else{
                          return;
                      };
               }else{
                   return; 
               };
          }else if(n===4){
          
                 if(e.s===0){
                     e.s=1;
                     cd.s=0;
                     xt.switch(e);  
                     xt.switch(cd); 
                 }else{
                     e.s=0;
                     cd.s=1;
                     xt.switch(cd);  
                     xt.switch(e); 
                 };
               return;  
          }else if(n===5){
               e.s=1;
               xt.switch(e);
               return;  
          }else{
              
              if(e.s===0){
                 e.s=1;
                 xt.switch(e);
              };
                t.d=u,t.a=u,t.o=u;
                m[1]=[],j[1]=[];
              return;     
          };
          xt.switch(e);
   }
});



xnEvt.addEvent({
   n:2,
   arr:['editor','mapE','jzE' ], 
   key:'editXz',
   fun:function(n){
      var mt=this, xt=mt.xt,t=mt.editXg,e=t.editor,m=t.mapE.yb.arr,j=t.jzE.yb.arr,u;
          
          if(n!==u){
              if(n){
                m[3]=-1;
              }else{
                j[3]=-1;
              };
          }else{
              m[3]=-1,j[3]=-1;
          };
   }
});


xnEvt.addEvent({
  n:2,
  arr:['bmap','res'], 
  key:'bagList',
  fun:function(n,m){ 
     var mt=this, xt=mt.xt,t=mt.bagList,arr=t.bmap.yb.arr,res=t.res,g=gCfg,b=g.bag,i=0,l=30,a,d,c,v, z=zdyEvt,x,f,s,e, u;
         
         if(n===u){
            n=g.opt.bagn;
         }else{
            f=1; 
         };
         if(m===1){ 
             s=0,e=b.n,f=g.opt.bag; 
         }else{
             s=n,e=s+1;
         };
         while(s<e){  
            x=b[s]; 
            i=0,a=[];
            while(i<l){
                d=x[i];
                if(d){
                    c=d.t;   
                    v=z.getWpSm(c,d.id,1,d.b);
                    
                    c=c<20?'':d.n; 
                    a[i]=[c,[v[0],v[1],20,20,5,5]];    
                }else{
                    a[i]=0; 
                };
                i++;
            };
            if(s===n)arr[1]=a; 
            s++;
         }; 
        
          if(f===1){
              z.kBXzQc();
              xt.reLocal(res); 
          };   
  }
});


xnEvt.addEvent({
    n:2,
    arr:['zb','res'],
    key:'wpUse',
    fun:function(n){
      var mt=this, xt=mt.xt,t=mt.wpUse,zb=t.zb,res=t.res,g=gCfg,o=g.opt,b=g.bag,s=g.sex ,st,sn,d,z,m,q ;
         if(n===5){ 
          
            st=o.szbt; 
            if(st===0){
                sn=o.szbn;
                b=b[o.bagn];
                d=b[sn]; 
                z=d.t;   
                if(z===0){
                    if(d.s!==s&&d.s!==2)return;
                  
                   m=d.b;
                   
                   q=zdyEvt.zbUpdate(m,d);
                   if(q[0]===1){
                        b[sn]=0;   
                   }else{
                        b[sn]=q[1]; 
                   };
                   xnEvt.zbDataGx(m);
                   xnEvt.bagList(o.bagn);
                   
                };
                
                
                
                
                

            };  
         };
    }
});


xnEvt.addEvent({
   n:2,
   arr:['bags'],
   key:'bagXzTjZh',
   fun:function(f,i){
        var mt=this,xt=mt.xt,t=mt.bagXzTjZh,bag=t.bags.yb.arr,g=gCfg,o=g.opt,z=zdyEvt,b=g.bag,bb,zb,n,v;
          
          
           if(f===0){
               bag[3]=i;
               o.bagn=i;
               xnEvt.bagList(i); 
               gYx.ypTj([[0,1,0]]); 
           }else if(f===1){
              
               n=o.szbn; 
               bb=b[o.bagn];
               zb=bb[n]; 
              
               v=z.bagTj(zb,i);
              
               z.tjWp(v,bb,n,b);
              
           }else if(f===2){
               bag[2]++;
               if(bag[2]>6){
                   bag[2]=6;
               }else{
                  g.bag.n=bag[2];
                  g.bag[bag[2]-1]=[]; 
               };   
               xnEvt.bagList(o.bagn);
              
           }else{
                 bag[2]=g.bag.n;
           };
           
          
   },
});


xnEvt.addEvent({
      n:2,
      arr:['zb'],
      key:'zbDataGx',
      fun:function(n,cs){ 
          var mt=this, xt=mt.xt,t=mt.zbDataGx,zb=t.zb.$c,z=gCfg.zb,i,l,g=gCfg,f,o,d ,u,m,a,b,c;
              o=[200,200,0,0,0,0,0,0,0,0,0];  
                
               
               
                if(n<6||cs)f=1; 
                
                
                i=0,l=8;
              
               while(i<l){;
                  d=z[i];
                  if(d){
                      
                      m=zdyEvt.getWpSm(0,d.id,1,i); 
                      
                      
                       zb['z'+i].bimg=i<6?[m[0],m[1],17,17,0,0]:[m[0],m[1],13,13,0,0]; 
                       a=d.a,b=11;
                       if(a){
                            while(b--){
                                c=a[b];
                                if(c>0)o[b]+=c; 
                            };
                      };
                  }else{
                      zb['z'+i].bimg=u; 
                  };
                  i++;
                }; 
                  g.zbData=o;       
                  zdyEvt.jsData(cs?-1:u); 
               if(!cs)xt.reLocal(t.zb);
                  
                 g.opt.jsgx=f===1?1:2; 
                
      },
});


xnEvt.addEvent({
  n:2,
  arr:['mbsz'],
  key:'mbSzGx',
  fun:function(d){
      var mb=this.mbSzGx.mbsz.yb.arr;
          mb[1]=d;
          
  }
});


xnEvt.addEvent({
  n:2,
  arr:['xueT','lanT','xTxt','lTxt'],
  key:'zbXM',
  fun:function(n,d){
      var mt=this, xt=mt.xt,t=mt.zbXM,x=t.xueT,l=t.lanT,wx=t.xTxt,wl=t.lTxt,g=gCfg,a=g.zbXM,b=g.zbMb,z=x.xy,v=0;
           
           
          
          if(n===1){ 
              v=a[0]-d;
              if(v<1)v=0;
              a[0]=v;
              if(v===0){
                 v=1;
                 
             };
          }else if(n===2){
              v=a[2]-d;
              if(v<1){
                  a[2]+=d;
                  v=2;
                  
             }else{
                  a[2]=v;
              };
          }else if(n===3){
               a[0]+=d[0];
               a[2]+=d[1];  
          }else{
              
              a[1]=b[0];
              a[3]=b[1];
         };
          
            if(a[0]>a[1])a[0]=a[1];
            if(a[2]>a[3])a[2]=a[3];
            g.zbSx[0][5]=a[0]; 
            
            
            x.w=(a[0]/a[1]*100)<<0;
            l.w=(a[2]/a[3]*100)<<0;
            
            wx.txt=a[0]+' / '+a[1];
            wl.txt=a[2]+' / '+a[3];
          
           if(n!==-1){
                xt.el.clearRect(z[0],z[1],100,24 );
                xt.reLocal(x);
                xt.reLocal(l);
           };  
          if(v===1){
                qdG.push([4,5]);
                
          }else if(v===2){

          };
           return v; 
  }
});


xnEvt.addEvent({
   n:2,
   arr:['info'],
   key:'wpInfo',
   fun:function(f,s,p){
      var mt=this, xt=mt.xt,t=mt.wpInfo,info=t.info,l,u,z=1,w,a,b,c,d,e,g,z=zdyEvt;
          
          
          
          if(f===1){
                  a=s.t; 
                  if(a===0){
                      t.s=z.getWpSm(a,s.id,s.a,s.b); 
                  }else{
                      if(a>13&&a<20)c=2; 
                      b=z.getWpSm(a,s.id,c);
                      if(a===5)b[0]+=z.getDwSx(s.a); 
                      t.s=b;
                  };
                  t.p=0;   
          }else if(f===2){
                  if(t.s===u)return; 
                  
                  if(p){
                      t.p++,l=t.s.length;
                      if(t.p===l)t.p=l-1;  
                  }else{
                      t.p--;
                      if(t.p<0)t.p=0; 
                  };
          }else{
          
                  t.s=u;
                  info.txt=u;
                  if(!f)z=0;
          };
          if(z){
                  if(f!==3)info.txt=t.s[t.p];
                  xt.reLocal(info);
          };
   } 
});


xnEvt.addEvent({
  n:2,
  arr:['option'],
  key:'bagKg',
  fun:function(f){ 
      var mt=this, xt=mt.xt,t=mt.bagKg,a=t.option,o=gCfg.opt,x=xnEvt,z=zdyEvt, v;
           if(o.rrp||o.zzKg)return; 
           
             if(f===1){
                    ccIntF=0; 
                    gYx.ypTj([[0,1,0]]); 
                    a.s=0;
                    o.bag=1;
                    z.bBXzQc();
                
                    mt.mbKg(2);
                 
              }else{
                    gYx.ypTj([[1,1,0]]); 
                    a.s=1;
                    o.bag=0;
                    z.bBXzQc();
                    xnEvt.wpInfo(3);
                    z.jsgx(); 
              };
              xt.switch(a); 
              if(f!==1)mt.mbKg(1);
  }
});


xnEvt.addEvent({
   n:2,
   arr:['btn'], 
   key:'kjBtn',
   fun:function(n,f){
      var mt=this, xt=mt.xt,t=mt.kjBtn,bt=t.btn.$c['btn'+n],g=gCfg,o=g.opt,b=g.bag,k=g.skill.kj,x=xnEvt,z=zdyEvt,a,s,q,d,u,i,v,m=1,p=1,arr,w=g.wpCfg,gt=gTxt,u;
          
          
          
           if(f){
                        q=k[n];
                        if(!q)return; 
                        s=q[2],a=q[3]; 
                        d=b[s][a];
                        if(f===1){
                                if(d){
                                    m=0;
                                    
                                  
                                    if(d.n>0){
                                            d.n--;
                                            if(d.n){
                                                p=0; 
                                                if(o.bag)x.bagList(o.bagn);
                                            };
                                    };
                                }; 
                        }else{
                            p=0;
                        }; 
                        if(p){
                            b[s][a]=0; 
                            if(o.bag)x.bagList(o.bagn);
                            
                            
                            v=z.kjWpCx(q[4],q[5]);  
                            
                            if(v){
                                q[2]=v[0],q[3]=v[1]; 
                                if(m){
                                    
                                   x.kjBtn(n,1);
                                    return;   
                                };
                            }else{
                                f=2;
                            };
                        };  
                        if(f===2){
                            k[n]=u;   
                            
                       };
                        
           }else{
                
               a=o.szbn,s=o.bagn;
                d=b[s][a];
                if(d.kj){
                    x.kjBtn(d.kj,2); 
                };
                i=gt[w[d.t][0]][d.id]; 
                k[n]=[i[1],i[2],s,a,d.t,d.id];
                z.kBXzQc(1);
          };
          x.gnQh(0);
          
   },
});



xnEvt.addEvent({
    n:2,
        
    arr:['gnUI','shCl','shTm','shSm','shCl00','shCl01','shCl1','shSm0','shSm1'], 
       
    key:'shZz',
    fun:function(n,m){
         var mt=this, xt=mt.xt,t=mt.shZz,sm=t.gnUI,s0=t.shCl,s1=t.shTm,s2=t.shSm,gt=gTxt,s3=t.shCl1,go=gCfg.opt,a,b,c,d,e,f=0,g,h,i,j,k,o,z=zdyEvt;
              
            
             if(n===0){ 
                
                  if(!sm.s)return;
                  mt.mbKg(0);
                  go.zzKg=1; 
                  sm.s=0; 
                  f=1; 
                  
                  
                  
                  a={                                                                                  
                      0:[20,60,130],1:[21,60,130],2:[22,60,130],3:[23,60,100],4:[24,-1],5:[25,-1], 
                  };
                  b={0:[8405,1],3:[8405,4],4:[8405,5]}; 
                  
                  b=b[m]||[8405,5];
                  c=t.shCl00.bimg;
                  c[0]=b[0],c[1]=b[1];
                  m=a[m];

                  t.m=m;
                  t.n=0; 
                  t.d=gCfg.tp[m[0]]; 
                  
                  t.d2=gTxt[m[0]];   
                  t.s=0; 

                  d=z.getZzLb(t.d.slice(0,6),t.d2 );
                  s1.yb.arr[1]=d; 
                  
                  t.shSm0.txt='选择已学习图谱 ,消耗对应数量的材料,并在指定地点制作... |如果还未掌握制作图谱和相关知识, 请尝试向这里的居民打听...';

             }else if(n===1){
                
                 if(t.s)return; 
                 a=s1.yb.arr;
                 if(a[3]===m)return; 
                 t.p=t.d[6*t.n+m]; 
                 a[3]=m; 
                 b=z.getZzClSm(t.shCl01.yb.arr,t.p,t.d2,t.m); 
                 t.c=b;
                 t.shSm0.txt=b[4]+b[5]+'; 熟练度:'+t.p[1];
               
                 f=2; 
             }else if(n===2){
                 if(t.s)return;
                 a=t.n; 
                 m?a++:a--;
                 if(a<0)return;
                 b=z.getZzLb(t.d.slice(a*6,(a+1)*6),t.d2 );
                 if(b.length){ 
                    t.n=a; 
                   
                    s1.yb.arr[1]=b; 
                    s1.yb.arr[3]=-1;
                    t.shSm0.txt=''; 
                    t.shCl01.yb.arr[1]=[];
                    s3.w=0;
                    f=2;   
                 };
             }else if(n===3){
                  if(!t.c||t.s)return;
                   a=z.zZXh(t.c); 
                   if(a){
                       t.s=1;
                       f=3; 
                       j=t.c[6]; 
                       
                       b=t.p;
                       c=b[1];
                       if(c){
                         e=c,g=0;
                         if(c>100){
                              g=1;
                              e=c-100;
                         };
                       
                         d=(100*Math.random()<<0); 
                       
                         if(e>d){
                               t.z=1; 
                              if(g){
                                 t.z=2; 
                                  
                             };
                         }else if(g){
                              t.z=1;
                         }; 

                         
                         
                         
                          e=t.m[2];
                          if(c<e){
                               e=((((e-c-1)/10)<<0)+1)*10; 
                               d=(100*Math.random())<<0; 
                               if(e>d){
                                   
                                  b[1]++;
                               };
                          };
                       }else{
                           t.z=1; 
                       };
                       s3.w=0;     
                       xt.reLocal(s0);
                       h=function(t,s,t2,i){
                                if(s-t.s>=2000){ 
                                   var c=s-t.e,e,x=t.x,xt=t.xt,m=t.m,f=1;  
                                       t.s=s;
                                       e=(c/t.j*132)<<0; 
                                       if(e>132)e=132; 
                                       t.n++; 
                                       
                                       if(m-t.n>2||t.g!==1){
                                           t.a=t.a?0:1; 
                                           x.txt='制作中'+(t.a?'.........................':'..........');
                                       }else if(m-t.n===2){
                                            if(t.g){
                                               x.txt='发生了奇迹!!!|你提前制作出了一份: '+t.b+' ,于是你尝试用这份剩余的材料继续制作......';
                                            };
                                       }else{
                                           f=0;
                                       };
                                       t.o.w=e;
                                       xt.reLocal(t.o);
                                       if(c>=t.j){ 
                                           f=1;
                                           if(t.z>2){
                                               if(t.g){
                                                   x.txt='恭喜!!!!!!!!!!!!!!|你成功制作出了双份的 : '+t.b;
                                               }else{
                                                   x.txt='可惜!|差一点就成功了双份的 : '+t.b+' .也许我还需要提升一下熟练度!';
                                               };
                                           }else{
                                               x.txt='恭喜!!!!|你成功制作出了 : '+t.b;
                                           };
                                           xnEvt.shZz(4);
                                           t2.del(i);
                                       };
                                       if(f)xt.reLocal(t.xd);
                                };
                       };
                       
                       
                       h.o=s3;
                       h.b=t.c[4]; 
                       h.j=j[0]*1000; 
                       h.c=t.z; 
                       h.g=g;  
                       h.x=t.shSm0; 
                       h.xd=s2 ; 
                       h.xt=xt;
                       h.m=(j[0]/2)<<0; 
                       h.n=0;          
                       h.x.txt='制作中..........';
                       xt.reLocal(s2);
                       h.s=new Date().getTime();
                       h.e=h.s;
                       dhDl.push(h);
                       h=null;
                   };
             }else if(n===4){
                   if(t.s&&t.z>0){ 
                           a=t.c[7]; 
                           b=a[3]||1;  
                           b=b*t.z;
                           c=a[0];
                           e=0;
                           if(c<20){ 
                           while(b--){
                               o={t:c,id:a[1]};
                               d=z.wpTj(o); 
                               if(d){
                                   
                                  break;
                               };
                           };    
                           }else{
                               o={t:c,id:a[1],n:b};
                               z.wpTj(o);
                               if(o.n>0){
                                   
                              };
                           };
                           
                           
                           
                          
                   }else{
                       
                  };
                   t.z=0; 
                   t.s=0; 
             }else{
                       
                       if(t.s)return; 
                       t.c=0,t.d=0,t.d2=0;
                       t.z=0;
                       sm.s=1,f=1;
                       s1.yb.arr[3]=-1;
                       t.shSm0.txt=''; 
                      if(n!==5)zdyEvt.ztKg();
                       go.zzKg=0; 
                       mt.mbKg(1);
             };
             if(f===1){
                 xt.switch(sm);
             }else if(f===2){
                 xt.reLocal(s0);
                 xt.reLocal(s1);
                 xt.reLocal(s2);
             }else if(f===3){
                 xt.reLocal(s0);
             }else if(f===4){
                 xt.reLocal(s0);
                 xt.reLocal(s2);
             };
    }
});


xnEvt.addEvent({
    n:2,
      arr:['rwRzPy','rrp0','rrp1','rrp2','rjpBtn'],
      key:'rjpGn',
      fun:function(n,p){ 
          var mt=this, xt=mt.xt,t=mt.rjpGn,g=gCfg,o=g.opt,a1=t.rrp0,a2=t.rrp1,a3=t.rrp2,a4=t.rjpBtn,a=t.rwRzPy,b,c,d,e,f,f2,h,i,j,k,l,m,n,u,z=zdyEvt;
              
              
            
                if(t.f!==1){
                   t.f=1;
                   
                   t.d1=[a1,a2,a3];
                   t.d2=[];        
                   b=a1.$c;
                   
                   t.d2[0]=[
                       b.rrpLb, 
                       b.rrpWb, 
                       b.rrpLb.yb.arr 
                   ];
                   b=a2.$c;
                   t.d2[1]=[
                       b.jy0.yb.arr,
                       b.jy1.yb.arr,
                       b.jy2.yb.arr,
                   ];
                   b=a3.$c;
                   t.d2[2]=[
                       b.py0.yb.arr,
                       b.py1.yb.arr,
                   ];
                   
                   b=a4.$c;
                   t.d3=[
                       b.rrp10.bimg, 
                       b.rrp11.bimg, 
                       b.rrp12 .bimg,
                   ];
                   
                };
                
                if(n<3){
                    z.close();
                    
                    b=t.d3;
                    b[0][1]=[2,3,4][n]; 
                    b[1][1]=[6,9,7][n]; 
                    b[2][1]=[5,10,8][n];
                    
                    t.N=n;        
                    t.O=t.d1[n];  
                    t.O.s=0; 
                    a.s=0;
                    f2=1; 
                    
                    t.D=z.getRjy(n,0,0);
                    t.J=0; 
                    t.I=0; 
                    t.S=-1;
                    mt.mbKg(2); 
                    xt.switch(a);
                    o.rrp=1; 
                };

                if(n===3||f2===1){
                     n=t.N;
                     i=t.I;
                     if(f2===1){
                        i=0; 
                     }else{
                        i+=p===1?1:-1;
                        if(i<0)return; 
                     };
                     j=t.J;
                     if(n===0){
                         d=t.d2[0];
                         if(j===0){
                                
                                d[1].txt='';
                                c=z.getRjy(n,0,i);
                                if(c.length>0){
                                    d[2][1]=c;
                                    t.I=i; 
                                    f=1;
                                }else{
                                    return; 
                                };  
                         }else{
                                d[2][1]=[];
                                c=t.D; 
                                e=c[i];
                                if(e!==u){
                                   d[1].txt=e;
                                   t.I=i;
                                   f=1;
                                }else{
                                    return;
                                };
                         };
                     }else if(n===1){
                        
                        
                        
                        
                        
                        
                        
                     }else if(n===2){
                           c=z.getRjy(n,i);
                           if(c!==u){
                              t.I=i;
                              
                               t.D=c; 
                               d=t.d2[2];  
                               d[0][1]=c[0];
                               d[1][1]=c[1];
                               d[1][3]=-1; 
                               t.S=-1;     
                               f=1;
                           }else{ 
                               return;  
                           };
                     };
                }else if(n===4){
                     n=t.N;
                     i=t.I;
                     if(n===0){
                        p=i*13+p; 
                        c=z.getRjy(n,1,p);
                        if(c===u)return; 
                        d=t.d2[0];
                        d[2][1]=[]; 
                        t.I=0;
                        t.J=1;
                        t.D=c;
                        d[1].txt=c[0];
                        f=1;  
                     }else if(n===1){

                     }else if(n===2){
                        
                         t.S=p;
                         d=t.d2[2];  
                         d[1][3]=p;  
                         f=1;
                     };
                    
                }else if(n===5){
                     n=t.N;
                     i=t.I;
                     if(n===0){
                          if(p===1){
                            mt.rjpGn(0); 
                          };
                     }else if(n===1){

                     }else if(n===2){
                          if(p===0){
                              c=t.S;
                              if(c>-1){
                                  t.S=-1; 
                                  d=t.d2[2];
                                  m=t.D; 
                                  d[0][1].splice(c,1);
                                  d[1][1].splice(c,1);
                                  d[1][3]=-1;
                                  k=i*11+c; 
                                  g.yx.splice(k,1); 
                                  k=m[2][c];
                                  
                                 f=1;
                              };
                          }else{
                              return;
                          };
                     }

                }else{
                     f=2;
                     o.rrp=0; 
                };
               if(f>0){
                   if(f===2){
                       a.s=1;
                       t.O.s=1;
                       xt.switch(a);
                       mt.mbKg(1); 
                   }else{
                       xt.switch(t.O);
                   }
               };

      }
});


xnEvt.addEvent({
    n:2,
    arr:['dhk','dhWl','dhWb','dhLb'],
    key:'dhK',
    fun:function(n,p){ 
        var mt=this, xt=mt.xt,t=mt.dhK,a=t.dhk,c=t.dhWb,d=t.dhLb,h=d.yb.arr,i,j,k,l,m,o=gCfg.opt,q,r,u,x,y,z=zdyEvt ;
            
            
          
            
             if(n===0){
                  q=gNpcJb[p]; 
                  if(q===u)return; 
                  xnEvt.tsK(u,1); 
                  z.close();
                  i=z.getRwDh(p,q); 
                  o.dhk=1; 
                  a.s=0;
                  mt.mbKg(0); 
                  y=i[2][0].t; 
                  c.txt=(y<2?(y===1?i[5]:'我'):'???')+' --';        
                  h[1]=i[1];
                  t.d=i; 
                  t.f=1; 
                  x=1; 
             }else if(n===1){ 
                  
                   i=t.d; 
                  if(t.f===1){
                     t.f=0;
                     i[0]=i[0][p]; 
                     i[1]=i[2][p];
                     i[2]=i[3][p];    
                     
                     p=0; 
                  };
                  j=i[1];     
                  m=j.m;   
                  k=-1;
                  if(m!==u)k=m[p]; 
                  if(k!==-1&&k!==u){ 
                      z.rwJlCz(k,i);
                      o.dhk=0;
                      a.s=1; 
                      xt.switch(a);
                      mt.mbKg(1); 
                      qdG.push([3,0]);
                  }else{
                      j=j.z[p];
                      h[1]=j.s; 
                      y=j.t; 
                      c.txt=(y<2?(y===1?i[5]:'我'):'???')+' --'; 
                      i[1]=j; 
                      x=1;
                  };       
             }else if(n===2){
                    if(o.dhk===0)return; 
                    o.dhk=0;
                    a.s=1; 
                    xt.switch(a);
                    mt.mbKg(1); 
                    return;
             };
            if(x===1)xt.switch(a); 
    },
});

var tsF=0, 
    tsJ=0; 

xnEvt.addEvent({
    n:2,
    arr:['tsk0','tsk1','tskw0','tskw1','gnCd'],
    key:'tsK',
    fun:function(s,f){
        var mt=this,xt=mt.xt,t=mt.tsK,a=t.tsk0,b=t.tsk1,c=t.tskw0,d=t.tskw1,e=t.gnCd,g=gCfg,o=g.opt ,g,h,i,j,k,l,m,n,u;
            
            
            
            
           
             if(t.f===u) t.f=1,t.a=[]; 
             if(s!==u){
                 if(t.a.indexOf(s)>-1)return; 
                  t.a.push(s); 
                  if(tsF===0){
                      t.y=1; 
                      tsF=1;  
                  };   
             }else{
                 if(o.bag===1||o.dhk===1)return; 
                  i=t.a.length;
                  if(f===u&&i>0){
                       if(t.y===1){ 
                           t.y=0;
                           gYx.ypTj([[3,1,0]]); 
                       };
                        e.s=1,a.s=0,c.txt=t.a[0];   
                        xt.switch(e);
                        xt.switch(a);
                        t.a.splice(0,1); 
                        
                  }else{
                        if(i===0)tsF=0; 
                        e.s=0,a.s=1;
                        xt.switch(a);
                       if(f!==1)xt.switch(e);
                  };
             };
          
    }
});


xnEvt.addEvent({
    n:2,
    arr:['jlGg','fxYx'],
    key:'lxtc',
    fun:function(n){
        var mt=this,xt=mt.xt,t=mt.lxtc,a,b,c,d,e,f,g=gTsk,i,l,x=xnEvt,u;
          
            a=window.h5api;
            if(!a){
                x.tsK('不可用....')
                return;
            };
            if(n===0){//广告
                 x.tsK('不可用....');
            }else if(n===1){//分享
                c=0;
                if(a.isLogin)c=a.isLogin();
                if(c){//已登录
                    a.share(); //调用分享
                }else{//提示登录 (调出登录窗口)
                    x.tsK('未登录无法分享....');
                }
            };             
    }
});


var ccCfg={
        0:1, 
};
var ccIntF=1;

xnEvt.addEvent({
      n:2,
      arr:['gnCd','arrow','btn','eitPy'],
      key:'mbKg',
      fun:function(n,m){ 
          var mt=this,xt=mt.xt,t=mt.mbKg ,a=t.gnCd,b=t.arrow,c=t.btn,e=t.eitPy,d,i=0, l=3,o,s, u;
              if(ccIntF===1){ 
                  ccIntF=0;
                  return;
              };   
              if(m!==u)t.sf=ccCfg[m];  
              if(t.sf===1){ 
                   l=4;
                   if(n===u){ 
                        e.s=0;
                        xt.switch(e); 
                   };
              }else{
                    if(n===u){ 
                        e.s=1;
                        xt.switch(e); 
                    };
              };
              if(n===u)return; 
              if(n!==1){
                  if(tsF===1){ 
                      tsF=2;   
                      xnEvt.tsK(u,1); 
                  };
              }else{
                  if(tsF===2)tsF=1;
              };
              d=[a,b,c,e];
              while(i<l){
                 o=d[i];
                 s=o.s;
                 if(n===0){
                    if(s!==1){
                       o.s=1;
                       xt.switch(o); 
                    };
                 }else if(n===1){
                    if(s!==0){
                       o.s=0;
                       xt.switch(o); 
                    };
                 }else if(n===2){
                    if(i!==2&&s!==1){
                       o.s=1;
                       xt.switch(o); 
                    };
                 };
                 i++;
              };
               
      }
});



xnDom.addEvent({ 
    
     1:{
        
        $txt:function(n){
            if(n===0){
            var a,g,i,o,x,d; 
                i=this.$i,g=gCfg,x=xnDom,a=x.domMap[1].bbSm;
                  
                   d=x.domMap[1].sexS; 

                   
                    if(i===0&&g.sex!==-1){ 
                        zdyEvt.gameKs();
                    }else if(i===1){
                         d.s=1;
                         a.s=0;
                         x.drawAll();
                    }else if(i===2&&g.sex===-1){
                         a.s=1;  
                         d.s=0;  
                         x.drawAll();
                    }
            };
        },
        
        xbN:function(n){ 
            if(n===0){
                var g=gCfg;
                    g.sex=0;
                     zdyEvt.test(0); 
                    gSaveXg(1,1); 
                    zdyEvt.gameKs();
            }
        },
        
        xbV:function(n){
            if(n===0){
                var g=gCfg;
                    g.sex=1;
                    zdyEvt.test(1); 
                    gSaveXg(1,1); 
                    zdyEvt.gameKs();
            }
        },  
     },
     2:{ 
         
         touX:function(n){
            if(n===0){
                zdyEvt.ztKg(1);
                
            };
         },
         jlGg:function(n){ 
            if(n===0)xnEvt.lxtc(0); 
         },
         fxYx:function(n){
            if(n===0)xnEvt.lxtc(1); 
         },
         
         rocker:function(n,e,x,y){ 
            var t=this,u; 
            if(n===1){
               var s, xy, mx,my, nx=-1,ny=-1, w=t.w,h=t.h,ff,fx,fy;
                   if(t.mFlag===1){
                           t.mFlag=0;
                           t.xy=[x,y]; 
                   }else{ 
                           xy=t.xy;
                           mx=x-xy[0],my=y-xy[1];
                           if(mx>30){ 
                               nx=68 , w+=30;
                           }else if(mx<-30){
                               nx=65 , w-=30;
                           };
                           if(my>30){ 
                               ny=83 , h+=30;
                           }else if(my<-30){ 
                               ny=87 , h-=30;
                           };
                           ff=nx+ny;
                           if(t.ff!==ff){
                               t.ff=ff;
                               if(t.nx!==nx)keyUp(t.nx,e);
                               if(t.ny!==ny)keyUp(t.ny,e);
                               keyDown(nx,e);
                               keyDown(ny,e);
                               t.nx=nx , t.ny=ny;
                               s=t.$self;
                               s.l=w,s.t=h;
                               t.$update();
                           };
                   }; 
                   
            }else if(n===0){
               var s=t.$self;
                t.mFlag=1;t.ff=-2;t.nx=-1;t.ny=-1;
                t.w=s.l,t.h=s.t;   
            }else{ 
                   keyNow[0]=-1 , keyNow[1]=-1 , keyk=-1;
                   var s=t.$self;
                       s.l=t.w,s.t=t.h;
                       t.$update();

            };
            if(e!==u)e.preventDefault(); 
         },
         
            
         z0:function(n){
             if(n===0) zdyEvt.zbXz(this,0,1);
         },
         z1:function(n){
             if(n===0) zdyEvt.zbXz(this,1,1);
         },
         z2:function(n){
             if(n===0) zdyEvt.zbXz(this,2,1);
         },
         z3:function(n){
             if(n===0) zdyEvt.zbXz(this,3,1);
         },
         z4:function(n){
             if(n===0) zdyEvt.zbXz(this,4,1);
         },
         z5:function(n){
             if(n===0) zdyEvt.zbXz(this,5,1);
         },
         z6:function(n){
             if(n===0) zdyEvt.zbXz(this,6,1);
         },
         z7:function(n){
             if(n===0) zdyEvt.zbXz(this,7,1);
         },
         
         
         
         closeE:function(n){
             if(n===0){
                 xnEvt.editXg(5);
                
             };
         },
         pre:function(n){ 
            var t=this;
                if(n===0){
                    xnEvt.wpInfo(2,0,0);
                   
               };     
         },
         next:function(n){ 
            var t=this;
                if(n===0){
                    xnEvt.wpInfo(2,0,1);
                   
               };    
         },
         
         $bags:function(n){
             if(n===0){
                var t=this,i=t.$i,g,e,b;
                    g=gCfg.opt;
                    if(g.wpjh===0){
                        xnEvt.bagXzTjZh(0,i);
                    }else{
                        xnEvt.bagXzTjZh(1,i);
                    };
                    
                    
            };   
         },
         closeB:function(n){
             if(n===0){
                var v=gCfg.opt.zt,u;
                    if(v>1){ 
                       xnEvt.bagKg();
                    }else{
                        zdyEvt.ztKg(); 
                    };
                
                
            };
         },
         
         $bmap:function(n){
             if(n===0){
                var t=this,i=t.$i,a=t.$self.arr[1],g,o,b,c;
                     
                    
                    g=gCfg,o=g.opt,b=g.bag; 
                    if(a[i]!==0&&o.wpjh!==1){ 
                        zdyEvt.zbXz(this,i,0);   
                    }else{
                        if(o.wpjh===1){
                          
                               c=b[o.bagn];
                               zdyEvt.wpJhTb(c,i,o.szbn);
                            
                        };
                    };   
             };   
         },
         
         btn0:function(n,e){
            
                if(n===0){
                    zdyEvt.btn(0,e);
                
                };
         },
         btn1:function(n,e){
                if(n===0){
                    zdyEvt.btn(1,e);
                
                };
         },
         btn2:function(n,e){
                if(n===0){
                    zdyEvt.btn(2,e);
                
                };
         },
         btn3:function(n,e){
            
                if(n===0){
                    zdyEvt.btn(3,e);
                   
               };
         },
         btn4:function(n,e){
            
                if(n===0){
                    zdyEvt.btn(4,e);
                
                };
         },
         btn5:function(n,e){
                if(n===0){
                    zdyEvt.btn(5,e);
                
                };
         },
         
         
         ePre:function(n){
            if(n===0){
                xnEvt.editXg(2,0);
               
           };
         },
         
         eNext:function(n){
            if(n===0){
                xnEvt.editXg(2,1);
               
           }; 
         },
         
         preF:function(n){
            if(n===0){
               
              xnEvt.editXg(3,1);
            };
         },
         
         nextF:function(n){
            if(n===0){
               
              xnEvt.editXg(3);
            };
         }, 
         
         $mapE:function(n){
            if(n===0){
                var t=this,i=t.$i,arr=t.$self.arr,th=t.$this,dom=th.domMap[2].editor;
                    arr[3]=i;
                    xnEvt.editXz(0);
                    th.reLocal(dom);
                   
           };
         },
         
         $jzE:function(n){
            if(n===0){
               var t=this,i=t.$i,arr=t.$self.arr,th=t.$this,dom=th.domMap[2].editor;
                    arr[3]=i;
                    xnEvt.editXz(1);
                    th.reLocal(dom);
                    
                  
           };
         },
         
         eitBtn:function(n){
              if(n===0){
                 xnEvt.tsK(gTsk[37]);
                  return; 
                  var o=gCfg.opt,v=o.gn,a=o.zzKg,b=o.rrp,u;
                        if(b)return;
                       
                       if(a!==1&&v!==3){ 
                          zdyEvt.ztKg();
                       };
                        u=v===3?u:3; 
                        zdyEvt.ztKg(u);
                      
              };            
         },
         
         save:function(n){
            if(n===0){
                qdG.push([5,3]);
                
            };
         },
         
         
         $shTm:function(n){
              if(n===0){
                   var t=this,i=t.$i;
                       xnEvt.shZz(1,i);
                       
             }
         },
         
         shFy0:function(n){
              if(n===0){
                 xnEvt.shZz(5);
                   
             } 
         },
         
         shFy1:function(n){
              if(n===0){
                   xnEvt.shZz(2,0)
                   
             } 
         },
         
         shFy2:function(n){
              if(n===0){
                   xnEvt.shZz(2,1)
                   
             } 
         },
         
         shSm1:function(n){
              if(n===0){
                   xnEvt.shZz(3);
                   
             } 
         },
         
         zyBtn:function(n){
            if(n===0){
               var g=gCfg.opt, v=g.gn,k=g.zzKg,b=g.rrp; 
                  if(b)return;
                   if(v===4&&k!==1){ 
                       zdyEvt.ztKg();
                       zdyEvt.ztKg(2);
                   }else if(v===2){
                       zdyEvt.ztKg();
                   }else{
                       zdyEvt.ztKg(2);
                   }; 
                
            }; 
         },
         
         shBtn:function(n){
            if(n===0){
                 var g=gCfg.opt, v=g.gn,b=g.rrp;   
                     if(b)return;
                    
                      if(v===4){ 
                          xnEvt.shZz();
                      }else if(v===2){
                          zdyEvt.ztKg();
                          zdyEvt.ztKg(4);
                      }else{
                          zdyEvt.ztKg(4);
                      };
                    
            } 
         },
         
         mrBtn:function(n){
            if(n===0){
                 var g=gCfg.opt, v=g.gn,b=g.rrp;   
                     if(b)return;
                      if(v===4){ 
                          xnEvt.shZz();
                      }else if(v===2){
                          zdyEvt.ztKg();
                      };
            } 
         },
         
         
         rrp10:function(n){
            if(n===0){
                    xnEvt.rjpGn(); 
             }; 
         },
         
         $rrpLb:function(n){
            if(n===0){
                var t=this,i=t.$i;
                    xnEvt.rjpGn(4,i); 
             }; 
         },
         
         $py1:function(n){
            if(n===0){
                var t=this,i=t.$i;
                    xnEvt.rjpGn(4,i); 
             }; 
         },
         
         $jy1:function(n){
            if(n===0){
                var t=this,i=t.$i;
                    xnEvt.rjpGn(4,i); 
             }; 
         },
         
         
          
       
         
         rrp11:function(n){
            if(n===0){
               xnEvt.rjpGn(5,0);
            } 
         },
         
         rrp12:function(n){
            if(n===0){
               xnEvt.rjpGn(5,1); 
            } 
         },
         
         rrp13:function(n){
            if(n===0){
               xnEvt.rjpGn(3,0); 
            } 
         },
         
         rrp14:function(n){
            if(n===0){
               xnEvt.rjpGn(3,1); 
            } 
         },  
         
         
        
        
        
        
        
        
         
         $dhLb:function(n){
            if(n===0){
                var t=this,i=t.$i;
                    xnEvt.dhK(1,i);
                    
             }
         },
     },
});



var zdyEvt={
    
    
    
    
    
     
    test:function(n){ 
       var a,b,c,d,s,e,i=0,l,o=gCfg.bag[0];
           a=[[[251,254,1], [255,259,1],[450,452,2],[651,653,3],[654,656,3]], [[321,325,1],[326,331,1],[520,522,2],[721,723,3],[724,726,3]]];
           a=a[n];
           l=a.length;
           while(i<l){
             b=a[i];
             s=b[0],e=b[1]+1,d=b[2];
             while(s<e){
                 c={t:0,s:n,id:s,b:d,a:[1,1,1,1,1,1,1,1,1]};
                 o.push(c);
                 s++;
             }; 
            i++;
           };
    },
    
    ycXx:function(f){ 
        var x=xnDom,a=x.domMap[1].txt.yb.arr[1];
            if(f===1){
              a[0]='未存档';
            }else{
              a.splice(2,1);
            };
            x.drawAll();
    },
    
    gameKs:function(){
       var x=xnDom, c=clothes;
            if(c.wj===0){
                c.wj=2; 
                return;
            };  
           x.showN=2;
           x.drawAll();
           TOOL.play=1;
           mapBrushWorkerPost([0,2]);
        
        
    },
     
     getRjy:function(n,m,p){ 
        var t=this,a,b,c,d,e,f,g,h,i; 
            if(n===0){
               return t.rwNr(m,p); 
            }else if(n===1){

            }else if(n===2){
              return t.yxXj(m); 
            }else if(n===3){

            };
    },
    
    yxXj:function(m){ 
        var  a=gNpcJb,b=gCfg.yx,c,d,s,e,g,j,k,u;
             
             s=m*11,e=(m+1)*11;
             d=b.slice(s,e); 
             e=d.length;
             if(e>0){
                s=0,g=[[],[],[]];  
                while(s<e){
                  c=d[s]; 
                  j=a[c[0]];
                  if(j!==u){
                      g[0].push(j.a); 
                  }else{
                      g[0].push('?????');
                  };
                  g[1].push('   新邮件');
                  g[2].push(c[1]); 
                   s++;
                };
                return g;
             }else{
                 return u;   
             };
      },
      
    rwNr:function(m,p){
        var a=gJqNr,s,e,b,c,d,o,i,k,u;
         if(m===0){
              b=a.a; 
              s=p*13,e=(p+1)*13;
              return b.slice(s,e);
         }else{ 
              b=a[p]; 
              if(b===u)return; 
              s=gCfg.task.jq[p]; 
              e=s[1],s=0,c=0,d=[''];    
              i=0,k=b.length; 
              while(i<k){
                  o=b[i]; 
                  if(o===0){
                       s++;
                  }else if(o===1){
                      d[c]+='||▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼'; 
                      c++; 
                      d[c]=''; 
                  }else{ 
                      d[c]+=o;
                      s++;
                  };
                  if(s>=e)break; 
                  i++; 
              };
              return d;  
         };
    },
   
    rwJlCz:function(k,o){ 
        var r=gCfg.task,a,b,c,d,e,f,u;
              
              
           a=k[0],b=o[0];
           
           if(a===0){
                if(b===1)f=1;
           }else if(a===1){
                
                if(b===1)f=1; 
                if(k[1]===0){

                }else{
                    qdG.push( [0,1,k[2]]);  
                };
           }else if(a===2){
                
                c=k[1];
                d=[c,k[2]]; 
                if(b===1)f=3;
                
                
               qdG.push([2,d]);
                
           }else if(a===3){ 
                
          };
        
           if(f===1||f===3)r[o[4]].push(o[2]); ;
           if(f===3)r.jq[c]=d; 
           if(k[3]!==u)gNpcF[k[3]]();
    },
    
    getDwSx:function(d){ 
       var a='|----';
           a+=' 体重 '+d[3]+' 斤 , '+d[5]+' 天 ';
           return a;
    }, 
     
    getRwDh:function(id,d){
        var t=this,r=gCfg.task,a,b,c,e,f,g,i,l,m,n=0,i2,l2,c2,a2,b2,f2,o,p,u,v,x=[[],[],[],[]];
                
                
                
            a=r[id];
            if(a===u){ 
                r[id]=[],a=r[id];
            };   
            
            x[4]=id;
            x[5]=d.a; 
            i=0,b=d.b,l=b.length,f=-1; 
            while(i<l){  
                c=b[i];
                e=c[0],g=c[1]; 
                m=a.indexOf(i)
                if(m>-1){
                    i++;
                    continue; 
                };
                if(g!==u){
                    if(n<3){
                        i2=0,l2=g.length,f2=1;
                        while(i2<l2){
                            c2=g[i2]; 
                            a2=c2[0],b2=c2[1];
                            o=r[a2===-1?id:a2];
                            if(o!==u){
                                if(o.indexOf(b2)===-1){
                                    f2=0;
                                    break;
                                };    
                            }else{
                                f2=0
                                break; 
                            };
                            i2++;   
                        };
                        if(f2===1){
                            n++; 
                            x[0].push(e); 
                            x[1].push('▶ '+d.c[i].s);
                            x[2].push(d.c[i]);
                            x[3].push(i);
                            if(n===3)return x;
                        };
                    };
                }else{
                    if(e===0){
                            if(f>-1){ 
                                a.push(f);
                                f=i;
                            }else{
                                f=i;
                            };
                    }else{
                        if(n<3){
                            n++;  
                            x[0].push(e); 
                            x[1].push('▶ '+d.c[i].s);
                            x[2].push(d.c[i]);
                            x[3].push(i);
                            if(n===3)return x;
                        };  
                    };
                };       
                i++;
            };
            if(f>-1){
                x[0].push(b[f][0]); 
                x[1].push('▶ '+d.c[f].s);
                x[2].push(d.c[f]);
                x[3].push(f);
            };
            return x;
     },
    
    getWpSm:function(t,i,f,s){
       var w=gCfg.wpCfg,g=gTxt,a='',b,c,d,e=0,h,j,l=11,u; 
           w=w[t][0];
                     
           
            if(f===1&&w>19){
                w-=20;
                
                
                imgLoad.get(8404,10,1);
                return [8404,10];   
            };
            if(t){
                b=g[w][i];  
            }else{
                b=g[w][s][i]; 
            };
            if(f===1){
                imgLoad.get(b[1],b[2],1)
                return [b[1],b[2]];
            }; 
            
        
         
          
           if(w===0){ 
              
                if(f===u)f=[]; 
                d=['气血','魔法','力量','智力','敏捷','运气','物防','魔防','暴击','闪避','伤害'];
                while(e<l){
                    h=f[e];
                    if(h>0){
                         a+=d[e]+h+'、 ';
                    };
                    e++;
                };
                  
                a=b[3]+'|-----'+(b[4]||'')+'|属性 => '+a;
              return [a];
         
           }else{
              c=b[4];
              j=f===2?' - 图纸':''; 
              if(c instanceof Array){ 
                  c=c.slice(0); 
                  c[0]=b[3]+j+'|---'+c[0];     
              }else{
                 
                  c=[b[3]+j+'|---'+(b[4]||'')]; 
              };
              d=b[5];
              if(d&&f!==2){
                  
                    b='恢复 : HP +'+d[1]+' 、 MP +'+d[2];
                     b=(d[0]?'|每'+d[0]+'秒':'|')+b;
                     c[c.length-1]+=b;
              };
              return c;
           };
    },
    
    zZXh:function(d){
        var a=d[0],b=d[1],c=d[2],e=d[3], f=c.length,l=f,g;
     
            while(l--){
                 g=b[l]-c[l];
                 if(g<0)return 0; 
                 b[l]=g;
            };
           l=f;
           while(l--){
               a[l][0]=b[l]; 
               g=e[l];
               this.hqScZzCl(g[0],g[1],1,c[l]) 
           };
           
           return 1;
    },
   
    getZzClSm:function(a,b,c,d){
       var g,h,i,j,k,l='',m;
             
             
             if(b[1]<d[1])b[1]=d[1];
             h=c[b[0]]; 
             
          
             i=this.getClTxt(h[1]); 
             
             a[1]=i[0];
             m=h[2];
             g=h[3];
             l+='|'+'-----'+(h[4]||'')+'|需 : '+i[4]+'效果 : 每'+m[3]+'秒恢复: '+m[1]+'hp , '+m[2]+'mp';
             i[4]=g;
             i[5]=l;
             i[6]=h[2];
             i[7]=h[5];
           return i;
    },
    
    getClTxt:function(d){
        var g=gTxt,i=0,l=d.length,c,a='',v,b,e,h,j=[],k=[],m=[],n=[];
            while(i<l){
               c=d[i];
               v=c[0];
               b=c[1];
               e=g[v][b];
               v=e[0];
               h=this.hqScZzCl(v,b,0);
               a+=e[3]+'x'+c[2]+'、 '; 
               j[i]=[h,[e[1],e[2],18,18,2,0]]; 
               k[i]=h; 
               m[i]=c[2];
               n[i]=[v,b];
               i++;
            };
            return [j,k,m,n,a];
    },
    
    hqScZzCl:function(t,id,f,m){
         var th=this,b=gCfg.bag,n=b.n,a,c,i,l,d,e;
             d=f?m:0; 
             while(n--){
                 a=b[n],i=0,l=a.length; 
                 while(i<l){
                     c=a[i];
                     if(c&&c.t===t&&c.id===id){
                           e=c.n;
                           if(!e)e=1;
                          if(f){ 
                             
                              d=d-e;  
                              if(d<0){
                                  c.n=-d; 
                                  th.bbGX();
                                  return; 
                              }else if(d===0){ 
                                   a[i]=0;
                                   th.bbGX();
                                   return;
                              }else{
                                  a[i]=0; 
                              };
                          }else{
                              d+=e;
                          };
                     };
                     i++;
                 }
             };
             if(f)th.bbGX();
             return d; 
    },
    
    getZzLb:function(d,o){
        var i=0,l=d.length,a,c=[];
             while(i<l){
                 a=d[i][0]; 
                 c[i]=o[a][3];
               i++;
             };
             return c;
    },
    
    kjWpCx:function(t,id){
        var b=gCfg.bag,n=b.n,a,c,i,l;
            while(n--){
                a=b[n],i=0,l=a.length;
                while(i<l){
                    c=a[i];
                    if(c&&c.t===t&&c.id===id){
                       return [n,i ];   
                    };
                    i++;
                }
            };
            return 0;
    },
    
    sdKg:function(n){
        var x=xnEvt;
        if(n===1){
            x.bagKg();
            x.gnQh(0);
        }else if(n===2){

        }else if(n===3){
            x.eitBtn();
        }else if(n===4){

        };
    },
    
    ztKg:function(n){
       var t=this,o=gCfg.opt,z=o.zt,x=xnEvt,u;
             
             if(o.dhk===1||o.tsk===1||o.rrp==1)return; 
             
             
             if(n===u){
                     if(z>1){
                         t.sdKg(z);
                         z=-1;
                         o.zt=z;
                         n=o.bag?1:0; 
                     }else{ 
                         n=o.bag?1:0;
                         if(n===1){
                             t.sdKg(n);
                             return;
                         }; 
                     };
             }else if(z<0&&n>1){ 
                  o.zt=n;
             }else if(n===z||n===1&&o.zzKg||z>1&&n!==1){ 
                 return;
             };

             if(n===0){
                  if(z<2){ 
                      x.gnQh(0);    
                  }; 
             }else if(n===1){
                  if(z<2){ 
                      x.bagKg(1);
                      x.gnQh(1); 
                  }else{
                      x.bagKg(1);
                  };
             }else if(n===2){
                    x.gnQh(2);
             }else if(n===3){
                    x.eitBtn(1); 
             }else if(n===4){
                  if(o.bag)x.bagKg();
                    x.gnQh(4);
             }; 
    },
    
    jzCl:function(d,a,n){ 
        var i=0,l,u;
            if(d===u)return 0;
            if(n!==u){
                n==-1?a.pop():a.push(n);
            };
            l=a.length;
            while(i<l){
                d=d[a[i]];
                i++;
            };
            if(d===u){
                a.pop();
                return 0;
            }else{
               return d.a;    
            };       
    },
    
    editFy:function(d){
        var i,l,c,b,a;
           
            c=[],a=0;
            i=4*d[4],l=i+4;
            b=d[0]; 
            if(i>-1&&i<b.length){             
              while(i<l){
                 c[a]=b[i];
                 a++,i++;
              };
              d[2]=c;
            }else{
                if(d[4]>0)d[4]--;
                if(d[4]<0)d[4]=0;
            };
            
            c=[],a=0;
            i=8*d[5],l=i+8;
            b=d[1]; 
            if(i>-1&&i<b.length){             
              while(i<l){
                 c[a]=b[i];
                 a++,i++;
              };
              d[3]=c;
            }else{
                if(d[5]>0)d[5]--;
                if(d[5]<0)d[5]=0;
            };
    },
    
    zbXz:function(t,n,z){
          
          
          
      var s=t.$self,p,pp,th=t.$this,a=gCfg,g=a.opt,szb=g.szb,szbt=g.szbt,b=a.bag,zb=a.zb,w;
           if(z===1){ 
              if(t.$self.bimg===undefined)return; 
           };
          p=z?t.$self.$p:t.$pSelf.$p;
         
          if(szb){
             if(szbt===1){
                 
                 szb.$self.border=undefined;
                 pp=szb.$self.$p;
             }else{
                 szb.$self.arr[3]=-1;
                 pp=szb.$pSelf.$p;
             };
              if(szbt!==z){
                  th.reLocal(pp);
              };  
          }; 
          if(z===1){
             s.border=[1,'yelow']; 
          }else{
             s.arr[3]=n; 
          };
          g.szb=t;
          g.szbn=n;
          g.szbt=z;
          th.reLocal(p);
         
           if(z){
              w=zb[n];
           }else{
              w=b[g.bagn][n];
              a.wpXz=[g.bagn,n];
           };
          xnEvt.wpInfo(1,w);
         
    },
    
    bBXzQc:function(){ 
           var g=gCfg.opt,szb=g.szb;
               if(g.szb){
                  if(g.szbt===1){
                     szb.$self.border=undefined;
                  }else{
                     szb.$self.arr[3]=-1;
                  };  
               };
               g.szb=0; 
               g.szbn=-1;
               g.szbt=-1;
               g.wpjh=0;
               xnEvt.wpInfo();
    },
    
    close:function(){
      var  t=this,g=gCfg.opt;
            if(g.szbt===1){
                g.szb.$self.border=undefined;
            };
            
            if(g.zt>1)t.ztKg();
            if(g.bag)xnEvt.bagKg();
            if(g.zzKg===1)xnEvt.shZz();
            if(g.rrp===1)xnEvt.rjpGn(); 
            t.bBXzQc();
            
            
   },
   
   kBXzQc:function(f){ 
       
     var  g=gCfg.opt,s=g.szbt,b=g.szb,p,t;
     
         if(s>-1){
             t=b.$this;
             if(s===0){ 
                 b.$self.arr[3]=-1;
                 if(f===1){
                     p=b.$pSelf.$p;
                     t.reLocal(p);
                 };   
             }else{
                 b.$self.border=undefined;
                 if(f!==2){
                   p=b.$self.$p; 
                   t.reLocal(p); 
                 };
             };
                 g.szb=0; 
                 g.szbn=-1;
                 g.szbt=-1;
         };  
         xnEvt.wpInfo(3);
         g.wpjh=0;
   },
   allClose:function(){
       
   },
   
   zbUpdate:function(n,d){
      var g=gCfg,z=g.zb,f,o=z[n],f=0,u;
          
          if(o){ 
             if(n>5){ 
                 if(!z[6]){
                     z[6]=d,f=1;
                 }else if(!z[7]){
                     z[7]=d,f=1;
                 }else{
                     z[7]=d; 
                 };
             }else{ 
                 z[n]=d;   
             };
          }else{
             z[n]=d,f=1;    
          };
         return [f,o]; 
   },
   
   jsData:function(cs){ 
       var g=gCfg,b=g.zb, d=g.zbData,s=g.zbSx,m,i,l,v,a,x,z,j,u,w;
           
           
           
           
          
          
           x=[ [0.7,1.4],[0.6,1.6],[0.6,1.8], [0.5,2] ]; 
           a=b[0];
        
           if(a){ 
              z=a.z; 
              w=a.a[10];
              x=x[z]; 
              v=[];
              s[1]=v;
              v[0]=z;   
              v[1]=a.id;
              j=a.j;    
              if(j){
                 i=2,l=2+j.length;
                 while(i<l){
                    v[i]=j[i-2];  
                    i++;     
                 };  
              };
           }else{
               delete s[1]; 
           };
        
           
      
           g.zbMb=d.slice(0); 
           m=g.zbMb;
           
           s=s[0];
           s[1]=d[8];
           s[2]=d[9];
           s[3]=d[6];
           s[4]=d[7];
           
         if(z!==u){
            
             if(z<3){
                 
                 u=d[4]/w+x[0]; 
                 if(u>x[1])u=x[1]; 
                 w+=d[2]*3;     
                 m[10]=((w*u)<<0)+'~'+((w*x[1])<<0);
             }else{
                 u=d[5]/w+x[0]; 
                 if(u>x[1])u=x[1];
                 w+=d[3]*3;
                 m[10]=((w*u)<<0)+'~'+((w*x[1])<<0);
             };
             s[0]=[(w*u)<<0,(w*x[1])<<0]; 
         }else{
              m[10]=0;     
         };
         xnEvt.mbSzGx(m);
         xnEvt.zbXM(cs); 
         
   },
   
   zbZc:function(){
     var g=gCfg,o=g.opt,s=o.szbt,n=o.szbn,b=g.bag, zb=g.zb,z,v;
          
          if(s===1){
               z=zb[n]; 
               if(z){
                 v=this.bagTj(z); 
                 if(v!==0){ 
                     delete zb[n] ; 
                     b[v[0]][v[1]]=z; 
                     xnEvt.zbDataGx(n);
                    
                     xnEvt.bagList(v[0]);
                 };
               };
             
          };
   },
   
   tjWp:function(v,b,n,bs){ 
      var a=gCfg,g=a.opt,w=a.wpCfg, z,o,u,t,f=1,m,v2;
      
       if(v!==0){
           z=b[n];
         
           if(v[2]===1){
                bs[v[0]][v[1]]=z;       
           }else{ 
               o=bs[v[0]][v[1]];
               t=o.t;
               m=o.n+z.n; 
               w=w[t][1];
               if(m<w+1){
                   o.n=m; 
               }else{
                     o.n=w;
                     z.n=m-w;
                     v2=this.bagTj(z,v[0]);
                     if(v2!==0){
                           this.tjWp(v2, b,n,bs ); 
                     }else{ 
                         f=0; 
                     };
               };
           };
           if(f)b[n]=0;
           xnEvt.bagList(g.bagn);
       };
   },
   
   wpTj:function(o){
      var t=this,b=gCfg.bag,w=gCfg.wpCfg,a,c,d,e,f,h;
         
          a=t.bagTj(o,0);
          if(a){
              b=b[a[0]];
              if(a[2]){ 
                   b[a[1]]=o;
              }else{ 
                   b=b[a[1]];
                   w=w[o.t][1];
                   c=o.n+b.n;
                   if(c<=w){ 
                       o.n=0;
                       b.n=c; 
                   }else{
                         o.n-=w-b.n; 
                         b.n=w;   

                         console.error('此处 增加判断 超量堆叠物品, 比如多倍量, 分成多组添加, 当返回1时, 计算剩余量 返回, 统一后端抛掷地面,');
                        
                          h=o.n; 
                          d=h/w; 
                          if(d>1){
                              c=d<<0;
                              if(d>c)d=c+1;
                          };
                          if(d<=1){ 
                             t.wpTj(o); 
                          }else{
                             c=o.n%w; 
                             if(c===0)c=w;
                             while(d--){
                                 e={t:o.t,id:o.id,n:d!==0?w:c};  
                                
                                
                                 f=t.wpTj(e);
                                 if(f>0){
                                     t.bbGX();
                                     return w*d+f; 
                                 }; 
                             }; 
                          };
                   };
                
              };
              t.bbGX();
          }else{
                
              return o.n||1;
          };
   },
   
   bagTj:function(z,n){ 
       var t=this,g=gCfg,o=g.opt,b=g.bag,v,i=0,l=b.n,u;
           n=n!==u?n:o.bagn;
           v=t.bagTj2(z,n);
         
           if(v!==0){
               return v; 
           }else if(l>1){ 
               while(i<l){
                  if(i!==n){ 
                     v=t.bagTj2(z,i);
                     if(v!==0){
                         return v;
                     };     
                  };
                 i++;
               };
               xnEvt.tsK(gTsk[41]); 
               return 0; 
           };

         
   },
   
   bagTj2:function(z,n){
        var g=gCfg,b=g.bag,w=g.wpCfg,a=b[n],t=z.t,id=z.id,i=0,d,c=-1,v; 
         
            while(i<30){
                 d=a[i];
                 if(t<20){
                    if(!d)return [n,i,1]; 
                 }else{
                    if(!d&&c<0)c=i; 
                    if(d&&d.t===t&&d.id===id){ 
                         v=w[t][1];
                         if(d.n<v)return [n,i];
                    };
                 };
               i++; 
            };
            if(c>-1)return[n,c,1];
            return 0; 
   },
   
   wpJhTb:function(a,b,c){ 
       var v1=a[b],v2=a[c],g=gCfg, o=g.opt,w=g.wpCfg,f=0,v,z,u;
          if(v1&&v2&&v1.t===v2.t&&v1.id==v2.id){ 
              v=w[v1.t][1];
              if(v2.n===v){
                   f=1;
               }else{
                 
                     z=v2.n+v1.n;
                     if(z<=v){
                        v1.n=z;
                        a[c]=0; 
                     }else{
                       v1.n=v;
                       v2.n=z-v;
                     };   
               };
           }else{ 
             f=1;
           };
           if(f===1){
                 a[b]=v2,a[c]=v1;
           };
           xnEvt.bagList(o.bagn); 
   },              
   
   jsgx:function(){
     var g=gCfg,a=g.opt.jsgx,o=g.zb,i=0,l=6,b,c,d=[];  
         if(a===1){
              
             while(i<l){
                  c=o[i];
                  if(c){
                      d.push(c.id); 
                  }else{
                      d.push(-1);
                  };
                  i++;
              };
              g.zbXx=d; 
            
            
              wjGx(1);
         }else if(a===2){
              
             wjGx();
         };
         g.opt.jsgx=0;
   },
   
    bbGX:function(){
       var g=gCfg.opt,u;
        
           xnEvt.bagList(g.bagn,1);
    },
   
   btn:function(n,e){
     var t=this,g=gCfg,o=g.opt,j=o.jnQh,w=g.wpCfg,b=g.bag,x=xnEvt,p=o.zt,v,ts=gTsk,u,s=1,d=-1,a,c,f,h,i;
         
         
         
         
         
          if(p<2){
             p=o.gn;
          };
          v=1-j[p];
         

         
         
         if(p===0&&v===0){ 
              if(o.szbt===0){
                 s=w[b[o.bagn][o.szbn].t][0];
                 if(s>0&&s<4){
                   s=0; 
                 }else{
                   s=1; 
                 };
              };
         };
         
        if(n===5){
            if(p===0){
               if(v){
                   if(g.zb[0]!==u){
                      keyAuto(0,e); 
                   }else{
                      x.tsK(ts[38]);
                   };
               }else{
                
                
                
                   if(o.bag===0){
                        keyAuto(5,e,d); 
                   };
               };
            }else if(p===1){
                 x.wpUse(5); 
            }else if(p===2){
                 if(v){ 
                    keyAuto(20,e);
                 }else{
                    keyAuto(25,e);
                 };
            }else if(p===3){
                 if(v){ 
                      
                }else{
                     
                    j[3]=0;        
                     x.gnQh(3); 
                     x.editXg(1);
                 };
            }else{
                 if(v){
                     
                    x.tsK(ts[37]);
                 }else{
                     x.shZz(0,0);
                 };
            };
         
        }else if(n===4){
             if(p===0){
                 if(v){
                    
                    x.tsK(ts[37]);
                 }else{
                    x.kjBtn(4,s?1:0); 
                 };
             }else if(p===1){
                 
                 if(o.szbt===0){
                     o.wpjh=1; 
                 };
             }else if(p===2){
                 if(v){
                     keyAuto(21,e); 
                 }else{
                     keyAuto(26,e); 
                 };
             }else if(p===3){
                 if(v){

                 }else{

                 };  
             }else{
                 if(v){
                     x.tsK(ts[37]);
                 }else{
                     x.shZz(0,3);
                 };
            };
        
        }else if(n===3){
             if(p===0){
                 if(v){
                    x.tsK(ts[37]);
                 }else{
                     x.kjBtn(3,s?1:0); 
                 };
             }else if(p===1){

             }else if(p===2){
                 if(v){
                    keyAuto(22,e);
                 }else{
                    keyAuto(27,e);
                 };
             }else if(p===3){

             }else{
                 if(v){
                    x.tsK(ts[37]);
                 }else{

                 };
            };
        
        }else if(n===2){
             if(p===0){
                 if(v){
                    x.tsK(ts[37]);
                 }else{
                     x.kjBtn(2,s?1:0); 
                 };
             }else if(p===1){
                   t.zbZc();
             }else if(p===2){
                  f=g.wpXz; 
                  a=b[f[0]][f[1]]; 
                    if(v){
                        if(a&&a.t===23){
                             keyAuto(23,e,[a.t,a.id]); 
                        }else{
                             x.tsK(ts[2]);
                        };
                    }else{
                        if(a&&a.t===5){
                             qdG.push([0,0,[a]]);
                             t.hqScZzCl(a.t,a.id,1,1); 
                             keyAuto(28,e);
                        }else{
                             x.tsK(ts[10]);
                        };
                    };
             }else if(p===3){
                 if(v){

                 }else{

                 };
             }else{
                 if(v){
                    x.tsK(ts[37]);
                 }else{

                 };
            };
        
        }else if(n===1){
             if(p===0){
                 
                 j[0]=j[0]?0:1;
                 x.gnQh(0);
             }else if(p===1){

             }else if(p===2){
                 j[2]=j[2]?0:1;
                 x.gnQh(2);
             }else if(p===3){
                 if(v){
                     x.editXg(4);
                 }else{

                 };
             }else{
                 
                 j[4]=j[4]?0:1;
                 x.gnQh(4);
            };
         
        }else{
             if(p===0){
                 if(v){ 
                     if(o.rrp===0){
                        x.rjpGn(0);
                     }else{
                        x.rjpGn(); 
                     };
                 }else{
                     x.bagKg(1); 
                 };
             }else if(p===1){
                  f=g.wpXz; 
                  a=b[f[0]][f[1]]; 
                  if(a){
                    if(w[a.t][2]===1){
                        t.hqScZzCl(a.t,a.id,1,1); 
                        
                   };  
                  };
             }else if(p===2){
                 if(v){
                    keyAuto(24,e);
                 }else{
                    keyAuto(29,e);
                 };
             }else if(p===3){
                 if(v){
                     j[3]=1;
                     x.editXg(); 
                     x.gnQh(3); 
                 }else{

                 };
             }else{
                 if(v){

                 }else{
                     x.shZz(0,4);
                 };
            };
        };
   },
};


//xnEvt.bagList( n) 更新指定背包wp