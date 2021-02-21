

var mapYsData;



var cAndC=function(o){
     var i=0,c,d=o[5],e,v, z=d[10],l;
         if(z){ 
           l=z.length;
            while(i<l){
              c=z[i]; 
              v=c[2]; 
              d=v[3];
              if(d){
                 d[0]=0; 
                 d[6]=0; 
              };
              cAndC(v); 
              i++;
            }
      };
       
};

var mapYs=function(name){ 
    var  o=worldMap,map=[],d,w,h,x,y,c,e,i=0;
          map[0]=reNew(o[0]);
          map[1]=reNew(o[1]); 
          d=o[0]; 
          w=d[0].length,
          h=d.length;
          map[2]=[w,h,w,h*2];
          map[3]=name*1; 
              
            
           
             d=map[0] 
            while(i<h){
               c=d[i],x=0;
                while(x<w){
                      o=c[x];
                      y=o.length;
                      while(y--){
                          e=o[y]; 
                          e=e[3];
                          if(e){
                            e[0]=0; 
                            e[6]=0; 
                          };  
                      };
                  x++;
                };

              i++;
            }; 
            
            h=h*2,d=map[1],i=0;
            while(i<h){
                c=d[i],x=0;
                while(x<w){
                    o=c[x];
                    o=o[0][0];
                    if(o){
                      e=o[3];
                      if(e){
                          if(e[5]>0){ 
                              e[5]=0;
                          }else{
                              e[0]=0; 
                              e[6]=0; 
                          }; 
                      };
                      
                      cAndC(o);
                    };
                  x++;
                };
              i++;
            }; 
    return Zip(JSON.stringify(map));
};


var jsonJy=function(mapYsData){
        var data= Unzip(mapYsData); 
        return JSON.parse(data);
};

var jsonYs=function(j){
        return  Zip(JSON.stringify(j));
};


var Unzip=function(key) {
    var charData = key.split('').map(function (x) { return x.charCodeAt(0); });
    var binData = new Uint8Array(charData);
    var data = pako.inflate(binData);
        data=new Uint16Array(data);
    var s='',i=0,l=data.length;
         while(i<l){
            s+=String.fromCharCode(data[i]);
            i++;
         }; 
    return unescape(s);
  };
   

var Zip=function(str){
  var binaryString = pako.gzip(escape(str), { to: 'string' });
  return binaryString;
};
