const ACADEMIC_NOTICE =
  "AVISO – CONTEXTO ACADÊMICO DO PROJETO. Este projeto é uma simulação online desenvolvida como parte da Atividade 2 da disciplina Atividades Extensionistas I – Desenvolvimento Sustentável, do curso de graduação em Segurança da Informação da Faculdade Unicive pelo aluno Douglas para conscientização sobre golpes online no WhatsApp.";

const ADMIN_HASH = "#painel-resultados-unicive-douglas-2026";
const ADMIN_USER = "vDFeeA7aSCagHSiND6Lf";
const ADMIN_PASS = "ChfpMgoV8SKCMJQRWRW4";

// =================================================================
// CONFIGURAÇÃO DO FIREBASE (Chaves Oficiais Integradas)
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCtuFBEHrxMPbaBLDOsXMbTeTkRKBhwc_4",
  authDomain: "simulador-whatsapp-unicive.firebaseapp.com",
  projectId: "simulador-whatsapp-unicive",
  storageBucket: "simulador-whatsapp-unicive.firebasestorage.app",
  messagingSenderId: "521362735071",
  appId: "1:521362735071:web:f4d200dfcc1d27737dce6a",
  measurementId: "G-WKWVJ1ZZTR"
};

// Inicializa a conexão com a nuvem do Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const DB_COLLECTION = "resultados_simulacao";

// =================================================================
// DADOS DOS CENÁRIOS DO SIMULADOR
// =================================================================
const scenarios = [
  {
    id: "scen_01",
    title: "O Código de Confirmação por SMS",
    sender: "Suporte Técnico (Suposto)",
    avatar: "🛠️",
    risk: "Alto",
    message:
      "Olá! Detectamos uma tentativa de acesso não autorizada à sua conta do WhatsApp a partir de outro dispositivo. Para garantir sua segurança e bloquear essa ação, enviamos um código de confirmação de 6 dígitos via SMS para o seu aparelho. Por favor, nos informe esse código imediatamente para confirmarmos sua identidade.",
    explanation:
      "GOLPE: Clonagem / Roubo de Conta. O invasor está tentando instalar o seu WhatsApp no aparelho dele. O código de 6 dígitos enviado por SMS é a chave de verificação do aplicativo. Se você fornecer esse código, o golpista assumirá o controle total do seu perfil, bloqueando seu acesso e passando a pedir dinheiro aos seus contatos.",
    options: [
      {
        text: "Fornecer o código rapidamente para proteger a conta conforme solicitado.",
        correct: false,
        feedback: "Incorreto! Você acabou de entregar a chave de acesso da sua conta ao invasor."
      },
      {
        text: "Ignorar a mensagem, não enviar código algum e ativar a Confirmação em Duas Etapas no próprio aplicativo.",
        correct: true,
        feedback: "Correto! O suporte oficial do WhatsApp nunca solicita códigos de verificação por chat ou telefone."
      },
      {
        text: "Responder perguntando o nome do atendente e pedir um protocolo formal de atendimento por escrito.",
        correct: false,
        feedback: "Incorreto! Interagir dá tempo ao golpista para te persuadir por engenharia social."
      }
    ]
  },
  {
    id: "scen_02",
    title: "O Parente em Apuros (Novo Número)",
    sender: "Filho(a) / Familiar (Suposto)",
    avatar: "👤",
    risk: "Crítico",
    message:
      "Oi pai/mãe, salvei esse número temporário porque meu celular antigo caiu e quebrou a tela de vez, estou usando esse até resolver. Preciso pagar uma conta urgente do conserto hoje antes que o banco feche, mas meu aplicativo não está autorizando transações nesse aparelho novo. Consegue transferir R$ 1.850,00 para a conta do técnico via Pix? Te devolvo amanhã cedo sem falta!",
    explanation:
      "GOLPE: Engenharia Social / Falso Familiar. Criminosos utilizam fotos reais copiadas de redes sociais para se passar por filhos ou parentes próximos. Eles apelam para o senso de urgência e afeto para fazer a vítima realizar transferências financeiras rápidas antes de verificar a veracidade da situação.",
    options: [
      {
        text: "Fazer o Pix imediatamente para ajudar seu familiar em um momento de sufoco urgente.",
        correct: false,
        feedback: "Incorreto! Você enviou dinheiro diretamente para a conta de um laranja ou criminoso."
      },
      {
        text: "Tentar ligar imediatamente para o número ANTIGO/TRADICIONAL do familiar ou confirmar a história com outros parentes antes de qualquer ação.",
        correct: true,
        feedback: "Correto! Sempre valide a identidade por chamadas de voz, vídeo ou canais conhecidos e consolidados."
      },
      {
        text: "Pedir os dados do Pix e fazer a transferência de metade do valor para testar se a conta é real.",
        correct: false,
        feedback: "Incorreto! Qualquer valor enviado será perdido e confirma que você é uma vítima vulnerável."
      }
    ]
  },
  {
    id: "scen_03",
    title: "A Pesquisa de Satisfação Premiada",
    sender: "Restaurante / Hotel Famoso",
    avatar: "🎁",
    risk: "Médio",
    message:
      "Parabéns! Você foi selecionado para participar da nossa Pesquisa de Satisfação Anual. Respondendo a apenas 3 perguntas rápidas sobre nosso atendimento, você ganha automaticamente um voucher de R$ 500,00 para consumo imediato e concorre a uma estadia de fim de semana com acompanhante! Clique no link abaixo para começar agora mesmo: www.vouchers-promocao-br.com/restaurante",
    explanation:
      "GOLPE: Phishing (Roubo de Dados). Links falsos simulam promoções legítimas de marcas conhecidas. Ao clicar, a vítima é induzida a preencher formulários com dados pessoais (CPF, nome, e-mail) e senhas, ou instalar aplicativos maliciosos que roubam informações financeiras armazenadas no celular.",
    options: [
      {
        text: "Clicar no link e responder rápido para garantir o voucher antes que a promoção expire.",
        correct: false,
        feedback: "Incorreto! Você expôs seu dispositivo a malwares e dados confidenciais a páginas falsas."
      },
      {
        text: "Acessar as redes sociais oficiais ou site institucional verificado da empresa para checar se a promoção realmente existe.",
        correct: true,
        feedback: "Correto! Desconfie de links recebidos por chats e sempre busque os canais oficiais verificados."
      },
      {
        text: "Encaminhar o link para 5 amigos para validar o preenchimento e tentar ganhar pontos extras.",
        correct: false,
        feedback: "Incorreto! Além de cair no golpe, você se tornou um vetor de propagação do ataque para sua rede."
      }
    ]
  }
];

// =================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// =================================================================
const state = {
  screen: "intro",
  participant: null,
  step: 0,
  score: 0,
  decisions: [],
  selected: null,
  optionOrder: [],
  adminSearch: "",
  adminRisk: "all",
  detailId: null,
  adminAuthed: false,
  cachedResults: [] // Cache local dos resultados vindos do Firebase
};

// =================================================================
// OPERAÇÕES DO BANCO DE DADOS (FIREBASE REAL)
// =================================================================

// Sincronização em tempo real com a nuvem do Firestore
function syncFirebaseData() {
  db.collection(DB_COLLECTION)
    .orderBy("finishedAt", "desc")
    .onSnapshot((snapshot) => {
      state.cachedResults = [];
      snapshot.forEach((doc) => {
        state.cachedResults.push(doc.data());
      });
      // Se o painel administrativo estiver na tela, renderiza as novas informações na hora
      if (state.screen === "admin") {
        renderAdmin();
      }
    }, (error) => {
      console.error("Erro ao sincronizar dados em tempo real: ", error);
    });
}

// Inicializa a escuta ativa com a nuvem do Firebase
syncFirebaseData();

function getResults() {
  return state.cachedResults || [];
}

function saveResult(result) {
  db.collection(DB_COLLECTION).doc(result.id).set(result)
    .then(() => {
      console.log("Resultado sincronizado na nuvem com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar no Firebase: ", error);
    });
}

// =================================================================
// LÓGICA AUXILIAR E FORMATADORES
// =================================================================
function generateId() {
  return "res_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function brand() {
  return `
    <div class="brand-header">
      <span class="brand-icon">🛡️</span>
      <div>
        <h1 class="brand-title">WhatsApp Seguro</h1>
        <p class="brand-subtitle">Simulador de Engenharia Social</p>
      </div>
    </div>
  `;
}

function setHashForScreen() {
  if (state.screen === "admin") {
    if (location.hash !== ADMIN_HASH) {
      location.hash = ADMIN_HASH;
    }
  } else {
    if (location.hash === ADMIN_HASH) {
      location.hash = "";
    }
  }
}

// =================================================================
// SISTEMA DE RENDERIZAÇÃO DE TELAS
// =================================================================
const app = document.getElementById("app");

function render() {
  setHashForScreen();
  if (location.hash === ADMIN_HASH || state.screen === "admin") {
    state.screen = "admin";
    renderAdmin();
    return;
  }
  if (state.screen === "intro") renderIntro();
  if (state.screen === "register") renderRegister();
  if (state.screen === "scenario") renderScenario();
  if (state.screen === "explain") renderExplain();
  if (state.screen === "final") renderFinal();
}

window.addEventListener("hashchange", () => {
  if (location.hash === ADMIN_HASH) {
    state.screen = "admin";
  } else if (state.screen === "admin") {
    state.screen = "intro";
  }
  render();
});

// TELAS: INTRODUÇÃO
function renderIntro() {
  app.innerHTML = `
    <main class="page text-center animate-fade">
      ${brand()}
      <div class="card mt-2">
        <h2 class="section-title">Você sabe identificar um golpe no WhatsApp?</h2>
        <p class="text-muted">A engenharia social manipula comportamentos para obter dados e recursos financeiros de forma fraudulenta. Teste sua percepção crítica frente aos golpes cibernéticos mais aplicados no Brasil.</p>
        
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <h3>Cenários Reais</h3>
            <p>Simulações baseadas em abordagens criminosas cotidianas.</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🧠</span>
            <h3>Análise Crítica</h3>
            <p>Avalie riscos e tome decisões defensivas seguras.</p>
          </div>
        </div>

        <button class="btn btn-primary w-100" data-action="start">Iniciar Simulação</button>
      </div>
      <p class="academic-notice mt-2">${ACADEMIC_NOTICE}</p>
    </main>
  `;
}

// TELAS: REGISTRO DO PARTICIPANTE
function renderRegister() {
  app.innerHTML = `
    <main class="page animate-fade">
      ${brand()}
      <div class="card mt-2">
        <h2 class="section-title">Identificação do Participante</h2>
        <p class="text-muted mb-2">Insira seus dados para iniciarmos o mapeamento estatístico de vulnerabilidade corporativa e acadêmica.</p>
        
        <form id="regForm">
          <div class="form-group">
            <label for="pName">Nome Completo / Identificador</label>
            <input type="text" id="pName" placeholder="Ex: Douglas Silva" required>
          </div>
          <div class="form-group">
            <label for="pAge">Faixa Etária</label>
            <select id="pAge" required>
              <option value="">Selecione...</option>
              <option value="18-25">18 a 25 anos</option>
              <option value="26-40">26 a 40 anos</option>
              <option value="41-60">41 a 60 anos</option>
              <option value="60+">Mais de 60 anos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="pExp">Frequência de Uso do WhatsApp</label>
            <select id="pExp" required>
              <option value="">Selecione...</option>
              <option value="Baixa">Rara (Pouco uso diário)</option>
              <option value="Média">Moderada (Uso pessoal padrão)</option>
              <option value="Alta">Intensa (Trabalho e uso pessoal contínuo)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-100 mt-1">Entrar no Simulador</button>
        </form>
      </div>
    </main>
  `;

  document.getElementById("regForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.participant = {
      name: document.getElementById("pName").value.trim(),
      age: document.getElementById("pAge").value,
      experience: document.getElementById("pExp").value
    };
    state.step = 0;
    state.score = 0;
    state.decisions = [];
    state.screen = "scenario";
    initScenarioOptions();
    render();
  });
}

function initScenarioOptions() {
  const sc = scenarios[state.step];
  const indices = sc.options.map((_, i) => i);
  // Embaralhamento determinístico/aleatório das opções para evitar vício de posição
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  state.optionOrder = indices;
  state.selected = null;
}

// TELAS: EXIBIÇÃO DO CENÁRIO (INTERFACE WHATSAPP VIRTUAL)
function renderScenario() {
  const sc = scenarios[state.step];
  
  let optionsHtml = "";
  state.optionOrder.forEach((idx) => {
    const opt = sc.options[idx];
    const isSel = state.selected === idx;
    optionsHtml += `
      <div class="option-card ${isSel ? "selected" : ""}" data-option="${idx}">
        <div class="option-radio ${isSel ? "checked" : ""}"></div>
        <p class="option-text">${opt.text}</p>
      </div>
    `;
  });

  app.innerHTML = `
    <main class="page animate-fade">
      <div class="chat-header">
        <span class="chat-avatar">${sc.avatar}</span>
        <div class="chat-meta">
          <h2 class="chat-name">${sc.sender}</h2>
          <p class="chat-status">Online • Nível de Risco: <span class="badge badge-${sc.risk.toLowerCase()}">${sc.risk}</span></p>
        </div>
      </div>

      <p class="scenario-counter">Cenário ${state.step + 1} de ${scenarios.length}: <strong>${sc.title}</strong></p>

      <div class="chat-container">
        <div class="chat-bubble received">
          <p>${sc.message}</p>
          <span class="chat-time">14:32</span>
        </div>
      </div>

      <div class="options-container">
        <h3 class="options-title">Qual é a sua conduta defensiva imediata?</h3>
        ${optionsHtml}
      </div>

      <div class="action-footer">
        <button class="btn btn-success w-100" data-action="confirm" ${state.selected === null ? "disabled" : ""}>Confirmar Resposta</button>
      </div>
    </main>
  `;
}

// TELAS: FEEDBACK EXPLICATIVO DO CENÁRIO
function renderExplain() {
  const sc = scenarios[state.step];
  const dec = state.decisions[state.step];
  const opt = sc.options[dec.selectedIdx];

  app.innerHTML = `
    <main class="page animate-fade">
      ${brand()}
      <div class="card mt-2">
        <div class="feedback-badge-container text-center">
          <span class="feedback-icon">${opt.correct ? "✅" : "❌"}</span>
          <h2 class="feedback-title ${opt.correct ? "text-success" : "text-danger"}">
            ${opt.correct ? "Conduta Segura!" : "Conduta de Risco!"}
          </h2>
        </div>

        <p class="feedback-alert mt-1">${opt.feedback}</p>

        <div class="explanation-box mt-2">
          <h3>📘 Entenda a Ameaça</h3>
          <p>${sc.explanation}</p>
        </div>

        <button class="btn btn-primary w-100 mt-2" data-action="next">
          ${state.step < scenarios.length - 1 ? "Ir para Próximo Cenário" : "Finalizar e Ver Relatório"}
        </button>
      </div>
    </main>
  `;
}

// TELAS: ENCERRAMENTO E PONTUAÇÃO FINAL
function renderFinal() {
  const pct = Math.round((state.score / scenarios.length) * 100);
  let profileTitle = "Vulnerável";
  let profileClass = "badge-critico";
  let profileDesc = "Atenção Crítica! Suas tomadas de decisão atuais indicam alta exposição e suscetibilidade a vetores de engenharia social no WhatsApp. Recomenda-se a leitura atenta de guias de segurança digital.";

  if (pct === 100) {
    profileTitle = "Especialista em Segurança";
    profileClass = "badge-alto"; // Verde/Forte no CSS adaptado
    profileDesc = "Excelente! Você demonstrou pleno discernimento crítico e reconheceu com precisão todos os gatilhos psicológicos e fraudes estruturadas nos cenários apresentados.";
  } else if (pct >= 66) {
    profileTitle = "Consciente / Moderado";
    profileClass = "badge-medio";
    profileDesc = "Bom desempenho. Você conhece os conceitos básicos de segurança, mas ainda apresenta pequenas brechas que podem ser exploradas por criminosos altamente persuasivos.";
  }

  app.innerHTML = `
    <main class="page text-center animate-fade">
      ${brand()}
      <div class="card mt-2">
        <h2 class="section-title">Simulação Concluída!</h2>
        <p class="text-muted">Agradecemos sua participação. Confira abaixo suas métricas de desempenho técnico.</p>

        <div class="score-radial mt-2">
          <span class="score-number">${state.score} / ${scenarios.length}</span>
          <p class="score-label">Acertos Globais (${pct}%)</p>
        </div>

        <div class="profile-card mt-2">
          <p class="profile-label">Seu Perfil de Resiliência Ciber: <span class="badge ${profileClass}">${profileTitle}</span></p>
          <p class="profile-text mt-1">${profileDesc}</p>
        </div>

        <button class="btn btn-primary w-100 mt-2" data-action="restart">Reiniciar Simulador</button>
      </div>
      <p class="academic-notice mt-2">${ACADEMIC_NOTICE}</p>
    </main>
  `;
}

// TELAS: PAINEL ADMINISTRATIVO CENTRALIZADO NA NUVEM
function renderAdmin() {
  if (!state.adminAuthed) {
    app.innerHTML = `
      <main class="page animate-fade">
        ${brand()}
        <div class="card mt-2">
          <h2 class="section-title">Autenticação do Administrador</h2>
          <p class="text-muted mb-2">Insira as credenciais do pesquisador acadêmico para acessar a base de dados consolidada na nuvem do Firebase.</p>
          <form id="adminLoginForm">
            <div class="form-group">
              <label for="aUser">Usuário</label>
              <input type="text" id="aUser" required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="aPass">Senha</label>
              <input type="password" id="aPass" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 mt-1">Acessar Painel</button>
          </form>
        </div>
      </main>
    `;
    document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("aUser").value;
      const p = document.getElementById("aPass").value;
      if (u === ADMIN_USER && p === ADMIN_PASS) {
        state.adminAuthed = true;
        render();
      } else {
        alert("Credenciais administrativas incorretas!");
      }
    });
    return;
  }

  // Se logado, recupera os dados sincronizados em tempo real do cache
  const raw = getResults();
  
  // Aplicação dos filtros do dashboard
  let filtered = raw.filter((r) => {
    const nameMatch = r.participant.name.toLowerCase().includes(state.adminSearch.toLowerCase());
    if (state.adminRisk === "all") return nameMatch;
    if (state.adminRisk === "safe") return nameMatch && r.score === r.total;
    if (state.adminRisk === "vuln") return nameMatch && r.score < r.total;
    return nameMatch;
  });

  // Estatísticas consolidadas
  const totalSubmissions = raw.length;
  const perfectScores = raw.filter((r) => r.score === r.total).length;
  const avgScore = totalSubmissions > 0 ? (raw.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions).toFixed(1) : 0;

  let rowsHtml = "";
  if (filtered.length === 0) {
    rowsHtml = `<tr><td colspan="5" class="text-center text-muted">Nenhum resultado localizado no banco em nuvem.</td></tr>`;
  } else {
    filtered.forEach((r) => {
      const isSafe = r.score === r.total;
      rowsHtml += `
        <tr class="clickable-row ${state.detailId === r.id ? "row-active" : ""}" data-id="${r.id}">
          <td><strong>${r.participant.name}</strong></td>
          <td class="text-center">${r.participant.age}</td>
          <td class="text-center">${r.score}/${r.total}</td>
          <td class="text-center"><span class="badge ${isSafe ? "badge-alto" : "badge-critico"}">${isSafe ? "Seguro" : "Vulnerável"}</span></td>
          <td class="text-center text-muted">${formatDate(r.finishedAt)}</td>
        </tr>
      `;
    });
  }

  // Detalhes da linha selecionada
  let detailHtml = `<p class="text-muted text-center p-2">Selecione uma linha da tabela para auditar as decisões específicas por cenário.</p>`;
  if (state.detailId) {
    const selectedRecord = raw.find((r) => r.id === state.detailId);
    if (selectedRecord) {
      let itemsHtml = "";
      selectedRecord.decisions.forEach((d) => {
        itemsHtml += `
          <div class="detail-item">
            <p><strong>Cenário:</strong> ${d.scenarioTitle}</p>
            <p><strong>Conduta Escolhida:</strong> <span class="${d.correct ? "text-success" : "text-danger"}">${d.selectedText}</span></p>
            <p class="text-muted"><strong>Resultado:</strong> ${d.correct ? "✅ Acertou a postura de segurança" : "❌ Caiu no Golpe"}</p>
          </div>
        `;
      });

      detailHtml = `
        <div class="detail-card-content">
          <h3>Ficha Técnica: ${selectedRecord.participant.name}</h3>
          <p><strong>Métricas do Usuário:</strong> Idade: ${selectedRecord.participant.age} | Intensidade de Uso: ${selectedRecord.participant.experience}</p>
          <hr class="mt-1 mb-1">
          <h4 class="mb-1">Histórico de Decisões:</h4>
          ${itemsHtml}
        </div>
      `;
    }
  }

  app.innerHTML = `
    <main class="page-wide animate-fade">
      <div class="admin-panel">
        ${brand()}
        <div class="admin-nav mt-1">
          <h2>Painel Centralizado de Análise Estatística (Nuvem Firestore)</h2>
          <div class="admin-actions-group">
            <button class="btn btn-sm btn-outline" data-action="createExample">Gerar Dado de Exemplo</button>
            <button class="btn btn-sm btn-danger" data-action="clear">Zerar Banco de Dados</button>
            <button class="btn btn-sm btn-outline" data-action="logout">Sair do Painel</button>
          </div>
        </div>

        <div class="metrics-grid mt-2">
          <div class="metric-box">
            <h3>${totalSubmissions}</h3>
            <p>Total de Participantes</p>
          </div>
          <div class="metric-box">
            <h3>${perfectScores}</h3>
            <p>Usuários Resilientes (100%)</p>
          </div>
          <div class="metric-box">
            <h3>${avgScore} / 3</h3>
            <p>Média de Acertos Geral</p>
          </div>
        </div>

        <div class="filters-bar mt-2">
          <input type="text" id="adminSearchInput" placeholder="Buscar participante por nome..." value="${state.adminSearch}">
          <select id="adminRiskSelect">
            <option value="all" ${state.adminRisk === "all" ? "selected" : ""}>Todos os perfis de risco</option>
            <option value="safe" ${state.adminRisk === "safe" ? "selected" : ""}>Apenas Perfis Seguros</option>
            <option value="vuln" ${state.adminRisk === "vuln" ? "selected" : ""}>Apenas Perfis Vulneráveis</option>
          </select>
        </div>

        <div class="admin-layout mt-2">
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Participante</th>
                  <th class="text-center">Faixa Etária</th>
                  <th class="text-center">Acertos</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Data/Hora (Sincronizado)</th>
                </tr>
              </thead>
              <tbody id="adminTableBody">
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div class="detail-panel" id="adminDetailPanel">
            ${detailHtml}
          </div>
        </div>
      </div>
    </main>
  `;

  // Listeners dinâmicos do painel administrativo
  document.getElementById("adminSearchInput").addEventListener("input", (e) => {
    state.adminSearch = e.target.value;
    renderAdmin();
  });

  document.getElementById("adminRiskSelect").addEventListener("change", (e) => {
    state.adminRisk = e.target.value;
    renderAdmin();
  });
}

function createExampleResult() {
  const names = ["Aline Souza", "Carlos Eduardo", "Patricia Lima", "Roberto Alves"];
  const ages = ["18-25", "26-40", "41-60", "60+"];
  const exps = ["Baixa", "Média", "Alta"];
  
  const randomName = names[Math.floor(Math.random() * names.length)] + " (Exemplo)";
  const randomAge = ages[Math.floor(Math.random() * ages.length)];
  const randomExp = exps[Math.floor(Math.random() * exps.length)];
  const randomScore = Math.floor(Math.random() * 4);

  const mockDecisions = scenarios.map((sc, index) => {
    const correctIdx = sc.options.findIndex(o => o.correct);
    const selectedIdx = index < randomScore ? correctIdx : (correctIdx + 1) % sc.options.length;
    return {
      scenarioId: sc.id,
      scenarioTitle: sc.title,
      selectedIdx: selectedIdx,
      selectedText: sc.options[selectedIdx].text,
      correct: sc.options[selectedIdx].correct
    };
  });

  const mockResult = {
    id: generateId(),
    participant: { name: randomName, age: randomAge, experience: randomExp },
    score: mockDecisions.filter(d => d.correct).length,
    total: scenarios.length,
    decisions: mockDecisions,
    finishedAt: new Date().toISOString()
  };

  saveResult(mockResult);
}

// =================================================================
// GERENCIADOR CENTRAL DE CLIQUES (DELEGATION EVENT LISTENERS)
// =================================================================
document.addEventListener("click", (e) => {
  const target = e.target;

  // Telas Comuns / Navegação do Fluxo Principal
  if (target.matches('[data-action="start"]')) {
    state.screen = "register";
    render();
    return;
  }

  if (target.matches('[data-action="confirm"]')) {
    const sc = scenarios[state.step];
    const opt = sc.options[state.selected];
    
    state.decisions.push({
      scenarioId: sc.id,
      scenarioTitle: sc.title,
      selectedIdx: state.selected,
      selectedText: opt.text,
      correct: opt.correct
    });

    if (opt.correct) state.score++;
    state.screen = "explain";
    render();
    return;
  }

  if (target.matches('[data-action="next"]')) {
    if (state.step < scenarios.length - 1) {
      state.step++;
      state.screen = "scenario";
      initScenarioOptions();
    } else {
      // Criação estruturada do Payload final e envio para a nuvem
      const finalPayload = {
        id: generateId(),
        participant: state.participant,
        score: state.score,
        total: scenarios.length,
        decisions: state.decisions,
        finishedAt: new Date().toISOString()
      };
      saveResult(finalPayload);
      state.screen = "final";
    }
    render();
    return;
  }

  if (target.matches('[data-action="restart"]')) {
    state.screen = "intro";
    state.participant = null;
    state.step = 0;
    state.score = 0;
    state.decisions = [];
    render();
    return;
  }

  // Seleção de cards de opção na interface do WhatsApp virtual
  const optionCard = target.closest(".option-card");
  if (optionCard && state.screen === "scenario") {
    state.selected = parseInt(optionCard.getAttribute("data-option"), 10);
    render();
    return;
  }

  // Cliques Internos do Painel Administrativo
  if (target.matches('[data-action="logout"]')) {
    state.adminAuthed = false;
    state.screen = "intro";
    location.hash = "";
    render();
    return;
  }

  if (target.matches('[data-action="createExample"]')) {
    createExampleResult();
    return;
  }

  if (target.matches('[data-action="clear"]')) {
    if (confirm("ATENÇÃO: Esta ação deletará em lote TODOS os registros armazenados na nuvem do Firebase de forma irreversível. Deseja continuar?")) {
      db.collection(DB_COLLECTION).get().then((snapshot) => {
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      }).then(() => {
        state.detailId = null;
        alert("Coleção do Cloud Firestore resetada com sucesso!");
      }).catch(err => alert("Erro ao limpar banco: " + err));
    }
    return;
  }

  const row = target.closest(".clickable-row");
  if (row && state.screen === "admin") {
    const clickedId = row.getAttribute("data-id");
    state.detailId = state.detailId === clickedId ? null : clickedId;
    renderAdmin();
    return;
  }
});

// Inicialização Primária da Aplicação
render();