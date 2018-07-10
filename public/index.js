//listen for when user submits login form and calls login with the credentials entered on the form
function listenSignIn() {
	$('.signin').submit(function(event) {
		event.preventDefault();
		let userCreds = {
      		username: $(".username").val(),
      		password: $(".password").val()
    	};

    	login(userCreds);
  	});

}

//sends POST request to auth/login
function login(userCreds) {
	console.log(userCreds);
  $.ajax({
    url: "http://localhost:8080/api/auth/login",
    method: "POST",
    data: JSON.stringify(userCreds),
    crossDomain: true,
    contentType: "application/json",
    success: loginSuccess,
   	error: loginFailMessage
  });
}


//if login fails, show warning
function loginFailMessage() {
  $(".loginwarn").html("Login failed. Please try again.");
}


//if login succeeds, create token and call 
function loginSuccess(response) {
  localStorage.setItem("TOKEN", response.authToken);
  newToken();
  showReservationList();
}

//sets up token in header for ajax requests so user can access their account and data
function newToken() {
  $.ajaxSetup({
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("TOKEN")
    }
  });
}

//removes .hidden class so that Current Reservations List is visible
function showReservationList() {
	$('.list-container').removeClass("hidden");
	$('.signin').addClass("hidden");
	getReservationData(generateListItems);
	listenJoinBtn();
}


//GET the user's current reservations
function getReservationData(callback) {
	const settings = {
		url: 'http://localhost:8080/api/current-reservations',
    	method: 'GET',
    	dataType: 'json',
    	success: callback
	}
	$.ajax(settings);
}	


//generate CURRENT RESERVATIONS list items, 
//this is creating a list item for each of the objects in the response
function generateListItems(data) {
	for (let i=0; i<data.length; i++) {		
		const listItem = `<li>${data[i].class}, ${data[i].time}, ${data[i].day}, ${data[i].date}</li>`
		$('.list-placeholder').append(listItem);
		console.log(listItem);
	}
}


//checks if JWT token is already in local storage
function isLoggedIn() {
  return localStorage.getItem("TOKEN");
}

/*
//listen for when user clicks "Log Out", removes JWT token from local storage, and reloads the page
function listenLogout() {
  $(".logout-button").on("click", event => {
    localStorage.removeItem("TOKEN");
    location.reload();
  });
}

*/


var classSchedule = [
		{
			class: "Barre and Center",
			time: "3pm",
			day: "Sunday",
			date: "July 15",
			location: "Moonstar Dance Studio"
		},
		{
			class: "Barre and Center",
			time: "3pm",
			day: "Sunday",
			date: "July 22",
			location: "Moonstar Dance Studio"
		},
		{
			class: "Barre and Center",
			time: "3pm",
			day: "Sunday",
			date: "July 29",
			location: "Moonstar Dance Studio"
		}
	];



//generate form inputs
function generateFormInputs() {
	for (let i=0; i<classSchedule.length; i++) {		
		const input = `<input type="radio" value="${classSchedule[i].class},${classSchedule[i].time},${classSchedule[i].day},${classSchedule[i].date}">${classSchedule[i].class}, ${classSchedule[i].time}, ${classSchedule[i].day}, ${classSchedule[i].date}`
		$('.form-placeholder').append(input);
		console.log(input);
}



}
//listen `join more classes` button
function listenJoinBtn() {
	$('.join-class').on('click', function(event){
		$('.list-container2').html(
			`<form class="class-schedules" action="http://localhost:8080/api/join-a-class" method="post">
			Class Schedule
			<span class="form-placeholder"></span>
			
			<button type="submit">Submit</button>
			</form>`);
	//newToken();
	generateFormInputs();	
	listenSchedSubmit();	
	});

	
}

//
let usersSelection;
//listen class schedule form submit button
function listenSchedSubmit() {
	$('.class-schedules').submit(function(event) {
		event.preventDefault();
		usersSelection = $('input:checked').val().split(',');
		//newToken();

		postUsersSelection(usersSelection);
		console.log(usersSelection);
		

	});
	
}

function postUsersSelection(usersSelection) {
	const obj = {
		"class": usersSelection[0],
		"time": usersSelection[1],
		"day": usersSelection[2],
		"date": usersSelection[3]
	};
	const settings = {
		url: "http://localhost:8080/api/join-a-class",
    	method: "POST",
    	data: JSON.stringify(obj),
    	contentType: "application/json",
    	
    	
	};

	$.ajax(settings);
	console.log(obj);
}






/*
//append new reservation to list??
let listItem = `<li>${classSelection}</li>`;
		$('.list-placeholder').append(listItem);
		$('.class-schedules').remove();
*/

$(listenSignIn);
