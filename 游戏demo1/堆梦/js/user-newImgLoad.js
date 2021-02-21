var ImgLoad=function(){


};
ImgLoad.prototype.init=function(data,load,fun){
    var t=this,l;
    var a=[8400,8401,8402,8403,8404,8405,8406,8407,8408,8409,8410,8600,8601,8101]; 
        t.A=allIdObj;
        t.D=data; 
        t.F=1;    
        t.d={}; 
        t.c=[];  
        t.x={};  
        t.z={};  
        t.s=0;  
        t.e=0;  
        t.Q=0;  
        t.load=load;
        t.callBack=fun;
        l=a.length;
        while(l--){
            t.get(a[l]);  
        };
};
ImgLoad.prototype.clear=function(){
    var t=this,c=t.c,l=c.length,o=allIdObj,u;
        t.Q=1;
        t.x={};
        while(l--){
             o[c[l]]=null; 
        };
        c.length=0;
};
ImgLoad.prototype.concat=function(a,b){
    var i=0,l=b.length;
       while(i<l){
         a[i]=b[i]
         i++;
       };
}
ImgLoad.prototype.get=function(k,n,z){ 
    var t=this,a=t.A,d=t.D,c=t.c,u,f=1;
        if(t.Q===1)return;
        if(k>8399&&k<8500)z=1;
        if(!a[k]){
            if(t.F===0){
                if(z!==1){
                  c.push(k)
                };
            };   
            f=0;  
            a[k]=[];
        };    
        t.k=k;
        if(d[k]===u)debugger;
        t.next(d[k],n,f,z);  
 };
 ImgLoad.prototype.next=function(o,n,f,z){ 
    var t=this,cfg,d, base ,end ,img ,nq ,i ,l ,src,jx,u,b;
            base=o[0]?o[0]:'';
            end='.png';
            img=o[1];
            if( img instanceof Array == false){ 
                img=[img];
            };
            cfg=o[2];
            nq=o[5];
            jx=o[6]; 
            if(jx===1){ 
                if(f===1)return; 
                i=0,l=img.length;
                while(i<l){
                    src=base+img[i]+end;
                    t.next2( src, nq ,cfg , i,l); 
                    i++;
                };
            }else if(nq===u){
                if(n===u){
                    i=0,l=img.length;
                }else{
                    b=z===1?t.z:t.x;
                    d=b[t.k];
                    if(d===u){
                       d=[];
                       b[t.k]=d;
                    };
                    if(d[n]===1)return; 
                    d[n]=1; 
                    i=n,l=n+1;
                 };
                while(i<l){
                    src=base+img[i]+end;
                    t.next2( src, nq ,cfg , i); 
                  i++;
                };
            }else{ 
                if(f===1)return; 
                src=base + img + end;
                t.next2( src, nq ,cfg  );       
            }; 

}; 
ImgLoad.prototype.next2=function(src,nq,c,i,jxL){
    var t=this,o=t.A[t.k], img ,w,h,d,zw,u;
          if(t.F===1)t.s++;
          
           img = new Image();
           img.src=src;
           img.onload=function(){
                
                
                w=this.width;
                h=this.height;
                if(jxL>0){ 
                    o[i]=this;
                    o[jxL+i] = imgJX.getJx(this);
                }else if(nq===undefined){ 
                    o[i]=this;
                }else{ 
                    zw=c[8]; 
                    if(zw!==u){
                        zw=c[8];
                        c[0]+=zw*2;
                        c[6]+=zw; 
                        c[8]=0;  
                    }else{
                        zw=0;
                    };
                    
                    imgNq.init( [this,w,h,nq,5,zw],o);
                   
                    
                };
                
                if(t.F===1){
                    t.e++;
                    t.load(t.e,t.s)
                    if(t.e===t.s){
                        t.F=0; 
                        t.callBack();
                    };   
                };
            };
        
        
        
        
        

};

var imgLoad=new ImgLoad();