// ─── Firebase ────────────────────────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtuFBEHrxMPbaBLDOsXMbTeTkRKBhwc_4",
  authDomain: "simulador-whatsapp-unicive.firebaseapp.com",
  projectId: "simulador-whatsapp-unicive",
  storageBucket: "simulador-whatsapp-unicive.firebasestorage.app",
  messagingSenderId: "521362735071",
  appId: "1:521362735071:web:f4d200dfcc1d27737dce6a",
  measurementId: "G-WKWVJ1ZZTR"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const COLLECTION = "resultados";
// ─────────────────────────────────────────────────────────────────────────────

const ACADEMIC_NOTICE =
  "AVISO – CONTEXTO ACADÊMICO DO PROJETO. Este projeto é uma simulação online desenvolvida como parte da Atividade 2 da disciplina Atividades Extensionistas I – Desenvolvimento Sustentável, do curso de graduação em Segurança da Informação da Faculdade Unicive pelo aluno Douglas para conscientização sobre golpes online no WhatsApp.";

const ADMIN_HASH = "#painel-resultados-unicive-douglas-2026";
const ADMIN_USER = "vDFeeA7aSCagHSiND6Lf";
const ADMIN_PASS = "ChfpMgoV8SKCMJQRWRW4";
const STORAGE_KEY = "unicive_whatsapp_sim_results_v1";

const scenarios = [
  {
    id: "sim-swap",
    category: "Conta e identidade",
    title: "Sequestro de linha (SIM swap)",
    contact: "Operadora Segura",
    avatar: "OS",
    messages: [
      { type: "text", text: "Olá, identificamos uma tentativa de clonagem no seu número. Para bloquear o ataque, confirme seu CPF e o código que acabou de chegar por SMS." },
      { type: "text", text: "É urgente. Se não confirmar em 5 minutos sua linha será suspensa." }
    ],
    options: [
      { text: "Não envio código. Vou ligar para o número oficial da operadora.", safe: true, feedback: "Boa decisão. Código SMS pode liberar troca de chip ou acesso à conta. O canal oficial reduz o risco de engenharia social." },
      { text: "Envio o código rapidamente para evitar o bloqueio.", safe: false, feedback: "Risco alto. Golpistas pressionam por urgência para capturar códigos e concluir o sequestro da linha." },
      { text: "Peço para a pessoa confirmar meu endereço primeiro.", safe: false, feedback: "Ainda é perigoso. Dados vazados podem ser usados para parecer legítimo. O correto é encerrar e procurar o canal oficial." }
    ],
    explanation: "No SIM swap, criminosos tentam transferir sua linha para outro chip e depois usar SMS ou chamadas para recuperar contas.",
    protect: ["Ative PIN do chip quando disponível.", "Nunca informe códigos recebidos por SMS ou aplicativo.", "Use autenticação por app autenticador em contas importantes."]
  },
  {
    id: "spoofing",
    category: "Falso atendimento",
    title: "Chamadas falsas (Spoofing)",
    contact: "Banco Verificado",
    avatar: "BV",
    messages: [
      { type: "audio", text: "Áudio simulado: atendimento automático informa compra suspeita no cartão." },
      { type: "text", text: "Nossa chamada caiu. Para cancelar a compra, responda com sua senha de 4 dígitos e confirme o token do app." }
    ],
    options: [
      { text: "Desligo e abro o app oficial ou ligo para o número do cartão.", safe: true, feedback: "Correto. O número que aparece na tela pode ser falsificado. A conferência deve partir de você por canal oficial." },
      { text: "Confirmo só o token, sem passar a senha.", safe: false, feedback: "Token também é credencial. Entregar um token pode aprovar transações ou troca de senha." },
      { text: "Pergunto o nome do gerente antes de responder.", safe: false, feedback: "Informações pessoais podem ser inventadas ou obtidas em vazamentos. Não valide por conversa recebida." }
    ],
    explanation: "Spoofing de chamada mascara o número de origem para parecer banco, operadora ou órgão público.",
    protect: ["Desconfie de chamadas que pedem ação imediata.", "Nunca informe senha, token ou código por telefone.", "Faça a ligação de volta usando número oficial."]
  },
  {
    id: "fake-0800",
    category: "Falso atendimento",
    title: "Falsa central de atendimento (golpe do 0800)",
    contact: "Suporte 0800",
    avatar: "80",
    messages: [
      { type: "text", text: "Compra de R$ 2.490,00 aprovada. Caso não reconheça, ligue imediatamente para 0800 000 0000 ou clique em atendimento-seguro.exemplo.invalid." },
      { type: "text", text: "Protocolo: 84A-119. Atendimento prioritário por WhatsApp." }
    ],
    options: [
      { text: "Ignoro o número da mensagem e uso o telefone impresso no cartão ou app oficial.", safe: true, feedback: "Excelente. O golpe cria uma central falsa para conduzir a vítima a entregar dados ou instalar acesso remoto." },
      { text: "Ligo para o 0800 da mensagem porque parece mais rápido.", safe: false, feedback: "Esse é o ponto do golpe: levar você para uma central controlada por criminosos." },
      { text: "Clico no link para abrir o atendimento.", safe: false, feedback: "Links enviados por alerta de urgência podem levar a páginas falsas. Aqui é simulado, mas no mundo real não clique." }
    ],
    explanation: "A falsa central começa com SMS, e-mail ou WhatsApp de alerta e direciona para telefone ou link controlado pelo golpista.",
    protect: ["Use canais já conhecidos, não os recebidos na mensagem.", "Não instale aplicativos de acesso remoto.", "Confira compras diretamente no app oficial."]
  },
  {
    id: "social-engineering",
    category: "Engenharia social",
    title: "Engenharia social",
    contact: "Fiscalização Municipal",
    avatar: "FM",
    messages: [
      { type: "text", text: "Boa tarde. Sou representante de um órgão público. Seu cadastro está irregular e pode gerar multa. Envie documento e comprovante de endereço para regularização." },
      { type: "text", text: "O prazo termina hoje." }
    ],
    options: [
      { text: "Peço o protocolo, encerro a conversa e verifico no site oficial do órgão.", safe: true, feedback: "Boa postura. Protocolo ajuda, mas a validação real deve acontecer no canal oficial." },
      { text: "Envio os documentos com tarja parcial.", safe: false, feedback: "Mesmo documentos parciais podem alimentar fraudes. Não envie por canal não confirmado." },
      { text: "Pergunto qual multa será aplicada e continuo negociando.", safe: false, feedback: "Prolongar a conversa dá mais espaço para pressão e manipulação. Valide fora do contato recebido." }
    ],
    explanation: "Engenharia social explora autoridade, medo, urgência ou familiaridade para induzir decisões inseguras.",
    protect: ["Confirme identidade por canais independentes.", "Não envie documentos em conversas inesperadas.", "Desconfie de prazos artificiais e ameaças."]
  },
  {
    id: "account-theft",
    category: "Contas e aplicativos",
    title: "Furto de contas de redes sociais e apps",
    contact: "Central Social",
    avatar: "CS",
    messages: [
      { type: "text", text: "Seu perfil recebeu denúncia de violação. Para evitar bloqueio, acesse recuperar-conta.exemplo.invalid e confirme login." },
      { type: "text", text: "Após confirmar, removeremos a restrição." }
    ],
    options: [
      { text: "Não acesso o link. Entro no app oficial e verifico notificações por lá.", safe: true, feedback: "Perfeito. Alertas reais aparecem dentro do app ou site oficial, não exigem login por link externo suspeito." },
      { text: "Abro o link, mas não digito a senha se parecer estranho.", safe: false, feedback: "Só abrir links suspeitos já pode expor dados técnicos ou levar a páginas muito convincentes. Evite." },
      { text: "Encaminho para amigos perguntando se é verdade.", safe: false, feedback: "Isso pode espalhar o golpe. Verifique por canal oficial e avise sem repassar o link." }
    ],
    explanation: "Criminosos criam páginas falsas de login para capturar usuário, senha e códigos de recuperação.",
    protect: ["Use gerenciador de senhas para identificar domínios falsos.", "Ative MFA por aplicativo autenticador.", "Revise sessões conectadas periodicamente."]
  },
  {
    id: "pix-qr",
    category: "PIX e pagamentos",
    title: "Golpe do PIX / QR Code falso",
    contact: "Fornecedor Energia",
    avatar: "FE",
    messages: [
      { type: "text", text: "Sua fatura está em atraso e terá corte hoje. Pague com desconto pelo QR Code abaixo." },
      { type: "text", text: "[QR CODE SIMULADO] Beneficiário: Pagamentos Rápidos Ltda." }
    ],
    options: [
      { text: "Confiro beneficiário, valor e pego a segunda via no site oficial.", safe: true, feedback: "Correto. PIX exige conferir destinatário e origem da cobrança antes de pagar." },
      { text: "Pago porque o desconto termina em poucos minutos.", safe: false, feedback: "Urgência e desconto são gatilhos comuns. O beneficiário diferente é um forte sinal de fraude." },
      { text: "Peço outro QR Code para ver se muda.", safe: false, feedback: "Isso mantém você no canal do golpista. A verificação deve ser fora da conversa." }
    ],
    explanation: "QR Codes falsos desviam o pagamento para contas de terceiros, muitas vezes usando aparência de boleto ou fatura real.",
    protect: ["Confira nome do recebedor antes de confirmar.", "Gere boletos no site ou app oficial.", "Desconfie de cobrança com ameaça imediata."]
  },
  {
    id: "mfa-code",
    category: "Códigos e MFA",
    title: "Pedido de código de verificação (MFA)",
    contact: "Amiga Ana",
    avatar: "AA",
    messages: [
      { type: "text", text: "Oi, errei meu cadastro e coloquei seu número sem querer. Chegou um código de 6 dígitos aí? Me manda, por favor?" },
      { type: "text", text: "É rapidinho, estou precisando entrar agora." }
    ],
    options: [
      { text: "Não envio. Aviso por outro canal que a conta dela pode estar comprometida.", safe: true, feedback: "Muito bem. O código pode ser para ativar WhatsApp, e-mail ou outro serviço em outro aparelho." },
      { text: "Envio porque é uma pessoa conhecida.", safe: false, feedback: "Contas de conhecidos podem ser invadidas. Código de verificação nunca deve ser compartilhado." },
      { text: "Peço uma foto dela segurando um papel.", safe: false, feedback: "Fraudadores podem usar pressão, imagens antigas ou até IA. O ponto central é: código não se compartilha." }
    ],
    explanation: "O golpe usa confiança em contatos conhecidos para obter códigos de verificação e assumir contas.",
    protect: ["Nunca compartilhe códigos.", "Ative confirmação em duas etapas no WhatsApp.", "Confirme pedidos estranhos por chamada ou presencialmente."]
  },
  {
    id: "malicious-links",
    category: "Links e phishing",
    title: "Links maliciosos disfarçados",
    contact: "Promoções Brasil",
    avatar: "PB",
    messages: [
      { type: "text", text: "Você ganhou um kit grátis. Restam 12 unidades. Cadastre-se em premios-whats.exemplo.invalid." },
      { type: "text", text: "Compartilhe com 5 contatos para liberar o envio." }
    ],
    options: [
      { text: "Não clico, não compartilho e apago a mensagem.", safe: true, feedback: "Boa. Promoções que exigem compartilhamento e cadastro imediato são sinais clássicos de golpe." },
      { text: "Abro em aba anônima para testar.", safe: false, feedback: "Aba anônima não torna links perigosos seguros. Pode haver coleta de dados, phishing ou download malicioso." },
      { text: "Compartilho em um grupo perguntando se alguém conhece.", safe: false, feedback: "Isso amplia o alcance do golpe. Avise sem encaminhar o link." }
    ],
    explanation: "Links disfarçados exploram curiosidade, prêmio e escassez para capturar dados ou espalhar a fraude.",
    protect: ["Passe o mouse ou confira o domínio antes de clicar.", "Desconfie de prêmios sem participação prévia.", "Não instale apps fora de lojas oficiais."]
  },
  {
    id: "fake-groups",
    category: "Família e contatos",
    title: "Grupos falsos de família/amigos",
    contact: "Família Novo Grupo",
    avatar: "FN",
    messages: [
      { type: "text", text: "Criamos este grupo porque o antigo deu problema. Seu primo precisa de ajuda para uma emergência. Faça um PIX de R$ 350,00 para esta chave simulada." },
      { type: "text", text: "Depois ele explica, é urgente." }
    ],
    options: [
      { text: "Ligo para o familiar por número salvo antes de qualquer ajuda.", safe: true, feedback: "Ótimo. Pedido financeiro em grupo novo precisa de confirmação por outro canal." },
      { text: "Faço um valor menor para ajudar logo.", safe: false, feedback: "Mesmo valor menor confirma a fraude e gera prejuízo. Verifique antes." },
      { text: "Pergunto detalhes no grupo.", safe: false, feedback: "O grupo pode ter vários perfis falsos combinados. A confirmação deve acontecer fora dali." }
    ],
    explanation: "Golpistas criam grupos parecidos com círculos reais e simulam emergência para obter PIX.",
    protect: ["Confirme por chamada com a pessoa envolvida.", "Desconfie de grupo recém-criado com urgência financeira.", "Combine palavras de segurança com familiares."]
  },
  {
    id: "fake-job",
    category: "Vagas e oportunidades",
    title: "Falsa vaga de emprego / recrutadora",
    contact: "Recrutadora RH",
    avatar: "RH",
    messages: [
      { type: "text", text: "Olá, seu currículo foi selecionado para vaga home office. Salário R$ 4.800,00. Para iniciar, pague taxa de exame admissional via PIX simulado." },
      { type: "text", text: "A entrevista será liberada após o comprovante." }
    ],
    options: [
      { text: "Recuso pagar taxa e verifico empresa, domínio e vaga em canais oficiais.", safe: true, feedback: "Certo. Processo seletivo legítimo não cobra taxa antecipada por WhatsApp." },
      { text: "Pago a taxa porque o salário compensa.", safe: false, feedback: "Cobrança antecipada é um sinal muito forte de golpe em falsas vagas." },
      { text: "Envio documentos primeiro e pago depois.", safe: false, feedback: "Documentos também podem ser usados em fraudes. Valide a vaga antes de enviar qualquer dado." }
    ],
    explanation: "Falsas vagas usam promessa de renda, urgência e taxa inicial para coletar dinheiro e documentos.",
    protect: ["Verifique CNPJ, domínio e perfil oficial da empresa.", "Não pague para participar de seleção.", "Não envie documentos antes de confirmar a legitimidade."]
  }
];

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
  adminAuthed: false
};

const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function shuffledIndexes(length) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function ensureOptionOrder(scenario) {
  if (!state.optionOrder[state.step]) {
    state.optionOrder[state.step] = shuffledIndexes(scenario.options.length);
  }
  return state.optionOrder[state.step];
}

// Lê todos os resultados do Firestore (retorna uma Promise)
async function getResults() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("finishedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Erro ao ler resultados do Firebase:", err);
    return [];
  }
}

// Salva um resultado no Firestore (retorna uma Promise)
async function saveResult(result) {
  try {
    await addDoc(collection(db, COLLECTION), result);
  } catch (err) {
    console.error("Erro ao salvar resultado no Firebase:", err);
  }
}

function setHashForScreen() {
  if (state.screen !== "admin" && location.hash === ADMIN_HASH) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

async function render() {
  setHashForScreen();
  if (location.hash === ADMIN_HASH || state.screen === "admin") {
    state.screen = "admin";
    await renderAdmin();
    return;
  }

  if (state.screen === "intro") renderIntro();
  if (state.screen === "register") renderRegister();
  if (state.screen === "scenario") renderScenario();
  if (state.screen === "explain") renderExplain();
  if (state.screen === "final") renderFinal();
}

function page(content) {
  app.innerHTML = content;
}

function brand() {
  return `
    <div class="brand">
      <div class="brand-mark">U</div>
      <div>
        <strong>Faculdade Unicive</strong>
        <span>Segurança da Informação • Atividades Extensionistas I</span>
      </div>
    </div>
  `;
}

function phonePreview() {
  const firstName = state.participant?.name?.split(" ")[0] || "participante";
  const greeting = state.participant
    ? `Olá, ${escapeHtml(firstName)}. Você vai treinar decisões seguras em conversas simuladas.`
    : "Olá! Informe seu nome para iniciar uma simulação personalizada.";
  return `
    <div class="phone" aria-label="Prévia da simulação em celular">
      <div class="phone-screen">
        <div class="status-bar"><span>09:41</span><span>4G 100%</span></div>
        <div class="chat-header">
          <span class="back-arrow">‹</span>
          <div class="avatar">WS</div>
          <div class="chat-title"><strong>WhatsApp Seguro</strong><span>simulação educativa</span></div>
          <div class="chat-actions"><span>⌕</span><span>⋮</span></div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: 10%"></div></div>
        <div class="messages">
          <div class="day-chip">Hoje</div>
          <div class="bubble in">${greeting}<small>09:41</small></div>
          <div class="bubble in">Nenhum link perigoso, pagamento real ou página falsa real será usado aqui.<small>09:42</small></div>
          <div class="bubble out">Entendi. Quero começar com segurança.<small>09:42 ✓✓</small></div>
          <div class="bubble in"><span class="typing"><i></i><i></i><i></i></span></div>
        </div>
        <div class="choices">
          <button class="option">Verificar pelo canal oficial</button>
          <button class="option">Enviar código recebido</button>
        </div>
        <div class="composer"><div class="composer-box">Mensagem</div><div class="send">›</div></div>
      </div>
    </div>
  `;
}

function renderIntro() {
  page(`
    <main class="page">
      <section class="layout">
        <div class="intro-panel">
          ${brand()}
          <p class="eyebrow">Simulador web interativo</p>
          <h1>Golpes digitais no WhatsApp</h1>
          <p class="lead">Uma experiência mobile, realista e educativa para reconhecer tentativas de fraude antes que elas causem prejuízo.</p>
          <div class="notice"><strong>${escapeHtml(ACADEMIC_NOTICE.split(".")[0])}.</strong>${escapeHtml(ACADEMIC_NOTICE.slice(ACADEMIC_NOTICE.indexOf(".") + 1))}</div>
          <div class="facts">
            <div class="fact"><b>10</b><span>golpes simulados</span></div>
            <div class="fact"><b>100%</b><span>educativo</span></div>
            <div class="fact"><b>0</b><span>links perigosos</span></div>
          </div>
          <div class="intro-info">
            <div><strong>Objetivo</strong><span>Conscientizar sobre sinais de golpe e decisões seguras no WhatsApp.</span></div>
            <div><strong>Público-alvo</strong><span>Participantes da atividade acadêmica e comunidade atendida.</span></div>
            <div><strong>Tempo estimado</strong><span>6 a 10 minutos, com feedback educativo a cada etapa.</span></div>
          </div>
          <div class="btn-row">
            <button class="btn" data-action="register">Iniciar simulação</button>
          </div>
        </div>
        ${phonePreview()}
      </section>
    </main>
  `);
}

function renderRegister() {
  page(`
    <main class="page">
      <section class="layout">
        <div class="form-panel">
          ${brand()}
          <p class="eyebrow">Registro educacional</p>
          <h2>Antes de começar</h2>
          <p class="lead">Informe apenas nome completo e e-mail. Esses dados ficam no armazenamento local deste navegador para registro da atividade e exportação pelo painel.</p>
          <div class="notice">Esta é uma simulação educativa em ambiente controlado. Nenhum dado real é coletado fora deste app, não há PIX verdadeiro, páginas falsas reais ou indução a clicar em links perigosos.</div>
          <form id="registerForm" class="form-grid" novalidate>
            <div class="field">
              <label for="name">Nome completo</label>
              <input id="name" autocomplete="name" maxlength="90" placeholder="Digite seu nome completo" required />
            </div>
            <div class="field">
              <label for="email">E-mail</label>
              <input id="email" type="email" autocomplete="email" maxlength="120" placeholder="seuemail@exemplo.com" required />
            </div>
            <label class="consent">
              <input id="consent" type="checkbox" />
              <span>Confirmo que entendi o contexto acadêmico e educativo da simulação.</span>
            </label>
            <p id="formError" class="error">Preencha nome, e-mail válido e confirme o aviso para continuar.</p>
            <div class="btn-row">
              <button class="btn" type="submit">Começar teste</button>
              <button class="btn ghost" type="button" data-action="intro">Voltar</button>
            </div>
          </form>
        </div>
        ${phonePreview()}
      </section>
    </main>
  `);
}

function renderScenario() {
  const scenario = scenarios[state.step];
  const progress = Math.round(((state.step + 1) / scenarios.length) * 100);
  const selected = state.selected;

  page(`
    <main class="page">
      <section class="layout">
        <div>
          ${renderPhone(scenario, progress)}
        </div>
        <aside class="intro-panel">
          <p class="eyebrow">Etapa ${state.step + 1} de ${scenarios.length}</p>
          <h2>${escapeHtml(scenario.title)}</h2>
          <p><span class="pill warn">${escapeHtml(scenario.category)}</span></p>
          <p class="lead">Leia a conversa simulada no celular e escolha a resposta que você tomaria. O feedback aparece imediatamente.</p>
          <div class="notice">Ambiente controlado: mensagens, links, QR Codes, áudios e pedidos financeiros são fictícios.</div>
          ${selected === null ? "" : `<div class="feedback ${selected.safe ? "good" : "bad"}"><strong>${selected.safe ? "Decisão segura." : "Atenção ao risco."}</strong> ${escapeHtml(selected.feedback)}</div>`}
          <div class="btn-row" style="margin-top: 16px;">
            <button class="btn" data-action="explain" ${selected === null ? "disabled" : ""}>Ver explicação da etapa</button>
          </div>
        </aside>
      </section>
    </main>
  `);
}

function renderPhone(scenario, progress) {
  const firstName = state.participant?.name?.split(" ")[0] || "participante";
  const optionOrder = ensureOptionOrder(scenario);
  return `
    <div class="phone">
      <div class="phone-screen">
        <div class="status-bar"><span>09:${String(41 + state.step).padStart(2, "0")}</span><span>4G 100%</span></div>
        <div class="chat-header">
          <span class="back-arrow">‹</span>
          <div class="avatar">${escapeHtml(scenario.avatar)}</div>
          <div class="chat-title"><strong>${escapeHtml(scenario.contact)}</strong><span>online agora</span></div>
          <div class="chat-actions"><span>⌕</span><span>⋮</span></div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
        <div class="messages" id="messages">
          <div class="day-chip">Golpe ${state.step + 1} de ${scenarios.length} • ${escapeHtml(scenario.category)}</div>
          <div class="day-chip">Simulação educativa</div>
          <div class="bubble in">Olá, ${escapeHtml(firstName)}. Analise esta conversa com calma antes de responder.<small>09:41</small></div>
          ${scenario.messages.map(renderMessage).join("")}
          ${state.selected ? `<div class="bubble out">${escapeHtml(state.selected.text)}<small>09:${String(45 + state.step).padStart(2, "0")} ✓✓</small></div>` : `<div class="bubble in"><span class="typing"><i></i><i></i><i></i></span></div>`}
        </div>
        <div class="choices">
          ${optionOrder
            .map((optionIndex) => {
              const option = scenario.options[optionIndex];
              const status = state.selected ? (option.safe ? "correct" : option === state.selected ? "wrong" : "") : "";
              return `<button class="option ${status}" data-choice="${optionIndex}" ${state.selected ? "disabled" : ""}>${escapeHtml(option.text)}</button>`;
            })
            .join("")}
        </div>
        <div class="composer"><div class="composer-box">Mensagem</div><div class="send">›</div></div>
      </div>
    </div>
  `;
}

function renderMessage(message) {
  if (message.type === "audio") {
    return `<div class="bubble in audio-bubble"><span class="play-dot">▶</span><span class="wave"></span><span>0:18</span><small>09:43</small></div><div class="bubble in">${escapeHtml(message.text)}<small>09:43</small></div>`;
  }
  return `<div class="bubble in">${escapeHtml(message.text)}<small>09:43</small></div>`;
}

function renderExplain() {
  const scenario = scenarios[state.step];
  const decision = state.decisions[state.decisions.length - 1];

  page(`
    <main class="page">
      <section class="layout">
        <div class="explain-panel">
          <p class="eyebrow">Explicação da etapa</p>
          <h2>${escapeHtml(scenario.title)}</h2>
          <p class="lead">${escapeHtml(scenario.explanation)}</p>
          <div class="feedback ${decision.safe ? "good" : "bad"}"><strong>Sua escolha:</strong> ${escapeHtml(decision.choice)}<br>${escapeHtml(decision.feedback)}</div>
          <div class="explain-list">
            ${scenario.protect.map((item) => `<div class="explain-item"><strong>Como se proteger</strong>${escapeHtml(item)}</div>`).join("")}
          </div>
          <div class="btn-row">
            <button class="btn" data-action="next">${state.step + 1 === scenarios.length ? "Ver resultado final" : "Próxima simulação"}</button>
          </div>
        </div>
        ${renderPhone(scenario, Math.round(((state.step + 1) / scenarios.length) * 100))}
      </section>
    </main>
  `);
}

function riskProfile(score) {
  if (score >= 8) return { label: "Baixo risco", className: "good", text: "Você demonstrou bons hábitos de verificação e resistência à urgência." };
  if (score >= 5) return { label: "Risco moderado", className: "warn", text: "Você reconhece vários sinais, mas ainda pode cair em golpes com pressão ou aparência oficial." };
  return { label: "Alto risco", className: "bad", text: "As respostas indicam necessidade de reforçar práticas de confirmação e proteção de códigos." };
}

function decisionSummaryText(decisions) {
  return decisions
    .map((d, index) => `${index + 1}. ${d.category || "Geral"} - ${d.scenario}: ${d.safe ? "segura" : "risco"} - ${d.choice}`)
    .join(" | ");
}

function renderAdminDecisionList(decisions) {
  return `
    <ol class="admin-choice-list">
      ${decisions
        .map(
          (d, index) => `
            <li>
              <strong>${index + 1}. ${escapeHtml(d.scenario)}</strong>
              <small>${escapeHtml(d.category || "Geral")}</small>
              <span class="pill ${d.safe ? "good" : "bad"}">${d.safe ? "Segura" : "Risco"}</span>
              <p>${escapeHtml(d.choice)}</p>
            </li>`
        )
        .join("")}
    </ol>
  `;
}

function categoryPerformance(decisions) {
  const byCategory = new Map();
  decisions.forEach((decision) => {
    const category = decision.category || "Geral";
    const item = byCategory.get(category) || { category, total: 0, safe: 0, risks: [] };
    item.total += 1;
    if (decision.safe) item.safe += 1;
    else item.risks.push(decision.scenario);
    byCategory.set(category, item);
  });
  return Array.from(byCategory.values());
}

function renderCategoryResults(decisions) {
  return categoryPerformance(decisions)
    .map((item) => {
      const allSafe = item.safe === item.total;
      return `
        <div class="category-card ${allSafe ? "good" : "bad"}">
          <strong>${escapeHtml(item.category)}</strong>
          <span>${item.safe}/${item.total} decisão segura</span>
          <p>${allSafe ? "Bom reconhecimento nesta categoria." : `Rever: ${escapeHtml(item.risks.join(", "))}.`}</p>
        </div>
      `;
    })
    .join("");
}

async function createExampleResult() {
  const decisions = scenarios.map((scenario, index) => {
    const safe = index % 4 !== 1;
    const option = safe ? scenario.options.find((item) => item.safe) : scenario.options.find((item) => !item.safe);
    return {
      scenario: scenario.title,
      category: scenario.category,
      choice: option.text,
      safe,
      feedback: option.feedback
    };
  });
  const score = decisions.filter((item) => item.safe).length;
  await saveResult({
    id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name: "Participante Exemplo",
    email: "exemplo@unicive.local",
    score,
    total: scenarios.length,
    riskProfile: riskProfile(score).label,
    decisions,
    demo: true,
    finishedAt: new Date().toISOString()
  });
}

function renderFinal() {
  const percent = Math.round((state.score / scenarios.length) * 100);
  const profile = riskProfile(state.score);
  const participant = state.participant || { name: "Participante", email: "" };

  page(`
    <main class="page">
      <section class="final-panel" style="width:min(1120px,100%);">
        ${brand()}
        <p class="eyebrow">Resultado final</p>
        <h2>${escapeHtml(participant.name)}, sua nota foi ${state.score}/${scenarios.length}</h2>
        <div class="score-ring" style="--score: ${percent}%">${percent}%</div>
        <p><span class="pill ${profile.className}">${profile.label}</span></p>
        <p class="lead">${profile.text}</p>
        <h3>Resultado por categoria</h3>
        <div class="category-grid">
          ${renderCategoryResults(state.decisions)}
        </div>
        <div class="summary-grid">
          ${state.decisions
            .map(
              (d, index) => `
              <div class="decision ${d.safe ? "good" : "bad"}">
                <b>${index + 1}. ${escapeHtml(d.scenario)}</b>
                <span>${d.safe ? "Resposta segura" : "Resposta de risco"}: ${escapeHtml(d.choice)}</span>
              </div>`
            )
            .join("")}
        </div>
        <div class="guidance">
          <section>
            <h3>Como se proteger</h3>
            <ul>
              <li>Nunca compartilhe códigos de verificação, tokens ou senhas.</li>
              <li>Confirme pedidos urgentes por outro canal, principalmente dinheiro ou documentos.</li>
              <li>Use canais oficiais digitados por você, não links recebidos em mensagens.</li>
              <li>Ative confirmação em duas etapas no WhatsApp e nos principais apps.</li>
              <li>Confira beneficiário antes de qualquer PIX ou QR Code.</li>
              <li>Desconfie de prêmios, vagas e descontos com prazo muito curto.</li>
            </ul>
          </section>
          <section>
            <h3>Canais oficiais de denúncia</h3>
            <ul>
              <li>WhatsApp: tocar na conversa &gt; Mais &gt; Denunciar.</li>
              <li><a href="https://www.gov.br/pt-br/servicos/registrar-ocorrencia-policial-online" target="_blank" rel="noopener noreferrer">Delegacia online Gov.br</a>.</li>
              <li><a href="https://new.safernet.org.br/denuncie" target="_blank" rel="noopener noreferrer">SaferNet</a>.</li>
              <li>Polícia Federal: crime.internet@dpf.gov.br.</li>
              <li>Phishing: Phishing@cais.rnp.br.</li>
              <li>AntiSpam.br (CGI.br), Digi Denúncia no MPF e Humanize Redes (Gov.br).</li>
            </ul>
          </section>
        </div>
        <div class="btn-row" style="margin-top: 22px;">
          <button class="btn" data-action="restart">Nova participação</button>
        </div>
      </section>
    </main>
  `);
}

async function renderAdmin() {
  // Mostra carregando enquanto busca do Firebase
  app.innerHTML = `<main class="page"><section style="display:flex;align-items:center;justify-content:center;min-height:60vh;"><p style="color:var(--muted);font-size:1rem;">⏳ Carregando resultados…</p></section></main>`;
  const results = await getResults();
  const totalParticipants = new Set(results.map((r) => `${r.email || ""}|${r.name || ""}`)).size;
  const finishedCount = results.length;
  const averageScore = finishedCount
    ? Math.round((results.reduce((sum, r) => sum + Number(r.score || 0), 0) / finishedCount) * 10) / 10
    : 0;
  const search = state.adminSearch.toLowerCase();
  const filteredResults = results.filter((r) => {
    const profile = riskProfile(r.score);
    const matchesSearch = `${r.name || ""} ${r.email || ""}`.toLowerCase().includes(search);
    const matchesRisk = state.adminRisk === "all" || profile.className === state.adminRisk;
    return matchesSearch && matchesRisk;
  });
  const detailResult = results.find((r) => r.id === state.detailId);
  const rows = filteredResults
    .map((r) => {
      const profile = riskProfile(r.score);
      return `
        <tr>
          <td>${escapeHtml(r.name)}</td>
          <td>${escapeHtml(r.email)}</td>
          <td><strong>${r.score}/${scenarios.length}</strong></td>
          <td><span class="pill ${profile.className}">${profile.label}</span></td>
          <td>${escapeHtml(new Date(r.finishedAt).toLocaleString("pt-BR"))}</td>
          <td><button class="btn ghost compact" data-action="details" data-id="${escapeHtml(r.id)}">${state.detailId === r.id ? "Ocultar" : "Ver detalhes"}</button></td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <main class="page admin-page">
      <section class="admin-panel">
        ${brand()}
        <div class="admin-top">
          <div>
            <p class="eyebrow">Área restrita</p>
            <h2>Painel de resultados</h2>
            <p class="lead">Registros armazenados no Firebase e disponíveis para todos os dispositivos, com exportação CSV para uso educacional.</p>
          </div>
          <div class="btn-row">
            <button class="btn ghost" data-action="home">Voltar ao simulador</button>
            ${state.adminAuthed ? `<button class="btn ghost" data-action="demo">Criar exemplo</button><button class="btn" data-action="export">Exportar CSV</button><button class="btn secondary" data-action="clear">Zerar dados</button>` : ""}
          </div>
        </div>
        ${
          state.adminAuthed
            ? `
              <div class="admin-stats">
                <div class="admin-stat"><b>${totalParticipants}</b><span>Total de participantes</span></div>
                <div class="admin-stat"><b>${finishedCount}</b><span>Finalizaram</span></div>
                <div class="admin-stat"><b>${averageScore}/${scenarios.length}</b><span>Média geral</span></div>
              </div>
              <div class="admin-controls">
                <div class="field">
                  <label for="adminSearch">Buscar participante</label>
                  <input id="adminSearch" data-admin-search value="${escapeHtml(state.adminSearch)}" placeholder="Nome ou e-mail" />
                </div>
                <div class="field">
                  <label for="adminRisk">Filtrar por perfil</label>
                  <select id="adminRisk" data-admin-risk>
                    <option value="all" ${state.adminRisk === "all" ? "selected" : ""}>Todos</option>
                    <option value="good" ${state.adminRisk === "good" ? "selected" : ""}>Baixo risco</option>
                    <option value="warn" ${state.adminRisk === "warn" ? "selected" : ""}>Risco moderado</option>
                    <option value="bad" ${state.adminRisk === "bad" ? "selected" : ""}>Alto risco</option>
                  </select>
                </div>
              </div>
              <div class="admin-table-wrap">
                <table>
                  <thead>
                    <tr><th>Nome</th><th>E-mail</th><th>Nota</th><th>Perfil</th><th>Data</th><th>Detalhes</th></tr>
                  </thead>
                  <tbody>${rows || `<tr><td colspan="6">Nenhum resultado encontrado.</td></tr>`}</tbody>
                </table>
              </div>
              ${
                detailResult
                  ? `<section class="detail-panel">
                      <div class="admin-top">
                        <div>
                          <p class="eyebrow">Resumo das escolhas</p>
                          <h3>${escapeHtml(detailResult.name)} • ${detailResult.score}/${scenarios.length}</h3>
                        </div>
                        <button class="btn ghost compact" data-action="details" data-id="${escapeHtml(detailResult.id)}">Fechar detalhes</button>
                      </div>
                      <div class="category-grid">${renderCategoryResults(detailResult.decisions)}</div>
                      ${renderAdminDecisionList(detailResult.decisions)}
                    </section>`
                  : ""
              }`
            : `
              <form id="adminLogin" class="admin-login form-grid" novalidate>
                <div class="notice">Os resultados são salvos no Firebase e ficam disponíveis em qualquer dispositivo. Acesso ao painel requer autenticação.</div>
                <div class="field"><label for="adminUser">Usuário</label><input id="adminUser" autocomplete="username" /></div>
                <div class="field"><label for="adminPass">Senha</label><input id="adminPass" type="password" autocomplete="current-password" /></div>
                <p id="adminError" class="error">Usuário ou senha inválidos.</p>
                <button class="btn" type="submit">Entrar no painel</button>
              </form>`
        }
      </section>
    </main>
  `;
}

function choose(index) {
  if (state.selected) return;
  const scenario = scenarios[state.step];
  const option = scenario.options[index];
  state.selected = option;
  if (option.safe) state.score += 1;
  state.decisions.push({
    scenario: scenario.title,
    category: scenario.category,
    choice: option.text,
    safe: option.safe,
    feedback: option.feedback
  });
  render();
}

async function nextScenario() {
  if (state.step + 1 >= scenarios.length) {
    await persistCurrentResult();
    state.screen = "final";
  } else {
    state.step += 1;
    state.selected = null;
    state.screen = "scenario";
  }
  await render();
}

async function persistCurrentResult() {
  if (!state.participant || state.saved) return;
  await saveResult({
    id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name: state.participant.name,
    email: state.participant.email,
    score: state.score,
    total: scenarios.length,
    riskProfile: riskProfile(state.score).label,
    decisions: state.decisions,
    finishedAt: new Date().toISOString()
  });
  state.saved = true;
}

function restart() {
  state.screen = "register";
  state.participant = null;
  state.step = 0;
  state.score = 0;
  state.decisions = [];
  state.selected = null;
  state.optionOrder = [];
  state.saved = false;
  render();
}

async function exportCsv() {
  const results = await getResults();
  const headers = ["nome", "email", "nota", "total", "perfil", "data", "resumo_escolhas"];
  const lines = results.map((r) =>
    [
      r.name,
      r.email,
      r.score,
      r.total,
      r.riskProfile,
      new Date(r.finishedAt).toLocaleString("pt-BR"),
      decisionSummaryText(r.decisions)
    ]
      .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );
  const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resultados-simulador-unicive.csv";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", async (event) => {
  const choice = event.target.closest("[data-choice]");
  if (choice) choose(Number(choice.dataset.choice));

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "register") state.screen = "register";
  if (action === "intro") state.screen = "intro";
  if (action === "explain") state.screen = "explain";
  if (action === "next") return await nextScenario();
  if (action === "restart") return restart();
  if (action === "admin") {
    location.hash = ADMIN_HASH.slice(1);
    state.screen = "admin";
  }
  if (action === "home") {
    state.screen = "intro";
    history.replaceState(null, "", location.pathname + location.search);
  }
  if (action === "export") await exportCsv();
  if (action === "clear") {
    if (confirm("Atenção: esta ação só limpava dados locais. Os dados agora ficam no Firebase e devem ser removidos pelo console do Firebase.")) {
      state.detailId = null;
      await render();
    }
  }
  if (action === "demo") {
    await createExampleResult();
    await render();
  }
  if (action === "details") {
    const id = actionButton.dataset.id;
    state.detailId = state.detailId === id ? null : id;
    await render();
  }
  await render();
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-admin-search]")) {
    state.adminSearch = event.target.value;
    state.detailId = null;
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-admin-risk]")) {
    state.adminRisk = event.target.value;
    state.detailId = null;
    render();
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "registerForm") {
    event.preventDefault();
    const name = normalize(document.getElementById("name").value);
    const email = normalize(document.getElementById("email").value).toLowerCase();
    const consent = document.getElementById("consent").checked;
    const error = document.getElementById("formError");

    if (name.length < 5 || !isEmail(email) || !consent) {
      error.classList.add("show");
      return;
    }

    state.participant = { name, email };
    state.screen = "scenario";
    state.step = 0;
    state.score = 0;
    state.decisions = [];
    state.selected = null;
    state.optionOrder = [];
    state.saved = false;
    await render();
  }

  if (event.target.id === "adminLogin") {
    event.preventDefault();
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();
    const error = document.getElementById("adminError");

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      state.adminAuthed = true;
      render();
    } else {
      error.classList.add("show");
    }
  }
});

window.addEventListener("hashchange", async () => {
  if (location.hash === ADMIN_HASH) {
    state.screen = "admin";
  } else if (state.screen === "admin") {
    state.screen = "intro";
  }
  await render();
});

if (location.hash === ADMIN_HASH) state.screen = "admin";
render(); // chamada inicial (async, mas não precisamos awaitar no topo)
