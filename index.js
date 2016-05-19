let breweryList = [];
class Brewery {
    constructor(obj) {
        this.id = obj.id || '';
        if (obj.name == "Main Brewery") {
            this.name = '';
        } else {
            this.name = obj.name;
        }
        this.website = obj.website || '';
        this.type = obj.locationTypeDisplay || '';
        this.street = obj.streetAddress || '';
        this.city = obj.locality || '';
        this.zip = obj.postalCode || '';
        this.phone = obj.phone || '';
        this.latitude = obj.latitude || 'No Latitude';
        this.longitude = obj.longitude || 'No Longitude';
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
        localStorage.clear()

        $.get("https://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=Denver&key=fbb4282721faf956ef728ec873e1cdc8").done(
            function(obj) {
                obj.data.forEach(el => {
                    if (el.website !== '') {
                        breweryList.push(new Brewery(el));
                    }
                });
            }).done(
            function() {
                let counter = 1;
                let carousel = $('#ca-item').html();
                let template = Handlebars.compile(carousel);
                // add all the api data to the carousel
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
                //update slick carousel
                $('.ca-wrapper').slick({
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 3
                });

                //Add in localStorage breweries
                for (let each in localStorage) {
                    let persist = JSON.parse(localStorage.getItem(each));
                    $('.ca-wrapper').slick('slickAdd', persist.div);
                    breweryList.push(persist.obj)
                    counter++;
                }
                // Modal for each brewery when clicked
                let brewModal = $('#brewModal').html();
                let brewTemplate = Handlebars.compile(brewModal);

                $('button#button').on('click', function() {
                    let id = $(this).find('#brewId').text();
                    let obj = breweryList.find(el => {
                        if (el.id == id) return el
                    });
                    //build a template for each modal
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

                // Add event modal to add a brewery
                $('#addEvent').on('click', function() {
                    $('#myModal').modal('show')
                });
                // Put the brewery in the same format as API
                $('form').on('submit', function(event) {
                    event.preventDefault();
                    let userBrewery = {
                        id: counter++,
                        name: $('form #name').val(),
                        brewery: {
                            description: $('form #description').val(),
                            images: {
                                medium: $('form #photo').val()
                            },
                            established: $('form #established').val()
                        },
                        website: $('form #website').val(),
                        locationTypeDisplay: $('form #type').val()
                    };
                    //Add new brewery to the breweryList using constructor
                    breweryList.push(new Brewery(userBrewery));
                    //get the brewery
                    userObj = breweryList[breweryList.length - 1];
                    //fill the template
                    let date = new Date(userObj.established);
                    let year = date.getFullYear();
                    let userObjData = template({
                        title: userObj.name,
                        established: year,
                        type: userObj.type,
                        link: userObj.website,
                        brewId: userObj.id
                    });
                    var div = $('<div>').append(`<div id="no${counter}" class="container outer"></div>`);
                    div.find(`#no${counter}`).html(userObjData);
                    div.find(`#no${counter} .ca-icon`).css('background-image', `url('${userObj.medium}')`);
                    counter++;
                    alert("Brewery is added! \n\n Click the left arrow to see your brewery!")
                    $('#myModal').modal('hide')

                    // Local storage
                    let userID = userObj.id;
                    let userData = {
                        'div': div.html(),
                        'obj': userObj
                    }
                    localStorage.setItem(userID, JSON.stringify(userData))
                        //add user generated Brewery
                    $('.ca-wrapper').slick('slickAdd', div.html());
                });
            }
        );
    });
