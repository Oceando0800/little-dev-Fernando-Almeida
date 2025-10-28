// ==================== PÁGINA DE UPLOAD (NOVA VERSÃO COMPLETA) ====================
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

// ==================== LÓGICA DE UPLOAD ====================
document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const filePreview = document.getElementById('filePreview');
    const uploadForm = document.getElementById('uploadForm');
    const form = document.getElementById('materialForm');

    if (!dropzone || !fileInput) return;

    uploadBtn.addEventListener('click', () => fileInput.click());

    // Drag and Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Manipular seleção
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
                        <p>${file.name}</p>
                    `;
                } else if (file.type === 'application/pdf') {
                    previewEl.innerHTML = `
                        <div class="file-icon pdf"></div>
                        <p>${file.name}</p>
                    `;
                } else {
                    previewEl.innerHTML = `
                        <div class="file-icon generic"></div>
                        <p>${file.name}</p>
                    `;
                }

                filePreview.appendChild(previewEl);

                // Salvar dados temporariamente no material
                form.dataset.fileData = event.target.result;
                form.dataset.fileType = file.type;
                form.dataset.fileName = file.name;
            };
            reader.readAsDataURL(file);
        });
    }

    // Cancelar
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.classList.add('hidden');
        uploadForm.classList.add('hidden');
    });

    // Salvar
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
            fileType: form.dataset.fileType
        };

        addMaterial(material);
        alert('Material salvo com sucesso!');
        fileInput.value = '';
        uploadForm.classList.add('hidden');
        filePreview.classList.add('hidden');
        form.reset();
    });
    // ==================== ABRIR VISUALIZAÇÃO AUTOMÁTICA ====================
function tryAutoOpen(material) {
    // Aguarda o addMaterial terminar de salvar
    setTimeout(() => {
        if (typeof openDocumentViewer === 'function') {
            openDocumentViewer(material);
        } else {
            console.warn('Função openDocumentViewer não encontrada.');
        }
    }, 400);
}

// Intercepta o addMaterial para abrir o preview logo após salvar
const originalAddMaterial = window.addMaterial;
window.addMaterial = function(material) {
    if (originalAddMaterial) originalAddMaterial(material);
    tryAutoOpen(material);
};

});