//listen for user to sumbit signin form
function listenSignIn() {
	$('.signin').submit(function(event) {
		event.preventDefault();
		$('.signin').remove();
		generateReservationList();
	});
	
}


//generate reservation list
function generateReservationList() {
	$('.app-container').html(
		`<div class="list-container"><ul class="reservation-list">
		Current Reservations
		<li>Class 1</li>
		<li>Class 2</li>
		<li>Class 3</li>
		<span class="list-placeholder"></span>
		</ul>
		</div>
		<button class="join-class">Join More Classes</button>
		<div class="list-container2">
		
		</div>`
		);
	listenJoinBtn();
}


//listen `join more classes` button
function listenJoinBtn() {
	$('.join-class').on('click', function(event){
		$('.list-container2').html(
			`<form class="class-schedules">
			Class Schedule
			<input type="radio" name="classA" value="Class A">Class A
			<input type="radio" name="classB" value="Class B">Class B
			<input type="radio" name="classC" value="Class C">Class C
			<button type="submit">Submit</button>
			</form>`);
		listenSchedSubmit();
	});
	
	
}


//listen class schedule form submit button
function listenSchedSubmit() {
	$('.class-schedules').submit(function(event) {
		event.preventDefault();
		let classSelection = $('input:checked').val();
		let listItem = `<li>${classSelection}</li>`;
		$('.list-placeholder').append(listItem);
		$('.class-schedules').remove();
		listenJoinBtn();
	});
}


//update reservation list


$(listenSignIn);
