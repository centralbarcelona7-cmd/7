<?php
// upload_apk_min.php — Upload simples e direto, sem CORS/JSON
// Abra: http://localhost/Minhas%20telas/LEILAO/upload_apk_min.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$apkDir = __DIR__ . DIRECTORY_SEPARATOR . 'apk';
$destino = $apkDir . DIRECTORY_SEPARATOR . 'app.apk';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo '<pre style="font-family: Consolas, monospace;">';

    if (!isset($_FILES['apk'])) {
        echo "Erro: campo de arquivo 'apk' não enviado.\n";
        exit('</pre>');
    }

    $f = $_FILES['apk'];

    // Mostrar informações recebidas
    echo "Arquivo recebido: \n";
    print_r([
        'name' => $f['name'] ?? null,
        'type' => $f['type'] ?? null,
        'size' => $f['size'] ?? null,
        'tmp_name' => $f['tmp_name'] ?? null,
        'error' => $f['error'] ?? null,
    ]);
    echo "\n";

    // Validar erro de upload
    if (!isset($f['error']) || $f['error'] !== UPLOAD_ERR_OK) {
        $map = [
            UPLOAD_ERR_INI_SIZE   => 'Excede upload_max_filesize (php.ini)',
            UPLOAD_ERR_FORM_SIZE  => 'Excede limite do formulário',
            UPLOAD_ERR_PARTIAL    => 'Upload parcial',
            UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Sem pasta temporária (upload_tmp_dir)',
            UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever no disco',
            UPLOAD_ERR_EXTENSION  => 'Bloqueado por extensão PHP',
        ];
        $code = $f['error'] ?? -1;
        $msg = $map[$code] ?? ('Erro desconhecido (código ' . $code . ')');
        echo "\nFalha no upload: $msg\n";
        exit('</pre>');
    }

    // Garantir pasta apk/
    if (!is_dir($apkDir)) {
        if (!@mkdir($apkDir, 0777, true) && !is_dir($apkDir)) {
            echo "\nErro: não foi possível criar a pasta 'apk/'.\n";
            exit('</pre>');
        }
    }

    // Validar extensão
    $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
    if ($ext !== 'apk') {
        echo "\nErro: envie um arquivo .apk\n";
        exit('</pre>');
    }

    // Mostrar diretórios/permessas
    echo "Diretório base (__DIR__): " . __DIR__ . "\n";
    echo "Diretório apk: $apkDir\n";
    echo "Destino: $destino\n";
    echo "apk/ é gravável? " . (is_writable($apkDir) ? 'SIM' : 'NÃO') . "\n\n";

    // Mover arquivo
    if (!is_uploaded_file($f['tmp_name'])) {
        echo "\nErro: arquivo temporário inválido (" . ($f['tmp_name'] ?? 'n/d') . ")\n";
        exit('</pre>');
    }

    $ok = @move_uploaded_file($f['tmp_name'], $destino);
    if (!$ok) {
        // Fallbacks: copy/rename
        $ok = @copy($f['tmp_name'], $destino);
        if (!$ok) {
            $ok = @rename($f['tmp_name'], $destino);
        }
    }

    clearstatcache();
    if ($ok && file_exists($destino)) {
        echo "\n✅ Sucesso! APK salvo em: $destino\n";
        echo "Tamanho: " . (filesize($destino) ?: 0) . " bytes\n";
        echo "\nAgora você pode baixar em: /apk/app.apk\n";
    } else {
        echo "\n❌ Falha ao mover o arquivo para $destino\n";
        $last = error_get_last();
        if ($last) {
            echo "Detalhe do erro: ";
            print_r($last);
        }
        echo "\nVerifique permissões da pasta e upload_tmp_dir no php.ini\n";
    }

    exit('</pre>');
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Upload APK (Simples)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:40px auto;padding:0 16px}
    .card{border:1px solid #ddd;border-radius:8px;padding:16px}
    h1{font-size:20px;margin:0 0 12px}
    .hint{color:#666;font-size:14px;margin:8px 0 16px}
    button{background:#0a7cff;color:#fff;border:0;border-radius:6px;padding:10px 14px;cursor:pointer}
    input[type=file]{margin:12px 0}
  </style>
</head>
<body>
  <div class="card">
    <h1>Upload do APK</h1>
    <div class="hint">Este envio salva diretamente em <code>apk/app.apk</code>.</div>
    <form action="" method="POST" enctype="multipart/form-data">
      <input type="file" name="apk" accept=".apk" required>
      <div>
        <button type="submit">Enviar APK</button>
      </div>
    </form>
  </div>
</body>
</html>
