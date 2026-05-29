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

function decodeContent($value)
{
    if ($value === null || $value === '') {
        return [];
    }
    $decoded = json_decode($value, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return ['body' => (string) $value];
    }
    return $decoded;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pageKey = sanitizeText((string) ($_GET['page_key'] ?? ''));
    if ($pageKey === '') {
        jsonResponse(['success' => false, 'message' => 'page_key is required.'], 422);
    }

    $statement = $connection->prepare('SELECT id, block_key, title, content, metadata, sort_order, active FROM content_blocks WHERE page_key = ? ORDER BY sort_order ASC');
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
            'metadata' => json_decode($row['metadata'], true) ?? [],
            'order' => (int) $row['sort_order'],
            'active' => (bool) $row['active'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $blocks]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_content');
    $payload = getJsonPayload();
    $pageKey = sanitizeText((string) ($payload['page_key'] ?? ''));
    $title = sanitizeText((string) ($payload['title'] ?? ''));
    $blockKey = sanitizeText((string) ($payload['block_key'] ?? ''));
    $contentValue = $payload['content'] ?? [];
    $metadataValue = $payload['metadata'] ?? [];
    $sortOrder = isset($payload['order']) ? (int) $payload['order'] : 0;
    $active = isset($payload['active']) && $payload['active'] ? 1 : 0;
    $blockId = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($pageKey === '' || $title === '') {
        jsonResponse(['success' => false, 'message' => 'page_key and title are required.'], 422);
    }

    if ($blockKey === '') {
        $blockKey = 'block_' . time();
    }

    if (!is_array($contentValue)) {
        $contentValue = ['body' => sanitizeText((string) $contentValue)];
    }

    $content = json_encode($contentValue);
    $metadata = json_encode(is_array($metadataValue) ? $metadataValue : ['value' => sanitizeText((string) $metadataValue)]);

    if ($blockId > 0) {
        $statement = $connection->prepare('UPDATE content_blocks SET title = ?, content = ?, metadata = ?, sort_order = ?, active = ? WHERE id = ? AND page_key = ?');
        $statement->bind_param('sssiiis', $title, $content, $metadata, $sortOrder, $active, $blockId, $pageKey);
        $message = 'Content block updated successfully.';
    } else {
        $statement = $connection->prepare('INSERT INTO content_blocks (page_key, block_key, title, content, metadata, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $statement->bind_param('sssssii', $pageKey, $blockKey, $title, $content, $metadata, $sortOrder, $active);
        $message = 'Content block created successfully.';
    }

    if (!$statement || !$statement->execute()) {
        jsonResponse(['success' => false, 'message' => 'Unable to save content block.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'content_block_save', $title);
    jsonResponse(['success' => true, 'message' => $message]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
