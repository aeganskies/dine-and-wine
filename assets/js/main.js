/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

})(jQuery);

// ---------------------------------------------------------------------------------------------

// Get the meal input from the user
function getInputValue(){
	var mealInput = document.getElementById("mealInput").value;
	//readMealData();
	if (!isBlank(mealInput)){
		if(document.getElementById('redWines').checked) {
			mealInput += '1';
		}else if(document.getElementById('whiteWines').checked) {
			mealInput += '2';
		}
		console.log("Meal input: " + mealInput);
		getDataFromPairingAPI(mealInput);
	}else{
		mealInput = document.getElementById("meal_selection").value;
		if(document.getElementById('redWines').checked) {
			mealInput += '1';
		}else if(document.getElementById('whiteWines').checked) {
			mealInput += '2';
		}
		console.log("Meal input (from dropdown): " + mealInput);
		getDataFromPairingAPI(mealInput);
	}
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


function readMealData(){
	fetch('data/generic-food.txt')
	.then(response => response.text())
    .then(data => console.log(data));
}


async function getDataFromPairingAPI(meal){ 
		var pairingUrl = "https://nameless-fjord-05796.herokuapp.com/https://food-wine-pairing-api.herokuapp.com/getpairing/?meal=" + meal;
		if (validateInput(meal)){
			var data = httpGet(pairingUrl, "");
			if (data.includes("DOCTYPE HTML")){
				generateErrorHtmlElements(meal);
			}else{
				const jsonObj = JSON.parse(data);
				generatePairingHtmlElements(meal, jsonObj);
			}
		}else{
			console.log("Invalid meal input entered");
			generateErrorHtmlElements(meal);
		}
}

function validateInput(meal){
	invalidMeals = ['bbb', 'abc', 'ooo', '22lb', 'k2', 'xxx', 'xxxx', '1720', 'xx',
	'zz', 'z', 'zzz', '3', '4', '5', '6', '7', '8', '9', 'asd', 'asdfg', 'qwerty', 'qwe', 'zxc', 'qwer', 'qwert',
	'aa', 'aaa', 'aaaa', 'aaaaa', 'bb', 'bbbb', 'ss', 'sss', 'ssss', 'www', 'wwww', 'qq', 'qqq', 'qqqq',
	'fff', 'ffff', 'ggg', 'gggg', '2', '1'];
	if (meal.charAt(meal.length - 1) == '1' || meal.charAt(meal.length - 1) == '2'){
		strippedMeal = meal.slice(0, -1).toLowerCase();
	}else{
		strippedMeal = meal.toLowerCase();
	}
	if (invalidMeals.includes(strippedMeal) || isBlank(strippedMeal)){
		return false;
	}
	return true;
}


function generateErrorHtmlElements(meal){
	// Make a container element for the list
	if (meal.charAt(meal.length - 1) == '1' || meal.charAt(meal.length - 1) == '2' && meal !== '2' && meal !== '1'){
		meal = meal.slice(0, -1).toLowerCase();
	}
	listContainer = document.createElement("p");
	titleText = document.createElement("h3");
	node = document.createTextNode("Sorry, we couldn't find any pairings for " + meal + ". Try entering the ingredients of the meal seperated with comma, for example: pasta,tomato,cheese,ham.");
	// titleText.appendChild(node);
	listContainer.appendChild(node);
	listContainer.id = "pairing_container";

    // Make the list
    listElement = document.createElement('ol'),
	// Add it to the page
    section = document.getElementById('pairing_div');
	//if (section.getElementsByTagName("li")[0] === undefined) {
	if (document.contains(document.getElementById("pairing_container"))) {
		document.getElementById("pairing_container").remove();
		document.getElementById("pair_br1").remove();
		//document.getElementById("pair_br2").remove();
	}
		lineBreakOne = document.createElement('br');
		//lineBreakTwo = document.createElement('br');
		lineBreakOne.id = "pair_br1";
		//lineBreakTwo.id = "pair_br2";
		section.appendChild(lineBreakOne);
		//section.appendChild(lineBreakTwo);
		section.appendChild(listContainer);
		listContainer.appendChild(listElement);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generatePairingHtmlElements(meal, wines){
	// Make a container element for the list
	listContainer = document.createElement("p");
	titleText = document.createElement("h3");
	boldText = document.createElement("b");
	if (meal.slice(meal.length - 1) == '1' || meal.slice(meal.length - 1) == '2'){
		meal = meal.substring(0, meal.length -1);
	}
	node = document.createTextNode("The top 3 wines for " + capitalizeFirstLetter(meal) + ":");
	boldText.appendChild(node);
	titleText.appendChild(boldText);
	listContainer.appendChild(titleText);
	listContainer.id = "pairing_container";

    // Make the list
    listElement = document.createElement('ol'),
	// Add it to the page
    section = document.getElementById('pairing_div');
	//if (section.getElementsByTagName("li")[0] === undefined) {
	if (document.contains(document.getElementById("pairing_container"))) {
		document.getElementById("pairing_container").remove();
		document.getElementById("pair_br1").remove();
		//document.getElementById("pair_br2").remove();
	}
		lineBreakOne = document.createElement('br');
		//lineBreakTwo = document.createElement('br');
		lineBreakOne.id = "pair_br1";
		//lineBreakTwo.id = "pair_br2";
		section.appendChild(lineBreakOne);
		//section.appendChild(lineBreakTwo);
		section.appendChild(listContainer);
		listContainer.appendChild(listElement);

		// Set up a loop that goes through the items in listItems one at a time
		for (i = 0; i < wines.MESSAGE.length-1; i++) {
			// create an item for each one
			listItem = document.createElement('li');
			// Add the item text
			console.log(wines.MESSAGE[i]);
			if (i == 2) console.log(wines.MESSAGE[i+1]);
			if (i > 0 && wines.MESSAGE[i].split(",")[0].replaceAll(" ", "") == wines.MESSAGE[i-1].split(",")[0].replaceAll(" ", "")
			&& wines.MESSAGE[i].split(",")[0].split(" ").length > 1 && (wines.MESSAGE[i].split(",")[2].includes(wines.MESSAGE[i-1].split(",")[2])
			 || wines.MESSAGE[i-1].split(",")[2].includes(wines.MESSAGE[i].split(",")[2]))) {
				var searchQuery = "https://www.systembolaget.se/sok/?textQuery=" + wines.MESSAGE[3].split(",")[0].replaceAll(" ", "+") + wines.MESSAGE[3].split(",")[1].replaceAll(" ", "+");
				if (wines.MESSAGE[3].split(",")[0].replaceAll(" ", "") == wines.MESSAGE[3].split(",")[1].replaceAll(" ", "")){
					searchQuery = "https://www.systembolaget.se/sok/?textQuery=" + wines.MESSAGE[3].split(",")[0].replaceAll(" ", "+");
				}
				//listItem.innerHTML = "<b> <a href=" + searchQuery + " target='_blank'>" + wines.MESSAGE[i] + "</a></b>";
				listItem.innerHTML = "<u><a href=" + searchQuery + " target='_blank'>" + wines.MESSAGE[3] + "</a></u>";
				// Add listItem to the listElement
				listElement.appendChild(listItem);

			}else{
				var searchQuery = "https://www.systembolaget.se/sok/?textQuery=" + wines.MESSAGE[i].split(",")[0].replaceAll(" ", "+") + wines.MESSAGE[i].split(",")[1].replaceAll(" ", "+");
				if (wines.MESSAGE[i].split(",")[0].replaceAll(" ", "") == wines.MESSAGE[i].split(",")[1].replaceAll(" ", "")){
					searchQuery = "https://www.systembolaget.se/sok/?textQuery=" + wines.MESSAGE[i].split(",")[0].replaceAll(" ", "+");
				}
				//listItem.innerHTML = "<b> <a href=" + searchQuery + " target='_blank'>" + wines.MESSAGE[i] + "</a></b>";
				listItem.innerHTML = "<u><a href=" + searchQuery + " target='_blank'>" + wines.MESSAGE[i] + "</a></u>";
				// Add listItem to the listElement
				listElement.appendChild(listItem);
			}
		}
	//}
}


// ---------------------------------------------------------------------------------------------

// Function called from HTML
async function findBasedOnLocation(){
	getLocation();
}

// Get the user location via geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(printPosition);
  } else { 
    alert("Geolocation is not supported by this browser.");
  }
}

// Print the latitude and longitude of the user location
function printPosition(position) {
	console.log("Lat: " + position.coords.latitude + "\nLong: " + position.coords.longitude);
	getDataFromSystembolaget(position.coords.latitude, position.coords.longitude);
}

// ---------------------------------------------------------------------------------------------

// Find location based on user input (could be city, or some location...)
async function findBasedOnInput(){
	var locationInput = document.getElementById("locationInput").value;
	if (!isBlank(locationInput)){
		console.log("Location input: " + locationInput);
		var mapsData = await getMapsData(locationInput);
		//var position = mapsData.split("google.com\/maps\/api\/staticmap?center=")[1];
		var position = mapsData.split("google.com/maps/api/staticmap?center=")[1].split("&amp")[0];
		var userLat = position.split("%2C")[0];
		var userLong = position.split("%2C")[1];
		console.log(userLat);
		console.log(userLong);
		var url = "https://nameless-fjord-05796.herokuapp.com/https://systembolaget-open-api.herokuapp.com/reservations";
		var data = httpGet(url, key);
		const jsonObj = JSON.parse(data);
		calcShortestStores(jsonObj, userLat, userLong);
	}
}

function getMapsData(location){
	var url = "https://www.google.com/maps?client=firefox-b-d&q=" + location + "&um=1&ie=UTF-8&sa=X&ved=2ahUKEwib2v70wKf3AhXsS_EDHRvBBhsQ_AUoAXoECAIQAw";
	var corsUrl = "https://nameless-fjord-05796.herokuapp.com/"
	return fetch(corsUrl+url)
	.then(response => response.text())
}

// ---------------------------------------------------------------------------------------------

function removeExistingElements(){
    section = document.getElementById('two_inner');
	var child = section.lastElementChild;
	section.removeChild(child);
}

function generateHtmlElements(storesList, distanceList){
	// Make a container element for the list
	listContainer = document.createElement("p");
	titleText = document.createElement("h3");
	boldText = document.createElement("b");
	node = document.createTextNode("The 3 closest Systembolaget stores");
	boldText.appendChild(node);
	titleText.appendChild(boldText);
	listContainer.appendChild(titleText);
	listContainer.id = "sys_container";

    // Make the list
    listElement = document.createElement('ol'),
	// Add it to the page
    section = document.getElementById('two_inner');
	//if (section.getElementsByTagName("li")[0] === undefined) {
	if (document.contains(document.getElementById("sys_container"))) {
		document.getElementById("sys_container").remove();
		//document.getElementById("pair_br1").remove();
		//document.getElementById("pair_br2").remove();
	}
		section.appendChild(listContainer);
		listContainer.appendChild(listElement);

		// Set up a loop that goes through the items in listItems one at a time
		for (i = 0; i < storesList.length; i++) {
			// create an item for each one
			listItem = document.createElement('li');
			var searchQuery = "https://www.google.com/search?q=" + storesList[i].address.replaceAll(" ", "+");
			console.log(storesList[i].address.replaceAll(" ", ""));
			imageSource = storesList[i].address.replaceAll(" ", "") + ".png";
			a = document.createElement('a');
			a.href =  searchQuery;
			a.setAttribute('target', '_blank');
			a.innerHTML = "<img class='image right' src='images/gmaps_images/" + imageSource +  "' data-position='center center'/>";
			listElement.appendChild(a);
 
			// Add the item text
			if (storesList[i].alias == null){
				//listItem.innerHTML = "<b><u> <a href=" + searchQuery + " target='_blank'>" + storesList[i].address + "</a></u></b>";
				listItem.innerHTML = "<u> <a href=" + searchQuery + " target='_blank'>" + storesList[i].address + " (" + distanceList[i] + " km)</a></u>";
			}else{
				//listItem.innerHTML = "<b><u> <a href=" + searchQuery + " target='_blank'>" + storesList[i].address + " (" + storesList[i].alias + ")</a></u></b>";
				listItem.innerHTML = "<u> <a href=" + searchQuery + " target='_blank'>" + storesList[i].address + " (" + storesList[i].alias + ")" + " (" + distanceList[i] + " km)</a></u>";
			}
			for (j = 0; j < 7; j++){
				listItem.appendChild(document.createElement('br'));
				var date = storesList[i].openingHours[j].date;
				date = date.substring(0, date.length - 9) + ": ";
				// Get week day from date
				currDate = new Date(Date.parse(date.substring(0, date.length-2)));
				if (j == 0){
					date = "Today" + " - " + date;
				}else if (j == 1){
					date = "Tomorrow" + " - " + date;
				}else{
					date = currDate.getWeekDay() + " - " + date;
				}
				var from = storesList[i].openingHours[j].openFrom;
				from = from.substring(0, from.length - 3) + " - ";
				var to = storesList[i].openingHours[j].openTo;
				to = to.substring(0, to.length - 3);
				if (from.includes("00:00")){
					listItem.innerHTML += date + "Closed";
				}else{
					listItem.innerHTML += date + from + to;
				}
			}
			listItem.appendChild(document.createElement('br'));
			listItem.appendChild(document.createElement('br'));
			// Add listItem to the listElement
			listElement.appendChild(listItem);
		}

	//}
}

Date.prototype.getWeekDay = function() {
	var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return weekday[this.getDay()];
}

// ---------------------------------------------------------------------------------------------
// Systembolaget API

function calcShortestStores(jsonData, userLat, userLong){
	var currentShortestDist = 10;
	var storeList = [];
	var finalStoreList = [];
	var distanceList = [];

	for (var i = 0; i < jsonData.length; i++){
		//console.log(jsonObj[i].searchArea);
		currentObj = jsonData[i];
		var distDiff = calcCrow(currentObj.position.latitude, currentObj.position.longitude, userLat, userLong);
		if (currentShortestDist == 10){
			storeList.push(currentObj);
			currentShortestDist = distDiff;
		} else{
			if (distDiff <= currentShortestDist && finalStoreList.indexOf(currentObj) == -1){
				storeList.push(currentObj);
				currentShortestDist = distDiff;
			}
		}
	}

	console.log(storeList[storeList.length-1]);
	finalStoreList.push(storeList[storeList.length-1]);
	distance = calcCrow(finalStoreList[0].position.latitude, finalStoreList[0].position.longitude, userLat, userLong);
	distanceList.push(Math.round((distance + Number.EPSILON)*100)/100);
	//console.log("distance: " + calcCrow(finalStoreList[0].position.latitude, finalStoreList[0].position.longitude, userLat, userLong));

	var currentShortestDist = 10;
	var storeList = [];
	for (var i = 0; i < jsonData.length; i++){
		//console.log(jsonObj[i].searchArea);
		currentObj = jsonData[i];
		if (!containsObject(currentObj, finalStoreList)){
			var distDiff = calcCrow(currentObj.position.latitude, currentObj.position.longitude, userLat, userLong);
			if (currentShortestDist == 10){
				storeList.push(currentObj);
				currentShortestDist = distDiff;
			} else{
				if (distDiff <= currentShortestDist && finalStoreList.indexOf(currentObj) == -1){
					storeList.push(currentObj);
					currentShortestDist = distDiff;
				}
			}
		}
	}
	console.log(storeList[storeList.length-1]);
	finalStoreList.push(storeList[storeList.length-1]);
	distance = calcCrow(finalStoreList[1].position.latitude, finalStoreList[1].position.longitude, userLat, userLong);
	distanceList.push(Math.round((distance + Number.EPSILON)*100)/100);
	//console.log("distance: " + calcCrow(finalStoreList[1].position.latitude, finalStoreList[1].position.longitude, userLat, userLong));

	var currentShortestDist = 10;
	var storeList = [];
	for (var i = 0; i < jsonData.length; i++){
		//console.log(jsonObj[i].searchArea);
		currentObj = jsonData[i];
		if (!containsObject(currentObj, finalStoreList)){
			var distDiff = calcCrow(currentObj.position.latitude, currentObj.position.longitude, userLat, userLong);
			if (currentShortestDist == 10){
				storeList.push(currentObj);
				currentShortestDist = distDiff;
			} else{
				if (distDiff <= currentShortestDist && finalStoreList.indexOf(currentObj) == -1){
					storeList.push(currentObj);
					currentShortestDist = distDiff;
				}
			}
		}
	}
	console.log(storeList[storeList.length-1]);
	finalStoreList.push(storeList[storeList.length-1]);
	distance = calcCrow(finalStoreList[2].position.latitude, finalStoreList[2].position.longitude, userLat, userLong);
	distanceList.push(Math.round((distance + Number.EPSILON)*100)/100);
	//console.log("distance: " + calcCrow(finalStoreList[2].position.latitude, finalStoreList[2].position.longitude, userLat, userLong));

	// Generate the list of top 3 closest stores on the web page
	generateHtmlElements(finalStoreList, distanceList);
}


// TODO: use dict to get closest store in a better way
function calcShortestStoresV2(jsonObj, userLat, userLong){

}

const key = "2dba88a49ca946438081881617abf603";
function getDataFromSystembolaget(userLat, userLong){ 
    var url = "https://nameless-fjord-05796.herokuapp.com/https://systembolaget-open-api.herokuapp.com/reservations";
    var data = httpGet(url, key);
	//console.log(data);
	const jsonObj = JSON.parse(data);
	calcShortestStores(jsonObj, userLat, userLong);
	//calcShortestStoresV2(jsonObj, userLat, userLong);
}

function httpGet(url,key){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", url, false);
	// Setting the key isn't needed since the site uses an API that I made for this site specifically which handles the data
	//xmlHttp.setRequestHeader("Ocp-Apim-Subscription-Key", key);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function getDataWithFetch(urlToWake){
	// Fetching via systembolaget directly only works when disabling some network security
	//fetch('https://api-extern.systembolaget.se/site/V2/Store', { 
	fetch(urlToWake, { 
	headers: {
    "Ocp-Apim-Subscription-Key":key,
    'Access-Control-Allow-Origin':'*',
  	},
	method: 'GET',
	//body: null,
//}).then(function (response) { return response.json(); }).then(function (data){console.log(data);});
}).then(function (response) { return response.json(); }).then(function (data){console.log("data fetched");});
}

/**
 * UTIL functions:
 */

// Returning distance between two sets of coordinates 
function calcCrow(lat1, lon1, lat2, lon2) 
{
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
	  if (dLat < 0){
		  dLat = toRad(lat1-lat2);
	  }
      var dLon = toRad(lon2-lon1);
	  if (dLon < 0){
		  dLon = toRad(lon1-lon2);
	  }
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
	return Value * Math.PI / 180;
}

// Check if object exist in list ( I think list.indexOf(element) == -1 does the same thing...)
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

// This is used to "wake the API up at site load"
window.onload = function() {
	getDataWithFetch('https://nameless-fjord-05796.herokuapp.com/https://systembolaget-open-api.herokuapp.com/reservations');
	getDataWithFetch('https://nameless-fjord-05796.herokuapp.com/https://food-wine-pairing-api.herokuapp.com/getpairing/?meal=bolognese');
};

$(document).ready(function(){
	$('#findBasedOnInputBtn').on('touchstart click', function(e){ 
		e.preventDefault();
		findBasedOnInput();
	});
});



// Function for changing images depending on wine selection
function whiteWinesSelected(){
	document.getElementById("wine_type_image").src="images/transparent_white_wine.png";
}

function redWinesSelected(){
	document.getElementById("wine_type_image").src="images/transparent_red_wine.png";
}

function allWinesSelected(){
	document.getElementById("wine_type_image").src="images/transparent_all_wines.png";
}
