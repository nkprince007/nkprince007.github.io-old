$(document).ready(() => {
    $(".button-collapse").sideNav();
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
        $("html, body").animate({ scrollTop: 0 });
    });

    var elements = document.querySelectorAll('[data-chaffle]');
    Array.prototype.forEach.call(elements, el => {
        const chaffle = new Chaffle(el);
        setInterval(() => chaffle.init(), 5000);
    });

    var elements = document.querySelectorAll('[data-juggle]');
    Array.prototype.forEach.call(elements, el => {
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
    $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql',
        data: {
            q: "select * from xml where url='" + blogRSSUrl + "'",
            format: 'json'
        },
    }).then(data => {
        console.log(data);
        const channel = data.query.results.rss.channel;

        const blogDescription = channel.description;
        const channelTitle = channel.image.title;
        const mediumImageUrl = channel.image.url;

        console.log(blogDescription);
        console.log(channelTitle);
        console.log(mediumImageUrl);

        const blogPosts = channel.item;
        blogPosts.forEach(post => {
            console.log(post);
            const postPubDate = post.pubDate;
            const postTags = post.category;
            const postLink = post.link;
            const postInnerHTML = post.encoded;
            const postTitle = post.title;
        });

    }).catch(err => {
        console.error(err);
    });
});
