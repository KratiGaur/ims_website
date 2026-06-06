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
    $statement = $connection->prepare('SELECT id, section_key, title, content, settings, sort_order, active FROM homepage_sections ORDER BY sort_order ASC');
    $statement->execute();
    $result = $statement->get_result();
    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = [
            'id' => (int) $row['id'],
            'key' => $row['section_key'],
            'title' => $row['title'],
            'content' => json_decode($row['content'], true) ?? [],
            'settings' => json_decode($row['settings'], true) ?? [],
            'order' => (int) $row['sort_order'],
            'active' => (bool) $row['active'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $sections]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }

    requirePermission('manage_homepage');

    $payload = getJsonPayload();
    $sectionId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $title = sanitizeText((string) ($payload['title'] ?? ''));
    $content = json_encode($payload['content'] ?? []);
    $settings = json_encode($payload['settings'] ?? []);
    $sortOrder = isset($payload['order']) ? (int) $payload['order'] : 0;
    $active = isset($payload['active']) && $payload['active'] ? 1 : 0;

    if ($title === '') {
        jsonResponse(['success' => false, 'message' => 'Section title is required.'], 422);
    }

    if ($sectionId > 0) {
        $statement = $connection->prepare('UPDATE homepage_sections SET title = ?, content = ?, settings = ?, sort_order = ?, active = ? WHERE id = ?');
        $statement->bind_param('sssiii', $title, $content, $settings, $sortOrder, $active, $sectionId);
        $message = 'Section updated successfully.';
    } else {
        $sectionKey = sanitizeText((string) ($payload['section_key'] ?? 'section_' . time()));
        $statement = $connection->prepare('INSERT INTO homepage_sections (section_key, title, content, settings, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)');
        $statement->bind_param('sssiii', $sectionKey, $title, $content, $settings, $sortOrder, $active);
        $message = 'Section created successfully.';
    }

    if (!$statement || !$statement->execute()) {
        jsonResponse(['success' => false, 'message' => 'Unable to save homepage section.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'homepage_section_save', $title);
    jsonResponse(['success' => true, 'message' => $message]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
