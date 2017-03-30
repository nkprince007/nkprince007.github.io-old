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

  // Fade out the preloader
  $("#preloader").fadeOut(1000);

  // Nasty tab indicator fix
  $('ul.tabs').tabs();

  // Add submit handler via ajax for contact form
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
      // show success message
      if (data['result'] === 'success') {
        form.trigger('reset');
        form.prepend($("<div />", {
            class: "sucess green-text"
          }).text("My ❤️ just keeps thanking you and thanking you. 😊")
          .fadeOut(5000));
      } else {
        if (data['error'] === "Captcha verification failed!")
          throw new Error("😪 CAPTCHA was put there for a reason!");
        throw new Error("😰 Sorry, your message got lost with the wind!");
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
  // Load deferred styles
  var addStylesNode = $("#deferred-styles");
  var replacement = $("<div />");
  replacement.html(addStylesNode.text());
  $("head").append(replacement);
  addStylesNode.remove();

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
   * Opensource repo parser
   *
   * Author: nkprince007@icloud.com
   */
  const GITHUB_USERNAME = "nkprince007";
  const GITHUB_REPOS_URL = (
    "https://api.github.com/search/repositories" +
    "?q=%20+fork:true+user:" +
    GITHUB_USERNAME);
  const githubDiv = $("#projects .github");

  $.ajax({
    url: GITHUB_REPOS_URL,
    async: true
  }).then(data => {
    var container = $("<div />", {
      class: 'project-container'
    });

    githubDiv.append(
      $("<h4 />", {
        class: "project-banner"
      }).html("GitHub&nbsp;").append($("<i />", {
        class: "fa fa-github"
      })));
    githubDiv.append(container);
    $("#projects .preloader").fadeOut(1000);

    data.items.forEach(repo => {
      /**
       * Properties:
       * - html_url: GitHub repo's URL.
       * - name: Name of the project.
       * - language: Most widely used language.
       * - forks_count: No. of forks.
       * - open_issues_count: No. of open issues.
       * - stargazers_count: No. of stars
       *
       * Optional properties:
       * - description: Description of repository, if any.
       * - homepage: Homepage for the repository, if any.
       */
      var col = $("<div />", {
        class: "col m6 s12 left-align"
      });
      var card = $("<div />", {
        class: "project card hoverable"
      });
      var cardContent = $("<div />", {
        class: "card-content"
      });
      var cardAction = $("<div />", {
        class: "card-action"
      });
      var link = $("<a />", {
        href: repo["homepage"] === null || repo["homepage"] === "" ?
          repo["html_url"] : repo["homepage"],
        target: "_blank"
      });

      cardContent
        .append($("<p />", {
          class: "card-title truncate"
        }).text(repo['name']))
        .append($("<p />", {
          class: "card-description"
        }).text(repo['description']));

      cardAction
        .append($("<span />", {
          class: "chip"
        }).text(repo["language"]))
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-code-fork"></i>&nbsp;' + repo["forks_count"]))
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-bug"></i>&nbsp;' + repo["open_issues_count"]))
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-star"></i>&nbsp;' + repo["stargazers_count"]));

      link.append(cardContent).append(cardAction);
      card.append(link)
      col.append(card);
      container.append(col);
    });
  }).then(() => {
    $(".github .project-container").masonry();
  }).catch(error => {
    console.error(error);
    $("#projects .preloader").fadeOut(1000);
  });

  const GITLAB_READ_ONLY_ACCESS_TOKEN = "FxLtX2xsiY_AhxBSZ2Kx";
  const GITLAB_REPOS_URL = "https://gitlab.com/api/v3/projects";
  const gitlabDiv = $("#projects .gitlab");

  $.ajax({
    url: GITLAB_REPOS_URL,
    data: {
      private_token: GITLAB_READ_ONLY_ACCESS_TOKEN
    },
    async: true
  }).then(repos => {
    var container = $("<div />", {
      class: 'project-container'
    });

    gitlabDiv.append(
      $("<h4 />", {
        class: "project-banner"
      }).html("GitLab&nbsp;").append($("<i />", {
        class: "fa fa-gitlab"
      })));

    gitlabDiv.append(container);
    $("#projects .preloader").fadeOut(1000);

    repos.forEach(repo => {
      /**
       * Properties:
       * - web_url: GitLab repo's URL.
       * - name: Name of the repository.
       * - star_count: No. of stars.
       * - forks_count: No. of forks.
       * - open_issues_count: No. of open issues.
       *
       * Optional properties:
       * - description: Description of the repository, if any.
       */
      var col = $("<div />", {
        class: "col m6 s12 left-align"
      });
      var card = $("<div />", {
        class: "project card hoverable"
      });
      var cardContent = $("<div />", {
        class: "card-content"
      });
      var cardAction = $("<div />", {
        class: "card-action"
      });
      var link = $("<a />", {
        href: repo["web_url"],
        target: "_blank"
      });

      cardContent
        .append($("<p />", {
          class: "card-title"
        }).text(repo["name"]))
        .append($("<p />", {
          class: "card-description"
        }).text(repo["description"]));

      cardAction
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-code-fork"></i>&nbsp;' + repo["forks_count"]))
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-bug"></i>&nbsp;' + repo["open_issues_count"]))
        .append($("<span />", {
          class: "chip"
        }).html('<i class="fa fa-star"></i>&nbsp;' + repo["star_count"]));

      link.append(cardContent).append(cardAction);
      card.append(link)
      col.append(card);
      container.append(col);
    });
  }).then(() => {
    // Enable masonry grid here
    $(".gitlab .project-container").masonry();
  }).catch(error => {
    console.error(error);
    $("#projects .preloader").fadeOut(1000);
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

    var titleElement = $("<h2 />", {
      class: 'title'
    });
    var descriptionElement = $("<h5 />", {
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

      var postList = $(".blog-list");
      var postListItemElement = $("<li />");
      var postHeaderElement = $("<div />", {
        class: 'collapsible-header'
      });
      var postBodyElement = $("<div />", {
        class: 'collapsible-body'
      });

      postHeaderElement.append($("<h5 />", {
        class: "truncate"
      }).text(post.title));
      var postTagsHeaderElement = $("<div />", {
        class: "tags right hide-on-small-only"
      });
      if (Array.isArray(post.category)) {
        post.category.forEach(tag => {
          var chip = $("<span />", {
            class: "chip truncate right"
          }).text(tag);
          postTagsHeaderElement.append(chip);
        });
      } else if (post.category) {
        postTagsHeaderElement.append($("<span />", {
          class: "chip truncate right"
        }).text(post.category));
      }

      postHeaderElement.append(postTagsHeaderElement);
      postBodyElement.html(post.encoded.trimRegex(/<hr>(.*)$/));
      postBodyElement
        .append($("<div />", {
            class: "center ender"
          })
          .append($("<a />", {
            href: post.link
          }).text("View on Medium.com"))
          .append($("<i />", {
            class: "fa fa-circle"
          }))
          .append($("<span />", {
            class: "date"
          }).text(new Date(post.pubDate).toDateString())));

      postListItemElement.append(postHeaderElement);
      postListItemElement.append(postBodyElement);
      postList.append(postListItemElement);
    });

    $(blogPreloaderComponent).fadeOut(1000);
  }).catch(err => {
    console.error(err);
  });

  // Custom materialize.css scripts

  // Navbar settings for mobile
  $(".button-collapse").sideNav({
    menuWidth: '75%',
    closeOnClick: true,
    draggable: true
  });
  $("#mobile-navbar li").on('click', event => {
    var targetDiv = $(event.target).attr('href');
    if ($(targetDiv).hasClass('active'))
      return;

    $("#mobile-navbar li a").each((i, el) => {
      var linkedDiv = $(el).attr('href');
      $(linkedDiv).removeClass('active');
      $(linkedDiv).fadeOut(0);
    });

    $(targetDiv).addClass('active');
    $(targetDiv).fadeIn(500);
    $(".project-container").masonry();
  });

  // Navbar large screen settings
  $("#main-nav li a").on('click', event => {
    var targetDiv = $(event.currentTarget).attr('href');
    if ($(targetDiv).hasClass('active'))
      return;

    $("#main-nav li a:not(#main-nav li a.active)").each((i, el) => {
      var linkedDiv = $(el).attr('href');
      $(linkedDiv).fadeOut(1000);
    });

    $("html, body").animate({
      scrollTop: 0
    });

    $(targetDiv).fadeIn(1000);
    $(".project-container").masonry();
  });
});
