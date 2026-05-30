<?php
require 'config/database.php';
$res = $connection->query("SELECT p.name FROM permissions p JOIN role_permissions rp ON rp.permission_id=p.id JOIN roles r ON r.id=rp.role_id WHERE r.id=1 ORDER BY p.name");
$rows=[];
while($row=$res->fetch_assoc()){$rows[]=$row['name'];}
var_export($rows);
