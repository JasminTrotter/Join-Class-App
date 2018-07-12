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
		},
		{
			class: "A",
			time: "A",
			day: "A",
			date: "A",
			location: "A"
		},
		{
			class: "B",
			time: "B",
			day: "B",
			date: "B",
			location: "B"
		},
		{
			class: "C",
			time: "C",
			day: "C",
			date: "C",
			location: "C"
		}
	];



//listen for when user submits login form and calls login with the credentials entered on the form
function listenSignIn() {
	$('.signin').submit(event => {
		event.preventDefault();
		let userCreds = {
      		username: $(".username").val(),
      		password: $(".password").val()
    	};

    	login(userCreds);
  	});

}

//sends POST request to api/auth/login
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
	$.ajax({
		url: 'http://localhost:8080/api/current-reservations',
    	method: 'GET',
    	dataType: 'json',
    	success: callback
	});
}	




//generate CURRENT RESERVATIONS list items, 
//this is creating a list item for each of the objects in the response, 
//and appending them to the Current Reservations list
function generateListItems(data) {
	for (let i=0; i<data.length; i++) {		
		const listItem = `<li class="list-item">${data[i].class}, ${data[i].time}, ${data[i].day}, ${data[i].date} <button class="cancel-res" id="${data[i].id}">Cancel</button></li>`
		$('.reservation-list').append(listItem);
		console.log(listItem);
		//listenCancelBtn();
	}
	listenCancelBtn();
}



function refreshReservationList() {
	$('.app-container').find('.reservation-list').empty();
	getReservationData(generateListItems);
	listenJoinBtn();
}


//when user clicks "cancel" button, sends request to delete the list item with that id
function listenCancelBtn() {
	$('.cancel-res').on('click', event => {

		//grab id from the button, which is the same id as the item to be deleted
		const itemId = event.currentTarget.id;

		newToken();
		$.ajax({
			url: 'http://localhost:8080/api/current-reservations/' + itemId,
			method: "DELETE",
			success: () => {
				refreshReservationList();
			}
		});
		
	});

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
}*/





//generate form inputs
function generateFormInputs() {
	for (let i=0; i<classSchedule.length; i++) {		
		const input = `<input type="radio" value="${classSchedule[i].class},${classSchedule[i].time},${classSchedule[i].day},${classSchedule[i].date}">${classSchedule[i].class}, ${classSchedule[i].time}, ${classSchedule[i].day}, ${classSchedule[i].date}`
		$('#join-form').append(input);
		console.log(input);
	}
}

//listen for click on `join more classes` button 
//sends a POST request of the selected class
function listenJoinBtn() {
	$('.join-class').on('click', function(event){
		//refreshReservationList();

		$('.list-container2').html(
			`<h2>Class Schedule</h2>
			<form id="join-form" action="http://localhost:8080/api/join-a-class" method="post"></form>			
			<button type="submit" form="join-form">Join This Class</button>`);
	//newToken();
	generateFormInputs();	
	listenSchedSubmit();	
	});

	
}

let usersSelection;

//listen form submit button
function listenSchedSubmit() {
	$('#join-form').submit(function(event) {
		event.preventDefault();

		//making the input an array so it can be converted into an object to send for the POST method
		usersSelection = $('input:checked').val().split(',');
		//newToken();

		postUsersSelection(usersSelection);

		//refreshReservationList()
		$('.app-container').find('.reservation-list').empty();
		getReservationData(generateListItems);
		listenJoinBtn();

		resetJoinForm();
	});
	
}

function postUsersSelection(usersSelection) {

	//taking the array defined above and making it an object to send in the POST
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
    	success: alert('You have successfully joined ' + usersSelection[0] + ', at ' + usersSelection[1] + ' on ' + usersSelection[2] + ', ' + usersSelection[3] + '.')  	
	};

	$.ajax(settings);
	//refreshReservationList();
}

//reset the Join More Classes form after user submits
function resetJoinForm() {
	$('.list-container2').empty();
	generateFormInputs();
}



$(listenSignIn);
