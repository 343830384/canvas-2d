



                               

var gYcfg={   
    
       
       0:[8,'xt/bk',0,0], 
       1:[8,'xt/bg',0,0], 
       2:[8,'xt/rc',0,0], 
       3:[8,'xt/ts',0,0], 
       4:[8,'xt/js',0,0], 
       5:[8,'xt/sh',0,0], 
       6:[8,'xt/ccc',0,0],
       7:[8,'xt/cc',0,0], 
       8:[8,'xt/zz',0,0],  
       9:[8,'xt/tshui',0,0],
       10:[8,'xt/tshi',0,0],
       11:[8,'xt/dn',0,0], 
       12:[8,'xt/df',0,0], 
       19:[8,'xt/jm',0,0],  
       20:[8,'xt/mn',0,0],  
       21:[8,'xt/mdd',0,0],  
       22:[8,'xt/ms',0,0],  
       40:[3,'jm/nz/o',0,0], 
       41:[3,'jm/nz/s',0,0], 
       42:[1,'jm/nvz/o',0,0], 
       43:[3,'jm/nvz/s',0,0], 

       99:[1,'xt/mb',0,0],  
      
      50:[5,'fw/yu',-1],   
      60:[6,'fw/waMing',1,2000],
      61:[7,'fw/shuiDiDong',1,1000], 

    
      100:[1,'jb/tongY',0,0],
      101:[1,'jb/tongY',0,0],
      102:[1,'jb/zhu',0,0],
      
      110:[1,'jb/kuiJiaBing',0,0], 
      111:[1,'gw/she/z',0,0], 
      112:[1,'gw/she/g',0,0], 
      113:[1,'gw/she/s',0,0], 
      114:[1,'gw/she/o',0,0], 

    
      140:[1,'wq/j0',0,0], 
      141:[1,'wq/f0',0,0], 
      142:[1,'wq/b0',0,0], 
      143:[1,'wq/z0',0,0], 
      
      150:[1,'wq/c0',0,0],  
      180:[1,'pgm/xhq',0,0],

    
      200:[1,'dw/zhuJiao',0,0],
    
};


var Gyx=function(){
   var t=this;
       t.yp=[];
       t.yd=[];
       t.init();  
       t.clInit();
       t.C={}; 
       t.Q=0;  
}; 


Gyx.prototype.init=function(){
 var t=this,d=t.yp,d2=t.yd,l=40,o;
     while(l--){
         
        o=new Audio();
        o.preload=true;
        (function(x,y){
            
            y.onended=function(){
               t.ypCl(1,x);
            };
         
            y.oncanplay=function(){
               t.ypCl(0,x);
            };
         
            y.onpause=function(){
               t.ypCl(2,x);
            };
            y.onerror=function(err){
               
               
            };
       })(l,o);
        d[l]=o;
        d2[l]=0; 
     }; 
};


Gyx.prototype.clInit=function(){ 
var t=this,yp=t.yp,yd=t.yd,yc=[],yj=[],j=0,l=20,g=gYcfg,o,u,cg;
var a,b,c,d,e,f,h,i;
     
     
     
     
     
     
   
     
    
    
    
    t.ypCl=function(n,m){
           a=yp[m],b=yd[m];
           
           c=b[0];
           d=b[2];
           if(n===0){
                  if(d===-1){
                      a.play();
                  }else{
                      yc[m]=2; 
                  }; 
           }else if(n===1){
                 if(c===5||c===6){
                     if(d===-1){ 
                         a.play();
                     }else{
                        yc[m]=3; 
                     };  
                 }else{ 
                    if(d===-1){
                      yd[m]=0; 
                      yc[m]=0  
                    }else{
                      yc[m]=3; 
                    };
                 };
           }else{

           };
    };
    
    t.bfCl=function(sj){ 
         j=sj;
         i=0;
         while(i<l){
            e=yc[i];
            if(e>1){ 
                b=yd[i]; 
                c=b[2];
                 if(e===2){
                     f=yj[i]; 
                    if(j-f>(b[3]||0)-1){
                      yc[i]=1;
                      yp[i].play();
                    };
                 }else{
                     if(c===0){
                          yc[i]=0; 
                          yd[i]=0; 
                     }else if(c===1){
                          yc[i]=2; 
                          yj[i]=j; 
                     }else if(c===2){
                          yc[i]=0; 
                          yd[i]=0; 
                          t.ypTj( [[b[4],yp[i].volume] ]);
                     };
                 };
            };
            i++; 
         }; 
    };
    
    
    cg={
       
       3:[3], 
       4:[4,5], 
       
       8:[6,7,8,9,10],  
       
       5:[0], 
       6:[1], 
       7:[2], 
       
       2:[11,12,13], 
       1:[14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39], 
    };
    
    t.ypTj=function(ar){ 
      if(t.Q===1)return;
       var A,B,C,S;
           i=ar.length;
           while(i--){
               A=ar[i]; 
               a=g[A[0]];
              
               b=a[0]; 
               c=a[2]; 
               B=t.yCl1(b); 
               if(B>-1){
                   C=yp[B]; 
                   if(A[1]===0){
                     C.src='';
                     yd[B]=0;
                     yc[B]=0;
                     continue; 
                  };
                   yd[B]=a;
                   yc[B]=0; 
                   if(c>-1)yj[B]=j+(A[2]||0); 
                   
                   if(b===5){
                      C.loop=c===-1?true:false; 
                   };
                   S='./audio/'+a[1]+'.mp3';
                   if(t.C[A[0]]===u)t.cache(A[0],S);
                   if(C.src===S){
                     yc[B]=2; 
                  }else{
                     C.src=S;
                  }; 
                   C.volume=A[1]||1; 
              };
           };
    };
    
    t.yCl1=function(a){
       var A,B,L;
            A=cg[a]; 
            L=A.length;
            if(L===1)return A[0]; 
            B=t.yCl2(A,L); 
          return B 
          
    };
    
    t.yCl2=function(a,L){ 
       var A,B,I=0;
           while(I<L){
              B=a[I]; 
              A=yd[B];
              if(A===0||A===u)return B;
              I++;
           };
           return -1; 
   };
   
   t.mapQh=function(){
       t.Q=1; 
          i=0;
          while(i<l){
             yp[i].src=''; 
             i++;
          };
          yd.length=0;
          yc.length=0;
          t.C={};    
   };
   
   t.cache=function(id,src){
        var v=new Audio();
            
            v.src=src;
            t.C[id]=v;   
   };
};

var gYx=new Gyx();

    
    