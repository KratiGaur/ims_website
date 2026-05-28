<?php

declare(strict_types=1);

$dbHost = 'localhost';
$dbName = 'yroc13';
$dbUser = 'root';
$dbPass = '';

$connection = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($connection->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.',
    ]);
    exit;
}

$connection->set_charset('utf8mb4');
