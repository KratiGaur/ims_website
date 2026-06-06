<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once __DIR__ . '/../../../config/admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$user = requireAdminAuth();

$countQuery = function (string $table): int {
    global $connection;
    $statement = $connection->prepare("SELECT COUNT(*) AS total FROM {$table}");
    $statement->execute();
    $result = $statement->get_result()->fetch_assoc();
    $statement->close();
    return (int) ($result['total'] ?? 0);
};

$data = [
    'labels' => [
        'registrations' => 'Registrations',
        'abstracts' => 'Abstract submissions',
        'active_media' => 'Active media items',
        'pending_reviews' => 'Under review',
    ],
    'values' => [
        'registrations' => $countQuery('registrations'),
        'abstracts' => $countQuery('paper_submissions'),
        'active_media' => $countQuery('media'),
        'pending_reviews' => $countQuery('abstract_reviews'),
    ],
];

jsonResponse(['success' => true, 'data' => $data]);
