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
    $statement = $connection->prepare('SELECT id, full_name, institution, specialization, email, registration_type, payment_status, attendance_status, qr_code, created_at, updated_at FROM registrations ORDER BY created_at DESC');
    $statement->execute();
    $result = $statement->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = [
            'id' => (int) $row['id'],
            'full_name' => $row['full_name'],
            'institution' => $row['institution'],
            'specialization' => $row['specialization'],
            'email' => $row['email'],
            'registration_type' => $row['registration_type'],
            'payment_status' => $row['payment_status'],
            'attendance_status' => $row['attendance_status'],
            'qr_code' => $row['qr_code'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
    }
    $statement->close();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        rejectInvalidCsrf();
    }


    requirePermission('manage_registrations');
    $payload = getJsonPayload();
    $registrationId = isset($payload['id']) ? (int) $payload['id'] : 0;
    $paymentStatus = sanitizeText((string) ($payload['payment_status'] ?? ''));
    $attendanceStatus = sanitizeText((string) ($payload['attendance_status'] ?? ''));
    $qrCode = sanitizeText((string) ($payload['qr_code'] ?? ''));

    if ($registrationId <= 0) {
        jsonResponse(['success' => false, 'message' => 'Registration ID is required.'], 422);
    }

    $statement = $connection->prepare('UPDATE registrations SET payment_status = ?, attendance_status = ?, qr_code = ?, updated_at = NOW() WHERE id = ?');
    $statement->bind_param('sssi', $paymentStatus, $attendanceStatus, $qrCode, $registrationId);

    if (!$statement->execute()) {
        $statement->close();
        jsonResponse(['success' => false, 'message' => 'Unable to update registration.'], 500);
    }

    $statement->close();
    logAdminActivity((string) $user['id'], 'registration_update', (string) $registrationId);
    jsonResponse(['success' => true, 'message' => 'Registration updated.']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
