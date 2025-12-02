// ===================================
// CATÁLOGO DE VEÍCULOS
// ===================================

let currentPage = 1;
const itemsPerPage = 12;
let filteredVehicles = [];
let currentFilters = {
    category: [],
    fuel: [],
    priceRange: [],
    yearMin: null,
    yearMax: null,
    status: 'all'
};

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
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[INFO] ${new Date().toISOString()} - Página de catálogo carregada`);
    
    // Carregar veículos do localStorage
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    if (savedVehicles && savedVehicles.length > 0) {
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
        console.log(`[INFO] ${new Date().toISOString()} - ${savedVehicles.length} veículos carregados do localStorage`);
    } else {
        console.log(`[INFO] ${new Date().toISOString()} - Nenhum veículo encontrado no localStorage`);
    }
    
    // Verificar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    const category = urlParams.get('category');
    
    if (searchTerm) {
        performSearch(searchTerm);
    } else if (category) {
        applyQuickFilter('category', category);
    } else {
        loadVehicles();
    }
    
    // Configurar filtros
    setupFilters();
    
    // Configurar ordenação
    setupSorting();
    
    // Configurar paginação
    setupPagination();
    
    console.log(`[INFO] ${new Date().toISOString()} - Catálogo inicializado`);
});

// ===================================
// CARREGAMENTO DE VEÍCULOS
// ===================================
function loadVehicles() {
    console.log(`[INFO] ${new Date().toISOString()} - Carregando veículos do catálogo`);
    
    // Obter todos os veículos
    let vehicles = VehicleManager.getAll();
    
    // Aplicar filtros
    filteredVehicles = VehicleManager.filter(currentFilters);
    
    // Aplicar ordenação
    const sortValue = document.getElementById('sort-select')?.value || 'recent';
    filteredVehicles = VehicleManager.sort(filteredVehicles, sortValue);
    
    // Atualizar contagem
    updateResultsCount();
    
    // Renderizar página atual
    renderCurrentPage();
    
    // Atualizar paginação
    updatePagination();
    
    console.log(`[INFO] ${new Date().toISOString()} - ${filteredVehicles.length} veículos carregados após filtros`);
}

// ===================================
// RENDERIZAÇÃO
// ===================================
function renderCurrentPage() {
    const container = document.getElementById('vehicles-grid');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    if (pageVehicles.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h3>Nenhum veículo encontrado</h3>
                <p>Tente ajustar seus filtros de busca</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pageVehicles.map(vehicle => {
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
                    <div class="auction-card-info">
                        <span><i class="fas fa-gas-pump"></i> ${vehicle.fuel}</span>
                        <span><i class="fas fa-palette"></i> ${vehicle.color}</span>
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
    }).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - Renderizados ${pageVehicles.length} veículos na página ${currentPage}`);
}

// ===================================
// FILTROS
// ===================================
function setupFilters() {
    // Filtros de categoria
    const categoryFilters = document.querySelectorAll('input[name="category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentFilters.category.push(e.target.value);
            } else {
                currentFilters.category = currentFilters.category.filter(c => c !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Filtros de combustível
    const fuelFilters = document.querySelectorAll('input[name="fuel"]');
    fuelFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentFilters.fuel.push(e.target.value);
            } else {
                currentFilters.fuel = currentFilters.fuel.filter(f => f !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Filtros de preço
    const priceFilters = document.querySelectorAll('input[name="price"]');
    priceFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentFilters.priceRange.push(e.target.value);
            } else {
                currentFilters.priceRange = currentFilters.priceRange.filter(p => p !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Filtros de ano
    const yearMinSelect = document.querySelector('select[name="year-min"]');
    const yearMaxSelect = document.querySelector('select[name="year-max"]');
    
    if (yearMinSelect) {
        yearMinSelect.addEventListener('change', (e) => {
            currentFilters.yearMin = e.target.value || null;
            applyFilters();
        });
    }
    
    if (yearMaxSelect) {
        yearMaxSelect.addEventListener('change', (e) => {
            currentFilters.yearMax = e.target.value || null;
            applyFilters();
        });
    }
    
    // Filtro de status
    const statusFilters = document.querySelectorAll('input[name="status"]');
    statusFilters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentFilters.status = e.target.value;
                applyFilters();
            }
        });
    });
    
    // Botão limpar filtros
    const clearBtn = document.querySelector('.btn-clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
    
    console.log(`[INFO] ${new Date().toISOString()} - Filtros configurados`);
}

function applyFilters() {
    currentPage = 1;
    loadVehicles();
    console.log(`[INFO] ${new Date().toISOString()} - Filtros aplicados:`, currentFilters);
}

function applyQuickFilter(type, value) {
    if (type === 'category') {
        currentFilters.category = [value];
        const checkbox = document.querySelector(`input[name="category"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
    }
    applyFilters();
}

function clearFilters() {
    // Limpar objeto de filtros
    currentFilters = {
        category: [],
        fuel: [],
        priceRange: [],
        yearMin: null,
        yearMax: null,
        status: 'all'
    };
    
    // Desmarcar checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Resetar selects
    document.querySelectorAll('select').forEach(select => select.value = '');
    
    // Marcar status "all"
    const allRadio = document.querySelector('input[name="status"][value="all"]');
    if (allRadio) allRadio.checked = true;
    
    applyFilters();
    showNotification('Filtros limpos', 'info');
    console.log(`[INFO] ${new Date().toISOString()} - Filtros limpos`);
}

// ===================================
// ORDENAÇÃO
// ===================================
function setupSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            loadVehicles();
            console.log(`[INFO] ${new Date().toISOString()} - Ordenação alterada para: ${sortSelect.value}`);
        });
    }
}

// ===================================
// PAGINAÇÃO
// ===================================
function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCurrentPage();
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.log(`[INFO] ${new Date().toISOString()} - Navegado para página ${currentPage}`);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderCurrentPage();
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.log(`[INFO] ${new Date().toISOString()} - Navegado para página ${currentPage}`);
            }
        });
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById('page-numbers');
    
    if (!pageNumbersContainer) return;
    
    let pagesHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `
            <div class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </div>
        `;
    }
    
    pageNumbersContainer.innerHTML = pagesHTML;
    
    // Desabilitar botões quando necessário
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function goToPage(page) {
    currentPage = page;
    renderCurrentPage();
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(`[INFO] ${new Date().toISOString()} - Navegado diretamente para página ${page}`);
}

// ===================================
// BUSCA
// ===================================
function performSearch(term) {
    filteredVehicles = VehicleManager.search(term);
    currentPage = 1;
    updateResultsCount();
    renderCurrentPage();
    updatePagination();
    
    showNotification(`${filteredVehicles.length} resultado(s) encontrado(s) para "${term}"`, 'info');
    console.log(`[INFO] ${new Date().toISOString()} - Busca realizada: "${term}" - ${filteredVehicles.length} resultados`);
}

// ===================================
// ATUALIZAÇÃO DE CONTADORES
// ===================================
function updateResultsCount() {
    const countElement = document.getElementById('results-count');
    if (countElement) {
        countElement.textContent = filteredVehicles.length;
    }
}

// Exportar funções para uso global
window.goToPage = goToPage;
window.applyQuickFilter = applyQuickFilter;

