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

$albumsStatement = $connection->prepare(
    'SELECT id, title, slug, description, cover_url, tags, sort_order, active
     FROM gallery_albums
     WHERE active = 1
     ORDER BY sort_order ASC'
);

if (!$albumsStatement) {
    jsonResponse(['success' => false, 'message' => 'Unable to prepare gallery query.'], 500);
}

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

    $itemsStatement = $connection->prepare(
        "SELECT id, album_id, title, url, thumbnail_url, media_type, tags, sort_order, active
         FROM gallery_items
         WHERE active = 1 AND album_id IN ({$placeholders})
         ORDER BY sort_order ASC"
    );

    if ($itemsStatement) {
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
                    break;
                }
            }
            unset($album);
        }

        $itemsStatement->close();
    }
}

jsonResponse([
    'success' => true,
    'data' => $albums,
]);
