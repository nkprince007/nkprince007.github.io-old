var CONTACT_FROM_ELEMENT_IDS = [
  'name',
  'email',
  'message'
]

function enableSend() {
  document.getElementById('send').classList.remove('disabled');
}

function disableSend() {
  document.getElementById('send').classList.add('disabled');
}

$(window).on('load', () => {
  $("#contact-form form").submit(event => {
    event.preventDefault();
    var form = $("#contact-form form");
    var values = form.serializeArray();

    // show a preloader
    $("#contact-form .form-preloader").fadeIn();

    $.ajax({
      url: form.attr('action'),
      method: "POST",
      data: values,
      async: true
    }).then(data => {
      console.log(data);
      // show success message
      if (data['result'] === 'success') {
        form.trigger('reset');
        form.prepend($("<div />", {
          class: "sucess green-text"
        }).text("My ❤️ just keeps thanking you and thanking you. 😊")
          .fadeOut(5000));
      } else {
        throw new Error("😰 Sorry, your message got lost with the wind!")
      }
    }).catch(error => {
      console.error(error);
      form.trigger('reset');

      // show error message
      form.prepend($("<div />", {
        class: "error red-text"
      }).text(error.message).fadeOut(10000));

    }).always(() => {

      grecaptcha.reset();
      // hide the preloader
      $("#contact-form .form-preloader").fadeOut();
    });
  });
});

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
  $("#preloader").fadeOut(1000);

  // Navbar settings for mobile
  $(".button-collapse").sideNav({
    menuWidth: '75%',
    closeOnClick: true,
    draggable: true
  });
  $("#mobile-navbar li").on('click', event => {
    $("#mobile-navbar li a").each((i, el) => {
      var linkedDiv = $(el).attr('href');
      $(linkedDiv).removeClass('active');
      $(linkedDiv).fadeOut(500);
    });

    var targetDiv = $(event.target).attr('href');
    $(targetDiv).addClass('active');
    $(targetDiv).fadeIn(500);
  });

  // Navbar large screen settings
  $("#main-nav li a").on('click', event => {
    $("#main-nav li a").each((i, el) => {
      var linkedDiv = $(el).attr('href');
      $(linkedDiv).fadeOut(1000);
    });

    var targetDiv = $(event.currentTarget).attr('href');
    $(targetDiv).fadeIn(1000);
    $("html, body").animate({
      scrollTop: 0
    });
  });
});
