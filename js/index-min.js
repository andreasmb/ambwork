$(document).ready((function(){function t(){$(".markdown").each((function(t){var a=new showdown.Converter,e=$(this).text(),o=a.makeHtml(e);$(this).html(o)}))}var a=new Vue({el:"#app",data:{items:[]},mounted:function(){this.loadItems()},methods:{loadItems:function(){var a=this,e="appKtQz6NKGGJRb8b",o="keym8ucVtuq8SCzZF";this.items=[],axios.get("https://api.airtable.com/v0/"+e+"/Menu?view=Grid%20view",{headers:{Authorization:"Bearer "+o}}).then((function(e){a.items=e.data.records,$(".loading").remove(),$(".fadein").addClass("opacity-100"),setTimeout(t,1500)})).catch((function(t){console.log(t)}))}}}),e=$(window).height(),o=8,i;$(window).scroll((function(){var t=$(window).scrollTop();null==i&&(i=$("#toc a").first().outerHeight());var a=$("#app .project").length;t>=100?$("#app .project").each((function(a){var o=$(this).attr("id"),n;if($(this).position().top<=t-(e-400)){$("#toc a").removeClass("active"),$("#toc a").eq(a).addClass("active");var s=a*i+8;$("#toc").css("margin-top",-s)}})):($("#toc a.active").removeClass("active"),$("#toc a:first").addClass("active"))})).scroll()}));