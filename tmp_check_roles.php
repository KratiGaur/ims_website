<?php
require 'config/database.php';
$res = $connection->query("SELECT id, name FROM roles ORDER BY id");
$rows=[];
while($row=$res->fetch_assoc()){$rows[]=$row;}
var_export($rows);
