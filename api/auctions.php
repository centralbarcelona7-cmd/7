<?php
/**
 * API de Gerenciamento de Leilões
 * Sistema de Leilão de Veículos
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

function logAction($action, $description = '') {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[INFO] {$timestamp} - API Auctions - {$action}";
    if ($description) {
        $logMessage .= " - {$description}";
    }
    error_log($logMessage . "\n", 3, __DIR__ . '/../logs/api.log');
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = getConnection();
    
    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn);
            break;
        case 'PUT':
            handlePut($conn);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor', 'message' => $e->getMessage()]);
    logAction('ERROR', $e->getMessage());
}

/**
 * GET - Listar leilões
 */
function handleGet($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $status = isset($_GET['status']) ? $_GET['status'] : 'ativo';
    
    if ($id) {
        // Buscar leilão específico com informações do veículo
        $stmt = $conn->prepare("
            SELECT a.*, 
                   v.brand, v.model, v.year, v.category, v.fuel, v.color, v.mileage,
                   v.description, v.documentation, v.vehicle_condition,
                   (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as primary_image,
                   u.name as winner_name
            FROM auctions a
            INNER JOIN vehicles v ON a.vehicle_id = v.id
            LEFT JOIN users u ON a.winner_user_id = u.id
            WHERE a.id = ?
        ");
        $stmt->execute([$id]);
        $auction = $stmt->fetch();
        
        if ($auction) {
            // Buscar histórico de lances
            $bidsStmt = $conn->prepare("
                SELECT b.*, u.name as user_name
                FROM bids b
                INNER JOIN users u ON b.user_id = u.id
                WHERE b.auction_id = ?
                ORDER BY b.created_at DESC
                LIMIT 20
            ");
            $bidsStmt->execute([$id]);
            $auction['bids'] = $bidsStmt->fetchAll();
            
            logAction('GET_AUCTION', "ID: {$id}");
            echo json_encode($auction);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Leilão não encontrado']);
        }
    } else {
        // Listar leilões
        $query = "
            SELECT a.*, 
                   v.brand, v.model, v.year, v.category,
                   (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as primary_image
            FROM auctions a
            INNER JOIN vehicles v ON a.vehicle_id = v.id
            WHERE a.status = ?
            ORDER BY a.end_date ASC
        ";
        
        $stmt = $conn->prepare($query);
        $stmt->execute([$status]);
        $auctions = $stmt->fetchAll();
        
        logAction('LIST_AUCTIONS', "Status: {$status}, Total: " . count($auctions));
        echo json_encode($auctions);
    }
}

/**
 * POST - Criar novo leilão ou dar lance
 */
function handlePost($conn) {
    $action = isset($_GET['action']) ? $_GET['action'] : 'create';
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'bid') {
        placeBid($conn, $data);
    } else {
        createAuction($conn, $data);
    }
}

/**
 * Criar novo leilão
 */
function createAuction($conn, $data) {
    // Validar dados obrigatórios
    if (!isset($data['vehicle_id']) || !isset($data['initial_price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados obrigatórios não fornecidos']);
        return;
    }
    
    $duration = $data['duration_days'] ?? 7;
    $startDate = $data['start_date'] ?? date('Y-m-d H:i:s');
    $endDate = date('Y-m-d H:i:s', strtotime($startDate . " + {$duration} days"));
    
    try {
        $stmt = $conn->prepare("
            INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, 
                                reserve_price, increment_value, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['vehicle_id'],
            $startDate,
            $endDate,
            $data['initial_price'],
            $data['initial_price'],
            $data['reserve_price'] ?? null,
            $data['increment_value'] ?? 100,
            $data['status'] ?? 'ativo'
        ]);
        
        $auctionId = $conn->lastInsertId();
        
        logAction('CREATE_AUCTION', "ID: {$auctionId} - Veículo: {$data['vehicle_id']}");
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $auctionId,
            'message' => 'Leilão criado com sucesso'
        ]);
        
    } catch (Exception $e) {
        throw $e;
    }
}

/**
 * Dar lance
 */
function placeBid($conn, $data) {
    if (!isset($data['auction_id']) || !isset($data['user_id']) || !isset($data['bid_amount'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados do lance incompletos']);
        return;
    }
    
    try {
        $conn->beginTransaction();
        
        // Verificar se o leilão está ativo
        $auctionStmt = $conn->prepare("
            SELECT current_bid, status, end_date, increment_value 
            FROM auctions 
            WHERE id = ? AND status = 'ativo' AND end_date > NOW()
        ");
        $auctionStmt->execute([$data['auction_id']]);
        $auction = $auctionStmt->fetch();
        
        if (!$auction) {
            http_response_code(400);
            echo json_encode(['error' => 'Leilão não está disponível para lances']);
            return;
        }
        
        // Validar valor do lance
        $minBid = $auction['current_bid'] + $auction['increment_value'];
        if ($data['bid_amount'] < $minBid) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Lance deve ser maior que o lance atual',
                'minimum_bid' => $minBid
            ]);
            return;
        }
        
        // Inserir lance
        $bidStmt = $conn->prepare("
            INSERT INTO bids (auction_id, user_id, bid_amount, ip_address, user_agent, is_winner)
            VALUES (?, ?, ?, ?, ?, TRUE)
        ");
        
        $bidStmt->execute([
            $data['auction_id'],
            $data['user_id'],
            $data['bid_amount'],
            $_SERVER['REMOTE_ADDR'] ?? null,
            $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
        
        $bidId = $conn->lastInsertId();
        
        $conn->commit();
        
        logAction('PLACE_BID', "Lance ID: {$bidId} - Leilão: {$data['auction_id']} - Valor: {$data['bid_amount']}");
        
        echo json_encode([
            'success' => true,
            'bid_id' => $bidId,
            'message' => 'Lance realizado com sucesso'
        ]);
        
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
}

/**
 * PUT - Atualizar leilão
 */
function handlePut($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do leilão é obrigatório']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $allowed = ['status', 'end_date', 'reserve_price'];
    $fields = [];
    $params = [];
    
    foreach ($allowed as $field) {
        if (isset($data[$field])) {
            $fields[] = "{$field} = ?";
            $params[] = $data[$field];
        }
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhum campo para atualizar']);
        return;
    }
    
    $params[] = $id;
    
    $query = "UPDATE auctions SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    if ($stmt->rowCount() > 0) {
        logAction('UPDATE_AUCTION', "ID: {$id}");
        echo json_encode(['success' => true, 'message' => 'Leilão atualizado com sucesso']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Leilão não encontrado']);
    }
}
?>

