<?php
require 'config/database.php';
$res = $connection->query("SELECT a.id, a.email, a.role_id, r.name AS role_name, a.status FROM admins a LEFT JOIN roles r ON r.id = a.role_id WHERE a.email='admin@yroc13.com' LIMIT 1");
var_export($res ? $res->fetch_assoc() : null);
