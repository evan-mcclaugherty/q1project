let breweryList = [];

class Brewery {
    constructor(obj) {
        this.id = obj.id || '';
        if (obj.name == "Main Brewery") {
            this.name = '';
        } else {
            this.name = obj.name || '';
        }
        this.website = obj.website || '';
        this.type = obj.locationTypeDisplay || '';
        this.street = obj.streetAddress || '';
        this.city = obj.locality || '';
        this.zip = obj.postalCode || '';
        this.phone = obj.phone || '';
        this.latitude = obj.latitude || '';
        this.longitude = obj.longitude || '';
        this.description = obj.brewery.description || '';
        this.established = obj.brewery.established || '';
        if (obj.brewery.images) {
            this.icon = obj.brewery.images.icon || '';
            this.large = obj.brewery.images.large || '';
            this.medium = obj.brewery.images.medium || '';
            this.squareLarge = obj.brewery.images.squareLarge || '';
            this.squareMedium = obj.brewery.images.squareLarge || '';
        }
    }
}

$(document).ready(
    function() {
        $.get("http://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=Denver&key=fbb4282721faf956ef728ec873e1cdc8").done(
            function(obj) {
                obj.data.forEach(el => {
                    if (el.website !== '') {
                        breweryList.push(new Brewery(el));
                    }
                });
            }).done(
            function() {
                let carousel = $('#ca-item').html();
                let template = Handlebars.compile(carousel);
                let counter = 1;
                for (let brew of breweryList) {
                    console.log(brew.name)
                    let carouselData = template({
                        title: brew.name,
                        details: brew.description,
                        description: brew.description
                    });
                    $('.ca-wrapper').append(`<div id="no${counter}" class="ca-item ca-item-${counter}"></div>`);
                    $(`#no${counter}`).html(carouselData);
                    $(`#no${counter} .ca-icon`).css('background-image', `url('${brew.medium}')`);
                    counter++;
                }
                $('#ca-container').contentcarousel();
            }
        );
    });
