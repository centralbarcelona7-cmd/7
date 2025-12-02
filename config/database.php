<?php
/**
 * Configuração de Conexão com Banco de Dados
 * Sistema de Leilão de Veículos
 */

// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'leilao_veiculos');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Classe de Conexão
class Database {
    private $conn = null;
    
    /**
     * Estabelece conexão com o banco de dados
     */
    public function connect() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            $this->logInfo("Conexão com banco de dados estabelecida com sucesso");
            
            return $this->conn;
            
        } catch(PDOException $e) {
            $this->logError("Erro na conexão com banco de dados: " . $e->getMessage());
            die("Erro ao conectar ao banco de dados. Por favor, tente novamente mais tarde.");
        }
    }
    
    /**
     * Fecha a conexão com o banco de dados
     */
    public function disconnect() {
        $this->conn = null;
        $this->logInfo("Conexão com banco de dados encerrada");
    }
    
    /**
     * Registra informações no log
     */
    private function logInfo($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[INFO] {$timestamp} - {$message}\n";
        error_log($logMessage, 3, __DIR__ . '/../logs/database.log');
    }
    
    /**
     * Registra erros no log
     */
    private function logError($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[ERROR] {$timestamp} - {$message}\n";
        error_log($logMessage, 3, __DIR__ . '/../logs/database.log');
    }
}

// Função auxiliar para obter conexão
function getConnection() {
    $db = new Database();
    return $db->connect();
}
?>

