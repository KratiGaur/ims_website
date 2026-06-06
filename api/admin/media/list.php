<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once __DIR__ . '/../../../config/admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$user = requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $statement = $connection->prepare('SELECT id, title, url, type, category, tags, metadata, active, uploaded_at FROM media ORDER BY uploaded_at DESC');
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
        jsonResponse(['success' => true, 'data' => $items]);
    } catch (Throwable $throwable) {
        error_log('Media list failed: ' . $throwable->getMessage());
        jsonResponse(['success' => false, 'message' => 'Unable to load media items.'], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        jsonResponse(['success' => false, 'message' => 'Invalid CSRF token.'], 403);
    }

    requirePermission('manage_media');
    $payload = getJsonPayload();
    $mediaId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $action = sanitizeText((string) ($payload['action'] ?? ''));

    if ($action === 'delete' && $mediaId > 0) {
        $statement = $connection->prepare('DELETE FROM media WHERE id = ?');
        $statement->bind_param('i', $mediaId);
        $statement->execute();
        $statement->close();
        logAdminActivity((string) $user['id'], 'media_delete', (string) $mediaId);
        jsonResponse(['success' => true, 'message' => 'Media item deleted.']);
    }

    if ($mediaId === 0) {
        jsonResponse(['success' => false, 'message' => 'Media ID is required for updates.'], 422);
    }

    $title = sanitizeText((string) ($payload['title'] ?? ''));
    $category = sanitizeText((string) ($payload['category'] ?? 'general'));
    $tags = sanitizeText((string) ($payload['tags'] ?? ''));
    $active = isset($payload['active']) && $payload['active'] ? 1 : 0;
    $metadata = json_encode($payload['metadata'] ?? []);

    $statement = $connection->prepare('UPDATE media SET title = ?, category = ?, tags = ?, metadata = ?, active = ? WHERE id = ?');
    $statement->bind_param('ssssii', $title, $category, $tags, $metadata, $active, $mediaId);

    if (!$statement->execute()) {
        $statement->close();
        jsonResponse(['success' => false, 'message' => 'Unable to update media item.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'media_update', $title);
    jsonResponse(['success' => true, 'message' => 'Media item saved.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
