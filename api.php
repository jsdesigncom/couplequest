<?php
// Configuration
$DB_HOST = 'localhost';
$DB_NAME = 'dbkzisa1vzdqdp';
$DB_USER = 'udwebltpysmov';
$DB_PASS = 'rcgyyoges2lr';
$TABLE_NAME = 'CQUsers';

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to connect to the database
function connect_db($host, $user, $pass, $db_name) {
    $conn = new mysqli($host, $user, $pass, $db_name);
    if ($conn->connect_error) {
        error_log("Database Connection Failed: " . $conn->connect_error);
        return null;
    }
    return $conn;
}

// Function to send JSON response
function send_response($success, $message, $data = null) {
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit();
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, "Invalid request method.");
}

// Get request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['action'])) {
    send_response(false, "Missing action parameter.");
}

$action = $data['action'];

// --- Action Handlers ---

if ($action === 'log_email') {
    if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        send_response(false, "Invalid or missing email parameter.");
    }

    $email = $data['email'];
    $conn = connect_db($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if (!$conn) {
        send_response(false, "Database connection error.");
    }

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("INSERT IGNORE INTO $TABLE_NAME (email) VALUES (?)");
    
    // Check if prepare failed
    if ($stmt === false) {
        error_log("Prepare failed: " . $conn->error);
        send_response(false, "Internal server error during statement preparation.");
    }

    $stmt->bind_param("s", $email);
    
    if ($stmt->execute()) {
        // Check if a row was actually inserted (not ignored due to UNIQUE constraint)
        if ($stmt->affected_rows > 0) {
            send_response(true, "Email logged successfully.");
        } else {
            send_response(true, "Email already exists in log.");
        }
    } else {
        error_log("Execute failed: " . $stmt->error);
        send_response(false, "Failed to log email.");
    }

    $stmt->close();
    $conn->close();

} else {
    send_response(false, "Unknown action: " . $action);
}
?>