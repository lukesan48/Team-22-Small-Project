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

// COMPLETED -> REVIEW; Sign up Function - C
function doSignUp() {

	let firstName = document.getElementById("name1").value;
	let lastName = document.getElementById("name2").value;
	let newLogin = document.getElementById("signUpName").value;
	let password = document.getElementById("signUpPassword").value;
	//	var hash = md5( password );

	document.getElementById("signUpResult").innerHTML = "";

	let tmp = {
		firstName: firstName, lastName: lastName,
		login: newLogin, password: password
	};
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("signUpResult").innerHTML = "User has been added";

				window.location.href = "Contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("signUpResult").innerHTML = err.message;
	}

}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// COMPLETED -> REVIEW; Modify to Add contacts - J
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

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("addContactResult").innerHTML = err.message;
	}

}

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

	const hc1 = document.createElement("th");
	const hc2 = document.createElement("th");
	const hc3 = document.createElement("th");
	const hc4 = document.createElement("th");

	hc1.innerText = "First Name";
	hc2.innerText = "Last Name";
	hc3.innerText = "Phone";
	hc4.innerText = "Email";

	hrow.appendChild(hc1);
	hrow.appendChild(hc2);
	hrow.appendChild(hc3);
	hrow.appendChild(hc4);

	head.appendChild(hrow);

	for (const contact of contacts) {
		const row = document.createElement("tr");

		const c1 = document.createElement("td");
		const c2 = document.createElement("td");
		const c3 = document.createElement("td");
		const c4 = document.createElement("td");

		c1.innerText = contact.FirstName;
		c2.innerText = contact.LastName;
		c3.innerText = contact.Phone;
		c4.innerText = contact.Email;

		row.appendChild(c1);
		row.appendChild(c2);
		row.appendChild(c3);
		row.appendChild(c4);

		body.appendChild(row);
	}
}

function editContact() {
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
function testAdd() {
	let newContact = document.getElementById("tableBody");

	let row = document.createElement("tr");

	let c1 = document.createElement("td");
	let c2 = document.createElement("td");

	let c3 = document.createElement("td");
	let c4 = document.createElement("td");

	let c5 = document.createElement("td");
	let c6 = document.createElement("td");

	c1.innerText = "John"
	c2.innerText = "Doe"
	c3.innerText = "John@Doe.com"
	c4.innerText = "000 000 0000"

	var btn = document.createElement('input');
	btn.type = "button";
	btn.className = "btn";
	btn.value = "Edit";
	c5.appendChild(btn);

	var btn = document.createElement('input');
	btn.type = "button";
	btn.className = "btn";
	btn.value = "Delete";
	c6.appendChild(btn);

	row.appendChild(c1);
	row.appendChild(c2);
	row.appendChild(c3);
	row.appendChild(c4);

	row.appendChild(c5);
	row.appendChild(c6);

	newContact.appendChild(row);

}

function deleteContact() {

}

// DOM events
function init() {
	let login = document.getElementById("loginButton");
	login.addEventListener("click", doLogin);

	let signUp = document.getElementById("signUpButton");
	signUp.addEventListener("click", doSignUp);
	// CRUD operations
	let addNewContact = document.getElementById("addContact");
	addNewContact.addEventListener("click", testAdd);

	let searchNewContact = document.getElementsByClassName("deleteContact");
	searchNewContact.addEventListener("click", searchContact, false);

	let editAContact = document.getElementsByClassName("edit");
	editAContact.addEventListener("click", editContact, false);

	let deleteAContact = document.getElementsByClassName("delete");
	deleteAContact.addEventListener("click", deleteContact, false);
}

window.addEventListener("load", init);
