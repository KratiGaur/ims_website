<?php
require __DIR__ . '/config/database.php';
$res = $connection->query("SELECT id,title,type,category,tags,active,uploaded_at,url FROM media ORDER BY uploaded_at DESC LIMIT 10");
while ($row = $res->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
}
