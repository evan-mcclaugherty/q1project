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
