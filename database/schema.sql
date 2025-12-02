-- ===================================
-- SISTEMA DE LEILÃO DE VEÍCULOS
-- Script de Criação do Banco de Dados
-- ===================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS leilao_veiculos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE leilao_veiculos;

-- ===================================
-- TABELA DE USUÁRIOS
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_cpf (cpf),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE VEÍCULOS
-- ===================================
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    category ENUM('carros', 'motos', 'caminhoes', 'utilitarios') NOT NULL,
    fuel ENUM('gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido') NOT NULL,
    color VARCHAR(50) NOT NULL,
    mileage INT NOT NULL,
    initial_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    documentation ENUM('completa', 'pendente', 'irregular') DEFAULT 'completa',
    vehicle_condition ENUM('excelente', 'muito_bom', 'bom', 'regular') DEFAULT 'bom',
    maintenance ENUM('em_dia', 'pendente', 'irregular') DEFAULT 'em_dia',
    warranty VARCHAR(100),
    status ENUM('disponivel', 'em_leilao', 'vendido', 'removido') DEFAULT 'disponivel',
    featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE IMAGENS DOS VEÍCULOS
-- ===================================
CREATE TABLE IF NOT EXISTS vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE LEILÕES
-- ===================================
CREATE TABLE IF NOT EXISTS auctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    initial_price DECIMAL(10, 2) NOT NULL,
    current_bid DECIMAL(10, 2) DEFAULT NULL,
    reserve_price DECIMAL(10, 2) DEFAULT NULL,
    increment_value DECIMAL(10, 2) DEFAULT 100.00,
    winner_user_id INT DEFAULT NULL,
    status ENUM('pendente', 'ativo', 'encerrado', 'cancelado') DEFAULT 'pendente',
    bid_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_vehicle (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE LANCES
-- ===================================
CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT NOT NULL,
    user_id INT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    is_winner BOOLEAN DEFAULT FALSE,
    status ENUM('ativo', 'superado', 'cancelado') DEFAULT 'ativo',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_auction (auction_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_amount (bid_amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE FAVORITOS
-- ===================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, vehicle_id),
    INDEX idx_user (user_id),
    INDEX idx_vehicle (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE NOTIFICAÇÕES
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_auction_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_auction_id) REFERENCES auctions(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE LOGS DO SISTEMA
-- ===================================
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_type ENUM('info', 'warning', 'error', 'security') NOT NULL,
    user_id INT DEFAULT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type (log_type),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABELA DE CONFIGURAÇÕES DO SISTEMA
-- ===================================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- INSERIR CONFIGURAÇÕES PADRÃO
-- ===================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'Leilão Premium', 'Nome do site'),
('contact_email', 'contato@leilaopremium.com.br', 'Email de contato'),
('contact_phone', '(11) 1234-5678', 'Telefone de contato'),
('default_auction_duration', '7', 'Duração padrão dos leilões em dias'),
('min_bid_increment', '5', 'Incremento mínimo de lance em %'),
('platform_commission', '10', 'Comissão da plataforma em %'),
('enable_notifications', '1', 'Habilitar notificações'),
('enable_auto_close', '1', 'Encerrar leilões automaticamente')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ===================================
-- INSERIR USUÁRIO ADMIN PADRÃO
-- ===================================
-- Senha: admin123 (deve ser alterada em produção)
INSERT INTO users (name, email, cpf, phone, birth_date, password, role) VALUES
('Administrador', 'admin@leilaopremium.com.br', '000.000.000-00', '(11) 99999-9999', '1990-01-01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- ===================================
-- VIEWS ÚTEIS
-- ===================================

-- View de leilões ativos com informações do veículo
CREATE OR REPLACE VIEW active_auctions AS
SELECT 
    a.*,
    v.brand,
    v.model,
    v.year,
    v.category,
    v.mileage,
    v.color,
    (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as primary_image
FROM auctions a
INNER JOIN vehicles v ON a.vehicle_id = v.id
WHERE a.status = 'ativo' AND a.end_date > NOW();

-- View de estatísticas gerais
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE status != 'removido') as total_vehicles,
    (SELECT COUNT(*) FROM auctions WHERE status = 'ativo') as active_auctions,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COALESCE(SUM(current_bid), 0) FROM auctions WHERE status = 'encerrado') as total_revenue,
    (SELECT COUNT(*) FROM bids WHERE DATE(created_at) = CURDATE()) as today_bids;

-- ===================================
-- TRIGGERS
-- ===================================

-- Trigger para atualizar contador de lances
DELIMITER //
CREATE TRIGGER after_bid_insert
AFTER INSERT ON bids
FOR EACH ROW
BEGIN
    UPDATE auctions 
    SET bid_count = bid_count + 1,
        current_bid = NEW.bid_amount
    WHERE id = NEW.auction_id;
    
    -- Marcar lances anteriores como superados
    UPDATE bids 
    SET status = 'superado'
    WHERE auction_id = NEW.auction_id 
    AND id != NEW.id 
    AND status = 'ativo';
END//
DELIMITER ;

-- Trigger para atualizar status do veículo quando leilão é criado
DELIMITER //
CREATE TRIGGER after_auction_insert
AFTER INSERT ON auctions
FOR EACH ROW
BEGIN
    UPDATE vehicles 
    SET status = 'em_leilao'
    WHERE id = NEW.vehicle_id;
END//
DELIMITER ;

-- ===================================
-- PROCEDURES
-- ===================================

-- Procedure para encerrar leilões automaticamente
DELIMITER //
CREATE PROCEDURE close_expired_auctions()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE auction_id INT;
    DECLARE winning_user INT;
    
    DECLARE cur CURSOR FOR 
        SELECT a.id, b.user_id
        FROM auctions a
        LEFT JOIN bids b ON a.id = b.auction_id AND b.is_winner = TRUE
        WHERE a.status = 'ativo' AND a.end_date <= NOW();
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO auction_id, winning_user;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE auctions 
        SET status = 'encerrado',
            winner_user_id = winning_user
        WHERE id = auction_id;
        
        -- Criar notificação para o vencedor se houver
        IF winning_user IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, related_auction_id)
            VALUES (winning_user, 'Parabéns!', 'Você venceu o leilão!', 'success', auction_id);
        END IF;
        
        INSERT INTO system_logs (log_type, action, description)
        VALUES ('info', 'auction_closed', CONCAT('Leilão #', auction_id, ' encerrado automaticamente'));
    END LOOP;
    
    CLOSE cur;
END//
DELIMITER ;

-- ===================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ===================================

-- Índice composto para consultas frequentes
CREATE INDEX idx_auction_status_dates ON auctions(status, start_date, end_date);
CREATE INDEX idx_vehicle_status_category ON vehicles(status, category);
CREATE INDEX idx_bids_auction_amount ON bids(auction_id, bid_amount DESC);

-- ===================================
-- FIM DO SCRIPT
-- ===================================

