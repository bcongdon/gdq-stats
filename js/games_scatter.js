$.get("/data/games.csv").pipe(CSV.parse).done(function(a){handleData(a)});function unique(a){return a.filter(function(d,c,b){return b.lastIndexOf(d)===c})}function handleData(f){var j=f.map(function(i){return i[1]}),l=f.map(function(i){return i[2]}),g=f.map(function(i){return i[3]}),h=f.map(function(i){return i[4]}),d=f.map(function(i){return i[5]}),a=unique(g);h.unshift("x");h=h.map(function(i){return i==""?null:i});var c=[h];for(var e in a){var b=f.map(function(i){return i[3]==a[e]?i[5]:null});b.unshift(a[e]);c.push(b)}var k=c3.generate({bindto:"#schedule_chart",data:{x:"x",columns:c,type:"scatter"},axis:{x:{label:"Release Date",tick:{format:"%Y",fit:false},type:"timeseries"},y:{label:"SGDQ Speedrun Time",min:0,max:250,padding:{top:0,bottom:0}}},point:{r:3},tooltip:{format:{title:function(m){var i=moment(m).format("YYYY-MM-DD");return j[h.lastIndexOf(i)-1]+'<br><span style="color:#000;font-weight:200">'+i+"</span>"},value:function(m,i,n){return m+" minutes"}},contents:function(v,n,p,r){var z=this,o=z.config,t=o.tooltip_format_title||n,q=o.tooltip_format_name||function(i){return i},u=o.tooltip_format_value||p,y,s,w,x,m,A;for(s=0;s<v.length;s++){if(!(v[s]&&(v[s].value||v[s].value===0))){continue}if(!y){w=t?t(v[s].x):v[s].x;y="<table class='"+z.CLASS.tooltip+"'>"+(w||w===0?"<tr><th colspan='2' style='background-color:#ddd; color:black; font-family:Open Sans'>"+w+"</th></tr>":"")}m=q(v[s].name);x=u(v[s].value,v[s].ratio,v[s].id,v[s].index);A=z.levelColor?z.levelColor(v[s].value):r(v[s].id);y+="<tr class='"+z.CLASS.tooltipName+"-"+v[s].id+"'>";y+="<td class='name'><span style='background-color:"+A+"'></span>"+m+"</td>";y+="<td class='value'>"+x+"</td>";y+="</tr>"}return y+"</table>"}}})};