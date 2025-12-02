// ===================================
// PÁGINA DE DETALHES DO VEÍCULO
// ===================================

let currentVehicle = null;
let currentImageIndex = 0;
let countdownInterval = null;
let bidHistory = [];

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[INFO] ${new Date().toISOString()} - Página de detalhes carregada`);
    
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
    
    // Obter ID do veículo da URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    
    if (!vehicleId) {
        showNotification('Veículo não encontrado', 'error');
        setTimeout(() => window.location.href = 'catalogo.html', 2000);
        return;
    }
    
    // Carregar veículo
    loadVehicle(vehicleId);
    
    // Configurar galeria
    setupGallery();
    
    // Configurar sistema de lances
    setupBidding();
    
    // Configurar ações
    setupActions();
    
    // Carregar veículos relacionados
    loadRelatedVehicles();
    
    // Configurar zoom de imagem
    setupImageZoom();
    
    console.log(`[INFO] ${new Date().toISOString()} - Detalhes do veículo ${vehicleId} inicializados`);
});

// ===================================
// CARREGAMENTO DO VEÍCULO
// ===================================
function loadVehicle(id) {
    currentVehicle = VehicleManager.getById(id);
    
    if (!currentVehicle) {
        showNotification('Veículo não encontrado', 'error');
        setTimeout(() => window.location.href = 'catalogo.html', 2000);
        console.error(`[ERROR] ${new Date().toISOString()} - Veículo ${id} não encontrado`);
        return;
    }
    
    // Atualizar título da página e breadcrumb
    document.title = `${currentVehicle.brand} ${currentVehicle.model} - Leilão de Veículos`;
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = `${currentVehicle.brand} ${currentVehicle.model}`;
    }
    
    // Renderizar informações
    renderVehicleInfo();
    renderGallery();
    renderSpecs();
    renderDescription();
    renderDocumentation();
    
    // Iniciar countdown
    startCountdown();
    
    // Gerar histórico de lances simulado
    generateBidHistory();
    
    // Incrementar visualizações
    currentVehicle.view_count++;
    
    console.log(`[INFO] ${new Date().toISOString()} - Veículo ${currentVehicle.brand} ${currentVehicle.model} carregado`);
}

// ===================================
// RENDERIZAÇÃO
// ===================================
function renderVehicleInfo() {
    const titleElement = document.getElementById('vehicle-title');
    if (titleElement) {
        titleElement.textContent = `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.year}`;
    }
    
    const currentBidElement = document.getElementById('current-bid');
    if (currentBidElement) {
        currentBidElement.textContent = formatCurrency(currentVehicle.current_bid);
    }
    
    const bidCountElement = document.getElementById('bid-count');
    if (bidCountElement) {
        bidCountElement.textContent = currentVehicle.bid_count;
    }
    
    const viewCountElement = document.getElementById('view-count');
    if (viewCountElement) {
        viewCountElement.textContent = currentVehicle.view_count;
    }
}

function renderGallery() {
    const mainImage = document.getElementById('main-image');
    if (mainImage && currentVehicle.images.length > 0) {
        mainImage.src = currentVehicle.images[0];
        mainImage.alt = `${currentVehicle.brand} ${currentVehicle.model}`;
    }
    
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    if (thumbnailGallery) {
        thumbnailGallery.innerHTML = currentVehicle.images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
                <img src="${img}" alt="Imagem ${index + 1}">
            </div>
        `).join('');
    }
}

function renderSpecs() {
    const specsGrid = document.getElementById('specs-grid');
    if (!specsGrid) return;
    
    const specs = [
        { label: 'Marca', value: currentVehicle.brand, icon: 'car' },
        { label: 'Modelo', value: currentVehicle.model, icon: 'tag' },
        { label: 'Ano', value: currentVehicle.year, icon: 'calendar' },
        { label: 'Categoria', value: currentVehicle.category.charAt(0).toUpperCase() + currentVehicle.category.slice(1), icon: 'layer-group' },
        { label: 'Combustível', value: currentVehicle.fuel.charAt(0).toUpperCase() + currentVehicle.fuel.slice(1), icon: 'gas-pump' },
        { label: 'Cor', value: currentVehicle.color, icon: 'palette' },
        { label: 'Quilometragem', value: `${formatNumber(currentVehicle.mileage)} km`, icon: 'tachometer-alt' },
        { label: 'Preço Inicial', value: formatCurrency(currentVehicle.initial_price), icon: 'dollar-sign' }
    ];
    
    specsGrid.innerHTML = specs.map(spec => `
        <div class="spec-item">
            <div class="spec-label"><i class="fas fa-${spec.icon}"></i> ${spec.label}</div>
            <div class="spec-value">${spec.value}</div>
        </div>
    `).join('');
}

function renderDescription() {
    const descriptionElement = document.getElementById('description');
    if (descriptionElement) {
        descriptionElement.innerHTML = `<p>${currentVehicle.description}</p>`;
    }
}

function renderDocumentation() {
    const docStatus = document.getElementById('doc-status');
    const condition = document.getElementById('condition');
    const maintenance = document.getElementById('maintenance');
    const warranty = document.getElementById('warranty');
    
    if (docStatus) docStatus.textContent = currentVehicle.documentation;
    if (condition) condition.textContent = currentVehicle.condition;
    if (maintenance) maintenance.textContent = currentVehicle.maintenance;
    if (warranty) warranty.textContent = currentVehicle.warranty;
}

// ===================================
// GALERIA DE IMAGENS
// ===================================
function setupGallery() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentVehicle && currentVehicle.images.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + currentVehicle.images.length) % currentVehicle.images.length;
                changeImage(currentImageIndex);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentVehicle && currentVehicle.images.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % currentVehicle.images.length;
                changeImage(currentImageIndex);
            }
        });
    }
}

function changeImage(index) {
    if (!currentVehicle) return;
    
    currentImageIndex = index;
    const mainImage = document.getElementById('main-image');
    
    if (mainImage) {
        mainImage.src = currentVehicle.images[index];
    }
    
    // Atualizar thumbnails ativos
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    console.log(`[INFO] ${new Date().toISOString()} - Imagem alterada para índice ${index}`);
}

// ===================================
// COUNTDOWN
// ===================================
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    function updateCountdown() {
        const time = calculateTimeRemaining(currentVehicle.end_date);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(time.days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(time.hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(time.minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(time.seconds).padStart(2, '0');
        
        if (time.expired) {
            clearInterval(countdownInterval);
            showNotification('Leilão encerrado!', 'info');
        }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ===================================
// SISTEMA DE LANCES
// ===================================
function setupBidding() {
    const bidInput = document.getElementById('bid-amount');
    const bidBtn = document.getElementById('btn-place-bid');
    
    // Definir valor mínimo do lance
    if (bidInput && currentVehicle) {
        bidInput.min = currentVehicle.current_bid + 500;
        bidInput.value = currentVehicle.current_bid + 500;
    }
    
    // Botão de dar lance
    if (bidBtn) {
        bidBtn.addEventListener('click', placeBid);
    }
    
    // Enter para dar lance
    if (bidInput) {
        bidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') placeBid();
        });
    }
    
    // Botões de lance rápido
    const quickBidButtons = document.querySelectorAll('.btn-quick-bid');
    quickBidButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const increment = parseInt(btn.dataset.increment);
            if (bidInput) {
                const currentValue = parseInt(bidInput.value) || currentVehicle.current_bid;
                bidInput.value = currentValue + increment;
            }
        });
    });
}

function placeBid() {
    const bidInput = document.getElementById('bid-amount');
    const bidValue = parseInt(bidInput.value);
    
    // Verificar se o usuário está logado
    if (!checkUserLogin()) {
        return;
    }
    
    // Validar valor do lance
    if (!bidValue || bidValue <= currentVehicle.current_bid) {
        showNotification('O lance deve ser maior que o lance atual', 'error');
        return;
    }
    
    // Simular dar lance
    currentVehicle.current_bid = bidValue;
    currentVehicle.bid_count++;
    
    // Atualizar interface
    renderVehicleInfo();
    
    // Atualizar valor mínimo do próximo lance
    bidInput.min = bidValue + 500;
    bidInput.value = bidValue + 500;
    
    // Adicionar ao histórico
    addBidToHistory({
        user: 'Você',
        amount: bidValue,
        time: new Date()
    });
    
    showNotification('Lance realizado com sucesso!', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Lance de ${formatCurrency(bidValue)} realizado com sucesso`);
}

// ===================================
// HISTÓRICO DE LANCES
// ===================================
function generateBidHistory() {
    bidHistory = [];
    const users = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza'];
    
    // Gerar histórico simulado
    let currentAmount = currentVehicle.initial_price;
    const numBids = Math.min(currentVehicle.bid_count, 10);
    const increment = (currentVehicle.current_bid - currentVehicle.initial_price) / numBids;
    
    for (let i = 0; i < numBids; i++) {
        currentAmount += increment;
        bidHistory.push({
            user: users[Math.floor(Math.random() * users.length)],
            amount: Math.round(currentAmount),
            time: new Date(Date.now() - (numBids - i) * 60000) // 1 minuto de diferença
        });
    }
    
    bidHistory.reverse(); // Mais recentes primeiro
    renderBidHistory();
}

function addBidToHistory(bid) {
    bidHistory.unshift(bid);
    renderBidHistory();
}

function renderBidHistory() {
    const historyContainer = document.getElementById('bid-history');
    if (!historyContainer) return;
    
    if (bidHistory.length === 0) {
        historyContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 1rem;">Nenhum lance ainda</p>';
        return;
    }
    
    historyContainer.innerHTML = bidHistory.map(bid => {
        const timeAgo = getTimeAgo(bid.time);
        return `
            <div class="bid-item">
                <div>
                    <div class="bid-user">${bid.user}</div>
                    <div class="bid-time">${timeAgo}</div>
                </div>
                <div class="bid-amount">${formatCurrency(bid.amount)}</div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h atrás`;
    return `${Math.floor(seconds / 86400)} dias atrás`;
}

// ===================================
// AÇÕES
// ===================================
function setupActions() {
    // Favoritar
    const favoriteBtn = document.getElementById('btn-favorite');
    if (favoriteBtn) {
        // Verificar se já está favoritado
        const favorites = StorageManager.getItem('favorites') || [];
        const isFavorited = favorites.includes(currentVehicle.id);
        
        if (isFavorited) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favoritado';
            favoriteBtn.style.background = '#e74c3c';
            favoriteBtn.style.color = 'white';
        }
        
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    // Compartilhar
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareVehicle);
    }
}

function toggleFavorite() {
    const favorites = StorageManager.getItem('favorites') || [];
    const favoriteBtn = document.getElementById('btn-favorite');
    
    const index = favorites.indexOf(currentVehicle.id);
    if (index > -1) {
        // Remover dos favoritos
        favorites.splice(index, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Favoritar';
        favoriteBtn.style.background = '';
        favoriteBtn.style.color = '';
        showNotification('Removido dos favoritos', 'info');
        console.log(`[INFO] ${new Date().toISOString()} - Veículo ${currentVehicle.id} removido dos favoritos`);
    } else {
        // Adicionar aos favoritos
        favorites.push(currentVehicle.id);
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favoritado';
        favoriteBtn.style.background = '#e74c3c';
        favoriteBtn.style.color = 'white';
        showNotification('Adicionado aos favoritos!', 'success');
        console.log(`[INFO] ${new Date().toISOString()} - Veículo ${currentVehicle.id} adicionado aos favoritos`);
    }
    
    StorageManager.setItem('favorites', favorites);
}

function shareVehicle() {
    const url = window.location.href;
    const title = `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.year}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Confira este leilão: ${title}`,
            url: url
        }).then(() => {
            showNotification('Compartilhado com sucesso!', 'success');
            console.log(`[INFO] ${new Date().toISOString()} - Veículo compartilhado via Web Share API`);
        }).catch(() => {
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Link copiado para a área de transferência!', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Link copiado para clipboard`);
}

// ===================================
// VEÍCULOS RELACIONADOS
// ===================================
function loadRelatedVehicles() {
    const container = document.getElementById('related-vehicles');
    if (!container || !currentVehicle) return;
    
    // Buscar veículos da mesma categoria
    const related = VehicleManager.getByCategory(currentVehicle.category)
        .filter(v => v.id !== currentVehicle.id)
        .slice(0, 3);
    
    if (related.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Nenhum veículo relacionado encontrado</p>';
        return;
    }
    
    container.innerHTML = related.map(vehicle => {
        const timeRemaining = calculateTimeRemaining(vehicle.end_date);
        const timeText = formatTimeRemaining(timeRemaining);
        
        return `
            <div class="auction-card" onclick="window.location.href='detalhes.html?id=${vehicle.id}'">
                <div class="auction-card-image">
                    <img src="${vehicle.images[0]}" alt="${vehicle.brand} ${vehicle.model}">
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
                </div>
            </div>
        `;
    }).join('');
    
    console.log(`[INFO] ${new Date().toISOString()} - ${related.length} veículos relacionados carregados`);
}

// ===================================
// VERIFICAÇÃO DE LOGIN
// ===================================
function checkUserLogin() {
    const user = StorageManager.getItem('user');
    
    if (!user) {
        // Mostrar modal de confirmação
        const confirmed = confirm(
            'Você precisa estar logado para dar lances.\n\n' +
            'Clique em "OK" para ir para a tela de login ou "Cancelar" para continuar navegando.'
        );
        
        if (confirmed) {
            // Salvar URL atual para retornar após login
            const currentUrl = window.location.href;
            StorageManager.setItem('returnUrl', currentUrl);
            
            showNotification('Redirecionando para login...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
        
        console.log(`[INFO] ${new Date().toISOString()} - Usuário não logado tentou dar lance`);
        return false;
    }
    
    console.log(`[INFO] ${new Date().toISOString()} - Usuário logado: ${user.name}`);
    return true;
}

// ===================================
// ZOOM DE IMAGEM
// ===================================
let zoomModal = null;
let zoomImage = null;
let zoomCurrentIndex = 0;
let isZoomed = false;

function setupImageZoom() {
    zoomModal = document.getElementById('image-zoom-modal');
    zoomImage = document.getElementById('zoom-image');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomPrev = document.querySelector('.zoom-prev');
    const zoomNext = document.querySelector('.zoom-next');
    const mainImage = document.getElementById('main-image');
    
    // Abrir zoom ao clicar na imagem principal
    if (mainImage) {
        mainImage.addEventListener('click', () => {
            if (currentVehicle && currentVehicle.images.length > 0) {
                openZoom(currentImageIndex);
            }
        });
    }
    
    // Fechar modal
    if (zoomClose) {
        zoomClose.addEventListener('click', closeZoom);
    }
    
    // Fechar ao clicar fora da imagem
    if (zoomModal) {
        zoomModal.addEventListener('click', (e) => {
            if (e.target === zoomModal) {
                closeZoom();
            }
        });
    }
    
    // Navegação no zoom
    if (zoomPrev) {
        zoomPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateZoom(-1);
        });
    }
    
    if (zoomNext) {
        zoomNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateZoom(1);
        });
    }
    
    // Zoom in/out ao clicar na imagem
    if (zoomImage) {
        zoomImage.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleZoom();
        });
    }
    
    // Teclas do teclado
    document.addEventListener('keydown', (e) => {
        if (!zoomModal || !zoomModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeZoom();
        } else if (e.key === 'ArrowLeft') {
            navigateZoom(-1);
        } else if (e.key === 'ArrowRight') {
            navigateZoom(1);
        }
    });
}

function openZoom(index) {
    if (!currentVehicle || !currentVehicle.images.length) return;
    
    zoomCurrentIndex = index;
    zoomImage.src = currentVehicle.images[index];
    zoomImage.classList.remove('zoomed');
    isZoomed = false;
    
    // Atualizar contador
    document.getElementById('zoom-current').textContent = index + 1;
    document.getElementById('zoom-total').textContent = currentVehicle.images.length;
    
    // Mostrar modal
    zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log(`[INFO] ${new Date().toISOString()} - Zoom aberto na imagem ${index + 1}/${currentVehicle.images.length}`);
}

function closeZoom() {
    zoomModal.classList.remove('active');
    document.body.style.overflow = '';
    zoomImage.classList.remove('zoomed');
    isZoomed = false;
    
    console.log(`[INFO] ${new Date().toISOString()} - Zoom fechado`);
}

function navigateZoom(direction) {
    if (!currentVehicle || !currentVehicle.images.length) return;
    
    zoomCurrentIndex = (zoomCurrentIndex + direction + currentVehicle.images.length) % currentVehicle.images.length;
    zoomImage.src = currentVehicle.images[zoomCurrentIndex];
    zoomImage.classList.remove('zoomed');
    isZoomed = false;
    
    // Atualizar contador
    document.getElementById('zoom-current').textContent = zoomCurrentIndex + 1;
    
    console.log(`[INFO] ${new Date().toISOString()} - Navegando para imagem ${zoomCurrentIndex + 1}/${currentVehicle.images.length}`);
}

function toggleZoom() {
    if (isZoomed) {
        zoomImage.classList.remove('zoomed');
        isZoomed = false;
    } else {
        zoomImage.classList.add('zoomed');
        isZoomed = true;
    }
    
    console.log(`[INFO] ${new Date().toISOString()} - Zoom ${isZoomed ? 'ativado' : 'desativado'}`);
}

// Limpar interval ao sair da página
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

// Exportar funções para uso global
window.changeImage = changeImage;

