<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
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

$user = requireAdminAuth();

if (!verifyCsrf()) {
    rejectInvalidCsrf();
}

requirePermission('manage_media');

$uploadDir = __DIR__ . '/../../../uploads/media';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    jsonResponse(['success' => false, 'message' => 'Unable to create upload directory.'], 500);
}

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'No file uploaded or upload failed.'], 400);
}

$file = $_FILES['file'];
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'video/mp4' => 'mp4',
    'video/webm' => 'webm',
    'application/pdf' => 'pdf',
];

$detectedMimeType = null;
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo !== false) {
        $detectedMimeType = finfo_file($finfo, $file['tmp_name']) ?: null;
        finfo_close($finfo);
    }
}

$mimeType = $detectedMimeType ?: ($file['type'] ?? '');
if (!isset($allowedMimeTypes[$mimeType])) {
    jsonResponse(['success' => false, 'message' => 'Unsupported file format.'], 415);
}

if ($file['size'] > 20 * 1024 * 1024) {
    jsonResponse(['success' => false, 'message' => 'File size exceeds 20 MB limit.'], 413);
}

$extension = $allowedMimeTypes[$mimeType];
$filename = bin2hex(random_bytes(16)) . '.' . $extension;
$destination = $uploadDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(['success' => false, 'message' => 'Unable to save uploaded file.'], 500);
}

$fileUrl = '/uploads/media/' . basename($destination);
$title = sanitizeText((string) ($_POST['title'] ?? pathinfo($file['name'], PATHINFO_FILENAME)));
$type = sanitizeText((string) ($_POST['type'] ?? 'media'));
$category = sanitizeText((string) ($_POST['category'] ?? 'general'));
$tags = sanitizeText((string) ($_POST['tags'] ?? ''));

$statement = $connection->prepare('INSERT INTO media (title, url, type, category, tags, active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
if (!$statement) {
    jsonResponse(['success' => false, 'message' => 'Unable to prepare media query.'], 500);
}

$active = 1;
$statement->bind_param('ssssis', $title, $fileUrl, $type, $category, $tags, $active);
if (!$statement->execute()) {
    $statement->close();
    jsonResponse(['success' => false, 'message' => 'Unable to save media record.'], 500);
}

$statement->close();
logAdminActivity((string) $user['id'], 'media_upload', $fileUrl);
jsonResponse(['success' => true, 'message' => 'File uploaded successfully.', 'url' => $fileUrl]);
