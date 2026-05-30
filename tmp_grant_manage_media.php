<?php
require 'config/database.php';
$permissionName = 'manage_media';
$roleId = 1;
$statement = $connection->prepare('SELECT id FROM permissions WHERE name = ? LIMIT 1');
$statement->bind_param('s', $permissionName);
$statement->execute();
$result = $statement->get_result();
$permission = $result->fetch_assoc();
$statement->close();
if (!$permission) { echo "missing permission\n"; exit(1); }
$permissionId = (int) $permission['id'];
$statement = $connection->prepare('SELECT 1 FROM role_permissions WHERE role_id = ? AND permission_id = ? LIMIT 1');
$statement->bind_param('ii', $roleId, $permissionId);
$statement->execute();
$result = $statement->get_result();
$exists = $result->fetch_assoc();
$statement->close();
if (!$exists) {
  $statement = $connection->prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)');
  $statement->bind_param('ii', $roleId, $permissionId);
  $statement->execute();
  $statement->close();
  echo "added\n";
} else {
  echo "already present\n";
}
