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
    $pageKey = sanitizeText((string) ($_GET['page_key'] ?? ''));
    if ($pageKey !== '') {
        $statement = $connection->prepare('SELECT id, page_key, title, description, og_title, og_description, og_image_url, keywords, schema_json FROM seo_settings WHERE page_key = ? LIMIT 1');
        $statement->bind_param('s', $pageKey);
        $statement->execute();
        $result = $statement->get_result();
        $row = $result->fetch_assoc();
        $statement->close();
        if (!$row) {
            jsonResponse(['success' => true, 'data' => null]);
        }
        $row['schema_json'] = json_decode($row['schema_json'], true) ?? [];
        jsonResponse(['success' => true, 'data' => $row]);
    }

    $statement = $connection->prepare('SELECT id, page_key, title, description, og_title, og_description, og_image_url, keywords FROM seo_settings ORDER BY page_key ASC');
    $statement->execute();
    $result = $statement->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_seo');
    $payload = getJsonPayload();
    $pageKey = sanitizeText((string) ($payload['page_key'] ?? ''));
    $title = sanitizeText((string) ($payload['title'] ?? ''));
    $description = sanitizeText((string) ($payload['description'] ?? ''));
    $ogTitle = sanitizeText((string) ($payload['og_title'] ?? ''));
    $ogDescription = sanitizeText((string) ($payload['og_description'] ?? ''));
    $ogImageUrl = sanitizeText((string) ($payload['og_image_url'] ?? ''));
    $keywords = sanitizeText((string) ($payload['keywords'] ?? ''));
    $schemaJson = json_encode($payload['schema_json'] ?? []);

    if ($pageKey === '' || $title === '') {
        jsonResponse(['success' => false, 'message' => 'page_key and title are required.'], 422);
    }

    $statement = $connection->prepare(
        'INSERT INTO seo_settings (page_key, title, description, og_title, og_description, og_image_url, keywords, schema_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), og_title = VALUES(og_title), og_description = VALUES(og_description), og_image_url = VALUES(og_image_url), keywords = VALUES(keywords), schema_json = VALUES(schema_json)'
    );
    $statement->bind_param('ssssssss', $pageKey, $title, $description, $ogTitle, $ogDescription, $ogImageUrl, $keywords, $schemaJson);

    if (!$statement->execute()) {
        $statement->close();
        jsonResponse(['success' => false, 'message' => 'Unable to save SEO settings.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'seo_save', $pageKey);
    jsonResponse(['success' => true, 'message' => 'SEO settings saved.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
