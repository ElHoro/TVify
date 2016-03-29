$(function() {

  var $tvShowContainer = $('#app-body').find('.tv-shows');
  console.log($tvShowContainer);

  var template = '<article class="tv-show">' +
                   '<div class="left .img-container">' +
                     '<img src=":img:" alt=":img alt:">' +
                   '</div>' +
                   '<div class="left info">' +
                     '<h1>:name:</h1>' +
                     '<p>:summary:</p>'+
                     '<button class="like">💙</button>'
                   '</div>' +
                 '</article>';

  $tvShowContainer.on('click', 'button.like', function (ev) {
    var $this = $(this);
    $this.closest('.tv-show').toggleClass('liked');
  })

  function renderShows(shows) {
    $tvShowContainer.find('.loader').remove();
  shows.forEach(function (show) {
    var article = template
      .replace(':name:', show.name)
      .replace(':img:', show.image ? show.image.medium : '')
      .replace(':summary:', show.summary)
      .replace('img alt:', show.name + " Logo")

      var $article = $(article)
      $tvShowContainer.append($article.fadeIn(1000));

  })
}

  /**
   * Submit search form
   */

   $('#app-body')
    .find('form')
    .submit(function (ev) {
      ev.preventDefault();
      var busqueda = $(this)
        .find('input[type="text"]')
        .val();

      $tvShowContainer.find('.tv-show').remove()
      var $loader = $('<div class="loader"></div>');
      $loader.appendTo($tvShowContainer);

      $.ajax({
        url: 'http://api.tvmaze.com/search/shows',
        data: { q: busqueda },
        success: function(res, textStatus, xhr) {
          var shows = res.map(function (el) {
            return el.show;
          })

        $loader.remove();
        renderShows(shows);
        }
      })
   })

   /**
    * TV-Shows request
    */
    if (!localStorage.shows){
    $.ajax('http://api.tvmaze.com/shows')
    .then(
      function (shows, textStatus, xhr) {
        $tvShowContainer.find('.loader').remove();
        localStorage.shows = JSON.stringify(shows);
        renderShows(shows);
        }
      )
    } else {
      //$tvShowContainer.append('Cargado en local')
      renderShows(JSON.parse(localStorage.shows));
    }
})
