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

function decodeContent(mixed $value): array
{
    if ($value === null || $value === '') {
        return [];
    }

    $decoded = json_decode((string) $value, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['body' => (string) $value];
    }

    return is_array($decoded) ? $decoded : [];
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$pageKey = trim((string) ($_GET['page_key'] ?? ''));

if ($pageKey === '') {
    jsonResponse(['success' => false, 'message' => 'page_key is required.'], 422);
}

$statement = $connection->prepare(
    'SELECT id, block_key, title, content, metadata, sort_order, active
     FROM content_blocks
     WHERE page_key = ? AND active = 1
     ORDER BY sort_order ASC'
);

if (!$statement) {
    jsonResponse(['success' => false, 'message' => 'Unable to prepare content query.'], 500);
}

$statement->bind_param('s', $pageKey);
$statement->execute();
$result = $statement->get_result();

$blocks = [];

while ($row = $result->fetch_assoc()) {
    $blocks[] = [
        'id' => (int) $row['id'],
        'block_key' => $row['block_key'],
        'title' => $row['title'],
        'content' => decodeContent($row['content']),
        'metadata' => json_decode((string) $row['metadata'], true) ?? [],
        'order' => (int) $row['sort_order'],
        'active' => (bool) $row['active'],
    ];
}

$statement->close();

jsonResponse([
    'success' => true,
    'data' => $blocks,
]);
