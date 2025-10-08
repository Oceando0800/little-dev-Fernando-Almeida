// ==================== GERENCIAMENTO DE DADOS ====================
// Inicializar dados do localStorage
function initializeData() {
    if (!localStorage.getItem('professores')) {
        localStorage.setItem('professores', JSON.stringify(['Carlos Eduardo', 'Ana Paula', 'Roberto Silva']));
    }
    if (!localStorage.getItem('areas')) {
        localStorage.setItem('areas', JSON.stringify(['Eletromecânica', 'TI', 'Administração']));
    }
    if (!localStorage.getItem('disciplinas')) {
        localStorage.setItem('disciplinas', JSON.stringify(['Eletrônica', 'Circuitos', 'Frontend', 'Backend', 'Gestão', 'Programação']));
    }
    if (!localStorage.getItem('cursos')) {
        localStorage.setItem('cursos', JSON.stringify([
            { nome: 'Técnico em Eletromecânica', tipo: 'Técnico', area: 'Eletromecânica' },
            { nome: 'Desenvolvimento Full Stack', tipo: 'Técnico', area: 'TI' },
            { nome: 'Gestão Empresarial', tipo: 'Aperfeiçoamento', area: 'Administração' }
        ]));
    }
    if (!localStorage.getItem('materiais')) {
        localStorage.setItem('materiais', JSON.stringify([]));
    }
}

// Funções auxiliares para dados
function getProfessores() {
    return JSON.parse(localStorage.getItem('professores') || '[]');
}

function getAreas() {
    return JSON.parse(localStorage.getItem('areas') || '[]');
}

function getDisciplinas() {
    return JSON.parse(localStorage.getItem('disciplinas') || '[]');
}

function getCursos() {
    return JSON.parse(localStorage.getItem('cursos') || '[]');
}

function getMateriais() {
    return JSON.parse(localStorage.getItem('materiais') || '[]');
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
    sidebar.classList.toggle('open');
});

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

// ==================== FUNÇÕES AUXILIARES ====================
function createMaterialCard(material) {
    return `
        <div class="material-card">
            <div class="material-card-header">
                <svg class="material-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div style="flex: 1;">
                    <h3 class="material-title">${material.titulo}</h3>
                    <p class="material-meta">${material.area} • ${material.disciplina} • ${material.turma} • ${material.professor} • ${material.data}</p>
                    <p class="material-description">${material.descricao || ''}</p>
                    <div class="material-tags">
                        ${material.tags ? material.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="material-actions">
                        <button class="btn btn-primary">Visualizar</button>
                        <button class="btn btn-outline">Baixar</button>
                        <button class="btn btn-ghost">Favoritar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createFilterPanel(filters, onFilterChange) {
    const professores = getProfessores();
    const areas = getAreas();
    const disciplinas = getDisciplinas();
    const cursos = getCursos();
    
    return `
        <div class="filter-panel">
            <div class="filter-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filtros</span>
            </div>
            ${filters.map(filter => `
                <div class="filter-group">
                    <label class="filter-label">${filter.label}</label>
                    <select class="filter-select" data-filter="${filter.key}">
                        <option value="">Todos</option>
                        ${filter.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `).join('')}
        </div>
    `;
}

// ==================== PÁGINAS ====================
const pages = {
    home: () => {
        const materiais = getMateriais().slice(0, 3);
        return `
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
                    ${materiais.length > 0 ? materiais.map(m => createMaterialCard(m)).join('') : '<p>Nenhum upload ainda</p>'}
                </div>
            </div>
        `;
    },

    'planos-curso': () => {
        const materiais = getMateriais().filter(m => m.tipo === 'Plano de Curso');
        const cursos = getCursos();
        const tiposCurso = [...new Set(cursos.map(c => c.tipo))];
        
        let html = `
            <h1 class="page-title">PLANOS DE CURSO</h1>
            <p class="page-description">Acesse rapidamente todos os planos de curso organizados por área e professor.</p>
            <div class="mb-4">
                <p style="font-size: 0.875rem;"><strong>Filtros:</strong> Área | Tipo de Curso | Professor | Data</p>
            </div>
            <div class="grid grid-cols-4">
                <div>
                    ${createFilterPanel([
                        { label: 'Área', key: 'area', options: getAreas() },
                        { label: 'Tipo de Curso', key: 'tipoCurso', options: tiposCurso },
                        { label: 'Professor', key: 'professor', options: getProfessores() }
                    ])}
                </div>
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Resultados (<span id="resultCount">${materiais.length}</span>)</h3>
                    <div id="resultContainer">
                        ${materiais.length > 0 ? materiais.map(m => createMaterialCard(m)).join('') : '<p style="color: var(--muted-foreground);">Nenhum plano de curso encontrado</p>'}
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            setupFilters('Plano de Curso');
        }, 0);
        
        return html;
    },

    'planos-aula': () => {
        const materiais = getMateriais().filter(m => m.tipo === 'Plano de Aula');
        
        let html = `
            <h1 class="page-title">PLANOS DE AULA</h1>
            <p class="page-description">Acesse rapidamente todos os planos de aula organizados por área e professor.</p>
            <div class="mb-4">
                <p style="font-size: 0.875rem;"><strong>Filtros:</strong> Unidade Curricular | Turma | Professor</p>
            </div>
            <div class="grid grid-cols-4">
                <div>
                    ${createFilterPanel([
                        { label: 'Disciplina', key: 'disciplina', options: getDisciplinas() },
                        { label: 'Turma', key: 'turma', options: ['1A', '1B', '2A', '2B', '3A', '3B'] },
                        { label: 'Professor', key: 'professor', options: getProfessores() }
                    ])}
                </div>
                <div>
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Resultados (<span id="resultCount">${materiais.length}</span>)</h3>
                    <div id="resultContainer">
                        ${materiais.length > 0 ? materiais.map(m => createMaterialCard(m)).join('') : '<p style="color: var(--muted-foreground);">Nenhum plano de aula encontrado</p>'}
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            setupFilters('Plano de Aula');
        }, 0);
        
        return html;
    },

    materiais: () => {
        const materiais = getMateriais().filter(m => m.tipo === 'Material');
        
        return `
            <h1 class="page-title">Materiais Didáticos</h1>
            <p class="page-description">Busque e acesse materiais de apoio e recursos didáticos</p>
            
            <div class="section mb-4">
                <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Buscar conteúdos</h2>
                <input type="text" id="searchInput" placeholder="Buscar materiais didáticos..." class="form-input" style="padding-left: 2.5rem;">
            </div>
            
            <h3 style="font-weight: 600; margin-bottom: 1rem;">Materiais encontrados (<span id="resultCount">${materiais.length}</span>)</h3>
            <div id="resultContainer">
                ${materiais.length > 0 ? materiais.map(m => createMaterialCard(m)).join('') : '<p style="color: var(--muted-foreground);">Nenhum material encontrado</p>'}
            </div>
        `;
    },

    upload: () => {
        return `
            <h1 class="page-title">Upload de Arquivos</h1>
            <p class="page-description">Envie materiais e documentos para o portal</p>
            
            <div class="section mb-4">
                <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Criar um novo arquivo</h2>
                <div class="upload-area" onclick="document.getElementById('uploadForm').classList.remove('hidden')">
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
                <form onsubmit="handleUpload(event)">
                    <div class="grid grid-cols-2">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" name="titulo" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tipo *</label>
                            <select name="tipo" class="form-select" required>
                                <option value="">Selecionar tipo</option>
                                <option value="Plano de Curso">Plano de Curso</option>
                                <option value="Plano de Aula">Plano de Aula</option>
                                <option value="Material">Material Didático</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Área *</label>
                            <select name="area" class="form-select" required>
                                <option value="">Selecionar área</option>
                                ${getAreas().map(a => `<option value="${a}">${a}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Disciplina *</label>
                            <select name="disciplina" class="form-select" required>
                                <option value="">Selecionar disciplina</option>
                                ${getDisciplinas().map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Turma *</label>
                            <input type="text" name="turma" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professor *</label>
                            <select name="professor" class="form-select" required>
                                <option value="">Selecionar professor</option>
                                ${getProfessores().map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data *</label>
                            <input type="date" name="data" class="form-input" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea name="descricao" class="form-textarea" placeholder="Descrição curta do material"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tags (separadas por vírgula)</label>
                        <input type="text" name="tags" class="form-input" placeholder="Ex: React, JavaScript, Frontend">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Salvar Material
                    </button>
                </form>
            </div>
        `;
    },

    admin: () => {
        const professores = getProfessores();
        const areas = getAreas();
        const disciplinas = getDisciplinas();
        const cursos = getCursos();
        
        return `
            <h1 class="page-title">Administração</h1>
            <p class="page-description">Gerencie professores, áreas, disciplinas e cursos</p>
            
            <div class="grid grid-cols-2">
                <!-- Professores -->
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Professores</h3>
                    <div class="form-group">
                        <input type="text" id="novoProfessor" class="form-input" placeholder="Nome do professor">
                        <button onclick="adicionarProfessor()" class="btn btn-primary mt-4" style="width: 100%;">Adicionar Professor</button>
                    </div>
                    <div class="admin-list mt-4">
                        ${professores.map(p => `
                            <div class="admin-list-item">
                                <span>${p}</span>
                                <button onclick="removerProfessor('${p}')" class="btn btn-destructive" style="padding: 0.25rem 0.5rem;">Remover</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Áreas -->
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Áreas</h3>
                    <div class="form-group">
                        <input type="text" id="novaArea" class="form-input" placeholder="Nome da área">
                        <button onclick="adicionarArea()" class="btn btn-primary mt-4" style="width: 100%;">Adicionar Área</button>
                    </div>
                    <div class="admin-list mt-4">
                        ${areas.map(a => `
                            <div class="admin-list-item">
                                <span>${a}</span>
                                <button onclick="removerArea('${a}')" class="btn btn-destructive" style="padding: 0.25rem 0.5rem;">Remover</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Disciplinas -->
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Disciplinas</h3>
                    <div class="form-group">
                        <input type="text" id="novaDisciplina" class="form-input" placeholder="Nome da disciplina">
                        <button onclick="adicionarDisciplina()" class="btn btn-primary mt-4" style="width: 100%;">Adicionar Disciplina</button>
                    </div>
                    <div class="admin-list mt-4">
                        ${disciplinas.map(d => `
                            <div class="admin-list-item">
                                <span>${d}</span>
                                <button onclick="removerDisciplina('${d}')" class="btn btn-destructive" style="padding: 0.25rem 0.5rem;">Remover</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Cursos -->
                <div class="section">
                    <h3 style="font-weight: 600; margin-bottom: 1rem;">Cursos</h3>
                    <div class="form-group">
                        <input type="text" id="novoCursoNome" class="form-input" placeholder="Nome do curso" style="margin-bottom: 0.5rem;">
                        <select id="novoCursoTipo" class="form-select" style="margin-bottom: 0.5rem;">
                            <option value="">Tipo de curso</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Aperfeiçoamento">Aperfeiçoamento</option>
                            <option value="Qualificação">Qualificação</option>
                        </select>
                        <select id="novoCursoArea" class="form-select">
                            <option value="">Área do curso</option>
                            ${areas.map(a => `<option value="${a}">${a}</option>`).join('')}
                        </select>
                        <button onclick="adicionarCurso()" class="btn btn-primary mt-4" style="width: 100%;">Adicionar Curso</button>
                    </div>
                    <div class="admin-list mt-4">
                        ${cursos.map((c, i) => `
                            <div class="admin-list-item">
                                <span>${c.nome} (${c.tipo} - ${c.area})</span>
                                <button onclick="removerCurso(${i})" class="btn btn-destructive" style="padding: 0.25rem 0.5rem;">Remover</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

function loadPage(page) {
    mainContent.innerHTML = pages[page] ? pages[page]() : pages.home();
}

// ==================== FUNÇÕES DE ADMIN ====================
function adicionarProfessor() {
    const input = document.getElementById('novoProfessor');
    const nome = input.value.trim();
    if (nome) {
        const professores = getProfessores();
        if (!professores.includes(nome)) {
            professores.push(nome);
            localStorage.setItem('professores', JSON.stringify(professores));
            loadPage('admin');
        }
    }
}

function removerProfessor(nome) {
    const professores = getProfessores().filter(p => p !== nome);
    localStorage.setItem('professores', JSON.stringify(professores));
    loadPage('admin');
}

function adicionarArea() {
    const input = document.getElementById('novaArea');
    const nome = input.value.trim();
    if (nome) {
        const areas = getAreas();
        if (!areas.includes(nome)) {
            areas.push(nome);
            localStorage.setItem('areas', JSON.stringify(areas));
            loadPage('admin');
        }
    }
}

function removerArea(nome) {
    const areas = getAreas().filter(a => a !== nome);
    localStorage.setItem('areas', JSON.stringify(areas));
    loadPage('admin');
}

function adicionarDisciplina() {
    const input = document.getElementById('novaDisciplina');
    const nome = input.value.trim();
    if (nome) {
        const disciplinas = getDisciplinas();
        if (!disciplinas.includes(nome)) {
            disciplinas.push(nome);
            localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
            loadPage('admin');
        }
    }
}

function removerDisciplina(nome) {
    const disciplinas = getDisciplinas().filter(d => d !== nome);
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
    loadPage('admin');
}

function adicionarCurso() {
    const nome = document.getElementById('novoCursoNome').value.trim();
    const tipo = document.getElementById('novoCursoTipo').value;
    const area = document.getElementById('novoCursoArea').value;
    
    if (nome && tipo && area) {
        const cursos = getCursos();
        cursos.push({ nome, tipo, area });
        localStorage.setItem('cursos', JSON.stringify(cursos));
        loadPage('admin');
    }
}

function removerCurso(index) {
    const cursos = getCursos();
    cursos.splice(index, 1);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    loadPage('admin');
}

// ==================== UPLOAD ====================
function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
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
    
    const materiais = getMateriais();
    materiais.push(material);
    localStorage.setItem('materiais', JSON.stringify(materiais));
    
    alert('Material salvo com sucesso!');
    loadPage('home');
}

// ==================== FILTROS ====================
function setupFilters(tipoMaterial) {
    const selects = document.querySelectorAll('.filter-select');
    const filters = {};
    
    selects.forEach(select => {
        select.addEventListener('change', () => {
            filters[select.dataset.filter] = select.value;
            filterMateriais(tipoMaterial, filters);
        });
    });
}

function filterMateriais(tipoMaterial, filters) {
    let materiais = getMateriais().filter(m => m.tipo === tipoMaterial);
    
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            if (key === 'tipoCurso') {
                const cursos = getCursos().filter(c => c.tipo === filters[key]);
                const cursosNomes = cursos.map(c => c.nome);
                materiais = materiais.filter(m => cursosNomes.includes(m.titulo));
            } else {
                materiais = materiais.filter(m => m[key] === filters[key]);
            }
        }
    });
    
    const container = document.getElementById('resultContainer');
    const countSpan = document.getElementById('resultCount');
    
    countSpan.textContent = materiais.length;
    container.innerHTML = materiais.length > 0 
        ? materiais.map(m => createMaterialCard(m)).join('') 
        : '<p style="color: var(--muted-foreground);">Nenhum resultado encontrado com os filtros selecionados.</p>';
}

// ==================== INICIALIZAÇÃO ====================
initializeData();
loadPage('home');
