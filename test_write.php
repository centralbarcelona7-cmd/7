<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$dir = __DIR__ . DIRECTORY_SEPARATOR . 'apk';
$file = $dir . DIRECTORY_SEPARATOR . 'test.txt';

if (!is_dir($dir)) {
    @mkdir($dir, 0777, true);
}

$ok = @file_put_contents($file, "ok " . date('c')) !== false;

header('Content-Type: text/plain; charset=utf-8');
echo "DIR: $dir\n";
echo "WRITABLE: " . (is_writable($dir) ? 'SIM' : 'NÃO') . "\n";
echo "FILE: $file\n";
echo "WRITE_RESULT: " . ($ok ? 'SUCESSO' : 'FALHA') . "\n";
if (!$ok) {
    $last = error_get_last();
    if ($last) {
        echo "ERROR: " . $last['message'] . "\n";
    }
}
?>


