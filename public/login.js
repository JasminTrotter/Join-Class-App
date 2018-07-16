//this file handles login and creating new users

//listen for when user submits login form and calls login with the credentials entered on the form
function listenLogin() {
	$('.login-form').submit(event => {
		event.preventDefault();
		let userCreds = {
      		username: $(".username").val(),
      		password: $(".password").val()
    	};

    	login(userCreds);
  	});

}

//If the user has no account yet, this button will take them to a Sign Up form
function listenSignupBtn() {
	$('.signup-button').on('click', event => {
		$('.signup-container').removeClass('hidden');
		$('.login-container').addClass('hidden');
		listenSigninBtn();
		listenSignupForm();
	});
}

//On the Sign Up form page, 
//there is a button for the user to go back to the log in form 
//if they aready have an account (page reloads)
function listenSigninBtn() {
	$('.signin-button').on('click', event => {
		location.reload();
	});
}


//listens for when user submits signup form
function listenSignupForm() {
  $(".signup-form").on("submit", event => {
    event.preventDefault();
    
    let password = $(".new-password").val();
    let username = $(".new-username").val();
    //if password is too short, show warning
    
      let newUserCreds = {
        firstName: $(".firstname").val(),
        lastName: $(".lastname").val(),
        username: username,
        password: password
      };
      createUser(newUserCreds);
    });
}

function createUser(newUserCreds) {
  let userCreds = {
    firstName: newUserCreds.firstName,
    lastName: newUserCreds.lastName,
    username: newUserCreds.username,
    password: newUserCreds.password
  };
  //post new user data
  $.ajax({
    url: "http://localhost:8080/users",
    method: "POST",
    data: JSON.stringify(newUserCreds),
    crossDomain: true,
    contentType: "application/json",
    //on success, call showSuccessBox
    success: () => {
      showSuccessBox(userCreds);
    },
    //if error, call userDuplicate
    error: userDuplicate
  });
}

//warn that username is already taken
function userDuplicate() {
  $(".userwarn").html("Username already taken");
}


//sends POST request to api/auth/login
function login(userCreds) {
	console.log(userCreds);
  $.ajax({
    url: "http://localhost:8080/auth/login",
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
	$('.login-container').remove();
 	localStorage.setItem("TOKEN", response.authToken);
  localStorage.setItem("userId", response.userId);
 	newToken();
 	showReservationList();
  $('.logout-button').removeClass('hidden');
}

//listen for when user clicks "Log Out", removes JWT token from local storage, and reloads the page
function listenLogout() {
  $(".logout-button").on("click", event => {
    localStorage.removeItem("TOKEN");
    location.reload();
  });
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

function handleApp() {
  listenLogin();
  listenSignupBtn();
  listenLogout();
}

$(handleApp);