// ===================================
// AUTENTICAÇÃO E CADASTRO
// ===================================

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[INFO] ${new Date().toISOString()} - Página de autenticação carregada`);
    
    // Verificar se já está logado
    const user = StorageManager.getItem('user');
    if (user) {
        console.log(`[INFO] ${new Date().toISOString()} - Usuário já autenticado, redirecionando...`);
        window.location.href = 'index.html';
        return;
    }
    
    // Configurar tabs
    setupTabs();
    
    // Configurar formulários
    setupForms();
    
    // Configurar máscaras
    setupMasks();
    
    console.log(`[INFO] ${new Date().toISOString()} - Sistema de autenticação inicializado`);
});

// ===================================
// TABS
// ===================================
function setupTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Atualizar tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Atualizar formulários
            document.querySelectorAll('.auth-form-container').forEach(form => {
                form.classList.add('hidden');
            });
            
            const targetForm = document.getElementById(`${targetTab}-form`);
            if (targetForm) {
                targetForm.classList.remove('hidden');
            }
            
            console.log(`[INFO] ${new Date().toISOString()} - Tab alterada para: ${targetTab}`);
        });
    });
}

// ===================================
// FORMULÁRIOS
// ===================================
function setupForms() {
    // Formulário de login
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulário de cadastro
    const registerForm = document.getElementById('form-register');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Botões de login social
    setupSocialLogin();
}

// ===================================
// LOGIN
// ===================================
function handleLogin(e) {
    e.preventDefault();
    console.log(`[INFO] ${new Date().toISOString()} - Tentativa de login iniciada`);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validar campos
    if (!email || !password) {
        showNotification('Preencha todos os campos', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Campos obrigatórios não preenchidos`);
        return;
    }
    
    // Validar email
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Email inválido: ${email}`);
        return;
    }
    
    // Simular verificação de login
    // Em produção, isso seria uma chamada para API
    const users = StorageManager.getItem('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        // Para demonstração, permitir login com qualquer email/senha
        const newUser = {
            id: Date.now(),
            name: 'Usuário Demo',
            email: email,
            role: 'user'
        };
        
        StorageManager.setItem('user', newUser);
        
        showNotification('Login realizado com sucesso!', 'success');
        console.log(`[INFO] ${new Date().toISOString()} - Login realizado: ${email}`);
        
        // Verificar se há URL de retorno
        const returnUrl = StorageManager.getItem('returnUrl');
        if (returnUrl) {
            StorageManager.removeItem('returnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1500);
        } else {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
        return;
    }
    
    // Salvar sessão
    StorageManager.setItem('user', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
    });
    
    if (remember) {
        StorageManager.setItem('remember', true);
    }
    
    showNotification('Login realizado com sucesso!', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Login bem-sucedido: ${email}`);
    
    // Verificar se há URL de retorno
    const returnUrl = StorageManager.getItem('returnUrl');
    if (returnUrl) {
        StorageManager.removeItem('returnUrl');
        setTimeout(() => {
            window.location.href = returnUrl;
        }, 1500);
    } else {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ===================================
// CADASTRO
// ===================================
function handleRegister(e) {
    e.preventDefault();
    console.log(`[INFO] ${new Date().toISOString()} - Tentativa de cadastro iniciada`);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const cpf = formData.get('cpf');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const birth = formData.get('birth');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    const terms = formData.get('terms');
    
    // Validar campos obrigatórios
    if (!name || !cpf || !email || !phone || !birth || !password || !confirmPassword) {
        showNotification('Preencha todos os campos obrigatórios', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Campos obrigatórios não preenchidos`);
        return;
    }
    
    // Validar email
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Email inválido: ${email}`);
        return;
    }
    
    // Validar CPF
    if (!validateCPF(cpf)) {
        showNotification('CPF inválido', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - CPF inválido`);
        return;
    }
    
    // Validar senha
    if (password.length < 6) {
        showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Senha muito curta`);
        return;
    }
    
    // Validar confirmação de senha
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Senhas não coincidem`);
        return;
    }
    
    // Validar termos
    if (!terms) {
        showNotification('Você deve aceitar os termos de uso', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Termos não aceitos`);
        return;
    }
    
    // Verificar se email já existe
    const users = StorageManager.getItem('users') || [];
    if (users.some(u => u.email === email)) {
        showNotification('Este email já está cadastrado', 'error');
        console.log(`[ERROR] ${new Date().toISOString()} - Email já cadastrado: ${email}`);
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name: name,
        cpf: cpf,
        email: email,
        phone: phone,
        birth: birth,
        password: password, // Em produção, deve ser hasheado
        role: 'user',
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    StorageManager.setItem('users', users);
    
    // Login automático
    StorageManager.setItem('user', {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    });
    
    showNotification('Cadastro realizado com sucesso!', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Usuário cadastrado: ${email}`);
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===================================
// LOGIN SOCIAL
// ===================================
function setupSocialLogin() {
    const googleBtns = document.querySelectorAll('.btn-google');
    const facebookBtns = document.querySelectorAll('.btn-facebook');
    
    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Integração com Google em desenvolvimento', 'info');
            console.log(`[INFO] ${new Date().toISOString()} - Tentativa de login com Google`);
        });
    });
    
    facebookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Integração com Facebook em desenvolvimento', 'info');
            console.log(`[INFO] ${new Date().toISOString()} - Tentativa de login com Facebook`);
        });
    });
}

// ===================================
// VALIDAÇÕES
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// ===================================
// MÁSCARAS DE INPUT
// ===================================
function setupMasks() {
    // Máscara de CPF
    const cpfInput = document.getElementById('register-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara de telefone
    const phoneInput = document.getElementById('register-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 10) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{1,2})/, '($1');
            }
            
            e.target.value = value;
        });
    }
}

// ===================================
// LOGOUT
// ===================================
function logout() {
    StorageManager.removeItem('user');
    StorageManager.removeItem('remember');
    showNotification('Logout realizado com sucesso', 'success');
    console.log(`[INFO] ${new Date().toISOString()} - Usuário deslogado`);
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Exportar funções para uso global
window.logout = logout;

