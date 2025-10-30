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

function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos') || '[]');
}

function saveFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function toggleFavorito(id) {
    const favoritos = getFavoritos();
    const index = favoritos.indexOf(id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    
    saveFavoritos(favoritos);
    return favoritos.includes(id);
}

function isFavorito(id) {
    const favoritos = getFavoritos();
    return favoritos.includes(id);
}

function handleFavorite(id, event) {
    event.stopPropagation();
    const isFav = toggleFavorito(id);
    
    const currentPage = document.querySelector('.nav-item.active').dataset.page;
    loadPage(currentPage);
}

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.classList.toggle('dark', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

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

let currentDocument = null;
let currentZoom = 1;

function openDocumentViewer(material) {
    currentDocument = material;
    currentZoom = 1;

    const modal = document.getElementById('viewerModal');
    const title = document.getElementById('viewerTitle');
    const content = document.getElementById('viewerContent');
    const actions = document.getElementById('viewerActions');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    title.textContent = material.titulo;

    content.innerHTML = '';
    actions.innerHTML = '';

    actions.innerHTML = `
        <div class="viewer-controls-group">
            <button class="btn btn-ghost" id="zoomOut" title="Diminuir zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
            </button>
            <span id="zoomLevel" class="zoom-level">100%</span>
            <button class="btn btn-ghost" id="zoomIn" title="Aumentar zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
            </button>
            <button class="btn btn-ghost" id="zoomReset" title="Resetar zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                </svg>
            </button>
        </div>
        <a href="${material.fileData}" download="${material.titulo}" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Baixar
        </a>
    `;

    const fileName = material.titulo || material.fileName || '';
    const fileType = material.fileType || '';
    
    const isWord = 
        fileType.includes('wordprocessingml') ||
        fileType === 'application/msword' ||
        fileName.toLowerCase().endsWith('.docx') ||
        fileName.toLowerCase().endsWith('.doc');
    
    const isExcel = 
        fileType.includes('spreadsheetml') ||
        fileType === 'application/vnd.ms-excel' ||
        fileName.toLowerCase().endsWith('.xlsx') ||
        fileName.toLowerCase().endsWith('.xls');
    
    const isPowerPoint = 
        fileType.includes('presentationml') ||
        fileType === 'application/vnd.ms-powerpoint' ||
        fileName.toLowerCase().endsWith('.pptx') ||
        fileName.toLowerCase().endsWith('.ppt');

    const isOffice = isWord || isExcel || isPowerPoint;

    if (fileType?.startsWith('image/')) {
        content.innerHTML = `
            <div class="viewer-zoom-container" id="zoomContainer">
                <img src="${material.fileData}" alt="${material.titulo}" class="viewer-img" id="zoomableContent">
            </div>
        `;
        setupZoomControls();
    } else if (fileType === 'application/pdf') {
        content.innerHTML = `
            <div class="viewer-zoom-container" id="zoomContainer">
                <iframe src="${material.fileData}" class="viewer-pdf" id="zoomableContent"></iframe>
            </div>
        `;
        setupZoomControls();
    } else if (isOffice) {
        content.innerHTML = `
            <div class="viewer-zoom-container">
                <div class="office-preview">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                    <h3>${isWord ? 'Documento Word' : isExcel ? 'Planilha Excel' : 'Apresentação PowerPoint'}</h3>
                    <p style="color: var(--muted-foreground); margin: 1rem 0;">
                        Arquivos Office (.docx, .xlsx, .pptx) precisam ser baixados para visualização completa.
                    </p>
                    <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                        ${material.titulo}
                    </p>
                    <a href="${material.fileData}" download="${material.titulo}" class="btn btn-primary" style="margin-top: 1.5rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Baixar arquivo
                    </a>
                </div>
            </div>
        `;
    } else if (fileType?.startsWith('text/') || fileName.toLowerCase().endsWith('.txt')) {
        fetch(material.fileData)
            .then(r => r.text())
            .then(text => {
                content.innerHTML = `
                    <div class="viewer-zoom-container" id="zoomContainer">
                        <pre class="viewer-text" id="zoomableContent">${text}</pre>
                    </div>
                `;
                setupZoomControls();
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

function setupZoomControls() {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');
    const zoomLevel = document.getElementById('zoomLevel');
    const zoomableContent = document.getElementById('zoomableContent');

    if (!zoomableContent) return;

    function updateZoom() {
        zoomableContent.style.transform = `scale(${currentZoom})`;
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    zoomInBtn?.addEventListener('click', () => {
        if (currentZoom < 3) {
            currentZoom += 0.25;
            updateZoom();
        }
    });

    zoomOutBtn?.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.25;
            updateZoom();
        }
    });

    zoomResetBtn?.addEventListener('click', () => {
        currentZoom = 1;
        updateZoom();
    });

    const container = document.getElementById('zoomContainer');
    container?.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0 && currentZoom < 3) {
                currentZoom += 0.1;
            } else if (e.deltaY > 0 && currentZoom > 0.5) {
                currentZoom -= 0.1;
            }
            updateZoom();
        }
    });
}

function closeDocumentViewer() {
    const modal = document.getElementById('viewerModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentDocument = null;
    currentZoom = 1;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentDocument) {
        closeDocumentViewer();
    }
});

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
    
    const favorited = isFavorito(material.id);
    const materialJson = JSON.stringify(material).replace(/"/g, '&quot;');
    
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
                    <button class="btn btn-primary" data-testid="button-view-${material.id}" onclick='openDocumentViewer(${materialJson})'>Visualizar</button>
                    <a href="${material.fileData || '#'}" download="${material.titulo}" class="btn btn-outline" data-testid="button-download-${material.id}">Baixar</a>
                    <button class="btn btn-ghost favorite-btn ${favorited ? 'favorited' : ''}" data-testid="button-favorite-${material.id}" onclick="handleFavorite('${material.id}', event)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${favorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ${favorited ? 'Favoritado' : 'Favoritar'}
                    </button>
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

const pages = {
    home: () => {
        const materiais = getMateriais().slice(0, 4);
        
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
                <div id="uploads-container" class="grid grid-cols-2">
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
                        <label class="filter-label">Área</label>
                        <select class="filter-select" id="filterAreaAula" data-testid="select-area">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Professor</label>
                        <select class="filter-select" id="filterProfessorAula" data-testid="select-professor">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">
                        Resultados (<span id="resultCountAula" data-testid="text-result-count">0</span>)
                    </h3>
                    <div id="resultContainerAula"></div>
                </div>
            </div>
        `;
    },

    'materiais': () => {
        return `
            <h1 class="page-title">MATERIAIS DIDÁTICOS</h1>
            <p class="page-description">Acesse rapidamente todos os materiais didáticos disponíveis.</p>
            
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
                        <select class="filter-select" id="filterAreaMaterial" data-testid="select-area">
                            <option value="">Todas</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Professor</label>
                        <select class="filter-select" id="filterProfessorMaterial" data-testid="select-professor">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">
                        Resultados (<span id="resultCountMaterial" data-testid="text-result-count">0</span>)
                    </h3>
                    <div id="resultContainerMaterial"></div>
                </div>
            </div>
        `;
    },

    upload: () => {
        return uploadPage.upload();
    },

    admin: () => {
        const materiais = getMateriais();
        
        return `
            <h1 class="page-title">ADMINISTRAÇÃO</h1>
            <p class="page-description">Gerencie todos os materiais do portal</p>
            
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
                        <h2 class="section-title">Todos os materiais</h2>
                        <p class="section-description">Total de ${materiais.length} materiais cadastrados</p>
                    </div>
                </div>
                <div id="admin-container" class="grid grid-cols-2">
                    <div id="admin-cards"></div>
                </div>
            </div>
        `;
    }
};

function loadPage(page) {
    if (pages[page]) {
        mainContent.innerHTML = pages[page]();
        
        if (page === 'home') {
            const materiais = getMateriais().slice(0, 4);
            const container = document.getElementById('material-cards');
            if (container) {
                materiais.forEach(material => {
                    container.appendChild(createMaterialCard(material));
                });
            }
        }
        
        if (page === 'planos-curso') {
            setupFilterPage('Plano de Curso', 'filterArea', 'filterProfessor', 'resultContainer', 'resultCount');
        }
        
        if (page === 'planos-aula') {
            setupFilterPage('Plano de Aula', 'filterAreaAula', 'filterProfessorAula', 'resultContainerAula', 'resultCountAula');
        }
        
        if (page === 'materiais') {
            setupFilterPage('Material', 'filterAreaMaterial', 'filterProfessorMaterial', 'resultContainerMaterial', 'resultCountMaterial');
        }
        
        if (page === 'admin') {
            const materiais = getMateriais();
            const container = document.getElementById('admin-cards');
            if (container) {
                materiais.forEach(material => {
                    container.appendChild(createMaterialCard(material, true));
                });
            }
        }
    }
}

function setupFilterPage(tipo, areaId, profId, containerId, countId) {
    const materiais = getMateriais().filter(m => m.tipo === tipo);
    const areas = [...new Set(materiais.map(m => m.area))];
    const professores = [...new Set(materiais.map(m => m.professor))];
    
    const areaSelect = document.getElementById(areaId);
    const profSelect = document.getElementById(profId);
    const container = document.getElementById(containerId);
    const count = document.getElementById(countId);
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });
    
    professores.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof;
        option.textContent = prof;
        profSelect.appendChild(option);
    });
    
    function filterResults() {
        const areaFilter = areaSelect.value;
        const profFilter = profSelect.value;
        
        const filtered = materiais.filter(m => {
            return (!areaFilter || m.area === areaFilter) &&
                   (!profFilter || m.professor === profFilter);
        });
        
        container.innerHTML = '';
        filtered.forEach(material => {
            container.appendChild(createMaterialCard(material));
        });
        
        count.textContent = filtered.length;
    }
    
    areaSelect.addEventListener('change', filterResults);
    profSelect.addEventListener('change', filterResults);
    
    filterResults();
}

const uploadPage = {
    upload: () => {
        return `
            <h1 class="page-title">Upload de Arquivos</h1>
            <p class="page-description">Envie materiais e visualize-os diretamente no portal</p>
            <div class="upload-card">
                <input type="file" id="fileInput" class="hidden" 
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx" 
                    multiple data-testid="input-file">
                <div class="upload-dropzone" id="uploadDropzone">
                    <svg class="upload-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <button class="btn btn-primary upload-main-btn" id="uploadBtn" type="button">
                        Selecionar arquivos
                    </button>
                    <p class="upload-hint">ou arraste arquivos para cá</p>
                    <p class="upload-subhint">Formatos aceitos: PDF, Word, Excel, PowerPoint, Imagens, TXT</p>
                </div>
                <div id="filePreview" class="file-preview hidden"></div>
            </div>
            <div id="uploadForm" class="form hidden">
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Metadados do arquivo</h3>
                <form id="materialForm">
                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" class="form-input" name="titulo" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tipo *</label>
                            <select class="filter-select" name="tipo" required>
                                <option value="">Selecione</option>
                                <option value="Plano de Curso">Plano de Curso</option>
                                <option value="Plano de Aula">Plano de Aula</option>
                                <option value="Material">Material</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Área *</label>
                            <input type="text" class="form-input" name="area" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Disciplina *</label>
                            <input type="text" class="form-input" name="disciplina" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Turma *</label>
                            <input type="text" class="form-input" name="turma" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professor *</label>
                            <input type="text" class="form-input" name="professor" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data *</label>
                            <input type="date" class="form-input" name="data" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tags (separadas por vírgula)</label>
                            <input type="text" class="form-input" name="tags" placeholder="tag1, tag2, tag3">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-textarea" name="descricao" rows="3"></textarea>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-outline" id="cancelBtn">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar material</button>
                    </div>
                </form>
            </div>
        `;
    }
};
function setupUploadPage() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const filePreview = document.getElementById('filePreview');
    const uploadForm = document.getElementById('uploadForm');
    const form = document.getElementById('materialForm');
    const cancelBtn = document.getElementById('cancelBtn');
    if (!dropzone || !fileInput) return;
    uploadBtn.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    function handleFiles(files) {
        if (!files.length) return;
        filePreview.innerHTML = '';
        filePreview.classList.remove('hidden');
        uploadForm.classList.remove('hidden');
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewEl = document.createElement('div');
                previewEl.className = 'file-preview-item';
                if (file.type.startsWith('image/')) {
                    previewEl.innerHTML = `
                        <img src="${event.target.result}" alt="${file.name}" class="file-thumb">
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                } else if (file.type === 'application/pdf') {
                    previewEl.innerHTML = `
                        <div class="file-icon pdf">📄</div>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                } else if (
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    file.type === 'application/msword' ||
                    file.name.endsWith('.docx') ||
                    file.name.endsWith('.doc')
                ) {
                    previewEl.innerHTML = `
                        <div class="file-icon word">📝</div>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                } else if (
                    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                    file.type === 'application/vnd.ms-powerpoint' ||
                    file.name.endsWith('.pptx') ||
                    file.name.endsWith('.ppt')
                ) {
                    previewEl.innerHTML = `
                        <div class="file-icon powerpoint">📊</div>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                } else if (
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') ||
                    file.name.endsWith('.xls')
                ) {
                    previewEl.innerHTML = `
                        <div class="file-icon excel">📈</div>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                } else {
                    previewEl.innerHTML = `
                        <div class="file-icon">📎</div>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">${file.name}</p>
                    `;
                }
                filePreview.appendChild(previewEl);
                form.dataset.fileData = event.target.result;
                form.dataset.fileType = file.type || 'application/octet-stream';
                form.dataset.fileName = file.name;
            };
            reader.readAsDataURL(file);
        });
    }
    cancelBtn?.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.classList.add('hidden');
        uploadForm.classList.add('hidden');
        form.reset();
    });
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const material = {
            titulo: data.get('titulo') || form.dataset.fileName,
            tipo: data.get('tipo') || 'Material',
            area: data.get('area') || 'Geral',
            disciplina: data.get('disciplina') || '-',
            turma: data.get('turma') || '-',
            professor: data.get('professor') || '-',
            data: data.get('data') || new Date().toISOString().split('T')[0],
            descricao: data.get('descricao') || '',
            tags: data.get('tags') ? data.get('tags').split(',').map(t => t.trim()) : [],
            fileData: form.dataset.fileData,
            fileType: form.dataset.fileType,
            fileName: form.dataset.fileName
        };
        addMaterial(material);
        alert('Material salvo com sucesso!');
        fileInput.value = '';
        uploadForm.classList.add('hidden');
        filePreview.classList.add('hidden');
        form.reset();
        
        setTimeout(() => {
            openDocumentViewer(material);
        }, 300);
    });
}
initializeData();
loadPage('home');
const observer = new MutationObserver(() => {
    if (document.getElementById('uploadDropzone')) {
        setupUploadPage();
    }
});
observer.observe(mainContent, { childList: true, subtree: true });