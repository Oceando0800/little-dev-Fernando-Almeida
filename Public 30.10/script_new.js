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
}
