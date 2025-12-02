<?php
// Exibir erros para diagnóstico (remova em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Logger simples para rastrear fluxo de upload
$logDir = __DIR__ . DIRECTORY_SEPARATOR . 'logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0777, true);
}
$logFile = $logDir . DIRECTORY_SEPARATOR . 'api.log';
$log = function(string $message) use ($logFile) {
    @file_put_contents($logFile, '[' . date('c') . "] [upload_apk] " . $message . PHP_EOL, FILE_APPEND);
};

// CORS para permitir chamadas a partir de file:// e outros domínios
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Pré-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// Apenas POST para upload; GET pode responder OK para teste rápido
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $log('Healthcheck GET recebido');
    echo json_encode(['success' => true, 'message' => 'upload_apk.php OK']);
    exit;
}

// Garantir pasta apk/
$apkDir = __DIR__ . DIRECTORY_SEPARATOR . 'apk';
$log('Iniciando upload. Diretório APK: ' . $apkDir);
if (!is_dir($apkDir)) {
    if (!@mkdir($apkDir, 0777, true) && !is_dir($apkDir)) {
        $log('ERRO: Falha ao criar pasta apk/');
        echo json_encode(['success' => false, 'error' => 'Falha ao criar pasta apk/']);
        exit;
    }
    $log('Pasta apk/ criada com sucesso');
}

if (!isset($_FILES['apk'])) {
    $log('ERRO: Campo de arquivo "apk" ausente');
    echo json_encode(['success' => false, 'error' => 'Nenhum arquivo enviado (campo esperado: apk)']);
    exit;
}

$file = $_FILES['apk'];

// Tabela de erros amigáveis
$uploadErrors = [
    UPLOAD_ERR_INI_SIZE   => 'Arquivo excede upload_max_filesize do php.ini',
    UPLOAD_ERR_FORM_SIZE  => 'Arquivo excede o limite definido no formulário',
    UPLOAD_ERR_PARTIAL    => 'Upload parcial, tente novamente',
    UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo enviado',
    UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária ausente no servidor',
    UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo no disco',
    UPLOAD_ERR_EXTENSION  => 'Upload interrompido por extensão do PHP'
];

if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
    $code = $file['error'] ?? -1;
    $msg = $uploadErrors[$code] ?? ('Erro desconhecido (código ' . $code . ')');
    $log('ERRO: Falha no upload - código=' . $code . ' msg=' . $msg);
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if ($ext !== 'apk') {
    $log('ERRO: Extensão inválida recebida: .' . $ext);
    echo json_encode(['success' => false, 'error' => 'Apenas arquivos .apk são permitidos']);
    exit;
}

$destino = $apkDir . DIRECTORY_SEPARATOR . 'app.apk';
if (file_exists($destino)) {
    $log('Removendo APK anterior em ' . $destino);
    @unlink($destino);
}

if (!is_uploaded_file($file['tmp_name'])) {
    $log('ERRO: Arquivo temporário inválido: ' . ($file['tmp_name'] ?? 'n/d'));
    echo json_encode(['success' => false, 'error' => 'Arquivo temporário inválido']);
    exit;
}

if (!@move_uploaded_file($file['tmp_name'], $destino)) {
    $log('ERRO: Falha ao mover arquivo para ' . $destino);
    echo json_encode(['success' => false, 'error' => 'Falha ao mover o arquivo para apk/app.apk']);
    exit;
}

$info = [
    'name' => $file['name'],
    'size' => (int)$file['size'],
    'uploadDate' => date('Y-m-d H:i:s'),
    'downloadCount' => 0
];
@file_put_contents($apkDir . DIRECTORY_SEPARATOR . 'info.json', json_encode($info));

$log('SUCESSO: APK salvo. Nome original=' . $file['name'] . ' Tamanho=' . (int)$file['size'] . 'B');
echo json_encode([
    'success' => true,
    'message' => 'APK salvo com sucesso!',
    'data' => $info
]);
?>


