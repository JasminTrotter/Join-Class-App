//this file runs the app 

//removes .hidden class so that Current Reservations List is visible
function showReservationList() {
	$('.list-container').removeClass('hidden').addClass('border');
	$('.signin').addClass('hidden');
	getReservationData(generateListItems);
	listenJoinBtn();
}


//GET the user's current reservations
function getReservationData(callback) {
	const userId = localStorage.getItem("userId");
	$.ajax({
		url: '/api/current-reservations/' + userId,
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
		const listItem = `<li class="list-item"><span><b>${data[i].class}</b><br>${data[i].time}, ${data[i].day}, ${data[i].date} </span><button type="button" class="view-deets" id="${data[i].id}">View Details</button><button class="cancel-res" id="${data[i].id}">Cancel Reservation</button></li>`
		$('.reservation-list').append(listItem);
	}
	listenCancelBtn();
	listenDetailsBtn();
}



function refreshReservationList() {
	$('.app-container').find('.reservation-list').empty();
	getReservationData(generateListItems);
	listenJoinBtn();
}

let itemId;
//when user clicks "cancel" button, sends request to delete the list item with that id
function listenCancelBtn() {
	$('.cancel-res').on('click', event => {

		//grab id from the button, which is the same id as the item to be deleted
		itemId = event.currentTarget.id;

		newToken();
		$.ajax({
			url: '/api/current-reservations/' + itemId,
			method: "DELETE",
			success: () => {

				//it would be nice to include in the alert which reservation has been cancelled. Something to add in the future
				alert("You have successfully cancelled your reservation.");
				refreshReservationList();
				$('.deets-container').empty();
			}
		});
		
	});

}

//button will open a details box with class description etc
function listenDetailsBtn() {
	$('.view-deets').on('click',  event => {

		//grab id from the button, which is the same id as the item to be deleted
		 itemId = event.currentTarget.id;
		//const userId = localStorage.getItem("userId");
console.log(itemId);
		//get Details data
		newToken();
		getReservationData(renderDeets);
	});
}

function renderDeets(data) {

	//match the id of the class with the id of the button clicked
	function isItem(items) {
		return items.id == itemId;
	} 

	//find that item with that id within the array of data 
	const winner = data.find(isItem);

	$('deets-container').removeClass('hidden');
	$('.deets-container').html(`<aside><button type="button" class="close-deets close"> X Close</button><ul><h2>Details</h2>
		<li><h3>Class:</h3> ${winner.class}</li>
		<li><h3>Description:</h3> ${winner.description}</li>
		<li><h3>Duration:</h3> ${winner.length}</li>
		</ul></aside>`);
	$('.list-container').addClass('hidden');
	$('.list-container2').addClass('hidden');
	listenCloseDeets();
}

function listenCloseDeets() {
	$('.close-deets').on('click', event => {
		$('.deets-container').empty();
		$('.list-container').removeClass('hidden');
		$('.list-container2').removeClass('hidden');
	});
}


//generate form inputs for user to add a reservation from the form
function generateFormInputs() {
	for (let i=0; i<classSchedule.length; i++) {

		//I am putting `${classSchedule[i].description}%${classSchedule[i].length} on button ID's 
		//so that I can use that to return data for the Class Details button
		const input = `<div class="sched-item">	

			<label for="a${i}" class="sched-label">
			<span class="class-item"><b>${classSchedule[i].class}</b><br>${classSchedule[i].time}, ${classSchedule[i].day}, ${classSchedule[i].date}</span>
			<span class="sched-input"><input id="a${i}" type="radio" value="${classSchedule[i].class}%${classSchedule[i].time}%${classSchedule[i].day}%${classSchedule[i].date}%${classSchedule[i].location}%${classSchedule[i].description}%${classSchedule[i].length}"><span class="select">Select</span></input></span>

			</label>

			<button type="button" class="view-deets-2" id="${classSchedule[i].class}%${classSchedule[i].description}%${classSchedule[i].length}">View Details</button></div>`
		$('#join-form').append(input);
	}
	labelListener();
	listenDetailsBtnFromSched();
}

function labelListener() {
	$('.sched-label').on('click', function(event) {
		$('.sched-label').removeClass('active');
		$(this).addClass('active');
	});

}

//listen for click on `join more classes` button 
//sends a POST request of the selected class
function listenJoinBtn() {
	$('.join-class').on('click', function(event){
		$('.join-class').addClass('hidden');
		$('.list-container2').removeClass('hidden').addClass('border');
		$('.list-container2').html(
			`<button type="button" class="close close-sched"> X Close</button><h2>Class Schedule</h2><p class="info"><em>Select a class from the schedule below <br>Then click "Submit" to add it to your reservations.</em></p>
			<form id="join-form" action="/api/join-a-class" method="post"></form>			
			<button type="submit" form="join-form">Submit</button>`);
		generateFormInputs();	
		listenSchedSubmit();
		listenCloseSched();
		$('.deets-container').empty();	
	});	
}

function listenCloseSched() {
	$('.close-sched').on('click', event => {
		$('.list-container2').addClass('hidden').removeClass('border');
		$('.join-class').removeClass('hidden');
	});
}

function listenDetailsBtnFromSched() {
	$('.view-deets-2').on('click',  event => {

		//grab id from the button, which contains "description" and "length" data to return for the class details
		 deetsWanted = event.currentTarget.id;
		 theDeets = deetsWanted.split('%');

	$('.deets-container').html(`<aside><button type="button" class="close close-deets"> X Close</button><ul><h2>Details</h2>
		<li><h3>Class:</h3>${theDeets[0]}</li>
		<li><h3>Description:</h3>${theDeets[1]}</li>
		<li><h3>Duration:</h3>${theDeets[2]}</li>
		</ul></aside>`);
	$('.list-container').addClass('hidden');
	$('.list-container2').addClass('hidden');
	listenCloseDeets();
	});
}



let usersSelection;

//listen form submit button
function listenSchedSubmit() {
	$('#join-form').submit(function(event) {
		event.preventDefault();

		//making the input an array so it can be converted into an object to send for the POST method
		usersSelection = $('input:checked').val().split('%');

		postUsersSelection(usersSelection);
		resetJoinForm();
		$('.deets-container').empty();
	});
	
}

function postUsersSelection(usersSelection) {

	//taking the array defined above and making it an object to send in the POST
	const obj = {
		"class": usersSelection[0],
		"time": usersSelection[1],
		"day": usersSelection[2],
		"date": usersSelection[3],
		"location": usersSelection[4],
		"description": usersSelection[5],
		"length": usersSelection[6],
		"userId": localStorage.getItem("userId")
	}; 

	const settings = {
		url: "/api/join-a-class",
    	method: "POST",
    	data: JSON.stringify(obj),
    	contentType: "application/json", 	
		success: function() {			
			alert('You have successfully joined ' + usersSelection[0] + ', at ' + usersSelection[1] + ' on ' + usersSelection[2] + ', ' + usersSelection[3] + '.');
			refreshReservationList();
			$('.join-class').removeClass('hidden');
		}
	};

	$.ajax(settings);

}

//reset the Join More Classes form after user submits
function resetJoinForm() {
	$('.list-container2').empty();
	$('.list-container2').removeClass('border').addClass('hidden');
	generateFormInputs();
}



