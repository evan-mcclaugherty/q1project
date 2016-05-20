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

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        myLocation.setPosition(pos);
        myLocation.setContent('Find me beer!');

        let lat = myLocation.getPosition().lat();
        let lng = myLocation.getPosition().lng();
        let get = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyAHZi4zP3zyhCUMgU81JvNlaQKBRWNMgPg";
        $.get(get).done(
            function(data) {
                $(".currentLocation").append($("<option></option>").val(data).html("Current Location"));
            }
        )
    });

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
            var markerArray = []
            markerArray.push(marker);
            marker.setMap(map);

            marker.addListener('click', toggleBounce);


            let get = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + brewery.latitude + "," + brewery.longitude + "&key=AIzaSyAHZi4zP3zyhCUMgU81JvNlaQKBRWNMgPg";
            $.get(get).done(
                function(data) {
                    $(".addLocations").append($(`<option>${marker.title}</option>`).val(data));
                    console.log(data);
                }
            )

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

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;

    // Display the route between the initial start and end selections.
    calculateAndDisplayRoute(
        directionsDisplay, directionsService, markerArray, stepDisplay, map);
    // Listen to change events from the start and end lists.
    var onChangeHandler = function() {
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}




function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
            document.getElementById('warnings-panel').innerHTML =
                '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}
