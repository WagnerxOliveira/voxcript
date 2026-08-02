<div align="center">
  <h1>🎙️ VoxScript</h1>
  <p><em>Cyber Transcripter v3.0</em></p>
  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

> Uma aplicação web de transcrição de voz para texto em tempo real, focada em **acessibilidade pedagógica e inclusão** para pessoas com deficiência auditiva.

## 🎯 O Impacto do Projeto

O **VoxScript** resolve o desafio da comunicação inclusiva em tempo real. Com uma interface moderna inspirada em painéis _Cyberpunk_ (Cyber HUD), o sistema capta o fluxo de fala contínuo do educador e o converte instantaneamente em uma interface visual de alta legibilidade.

Para garantir acessibilidade plena, o texto bruto processado alimenta de forma automatizada o widget do **VLibras**, permitindo ao estudante acompanhar o conteúdo através da leitura em português ou pela Língua Brasileira de Sinais (LIBRAS) via avatar digital animado.

---

## ✨ Soluções de Engenharia & Funcionalidades

- ⚡ **Transcrição Real-Time 100% Client-Side:** Captura e transcreve áudio contínuo utilizando a `Web Speech API` diretamente no navegador, eliminando a latência de servidores intermediários.
- 🤟 **Integração Nativa com VLibras:** Tradução semântica instantânea do texto transcrito para LIBRAS, acionando o widget oficial do governo de forma fluida.
- 🎨 **UI/UX Cyber HUD:** Design responsivo, futurista e com alto índice de contraste, ideal para manter o foco cognitivo em ambientes educacionais.
- 🔄 **State Management Dinâmico:** Alternância de estado fluida entre o **Modo de Leitura** (visualização limpa) e o **Modo de Edição** (intervenção manual para correções sintáticas).
- 🛡️ **Resiliência e Auto-Recovery:** Algoritmo de captura inteligente com tratamento de falhas e religamento automático em caso de pausas prolongadas ou perda de foco da janela (Arquitetura _Privacy by Design_).

---

## 💻 Stack Tecnológica

A arquitetura foi desenhada para garantir **baixíssima latência** e **segurança de dados**, processando informações em tempo real sem persistência não autorizada em bancos de dados.

- **Core Languages:** HTML5, CSS3 (Variáveis globais, Keyframe Animations, Glassmorphism), JavaScript (ES6+ Vanilla).
- **Design System & UI:** Bootstrap 5 + Bootstrap Icons.
- **APIs e Acessibilidade:** Web Speech API (Engine de reconhecimento acústico nativo) e Suíte VLibras (LAPI/UFPB).
- **DevOps & Deploy:** CI/CD automatizado via integração GitHub Vercel.

---

## 📂 Arquitetura do Repositório

```text
📦 voxscript
├── 📂 evidencias/          # Documentação visual e validações de entrega
│   └── 📂 prints/
│       ├── 📄 aplicacao_web1.png
│       └── 📄 aplicacao_web2.png
└── 📂 src/                 # Source code da aplicação
    ├── 📄 index.html       # Estrutura DOM do Cyber HUD e injeção do VLibras
    ├── 📄 style.css        # Design system, propriedades customizadas e media queries
    └── 📄 script.js        # Engine assíncrona de transcrição e manipulação do DOM
```
