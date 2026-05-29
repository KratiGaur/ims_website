<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once __DIR__ . '/../../config/admin.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

startSecureSession();

if (empty($_SESSION[AUTH_SESSION_KEY]['user'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

jsonResponse([
    'success' => true,
    'user' => $_SESSION[AUTH_SESSION_KEY]['user'],
    'csrf_token' => getCsrfToken(),
]);
