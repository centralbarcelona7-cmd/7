-- ===================================
-- DADOS DE EXEMPLO
-- Sistema de Leilão de Veículos
-- ===================================

USE leilao_veiculos;

-- ===================================
-- USUÁRIOS DE TESTE
-- ===================================

INSERT INTO users (name, email, cpf, phone, birth_date, password, role, status) VALUES
('João Silva', 'joao@example.com', '123.456.789-00', '(11) 91234-5678', '1985-03-15', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active'),
('Maria Santos', 'maria@example.com', '987.654.321-00', '(11) 98765-4321', '1990-07-20', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active'),
('Pedro Oliveira', 'pedro@example.com', '456.789.123-00', '(11) 95555-1234', '1988-11-10', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active');

-- ===================================
-- VEÍCULOS DE EXEMPLO
-- ===================================

-- Carros
INSERT INTO vehicles (brand, model, year, category, fuel, color, mileage, initial_price, description, documentation, vehicle_condition, maintenance, warranty, status, featured) VALUES
('Toyota', 'Corolla', 2022, 'carros', 'flex', 'Prata', 25000, 75000.00, 'Toyota Corolla 2022 em excelente estado de conservação. Único dono, todas as revisões em dia na concessionária.', 'completa', 'excelente', 'em_dia', '90 dias', 'disponivel', TRUE),
('Honda', 'Civic', 2023, 'carros', 'gasolina', 'Preto', 15000, 110000.00, 'Honda Civic 2023, praticamente novo, baixa quilometragem, completo com todos os opcionais.', 'completa', 'excelente', 'em_dia', '1 ano', 'disponivel', TRUE),
('Volkswagen', 'Golf', 2021, 'carros', 'flex', 'Branco', 35000, 65000.00, 'Volkswagen Golf 2021 em ótimo estado, motor 1.4 TSI turbo, automático.', 'completa', 'muito_bom', 'em_dia', '60 dias', 'disponivel', TRUE),
('Chevrolet', 'Onix', 2022, 'carros', 'flex', 'Vermelho', 28000, 58000.00, 'Chevrolet Onix Plus Premier 2022, completo, único dono.', 'completa', 'excelente', 'em_dia', '90 dias', 'disponivel', FALSE),
('Fiat', 'Argo', 2021, 'carros', 'flex', 'Azul', 42000, 52000.00, 'Fiat Argo Trekking 2021, motor 1.3, muito econômico.', 'completa', 'bom', 'em_dia', '60 dias', 'disponivel', FALSE);

-- Utilitários
INSERT INTO vehicles (brand, model, year, category, fuel, color, mileage, initial_price, description, documentation, vehicle_condition, maintenance, warranty, status, featured) VALUES
('Ford', 'Ranger', 2022, 'utilitarios', 'diesel', 'Cinza', 28000, 145000.00, 'Ford Ranger XLT 4x4 diesel 2022, perfeita para trabalho e lazer.', 'completa', 'excelente', 'em_dia', '120 dias', 'disponivel', TRUE),
('Toyota', 'Hilux', 2021, 'utilitarios', 'diesel', 'Branca', 45000, 155000.00, 'Toyota Hilux SRV 4x4 diesel 2021, muito bem conservada.', 'completa', 'muito_bom', 'em_dia', '90 dias', 'disponivel', FALSE);

-- Motos
INSERT INTO vehicles (brand, model, year, category, fuel, color, mileage, initial_price, description, documentation, vehicle_condition, maintenance, warranty, status, featured) VALUES
('Yamaha', 'MT-07', 2023, 'motos', 'gasolina', 'Azul', 5000, 38000.00, 'Yamaha MT-07 2023 praticamente nova, revisões em dia.', 'completa', 'excelente', 'em_dia', '1 ano', 'disponivel', TRUE),
('Honda', 'CB 500F', 2022, 'motos', 'gasolina', 'Vermelha', 12000, 32000.00, 'Honda CB 500F 2022 em ótimo estado.', 'completa', 'excelente', 'em_dia', '90 dias', 'disponivel', FALSE),
('Kawasaki', 'Ninja 400', 2021, 'motos', 'gasolina', 'Verde', 18000, 28000.00, 'Kawasaki Ninja 400 2021, esportiva, muito bem cuidada.', 'completa', 'muito_bom', 'em_dia', '60 dias', 'disponivel', FALSE);

-- Caminhões
INSERT INTO vehicles (brand, model, year, category, fuel, color, mileage, initial_price, description, documentation, vehicle_condition, maintenance, warranty, status, featured) VALUES
('Mercedes-Benz', 'Actros', 2020, 'caminhoes', 'diesel', 'Branco', 120000, 260000.00, 'Mercedes-Benz Actros 2020 para transporte pesado, muito bem mantido.', 'completa', 'muito_bom', 'em_dia', '90 dias', 'disponivel', FALSE),
('Volvo', 'FH 540', 2019, 'caminhoes', 'diesel', 'Branco', 180000, 245000.00, 'Volvo FH 540 2019, cavalo mecânico, pronto para trabalhar.', 'completa', 'bom', 'em_dia', '60 dias', 'disponivel', FALSE);

-- ===================================
-- IMAGENS DOS VEÍCULOS
-- ===================================

-- Toyota Corolla
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
(1, 'https://via.placeholder.com/800x600/4a90e2/ffffff?text=Toyota+Corolla+1', TRUE, 0),
(1, 'https://via.placeholder.com/800x600/50c878/ffffff?text=Toyota+Corolla+2', FALSE, 1),
(1, 'https://via.placeholder.com/800x600/f39c12/ffffff?text=Toyota+Corolla+3', FALSE, 2),
(1, 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Toyota+Corolla+4', FALSE, 3);

-- Honda Civic
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
(2, 'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Honda+Civic+1', TRUE, 0),
(2, 'https://via.placeholder.com/800x600/34495e/ffffff?text=Honda+Civic+2', FALSE, 1);

-- Volkswagen Golf
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
(3, 'https://via.placeholder.com/800x600/9b59b6/ffffff?text=VW+Golf+1', TRUE, 0),
(3, 'https://via.placeholder.com/800x600/8e44ad/ffffff?text=VW+Golf+2', FALSE, 1);

-- Ford Ranger
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
(6, 'https://via.placeholder.com/800x600/16a085/ffffff?text=Ford+Ranger+1', TRUE, 0),
(6, 'https://via.placeholder.com/800x600/1abc9c/ffffff?text=Ford+Ranger+2', FALSE, 1);

-- Yamaha MT-07
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order) VALUES
(8, 'https://via.placeholder.com/800x600/3498db/ffffff?text=Yamaha+MT07+1', TRUE, 0),
(8, 'https://via.placeholder.com/800x600/2980b9/ffffff?text=Yamaha+MT07+2', FALSE, 1);

-- ===================================
-- LEILÕES ATIVOS
-- ===================================

-- Leilão Toyota Corolla (encerra em 2 dias)
INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, increment_value, status) VALUES
(1, NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY), 75000.00, 85000.00, 500.00, 'ativo');

-- Leilão Honda Civic (encerra em 5 dias)
INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, increment_value, status) VALUES
(2, NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY), 110000.00, 120000.00, 1000.00, 'ativo');

-- Leilão Volkswagen Golf (encerra em 1 dia)
INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, increment_value, status) VALUES
(3, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 65000.00, 72000.00, 500.00, 'ativo');

-- Leilão Ford Ranger (encerra em 4 dias)
INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, increment_value, status) VALUES
(6, NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY), 145000.00, 155000.00, 1000.00, 'ativo');

-- Leilão Yamaha MT-07 (encerra em 3 dias)
INSERT INTO auctions (vehicle_id, start_date, end_date, initial_price, current_bid, increment_value, status) VALUES
(8, NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 38000.00, 42000.00, 500.00, 'ativo');

-- ===================================
-- LANCES DE EXEMPLO
-- ===================================

-- Lances no Toyota Corolla
INSERT INTO bids (auction_id, user_id, bid_amount, status, created_at) VALUES
(1, 1, 76000.00, 'superado', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 2, 78000.00, 'superado', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 3, 80000.00, 'superado', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(1, 1, 82000.00, 'superado', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(1, 2, 85000.00, 'ativo', DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- Lances no Honda Civic
INSERT INTO bids (auction_id, user_id, bid_amount, status, created_at) VALUES
(2, 1, 112000.00, 'superado', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(2, 3, 115000.00, 'superado', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 2, 120000.00, 'ativo', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- ===================================
-- NOTIFICAÇÕES
-- ===================================

INSERT INTO notifications (user_id, title, message, type, related_auction_id, is_read) VALUES
(1, 'Você foi superado!', 'Seu lance no Toyota Corolla foi superado.', 'warning', 1, FALSE),
(2, 'Você está vencendo!', 'Você está com o maior lance no Toyota Corolla.', 'success', 1, TRUE),
(3, 'Novo leilão!', 'Um novo leilão de seu interesse foi criado.', 'info', 2, FALSE);

-- ===================================
-- LOGS DO SISTEMA
-- ===================================

INSERT INTO system_logs (log_type, user_id, action, description, ip_address) VALUES
('info', 1, 'login', 'Usuário realizou login com sucesso', '127.0.0.1'),
('info', 2, 'bid_placed', 'Lance de R$ 85.000,00 no leilão #1', '127.0.0.1'),
('info', NULL, 'auction_created', 'Novo leilão criado para o veículo Toyota Corolla', '127.0.0.1'),
('security', 3, 'failed_login', 'Tentativa de login com senha incorreta', '192.168.1.100');

-- ===================================
-- FIM DOS DADOS DE EXEMPLO
-- ===================================

