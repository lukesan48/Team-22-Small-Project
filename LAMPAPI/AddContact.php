<?php

	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    // $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        $stmt = $conn->prepare("INSERT into Contacts (firstName, lastName, phone, email, UserId) VALUES(?, ?, ?, ?, ?)");
        // $stmt = $conn->prepare("INSERT into Contacts (name, phone, email, UserId) VALUES(?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		// $stmt->bind_param("sssi", $name, $phone, $email, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
