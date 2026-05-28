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

$paperTitle = trim((string) ($payload['paperTitle'] ?? ''));
$authors = trim((string) ($payload['authors'] ?? ''));
$presentingAuthorEmail = trim((string) ($payload['presentingAuthorEmail'] ?? ''));
$category = trim((string) ($payload['category'] ?? ''));
$abstractText = trim((string) ($payload['abstractText'] ?? ''));

if ($paperTitle === '' || $authors === '' || $presentingAuthorEmail === '' || $category === '' || $abstractText === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'All paper submission fields are required.',
    ]);
    exit;
}

if (!filter_var($presentingAuthorEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.',
    ]);
    exit;
}

$statement = $connection->prepare(
    'INSERT INTO paper_submissions (paper_title, authors, presenting_author_email, category, abstract_text) VALUES (?, ?, ?, ?, ?)'
);

if (!$statement) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to prepare paper submission query.',
    ]);
    exit;
}

$statement->bind_param('sssss', $paperTitle, $authors, $presentingAuthorEmail, $category, $abstractText);

if (!$statement->execute()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Paper submission could not be saved.',
    ]);
    $statement->close();
    exit;
}

$statement->close();
$connection->close();

echo json_encode([
    'success' => true,
    'message' => 'Paper submission saved successfully.',
]);
