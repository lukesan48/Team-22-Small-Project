<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Find if already exists a username w/ the same name
		$sql = "SELECT * FROM Users WHERE Login=?";
		$stmt = $conn->prepare($sql); // Fixed bad syntax here
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();

		// If not, insert into Users table
		if($result->num_rows == 0) {
			$stmt = $conn->prepare("INSERT into Users (firstName, lastName, login, password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();
			returnWithInfo($firstName, $lastName, $stmt->insert_id);

			$stmt->close();
			$conn->close();
		}

		// Else, just don't
		else {
			returnWithError("Username taken");
		}
		


	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
