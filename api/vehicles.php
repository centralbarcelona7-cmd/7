<?php
/**
 * API de Gerenciamento de Veículos
 * Sistema de Leilão de Veículos
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Função de log
function logAction($action, $description = '') {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[INFO] {$timestamp} - API Vehicles - {$action}";
    if ($description) {
        $logMessage .= " - {$description}";
    }
    error_log($logMessage . "\n", 3, __DIR__ . '/../logs/api.log');
}

// Obter método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Tratar OPTIONS (CORS preflight)
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
        case 'DELETE':
            handleDelete($conn);
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
 * GET - Listar ou buscar veículos
 */
function handleGet($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if ($id) {
        // Buscar veículo específico
        $stmt = $conn->prepare("
            SELECT v.*, 
                   GROUP_CONCAT(vi.image_url ORDER BY vi.display_order) as images
            FROM vehicles v
            LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
            WHERE v.id = ?
            GROUP BY v.id
        ");
        $stmt->execute([$id]);
        $vehicle = $stmt->fetch();
        
        if ($vehicle) {
            $vehicle['images'] = $vehicle['images'] ? explode(',', $vehicle['images']) : [];
            
            // Incrementar contador de visualizações
            $updateStmt = $conn->prepare("UPDATE vehicles SET view_count = view_count + 1 WHERE id = ?");
            $updateStmt->execute([$id]);
            
            logAction('GET_VEHICLE', "ID: {$id}");
            echo json_encode($vehicle);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Veículo não encontrado']);
        }
    } else {
        // Listar veículos com filtros
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $status = isset($_GET['status']) ? $_GET['status'] : 'disponivel';
        $featured = isset($_GET['featured']) ? filter_var($_GET['featured'], FILTER_VALIDATE_BOOLEAN) : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
        
        $query = "
            SELECT v.*, 
                   (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as primary_image,
                   (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count
            FROM vehicles v
            WHERE 1=1
        ";
        
        $params = [];
        
        if ($category) {
            $query .= " AND v.category = ?";
            $params[] = $category;
        }
        
        if ($status) {
            $query .= " AND v.status = ?";
            $params[] = $status;
        }
        
        if ($featured !== null) {
            $query .= " AND v.featured = ?";
            $params[] = $featured ? 1 : 0;
        }
        
        if ($search) {
            $query .= " AND (v.brand LIKE ? OR v.model LIKE ? OR v.description LIKE ?)";
            $searchParam = "%{$search}%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        $query .= " ORDER BY v.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $vehicles = $stmt->fetchAll();
        
        logAction('LIST_VEHICLES', "Total: " . count($vehicles));
        echo json_encode($vehicles);
    }
}

/**
 * POST - Criar novo veículo
 */
function handlePost($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar dados obrigatórios
    $required = ['brand', 'model', 'year', 'category', 'fuel', 'color', 'mileage', 'initial_price'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Campo obrigatório: {$field}"]);
            return;
        }
    }
    
    try {
        $conn->beginTransaction();
        
        // Inserir veículo
        $stmt = $conn->prepare("
            INSERT INTO vehicles (brand, model, year, category, fuel, color, mileage, initial_price, 
                                description, documentation, vehicle_condition, maintenance, warranty, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['brand'],
            $data['model'],
            $data['year'],
            $data['category'],
            $data['fuel'],
            $data['color'],
            $data['mileage'],
            $data['initial_price'],
            $data['description'] ?? null,
            $data['documentation'] ?? 'completa',
            $data['vehicle_condition'] ?? 'bom',
            $data['maintenance'] ?? 'em_dia',
            $data['warranty'] ?? null,
            isset($data['featured']) ? ($data['featured'] ? 1 : 0) : 0
        ]);
        
        $vehicleId = $conn->lastInsertId();
        
        // Inserir imagens se fornecidas
        if (isset($data['images']) && is_array($data['images'])) {
            $imgStmt = $conn->prepare("
                INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
                VALUES (?, ?, ?, ?)
            ");
            
            foreach ($data['images'] as $index => $imageUrl) {
                $imgStmt->execute([
                    $vehicleId,
                    $imageUrl,
                    $index === 0 ? 1 : 0,
                    $index
                ]);
            }
        }
        
        $conn->commit();
        
        logAction('CREATE_VEHICLE', "ID: {$vehicleId} - {$data['brand']} {$data['model']}");
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $vehicleId,
            'message' => 'Veículo criado com sucesso'
        ]);
        
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
}

/**
 * PUT - Atualizar veículo
 */
function handlePut($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do veículo é obrigatório']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $fields = [];
    $params = [];
    
    $allowed = ['brand', 'model', 'year', 'category', 'fuel', 'color', 'mileage', 'initial_price',
                'description', 'documentation', 'vehicle_condition', 'maintenance', 'warranty', 
                'status', 'featured'];
    
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
    
    $query = "UPDATE vehicles SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    if ($stmt->rowCount() > 0) {
        logAction('UPDATE_VEHICLE', "ID: {$id}");
        echo json_encode(['success' => true, 'message' => 'Veículo atualizado com sucesso']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Veículo não encontrado']);
    }
}

/**
 * DELETE - Remover veículo
 */
function handleDelete($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do veículo é obrigatório']);
        return;
    }
    
    // Soft delete - apenas marcar como removido
    $stmt = $conn->prepare("UPDATE vehicles SET status = 'removido' WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        logAction('DELETE_VEHICLE', "ID: {$id}");
        echo json_encode(['success' => true, 'message' => 'Veículo removido com sucesso']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Veículo não encontrado']);
    }
}
?>

