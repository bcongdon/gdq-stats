function accumulate(a){return a.reduce(function(c,b){c.push((c.length&&c[c.length-1]||0)+b);return c},[])}getRetry("https://www.googleapis.com/storage/v1/b/sgdq-backend.appspot.com/o/killVsSave.json",function(a){getRetry(a.mediaLink,setupBidSeries)});function setupBidSeries(c){c=JSON.parse(c);var a=c.ys.map(function(e){return accumulate(e.slice(1))});a.forEach(function(f,e){f.unshift(c.ys[e][0])});var b=graphSeries("#metroid_chat",c.x,a);b.data.colors({Save:d3.rgb("#00AEEF"),Kill:d3.rgb("#F21847")})}function graphSeries(c,b,a){var d=[b].concat(a);return chart=c3.generate({bindto:c,data:{x:"x",columns:d},axis:{x:{type:"timeseries",tick:{format:"%Y-%m-%d %I:%M%p",fit:false,count:9}},y:{tick:{format:d3.format("$,")}}},point:{r:1},tooltip:{format:{value:function(f,e,h){var g=d3.format("$,.2f");return g(f)}}},zoom:{enabled:true,rescale:true}})}function getRetry(b,a){$.ajax({url:b,async:true,retryCount:0,retryLimit:5,retryTimeout:15000,timeout:2000,created:Date.now(),error:function(d,e,c){this.retryCount++;if(this.retryCount<=this.retryLimit&&Date.now()-this.created<this.retryTimeout){console.log("Retrying");$.ajax(this);return}},success:a})};