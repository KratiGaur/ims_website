<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

require_once __DIR__ . '/../../../config/admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$payload = getJsonPayload();
$email = filter_var($payload['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = trim((string) ($payload['password'] ?? ''));

if (!$email || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Email and password are required.'], 422);
}

$statement = $connection->prepare('SELECT id, name, email, password_hash, role_id, status FROM admins WHERE email = ? LIMIT 1');
if (!$statement) {
    jsonResponse(['success' => false, 'message' => 'Unable to prepare query.'], 500);
}

$statement->bind_param('s', $email);
$statement->execute();
$result = $statement->get_result();
$admin = $result->fetch_assoc();
$statement->close();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid login credentials.'], 401);
}

if ((int) $admin['status'] !== 1) {
    jsonResponse(['success' => false, 'message' => 'Account is disabled.'], 403);
}

$userPermissions = fetchUserPermissions((int) $admin['role_id']);

startSecureSession();
// Regenerate session to mitigate session fixation after successful authentication.
if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
}

$_SESSION[AUTH_SESSION_KEY] = [

    'user' => [
        'id' => (int) $admin['id'],
        'name' => $admin['name'],
        'email' => $admin['email'],
        'role_id' => (int) $admin['role_id'],
        'role_name' => getRoleName((int) $admin['role_id']),
        'permissions' => $userPermissions,
    ],
];

logAdminActivity((string) $admin['id'], 'login', 'Successful admin login');

jsonResponse([
    'success' => true,
    'user' => $_SESSION[AUTH_SESSION_KEY]['user'],
    'csrf_token' => getCsrfToken(),
]);

function getRoleName(int $roleId): string
{
    global $connection;
    $statement = $connection->prepare('SELECT name FROM roles WHERE id = ? LIMIT 1');
    if (!$statement) {
        return 'Admin';
    }
    $statement->bind_param('i', $roleId);
    $statement->execute();
    $result = $statement->get_result();
    $role = $result->fetch_assoc();
    $statement->close();
    return $role['name'] ?? 'Admin';
}
