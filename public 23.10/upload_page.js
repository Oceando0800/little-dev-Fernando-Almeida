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
