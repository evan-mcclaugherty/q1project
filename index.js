$(document).ready(function() {
    let quoteInfo = $('#quote-template').html();

    Handlebars.registerHelper("makeLink", function(text, url) {
        text = Handlebars.Utils.escapeExpression(text);
        url = Handlebars.Utils.escapeExpression(text);
        let theLink = `<a href="${url}">${text}</a>`;
        return new Handlebars.SafeString(theLink);
    });

    Handlebars.registerHelper("sayhello", function(options) {
        switch (options.data.lang) {
            case "spanish":
                return "hola";
                break;
            case "french":
                return "Bonjour";
                break;
            default:
                return "hello";

        }
    });

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
