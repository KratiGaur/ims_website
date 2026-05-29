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
    $statement = $connection->prepare('SELECT id, name, designation, bio, image_url, sort_order, active FROM committee_members ORDER BY sort_order ASC');
    $statement->execute();
    $result = $statement->get_result();
    $members = [];
    while ($row = $result->fetch_assoc()) {
        $members[] = [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'designation' => $row['designation'],
            'bio' => $row['bio'],
            'image_url' => $row['image_url'],
            'order' => (int) $row['sort_order'],
            'active' => (bool) $row['active'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $members]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_committee');
    $payload = getJsonPayload();
    $memberId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $action = sanitizeText((string) ($payload['action'] ?? ''));

    if ($action === 'delete' && $memberId > 0) {
        $statement = $connection->prepare('DELETE FROM committee_members WHERE id = ?');
        $statement->bind_param('i', $memberId);
        $statement->execute();
        $statement->close();
        logAdminActivity((string) $user['id'], 'committee_delete', (string) $memberId);
        jsonResponse(['success' => true, 'message' => 'Committee member removed.']);
    }

    $name = sanitizeText((string) ($payload['name'] ?? ''));
    $designation = sanitizeText((string) ($payload['designation'] ?? ''));
    $bio = sanitizeText((string) ($payload['bio'] ?? ''));
    $imageUrl = sanitizeText((string) ($payload['image_url'] ?? ''));
    $sortOrder = isset($payload['order']) ? (int) $payload['order'] : 0;
    $active = isset($payload['active']) && $payload['active'] ? 1 : 0;

    if ($name === '' || $designation === '') {
        jsonResponse(['success' => false, 'message' => 'Name and designation are required.'], 422);
    }

    if ($memberId > 0) {
        $statement = $connection->prepare('UPDATE committee_members SET name = ?, designation = ?, bio = ?, image_url = ?, sort_order = ?, active = ? WHERE id = ?');
        $statement->bind_param('ssssiii', $name, $designation, $bio, $imageUrl, $sortOrder, $active, $memberId);
        $message = 'Committee member updated.';
    } else {
        $statement = $connection->prepare('INSERT INTO committee_members (name, designation, bio, image_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)');
        $statement->bind_param('sssiii', $name, $designation, $bio, $imageUrl, $sortOrder, $active);
        $message = 'Committee member added.';
    }

    if (!$statement || !$statement->execute()) {
        jsonResponse(['success' => false, 'message' => 'Unable to save committee member.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'committee_save', $name);
    jsonResponse(['success' => true, 'message' => $message]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
