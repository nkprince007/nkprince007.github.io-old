$(document).ready(() => {
  var elements = document.querySelectorAll('[data-chaffle]');
  elements.forEach(el => {
    const chaffle = new Chaffle(el);
    setInterval(() => chaffle.init(), 5000);
  });

  var elements = document.querySelectorAll('[data-juggle]');
  elements.forEach(el => {
    const juggle = new Juggle(el);
    $(el).mouseover(() => juggle.init());
    $(el).mouseout(() => juggle.stop());
  });

  /*
   * Blog parser for Medium using YQL!
   *
   * Author: nkprince007@icloud.com
   * RSS Blog from medium.com mirrored via yql
   * Freshly parsed and processed for you!
   */
  const blogRSSUrl = "https://medium.com/feed/my-new-roots";
  const blogRootComponent = "#blog";
  const blogTitleComponent = "#blog .blog-title";
  const blogContentComponent = "#blog .blog-content";
  const blogPreloaderComponent = "#blog .preloader";

  $.ajax({
    url: 'https://query.yahooapis.com/v1/public/yql',
    data: {
      q: "select * from xml where url='" + blogRSSUrl + "'",
      format: 'json'
    },
    async: true
  }).then(data => {
    const channel = data.query.results.rss.channel;

    const blogDescription = channel.description.trimRegex(/\s+-\s+Medium/g);
    const channelTitle = channel.image.title.trimRegex(/\s+-\s+Medium/g);

    var titleElement = $("<h1 />", {
      class: 'title'
    });
    var descriptionElement = $("<h4 />", {
      class: 'description'
    });
    var postList = $('<ul />', {
      'class': 'collapsible blog-list',
      'data-collapsible': 'accordion'
    });

    titleElement.html(channelTitle);
    descriptionElement.html(blogDescription);
    postList.collapsible();

    $(blogTitleComponent).append(titleElement);
    $(blogTitleComponent).append(descriptionElement);
    $(blogContentComponent).append(postList);

    const blogPosts = channel.item;
    blogPosts.forEach(post => {
      const postPubDate = post.pubDate;
      const postTags = post.category;
      const postLink = post.link;
      const postInnerHTML = post.encoded.trimRegex(RegExp("<hr>.*$"));
      const postTitle = post.title;

      var postList = $(".blog-list");
      var postListItemElement = $("<li />");
      var postHeaderElement = $("<div />", {
        class: 'collapsible-header'
      });
      var postBodyElement = $("<div />", {
        class: 'collapsible-body'
      });

      postHeaderElement.html(postTitle);
      postBodyElement.html(postInnerHTML);

      postListItemElement.append(postHeaderElement);
      postListItemElement.append(postBodyElement);
      postList.append(postListItemElement);
    });

    $(blogPreloaderComponent).fadeOut(1000);
  }).catch(err => {
    console.error(err);
  });


  // Custom materialize.css scripts
  $(".button-collapse").sideNav();
  $("#preloader").fadeOut(500);
  $("#mobile-navbar li").on('click', event => {
    $("#mobile-navbar li a").each((i, el) => {
      var linkedDiv = $(el).attr('href');
      $(linkedDiv).removeClass('active');
      $(linkedDiv).css('display', 'none');
    });

    var targetDiv = $(event.target).attr('href');
    $(targetDiv).addClass('active');
    $(targetDiv).removeAttr('style');

    $(".button-collapse").sideNav('hide');
    $("html, body").animate({
      scrollTop: 0
    });
  });
});
