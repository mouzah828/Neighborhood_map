var MapViewModel;

// array of Main Airport locations in United Arab Emirates
var Airport_location = [
  {
    title: "Abu Dhabi International Airport",//Airport Location Name
	city:"Abu Dhabi",// city of the Airport
    location: {//latitude and longitude of Airport location
      lat: 24.441938,
      lng: 54.6500736
    }
  },
  {
    title: "Dubai International Airport",
	city:"Dubai",
    location: {
      lat: 25.2531745,
      lng: 55.3634841
    }
  },
  {
    title: "Sharjah International Airport",
	city:"Sharjah",
    location: {
      lat: 25.3284352,
      lng: 55.510069
    }
  },         
  {
    title: "Ras Al Khaimah International Airport",
	city:"Ras Al Khaimah",
    location: {
      lat: 25.6120004,
      lng: 55.9377824
    }
  },
  {
    title: "Fujairah International Airport",
	city:"Fujairah",
    location: {
      lat: 25.360596,
      lng: 55.8550711
    }
  },
  {
    title: "Al Ain International Airport",
	city:"Al Ain",
    location: {
      lat: 24.2546572,
      lng: 55.64480
    }
  }
  
];

// create a map variable that will be used in initMap()
var map;

// create array for listing markers in map
var markers = [];

// initialize map
function initMap() {
	// set a custom style for map attribute
	var custm_map_style = [
          {
            featureType: 'water',
            stylers: [
              { color: '#5E5EFF' }
            ],
			elementType: 'labels.text.fill',
            stylers: [
              { lightness: 30 }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#804000' },
              { weight: 1 },
            ]
          }
        ];	
  // intial map object by set center & zoom & style 
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 23.424076, lng:53.847818 },
    zoom: 7.4,
	styles: custm_map_style,
  });
  
  // create information_Window for airport location
  var information_Window = new google.maps.InfoWindow();

  // loop through all Airport_location array 
  for (j = 0; j < Airport_location.length; j++) {
    (function() {
      var title = Airport_location[j].title;
      var location = Airport_location[j].location;
	  var city=Airport_location[j].city;
      // set marker vaule
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        address: address
      });
      // pushes all locations into markers array
      markers.push(marker);

      MapViewModel.myLocations()[j].marker = marker;

      // add onclick event to open information_Window of the marker.
      marker.addListener("click", function() {
        // show info inside information_Window when clicked
        populateInfoWindow(this, information_Window);
        information_Window.setContent(marker_content_info);
      });
		
		 // change marker color when mouseover
	  	 marker.addListener('mouseover', function() {
			var mouseover_color="636";
        	var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ mouseover_color +
          '|40|_|%E2%80%A2');										  
			this.setIcon(markerImage);
          });
		 // reset marker color to default when mouseout
          marker.addListener('mouseout', function() {
			this.setIcon("");
          });
		  
      //whene the marker is clicked it will populates the information_Window based on the selected location
      function populateInfoWindow(marker, information_Window) {
        // Check the information_Window is opened or not
        if (information_Window.marker != marker) {
          information_Window.marker = marker;
          information_Window.setContent(
            '<div class="title">' +
              marker.title +
              "</div>" +
              marker.marker_content_info
          );
		  
          // sets animation to bounce 2 times when marker is clicked
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2130);
          information_Window.open(map, marker);
          // whene close is clicked clear marker to close the information_Window
          information_Window.addListener("closeclick", function() {
            information_Window.setMarker = null;
          });
        }
      } // end of populateInfoWindow

		//get the current temprature of the location from yahooapis
  		var temprature="unknown";
  		var weather_location_query = "select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + marker.title + "') and u='c'"
  		var queryURL = "https://query.yahooapis.com/v1/public/yql?q=" + weather_location_query + "&format=json";
		$.getJSON(queryURL, function (data) {
  			var results = data.query.results
  			var firstResult = results.channel.item.condition
  			temprature=firstResult.temp;
		})
		
      // populates information_Window of the marker with foursquare api information
      var client_id = "XZ0FQ3TPVH4FIW1Z3JB4S1G552IJTGIGO3CNE4Y3RCSX3R4D";
      var client_secret = "NDZ3ZXEUVAEDEBTGDTUYKUW1GSIL1PPXH35OKWUL4CALTTL5";

      var foursquareUrl = "https://api.foursquare.com/v2/venues/search"; 
      var venue, address, category, foursquareId, marker_content_info;
      $.ajax({
        url: foursquareUrl,
        dataType: "json",
        data: {
          client_id: client_id,
          client_secret: client_secret,
          query: marker.title,  //get quey from marker array 
		  near: city, // provide information near to the city of each airport location 
          v: 20181202 // set Version to the current date
        },
        success: function(data) {
          // get venue info
          venue = data.response.venues[0];
          // get venue address info
          address = venue.location.formattedAddress;
          // show foursquare link for more inforamtion of the selected location
          foursquareId = "https://foursquare.com/v/" + venue.id; 
          marker_content_info =
            "<div class='name'>" +
            "Name: " +
            "<span class='information_txt'>" +
            title +
            "</span></div>" +
            "<div class='address'>" +
            "Location: " +
            "<span class='information_txt'>" +
            address +
            "</span></div>" +
            "<div class='information'>" +
            "More info: " +
            "<a href='" +
            foursquareId +
            "' target='_blank'>" +
            "Click here" +
            "</a></div>"+"<div class='information'>The current temperature is <span class='information_txt'>"+temprature+"</span></div>";
          marker.marker_content_info;
        },
        error: function() {
          marker_content_info =
            "<div class='name'>Data is currently not available. Please try again.</div>";
        }
      });
    })(j);
  } // end of for loop through markers [j]
}

function mapError() {
  alert("Sorry the Map could not be loaded. Please try again later");
}

// creat Location Constructor
var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.location = data.location;
  this.show = ko.observable(true);
};

// define Location using Knockout framework
var AppViewModel = function() {
  var self = this;
  this.myLocations = ko.observableArray();
  this.filteredInput = ko.observable("");
  for (i = 0; i < Airport_location.length; i++) {
    var place = new Location(Airport_location[i]);
    self.myLocations.push(place);
  }
  // filter location based on the user string input in the textbox 
  this.searchFilter = ko.computed(function() {
    var filter = self.filteredInput().toLowerCase(); 
    for (j = 0; j < self.myLocations().length; j++) {
      if (
        self
          .myLocations()
          [j].title.toLowerCase()
          .indexOf(filter) > -1
      ) {
        // show only location list which match user search text
		self.myLocations()[j].show(true); 
		// make the marker visible if it match user search text
        if (self.myLocations()[j].marker) {
          self.myLocations()[j].marker.setVisible(true); 
        }
      } else {
		  // hide both location list and marker which dosnot match user search text
        self.myLocations()[j].show(false); 
        if (self.myLocations()[j].marker) {
          self.myLocations()[j].marker.setVisible(false); 
        }
      }
    }
  });

  //when location from location list is clicked show marker bounces
  this.showLocation = function(locations) {
    google.maps.event.trigger(locations.marker, "click");
  };
};

MapViewModel = new AppViewModel();

ko.applyBindings(MapViewModel);