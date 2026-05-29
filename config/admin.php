<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';

const AUTH_SESSION_KEY = 'admin_auth';
const CSRF_SESSION_KEY = 'csrf_token';

function sendAdminCorsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin === '') {
        return;
    }

    $allowedPattern = '#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#i';

    if (!preg_match($allowedPattern, $origin)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

sendAdminCorsHeaders();

function startSecureSession(): void
{
    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');

    if (!headers_sent()) {
        $isHttps = (
            (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off')
            || (($_SERVER['SERVER_PORT'] ?? '') == '443')
        );

        if ($isHttps) {
            ini_set('session.cookie_secure', '1');
        }
    }

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function getJsonPayload(): array
{
    $payload = json_decode(file_get_contents('php://input'), true);
    return is_array($payload) ? $payload : [];
}

function getCsrfToken(): string
{
    startSecureSession();

    if (empty($_SESSION[CSRF_SESSION_KEY])) {
        $_SESSION[CSRF_SESSION_KEY] = bin2hex(random_bytes(24));
    }

    return $_SESSION[CSRF_SESSION_KEY];
}

function verifyCsrf(): bool
{
    startSecureSession();

    if (!isset($_SESSION[CSRF_SESSION_KEY])) {
        return false;
    }

    $headers = function_exists('getallheaders') ? getallheaders() : [];

    $token =
        $headers['X-CSRF-Token']
        ?? $headers['x-csrf-token']
        ?? $_SERVER['HTTP_X_CSRF_TOKEN']
        ?? '';

    return is_string($token)
        && hash_equals($_SESSION[CSRF_SESSION_KEY], $token);
}

function rejectInvalidCsrf(): void
{
    jsonError('Invalid CSRF token', [], 403);
}

function jsonError(string $message, array $errors = [], int $statusCode = 400): void
{
    jsonResponse([
        'success' => false,
        'message' => $message,
        'errors' => $errors
    ], $statusCode);
}

function jsonSuccess(string $message, array $data = [], int $statusCode = 200): void
{
    jsonResponse([
        'success' => true,
        'message' => $message,
        'data' => $data
    ], $statusCode);
}

function isJsonRequest(): bool
{
    return isset($_SERVER['HTTP_ACCEPT'])
        && str_contains((string) $_SERVER['HTTP_ACCEPT'], 'application/json');
}

function requireAdminAuth(): array
{
    startSecureSession();

    // Idle timeout handling (30 mins)
    $idleSeconds = 1800;

    $now = time();

    $last = $_SESSION[AUTH_SESSION_KEY]['last_activity'] ?? 0;

    if ($last > 0 && ($now - (int) $last) > $idleSeconds) {

        $_SESSION = [];

        if (ini_get('session.use_cookies')) {

            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();

        jsonError('Authentication required.', [], 401);
    }

    if (
        empty($_SESSION[AUTH_SESSION_KEY])
        || empty($_SESSION[AUTH_SESSION_KEY]['user'])
    ) {
        jsonError('Authentication required.', [], 401);
    }

    $_SESSION[AUTH_SESSION_KEY]['last_activity'] = $now;

    return $_SESSION[AUTH_SESSION_KEY]['user'];
}

function requirePermission(string $permission): void
{
    $user = requireAdminAuth();

    if (!in_array($permission, $user['permissions'] ?? [], true)) {
        jsonResponse([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }
}

function logAdminActivity(string $adminId, string $event, ?string $details = null): void
{
    global $connection;

    $statement = $connection->prepare(
        'INSERT INTO activity_logs (admin_id, event, details) VALUES (?, ?, ?)'
    );

    if ($statement) {
        $statement->bind_param('iss', $adminId, $event, $details);
        $statement->execute();
        $statement->close();
    }
}

function fetchUserPermissions(int $roleId): array
{
    global $connection;

    $statement = $connection->prepare(
        'SELECT p.name
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role_id = ?'
    );

    if (!$statement) {
        return [];
    }

    $statement->bind_param('i', $roleId);
    $statement->execute();

    $result = $statement->get_result();

    $permissions = [];

    while ($row = $result->fetch_assoc()) {
        $permissions[] = $row['name'];
    }

    $statement->close();

    return $permissions;
}

function sanitizeText(string $input): string
{
    return trim(
        htmlspecialchars(
            $input,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        )
    );
}
