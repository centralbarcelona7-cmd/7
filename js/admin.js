// ===================================
// PAINEL ADMINISTRATIVO
// ===================================

let currentSection = 'dashboard';
let vehicleImages = []; // Array para armazenar as imagens do veículo atual

// Carregar veículos do localStorage ou usar mock
function loadVehiclesData() {
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    if (savedVehicles && savedVehicles.length > 0) {
        console.log(`[INFO] ${new Date().toISOString()} - Carregando ${savedVehicles.length} veículos do localStorage`);
        
        // Substituir mockVehicles pelos salvos
        mockVehicles.length = 0;
        savedVehicles.forEach(saved => {
            mockVehicles.push(saved);
            console.log(`[DEBUG] - Carregado: ${saved.brand} ${saved.model} com ${saved.images ? saved.images.length : 0} imagens`);
        });
    } else {
        console.log(`[INFO] ${new Date().toISOString()} - Nenhum veículo no localStorage, usando dados padrão`);
    }
    console.log(`[INFO] ${new Date().toISOString()} - Total: ${mockVehicles.length} veículos disponíveis`);
}

// Salvar veículos no localStorage
function saveVehiclesData() {
    // Salvar diretamente no localStorage
    localStorage.setItem('vehicles', JSON.stringify(mockVehicles));
    console.log(`[INFO] ${new Date().toISOString()} - ${mockVehicles.length} veículos salvos no localStorage`);
    
    // Debug: verificar se salvou corretamente
    const saved = JSON.parse(localStorage.getItem('vehicles') || '[]');
    console.log(`[DEBUG] ${new Date().toISOString()} - Verificação: ${saved.length} veículos no localStorage`);
    saved.forEach(v => {
        console.log(`[DEBUG] - ${v.brand} ${v.model}: ${v.images ? v.images.length : 0} imagens`);
    });
}

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[INFO] ${new Date().toISOString()} - Painel administrativo carregado`);
    
    // Verificar autenticação
    checkAuth();
    
    // Carregar veículos do localStorage
    loadVehiclesData();
    
    // Inicializar gerenciamento de APK
    initApkManagement();
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Carregar seção inicial
    loadSection('dashboard');
    
    // Configurar modals
    setupModals();
    
    console.log(`[INFO] ${new Date().toISOString()} - Painel administrativo inicializado`);
});

// Base de URL para chamadas PHP (usar raiz quando servido via http/https)
const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? '/'
  : 'http://localhost/Minhas%20telas/LEILAO/';

function apiUrl(path) {
    return API_BASE + path;
}

// ===================================
// AUTENTICAÇÃO
// ===================================
function checkAuth() {
    const user = StorageManager.getItem('user');
    
    if (!user) {
        console.log(`[ERROR] ${new Date().toISOString()} - Usuário não autenticado`);
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar se é admin (para demo, todos podem acessar)
    console.log(`[INFO] ${new Date().toISOString()} - Usuário autenticado: ${user.email}`);
}

// ===================================
// NAVEGAÇÃO
// ===================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            loadSection(section);
            
            // Atualizar navegação ativa
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Fechar menu mobile se estiver aberto
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) sidebar.classList.remove('active');
        });
    });
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// ===================================
// CARREGAMENTO DE SEÇÕES
// ===================================
function loadSection(section) {
    currentSection = section;
    
    // Ocultar todas as seções
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar título
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const titles = {
            dashboard: 'Dashboard',
            vehicles: 'Gerenciar Veículos',
            auctions: 'Gerenciar Leilões',
            users: 'Gerenciar Usuários',
            bids: 'Histórico de Lances',
            reports: 'Relatórios',
            settings: 'Configurações'
        };
        pageTitle.textContent = titles[section] || section;
    }
    
    // Carregar dados da seção
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'vehicles':
            loadVehiclesTable();
            break;
        case 'auctions':
            loadAuctionsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'bids':
            loadBidsTable();
            break;
    }
    
    console.log(`[INFO] ${new Date().toISOString()} - Seção carregada: ${section}`);
}

// ===================================
// DASHBOARD
// ===================================
function loadDashboard() {
    loadRecentAuctions();
    loadRecentActivity();
}

function loadRecentAuctions() {
    const container = document.getElementById('recent-auctions');
    if (!container) return;
    
    const recentVehicles = mockVehicles.slice(0, 5);
    
    container.innerHTML = recentVehicles.map(vehicle => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: var(--light-color); border-radius: 5px; margin-bottom: 0.5rem;">
            <div>
                <strong>${vehicle.brand} ${vehicle.model}</strong>
                <div style="font-size: 0.85rem; color: #666;">${formatCurrency(vehicle.current_bid)}</div>
            </div>
            <span class="status-badge status-active">Ativo</span>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;
    
    const activities = [
        { action: 'Novo lance', detail: 'Toyota Corolla', time: '2 min atrás', icon: 'gavel', color: '#50c878' },
        { action: 'Novo usuário', detail: 'João Silva', time: '15 min atrás', icon: 'user-plus', color: '#4a90e2' },
        { action: 'Leilão encerrado', detail: 'Honda Civic', time: '1h atrás', icon: 'check-circle', color: '#f39c12' },
        { action: 'Veículo adicionado', detail: 'Ford Ranger', time: '2h atrás', icon: 'car', color: '#9b59b6' },
        { action: 'Lance cancelado', detail: 'VW Golf', time: '3h atrás', icon: 'times-circle', color: '#e74c3c' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div style="display: flex; align-items: start; gap: 1rem; padding: 0.8rem; border-bottom: 1px solid var(--border-color);">
            <div style="width: 35px; height: 35px; background: ${activity.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div style="flex: 1;">
                <strong>${activity.action}</strong>
                <div style="font-size: 0.9rem; color: #666;">${activity.detail}</div>
                <div style="font-size: 0.8rem; color: #999;">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// ===================================
// TABELAS
// ===================================
function loadVehiclesTable() {
    const tbody = document.getElementById('vehicles-table');
    if (!tbody) return;
    
    if (mockVehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999; padding: 2rem;">Nenhum veículo cadastrado. Clique em "Adicionar Veículo" para começar.</td></tr>';
        return;
    }
    
    tbody.innerHTML = mockVehicles.map(vehicle => `
        <tr>
            <td>${vehicle.id}</td>
            <td><img src="${vehicle.images[0]}" alt="${vehicle.model}" style="width: 60px; height: 45px; object-fit: cover; border-radius: 5px;"></td>
            <td><strong>${vehicle.brand} ${vehicle.model}</strong></td>
            <td style="text-transform: capitalize;">${vehicle.category}</td>
            <td>${vehicle.year}</td>
            <td>${formatCurrency(vehicle.initial_price)}</td>
            <td><span class="status-badge status-${vehicle.status === 'disponivel' || vehicle.status === 'ativo' ? 'active' : 'finished'}">${vehicle.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-view" title="Visualizar" onclick="viewVehicle(${vehicle.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-edit" title="Editar" onclick="editVehicle(${vehicle.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" title="Excluir" onclick="deleteVehicle(${vehicle.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - Tabela de veículos carregada com ${mockVehicles.length} registros`);
}

function loadAuctionsTable() {
    const tbody = document.getElementById('auctions-table');
    if (!tbody) return;
    
    tbody.innerHTML = mockVehicles.map(vehicle => {
        const endDate = new Date(vehicle.end_date);
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 dias antes
        
        return `
            <tr>
                <td>${vehicle.id}</td>
                <td>${vehicle.brand} ${vehicle.model}</td>
                <td>${startDate.toLocaleDateString('pt-BR')}</td>
                <td>${endDate.toLocaleDateString('pt-BR')}</td>
                <td>${formatCurrency(vehicle.current_bid)}</td>
                <td>${vehicle.bid_count}</td>
                <td><span class="status-badge status-active">Ativo</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon btn-view" title="Visualizar" onclick="viewAuction(${vehicle.id})"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon btn-edit" title="Editar" onclick="editAuction(${vehicle.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete" title="Encerrar" onclick="stopAuction(${vehicle.id})"><i class="fas fa-stop"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - Tabela de leilões carregada`);
}

function loadUsersTable() {
    const tbody = document.getElementById('users-table');
    if (!tbody) return;
    
    const users = StorageManager.getItem('users') || [];
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999; padding: 2rem;">Nenhum usuário cadastrado ainda.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.cpf}</td>
            <td>${user.phone}</td>
            <td>${new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
            <td><span class="status-badge status-active">Ativo</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-view" title="Visualizar" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon btn-edit" title="Editar" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" title="Excluir" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - Tabela de usuários carregada com ${users.length} registros`);
}

function loadBidsTable() {
    const tbody = document.getElementById('bids-table');
    if (!tbody) return;
    
    const bids = [];
    
    // Gerar lances simulados
    mockVehicles.forEach(vehicle => {
        for (let i = 0; i < 3; i++) {
            bids.push({
                id: bids.length + 1,
                vehicle: `${vehicle.brand} ${vehicle.model}`,
                user: 'Usuário Demo',
                amount: vehicle.current_bid - (i * 1000),
                date: new Date(Date.now() - i * 60000).toLocaleString('pt-BR'),
                status: i === 0 ? 'Vencedor' : 'Superado'
            });
        }
    });
    
    tbody.innerHTML = bids.slice(0, 20).map(bid => `
        <tr>
            <td>${bid.id}</td>
            <td>${bid.vehicle}</td>
            <td>${bid.user}</td>
            <td>${formatCurrency(bid.amount)}</td>
            <td>${bid.date}</td>
            <td><span class="status-badge ${bid.status === 'Vencedor' ? 'status-active' : 'status-pending'}">${bid.status}</span></td>
        </tr>
    `).join('');
}

// ===================================
// MODALS
// ===================================
function setupModals() {
    // Botão adicionar veículo
    const addVehicleBtn = document.getElementById('btn-add-vehicle');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            openModal('vehicle-modal');
        });
    }
    
    // Fechar modals
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Fechar ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Formulário de veículo
    const vehicleForm = document.getElementById('vehicle-form');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleVehicleSubmit);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        console.log(`[INFO] ${new Date().toISOString()} - Modal aberto: ${modalId}`);
    }
}

function closeModal() {
    closeAllModals();
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Limpar formulário de veículo
    const vehicleForm = document.getElementById('vehicle-form');
    if (vehicleForm) {
        vehicleForm.reset();
        delete vehicleForm.dataset.editId;
        
        // Restaurar título do modal
        const modalTitle = document.querySelector('#vehicle-modal .modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = 'Adicionar Veículo';
        }
    }
    
    // Limpar imagens
    clearVehicleImages();
    
    console.log(`[INFO] ${new Date().toISOString()} - Modais fechados e formulários limpos`);
}

function handleVehicleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const editId = form.dataset.editId;
    
    // Validar se tem pelo menos uma imagem
    if (vehicleImages.length === 0) {
        showNotification('Adicione pelo menos uma imagem do veículo', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Tentativa de salvar veículo sem imagens`);
        return;
    }
    
    // Dados do formulário
    const vehicleData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        category: formData.get('category'),
        fuel: formData.get('fuel'),
        color: formData.get('color'),
        mileage: parseInt(formData.get('mileage')),
        initial_price: parseInt(formData.get('initial_price')),
        description: formData.get('description'),
        images: [...vehicleImages] // Salvar imagens
    };
    
    if (editId) {
        // MODO EDIÇÃO
        const vehicleIndex = mockVehicles.findIndex(v => v.id === parseInt(editId));
        
        if (vehicleIndex > -1) {
            // Atualizar veículo mantendo dados que não estão no formulário
            Object.assign(mockVehicles[vehicleIndex], vehicleData);
            
            showNotification(`${vehicleData.brand} ${vehicleData.model} atualizado com sucesso!`, 'success');
            console.log(`[INFO] ${new Date().toISOString()} - Veículo atualizado: ID ${editId} - ${vehicleData.brand} ${vehicleData.model} - ${vehicleImages.length} imagem(ns)`);
        } else {
            showNotification('Erro ao atualizar veículo', 'error');
            return;
        }
        
        // Limpar ID de edição
        delete form.dataset.editId;
        
        // Restaurar título do modal
        const modalTitle = document.querySelector('#vehicle-modal .modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = 'Adicionar Veículo';
        }
    } else {
        // MODO CRIAÇÃO
        const newVehicle = {
            id: mockVehicles.length > 0 ? Math.max(...mockVehicles.map(v => v.id)) + 1 : 1,
            ...vehicleData,
            current_bid: parseInt(formData.get('initial_price')),
            bid_count: 0,
            view_count: 0,
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'ativo',
            featured: false,
            documentation: 'Completa',
            condition: 'Excelente',
            maintenance: 'Em dia',
            warranty: '90 dias'
        };
        
        mockVehicles.push(newVehicle);
        
        showNotification(`${vehicleData.brand} ${vehicleData.model} adicionado com sucesso!`, 'success');
        console.log(`[INFO] ${new Date().toISOString()} - Veículo adicionado: ${vehicleData.brand} ${vehicleData.model} - ${vehicleImages.length} imagem(ns)`);
    }
    
    // Salvar no localStorage
    saveVehiclesData();
    
    // Forçar atualização da página inicial
    console.log(`[DEBUG] ${new Date().toISOString()} - Veículo salvo, localStorage atualizado`);
    
    // Fechar modal e limpar formulário
    closeAllModals();
    form.reset();
    
    // Recarregar tabela se estiver na seção de veículos
    if (currentSection === 'vehicles') {
        loadVehiclesTable();
    }
}

// ===================================
// AÇÕES DE VEÍCULOS
// ===================================
function editVehicle(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Editar veículo: ${id}`);
    
    // Buscar veículo
    const vehicle = mockVehicles.find(v => v.id === id);
    
    if (!vehicle) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }
    
    // Preencher formulário
    const form = document.getElementById('vehicle-form');
    if (!form) return;
    
    form.elements['brand'].value = vehicle.brand;
    form.elements['model'].value = vehicle.model;
    form.elements['year'].value = vehicle.year;
    form.elements['category'].value = vehicle.category;
    form.elements['fuel'].value = vehicle.fuel;
    form.elements['color'].value = vehicle.color;
    form.elements['mileage'].value = vehicle.mileage;
    form.elements['initial_price'].value = vehicle.initial_price;
    form.elements['description'].value = vehicle.description;
    
    // Carregar imagens do veículo
    loadVehicleImages(vehicle);
    
    // Alterar título do modal
    const modalTitle = document.querySelector('#vehicle-modal .modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = 'Editar Veículo';
    }
    
    // Adicionar ID ao formulário para saber que é edição
    form.dataset.editId = id;
    
    // Abrir modal
    openModal('vehicle-modal');
    
    console.log(`[INFO] ${new Date().toISOString()} - Formulário de edição carregado para veículo ${id}`);
}

function viewVehicle(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Visualizar veículo: ${id}`);
    
    // Redirecionar para página de detalhes
    window.open(`detalhes.html?id=${id}`, '_blank');
}

function deleteVehicle(id) {
    const vehicle = mockVehicles.find(v => v.id === id);
    
    if (!vehicle) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }
    
    // Confirmar exclusão com informações do veículo
    if (confirm(`Tem certeza que deseja excluir o veículo?\n\n${vehicle.brand} ${vehicle.model} ${vehicle.year}\n\nEsta ação não pode ser desfeita.`)) {
        const index = mockVehicles.findIndex(v => v.id === id);
        if (index > -1) {
            // Remover veículo
            const deletedVehicle = mockVehicles.splice(index, 1)[0];
            
            // Salvar no localStorage
            saveVehiclesData();
            
            // Recarregar tabela
            loadVehiclesTable();
            
            showNotification(`${deletedVehicle.brand} ${deletedVehicle.model} excluído com sucesso!`, 'success');
            console.log(`[INFO] ${new Date().toISOString()} - Veículo excluído: ${id} - ${deletedVehicle.brand} ${deletedVehicle.model}`);
        }
    } else {
        console.log(`[INFO] ${new Date().toISOString()} - Exclusão cancelada pelo usuário: ${id}`);
    }
}

// ===================================
// AÇÕES DE LEILÕES
// ===================================
function viewAuction(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Visualizar leilão: ${id}`);
    window.open(`detalhes.html?id=${id}`, '_blank');
}

function editAuction(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Editar leilão: ${id}`);
    showNotification('Funcionalidade de edição de leilão disponível em breve', 'info');
}

function stopAuction(id) {
    if (confirm('Tem certeza que deseja encerrar este leilão?')) {
        showNotification('Leilão encerrado com sucesso!', 'success');
        console.log(`[INFO] ${new Date().toISOString()} - Leilão encerrado: ${id}`);
        setTimeout(() => loadAuctionsTable(), 500);
    }
}

// ===================================
// AÇÕES DE USUÁRIOS
// ===================================
function viewUser(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Visualizar usuário: ${id}`);
    
    const users = StorageManager.getItem('users') || [];
    const user = users.find(u => u.id === id);
    
    if (user) {
        alert(`Informações do Usuário:\n\nNome: ${user.name}\nEmail: ${user.email}\nCPF: ${user.cpf}\nTelefone: ${user.phone}\nCadastro: ${new Date(user.created_at).toLocaleDateString('pt-BR')}`);
    } else {
        showNotification('Usuário não encontrado', 'error');
    }
}

function editUser(id) {
    console.log(`[INFO] ${new Date().toISOString()} - Editar usuário: ${id}`);
    showNotification('Funcionalidade de edição de usuário disponível em breve', 'info');
}

function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const users = StorageManager.getItem('users') || [];
        const index = users.findIndex(u => u.id === id);
        
        if (index > -1) {
            const deletedUser = users.splice(index, 1)[0];
            StorageManager.setItem('users', users);
            loadUsersTable();
            showNotification(`Usuário ${deletedUser.name} excluído com sucesso!`, 'success');
            console.log(`[INFO] ${new Date().toISOString()} - Usuário excluído: ${id}`);
        }
    }
}

// ===================================
// GERENCIAMENTO DE IMAGENS
// ===================================

/**
 * Upload de arquivo local
 */
function handleFileUpload(event) {
    const files = event.target.files;
    
    if (files.length === 0) return;
    
    console.log(`[INFO] ${new Date().toISOString()} - Upload de ${files.length} arquivo(s) iniciado`);
    
    Array.from(files).forEach(file => {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            showNotification('Apenas imagens são permitidas', 'error');
            return;
        }
        
        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Imagem muito grande. Máximo 5MB', 'error');
            return;
        }
        
        // Ler arquivo como base64
        const reader = new FileReader();
        reader.onload = (e) => {
            vehicleImages.push(e.target.result);
            renderImagesPreview();
            showNotification(`${file.name} adicionada!`, 'success');
            console.log(`[INFO] ${new Date().toISOString()} - Imagem carregada: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        };
        reader.onerror = () => {
            showNotification('Erro ao ler arquivo', 'error');
            console.error(`[ERROR] ${new Date().toISOString()} - Erro ao ler arquivo: ${file.name}`);
        };
        reader.readAsDataURL(file);
    });
    
    // Limpar input
    event.target.value = '';
}

/**
 * Adicionar imagem por URL
 */
function addImageFromUrl() {
    const input = document.getElementById('image-url-input');
    const url = input.value.trim();
    
    if (!url) {
        showNotification('Cole a URL da imagem', 'error');
        return;
    }
    
    // Validar URL
    try {
        new URL(url);
    } catch (e) {
        showNotification('URL inválida', 'error');
        return;
    }
    
    // Adicionar ao array
    vehicleImages.push(url);
    renderImagesPreview();
    
    // Limpar input
    input.value = '';
    
    showNotification('Imagem adicionada!', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Imagem adicionada por URL: ${url}`);
}

/**
 * Renderizar pré-visualização das imagens
 */
function renderImagesPreview() {
    const container = document.getElementById('images-preview');
    if (!container) return;
    
    if (vehicleImages.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = vehicleImages.map((img, index) => `
        <div class="image-preview-item" draggable="true" data-index="${index}" 
             ondragstart="handleDragStart(event)" 
             ondragover="handleDragOver(event)"
             ondrop="handleDrop(event)"
             ondragend="handleDragEnd(event)">
            <img src="${img}" alt="Imagem ${index + 1}">
            ${index === 0 ? '<span class="image-preview-badge">CAPA</span>' : ''}
            <button class="image-preview-remove" onclick="removeImage(${index})" type="button">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - ${vehicleImages.length} imagem(ns) na pré-visualização`);
}

/**
 * Remover imagem
 */
function removeImage(index) {
    const removedImage = vehicleImages.splice(index, 1)[0];
    renderImagesPreview();
    showNotification('Imagem removida', 'info');
    console.log(`[INFO] ${new Date().toISOString()} - Imagem removida: índice ${index}`);
}

/**
 * Drag and Drop para reordenar imagens
 */
let draggedIndex = null;

function handleDragStart(event) {
    draggedIndex = parseInt(event.target.dataset.index);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const dropIndex = parseInt(event.currentTarget.dataset.index);
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
        // Reordenar array
        const draggedImage = vehicleImages[draggedIndex];
        vehicleImages.splice(draggedIndex, 1);
        vehicleImages.splice(dropIndex, 0, draggedImage);
        
        renderImagesPreview();
        console.log(`[INFO] ${new Date().toISOString()} - Imagens reordenadas: ${draggedIndex} -> ${dropIndex}`);
    }
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    draggedIndex = null;
}

/**
 * Carregar imagens no modo edição
 */
function loadVehicleImages(vehicle) {
    if (vehicle && vehicle.images && Array.isArray(vehicle.images)) {
        vehicleImages = [...vehicle.images];
        renderImagesPreview();
        console.log(`[INFO] ${new Date().toISOString()} - ${vehicleImages.length} imagem(ns) carregadas para edição`);
    }
}

/**
 * Limpar imagens ao fechar modal
 */
function clearVehicleImages() {
    vehicleImages = [];
    renderImagesPreview();
    console.log(`[INFO] ${new Date().toISOString()} - Imagens do veículo limpa`);
}

// Exportar funções para uso global
window.editVehicle = editVehicle;
window.viewVehicle = viewVehicle;
window.deleteVehicle = deleteVehicle;
window.viewAuction = viewAuction;
window.editAuction = editAuction;
window.stopAuction = stopAuction;
window.viewUser = viewUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.closeModal = closeModal;
window.handleFileUpload = handleFileUpload;
window.addImageFromUrl = addImageFromUrl;
window.removeImage = removeImage;
window.handleDragStart = handleDragStart;
window.handleDragOver = handleDragOver;
window.handleDrop = handleDrop;
window.handleDragEnd = handleDragEnd;

// ===================================
// APK MANAGEMENT
// ===================================
let currentApkData = null;

function initApkManagement() {
    console.log(`[INFO] ${new Date().toISOString()} - Inicializando gerenciamento de APK`);
    
    // Carregar dados do APK
    loadApkData();
    
    // Configurar eventos
    setupApkEvents();
    
    // Atualizar estatísticas
    updateApkStats();
}

function setupApkEvents() {
    const fileInput = document.getElementById('apk-file-input');
    const uploadArea = document.getElementById('apk-upload-area');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleApkUpload);
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOverApk);
        uploadArea.addEventListener('dragleave', handleDragLeaveApk);
        uploadArea.addEventListener('drop', handleDropApk);
    }
}

function handleApkUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.apk')) {
        showNotification('Por favor, selecione um arquivo APK válido', 'error');
        return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB
        showNotification('Arquivo muito grande. Máximo 100MB', 'error');
        return;
    }
    
    // Enviar sempre via fetch para upload_apk.php
    uploadApk(file);
}

function handleDragOverApk(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeaveApk(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleDropApk(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.name.toLowerCase().endsWith('.apk')) {
            uploadApk(file);
        } else {
            showNotification('Por favor, selecione um arquivo APK válido', 'error');
        }
    }
}

function uploadApk(file) {
    console.log(`[INFO] Upload do APK iniciado: ${file.name}`);
    
    // Criar FormData para enviar arquivo
    const formData = new FormData();
    formData.append('apk', file);
    
    // Mostrar loading
    showNotification('Enviando APK...', 'info');
    
    // Enviar para PHP
    fetch(apiUrl('upload_apk.php'), {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // APK salvo na pasta!
            currentApkData = data.data;
            updateApkDisplay();
            updateApkStatus();
            
            showNotification('✅ APK salvo na pasta apk/!', 'success');
            console.log(`[SUCCESS] APK salvo: ${data.data.name}`);
        } else {
            showNotification('Erro: ' + data.error, 'error');
            console.error('[ERROR]', data.error);
        }
    })
    .catch(error => {
        showNotification('Erro ao enviar APK', 'error');
        console.error('[ERROR]', error);
    });
}

function loadApkData() {
    // Carregar APK da pasta via PHP
    fetch(apiUrl('get_apk_info.php'))
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentApkData = data.data;
            updateApkDisplay();
            updateApkStatus();
            console.log(`[INFO] APK carregado da pasta: ${data.data.name}`);
        } else {
            console.log(`[INFO] Nenhum APK na pasta`);
        }
    })
    .catch(error => {
        console.error('[ERROR] Erro ao carregar APK:', error);
    });
}

function updateApkDisplay() {
    if (!currentApkData) return;
    
    document.getElementById('apk-name').textContent = currentApkData.name;
    document.getElementById('apk-size').textContent = formatFileSize(currentApkData.size);
    document.getElementById('apk-date').textContent = formatDate(currentApkData.uploadDate);
    document.getElementById('apk-info').style.display = 'block';
}

function updateApkStatus() {
    const statusElement = document.getElementById('apk-status');
    if (currentApkData) {
        statusElement.textContent = 'Ativo';
        statusElement.className = 'status-indicator status-active';
    } else {
        statusElement.textContent = 'Não configurado';
        statusElement.className = 'status-indicator';
    }
}

function updateApkStats() {
    if (!currentApkData) {
        document.getElementById('download-count').textContent = '0';
        document.getElementById('unique-users').textContent = '0';
        document.getElementById('last-week-downloads').textContent = '0';
        return;
    }
    
    document.getElementById('download-count').textContent = currentApkData.downloadCount || 0;
    document.getElementById('unique-users').textContent = currentApkData.uniqueUsers?.size || 0;
    
    // Calcular downloads da semana (simulado)
    const lastWeekDownloads = Math.floor((currentApkData.downloadCount || 0) * 0.3);
    document.getElementById('last-week-downloads').textContent = lastWeekDownloads;
}

function downloadCurrentApk() {
    if (!currentApkData) {
        showNotification('Nenhum APK disponível', 'error');
        return;
    }
    
    const link = document.createElement('a');
    // Usar caminho absoluto da raiz para garantir download em qualquer subpasta
    link.href = '/apk/app.apk';
    link.download = 'LeilaoPremium.apk';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Incrementar contador
    currentApkData.downloadCount = (currentApkData.downloadCount || 0) + 1;
    StorageManager.setItem('apkData', currentApkData);
    updateApkStats();
    
    console.log(`[INFO] ${new Date().toISOString()} - Download do APK realizado: ${currentApkData.name}`);
}

function removeApk() {
    if (!currentApkData) return;
    
    if (confirm('Tem certeza que deseja remover o APK atual?')) {
        StorageManager.removeItem('apkData');
        StorageManager.removeItem('apkUrl');
        currentApkData = null;
        
        document.getElementById('apk-info').style.display = 'none';
        updateApkStatus();
        updateApkStats();
        
        showNotification('APK removido com sucesso', 'success');
        console.log(`[INFO] ${new Date().toISOString()} - APK removido`);
    }
}

function updateApk() {
    if (!currentApkData) {
        showNotification('Nenhum APK para atualizar', 'error');
        return;
    }
    
    document.getElementById('apk-file-input').click();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Exportar funções APK
window.downloadCurrentApk = downloadCurrentApk;
window.removeApk = removeApk;
window.updateApk = updateApk;

