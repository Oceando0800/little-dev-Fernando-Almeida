// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
html.classList.toggle('dark', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('mainContent');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Load page content
        const page = item.dataset.page;
        loadPage(page);
        
        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
        }
    });
});

// Page Content Templates
const pages = {
    home: `
        <h1 class="page-title">Página inicial</h1>
        <p class="page-description">Acesse rapidamente seus uploads e documentos recentes</p>
        
        <div class="section">
            <div class="section-header">
                <svg class="section-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div>
                    <h2 class="section-title">Seus uploads</h2>
                    <p class="section-description">Documentos que você enviou recentemente para o portal</p>
                </div>
            </div>
            <div class="grid grid-cols-3">
                ${createMaterialCard('Fundamentos de Eletrônica Digital', 'Plano de Curso', 'Eletromecânica', 'Eletrônica', '2A', '15/09/2025', 'Carlos Eduardo', 'Curso completo sobre circuitos digitais e portas lógicas.', ['Eletrônica', 'Digital'])}
                ${createMaterialCard('Desenvolvimento de APIs REST', 'Plano de Aula', 'TI', 'Backend', '3B', '02/10/2025', 'Ana Paula', 'Criação de APIs RESTful com Node.js e Express.', ['Node.js', 'API', 'REST'])}
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <svg class="section-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div>
                    <h2 class="section-title">Últimos acessos</h2>
                    <p class="section-description">Documentos que você visualizou recentemente</p>
                </div>
            </div>
            <div class="grid grid-cols-3">
                ${createMaterialCard('Gestão de Projetos Ágeis', 'Material Didático', 'Administração', 'Gestão', '1A', '28/09/2025', 'Roberto Silva', 'Metodologias ágeis aplicadas à gestão de projetos.', ['Scrum', 'Agile'])}
            </div>
        </div>
    `,
    
    'planos-curso': `
        <h1 class="page-title">PLANOS DE CURSO</h1>
        <p class="page-description">Acesse rapidamente todos os planos de curso organizados por área e professor.</p>
        
        <div class="mb-4">
            <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Filtros:</strong> Área | Tipo de Curso | Professor | Data</p>
        </div>
        
        <div class="grid" style="grid-template-columns: 1fr 3fr; gap: 1.5rem;">
            <div>
                ${createFilterPanel()}
            </div>
            <div>
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Resultados da sua pesquisa</h3>
                    ${createMaterialCard('Técnico em Eletromecânica - Módulo 1', 'Plano de Curso', 'Eletromecânica', 'Fundamentos', '1A', '10/08/2025', 'Carlos Eduardo', 'Plano de curso completo do primeiro módulo.', ['Fundamentos', 'Módulo 1'])}
                    ${createMaterialCard('Desenvolvimento Full Stack', 'Plano de Curso', 'TI', 'Programação Web', '2B', '05/09/2025', 'Ana Paula', 'Curso completo de desenvolvimento web front e backend.', ['Full Stack', 'Web'])}
                    ${createMaterialCard('Gestão Empresarial Integrada', 'Plano de Curso', 'Administração', 'Gestão', '1C', '20/09/2025', 'Roberto Silva', 'Gestão empresarial com foco em processos integrados.', ['Gestão', 'ERP'])}
                </div>
            </div>
        </div>
    `,
    
    'planos-aula': `
        <h1 class="page-title">PLANOS DE AULA</h1>
        <p class="page-description">Acesse rapidamente todos os planos de aula organizados por área e professor.</p>
        
        <div class="mb-4">
            <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Filtros:</strong> Unidade Curricular | Turma | Data | Professor</p>
        </div>
        
        <div class="grid" style="grid-template-columns: 1fr 3fr; gap: 1.5rem;">
            <div>
                ${createFilterPanel()}
            </div>
            <div>
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Resultados da sua pesquisa</h3>
                    ${createMaterialCard('Introdução aos Circuitos Elétricos', 'Plano de Aula', 'Eletromecânica', 'Circuitos', '1A', '01/10/2025', 'Carlos Eduardo', 'Aula prática sobre análise de circuitos básicos.', ['Circuitos', 'Prática'])}
                    ${createMaterialCard('React Hooks Avançados', 'Plano de Aula', 'TI', 'Frontend', '2B', '03/10/2025', 'Ana Paula', 'Uso avançado de hooks customizados no React.', ['React', 'Hooks'])}
                </div>
                
                <div class="section mt-4">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Planos de aula relacionados</h3>
                    <div class="grid grid-cols-3">
                        <div style="background: var(--card); padding: 0.5rem; border-radius: 0.375rem;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary); display: inline-block; vertical-align: middle;">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span style="font-size: 0.875rem; margin-left: 0.5rem;">Exercícios de Fixação</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    materiais: `
        <h1 class="page-title">Materiais Didáticos</h1>
        <p class="page-description">Busque e acesse materiais de apoio e recursos didáticos</p>
        
        <div class="section mb-4">
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Buscar conteúdos</h2>
            <p style="font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Filtros:</strong> Disciplina | Tipo de Material | Data</p>
            <div style="position: relative;">
                <input type="text" placeholder="Buscar materiais didáticos..." class="filter-input" style="padding-left: 2.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--muted-foreground);">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
        </div>
        
        <div class="grid" style="grid-template-columns: 1fr 2fr; gap: 1.5rem;">
            <div class="section">
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Links úteis para IA's</h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${createAILink('ChatGPT', 'Assistente de IA para geração de conteúdo')}
                    ${createAILink('Gemini', 'Modelo de linguagem do Google')}
                    ${createAILink('Claude', 'Assistente de IA da Anthropic')}
                    ${createAILink('Perplexity', 'Mecanismo de busca com IA')}
                    ${createAILink('You.com', 'Busca e chat com IA')}
                    ${createAILink('Phind', 'IA especializada em programação')}
                </div>
            </div>
            
            <div>
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Materiais encontrados</h3>
                ${createMaterialCard('E-book: Fundamentos de Eletrônica', 'E-book', 'Eletromecânica', 'Eletrônica', '1A', '15/09/2025', 'Carlos Eduardo', 'Material completo sobre fundamentos de eletrônica.', ['E-book', 'Eletrônica'])}
                ${createMaterialCard('Slides: JavaScript Moderno', 'Slides', 'TI', 'Programação', '2B', '01/10/2025', 'Ana Paula', 'Apresentação sobre ES6+ e boas práticas.', ['JavaScript', 'ES6'])}
            </div>
        </div>
    `,
    
    upload: `
        <h1 class="page-title">Upload de Arquivos</h1>
        <p class="page-description">Envie materiais e documentos para o portal</p>
        
        <div class="section mb-4">
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Fazer upload de arquivo(s)</h2>
            <div class="upload-area" onclick="showUploadForm()">
                <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <p style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem;">Cole o link aqui...</p>
                <p style="font-size: 0.875rem; color: var(--muted-foreground);">Clique para adicionar um link para o material</p>
            </div>
        </div>
        
        <div class="section">
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Criar um novo arquivo</h2>
            <div class="upload-area" onclick="showUploadForm()">
                <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <p style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem;">Clique aqui...</p>
                <p style="font-size: 0.875rem; color: var(--muted-foreground);">Preencha os metadados e faça upload do arquivo</p>
            </div>
        </div>
        
        <div id="uploadForm" class="form hidden mt-4">
            <h3 style="font-weight: 600; margin-bottom: 1rem;">Metadados obrigatórios</h3>
            <form onsubmit="handleUpload(event)">
                <div class="grid grid-cols-2" style="gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Título *</label>
                        <input type="text" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo *</label>
                        <select class="form-select" required>
                            <option value="">Selecionar tipo</option>
                            <option value="plano-curso">Plano de Curso</option>
                            <option value="plano-aula">Plano de Aula</option>
                            <option value="material">Material Didático</option>
                            <option value="relatorio">Relatório de Livro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Área *</label>
                        <select class="form-select" required>
                            <option value="">Selecionar área</option>
                            <option value="eletromecanica">Eletromecânica</option>
                            <option value="ti">TI</option>
                            <option value="administracao">Administração</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Unidade Curricular</label>
                        <input type="text" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Turma</label>
                        <input type="text" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Professor *</label>
                        <input type="text" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Data *</label>
                        <input type="date" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo de Curso</label>
                        <select class="form-select">
                            <option value="">Selecionar tipo</option>
                            <option value="tecnico">Técnico</option>
                            <option value="aperfeicoamento">Aperfeiçoamento</option>
                            <option value="qualificacao">Qualificação</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Descrição (máx 200 caracteres)</label>
                    <textarea class="form-textarea" maxlength="200" placeholder="Breve descrição do material..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Tags (separadas por vírgula)</label>
                    <input type="text" class="form-input" placeholder="HTML, CSS, JavaScript">
                </div>
                <div class="form-group">
                    <label class="form-label">Arquivo (máx 50MB)</label>
                    <input type="file" class="form-input" accept=".pdf,.ppt,.pptx,.doc,.docx,.epub,.jpg,.png">
                    <p style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.25rem;">Formatos aceitos: PDF, PPT, DOC, EPUB, JPG, PNG</p>
                </div>
                <div class="flex gap-2 mt-4">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Fazer Upload</button>
                    <button type="button" class="btn btn-outline" onclick="hideUploadForm()">Cancelar</button>
                </div>
            </form>
        </div>
    `
};

// Helper Functions
function createMaterialCard(titulo, tipo, area, unidade, turma, data, professor, descricao, tags) {
    return `
        <div class="material-card">
            <div class="material-card-header">
                <svg class="material-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div style="flex: 1;">
                    <h3 class="material-title">${titulo}</h3>
                    <p class="material-meta">${area} • ${unidade} • ${turma} • ${professor} • ${data}</p>
                    <p class="material-description">${descricao}</p>
                    <div class="material-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="material-actions">
                        <button class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Visualizar
                        </button>
                        <button class="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Baixar
                        </button>
                        <button class="btn btn-ghost">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Favoritar
                        </button>
                        <button class="btn btn-ghost">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            Compartilhar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createFilterPanel() {
    return `
        <div class="filter-panel">
            <div class="filter-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filtros</span>
            </div>
            <div class="filter-group">
                <label class="filter-label">Área</label>
                <select class="filter-select">
                    <option value="">Selecionar área</option>
                    <option value="eletromecanica">Eletromecânica</option>
                    <option value="ti">TI</option>
                    <option value="administracao">Administração</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Professor</label>
                <select class="filter-select">
                    <option value="">Selecionar professor</option>
                    <option value="carlos">Carlos Eduardo</option>
                    <option value="ana">Ana Paula</option>
                    <option value="roberto">Roberto Silva</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Disciplina</label>
                <select class="filter-select">
                    <option value="">Selecionar disciplina</option>
                    <option value="programacao">Programação</option>
                    <option value="eletronica">Eletrônica</option>
                    <option value="gestao">Gestão</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Turma</label>
                <select class="filter-select">
                    <option value="">Selecionar turma</option>
                    <option value="1a">1A</option>
                    <option value="2b">2B</option>
                    <option value="3c">3C</option>
                </select>
            </div>
            <div class="filter-group">
                <label class="filter-label">Data</label>
                <input type="date" class="filter-input">
            </div>
        </div>
    `;
}

function createAILink(name, description) {
    return `
        <a href="#" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; text-align: left; padding: 0.5rem 0.75rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500;">${name}</div>
                <div style="font-size: 0.75rem; color: var(--muted-foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${description}</div>
            </div>
        </a>
    `;
}

function loadPage(page) {
    mainContent.innerHTML = pages[page] || pages.home;
}

function showUploadForm() {
    document.getElementById('uploadForm').classList.remove('hidden');
}

function hideUploadForm() {
    document.getElementById('uploadForm').classList.add('hidden');
}

function handleUpload(e) {
    e.preventDefault();
    alert('Upload simulado! Em produção, os dados seriam enviados ao servidor.');
    hideUploadForm();
}

// Load home page by default
loadPage('home');
