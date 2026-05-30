<?php
require __DIR__ . '/config/database.php';
$res = $connection->query("SELECT id,page_key,block_key,title,active,sort_order FROM content_blocks WHERE page_key='about' ORDER BY sort_order ASC");
while ($row = $res->fetch_assoc()) {
    echo json_encode($row, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;
}
