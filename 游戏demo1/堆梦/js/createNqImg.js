var ImgNq=function(){ 
      var t=this;
          t.p=Math.PI/180;
          t.canvas=document.createElement('canvas');
          t.ctx= t.canvas.getContext('2d'); 
        
}; 

ImgNq.prototype.reCanvas=function(){
      var t=this, c=t.canvas;
          c.width=t.w;
          c.height=t.h;
          t.ctx.save();
};

ImgNq.prototype.init=function(d,o){ 
       var t=this;
        
           t.img=d[0];
        
        
           t.w=d[1]+d[5]*2; 
           t.h=d[2]; 
           t.sw=d[1];
           t.bw=d[5]; 
           t.reCanvas();
           t.n=d[3]; 
           t.d=o;  
           t.f=d[4]!==undefined?d[4]:5; 
           t.createData();
};

ImgNq.prototype.createData=function(){ 
  var t=this , s=t.f,e= -s-1,ctx=t.ctx,c=t.canvas,  w=t.w ,sw=t.sw,bw=t.bw, h=t.h , p=t.p , n=t.n , v,v2, img=t.img,png ; 
       
    
        while(s>e){
            png=new Image();
            ctx.restore();
            ctx.save();
            ctx.clearRect(0,0,w,h); 
            v=n*s;
            v2=v<0?-v:v;
            ctx.translate( w/2, h );  
            ctx.transform(1,0,v, Math.cos(90*v2*p)*1 ,0,0);
            ctx.drawImage(img,-w/2+bw,-h, sw,h);   
            
            
            png.src=c.toDataURL();
            t.d.push(png);
            png.onerror=function(err){
                 throw err;
            };
           s--;       
        };
};



var imgNq=new ImgNq();

var ImgJX=function(){ 
     var t=this;
         t.can=document.createElement('canvas');
         t.ctx=t.can.getContext('2d'); 
};

ImgJX.prototype.getJx=function( o ){
    var t=this,c=t.can,x=t.ctx,w,h,img;
           w=o.naturalWidth;
           h=o.naturalHeight;
           c.width=w;
           c.height=h;
           x.restore();
           x.save();
           x.clearRect(0,0,w,h);
           x.translate(w, 0);
           x.scale(-1,1);
           x.drawImage(o,0,0,w,h);
           img=new Image();
           img.src=t.can.toDataURL();
           return img; 
};
var imgJX=new ImgJX();
