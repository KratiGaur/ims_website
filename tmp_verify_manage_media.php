<?php
require 'config/database.php';
$res = $connection->query("SELECT p.name, p.label, rp.role_id FROM permissions p LEFT JOIN role_permissions rp ON rp.permission_id = p.id AND rp.role_id = 1 WHERE p.name = 'manage_media' LIMIT 1");
var_export($res ? $res->fetch_assoc() : null);
