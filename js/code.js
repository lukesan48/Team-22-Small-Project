const urlBase = 'http://www.cop4331-22.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
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

				window.location.href = "color.html";
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
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
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}
// <-------------------- SIGN UP FUNCTION --------------------->
// COMPLETED; Sign up Function - C
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
				saveCookie();

			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("signUpResult").innerHTML = err.message;
	}
}

// <-------------------- LOUGOUT USER --------------------->
function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
// <-------------------- ADD (CREATE) CONTACT --------------------->
// COMPLETED; Modify to Add contacts - J
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
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
				setTimeout(function () {
					document.getElementById("addContactResult").innerHTML = "";
				}, 3000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("addContactResult").innerHTML = err.message;
	}

}
// <-------------------- SEARCH (READ) CONTACT(s) --------------------->
// COMPLETED -> REVIEW; Modify to search contacts - J
function searchContact() {
	let newSearchContact = document.getElementById("searchContactText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

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
				showContactTable(jsonObject.results);
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function showContactTable(contacts) {

	const contactTable = document.getElementById("contactTable");
	contactTable.innerHTML = "";

	const head = document.createElement("thead");
	const body = document.createElement("tbody");

	contactTable.appendChild(head);
	contactTable.appendChild(body);

	const hrow = document.createElement("tr");

	// Changed to have only one column
	const hc1 = document.createElement("th");
	const hc2 = document.createElement("th");
	const hc3 = document.createElement("th");
	const hc4 = document.createElement("th");

	hc1.innerText = "Name";
	hc2.innerText = "Phone";
	hc3.innerText = "Email";
	hc4.innerText = "Action";

	hc1.setAttribute("colspan", "2");
	hc4.setAttribute("colspan", "2");

	hrow.appendChild(hc1);
	hrow.appendChild(hc2);
	hrow.appendChild(hc3);
	hrow.appendChild(hc4);

	head.appendChild(hrow);
	let dataID = 0;
	for (let contact of contacts) {

		const row = document.createElement("tr");

		row.setAttribute("id", "data-row-" + dataID++);

		const c1 = document.createElement("td");
		const c2 = document.createElement("td");
		const c3 = document.createElement("td");
		const c4 = document.createElement("td");
		const c5 = document.createElement("td");
		const c6 = document.createElement("td");

		// edit and delete buttons

		c1.innerText = contact.FirstName;
		c2.innerText = contact.LastName;
		c3.innerText = contact.Phone;
		c4.innerText = contact.Email;

		var editButton = document.createElement("button");
		editButton.setAttribute("class", "editBtn");
		editButton.setAttribute("onclick", "editContactForm(this)");
		editButton.innerHTML = "edit";

		var deleteButton = document.createElement("button");
		deleteButton.setAttribute("class", "deleteBtn");
		deleteButton.setAttribute("onclick", "deleteContact(this)");
		deleteButton.innerHTML = "delete";

		c5.appendChild(editButton);
		c6.appendChild(deleteButton);
		row.appendChild(c1);
		row.appendChild(c2);
		row.appendChild(c3);
		row.appendChild(c4);
		row.appendChild(c5);
		row.appendChild(c6);

		body.appendChild(row);
	}
}
// <-------------------- DELETE CONTACT --------------------->
function deleteContact(button) {
	// Find the parent table row
	let row = button.closest('tr');

	// Get the content of the first and second <td> elements
	let firstName = row.cells[0].textContent;
	let lastName = row.cells[1].textContent;

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
	}
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
	const saveButton = document.createElement('button');
	saveButton.setAttribute('type', 'button');
	saveButton.setAttribute('id', 'saveButton');
	saveButton.setAttribute('colspan', '2');
	saveButton.textContent = 'save'; //replace with image

	saveButton.addEventListener('click', function () {
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
	contactTable.appendChild(createTableCell(saveButton));

}

// creating table cell
function createTableCell(element) {
	const cell = document.createElement('td');
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
	var editButton = document.createElement("button");
	editButton.setAttribute("class", "editBtn");
	editButton.setAttribute("onclick", "editContactForm(this)");
	editButton.innerHTML = "edit";

	var deleteButton = document.createElement("button");
	deleteButton.setAttribute("class", "deleteBtn");
	deleteButton.setAttribute("onclick", "deleteContact(this)");
	deleteButton.innerHTML = "delete";

	// Append buttons to the table row
	contactTable.appendChild(editButton);
	contactTable.appendChild(deleteButton);
}





