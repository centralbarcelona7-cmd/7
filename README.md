# Sistema de Leilão de Veículos

Sistema completo de leilão de veículos online, desenvolvido com HTML5, CSS3, JavaScript e PHP com MySQL.

## 📋 Funcionalidades

### Para Usuários
- ✅ Navegação e busca de veículos em leilão
- ✅ Visualização detalhada de veículos com galeria de imagens
- ✅ Sistema de lances em tempo real
- ✅ Contador regressivo para encerramento dos leilões
- ✅ Histórico de lances
- ✅ Sistema de favoritos
- ✅ Cadastro e login de usuários
- ✅ Filtros avançados (categoria, preço, ano, combustível)
- ✅ Ordenação de resultados
- ✅ Sistema de notificações
- ✅ Design responsivo para mobile e desktop

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gerenciamento de veículos (CRUD)
- ✅ Gerenciamento de leilões
- ✅ Gerenciamento de usuários
- ✅ Visualização de lances
- ✅ Dashboard com estatísticas
- ✅ Relatórios
- ✅ Configurações do sistema
- ✅ Logs detalhados de todas as operações

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (com variáveis CSS e flexbox/grid)
- JavaScript (ES6+)
- Font Awesome (ícones)

### Backend
- PHP 7.4+
- MySQL 8.0+
- PDO para acesso ao banco de dados

## 📦 Estrutura do Projeto

```
LEILAO/
├── api/                    # APIs REST em PHP
│   ├── auctions.php       # Gerenciamento de leilões
│   └── vehicles.php       # Gerenciamento de veículos
├── config/                # Configurações
│   └── database.php       # Conexão com banco de dados
├── css/                   # Estilos
│   └── styles.css         # CSS principal
├── database/              # Scripts de banco de dados
│   └── schema.sql         # Schema completo do banco
├── js/                    # Scripts JavaScript
│   ├── script.js          # Funções globais
│   ├── catalog.js         # Catálogo de veículos
│   ├── details.js         # Detalhes do veículo
│   ├── auth.js            # Autenticação
│   └── admin.js           # Painel administrativo
├── logs/                  # Arquivos de log
├── admin.html             # Painel administrativo
├── catalogo.html          # Catálogo de veículos
├── detalhes.html          # Detalhes do veículo
├── index.html             # Página inicial
├── login.html             # Login e cadastro
└── README.md              # Este arquivo
```

## 🚀 Instalação

### Pré-requisitos
- XAMPP, WAMP ou servidor similar
- PHP 7.4 ou superior
- MySQL 8.0 ou superior

### Passo a Passo

1. **Clone ou baixe o projeto**
   ```bash
   # Coloque os arquivos em C:\xampp\htdocs\Minhas telas\LEILAO
   ```

2. **Configure o banco de dados**
   - Abra o phpMyAdmin (http://localhost/phpmyadmin)
   - Crie um novo banco de dados chamado `leilao_veiculos`
   - Importe o arquivo `database/schema.sql`
   - Ou execute o script SQL diretamente no phpMyAdmin

3. **Configure a conexão com o banco**
   - Abra o arquivo `config/database.php`
   - Ajuste as credenciais se necessário:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'leilao_veiculos');
     define('DB_USER', 'root');
     define('DB_PASS', '');
     ```

4. **Crie as pastas de logs**
   ```bash
   mkdir logs
   ```

5. **Acesse o sistema**
   - Abra o navegador
   - Acesse: http://localhost/Minhas%20telas/LEILAO/

## 👤 Credenciais Padrão

### Administrador
- **Email**: admin@leilaopremium.com.br
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere a senha padrão em produção!

## 📊 Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `vehicles` - Veículos cadastrados
- `vehicle_images` - Imagens dos veículos
- `auctions` - Leilões
- `bids` - Lances dos usuários
- `favorites` - Favoritos dos usuários
- `notifications` - Notificações
- `system_logs` - Logs do sistema
- `settings` - Configurações

### Recursos Avançados
- ✅ Views otimizadas para consultas frequentes
- ✅ Triggers para atualização automática
- ✅ Stored procedures para encerramento de leilões
- ✅ Índices para melhor performance
- ✅ Foreign keys para integridade referencial
- ✅ Soft delete para veículos

## 📝 Logs

O sistema mantém logs detalhados de todas as operações:

### Logs de Banco de Dados
Arquivo: `logs/database.log`
- Conexões e desconexões
- Erros de conexão

### Logs de API
Arquivo: `logs/api.log`
- Todas as requisições às APIs
- Operações CRUD
- Erros e exceções

### Logs do Frontend
- Console do navegador
- Todas as ações do usuário
- Erros JavaScript

### Formato dos Logs
```
[NÍVEL] YYYY-MM-DD HH:MM:SS - Mensagem detalhada
```

Níveis:
- `[INFO]` - Informações gerais
- `[ERROR]` - Erros
- `[WARNING]` - Avisos
- `[SECURITY]` - Eventos de segurança

## 🔧 Configurações

As configurações do sistema podem ser ajustadas através do painel administrativo ou diretamente no banco de dados (tabela `settings`):

- `site_name` - Nome do site
- `contact_email` - Email de contato
- `contact_phone` - Telefone de contato
- `default_auction_duration` - Duração padrão dos leilões (dias)
- `min_bid_increment` - Incremento mínimo de lance (%)
- `platform_commission` - Comissão da plataforma (%)
- `enable_notifications` - Habilitar notificações
- `enable_auto_close` - Encerrar leilões automaticamente

## 🎨 Personalização

### Cores
As cores podem ser ajustadas no arquivo `css/styles.css`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    --accent-color: #f39c12;
    --danger-color: #e74c3c;
    --dark-color: #2c3e50;
    --light-color: #ecf0f1;
}
```

### Logo
Substitua o ícone no header por sua logo:
```html
<div class="logo">
    <img src="caminho/para/sua/logo.png" alt="Logo">
    <h1>Seu Nome</h1>
</div>
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1920px+)

## 🔒 Segurança

### Implementado
- ✅ Prepared statements (PDO) para prevenir SQL Injection
- ✅ Headers CORS configurados
- ✅ Validação de dados no backend
- ✅ Sanitização de inputs
- ✅ Logs de segurança

### Recomendações para Produção
- ❗ Use HTTPS
- ❗ Implemente autenticação JWT
- ❗ Hash de senhas com bcrypt/argon2
- ❗ Rate limiting nas APIs
- ❗ Proteção contra CSRF
- ❗ Sanitização adicional de XSS
- ❗ Backup automático do banco

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o MySQL está rodando
- Confirme as credenciais em `config/database.php`
- Certifique-se de que o banco foi criado

### Imagens não aparecem
- Verifique os caminhos das imagens
- Confira permissões das pastas

### Logs não são gravados
- Crie a pasta `logs/` manualmente
- Verifique permissões de escrita

### APIs não funcionam
- Verifique se o mod_rewrite está habilitado
- Confirme que o PHP está instalado
- Veja os logs de erro do Apache

## 📈 Melhorias Futuras

- [ ] Sistema de pagamento integrado
- [ ] Notificações push em tempo real
- [ ] Chat entre comprador e vendedor
- [ ] Sistema de avaliações
- [ ] Exportação de relatórios em PDF
- [ ] Integração com redes sociais
- [ ] App mobile nativo
- [ ] Sistema de comissões automatizado
- [ ] Vídeos dos veículos
- [ ] Realidade aumentada para visualização

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e comerciais.

## 👥 Suporte

Para dúvidas e suporte:
- 📧 Email: contato@leilaopremium.com.br
- 📱 Telefone: (11) 1234-5678

## 🙏 Agradecimentos

Desenvolvido com ❤️ para criar a melhor experiência em leilões de veículos online.

---

**Última atualização**: Outubro 2025

