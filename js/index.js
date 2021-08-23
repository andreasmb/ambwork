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
                  self.items = response.data.records
                  console.log(self.items, "SELF ITEMS")
                  // findProjectTop();
                  $( ".loading" ).remove();

              }).catch(function(error){
                  console.log(error)
              })
          }
      }
  })



  var screenHeight = $(window).height();
  var tocStartOffset = 8;
  var tocUnitHeight = 56;

  $(window).scroll(function() {
      var windscroll = $(window).scrollTop();
      // console.log(windscroll, "WINDSCROLL");
      var numProjects = $('#app .project').length;
      if (windscroll >= 100) {
          // $('nav').addClass('fixed');
          $('#app .project').each(function(i) {
              var currentProjectId = $(this).attr('id');
              var thisProject = $(this).position().top;
              if (thisProject <= windscroll - (screenHeight-400) ) {
                  // console.log(i, $(this).attr('id'), thisProject, windscroll);
                  $('#toc a').removeClass('active');
                  $('#toc a').eq(i).addClass('active');
                  var offset = (i*tocUnitHeight)+tocStartOffset;
                  $('#toc').css('margin-top',-offset);
              }
          });

      } else {
          //
          // $('nav').removeClass('fixed');
          $('#toc a.active').removeClass('active');
          $('#toc a:first').addClass('active');
      }

  }).scroll()



  // Convert markdown to html

  setTimeout(function(){

    $('#name').fadeIn("slow");

    $( ".markdown" ).each(function(index) {
      var converter = new showdown.Converter();
      var md = $(this).text();
      var html = converter.makeHtml(md);
      $(this).html(html);
    });

    // findProjectTop();

  }, 1500);


});
