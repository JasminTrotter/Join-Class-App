//this file handles login and creating new users

//listen for when user submits login form and calls login with the credentials entered on the form
function listenLogin() {
	$('.login-form').submit(event => {
		event.preventDefault();
		let userCreds = {
      		username: $(".username").val().toLowerCase(),
      		password: $(".password").val()
    	};

    	login(userCreds);
  	});

}

//when user clicks `View Demo` button on homepage, box with demo login creds will open.
function listenDemo() {
  $('.open-demo').on('click', event => {
    $('.demo-container').removeClass('hidden');
    $('.open-demo').addClass('hidden');
    closeDemo();
  });
}

//close Demo login creds box 
function closeDemo() {
  $('.close-demo').on('click', event => {
    $('.demo-container').addClass('hidden');
    $('.open-demo').removeClass('hidden');
    listenDemo();
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
    $(".passwarn").empty();
    $(".userwarn").empty();


    let password = $(".new-password").val();
    let password2 = $(".new-password2").val();
    let username = $(".new-username").val().toLowerCase();

    //signup input validators
    if (password.length < 10) {
      $(".passwarn").html("Password must be at least 10 characters");
    } else if (hasWhiteSpace(username) === true) {
      $(".userwarn").html("Username cannot contain spaces");
    } else if (validEmail(username) === false) {
      $(".userwarn").html("Username must be a vaild email");
    } else if (hasWhiteSpace(password) === true) {
      $(".passwarn").html("Password cannot contain spaces");
    }
    else if(password !== password2) {
      $(".passwarn").html("Passwords don't match!");
    }
    else {
      let newUserCreds = {
        firstName: $(".firstname").val(),
        lastName: $(".lastname").val(),
        username: username,
        password: password
        };
      createUser(newUserCreds);
      }
    });
}

//checks if string has white space
function hasWhiteSpace(string) {
  return string.indexOf(" ") >= 0;
}

function validEmail(string) {
  let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(string);
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
    url: "/users",
    method: "POST",
    data: JSON.stringify(newUserCreds),
    crossDomain: true,
    contentType: "application/json",
    success: () => {
      greetNewUser(userCreds);
    },
    //FIX
    error: userDuplicate
  });
}

//warn that username is already taken
function userDuplicate() {
  $('.userwarn').html('Username already taken');
}


//show welcome message with user's firstname
function greetNewUser(userCreds) {
  let userGreeting = userCreds.firstName;
  $('.signup-form').remove();
  $('.new-user-text').html(userGreeting);
  $('.greeting-box').removeClass('hidden').addClass('border');
  listenFirstLogin(userCreds);

}

//listen for when new user logs in from success box
function listenFirstLogin(newUserCreds) {
  let userCreds = {
    username: newUserCreds.username,
    password: newUserCreds.password
  };
  $('.new-signin').on("click", event => {
    event.preventDefault();
    //call login, passing user's password and username credentials
    login(userCreds);
    $('.signup-container').remove();
  });
}



//sends POST request to api/auth/login
function login(userCreds) {
	console.log(userCreds);
  $.ajax({
    url: "/auth/login",
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
  $(".loginwarn").html("Incorrect username or password.");
}


//if login succeeds, create token and call 
function loginSuccess(response) {
	$('.login-and-demo').remove();
 	localStorage.setItem("TOKEN", response.authToken);
  localStorage.setItem("userId", response.userId);
 	newToken();
 	showReservationList();
  $('.logout-button').removeClass('hidden');
  $('.join-class').removeClass('hidden');
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
  listenDemo();
}

$(handleApp);