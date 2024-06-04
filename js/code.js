const urlBase = 'http://cop4331-22.xyz/LAMPAPI';
// const urlBase = 'http://localhost/Team-22-Small-Project-main-7/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let login = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					console.log(userId);
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "Contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",login=" + login + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	// console.log(data);
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "login") {
			login = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = firstName + " " + lastName + "!";
		document.getElementById("user-first-name").innerHTML = firstName;
		document.getElementById("user-last-name").innerHTML = lastName;
		document.getElementById("user-username").innerHTML = login;
		document.getElementById("full-name").innerHTML = firstName + " " + lastName;
	}
}
// <-------------------- SIGN UP FUNCTION --------------------->
function doSignUp() {
	let firstName = document.getElementById("name1").value;
	let lastName = document.getElementById("name2").value;
	let newLogin = document.getElementById("signUpName").value;
	let password = document.getElementById("signUpPassword").value;

	document.getElementById("signUpResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		login: newLogin,
		password: password
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				setTimeout(window.location.href = "Login.html", 5000);
				document.getElementById("signUpResult").innerHTML = "User has been added!";
				// saveCookie();

			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("signUpResult").innerHTML = err.message;
	}
}

// VALIDATION HELPER FUNCTIONS

const setError = (element, message) => {
	const inputControl = element.parentElement;
	const errorDisplay = inputControl.querySelector('.error');


	errorDisplay.innerHTML = message;
	inputControl.classList.add('error');
	inputControl.classList.remove('success')
}

const setSuccess = element => {
	const inputControl = element.parentElement;
	const errorDisplay = inputControl.querySelector('.error');

	errorDisplay.innerText = '';
	inputControl.classList.add('success');
	inputControl.classList.remove('error');
};

function validateData(string, qNum) {
	let correct;
	let incorrect;
	// FORM INPUTS

	switch (qNum) {
		case 0: // first name
			correct = /^[A-Z][a-z]*$/;
			incorrect = [/\d/, /^[A-Z]/];

			let firstName = document.getElementById('name1');
			if (string.length > 0 && string.match(correct)) {
				setSuccess(firstName);
				return false; // returns false if valid
			}
			else {
				if (string.length == 0) {
					setError(firstName, 'First Name is required');
					return true;
				} else {
					if (string.match(incorrect[0]) && !(string.match(incorrect[1]))) {
						setError(firstName, 'First letter capitalization & letters only');
						return true;
					}
					else if (!(string.match(incorrect[1]))) {
						setError(firstName, 'Capitalize the first letter');
						return true;
					}
					else if (string.match(incorrect[0])) {
						setError(firstName, 'Letters only please');
						return true;
					}
				}
			}
			break;
		case 1: // last name
			correct = /^[A-Z][a-z ']*$/;
			incorrect = [/\d/, /^[A-Z]/];

			let lastName = document.getElementById('name2');
			if (string.length > 0 && string.match(correct)) {
				setSuccess(lastName);
				return false; // returns false if valid
			} else {
				if (string.length == 0) {
					setError(lastName, 'Last Name is required');
					return true;
				} else {
					if (string.match(incorrect[0]) && !(string.match(incorrect[1]))) {
						setError(lastName, 'First letter capitalization & letters only');
						return true;
					}
					else if (!(string.match(incorrect[1]))) {
						setError(lastName, 'Capitalize the first letter!');
						return true;
					}
					else if (string.match(incorrect[0])) {
						setError(lastName, 'Letters, spaces, or apostrophes only');
						return true;
					}
				}
			}
			break;
		case 2: // USERNAME
			let username = document.getElementById('signUpName');
			if (string.length > 0) {
				setSuccess(username);
				return false; // returns false if valid
			} else {
				if (string.length == 0) {
					document.getElementById('user-err').innerText = 'username cannot be empty';
					return true;
				}
			}
			break;
		case 3: // PASSWORD
			correct = /(?=.*?[0-9]).{8,}$/;
			let key_parts = [
				/(?=.*?[0-9])/, // one digit
				/.{8,}$/ // minimum eight in length
			];
			let len = string.length;
			let password = document.getElementById('signUpPassword');
			if (string.length > 0 && correct.test(string)) {
				setSuccess(password);
				return false; // returns false if valid
			} else {
				if (len == 0) {
					setError(password, `<p>Password cannot be empty</p>`);
					return true;
				} else {
					if (!(string.match(key_parts[0])) && !(string.match(key_parts[1]))) {
						setError(password, `<p>Password needs a digit</p>
                                            <p>Password must be 8+ characters</p>`);
						return true;
					}
					else if (!(string.match(key_parts[0]))) {
						setError(password, `<p>Password needs a digit</p>`);
						return true;
					}
					else if (!(string.match(key_parts[1]))) {
						setError(password, `<p>Password must be 8+ characters</p>`);
						return true;
					}
				}
			}
			break;
		default: ;
	}
}

// form setup
function setupForm() {

	let error_array = new Array(); // handles all of the errors found and doesn't submit until valid

	// first question - first name
	document.newUser.fName.onblur = function () {
		error_array["first_name"] = validateData(this.value, 0);
	};

	// second question - last name
	document.newUser.lName.onblur = function () {
		error_array["last_name"] = validateData(this.value, 1);
	};

	// third question - username
	document.newUser.userName.onblur = function () {
		error_array["user_name"] = validateData(this.value, 2);
	};
	// fourth question - password
	document.newUser.password.onblur = function () {
		error_array["password"] = validateData(this.value, 3);
	};

	// submit
	document.newUser.onsubmit = function () {
		if (error_array["first_name"] || error_array["last_name"] || error_array["user_name"] || error_array["password"]) {
			return false;
		} else {
			doSignUp();
			document.getElementById("new-user-inputs").reset();
			return false;
		}
	}

};

// <-------------------- LOUGOUT USER --------------------->
function doLogout() {
	console.log(this.firstName);
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
// <-------------------- ADD (CREATE) CONTACT --------------------->
function addContact() {
	let newFirstName = document.getElementById("addFirstNameText").value;
	let newLastName = document.getElementById("addLastNameText").value;
	let newPhoneNumber = document.getElementById("addPhoneNumberText").value;
	let newEmail = document.getElementById("addEmailText").value;
	document.getElementById("addContactResult").innerHTML = "";

	let tmp = {
		firstName: newFirstName, lastName: newLastName,
		phone: newPhoneNumber, email: newEmail, userId: userId
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("searchContactText").value = newFirstName;
				searchContact();
				document.getElementById("searchContactText").value = "";

				document.getElementById("addContactResult").innerHTML = "Contact has been added!";
				setTimeout(function () {
					document.getElementById("addContactResult").innerHTML = "";
					clearForm();
				}, 3000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("addContactResult").innerHTML = err.message;
	}

}
// ADD CONTACT HELPER FUNCTIONS

function clearForm() {
	let form = document.getElementById("adding-contact");
	form.style.setProperty("content-visibility", "hidden");
	form.style.removeProperty("background-color", "none");
	form.style.removeProperty("border");
	form.style.removeProperty("box-shadow");
	form.style.removeProperty("margin-bottom");
}

function appendContactForm() {

	document.newContact.reset();

	let form = document.getElementById("adding-contact");
	form.style.setProperty("content-visibility", "visible");
	form.style.setProperty("background-color", "white");
	form.style.setProperty("border", "1px solid #05445E");
	form.style.setProperty("box-shadow", "0px 16px 48px 0px rgba(0, 0, 0, 0.6)");
	form.style.setProperty("margin-bottom", "3em");
}
function validateContactData(string, qNum) {
	let correct;
	let incorrect;
	// FORM INPUTS

	switch (qNum) {
		case 0: // first name
			correct = /^[A-Z][a-z]*$/;
			incorrect = [/\d/, /^[A-Z]/];

			let firstName = document.getElementById('addFirstNameText');
			if (string.length > 0 && string.match(correct)) {
				setSuccess(firstName);
				return false; // returns false if valid
			}
			else {
				if (string.length == 0) {
					setError(firstName, 'First Name is required');
					return true;
				} else {
					if (string.match(incorrect[0]) && !(string.match(incorrect[1]))) {
						setError(firstName, 'First letter capitalization & letters only');
						return true;
					}
					else if (!(string.match(incorrect[1]))) {
						setError(firstName, 'Capitalize the first letter');
						return true;
					}
					else if (string.match(incorrect[0])) {
						setError(firstName, 'Letters only please');
						return true;
					}
				}
			}
			break;
		case 1: // last name
			correct = /^[A-Z][a-z ']*$/;
			incorrect = [/\d/, /^[A-Z]/];

			let lastName = document.getElementById('addLastNameText');
			if (string.length > 0 && string.match(correct)) {
				setSuccess(lastName);
				return false; // returns false if valid
			} else {
				if (string.length == 0) {
					setError(lastName, 'Last Name is required');
					return true;
				} else {
					if (string.match(incorrect[0]) && !(string.match(incorrect[1]))) {
						setError(lastName, 'First letter capitalization & letters only');
						return true;
					}
					else if (!(string.match(incorrect[1]))) {
						setError(lastName, 'Capitalize the first letter!');
						return true;
					}
					else if (string.match(incorrect[0])) {
						setError(lastName, 'Letters, spaces, or apostrophes only');
						return true;
					}
				}
			}
			break;
		case 2: // PHONE NUM
			correct = [/^\d{3}\ \d{3}\-\d{4}$/, /[0-9\-\_]+/];
			let currPhone = document.getElementById("addPhoneNumberText");

			if (string.length > 0 && (string.match(correct[0])) && string.match(correct[1])) {
				setSuccess(currPhone);
				return false; // returns false if valid
			} else {
				if (string.length == 0) {
					setError(currPhone, 'Enter a Phone Number');
					return true;
				} else {
					if (!(string.match((correct[0]))) && !(string.match(correct[1]))) {
						setError(currPhone, 'Numbers only -> 012 345-6789');
						return true;
					}
					else if (!(string.match((correct[0])))) {
						setError(currPhone, 'format -> xxx xxx-xxxx');
						return true;
					}
					else if (!(string.match(correct[1]))) {
						setError(currPhone, 'Numbers only');
						return true;
					}
				}
			}
			break;
		case 3: // EMAIL
			correct = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // ex. test@gmail.com
			let parts = [/^[\w-\.]/, // can't be empty before the @ sign
				/@/, // must include @ sign
				/([\w-]+\.)/, // must include a valid email domain -> not empty
				/[\w-]{2,4}$/]; // must a valid domain

			let emailAddress = document.getElementById("addEmailText");

			if (string.length > 0 && (string.match(correct))) {

				setSuccess(emailAddress);
				return false; // returns false if valid
			} else {
				if (string.length == 0) {
					setError(emailAddress, 'Please enter a valid email address')
					return true;
				} else {
					if (!(string.match(parts[0]))) {
						setError(emailAddress, 'Include your email username');
						return true;
					}
					else if (!(string.match(parts[1]))) {
						setError(emailAddress, 'Include an @ sign');
						return true;
					}
					else if (!(string.match(parts[2]))) {
						setError(emailAddress, 'Enter a valid email server');
						return true;
					}
					else if (!(string.match(parts[3]))) {
						setError(emailAddress, 'Must be a valid domain');
						return true;
					}
				}
			}
			break;
		default: ;
	}
}
// form setup
function setupContactForm() {

	let error_array = new Array(); // handles all of the errors found and doesn't submit until valid

	// first question - first name
	document.newContact.newFName.onblur = function () {
		error_array["first_name"] = validateContactData(this.value, 0);
	};

	// second question - last name
	document.newContact.newLName.onblur = function () {
		error_array["last_name"] = validateContactData(this.value, 1);
	};

	// third question - phone
	document.newContact.currPhone.onblur = function () {
		error_array["phone"] = validateContactData(this.value, 2);
	};
	// fourth question - email
	document.newContact.currEmail.onblur = function () {
		error_array["email"] = validateContactData(this.value, 3);
	};

	// submit
	document.newContact.onsubmit = function () {
		if (error_array["first_name"] || error_array["last_name"] || error_array["phone"] || error_array["email"]) {
			return false;
		} else {
			addContact();
			document.getElementById("add-user-inputs").reset();
			return false;
		}
	}
};

// <-------------------- SEARCH (READ) CONTACT(s) --------------------->
function searchContact() {
	let newSearchContact = document.getElementById("searchContactText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	refreshTable();
	let tmp = {
		search: newSearchContact, userId: userId
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				setTimeout(function () {
					document.getElementById("contactSearchResult").innerHTML = "";
				}, 3000);

				let jsonObject = JSON.parse(xhr.responseText);
				showContactTable2(jsonObject.results);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
function changeRow(row) {
	row.className = "confirm-delete";
}
// <-------------------- DELETE CONTACT --------------------->
function deleteContact(button) {
	// Find the parent table row
	let row = button.closest('tr');
	setTimeout(function () {
		row.className = "confirm-delete";
	}, 1);
	// Get the content of the first and second <td> elements
	let firstName = row.cells[0].textContent;
	let lastName = row.cells[1].textContent;


	setTimeout(function () {
		if (confirm('Are you SURE you want to delete ' + firstName + ' ' + lastName + ' from your contact list?')) {
			// Prepare the data to send to the PHP delete page
			let tmp = {
				firstName: firstName,
				lastName: lastName, id: userId
			};
			let jsonPayload = JSON.stringify(tmp);
			let url = urlBase + '/DeleteContact.' + extension;

			let xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			try {
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						document.getElementById("contactSearchResult").innerHTML = "Contact has been DELETED";
						setTimeout(function () {
							document.getElementById("contactSearchResult").innerHTML = "";
						}, 3000);
						row.remove();
					}
				};
				xhr.send(jsonPayload);
			}
			catch (err) {
				document.getElementById("contactSearchResult").innerHTML = err.message;
			}
		} else {

		} row.className = "";
	}, 300)
}


// <-------------------- UPDATE CONTACT --------------------->
function editContact(newContact, oldContact) {
	let tmp = {
		oldName: oldContact.firstName, oldLastName: oldContact.lastName,
		// new info
		firstName: newContact.firstName, lastName: newContact.lastName,
		phone: newContact.phone, email: newContact.email, userId: userId
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact has been EDITED";
				setTimeout(function () {
					document.getElementById("contactSearchResult").innerHTML = "";
				}, 3000);

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

// <----- Helper Functions for EDIT ----->
function editContactForm(button) {

	let row = button.closest('tr');
	let rowID = row.getAttribute('id');

	row.className = "currently-editing";
	const contactTable = document.getElementById(rowID);
	const rowData = document.querySelectorAll("#" + rowID + " td");

	const objData = ['firstName', 'lastName', 'phone', 'email'];
	const oldContact = {};

	rowData.forEach((item, index) => {
		if (index >= objData.length) {
			return;
		}
		oldContact[objData[index]] = item.innerHTML.trim();
	});

	contactTable.innerHTML = '';

	// Create input elements
	const firstNameInput = createInputElement('text', 'First Name', 'newFirstName', oldContact.firstName);
	const lastNameInput = createInputElement('text', 'Last Name', 'newLastName', oldContact.lastName);
	const phoneInput = createInputElement('tel', 'Phone', 'newPhone', oldContact.phone);
	const emailInput = createInputElement('email', 'Email', 'newEmail', oldContact.email);

	// Save button
	let tbody = document.querySelector('.head.table-body'); // Ensure this selector matches your tbody element

	let tr = document.createElement('tr');

	// Create the td with the SVG
	let tdSave = document.createElement('td');
	let svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg3.setAttribute('width', '25');
	svg3.setAttribute('height', '25');
	svg3.setAttribute('viewBox', '0 0 25 25');
	svg3.setAttribute('fill', 'none');
	svg3.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	// Create the first path element
	let path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path1.setAttribute('d', 'M15.1786 0.893066H9.82148C8.83527 0.893066 8.03577 1.69256 8.03577 2.67878V3.57164C8.03577 4.55785 8.83527 5.35735 9.82148 5.35735H15.1786C16.1648 5.35735 16.9643 4.55785 16.9643 3.57164V2.67878C16.9643 1.69256 16.1648 0.893066 15.1786 0.893066Z');
	path1.setAttribute('stroke', 'black');
	path1.setAttribute('stroke-linecap', 'round');
	path1.setAttribute('stroke-linejoin', 'round');

	// Create the second path element
	let path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2.setAttribute('d', 'M17.4107 2.67871H20.0893C20.5629 2.67871 21.0171 2.86685 21.352 3.20173C21.6868 3.53662 21.875 3.99082 21.875 4.46443V22.3216C21.875 22.7951 21.6868 23.2494 21.352 23.5842C21.0171 23.9191 20.5629 24.1073 20.0893 24.1073H4.91071C4.43711 24.1073 3.98291 23.9191 3.64802 23.5842C3.31314 23.2494 3.125 22.7951 3.125 22.3216V4.46443C3.125 3.99082 3.31314 3.53662 3.64802 3.20173C3.98291 2.86685 4.43711 2.67871 4.91071 2.67871H7.58929');
	path2.setAttribute('stroke', 'black');
	path2.setAttribute('stroke-linecap', 'round');
	path2.setAttribute('stroke-linejoin', 'round');

	// Create the third path element
	let path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path3.setAttribute('d', 'M8.92859 16.0715L11.6072 17.8572L16.9643 10.7144');
	path3.setAttribute('stroke', 'black');
	path3.setAttribute('stroke-linecap', 'round');
	path3.setAttribute('stroke-linejoin', 'round');

	// Append paths to the svg
	svg3.appendChild(path1);
	svg3.appendChild(path2);
	svg3.appendChild(path3);

	// Append the svg to the tdSave
	tdSave.appendChild(svg3);

	// Append the tdSave to the tr

	tdSave.addEventListener('click', function () {
		row.className = "";

		const newContact = {
			// new info
			firstName: document.getElementById("newFirstName").value,
			lastName: document.getElementById("newLastName").value,
			phone: document.getElementById("newPhone").value,
			email: document.getElementById("newEmail").value
		};

		// Test
		// console.log('Old Contact:', oldContact);
		// console.log('Updated Contact:', newContact);


		// update table row
		updateTableRow(rowID, newContact);
		editContact(newContact, oldContact); // now call editContact function

	});

	// add to table
	contactTable.appendChild(createTableCell(firstNameInput));
	contactTable.appendChild(createTableCell(lastNameInput));
	contactTable.appendChild(createTableCell(phoneInput));
	contactTable.appendChild(createTableCell(emailInput));
	contactTable.appendChild(createTableCell(tdSave));

}

// creating table cell
function createTableCell(element) {
	const cell = document.createElement('td');
	// cell.className = "currently-editing";
	cell.appendChild(element);
	return cell;
}

// input element for inline editing
function createInputElement(type, placeholder, id, value) {
	const input = document.createElement('input');
	input.setAttribute('type', type);
	input.setAttribute('placeholder', placeholder);
	input.setAttribute('id', id);
	input.value = value || '';

	return input;
}

function updateTableRow(rowID, contact) {
	const contactTable = document.getElementById(rowID);

	// Clear table first
	contactTable.innerHTML = '';

	// Create table cells for each contact property
	for (const prop in contact) {
		const cell = document.createElement('td');
		cell.textContent = contact[prop];
		contactTable.appendChild(cell);
	}

	// Create Edit and Delete buttons
	let td1 = document.createElement('td');
	td1.setAttribute('onclick', 'editContactForm(this)');

	let svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	td1.setAttribute('width', '17');
	svg1.setAttribute('width', '16');
	svg1.setAttribute('height', '16');
	svg1.setAttribute('viewBox', '0 0 16 16');
	svg1.setAttribute('fill', 'none');
	svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	let path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path1.setAttribute('d', 'M6.09965 13.6432L1.19263 15L2.56659 10.1542L11.5519 1.324C11.6534 1.22143 11.7748 1.13994 11.9086 1.0843C12.0425 1.02866 12.1863 1 12.3316 1C12.4768 1 12.6206 1.02866 12.7545 1.0843C12.8883 1.13994 13.0097 1.22143 13.1112 1.324L15.0413 3.24079C15.1435 3.3409 15.2246 3.46001 15.28 3.59122C15.3354 3.72245 15.3639 3.8632 15.3639 4.00536C15.3639 4.14751 15.3354 4.28827 15.28 4.41949C15.2246 4.55072 15.1435 4.66982 15.0413 4.76992L6.09965 13.6432Z');
	path1.setAttribute('stroke', 'black');
	path1.setAttribute('stroke-linecap', 'round');
	path1.setAttribute('stroke-linejoin', 'round');

	svg1.appendChild(path1);
	td1.appendChild(svg1);

	// Create the second td with the SVG and onclick attribute
	let td2 = document.createElement('td');
	td2.setAttribute('onclick', 'deleteContact(this)');
	td2.setAttribute('width', '15');

	let svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg2.setAttribute('width', '14');
	svg2.setAttribute('height', '14');
	svg2.setAttribute('viewBox', '0 0 14 14');
	svg2.setAttribute('fill', 'none');
	svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.setAttribute('clip-path', 'url(#clip0_102_5191)');

	let path2_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2_1.setAttribute('d', 'M1 3.5H13');
	path2_1.setAttribute('stroke', 'black');
	path2_1.setAttribute('stroke-linecap', 'round');
	path2_1.setAttribute('stroke-linejoin', 'round');
	g.appendChild(path2_1);

	let path2_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2_2.setAttribute('d', 'M2.5 3.5H11.5V12.5C11.5 12.7652 11.3946 13.0196 11.2071 13.2071C11.0196 13.3946 10.7652 13.5 10.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5Z');
	path2_2.setAttribute('stroke', 'black');
	path2_2.setAttribute('stroke-linecap', 'round');
	path2_2.setAttribute('stroke-linejoin', 'round');
	g.appendChild(path2_2);

	let path2_3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2_3.setAttribute('d', 'M4.5 3.5V3C4.5 2.33696 4.76339 1.70107 5.23223 1.23223C5.70107 0.763392 6.33696 0.5 7 0.5C7.66304 0.5 8.29893 0.763392 8.76777 1.23223C9.23661 1.70107 9.5 2.33696 9.5 3V3.5');
	path2_3.setAttribute('stroke', 'black');
	path2_3.setAttribute('stroke-linecap', 'round');
	path2_3.setAttribute('stroke-linejoin', 'round');
	g.appendChild(path2_3);

	let path2_4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2_4.setAttribute('d', 'M5.5 6.50146V10.503');
	path2_4.setAttribute('stroke', 'black');
	path2_4.setAttribute('stroke-linecap', 'round');
	path2_4.setAttribute('stroke-linejoin', 'round');
	g.appendChild(path2_4);

	let path2_5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path2_5.setAttribute('d', 'M8.5 6.50146V10.503');
	path2_5.setAttribute('stroke', 'black');
	path2_5.setAttribute('stroke-linecap', 'round');
	path2_5.setAttribute('stroke-linejoin', 'round');
	g.appendChild(path2_5);

	svg2.appendChild(g);

	let clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
	clipPath.setAttribute('id', 'clip0_102_5191');

	let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('width', '14');
	rect.setAttribute('height', '14');
	rect.setAttribute('fill', 'white');
	clipPath.appendChild(rect);

	svg2.appendChild(clipPath);
	td2.appendChild(svg2);

	// Append buttons to the table row
	contactTable.appendChild(td1);
	contactTable.appendChild(td2);
}


/// TESTTT
function showContactTable2(contacts) {

	const tbody = document.getElementById("contact-body");
	let dataID = 0;

	for (let contact of contacts) {

		let tr = document.createElement('tr');
		tr.setAttribute("id", "data-row-" + dataID++);

		let tdFirstName = document.createElement("td");
		let tdLastName = document.createElement("td");
		let tdPhone = document.createElement("td");
		let tdEmail = document.createElement("td");

		tdFirstName.innerText = contact.FirstName;
		tdLastName.innerText = contact.LastName;
		tdPhone.innerText = contact.Phone;
		tdEmail.innerText = contact.Email;

		// Create the first td with the SVG and onclick attribute
		let td1 = document.createElement('td');
		td1.setAttribute('onclick', 'editContactForm(this)');
		td1.setAttribute('width', '17');
		let svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg1.setAttribute('width', '16');
		svg1.setAttribute('height', '16');
		svg1.setAttribute('viewBox', '0 0 16 16');
		svg1.setAttribute('fill', 'none');
		svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

		let path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path1.setAttribute('d', 'M6.09965 13.6432L1.19263 15L2.56659 10.1542L11.5519 1.324C11.6534 1.22143 11.7748 1.13994 11.9086 1.0843C12.0425 1.02866 12.1863 1 12.3316 1C12.4768 1 12.6206 1.02866 12.7545 1.0843C12.8883 1.13994 13.0097 1.22143 13.1112 1.324L15.0413 3.24079C15.1435 3.3409 15.2246 3.46001 15.28 3.59122C15.3354 3.72245 15.3639 3.8632 15.3639 4.00536C15.3639 4.14751 15.3354 4.28827 15.28 4.41949C15.2246 4.55072 15.1435 4.66982 15.0413 4.76992L6.09965 13.6432Z');
		path1.setAttribute('stroke', 'black');
		path1.setAttribute('stroke-linecap', 'round');
		path1.setAttribute('stroke-linejoin', 'round');

		svg1.appendChild(path1);
		td1.appendChild(svg1);

		// Create the second td with the SVG and onclick attribute
		let td2 = document.createElement('td');
		td2.setAttribute("onclick", "deleteContact(this)");
		td2.setAttribute('width', '15');

		let svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg2.setAttribute('width', '14');
		svg2.setAttribute('height', '14');
		svg2.setAttribute('viewBox', '0 0 14 14');
		svg2.setAttribute('fill', 'none');
		svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

		let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		g.setAttribute('clip-path', 'url(#clip0_102_5191)');

		let path2_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2_1.setAttribute('d', 'M1 3.5H13');
		path2_1.setAttribute('stroke', 'black');
		path2_1.setAttribute('stroke-linecap', 'round');
		path2_1.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path2_1);

		let path2_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2_2.setAttribute('d', 'M2.5 3.5H11.5V12.5C11.5 12.7652 11.3946 13.0196 11.2071 13.2071C11.0196 13.3946 10.7652 13.5 10.5 13.5H3.5C3.23478 13.5 2.98043 13.3946 2.79289 13.2071C2.60536 13.0196 2.5 12.7652 2.5 12.5V3.5Z');
		path2_2.setAttribute('stroke', 'black');
		path2_2.setAttribute('stroke-linecap', 'round');
		path2_2.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path2_2);

		let path2_3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2_3.setAttribute('d', 'M4.5 3.5V3C4.5 2.33696 4.76339 1.70107 5.23223 1.23223C5.70107 0.763392 6.33696 0.5 7 0.5C7.66304 0.5 8.29893 0.763392 8.76777 1.23223C9.23661 1.70107 9.5 2.33696 9.5 3V3.5');
		path2_3.setAttribute('stroke', 'black');
		path2_3.setAttribute('stroke-linecap', 'round');
		path2_3.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path2_3);

		let path2_4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2_4.setAttribute('d', 'M5.5 6.50146V10.503');
		path2_4.setAttribute('stroke', 'black');
		path2_4.setAttribute('stroke-linecap', 'round');
		path2_4.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path2_4);

		let path2_5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2_5.setAttribute('d', 'M8.5 6.50146V10.503');
		path2_5.setAttribute('stroke', 'black');
		path2_5.setAttribute('stroke-linecap', 'round');
		path2_5.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path2_5);

		svg2.appendChild(g);

		let clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
		clipPath.setAttribute('id', 'clip0_102_5191');

		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('width', '14');
		rect.setAttribute('height', '14');
		rect.setAttribute('fill', 'white');
		clipPath.appendChild(rect);

		svg2.appendChild(clipPath);
		td2.appendChild(svg2);

		tr.appendChild(tdFirstName);
		tr.appendChild(tdLastName);
		tr.appendChild(tdPhone);
		tr.appendChild(tdEmail);
		tr.appendChild(td1);
		tr.appendChild(td2);

		tbody.appendChild(tr);
	}
}

// refresh table button works
function refreshTable() {
	let table = document.getElementById("contact-body");

	while (table.firstChild) {
		table.removeChild(table.firstChild);
	}
	clearForm();
}
function isSafari() {
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function disableSafariAnimations() {
	if (isSafari()) {
		var elements = document.querySelectorAll('.color-left, .color-bottom, .color-right');
		elements.forEach(function (element) {
			element.style.animation = 'none';
			element.style.webkitAnimation = 'none';
		});
	}
}

window.addEventListener("load", setupForm, false);
window.addEventListener("load", setupContactForm, false);