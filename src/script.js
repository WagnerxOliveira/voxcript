// ============================================================
// VoxScript - script.js (Versão Ultra-Estável e Anti-Bugs)
// ============================================================

// --- Referências DOM ---
const transcription   = document.getElementById("transcription");
const startBtn        = document.getElementById("startBtn");
const stopBtn         = document.getElementById("stopBtn");
const copyBtn         = document.getElementById("copyBtn");
const clearBtn        = document.getElementById("clearBtn");
const statusText      = document.getElementById("status");
const recordingWave   = document.getElementById("recordingWave");
const editToggleBtn   = document.getElementById("editToggleBtn");
const boxWrapper      = transcription.parentElement;

const PLACEHOLDER_TEXT = "Aguardando ativação de sinal de áudio digital...";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition      = null;
let isListening      = false; // Desejo do usuário (Capturando: Sim/Não)
let isCapturing      = false; // Estado real da API (Ativo agora: Sim/Não)
let finalTranscript  = "";
let restartTimeout   = null;
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 5;

// --- Utilitários Visuais ---
function showWave() {
  recordingWave.classList.remove("d-none");
  boxWrapper.classList.add("recording-active");
}

function hideWave() {
  recordingWave.classList.add("d-none");
  boxWrapper.classList.remove("recording-active");
}

function isPlaceholder(text) {
  const t = text.trim().toLowerCase();
  return t === "" || t === PLACEHOLDER_TEXT.toLowerCase();
}

function setStatus(html, isHTML) {
  if (isHTML) {
    statusText.innerHTML = html;
  } else {
    statusText.innerText = html;
  }
}

// --- Funções de Controle da API de Reconhecimento ---
function startRecognition() {
  if (!recognition) return;
  if (isCapturing) return;

  console.log("[VoxScript] Tentando iniciar SpeechRecognition...");
  try {
    recognition.start();
  } catch (err) {
    console.warn("[VoxScript] Erro ao chamar recognition.start():", err);
    if (err.name === "InvalidStateError") {
      // Já está em transição ou ativo, ignora e deixa os eventos sincronizarem
    } else {
      handleCriticalError(err.message);
    }
  }
}

function handleCriticalError(errorMsg) {
  isListening = false;
  isCapturing = false;
  hideWave();
  setStatus(`<span class="text-danger">[ ALERTA CRÍTICO // ${errorMsg.toUpperCase()} ]</span>`, true);
  startBtn.disabled = false;
  stopBtn.disabled  = true;
}

// --- Inicialização do SpeechRecognition ---
function initRecognition() {
  // Limpa instância e eventos anteriores para evitar vazamento de memória e conflitos
  if (recognition) {
    recognition.onstart  = null;
    recognition.onend    = null;
    recognition.onerror  = null;
    recognition.onresult = null;
    try {
      recognition.abort();
    } catch (e) {
      console.warn("[VoxScript] Erro ao abortar reconhecimento anterior:", e);
    }
    recognition = null;
  }

  recognition = new SpeechRecognition();
  recognition.lang            = "pt-BR";
  recognition.continuous      = true;
  recognition.interimResults  = true;
  recognition.maxAlternatives = 1;

  // Evento: Iniciou Captura Real
  recognition.onstart = () => {
    isCapturing = true;
    consecutiveErrors = 0;
    setStatus(`[ <strong style="color:#39ff14;text-shadow:0 0 5px rgba(57,255,20,.5)">GRAVAÇÃO EM CURSO</strong> // CAPTURANDO ENTRADA ]`, true);
    showWave();
    startBtn.disabled = true;
    stopBtn.disabled  = false;
    console.log("[VoxScript] Captura de áudio ativa.");
  };

  // Evento: Fim da Captura
  recognition.onend = () => {
    isCapturing = false;
    console.log("[VoxScript] Captura finalizada. isListening =", isListening);

    if (isListening) {
      // Se a página perdeu o foco (ex: VLibras abriu ou o usuário mudou de aba)
      if (!document.hasFocus()) {
        console.log("[VoxScript] Foco perdido. Captura pausada temporariamente.");
        setStatus(`[ <strong style="color:#ffaa00">SINAL EM ESPERA</strong> // CLIQUE NA TELA PARA RETOMAR ]`, true);
        hideWave();
        return;
      }

      // Reinício automático em caso de silêncio ou timeout do navegador
      if (consecutiveErrors < MAX_CONSECUTIVE_ERRORS) {
        if (restartTimeout) clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
          if (isListening && !isCapturing) {
            console.log("[VoxScript] Reiniciando captura automática por fim de ciclo...");
            startRecognition();
          }
        }, 300);
      } else {
        handleCriticalError("EXCESSO DE FALHAS CONSECUTIVAS");
      }
    } else {
      // Parada manual
      hideWave();
      setStatus("[ SINAL INTERROMPIDO // MÓDULO EM STANDBY ]", false);
      startBtn.disabled = false;
      stopBtn.disabled  = true;
    }
  };

  // Evento: Tratamento de Erros
  recognition.onerror = (event) => {
    const err = event.error;
    console.error("[VoxScript] Erro de Reconhecimento:", err);

    if (err === "no-speech") {
      // Sem fala: normal para capturas longas
      setStatus(`[ <strong style="color:#00f0ff">ESCUTA ATIVA</strong> // AGUARDANDO SINAL ]`, true);
      return;
    }

    consecutiveErrors++;

    if (err === "aborted" || err === "network") {
      if (!document.hasFocus()) {
        setStatus(`[ <strong style="color:#ffaa00">SINAL EM ESPERA</strong> // CLIQUE NA TELA PARA RETOMAR ]`, true);
      } else {
        setStatus(`[ <strong style="color:#ffaa00">RECUPERANDO SINAL</strong> // RECONECTANDO... ]`, true);
      }
      return;
    }

    // Erros fatais (permissão de microfone negada ou sem microfone físico)
    const msg = err === "not-allowed"
      ? "PERMISSÃO NEGADA // LIBERE O MICROFONE NO NAVEGADOR"
      : err === "audio-capture"
        ? "MICROFONE NÃO ENCONTRADO"
        : "ERRO: " + err.toUpperCase();

    handleCriticalError(msg);
  };

  // Evento: Resultado de Voz
  recognition.onresult = (event) => {
    if (isPlaceholder(transcription.innerText)) {
      transcription.innerText = "";
      finalTranscript = "";
    }

    let interim = "";
    let finalized = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (!result || !result[0]) continue;
      const text = result[0].transcript;
      if (result.isFinal) {
        finalized += text.trim() + "\n";
      } else {
        interim += text;
      }
    }

    if (finalized) {
      finalTranscript += finalized;
      updateLibrasContent();
    }

    // Renderiza ciano e verde provisório
    if (interim) {
      transcription.innerHTML = finalTranscript + '<span class="interim">' + interim + '</span>';
    } else {
      transcription.innerText = finalTranscript;
    }

    // Mantém scroll no final
    transcription.scrollTop = transcription.scrollHeight;
  };
}

// ============================================================
// Inicialização Principal do Sistema VoxScript
// ============================================================
if (!SpeechRecognition) {
  setStatus(`<span class="text-danger">[ ERRO // NAVEGADOR SEM SUPORTE. USE CHROME OU EDGE ]</span>`, true);
  startBtn.disabled    = true;
  stopBtn.disabled     = true;
  copyBtn.disabled     = true;
  clearBtn.disabled    = true;
  if (editToggleBtn) editToggleBtn.disabled = true;
} else {
  // Configuração inicial segura
  initRecognition();
  stopBtn.disabled = true;
  setStatus("[ PRONTO PARA OPERAÇÃO ]", false);

  // --- Botão INICIAR CAPTURA ---
  startBtn.addEventListener("click", () => {
    isListening = true;
    consecutiveErrors = 0;

    if (restartTimeout) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }

    // Preserva texto digitado/transcrito como base
    if (!isPlaceholder(transcription.innerText)) {
      finalTranscript = transcription.innerText;
      if (!finalTranscript.endsWith("\n")) finalTranscript += "\n";
    } else {
      transcription.innerText = "";
      finalTranscript = "";
    }

    startRecognition();
  });

  // --- Botão PARAR CAPTURA ---
  stopBtn.addEventListener("click", () => {
    isListening = false;
    consecutiveErrors = 0;
    if (restartTimeout) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }
    
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("[VoxScript] Erro ao parar reconhecimento:", e);
      }
    }

    isCapturing = false;
    hideWave();
    setStatus("[ SINAL INTERROMPIDO // MÓDULO EM STANDBY ]", false);
    startBtn.disabled = false;
    stopBtn.disabled  = true;
  });

  // --- Botão COPIAR REGISTRO ---
  copyBtn.addEventListener("click", () => {
    const text = transcription.innerText.trim();
    if (!text || isPlaceholder(text)) {
      setStatus(`<span class="text-warning">[ AVISO // NENHUM TEXTO PARA COPIAR ]</span>`, true);
      setTimeout(() => {
        if (!isListening) setStatus("[ PRONTO PARA OPERAÇÃO ]", false);
      }, 2000);
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        const prev = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-clipboard-check-fill"></i> COPIADO!';
        copyBtn.style.background = "var(--border-neon-cyan)";
        copyBtn.style.color = "#030307";
        setTimeout(() => {
          copyBtn.innerHTML = prev;
          copyBtn.style.background = "";
          copyBtn.style.color = "";
        }, 2000);
        setStatus(`<span style="color:#39ff14">[ DADOS COPIADOS COM SUCESSO ]</span>`, true);
        setTimeout(() => {
          if (!isListening) setStatus("[ PRONTO PARA OPERAÇÃO ]", false);
        }, 2500);
      })
      .catch(() => setStatus(`<span class="text-danger">[ ERRO AO COPIAR ]</span>`, true));
  });

  // --- Botão LIMPAR REGISTRO ---
  clearBtn.addEventListener("click", () => {
    transcription.innerText = PLACEHOLDER_TEXT;
    finalTranscript = "";
    if (!isListening) setStatus("[ PRONTO PARA OPERAÇÃO ]", false);
  });

  // --- Botão ALTERNAR MODO (LEITURA/LIBRAS vs EDIÇÃO) ---
  if (editToggleBtn) {
    editToggleBtn.addEventListener("click", () => {
      const editable = transcription.contentEditable === "true";
      if (editable) {
        transcription.contentEditable = "false";
        editToggleBtn.innerHTML = '<i class="bi bi-lock-fill"></i> LEITURA/LIBRAS';
        editToggleBtn.classList.remove("edit-mode-active");
      } else {
        transcription.contentEditable = "true";
        editToggleBtn.innerHTML = '<i class="bi bi-pencil-square"></i> MODO_EDIÇÃO';
        editToggleBtn.classList.add("edit-mode-active");
        if (isPlaceholder(transcription.innerText)) {
          transcription.innerText = "";
          finalTranscript = "";
        }
        transcription.focus();
      }
    });
  }

  // --- Sincronização e Eventos Globais de Foco/Interação ---
  window.addEventListener("focus", () => {
    if (isListening && !isCapturing) {
      console.log("[VoxScript] Janela recebeu foco. Retomando gravação...");
      startRecognition();
    }
  });

  document.addEventListener("click", (e) => {
    // Se clicou em qualquer parte da página principal, e estávamos em modo de escuta mas inativos, retoma
    if (isListening && !isCapturing) {
      // Ignora cliques no botão de parar para que o clique realmente o desligue
      if (e.target === stopBtn || stopBtn.contains(e.target)) return;
      console.log("[VoxScript] Interação do usuário detectada. Retomando gravação...");
      startRecognition();
    }
  });

  // Sincroniza digitação manual com finalTranscript no modo edição
  transcription.addEventListener("input", () => {
    if (transcription.contentEditable !== "true") return;
    finalTranscript = transcription.innerText;
    if (isPlaceholder(finalTranscript)) finalTranscript = "";
  });

  // Placeholder ao desfocar campo se vazio
  transcription.addEventListener("blur", () => {
    if (transcription.contentEditable !== "true") return;
    if (transcription.innerText.trim() === "") {
      transcription.innerText = PLACEHOLDER_TEXT;
      finalTranscript = "";
    }
  });

  // Remove placeholder ao focar campo
  transcription.addEventListener("focus", () => {
    if (transcription.contentEditable !== "true") return;
    if (isPlaceholder(transcription.innerText)) {
      transcription.innerText = "";
      finalTranscript = "";
    }
  });
}