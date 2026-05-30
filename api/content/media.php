<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once __DIR__ . '/../../config/database.php';

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$statement = $connection->prepare(
    'SELECT id, title, url, type, category, tags, metadata, active, uploaded_at
     FROM media
     WHERE active = 1
     ORDER BY uploaded_at DESC'
);

if (!$statement) {
    jsonResponse(['success' => false, 'message' => 'Unable to prepare media query.'], 500);
}

$statement->execute();
$result = $statement->get_result();

$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'url' => $row['url'],
        'type' => $row['type'],
        'category' => $row['category'],
        'tags' => $row['tags'],
        'metadata' => json_decode((string) $row['metadata'], true) ?? [],
        'active' => (bool) $row['active'],
        'uploaded_at' => $row['uploaded_at'],
    ];
}

$statement->close();

jsonResponse([
    'success' => true,
    'data' => $items,
]);
