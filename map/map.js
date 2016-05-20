let breweryList = JSON.parse(localStorage.getItem('data'));

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.757857,
            lng: -105.006892
        },
        zoom: 12
    });

    let myLocation = new google.maps.InfoWindow({
        map: map
    });

    // my location here .... kinda useless

    // navigator.geolocation.getCurrentPosition(function(position) {
    //     var pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //     };
    //
    //     myLocation.setPosition(pos);
    //     myLocation.setContent('Find me beer!');
    //     map.setCenter(pos);
    // });

    for (let brewery of breweryList) {
        if (brewery.latitude && brewery.name) {
            let myLatLng = {
                lat: brewery.latitude,
                lng: brewery.longitude
            };
            let contentString = `
            <div class="container infoWindow">
                <h5 class="miniTitle">${brewery.name}</h5>
                <p>${brewery.phone}</p>
                <p>${brewery.street}</p>
                <p><a href="${brewery.website}">Website</a></p>
                <img src="${brewery.medium}" class="mapImage">
            </div>
            `
            let infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            let marker = new google.maps.Marker({
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                title: brewery.name === '' ? brewery.street : brewery.name,
                position: myLatLng,
                icon: "http://icons.iconarchive.com/icons/flat-icons.com/flat/24/Beer-icon.png"
            });
            console.log(marker)
            marker.setMap(map);

            marker.addListener('click', toggleBounce);

            function toggleBounce() {
                infowindow.open(map, marker);
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

        } else {
            continue;
        }
    }
}
