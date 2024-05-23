<?php
    $inData = getRequestInfo();

    $phone = $inData["phone"];
    $email = $inData["email"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userId = $inData["userId"];

    // Database connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Prepare statement
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ?");
        if (!$stmt) {
            returnWithError($conn->error);
        } else {
            $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                // If rows were affected, update was successful
                returnWithSuccess("Contact updated successfully.");
            } else {
                // If no rows were affected, no matching record was found
                returnWithError("No contact found with the given UserID or no changes made.");
            }

            $stmt->close();
        }
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess($msg)
    {
        $retValue = '{"success":"' . $msg . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
