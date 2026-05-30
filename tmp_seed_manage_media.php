<?php
require 'config/database.php';
$permissionName = 'manage_media';
$permissionLabel = 'Manage Media';
$roleId = 1;

$statement = $connection->prepare('INSERT IGNORE INTO permissions (name, label) VALUES (?, ?)');
$statement->bind_param('ss', $permissionName, $permissionLabel);
$statement->execute();
$statement->close();

$statement = $connection->prepare('SELECT id FROM permissions WHERE name = ? LIMIT 1');
$statement->bind_param('s', $permissionName);
$statement->execute();
$result = $statement->get_result();
$permission = $result->fetch_assoc();
$statement->close();

if (!$permission) {
    echo "permission insert failed\n";
    exit(1);
}

$permissionId = (int) $permission['id'];
$statement = $connection->prepare('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)');
$statement->bind_param('ii', $roleId, $permissionId);
$statement->execute();
$statement->close();

echo "granted\n";
