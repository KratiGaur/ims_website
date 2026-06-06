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
    $statement = $connection->prepare('SELECT id, config_key, config_value FROM settings ORDER BY config_key ASC');
    $statement->execute();
    $result = $statement->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = [
            'id' => (int) $row['id'],
            'key' => $row['config_key'],
            'value' => json_decode($row['config_value'], true) ?? $row['config_value'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        jsonResponse(['success' => false, 'message' => 'Invalid CSRF token.'], 403);
    }

    requirePermission('manage_settings');
    $payload = getJsonPayload();
    $key = sanitizeText((string) ($payload['key'] ?? ''));
    $value = $payload['value'] ?? null;

    if ($key === '' || $value === null) {
        jsonResponse(['success' => false, 'message' => 'Key and value are required.'], 422);
    }

    $statement = $connection->prepare('INSERT INTO settings (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)');
    $jsonValue = json_encode($value);
    $statement->bind_param('ss', $key, $jsonValue);

    if (!$statement->execute()) {
        $statement->close();
        jsonResponse(['success' => false, 'message' => 'Unable to save setting.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'setting_save', $key);
    jsonResponse(['success' => true, 'message' => 'Setting saved.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
