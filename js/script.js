// ===================================
// DADOS SIMULADOS
// ===================================
const mockVehicles = [
    {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        category: 'carros',
        fuel: 'flex',
        color: 'Prata',
        mileage: 25000,
        current_bid: 85000,
        initial_price: 75000,
        bid_count: 15,
        view_count: 234,
        end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
        images: [
            'https://via.placeholder.com/800x600/4a90e2/ffffff?text=Toyota+Corolla+1',
            'https://via.placeholder.com/800x600/50c878/ffffff?text=Toyota+Corolla+2',
            'https://via.placeholder.com/800x600/f39c12/ffffff?text=Toyota+Corolla+3',
            'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Toyota+Corolla+4'
        ],
        description: 'Toyota Corolla em excelente estado de conservação. Único dono, todas as revisões em dia.',
        documentation: 'Completa',
        condition: 'Excelente',
        maintenance: 'Em dia',
        warranty: '90 dias',
        status: 'ativo',
        featured: true
    },
    {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        category: 'carros',
        fuel: 'gasolina',
        color: 'Preto',
        mileage: 15000,
        current_bid: 120000,
        initial_price: 110000,
        bid_count: 28,
        view_count: 456,
        end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
        images: [
            'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Honda+Civic+1',
            'https://via.placeholder.com/800x600/34495e/ffffff?text=Honda+Civic+2'
        ],
        description: 'Honda Civic novo, baixa quilometragem, completo.',
        documentation: 'Completa',
        condition: 'Excelente',
        maintenance: 'Em dia',
        warranty: '1 ano',
        status: 'ativo',
        featured: true
    },
    {
        id: 3,
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2021,
        category: 'carros',
        fuel: 'flex',
        color: 'Branco',
        mileage: 35000,
        current_bid: 72000,
        initial_price: 65000,
        bid_count: 12,
        view_count: 189,
        end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
        images: [
            'https://via.placeholder.com/800x600/9b59b6/ffffff?text=VW+Golf+1',
            'https://via.placeholder.com/800x600/8e44ad/ffffff?text=VW+Golf+2'
        ],
        description: 'Volkswagen Golf em ótimo estado.',
        documentation: 'Completa',
        condition: 'Muito Bom',
        maintenance: 'Em dia',
        warranty: '60 dias',
        status: 'ativo',
        featured: true
    },
    {
        id: 4,
        brand: 'Ford',
        model: 'Ranger',
        year: 2022,
        category: 'utilitarios',
        fuel: 'diesel',
        color: 'Cinza',
        mileage: 28000,
        current_bid: 155000,
        initial_price: 145000,
        bid_count: 22,
        view_count: 312,
        end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 dias
        images: [
            'https://via.placeholder.com/800x600/16a085/ffffff?text=Ford+Ranger+1',
            'https://via.placeholder.com/800x600/1abc9c/ffffff?text=Ford+Ranger+2'
        ],
        description: 'Ford Ranger 4x4 diesel, perfeita para trabalho.',
        documentation: 'Completa',
        condition: 'Excelente',
        maintenance: 'Em dia',
        warranty: '120 dias',
        status: 'ativo',
        featured: true
    },
    {
        id: 5,
        brand: 'Yamaha',
        model: 'MT-07',
        year: 2023,
        category: 'motos',
        fuel: 'gasolina',
        color: 'Azul',
        mileage: 5000,
        current_bid: 42000,
        initial_price: 38000,
        bid_count: 18,
        view_count: 267,
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        images: [
            'https://via.placeholder.com/800x600/3498db/ffffff?text=Yamaha+MT07+1',
            'https://via.placeholder.com/800x600/2980b9/ffffff?text=Yamaha+MT07+2'
        ],
        description: 'Yamaha MT-07 praticamente nova.',
        documentation: 'Completa',
        condition: 'Excelente',
        maintenance: 'Em dia',
        warranty: '1 ano',
        status: 'ativo',
        featured: true
    },
    {
        id: 6,
        brand: 'Mercedes-Benz',
        model: 'Actros',
        year: 2020,
        category: 'caminhoes',
        fuel: 'diesel',
        color: 'Branco',
        mileage: 120000,
        current_bid: 280000,
        initial_price: 260000,
        bid_count: 8,
        view_count: 145,
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        images: [
            'https://via.placeholder.com/800x600/e67e22/ffffff?text=MB+Actros+1',
            'https://via.placeholder.com/800x600/d35400/ffffff?text=MB+Actros+2'
        ],
        description: 'Mercedes-Benz Actros para transporte pesado.',
        documentation: 'Completa',
        condition: 'Muito Bom',
        maintenance: 'Em dia',
        warranty: '90 dias',
        status: 'ativo',
        featured: false
    }
];

// ===================================
// FUNÇÕES AUXILIARES
// ===================================
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

function calculateTimeRemaining(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, expired: false };
}

function formatTimeRemaining(time) {
    if (time.expired) return 'Encerrado';
    if (time.days > 0) return `${time.days}d ${time.hours}h`;
    if (time.hours > 0) return `${time.hours}h ${time.minutes}m`;
    return `${time.minutes}m ${time.seconds}s`;
}

// ===================================
// RENDERIZAÇÃO DE VEÍCULOS
// ===================================
function renderVehicleCard(vehicle) {
    const timeRemaining = calculateTimeRemaining(vehicle.end_date);
    const timeText = formatTimeRemaining(timeRemaining);
    
    return `
        <div class="auction-card" onclick="window.location.href='detalhes.html?id=${vehicle.id}'">
            <div class="auction-card-image">
                <img src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}">
                ${vehicle.featured ? '<div class="auction-badge">Destaque</div>' : ''}
            </div>
            <div class="auction-card-content">
                <h3 class="auction-card-title">${vehicle.brand} ${vehicle.model}</h3>
                <div class="auction-card-info">
                    <span><i class="fas fa-calendar"></i> ${vehicle.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${formatNumber(vehicle.mileage)} km</span>
                </div>
                <div class="auction-card-price">
                    <div>
                        <small style="color: #666;">Lance Atual</small>
                        <div class="current-price">${formatCurrency(vehicle.current_bid)}</div>
                    </div>
                </div>
                <div class="auction-card-timer">
                    <i class="fas fa-clock"></i> ${timeText}
                </div>
                <div class="auction-card-actions">
                    <button class="btn-primary" onclick="event.stopPropagation(); checkLoginAndRedirect('detalhes.html?id=${vehicle.id}')">
                        <i class="fas fa-gavel"></i> Dar Lance
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===================================
// PÁGINA INICIAL
// ===================================
function loadFeaturedAuctions() {
    const container = document.getElementById('featured-auctions');
    if (!container) return;
    
    const featuredVehicles = mockVehicles.filter(v => v.featured).slice(0, 6);
    
    if (featuredVehicles.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-car"></i><p>Nenhum leilão em destaque no momento.</p></div>';
        return;
    }
    
    container.innerHTML = featuredVehicles.map(vehicle => renderVehicleCard(vehicle)).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - Carregados ${featuredVehicles.length} leilões em destaque na página inicial`);
}

// ===================================
// CATEGORIAS
// ===================================
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `catalogo.html?category=${category}`;
            console.log(`[INFO] ${new Date().toISOString()} - Usuário clicou na categoria: ${category}`);
        });
    });
}

// ===================================
// VERIFICAÇÃO DE LOGIN
// ===================================
function checkLoginAndRedirect(targetUrl) {
    const user = StorageManager.getItem('user');
    
    if (!user) {
        // Mostrar modal de confirmação
        const confirmed = confirm(
            'Você precisa estar logado para dar lances.\n\n' +
            'Clique em "OK" para ir para a tela de login ou "Cancelar" para continuar navegando.'
        );
        
        if (confirmed) {
            // Salvar URL de destino para retornar após login
            StorageManager.setItem('returnUrl', targetUrl);
            
            showNotification('Redirecionando para login...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
        
        console.log(`[INFO] ${new Date().toISOString()} - Usuário não logado tentou acessar: ${targetUrl}`);
        return false;
    }
    
    // Usuário logado, redirecionar normalmente
    console.log(`[INFO] ${new Date().toISOString()} - Usuário logado redirecionando para: ${targetUrl}`);
    window.location.href = targetUrl;
    return true;
}

// ===================================
// MENU MOBILE
// ===================================
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');
    
    if (menuToggle && nav) {
        // Toggle menu ao clicar no botão
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            
            // Mudar ícone
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
            
            console.log(`[INFO] ${new Date().toISOString()} - Menu mobile ${nav.classList.contains('active') ? 'aberto' : 'fechado'}`);
        });
        
        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = '';
                
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
                
                console.log(`[INFO] ${new Date().toISOString()} - Menu mobile fechado ao clicar no link`);
            });
        });
        
        // Fechar menu ao clicar fora
        nav.addEventListener('click', (e) => {
            if (e.target === nav) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
                
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
                
                console.log(`[INFO] ${new Date().toISOString()} - Menu mobile fechado ao clicar fora`);
            }
        });
    }
}

// ===================================
// BUSCA NO HERO
// ===================================
function setupHeroSearch() {
    const heroSearch = document.querySelector('.hero-search');
    
    if (heroSearch) {
        const input = heroSearch.querySelector('input');
        const button = heroSearch.querySelector('button');
        
        const performSearch = () => {
            const searchTerm = input.value.trim();
            if (searchTerm) {
                window.location.href = `catalogo.html?search=${encodeURIComponent(searchTerm)}`;
                console.log(`[INFO] ${new Date().toISOString()} - Busca realizada: ${searchTerm}`);
            }
        };
        
        button.addEventListener('click', performSearch);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// ===================================
// ARMAZENAMENTO LOCAL
// ===================================
const StorageManager = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`[INFO] ${new Date().toISOString()} - Item salvo no localStorage: ${key}`);
            return true;
        } catch (e) {
            console.error(`[ERROR] ${new Date().toISOString()} - Erro ao salvar no localStorage:`, e);
            return false;
        }
    },
    
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`[ERROR] ${new Date().toISOString()} - Erro ao ler do localStorage:`, e);
            return null;
        }
    },
    
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            console.log(`[INFO] ${new Date().toISOString()} - Item removido do localStorage: ${key}`);
            return true;
        } catch (e) {
            console.error(`[ERROR] ${new Date().toISOString()} - Erro ao remover do localStorage:`, e);
            return false;
        }
    }
};

// ===================================
// SISTEMA DE NOTIFICAÇÕES
// ===================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#50c878' : type === 'error' ? '#e74c3c' : '#4a90e2'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    console.log(`[INFO] ${new Date().toISOString()} - Notificação exibida [${type}]: ${message}`);
}

// Adicionar animações CSS
if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// GERENCIADOR DE VEÍCULOS
// ===================================
const VehicleManager = {
    getAll() {
        return mockVehicles;
    },
    
    getById(id) {
        return mockVehicles.find(v => v.id === parseInt(id));
    },
    
    getByCategory(category) {
        return mockVehicles.filter(v => v.category === category);
    },
    
    search(term) {
        const searchTerm = term.toLowerCase();
        return mockVehicles.filter(v => 
            v.brand.toLowerCase().includes(searchTerm) ||
            v.model.toLowerCase().includes(searchTerm) ||
            v.category.toLowerCase().includes(searchTerm)
        );
    },
    
    filter(filters) {
        let results = [...mockVehicles];
        
        if (filters.category && filters.category.length > 0) {
            results = results.filter(v => filters.category.includes(v.category));
        }
        
        if (filters.fuel && filters.fuel.length > 0) {
            results = results.filter(v => filters.fuel.includes(v.fuel));
        }
        
        if (filters.yearMin) {
            results = results.filter(v => v.year >= parseInt(filters.yearMin));
        }
        
        if (filters.yearMax) {
            results = results.filter(v => v.year <= parseInt(filters.yearMax));
        }
        
        if (filters.priceRange) {
            results = results.filter(v => {
                for (const range of filters.priceRange) {
                    const [min, max] = range.split('-').map(p => parseInt(p));
                    if (max) {
                        if (v.current_bid >= min && v.current_bid <= max) return true;
                    } else {
                        if (v.current_bid >= min) return true;
                    }
                }
                return false;
            });
        }
        
        if (filters.status && filters.status !== 'all') {
            results = results.filter(v => v.status === filters.status);
        }
        
        console.log(`[INFO] ${new Date().toISOString()} - Filtros aplicados. Resultados: ${results.length}`);
        return results;
    },
    
    sort(vehicles, sortBy) {
        const sorted = [...vehicles];
        
        switch (sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => a.current_bid - b.current_bid);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.current_bid - a.current_bid);
                break;
            case 'ending-soon':
                sorted.sort((a, b) => a.end_date - b.end_date);
                break;
            case 'recent':
            default:
                sorted.sort((a, b) => b.id - a.id);
                break;
        }
        
        console.log(`[INFO] ${new Date().toISOString()} - Veículos ordenados por: ${sortBy}`);
        return sorted;
    }
};

// ===================================
// CARREGAR VEÍCULOS DO LOCALSTORAGE
// ===================================
function loadVehiclesFromStorage() {
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    if (savedVehicles && savedVehicles.length > 0) {
        console.log(`[INFO] ${new Date().toISOString()} - Carregando ${savedVehicles.length} veículos do localStorage`);
        
        // Limpar mockVehicles primeiro
        mockVehicles.length = 0;
        
        // Adicionar veículos salvos e converter end_date para Date
        savedVehicles.forEach(saved => {
            // Converter end_date de string para Date
            if (saved.end_date && typeof saved.end_date === 'string') {
                saved.end_date = new Date(saved.end_date);
            }
            mockVehicles.push(saved);
            console.log(`[DEBUG] ${new Date().toISOString()} - Carregado: ${saved.brand} ${saved.model} - ${saved.images ? saved.images.length : 0} imagens`);
        });
        
        console.log(`[INFO] ${new Date().toISOString()} - Total de ${mockVehicles.length} veículos disponíveis`);
    } else {
        console.log(`[INFO] ${new Date().toISOString()} - Nenhum veículo encontrado no localStorage`);
    }
}

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[INFO] ${new Date().toISOString()} - Aplicação iniciada`);
    
    // Carregar veículos salvos
    loadVehiclesFromStorage();
    
    // Carregar leilões em destaque
    loadFeaturedAuctions();
    
    // Configurar cards de categoria
    setupCategoryCards();
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Configurar busca no hero
    setupHeroSearch();
    
    // Atualizar contadores a cada segundo
    setInterval(() => {
        const timers = document.querySelectorAll('.auction-card-timer');
        timers.forEach(timer => {
            // Atualização será feita ao recarregar os cards
        });
    }, 1000);
    
    console.log(`[INFO] ${new Date().toISOString()} - Inicialização concluída`);
});

// ===================================
// DOWNLOAD DO APP
// ===================================
// Base de URL para chamadas PHP quando a página é aberta via file://
const API_BASE_PUBLIC = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? ''
  : 'http://localhost/Minhas%20telas/LEILAO/';

function publicApiUrl(path) {
    return API_BASE_PUBLIC + path;
}

function downloadApp(platform) {
    console.log(`[INFO] Download do APK`);
    
    // Verificar se APK existe na pasta
    fetch(publicApiUrl('get_apk_info.php'))
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // APK existe, fazer download direto da pasta
            const link = document.createElement('a');
            link.href = publicApiUrl('apk/app.apk');
            link.download = 'LeilaoPremium.apk';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Download iniciado!', 'success');
            console.log(`[SUCCESS] Download do APK: ${data.data.name}`);
        } else {
            showNotification('APK ainda não disponível', 'error');
            console.log(`[INFO] APK não encontrado na pasta`);
        }
    })
    .catch(error => {
        console.error('[ERROR]', error);
        showNotification('Erro ao verificar APK', 'error');
    });
}

// Exportar para uso global
window.VehicleManager = VehicleManager;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.calculateTimeRemaining = calculateTimeRemaining;
window.formatTimeRemaining = formatTimeRemaining;
window.showNotification = showNotification;
window.StorageManager = StorageManager;
window.downloadApp = downloadApp;
window.mockVehicles = mockVehicles;

