
var DomVm=function(o){
     var t=this;
         t.img=allIdObj;
         t.w=o.width;  
         t.h=o.height; 
         t.el=o.el;    
         t.dom=o.dom;
         t.domMap={}; 
         t.idMap=[];  
         t.sz=[];     
         t.event={};  
         t.layerInit(o.layer);
         t.showN=o.showN;
         t.nowO;       
         t.clickObj(); 
         t.getAllDom(); 
};

DomVm.prototype.layerInit=function(o){
    var t=this , l=o.length ,d;
        t.layL=l;   
        t.layer=[]; 
        
        
        while(l--){
            t.idMap[l]={
                       $_key:[]  
            };
            d=o[l];
            t.layer[l]=d;
            t.fzXYWh(d,[0,0,t.w,t.h],0);
        };
        
};


DomVm.prototype.fzXYWh=function(d,p,parent){ 
   var t=this,tp,x,y,w,h ,cw,ch;
         
         w=d.w,h=d.h; 
       
        
           cw=p[2]-p[0],ch=p[3]-p[1];
           if(d.xm){ 
              x=((cw-w)/2)<<0;
           }else{
                if(d.l!==undefined){
                    x=d.l;
                }else if(d.r!==undefined){ 
                    x=cw-w-d.r;
                }else{
                    x=0;  
                };
           };
           if(d.ym){ 
               y=((ch-h)/2)<<0;   
           }else{
                if(d.t!==undefined){
                    y=d.t; 
                }else if(d.b!==undefined){
                    y=ch-h-d.b;
                }else{
                    y=0;
                };
           };
           x+=p[0];
           y+=p[1];
           tp=[x,y,x+w,y+h];
           d.xy=tp;
           d.$p=parent;  
           ch=d.$c;
           if(ch){
               cw=ch.$list;
               w=cw.length;
               while(w--){ 
                  t.fzXYWh(ch[cw[w]],tp,d);
               }; 
           };
};

DomVm.prototype.reLayout=function(o){
    var t=this,n=t.showN ,d=t.layer[n],e=0;
       if(o!==undefined)e=o.$p;   
       if(e===0){
            t.fzXYWh(d,[0,0,t.w,t.h],0);
       }else{
            t.fzXYWh(o,e.xy,e);
       };
};

DomVm.prototype.admit=function(o,n,f){ 
    
    var t=this,c=o.$c,i=0,l,a,k,v,u;
        if(c!==u){
             a=c.$list,l=a.length;
             while(i<l){
                k=a[i];
                if(f!==u&&(f.indexOf(k)>-1)){
                     i++;
                     continue;
                };  
                v=c[k];
                if(v.click===2||(v.yb&&v.yb.click===2)){
                    v.s=n;
                };
                t.admit(v,n,f);
                i++;
             };
        }

};


DomVm.prototype.switch=function(o,f){ 
    var t=this,el=t.el,z,p,u;
       if(typeof(f)=='string')f=[f];
        if(o.s===1){
                z=o.xy;
                t.admit(o,1,f);
                el.clearRect(z[0],z[1],o.w,o.h);
                
        }else{   
                t.admit(o,0,f);
                t.drawArea(o,el,o.key);
        };
};



DomVm.prototype.reLocal=function(o){
    var t=this,el=t.el;
        t.drawArea(o,el,o.key);
    
};

DomVm.prototype.getAllDom=function(){
    var  t=this ,arr=t.layer,el=t.el , l=arr.length,n=t.showN,d;
         t.F=0; 
         while(l--){
            d=arr[l]; 
            t.showN=l;
            t.domMap[l]={};
            t.drawArea(d,el,0);
         };
         t.showN=n;
         t.F=1; 
};

DomVm.prototype.drawAll=function(){
   var  t=this , w=t.w,h=t.h, arr=t.layer,el=t.el , i=t.showN;
        el.clearRect(0,0,w,h);
        t.nowO=t.idMap[i];
        
        t.drawArea(arr[i],el,0); 
          
};



DomVm.prototype.drawArea=function(o,el,key,cfg){
     var t=this, x,y,w,h,  c,a,b,d,e,ln=t.showN , img=t.img,z,ii,u; 
         t.domMap[ln][key]=o;
         o.key=key;
        
         if(t.F===1&&o.s===1)return;  
        if(!cfg){
            x=o.xy[0],y=o.xy[1],w=o.w,h=o.h;
            
        }else{
            x=cfg[0],y=cfg[1],w=cfg[2],h=cfg[3];
        };
           
        if(t.F===1){  
            if(o.bimg!==u){ 
                z=o.bimg; 
                if(z[0]!==u){
                    
                    
                    
                        ii=img[ z[0] ][ z[1] ];
                        
                        el.drawImage(ii , x+z[4] , y+z[5] , z[2] , z[3] );
                    
                };   
                
            }else if(o.bg!==u){
                
                el.fillStyle=o.bg;
                el.fillRect(x,y,w,h);
            };
        };
        if(t.F===1&&o.txt){  
                b=o.txt;
            var ml=o.ml||0; 
            var mt=o.mt||0; 
            var cx=0,cy=0;
            var zh=o.zh||12;
            var zi,zl,zrr,zrj,zw,zw2,zr,zd,tw,cw,zf;
                
                el.font=(o.font||'12px')+' 宋体';
                
                el.fillStyle=o.color||'black';
                
                if(o.hh===1){ 
                    zi=0,zl=b.length,zrr=[],zrj='',zw=0; 
                    cw=w-ml; 
                    while(zi<zl){
                        zf=0;
                        zr=b[zi]; 
                        if(zr==='|'){
                            zr='';
                            zf=1; 
                        };
                        zrj+=zr;
                        zw2=el.measureText(zrj).width; 
                        
                        
                        
                        
                        
                        
                        
                        if(cw-zw2<14||zf===1){ 
                            
                           zrr.push([zw,zrj]); 
                           zrj='' , zw=0 ; 
                        }else if(zi+1===zl){ 
                           zrr.push([zw,zrj]); 
                        };
                    zi++;
                    };
                    
                }else{
                    tw=el.measureText(b).width;
                    zrr=[[tw,b]];
                };
                if(o.hh!==1&&o.zxm){  
                    cx=((w-tw)/2)<<0;
                };
                if(o.hh!==1&&o.zym===1){   
                    cy=((h-zh)/2)<<0;  
                };
               
                
                zi=0,zl=zrr.length;
                while(zi<zl){
                    zd=zrr[zi];
                    zr=zd[1]; 
                    zw=zd[0]; 
                    el.fillText(zr ,x+cx+ml,y+cy+zh*zi+zh+mt);
                    zi++;
                };
        };

        c=o.yb; 
        if(c){
            t.clone(o,[x,y,w,h],c,el, key);
        }; 
         
         if(o.click===1){
            
            if(t.F===1)o.click=2; 
            a=t.event[ln];
            a=a?a[key]:0;
            if(t.F===1)t.idMap[ln].$_key.push(key);
            t.idMap[ln][key]={
                        self:o,   
                        key:key,
                        cfg:cfg,
                        fun:a
            };
         }else if(o.click===2){
            t.idMap[ln][key].cfg=cfg;
         };
         c=o.$c; 
         if(c){ 
            a=c.$list;
            b=a.length;
            d=0;
            while(d<b){
               e=c[a[d]];
               t.drawArea( e , el , a[d] ,cfg?[x,y,e.w,e.h ]:u );  
               d++;
            };
        }; 
        
         if(t.F===1&&o.border!==u){
             c=o.border;
             a=c[0] , b=c[1]; 
             if(!a)a=1;       
             if(!b)b='black'; 
             el.strokeStyle=b;
             el.lineWidth=a;
            
             el.strokeRect(x,y,w,h);   
         };    
};


DomVm.prototype.clone=function(o,cfg,c,el,key){
   var t=this, x=cfg[0],y=cfg[1],w=cfg[2],h=cfg[4] ,e ,l,i ,a,b,d , ln=t.showN,  z,ii,img=t.img,cd,dd,ci,txt,rd,zf, u;
            c.key=key;
            
            
            if(t.F===1&&c.s===1)return;  
        var pl; 
        var d=c.arr; 
            
        
        var tf=d[0]; 
            
            if(tf===0){
                l=d[2],ci=d[1];
            }else if(tf===1){
                cd=d[1],l=cd.length,ci=d[2];    
            }else{
                cd=d[1],l=cd.length;  
            };
            i=0;
        var cw=c.w,ch=c.h,tw,zt,zi,zl,zrr,zr,zrj,zw,zw2,zd,cx,cy;   
        var ml=c.ml||0; 
        var mt=c.mt||0; 
            pl=c.pl||0; 
        var rx=x+ml,ry=y+mt,rxv=0,ryv=0,mw=0,mh=0,zh; 
           
            if(pl===0){
               if(c.ym===1){
                  ryv=((h-ch)/2)<<0;
                  ry=y+mt+ryv;  
               };
            }else{ 
               if(c.ym===1){
                  rxv=((w-cw)/2)<<0; 
                  rx=x+ml+rxv;  
               };
            };
            if(tf===1||tf===2){    
                   mw=rx,mh=ry; 
                
                   zh=c.zh||ch;  
                
                   
                
                
                el.font=(o.yb.font||'12px')+' 宋体';
                el.fillStyle=o.yb.color||'black';
                   
            };
            if(c.click===1){
                
                if(t.F===1)c.click=2;
                a=t.event[ln];
                a=a?a['$'+key]:0;  
                if(t.F===1)t.idMap[ln].$_key.push('$'+key);
                t.idMap[ln]['$'+key]={
                               self:o,
                               cfg:cfg,
                               key:key,
                               fun:a
                        };
            }else if(o.click===2){
                t.idMap[ln]['$'+key].cfg=cfg;
             };

            if(c.click>0){
               o.cArr=[];
            };
            
            while(i<l){
                if(tf===1){  
                    txt=cd[i];
                }else if(tf===2){ 
                    
                    dd=cd[i]; 
                    txt=dd[0]; 
                    ci=dd[1];  
                };
                rd=d[3];
                if(t.F===1){
                    
                    if(ci){ 
                        z=ci; 
                    
                    
                    
                            ii=img[ z[0] ][ z[1] ];
                            el.drawImage(ii , rx+z[4] , ry+z[5] , z[2] , z[3] );  
                    
                        
                    }else if(c.bg){
                        el.fillStyle=c.bg;
                        el.fillRect(rx,ry,cw,ch);
                    };
                }; 
                
                if(t.F===1&&(tf===1||tf===2)){ 
                     el.fillStyle= c.color||'black'; 
                    
                     b=txt; 
                     if(b!==undefined){
                            if(c.hh===1){ 
                                zi=0,zl=b.length,zrr=[],zrj='',zw=0; 
                                while(zi<zl){
                                    zf=0; 
                                    zr=b[zi]; 
                                    if(zr==='|'){
                                        zr='';
                                        zf=1; 
                                    };
                                    zrj+=zr;
                                    zw2=el.measureText(zrj).width;   
                                    
                                    
                                    
                                    
                                    if(cw-zw2<14||zf===1){   
                                        zrr.push([zw,zrj]); 
                                        zrj='' , zw=0 ; 
                                    }else if(zi+1===zl){ 
                                        zrr.push([zw,zrj]); 
                                    };
                                   zi++;
                                };  
                            }else{
                                tw=el.measureText(b).width;
                                zrr=[[tw,b]]; 
                            };
                            zi=0,zl=zrr.length; 
                            while(zi<zl){
                                zd=zrr[zi];
                                zr=zd[1]; 
                                zw=zd[0]; 
                                if(c.zxm){
                                    cx=((cw-zw)/2)<<0;
                                }else{
                                    cx=0; 
                                };
                                if(c.hh!==1&&c.zym===1){   
                                    cy=((ch-zh)/2)<<0;  
                                }else{
                                    cy=0;
                                };
                                el.fillText(zr , mw+cx, mh+cy+zh*zi+zh);
                                zi++;
                            };
                      };
                       pl===0 ? mw+=cw+ml : mh+=ch+mt ; 

                       if(pl===0&&mw+cw>x+w){ 
                          mw=x+ml+rxv; 
                          mh+=ch+mt; 
                       };
                 };
                 if(c.click>0){ 
                    o.cArr[i]=[rx,ry,rx+cw,ry+ch];
                  };
                 e=c.$c; 
                 if(e){ 
                    a=e.$list;
                    b=a.length;
                    d=0;
                    while(d<b){
                          d=e[a[d]];
                       t.drawArea( d , el  , a[d] , [rx,ry,d.w,d.h]);  
                       d++;
                    };
                 };  
                 if(t.F===1&&c.border&&(rd===i||rd===undefined) ){ 
                    
                    e=c.border;
                    a=e[0] , b=e[1]; 
                    if(!a)a=1;       
                    if(!b)b='black'; 
                    el.strokeStyle=b;
                    el.lineWidth=a;
                    
                    
                    el.strokeRect(rx,ry,cw,ch);
                    
                }; 
                
                
                 if(pl===0){
                     rx+=cw+ml; 
                    if(rx+cw>x+w){ 
                          rx=x+rxv+ml;
                          ry+=ch+mt;
                     };   
                 }else{
                     ry+=ch+mt; 
                 };
               i++;
            };
};

DomVm.prototype.update1=function(){
    var t=this,t2=t.$this ,s=t.$self,p,z;
         p=s.$p||s;
         z=p.xy;  
         t2.el.clearRect(z[0],z[1],p.w,p.h);
         t2.reLayout(s);
         t2.reLocal(p); 
        
};

DomVm.prototype.update2=function(){
    var t=this,t2=t.$this;
       
        t2.clone(t.$pSelf,t.$cfg,t.$self,t2.el,t.$key );
    
};

DomVm.prototype.tObj=function(x,y,n,id,e){ 
   var t=this ,o=t.nowO,arr=o.$_key,l=arr.length,k,d , xy ,xyr ,i,f;

       while(l--){
           k=arr[l];
           f=o[k];
           d=f.self;
        
           if(d.s===1)continue;
           if(d.cArr!==undefined){ 
                      
               xyr=d.cArr;
               i=xyr.length;
               while(i--){
                   xy=xyr[i];
                   if(x>xy[0]&&x<xy[2]&&y>xy[1]&&y<xy[3]){
                    
                       if(f.fun){
                           t.sz[id]={
                                 $this:t,
                                 $self:d.yb,         
                                 $pSelf:d,           
                                 $cfg:f.cfg,         
                                 $key:f.key,         
                                 $i:i,               
                                 $update:t.update2,  
                                 $fun:f.fun,         
                           };
                           t.sz[id].$fun(n,e,x,y);
                        
                           break;
                       };   
                   };
               };
           }else if(d.click>0){
                xy=d.xy;
                if(x>xy[0]&&x<xy[2]&&y>xy[1]&&y<xy[3]){
                    if(f.fun){
                        t.sz[id]={
                            $this:t,
                            $self:d,
                            $cfg:f.cfg,
                            $key:f.key,
                            $update:t.update1,
                            $fun:f.fun,    
                        };
                        t.sz[id].$fun(n,e,x,y); 
                        
                        break; 
                    };   
                };    
            };
       };
      
};
DomVm.prototype.offset=function(e ){
  
    var left = e.offsetLeft;
    var top  = e.offsetTop;
    var parent = e.offsetParent;  
       while( parent != null ){  
            left+= parent.offsetLeft; 
            top+= parent.offsetTop;
            parent = parent.offsetParent;  
     };  
    return {top:top,left:left};  

}
DomVm.prototype.clickObj=function(){
    var t=this,dom=t.dom ,arr,l,d,x,y,id,sz=t.sz ,w,h,of; 
    
      w=t.w+1,h=t.h+1;
     
     dom.onmousedown=function(e){
         
         
         
         
             
             
              of=t.offset(this);
              d=e;
              id=0;
              x=d.pageX<<0;
              y=d.pageY<<0;
              x-=of.left;  
              y-=of.top;
              if(x>-1&&x<w&&y>-1&&y<h){
                  t.tObj(x,y,0,id,e);
              };
         
     };
     
     dom.onmouseup=function(e){
         
         
         
         
         
             
            of=t.offset(this); 
            d=e;
            id=0;
            x=d.pageX<<0;
            y=d.pageY<<0;
            x-=of.left;  
            y-=of.top;
             if(sz[id]){
                 sz[id].$fun(2,e,x,y);  
                 sz[id]=0;
             };  
         
     };
     window.onblur=function(){
         t.allEnd();
     };
     
     
     
     
     
     
     
     
     
     
     
};

DomVm.prototype.addEvent=function(o){
    var t=this , e = t.event, k , v,k2,d,ev;
        for(k in o){
            v=o[k];
            if(e[k]===undefined)e[k]={};
            ev=e[k];
            for(k2 in v){
                d=v[k2];
                ev[k2]=d;
            };
        }        

};

DomVm.prototype.allEnd=function(){
    var d;
        this.sz.length=0;
        keyNow[0]=-1 , keyNow[1]=-1 , keyk=-1;
        d=xnDom.domMap[2].rocker;
        d.l=50,d.t=50;
    

        







}