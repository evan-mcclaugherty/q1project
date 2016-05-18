let breweryList = [];

class Brewery {
    constructor(obj) {
        this.id = obj.id || '';
        if (obj.name == "Main Brewery") {
            this.name = 'No Name';
        } else {
            this.name = obj.name;
        }
        this.website = obj.website || '';
        this.type = obj.locationTypeDisplay || 'No Type';
        this.street = obj.streetAddress || 'No Stree';
        this.city = obj.locality || 'No City';
        this.zip = obj.postalCode || 'No Zip';
        this.phone = obj.phone || 'No Phone';
        this.latitude = obj.latitude || 'No Latitude';
        this.longitude = obj.longitude || 'No Longitude';
        this.description = obj.brewery.description || 'No Description';
        this.established = obj.brewery.established || 'No Established Date';
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
        $.get("https://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=Denver&key=fbb4282721faf956ef728ec873e1cdc8").done(
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
                    let carouselData = template({
                        title: brew.name,
                        established: brew.established,
                        link: `${brew.website}`,
                        description: brew.description,
                        type: brew.type,
                        brewId: brew.id
                    });
                    $('.ca-wrapper').append(`<div id="no${counter}" class="container outer"></div>`);
                    $(`#no${counter}`).html(carouselData);
                    if (brew.medium) {
                        $(`#no${counter} .ca-icon`).css('background-image', `url('${brew.medium}')`);
                    }
                    counter++;
                }

                $('.ca-wrapper').slick({
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 3
                });

                let brewModal = $('#brewModal').html();
                let brewTemplate = Handlebars.compile(brewModal);

                $('.outer').on('click', function() {
                    let id = $(this).find('#brewId').text();
                    let obj = breweryList.find(el => {
                        if (el.id === id) return el
                    });
                    let brewData = brewTemplate({
                        title: obj.name,
                        street: obj.street,
                        city: obj.city,
                        zip: obj.zip,
                        phone: obj.phone,
                        description: obj.description
                    });
                    $('#brewery').html(brewData);
                    $('#brewery').modal('show')
                });

                $('#addEvent').on('click', function() {
                    $('#myModal').modal('show')
                });

                let form = $('form');
                form.on('submit', function(event) {
                    event.preventDefault();
                    $('#myModal').modal('hide')
                });


                // $('.js-add-slide').on('click', function() {   // add slide
                //     slideIndex++;
                //     $('.add-remove').slick('slickAdd', '<div><h3>' + slideIndex + '</h3></div>');
                // });



            }
        );
    });
