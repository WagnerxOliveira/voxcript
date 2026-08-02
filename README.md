# 🎙️ VoxScript - Cyber Transcripter v3.0

O **VoxScript** é uma aplicação web de transcrição de voz para texto em tempo real projetada especificamente para promover a acessibilidade pedagógica e a inclusão de pessoas com deficiência auditiva.

Com uma interface moderna inspirada em painéis "Cyberpunk" (Cyber HUD), o sistema converte o fluxo de fala contínuo em uma interface visual de alta legibilidade. O texto bruto capturado passa por análise e alimenta de forma automatizada o widget do **VLibras**, permitindo o acompanhamento do conteúdo tanto pela leitura em português quanto pela Língua Brasileira de Sinais por meio de um avatar digital animado.

---

## 🚀 Principais Funcionalidades

- **Transcrição em Tempo Real:** Utiliza a Web Speech API para capturar e transcrever áudio contínuo diretamente do navegador, sem necessidade de servidores intermediários.
- **Integração com VLibras:** Tradução instantânea do texto transcrito para a Língua Brasileira de Sinais (LIBRAS) via widget oficial.
- **Interface Cyber HUD:** Design responsivo, futurista e de alto contraste, garantindo excelente legibilidade em ambientes educacionais.
- **Modos de Operação Duplos:** Alternância entre o modo de "Leitura/Libras" (somente visualização) e o "Modo Edição" (onde o usuário pode corrigir pontuações e textos manualmente).
- **Tratamento de Falhas Inteligente:** O sistema de captura possui religamento automático em caso de pausas prolongadas ou perda temporária de foco.

---

## 🛠️ Tecnologias Utilizadas

A stack de engenharia do projeto foi selecionada para garantir baixíssima latência e total segurança de dados (Privacy by Design):

- **Front-end:** HTML5, CSS3 (Variáveis CSS, Animações e Efeitos Glassmorphism) e JavaScript (Vanilla ES6).
- **Framework de UI:** Bootstrap 5 em conjunto com Bootstrap Icons.
- **Acessibilidade & Voz:** `Web Speech API` (captura acústica local) e Widget de Tradução Digital VLibras (LAPI/UFPB).
- **Hospedagem e CI/CD:** Vercel integrada ao GitHub.

---

## 📁 Estrutura do Repositório

```cmd
├── evidencias/
│   └── prints/
│       ├── aplicacao_web1.png
│       ├── aplicacao_web2.png
│       ├── desktop.ini
│       └── README.md
└── src/
    ├── index.html
    ├── script.js
    ├── style.css
    ├── .gitignore
    └── README.md
```
