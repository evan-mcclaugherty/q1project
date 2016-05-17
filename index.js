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
        $.get("https://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=Denver&key=fbb4282721faf956ef728ec873e1cdc8").done(function(obj) {
            obj.data.forEach(el => {
                if (el.website !== '') {
                    breweryList.push(new Brewery(el));
                }
            });
        }).done(
            function() {
                let carousel = $('#ca-item').html();
                let template = Handlebars.compile(carousel);

                // ITERATOR
                function makeIterator(breweryList) {
                    var nextIndex = 0;
                    return {
                        next: function() {
                            return nextIndex < breweryList.length ? {
                                value: breweryList[nextIndex++],
                                done: false
                            } : {
                                done: true
                            };
                        }
                    }
                }
                var brewIterator = makeIterator(breweryList);

                // GENERATOR
                let counter = 1;

                function* carouselMaker() {
                        let next = brewIterator.next();
                        while (!next.done) {
                            let nextBrewery = next.value;
                            let carouselData = template({
                                title: nextBrewery.name,
                                details: nextBrewery.description,
                                description: nextBrewery.description
                            });
                            $('.ca-wrapper').append(`<div id="no${counter}" class="ca-item ca-item-${counter}"></div>`);
                            $(`#no${counter}`).html(carouselData);
                            $(`#no${counter} .ca-icon`).css('background-image', `url('${nextBrewery.medium}')`);
                            counter++;
                            yield
                            next = brewIterator.next();
                        }
                    }
                    // END GENERATOR

                var carouselGenerator = carouselMaker();
                carouselGenerator.next();
                carouselGenerator.next();
                carouselGenerator.next();
                carouselGenerator.next();
                $('#ca-container').contentcarousel();
                $('span.ca-nav-next').click(
                    function() {
                        console.log("WTF????");
                        carouselGenerator.next();
                        $('#ca-container').contentcarousel();
                    });
            }
        )
    })
