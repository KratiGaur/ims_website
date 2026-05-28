<?php

declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.',
    ]);
    exit;
}

require_once __DIR__ . '/../config/database.php';

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request payload.',
    ]);
    exit;
}

$fullName = trim((string) ($payload['fullName'] ?? ''));
$institution = trim((string) ($payload['institution'] ?? ''));
$specialization = trim((string) ($payload['specialization'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$registrationType = trim((string) ($payload['registrationType'] ?? ''));

if ($fullName === '' || $institution === '' || $specialization === '' || $email === '' || $registrationType === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'All registration fields are required.',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.',
    ]);
    exit;
}

$statement = $connection->prepare(
    'INSERT INTO registrations (full_name, institution, specialization, email, registration_type) VALUES (?, ?, ?, ?, ?)'
);

if (!$statement) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare registration query.',
    ]);
    exit;
}

$statement->bind_param('sssss', $fullName, $institution, $specialization, $email, $registrationType);

if (!$statement->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration could not be saved.',
    ]);
    $statement->close();
    exit;
}

$statement->close();
$connection->close();

echo json_encode([
    'success' => true,
    'message' => 'Registration submitted successfully.',
]);
