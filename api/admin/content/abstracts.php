<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once __DIR__ . '/../../config/admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$user = requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $connection->prepare('SELECT id, paper_title, authors, presenting_author_email, category, abstract_text, file_url, status, assigned_reviewer, review_comments, created_at, updated_at FROM abstracts ORDER BY created_at DESC');
    $statement->execute();
    $result = $statement->get_result();
    $abstracts = [];
    while ($row = $result->fetch_assoc()) {
        $abstracts[] = [
            'id' => (int) $row['id'],
            'paper_title' => $row['paper_title'],
            'authors' => $row['authors'],
            'presenting_author_email' => $row['presenting_author_email'],
            'category' => $row['category'],
            'abstract_text' => $row['abstract_text'],
            'file_url' => $row['file_url'],
            'status' => $row['status'],
            'assigned_reviewer' => $row['assigned_reviewer'] !== null ? (int) $row['assigned_reviewer'] : null,
            'review_comments' => $row['review_comments'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $abstracts]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_abstracts');
    $payload = getJsonPayload();
    $abstractId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $status = sanitizeText((string) ($payload['status'] ?? ''));
    $reviewComments = sanitizeText((string) ($payload['review_comments'] ?? ''));
    $assignedReviewer = isset($payload['assigned_reviewer']) ? (int) $payload['assigned_reviewer'] : null;

    if ($abstractId <= 0 || $status === '') {
        jsonResponse(['success' => false, 'message' => 'Abstract ID and status are required.'], 422);
    }

    $statement = $connection->prepare('UPDATE abstracts SET status = ?, review_comments = ?, assigned_reviewer = ?, updated_at = NOW() WHERE id = ?');
    $statement->bind_param('ssii', $status, $reviewComments, $assignedReviewer, $abstractId);

    if (!$statement->execute()) {
        $statement->close();
        jsonResponse(['success' => false, 'message' => 'Unable to update abstract.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'abstract_update', (string) $abstractId);
    jsonResponse(['success' => true, 'message' => 'Abstract status updated.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
