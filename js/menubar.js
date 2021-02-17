/* 
menubar 菜单栏编辑器

*/

(function(){
/* 
 点击菜单栏 弹出对应编辑器 (在默认位置)
*/    
var bar=document.getElementById('menubar');
    bar.addEventListener('click',function(e){
        var a=e.target,v,d;
            if(a.tagName=="LI"){
                v=a.getAttribute('ui');//ui 的 id
                if(v){
                     v=v.trim();
                     d=document.getElementById(v).style;//对应功能模板的 style

                     if(G_cz[v])G_cz[v](d);//匹配模板打开时的默认方法 (每个都有  初始化 )
                   
                    //默认唤出位置 (防止拖拽到遮盖区域,无法唤出, 若有)
                    v=a.getAttribute('wz');
                    if(v===null)return; //没有默认初始位置设置
                    v=v.split(';')
                    d.left=v[0];
                    d.top=v[1];
                };
            }

    });




})();