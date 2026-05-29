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
    $albumsStatement = $connection->prepare('SELECT id, title, slug, description, cover_url, tags, sort_order, active FROM gallery_albums ORDER BY sort_order ASC');
    $albumsStatement->execute();
    $albumsResult = $albumsStatement->get_result();
    $albums = [];
    while ($album = $albumsResult->fetch_assoc()) {
        $albums[] = [
            'id' => (int) $album['id'],
            'title' => $album['title'],
            'slug' => $album['slug'],
            'description' => $album['description'],
            'cover_url' => $album['cover_url'],
            'tags' => $album['tags'],
            'order' => (int) $album['sort_order'],
            'active' => (bool) $album['active'],
            'items' => [],
        ];
    }
    $albumsStatement->close();

    if (!empty($albums)) {
        $albumIds = array_column($albums, 'id');
        $placeholders = implode(',', array_fill(0, count($albumIds), '?'));
        $types = str_repeat('i', count($albumIds));
        $itemsStatement = $connection->prepare("SELECT id, album_id, title, url, thumbnail_url, media_type, tags, sort_order, active FROM gallery_items WHERE album_id IN ({$placeholders}) ORDER BY sort_order ASC");
        $itemsStatement->bind_param($types, ...$albumIds);
        $itemsStatement->execute();
        $itemsResult = $itemsStatement->get_result();
        while ($item = $itemsResult->fetch_assoc()) {
            foreach ($albums as &$album) {
                if ($album['id'] === (int) $item['album_id']) {
                    $album['items'][] = [
                        'id' => (int) $item['id'],
                        'title' => $item['title'],
                        'url' => $item['url'],
                        'thumbnail_url' => $item['thumbnail_url'],
                        'media_type' => $item['media_type'],
                        'tags' => $item['tags'],
                        'order' => (int) $item['sort_order'],
                        'active' => (bool) $item['active'],
                    ];
                }
            }
        }
        $itemsStatement->close();
    }

    jsonResponse(['success' => true, 'data' => $albums]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_gallery');
    $payload = getJsonPayload();
    $entity = sanitizeText((string) ($payload['entity'] ?? 'album'));
    $id = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($entity === 'album') {
        $title = sanitizeText((string) ($payload['title'] ?? ''));
        $slug = sanitizeText((string) ($payload['slug'] ?? '')) ?: strtolower(preg_replace('/[^a-z0-9]+/i', '-', $title));
        $description = sanitizeText((string) ($payload['description'] ?? ''));
        $coverUrl = sanitizeText((string) ($payload['cover_url'] ?? ''));
        $tags = sanitizeText((string) ($payload['tags'] ?? ''));
        $sortOrder = isset($payload['order']) ? (int) $payload['order'] : 0;
        $active = isset($payload['active']) && $payload['active'] ? 1 : 0;

        if ($title === '') {
            jsonResponse(['success' => false, 'message' => 'Album title is required.'], 422);
        }

        if ($id > 0) {
            $statement = $connection->prepare('UPDATE gallery_albums SET title = ?, slug = ?, description = ?, cover_url = ?, tags = ?, sort_order = ?, active = ? WHERE id = ?');
            $statement->bind_param('sssssiii', $title, $slug, $description, $coverUrl, $tags, $sortOrder, $active, $id);
            $message = 'Album updated.';
        } else {
            $statement = $connection->prepare('INSERT INTO gallery_albums (title, slug, description, cover_url, tags, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $statement->bind_param('ssssiii', $title, $slug, $description, $coverUrl, $tags, $sortOrder, $active);
            $message = 'Album created.';
        }
    } else {
        $albumId = isset($payload['album_id']) ? (int) $payload['album_id'] : 0;
        $title = sanitizeText((string) ($payload['title'] ?? ''));
        $url = sanitizeText((string) ($payload['url'] ?? ''));
        $thumbnailUrl = sanitizeText((string) ($payload['thumbnail_url'] ?? ''));
        $mediaType = sanitizeText((string) ($payload['media_type'] ?? 'image'));
        $tags = sanitizeText((string) ($payload['tags'] ?? ''));
        $sortOrder = isset($payload['order']) ? (int) $payload['order'] : 0;
        $active = isset($payload['active']) && $payload['active'] ? 1 : 0;

        if ($albumId <= 0 || $title === '' || $url === '') {
            jsonResponse(['success' => false, 'message' => 'Album, title, and URL are required.'], 422);
        }

        if ($id > 0) {
            $statement = $connection->prepare('UPDATE gallery_items SET album_id = ?, title = ?, url = ?, thumbnail_url = ?, media_type = ?, tags = ?, sort_order = ?, active = ? WHERE id = ?');
            $statement->bind_param('isssssiii', $albumId, $title, $url, $thumbnailUrl, $mediaType, $tags, $sortOrder, $active, $id);
            $message = 'Gallery item updated.';
        } else {
            $statement = $connection->prepare('INSERT INTO gallery_items (album_id, title, url, thumbnail_url, media_type, tags, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $statement->bind_param('issssiii', $albumId, $title, $url, $thumbnailUrl, $mediaType, $tags, $sortOrder, $active);
            $message = 'Gallery item created.';
        }
    }

    if (!$statement || !$statement->execute()) {
        jsonResponse(['success' => false, 'message' => 'Unable to save gallery item.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'gallery_save', $entity);
    jsonResponse(['success' => true, 'message' => $message]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
