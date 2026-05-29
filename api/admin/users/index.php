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

function mapAdmin(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role_id' => (int) $row['role_id'],
        'status' => (int) $row['status'],
        'last_login' => $row['last_login'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['roles'])) {
        $statement = $connection->prepare('SELECT id, name, description FROM roles ORDER BY name ASC');
        $statement->execute();
        $result = $statement->get_result();
        $roles = [];
        while ($row = $result->fetch_assoc()) {
            $roles[] = $row;
        }
        $statement->close();
        jsonResponse(['success' => true, 'data' => $roles]);
    }

    $statement = $connection->prepare('SELECT id, name, email, role_id, status, last_login, created_at, updated_at FROM admins ORDER BY name ASC');
    $statement->execute();
    $result = $statement->get_result();
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = mapAdmin($row);
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $admins]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        jsonResponse(['success' => false, 'message' => 'Invalid CSRF token.'], 403);
    }

    requirePermission('manage_users');
    $payload = getJsonPayload();
    $adminId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $name = sanitizeText((string) ($payload['name'] ?? ''));
    $email = filter_var($payload['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $roleId = isset($payload['role_id']) ? (int) $payload['role_id'] : 0;
    $status = isset($payload['status']) && $payload['status'] ? 1 : 0;
    $password = trim((string) ($payload['password'] ?? ''));

    if ($name === '' || !$email || $roleId <= 0) {
        jsonResponse(['success' => false, 'message' => 'Name, email, and role are required.'], 422);
    }

    if ($adminId > 0) {
        if ($password !== '') {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $statement = $connection->prepare('UPDATE admins SET name = ?, email = ?, password_hash = ?, role_id = ?, status = ?, updated_at = NOW() WHERE id = ?');
            $statement->bind_param('sssiii', $name, $email, $passwordHash, $roleId, $status, $adminId);
        } else {
            $statement = $connection->prepare('UPDATE admins SET name = ?, email = ?, role_id = ?, status = ?, updated_at = NOW() WHERE id = ?');
            $statement->bind_param('ssiii', $name, $email, $roleId, $status, $adminId);
        }
        $message = 'Admin user updated.';
    } else {
        if ($password === '') {
            jsonResponse(['success' => false, 'message' => 'Password is required for a new admin user.'], 422);
        }
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $statement = $connection->prepare('INSERT INTO admins (name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)');
        $statement->bind_param('sssii', $name, $email, $passwordHash, $roleId, $status);
        $message = 'Admin user created.';
    }

    if (!$statement || !$statement->execute()) {
        jsonResponse(['success' => false, 'message' => 'Unable to save admin user.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'user_save', $email);
    jsonResponse(['success' => true, 'message' => $message]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
