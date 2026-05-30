<?php
require 'config/database.php';
$res = $connection->query('SHOW COLUMNS FROM media');
$rows=[];
while($row=$res->fetch_assoc()){$rows[]=$row;}
var_export($rows);
