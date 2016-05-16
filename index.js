$(document).ready(function() {
    let quoteInfo = $('#quote-template').html();
    let template = Handlebars.compile(quoteInfo);
    let quoteData = template({
        name: "Yogi Berra",
        quotes: [{
            quote: "Sometimes you win"
        }, {
            quote: "Sometimes you don't"
        }, {
            quote: "Sometimes you do real well"
        }, {
            quote: "Sometimes you have a thing on your mind...."
        }],
        yogiBio: '<i>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</i>'
    }, {
        data: { //data available to any of the helpers
            lang: "spanish"
        }
    });

    $('.quoteData').html(quoteData);
});
