/*
https://docs.google.com/spreadsheets/d/1Z4EnBOoyeQ1BsSw4xZjpgvjObb3nD0SwkeUBnjZxIAQ/pubhtml?gid=0&single=true*/

var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdE5OcDE1SENpT1g2R2JEX2tnZ3ZIWHc&output=html';

/*MY DATA*/
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Z4EnBOoyeQ1BsSw4xZjpgvjObb3nD0SwkeUBnjZxIAQ/pubhtml?gid=0&single=true';



function findPositions() {
  var pulseHeight = document.getElementById('pulse').offsetHeight;
  var pulseTop = $('#pulse').position().top;
  var pfHeight = document.getElementById('pf').offsetHeight;
  var pfTop = $('#pf').position().top;
  /*console.log("PULSE", pulseTop, pulseBottom);*/
  return {'pulseTop': pulseTop, 
          'pulseHeight': pulseHeight,
         	'pfTop': pfTop,
          'pfHeight': pfHeight}
}

$(document).ready( function() {
  
  console.log("RESOLUTION +++++++++", window.devicePixelRatio);
    
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   parseNumbers: true } );


  function showInfo(data, tabletop) {
    console.log("DATA", data);
    var source   = $("#amb-template").html();
    var template = Handlebars.compile(source);

    $.each( tabletop.sheets("projects").all(), function(i, project) {
      var images = project.images.split(", ");
      var numbering = project.allProjects.split(", ");
      var total = project;
      var current = i+1;
      project.current = current;
      project.numbering = numbering;
      /*console.log("numbering", project.numbering);*/
      project.images = images
      var html = template(project);
			/*console.log("PROJECT", project);*/
      $("#content").append(html);
    });
    
    wistiaEmbedPulse1 = Wistia.embed("g7d5793wsw", {videoFoam: true, volume: 0});
    wistiaEmbedPulse2 = Wistia.embed("alntz3qe1c", {videoFoam: true});
    wistiaEmbedPF = Wistia.embed("7b84ogfdy9", {videoFoam: true, volume: 0, time: 10});
    wistiaEmbedPulse1.ready(function() {
      	wistiaEmbedPulse1.volume(0);
      })
    wistiaEmbedPF.ready(function() {
      	wistiaEmbedPF.volume(0);
      })
    
    var PFvideoVol = false;
    
    $(".turn-on-vid").on( "click", function() {
      console.log(PFvideoVol);
      console.log("PF VOLUME", wistiaEmbedPF.volume());
      if (PFvideoVol === false) {
        wistiaEmbedPF.volume(.4);
        wistiaEmbedPF.time(0);
        $('#pf').find('.turn-on-vid').toggleClass('volume-on');
        }
      else {
        wistiaEmbedPF.volume(0);
        $('#pf').find('.turn-on-vid').toggleClass('volume-on');
        }
      PFvideoVol = !PFvideoVol
        
      });
      


    $(document).scroll(function(){
      /*console.log("\n\nPulse Vid", wistiaEmbedPulse1.state());*/
      var pulseHeight = document.getElementById('pulse').offsetHeight;
      var pulseTop = $('#pulse').position().top;
      var pfHeight = document.getElementById('pf').offsetHeight;
      var pfTop = $('#pf').position().top;
      
      var currentPos = $(this).scrollTop();
      /*console.log("CURRENTPOS", currentPos, pfTop, pfTop+pfHeight )*/
      /*console.log("CURRENTPOS PULSE", currentPos, pulseTop, pulseTop+pulseHeight )*/
      if (currentPos > pulseTop && currentPos < pulseTop+pulseHeight) {
        if (wistiaEmbedPulse1.volume() > 0) {
          wistiaEmbedPulse1.volume(0)
        }
        wistiaEmbedPulse1.play();
      }
      else {
        wistiaEmbedPulse1.pause();
      }
      
      if (currentPos > pfTop && currentPos < pfTop+pfHeight) {
        wistiaEmbedPF.play();
        console.log("\n\nPF Vid", wistiaEmbedPF.state());
      }
      else {
        wistiaEmbedPF.pause();
        console.log("\n\nPF Vid", wistiaEmbedPF.state());
      }
      
    })

    
  }
  

  var screenHeight = $(window).height();
  $('#top, #top .container').css("min-height", screenHeight);
  $('#top').find('.fadein').removeClass('opacity');

  
});

/*http://www.ambwork.com/2009_ambwork/files/*/