# Portal SENAI - Versão Standalone

Portal de upload e consulta rápida de planos de curso e materiais didáticos com interface limpa tipo AVA.

## ✅ Melhorias Implementadas

1. **Sidebar Recolhível** - Barra lateral com animação suave de expansão/recolhimento
2. **Função de Exclusão** - Botão de lixeira para excluir uploads imediatamente
3. **Header Simplificado** - Apenas o botão de modo noturno (lua/sol)

## 📁 Arquivos

```
public/
├── index.html       # Página HTML principal
├── styles.css       # Estilos CSS completos
├── script.js        # JavaScript com todas as funcionalidades
├── images/          # Logos do SENAI
│   ├── logo-branca.png
│   └── logo-colorida.png
└── README.md        # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Não precisa de servidor - funciona direto do arquivo local
3. Todos os dados são salvos no localStorage do navegador

## 🎨 Funcionalidades

### ✨ Sidebar
- **Recolher/Expandir**: Clique no botão com seta na sidebar
- **Animação suave**: Transição de 300ms com easing
- **Estado persistente**: Lembra se estava recolhida ao recarregar
- **Mobile**: Sidebar desliza da lateral no mobile

### 🗑️ Exclusão de Uploads
- **Botão de lixeira**: Aparece em cada card na página inicial
- **Exclusão imediata**: Sem confirmação (como solicitado)
- **Animação**: Fade out suave de 200ms antes de remover

### 🌙 Modo Noturno/Claro
- **Apenas 1 botão**: Sol/Lua no canto superior direito
- **Troca instantânea**: Sem delay
- **Persistente**: Lembra a preferência ao recarregar
- **Padrão**: Dark mode

### 📄 Páginas
- **Página Inicial**: Últimos 3 uploads com função de excluir
- **Planos de Curso**: Filtros por Área e Professor
- **Planos de Aula**: Filtros por Disciplina e Turma
- **Materiais Didáticos**: Busca por texto
- **Upload**: Formulário completo para criar novos materiais
- **Administração**: Página administrativa

## 💾 Dados

Os dados são salvos no `localStorage` do navegador:
- `materiais`: Lista de todos os materiais/planos
- `theme`: Tema atual (light/dark)
- `sidebarCollapsed`: Estado da sidebar (true/false)

### Dados Iniciais (Mock)
O sistema já vem com 6 materiais de exemplo:
- 2 Planos de Curso
- 2 Planos de Aula
- 2 Materiais Didáticos

## 🎯 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Variáveis CSS para temas, animações, grid/flexbox
- **JavaScript Vanilla**: Sem frameworks, apenas JS puro
- **localStorage**: Persistência de dados no navegador

## 📱 Responsivo

- **Desktop**: Layout completo com sidebar lateral
- **Mobile** (< 768px): Sidebar em overlay, colunas empilhadas

## 🔧 Personalização

### Cores
Edite as variáveis CSS em `styles.css`:
- `:root` - Modo claro
- `.dark` - Modo escuro

### Dados Iniciais
Edite a função `initializeData()` em `script.js`

## ⚠️ Observações

- Os dados ficam apenas no navegador (localStorage)
- Para integração com banco de dados real, é necessário backend
- As logos do SENAI devem estar na pasta `images/`

## 📞 Suporte

Este é um protótipo frontend funcional. Para produção, considere:
- Backend com Node.js/PHP/Python
- Banco de dados MySQL/PostgreSQL
- Upload real de arquivos
- Sistema de autenticação
