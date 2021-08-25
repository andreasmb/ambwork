$( document ).ready(function() {

  var app = new Vue({
      el: '#app',
      data: {
          items: []
      },
      mounted: function(){
         this.loadItems();
      },
      methods: {
          loadItems: function(){

              // Init variables
              var self = this

              var app_id = "appKtQz6NKGGJRb8b";
              var app_key = "keym8ucVtuq8SCzZF";

              this.items = []
              axios.get(
                  "https://api.airtable.com/v0/"+app_id+"/Menu?view=Grid%20view",
                  {
                      headers: { Authorization: "Bearer "+app_key }
                  }
              ).then(function(response){
                  self.items = response.data.records;
                  $( ".loading" ).remove();
                  $('.fadein').addClass("opacity-100");
                  setTimeout(convertMarkdown, 1500);

              }).catch(function(error){
                  console.log(error)
              })
          }
      }
  })



  var screenHeight = $(window).height();
  var tocStartOffset = 8;
  var tocUnitHeight;

  $(window).scroll(function() {
      var windscroll = $(window).scrollTop();
      if (tocUnitHeight == null) {
           tocUnitHeight = $('#toc a').first().outerHeight(true);
      }
      var numProjects = $('#app .project').length;
      if (windscroll >= 100) {
          $('#app .project').each(function(i) {
              var currentProjectId = $(this).attr('id');
              var thisProject = $(this).position().top;
              if (thisProject <= windscroll - (screenHeight-400) ) {
                  $('#toc a').removeClass('active');
                  $('#toc a').eq(i).addClass('active');
                  var offset = (i*tocUnitHeight)+tocStartOffset;
                  $('#toc').css('margin-top',-offset);
              }
          });

      } else {
          $('#toc a.active').removeClass('active');
          $('#toc a:first').addClass('active');
      }

  }).scroll()



  // Convert markdown to html

  function convertMarkdown() {
    $( ".markdown" ).each(function(index) {
      var converter = new showdown.Converter();
      var md = $(this).text();
      var html = converter.makeHtml(md);
      $(this).html(html);
    });
  }


});
