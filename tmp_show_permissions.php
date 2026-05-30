<?php
require 'config/database.php';
$res = $connection->query('SHOW COLUMNS FROM permissions');
$rows=[];
while($row=$res->fetch_assoc()){$rows[]=$row;}
var_export($rows);
