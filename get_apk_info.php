<?php
// CORS para permitir chamadas a partir de file:// e outros domínios
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder pré-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$apkDir = __DIR__ . '/apk';
$infoFile = $apkDir . '/info.json';
$apkFile = $apkDir . '/app.apk';

// Verificar se existe APK
if (file_exists($apkFile) && file_exists($infoFile)) {
    $infoRaw = @file_get_contents($infoFile);
    $info = $infoRaw ? json_decode($infoRaw, true) : null;
    if (is_array($info)) {
        echo json_encode([
            'success' => true,
            'data' => $info
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [
                'name' => 'app.apk',
                'size' => file_exists($apkFile) ? filesize($apkFile) : 0,
                'uploadDate' => date('Y-m-d H:i:s', @filemtime($apkFile)),
                'downloadCount' => 0
            ]
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'APK não encontrado'
    ]);
}
?>


