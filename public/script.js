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

sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth < 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
});

const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
if (sidebarCollapsed && window.innerWidth >= 768) {
    sidebar.classList.add('collapsed');
}

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

// ==================== VISUALIZADOR DE DOCUMENTOS (NOVA VERSÃO) ====================

let currentDocument = null;

function openDocumentViewer(material) {
    currentDocument = material;

    const modal = document.getElementById('viewerModal');
    const title = document.getElementById('viewerTitle');
    const content = document.getElementById('viewerContent');
    const actions = document.getElementById('viewerActions');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    title.textContent = material.titulo;

    // Reset conteúdo
    content.innerHTML = '';
    actions.innerHTML = '';

    // Adiciona botão de download e fechar
    actions.innerHTML = `
        <a href="${material.fileData}" download="${material.titulo}" class="btn btn-primary">
            Baixar
        </a>
        <button id="viewerClose" class="btn btn-outline">Fechar</button>
    `;

    // Define conteúdo conforme tipo de arquivo
    if (material.fileType?.startsWith('image/')) {
        content.innerHTML = `<img src="${material.fileData}" alt="${material.titulo}" class="viewer-img">`;
    } else if (material.fileType === 'application/pdf') {
        content.innerHTML = `<iframe src="${material.fileData}" class="viewer-pdf"></iframe>`;
    } else {
        // ==================== LÓGICA OFFICE E TEXTOS ====================
        const isOffice =
            material.fileType.includes('officedocument') ||
            material.titulo.endsWith('.docx') ||
            material.titulo.endsWith('.pptx') ||
            material.titulo.endsWith('.xlsx');

        if (isOffice) {
            const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.fileData)}`;
            content.innerHTML = `<iframe src="${officeViewer}" class="viewer-pdf"></iframe>`;
        } else if (material.fileType.startsWith('text/') || material.titulo.endsWith('.txt')) {
            fetch(material.fileData)
                .then(r => r.text())
                .then(text => {
                    content.innerHTML = `<pre class="viewer-text">${text}</pre>`;
                })
                .catch(() => {
                    content.innerHTML = `<p>Erro ao carregar texto.</p>`;
                });
        } else {
            content.innerHTML = `
                <div class="viewer-generic">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <p>Visualização não suportada para este tipo de arquivo.</p>
                    <a href="${material.fileData}" download="${material.titulo}" class="btn btn-primary">Baixar arquivo</a>
                </div>
            `;
        }
    }

    // Listener para fechar
    document.getElementById('viewerClose').addEventListener('click', closeDocumentViewer);
}

function closeDocumentViewer() {
    const modal = document.getElementById('viewerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentDocument = null;
}

// Fecha com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentDocument) {
        closeDocumentViewer();
    }
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
                    <button class="btn btn-primary" data-testid="button-view-${material.id}" onclick="openDocumentViewer(${JSON.stringify(material).replace(/"/g, '&quot;')})">Visualizar</button>
                    <button class="btn btn-outline" data-testid="button-download-${material.id}">Baixar</button>
                    <button class="btn btn-ghost" data-testid="button-favorite-${material.id}">Favoritar</button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

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
            
            <div class="upload-card">
                <input type="file" id="fileInput" class="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx" multiple data-testid="input-file">
                
                <div class="upload-dropzone" id="uploadDropzone" data-testid="button-show-form">
                    <svg class="upload-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <button class="btn btn-primary upload-main-btn" id="uploadBtn" type="button">
                        Faça upload
                    </button>
                    <p class="upload-hint">ou arraste uma imagem,</p>
                    <p class="upload-subhint">cole imagem ou URL</p>
                    <div class="upload-formats">
                        <span>Formatos aceitos: PDF, Word, Excel, PowerPoint, Imagens (JPG, PNG, GIF), TXT</span>
                    </div>
                </div>
                
                <div id="filePreview" class="file-preview hidden"></div>
            </div>
            
            <div id="uploadForm" class="form hidden">
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Metadados do arquivo</h3>
                <div id="selectedFiles" class="selected-files"></div>
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
                        <button type="submit" class="btn btn-primary" data-testid="button-submit">Salvar material</button>
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

// ==================== FORMULÁRIO DE UPLOAD ====================
let selectedFiles = [];

function setupUploadForm() {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadDropzone = document.getElementById('uploadDropzone');
    const uploadForm = document.getElementById('uploadForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const materialForm = document.getElementById('materialForm');
    const filePreview = document.getElementById('filePreview');
    const selectedFilesContainer = document.getElementById('selectedFiles');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }
    
    if (uploadDropzone) {
        uploadDropzone.addEventListener('click', (e) => {
            if (e.target === uploadDropzone || e.target.closest('.upload-icon, .upload-hint, .upload-subhint, .upload-formats')) {
                fileInput.click();
            }
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                selectedFiles = files;
                showUploadForm(files);
            }
        });
    }
    
    if (uploadDropzone) {
        uploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropzone.style.backgroundColor = 'var(--muted)';
        });
        
        uploadDropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadDropzone.style.backgroundColor = '';
        });
        
        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.style.backgroundColor = '';
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                selectedFiles = files;
                showUploadForm(files);
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            uploadForm.classList.add('hidden');
            uploadDropzone.classList.remove('hidden');
            filePreview.classList.add('hidden');
            materialForm.reset();
            selectedFiles = [];
        });
    }
    
    if (materialForm) {
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
                tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
                arquivo: selectedFiles.length > 0 ? selectedFiles[0].name : 'documento.pdf'
            };
            
            addMaterial(material);
            
            uploadForm.classList.add('hidden');
            uploadDropzone.classList.remove('hidden');
            filePreview.classList.add('hidden');
            materialForm.reset();
            selectedFiles = [];
            
            alert('Material enviado com sucesso!');
        });
    }
}

function showUploadForm(files) {
    const uploadDropzone = document.getElementById('uploadDropzone');
    const uploadForm = document.getElementById('uploadForm');
    const selectedFilesContainer = document.getElementById('selectedFiles');
    
    selectedFilesContainer.innerHTML = '<div class="selected-files-list"><h4 style="font-weight: 600; margin-bottom: 0.75rem;">Arquivos selecionados:</h4>' +
        files.map((file) => '<div class="file-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>' + file.name + '</span><span class="file-size">(' + formatFileSize(file.size) + ')</span></div>').join('') + '</div>';
    
    const titleInput = document.querySelector('input[name="titulo"]');
    if (titleInput && files.length > 0) {
        const fileName = files[0].name;
        const title = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        titleInput.value = title;
    }
    
    uploadDropzone.classList.add('hidden');
    uploadForm.classList.remove('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ==================== INICIALIZAÇÃO ====================
initializeData();
loadPage('home');
