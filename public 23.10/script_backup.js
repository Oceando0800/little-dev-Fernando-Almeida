// ==================== GERENCIAMENTO DE DADOS ====================
function initializeData() {
    if (!localStorage.getItem('materiais')) {
        const mockData = [
            {
                id: generateId(),
                titulo: "Fundamentos de Eletromecânica",
                tipo: "Plano de Curso",
                area: "Eletromecânica",
                disciplina: "Circuitos Elétricos",
                turma: "1A",
                professor: "Carlos Eduardo",
                data: "2025-01-10",
                descricao: "Curso completo sobre fundamentos de eletromecânica e circuitos elétricos",
                tags: ["Eletricidade", "Circuitos", "Técnico"]
            },
            {
                id: generateId(),
                titulo: "Desenvolvimento Web Full Stack",
                tipo: "Plano de Curso",
                area: "TI",
                disciplina: "Programação",
                turma: "2A",
                professor: "Ana Paula",
                data: "2025-01-15",
                descricao: "Formação completa em desenvolvimento web com React e Node.js",
                tags: ["React", "Node.js", "JavaScript", "Full Stack"]
            },
            {
                id: generateId(),
                titulo: "Introdução ao HTML e CSS",
                tipo: "Plano de Aula",
                area: "TI",
                disciplina: "Frontend",
                turma: "1B",
                professor: "Roberto Silva",
                data: "2025-01-20",
                descricao: "Aula prática sobre estruturação de páginas web com HTML5 e estilização com CSS3",
                tags: ["HTML", "CSS", "Frontend", "Básico"]
            },
            {
                id: generateId(),
                titulo: "Automação Industrial",
                tipo: "Plano de Aula",
                area: "Eletromecânica",
                disciplina: "Automação",
                turma: "3A",
                professor: "Carlos Eduardo",
                data: "2025-01-25",
                descricao: "Conceitos de automação industrial e programação de CLPs",
                tags: ["Automação", "CLP", "Programação", "Industrial"]
            },
            {
                id: generateId(),
                titulo: "Apostila de JavaScript Avançado",
                tipo: "Material",
                area: "TI",
                disciplina: "Programação",
                turma: "2B",
                professor: "Ana Paula",
                data: "2025-02-01",
                descricao: "Material didático completo sobre conceitos avançados de JavaScript",
                tags: ["JavaScript", "Avançado", "PDF", "Programação"]
            },
            {
                id: generateId(),
                titulo: "Gestão de Projetos com Metodologias Ágeis",
                tipo: "Material",
                area: "Administração",
                disciplina: "Gestão",
                turma: "1C",
                professor: "Roberto Silva",
                data: "2025-02-05",
                descricao: "Guia prático de metodologias ágeis aplicadas à gestão de projetos",
                tags: ["Scrum", "Agile", "Gestão", "Projetos"]
            }
        ];
        localStorage.setItem('materiais', JSON.stringify(mockData));
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getMateriais() {
    return JSON.parse(localStorage.getItem('materiais') || '[]');
}

function saveMateriais(materiais) {
    localStorage.setItem('materiais', JSON.stringify(materiais));
}

function deleteMaterial(id) {
    const materiais = getMateriais();
    const filtered = materiais.filter(m => m.id !== id);
    saveMateriais(filtered);
}

function addMaterial(material) {
    const materiais = getMateriais();
    materiais.push({
        ...material,
        id: generateId()
    });
    saveMateriais(materiais);
}

// ==================== TEMA ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.classList.toggle('dark', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ==================== SIDEBAR ====================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

// Toggle sidebar recolher/expandir (desktop) ou abrir/fechar (mobile)
sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth < 768) {
        // Mobile: abre/fecha
        sidebar.classList.toggle('open');
    } else {
        // Desktop: recolhe/expande
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
});

// Restaurar estado da sidebar no desktop
const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
if (sidebarCollapsed && window.innerWidth >= 768) {
    sidebar.classList.add('collapsed');
}

// Fechar sidebar no mobile ao clicar fora
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ==================== NAVEGAÇÃO ====================
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('mainContent');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        const page = item.dataset.page;
        loadPage(page);
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
        }
    });
});

// ==================== CRIAÇÃO DE CARDS ====================
function createMaterialCard(material, showDelete = false) {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.dataset.id = material.id;
    
    const tagsHtml = material.tags && material.tags.length > 0
        ? `<div class="material-tags">
            ${material.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
           </div>`
        : '';
    
    const deleteBtn = showDelete
        ? `<button class="delete-btn" onclick="handleDeleteMaterial('${material.id}')" aria-label="Excluir" data-testid="button-delete-${material.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
           </button>`
        : '';
    
    card.innerHTML = `
        ${deleteBtn}
        <div class="material-card-header">
            <svg class="material-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div class="material-content">
                <h3 class="material-title" data-testid="text-title-${material.id}">${material.titulo}</h3>
                <p class="material-meta">${material.area} • ${material.disciplina} • ${material.turma} • ${material.professor} • ${material.data}</p>
                ${material.descricao ? `<p class="material-description">${material.descricao}</p>` : ''}
                ${tagsHtml}
                <div class="material-actions">
                    <button class="btn btn-primary" data-testid="button-view-${material.id}">Visualizar</button>
                    <button class="btn btn-outline" data-testid="button-download-${material.id}">Baixar</button>
                    <button class="btn btn-ghost" data-testid="button-favorite-${material.id}">Favoritar</button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// ==================== FUNÇÃO DE EXCLUSÃO ====================
function handleDeleteMaterial(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        card.classList.add('deleting');
        setTimeout(() => {
            deleteMaterial(id);
            const currentPage = document.querySelector('.nav-item.active').dataset.page;
            loadPage(currentPage);
        }, 200);
    }
}

// ==================== PÁGINAS ====================
const pages = {
    home: () => {
        const materiais = getMateriais().slice(0, 3);
        
        return `
            <h1 class="page-title" data-testid="text-page-title">Página inicial</h1>
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
                <div id="uploads-container" class="grid grid-cols-3">
                    ${materiais.length > 0 
                        ? '<div id="material-cards"></div>'
                        : '<p data-testid="text-no-uploads">Nenhum upload ainda</p>'
                    }
                </div>
            </div>
        `;
    },

    'planos-curso': () => {
        return `
            <h1 class="page-title">PLANOS DE CURSO</h1>
            <p class="page-description">Acesse rapidamente todos os planos de curso organizados por área e professor.</p>
            
            <div class="grid grid-cols-4">
                <div class="filter-panel">
                    <div class="filter-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <span>Filtros</span>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Área</label>
                        <select class="filter-select" id="filterArea" data-testid="select-area">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Professor</label>
                        <select class="filter-select" id="filterProfessor" data-testid="select-professor">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">
                        Resultados (<span id="resultCount" data-testid="text-result-count">0</span>)
                    </h3>
                    <div id="resultContainer"></div>
                </div>
            </div>
        `;
    },

    'planos-aula': () => {
        return `
            <h1 class="page-title">PLANOS DE AULA</h1>
            <p class="page-description">Acesse rapidamente todos os planos de aula organizados por área e professor.</p>
            
            <div class="grid grid-cols-4">
                <div class="filter-panel">
                    <div class="filter-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <span>Filtros</span>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Disciplina</label>
                        <select class="filter-select" id="filterDisciplina" data-testid="select-disciplina">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Turma</label>
                        <select class="filter-select" id="filterTurma" data-testid="select-turma">
                            <option value="">Todas</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">
                        Resultados (<span id="resultCount" data-testid="text-result-count">0</span>)
                    </h3>
                    <div id="resultContainer"></div>
                </div>
            </div>
        `;
    },

    materiais: () => {
        return `
            <h1 class="page-title">Materiais Didáticos</h1>
            <p class="page-description">Busque e acesse materiais de apoio e recursos didáticos</p>
            
            <div class="section mb-4">
                <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Buscar conteúdos</h2>
                <input type="search" id="searchInput" placeholder="Buscar materiais didáticos..." class="form-input" data-testid="input-search">
            </div>
            
            <h3 style="font-weight: 600; margin-bottom: 1rem;">
                Materiais encontrados (<span id="resultCount" data-testid="text-result-count">0</span>)
            </h3>
            <div id="resultContainer" class="grid grid-cols-2"></div>
        `;
    },

    upload: () => {
        return `
            <h1 class="page-title">Upload de Arquivos</h1>
            <p class="page-description">Envie materiais e documentos para o portal</p>
            
            <div class="section mb-4">
                <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Criar um novo arquivo</h2>
                <div class="upload-area" id="uploadArea" data-testid="button-show-form">
                    <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <p style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem;">Clique aqui...</p>
                    <p style="font-size: 0.875rem; color: var(--muted-foreground);">Preencha os metadados e faça upload do arquivo</p>
                </div>
            </div>
            
            <div id="uploadForm" class="form hidden">
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Metadados obrigatórios</h3>
                <form id="materialForm">
                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" class="form-input" name="titulo" required data-testid="input-titulo">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tipo *</label>
                            <select class="filter-select" name="tipo" required data-testid="select-tipo">
                                <option value="">Selecione</option>
                                <option value="Plano de Curso">Plano de Curso</option>
                                <option value="Plano de Aula">Plano de Aula</option>
                                <option value="Material">Material</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Área *</label>
                            <input type="text" class="form-input" name="area" required data-testid="input-area">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Disciplina *</label>
                            <input type="text" class="form-input" name="disciplina" required data-testid="input-disciplina">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Turma *</label>
                            <input type="text" class="form-input" name="turma" required data-testid="input-turma">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professor *</label>
                            <input type="text" class="form-input" name="professor" required data-testid="input-professor">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data *</label>
                            <input type="date" class="form-input" name="data" required data-testid="input-data">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tags (separadas por vírgula)</label>
                            <input type="text" class="form-input" name="tags" placeholder="tag1, tag2, tag3" data-testid="input-tags">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-textarea" name="descricao" rows="3" data-testid="textarea-descricao"></textarea>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-outline" id="cancelBtn" data-testid="button-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary" data-testid="button-submit">Criar plano</button>
                    </div>
                </form>
            </div>
        `;
    },

    admin: () => {
        return `
            <h1 class="page-title">Administração</h1>
            <p class="page-description">Gerencie configurações e dados do portal</p>
            
            <div class="section">
                <div class="section-header">
                    <svg class="section-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                        <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
                        <path d="M1 12h6m6 0h6"></path>
                        <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
                    </svg>
                    <div>
                        <h2 class="section-title">Painel Administrativo</h2>
                        <p class="section-description">Funcionalidades administrativas em desenvolvimento</p>
                    </div>
                </div>
            </div>
        `;
    }
};

// ==================== CARREGAR PÁGINA ====================
function loadPage(page) {
    mainContent.innerHTML = pages[page]();
    
    // Configurações específicas por página
    if (page === 'home') {
        const materiais = getMateriais().slice(0, 3);
        const container = document.getElementById('uploads-container');
        if (materiais.length > 0 && container) {
            container.innerHTML = '';
            materiais.forEach(material => {
                container.appendChild(createMaterialCard(material, true));
            });
        }
    }
    
    if (page === 'planos-curso') {
        setupPlanoscursoFilters();
    }
    
    if (page === 'planos-aula') {
        setupPlanosaulaFilters();
    }
    
    if (page === 'materiais') {
        setupMateriaisSearch();
    }
    
    if (page === 'upload') {
        setupUploadForm();
    }
}

// ==================== FILTROS PLANOS DE CURSO ====================
function setupPlanoscursoFilters() {
    const materiais = getMateriais().filter(m => m.tipo === 'Plano de Curso');
    const areas = [...new Set(materiais.map(m => m.area))];
    const professores = [...new Set(materiais.map(m => m.professor))];
    
    const filterArea = document.getElementById('filterArea');
    const filterProfessor = document.getElementById('filterProfessor');
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        filterArea.appendChild(option);
    });
    
    professores.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        filterProfessor.appendChild(option);
    });
    
    function updateResults() {
        const areaFilter = filterArea.value;
        const professorFilter = filterProfessor.value;
        
        const filtered = materiais.filter(m => {
            if (areaFilter && m.area !== areaFilter) return false;
            if (professorFilter && m.professor !== professorFilter) return false;
            return true;
        });
        
        renderResults(filtered);
    }
    
    filterArea.addEventListener('change', updateResults);
    filterProfessor.addEventListener('change', updateResults);
    
    updateResults();
}

// ==================== FILTROS PLANOS DE AULA ====================
function setupPlanosaulaFilters() {
    const materiais = getMateriais().filter(m => m.tipo === 'Plano de Aula');
    const disciplinas = [...new Set(materiais.map(m => m.disciplina))];
    const turmas = [...new Set(materiais.map(m => m.turma))];
    
    const filterDisciplina = document.getElementById('filterDisciplina');
    const filterTurma = document.getElementById('filterTurma');
    
    disciplinas.forEach(disc => {
        const option = document.createElement('option');
        option.value = disc;
        option.textContent = disc;
        filterDisciplina.appendChild(option);
    });
    
    turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma;
        option.textContent = turma;
        filterTurma.appendChild(option);
    });
    
    function updateResults() {
        const disciplinaFilter = filterDisciplina.value;
        const turmaFilter = filterTurma.value;
        
        const filtered = materiais.filter(m => {
            if (disciplinaFilter && m.disciplina !== disciplinaFilter) return false;
            if (turmaFilter && m.turma !== turmaFilter) return false;
            return true;
        });
        
        renderResults(filtered);
    }
    
    filterDisciplina.addEventListener('change', updateResults);
    filterTurma.addEventListener('change', updateResults);
    
    updateResults();
}

// ==================== BUSCA DE MATERIAIS ====================
function setupMateriaisSearch() {
    const materiais = getMateriais().filter(m => m.tipo === 'Material');
    const searchInput = document.getElementById('searchInput');
    
    function updateResults() {
        const searchTerm = searchInput.value.toLowerCase();
        
        const filtered = materiais.filter(m =>
            m.titulo.toLowerCase().includes(searchTerm) ||
            (m.descricao && m.descricao.toLowerCase().includes(searchTerm)) ||
            (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
        
        renderResults(filtered);
    }
    
    searchInput.addEventListener('input', updateResults);
    updateResults();
}

// ==================== RENDERIZAR RESULTADOS ====================
function renderResults(materiais) {
    const container = document.getElementById('resultContainer');
    const countElement = document.getElementById('resultCount');
    
    if (countElement) {
        countElement.textContent = materiais.length;
    }
    
    if (materiais.length === 0) {
        container.innerHTML = '<p style="color: var(--muted-foreground);">Nenhum resultado encontrado</p>';
        return;
    }
    
    container.innerHTML = '';
    materiais.forEach(material => {
        container.appendChild(createMaterialCard(material, false));
    });
}

// ==================== FORMULÁRIO DE UPLOAD ====================
function setupUploadForm() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadForm = document.getElementById('uploadForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const materialForm = document.getElementById('materialForm');
    
    uploadArea.addEventListener('click', () => {
        uploadArea.classList.add('hidden');
        uploadForm.classList.remove('hidden');
    });
    
    cancelBtn.addEventListener('click', () => {
        uploadForm.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        materialForm.reset();
    });
    
    materialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(materialForm);
        const material = {
            titulo: formData.get('titulo'),
            tipo: formData.get('tipo'),
            area: formData.get('area'),
            disciplina: formData.get('disciplina'),
            turma: formData.get('turma'),
            professor: formData.get('professor'),
            data: formData.get('data'),
            descricao: formData.get('descricao'),
            tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : []
        };
        
        addMaterial(material);
        
        uploadForm.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        materialForm.reset();
        
        alert('Material criado com sucesso!');
    });
}

// ==================== INICIALIZAÇÃO ====================
initializeData();
loadPage('home');

// ==================== VISUALIZAÇÃO DE DOCUMENTOS ====================
let currentZoom = 1;
let currentPageNum = 1;
const totalPagesNum = 5;

function openDocumentViewer(material) {
    const modal = document.getElementById('viewerModal');
    const title = document.getElementById('viewerTitle');
    const content = document.getElementById('viewerContent');
    const currentPage = document.getElementById('currentPage');
    const totalPages = document.getElementById('totalPages');
    
    title.textContent = material.titulo;
    currentPage.textContent = '1';
    totalPages.textContent = '5';
    currentPageNum = 1;
    currentZoom = 1;
    
    content.innerHTML = `
        <div class="viewer-document" id="documentContent">
            <h1>${material.titulo}</h1>
            <h2>${material.tipo}</h2>
            
            <div class="metadata">
                <div class="metadata-item">
                    <span class="metadata-label">Área:</span> ${material.area}
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Disciplina:</span> ${material.disciplina}
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Turma:</span> ${material.turma}
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Professor:</span> ${material.professor}
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Data:</span> ${material.data}
                </div>
            </div>
            
            <h2>Descrição</h2>
            <p>${material.descricao || 'Sem descrição disponível.'}</p>
            
            <h2>Conteúdo</h2>
            <p>
                Este é um documento de exemplo para demonstração do visualizador.
                Em uma implementação real, o conteúdo completo do documento seria
                carregado e exibido aqui.
            </p>
            <p>
                O visualizador permite navegar entre páginas, fazer zoom e visualizar
                o documento de forma similar ao Gmail, proporcionando uma experiência
                de leitura confortável e profissional.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
            </p>
            ${material.tags && material.tags.length > 0 ? `
                <h2>Tags</h2>
                <p>${material.tags.join(', ')}</p>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDocumentViewer() {
    const modal = document.getElementById('viewerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const viewerModal = document.getElementById('viewerModal');
    const viewerClose = document.getElementById('viewerClose');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    
    if (viewerClose) {
        viewerClose.addEventListener('click', closeDocumentViewer);
    }
    
    if (viewerModal) {
        viewerModal.addEventListener('click', (e) => {
            if (e.target === viewerModal) {
                closeDocumentViewer();
            }
        });
    }
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPageNum > 1) {
                currentPageNum--;
                document.getElementById('currentPage').textContent = currentPageNum;
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            if (currentPageNum < totalPagesNum) {
                currentPageNum++;
                document.getElementById('currentPage').textContent = currentPageNum;
            }
        });
    }
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            if (currentZoom < 2) {
                currentZoom += 0.1;
                const doc = document.getElementById('documentContent');
                if (doc) {
                    doc.style.transform = `scale(${currentZoom})`;
                }
            }
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (currentZoom > 0.5) {
                currentZoom -= 0.1;
                const doc = document.getElementById('documentContent');
                if (doc) {
                    doc.style.transform = `scale(${currentZoom})`;
                }
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('viewerModal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeDocumentViewer();
            } else if (e.key === 'ArrowLeft' && currentPageNum > 1) {
                prevPage.click();
            } else if (e.key === 'ArrowRight' && currentPageNum < totalPagesNum) {
                nextPage.click();
            }
        }
    });
});

document.addEventListener('click', (e) => {
    if (e.target.matches('[data-testid^="button-view-"]')) {
        const card = e.target.closest('.material-card');
        if (card) {
            const id = card.dataset.id;
            const materiais = getMateriais();
            const material = materiais.find(m => m.id === id);
            if (material) {
                openDocumentViewer(material);
            }
        }
    }
});
