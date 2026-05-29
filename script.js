const ACADEMIC_NOTICE =
  "AVISO – CONTEXTO ACADÊMICO DO PROJETO. Este projeto é uma simulação online desenvolvida como parte da Atividade 2 da disciplina Atividades Extensionistas I – Desenvolvimento Sustentável, do curso de graduação em Segurança da Informação da Faculdade Unicive pelo aluno Douglas para conscientização sobre golpes online no WhatsApp.";

const ADMIN_HASH = "#painel-resultados-unicive-douglas-2026";

const ADMIN_USER = "vDFeeA7aSCagHSiND6Lf";

const ADMIN_PASS = "ChfpMgoV8SKCMJQRWRW4";

const firebaseConfig = {
  apiKey: "AIzaSyCtuFBEHrxMPbaBLDOsXMbTeTkRKBhwc_4",
  authDomain: "simulador-whatsapp-unicive.firebaseapp.com",
  projectId: "simulador-whatsapp-unicive",
  storageBucket: "simulador-whatsapp-unicive.firebasestorage.app",
  messagingSenderId: "521362735071",
  appId: "1:521362735071:web:f4d200dfcc1d27737dce6a"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const scenarios = [
  {
    id: "sim-swap",
    category: "Conta e identidade",
    title: "Sequestro de linha (SIM swap)",
    contact: "Operadora Segura",
    avatar: "OS",

    messages: [
      {
        type: "text",
        text: "Olá, identificamos uma tentativa de clonagem no seu número. Para bloquear o ataque, confirme seu CPF e o código que acabou de chegar por SMS."
      },

      {
        type: "text",
        text: "É urgente. Se não confirmar em 5 minutos sua linha será suspensa."
      }
    ],

    options: [
      {
        text: "Não envio código. Vou ligar para o número oficial da operadora.",
        safe: true,
        feedback:
          "Boa decisão. Código SMS pode liberar troca de chip ou acesso à conta."
      },

      {
        text: "Envio o código rapidamente para evitar o bloqueio.",
        safe: false,
        feedback:
          "Risco alto. Golpistas usam urgência para capturar códigos."
      },

      {
        text: "Peço para confirmar meu endereço primeiro.",
        safe: false,
        feedback:
          "Ainda é perigoso. O correto é encerrar e procurar o canal oficial."
      }
    ],

    explanation:
      "No SIM swap, criminosos tentam transferir sua linha para outro chip.",

    protect: [
      "Nunca informe códigos SMS.",
      "Use autenticação por aplicativo.",
      "Ative PIN do chip."
    ]
  }
];

const state = {
  screen: "intro",
  participant: null,
  step: 0,
  score: 0,
  decisions: [],
  selected: null,
  adminAuthed: false,
  adminSearch: "",
  adminRisk: "all",
  detailId: null
};

const app = document.getElementById("app");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function getResults() {
  const snapshot = await db
    .collection("results")
    .orderBy("finishedAt", "desc")
    .get();

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
}

async function saveResult(result) {
  await db.collection("results").add(result);
}

function riskProfile(score) {
  if (score >= 8) {
    return {
      label: "Baixo risco",
      className: "good"
    };
  }

  if (score >= 5) {
    return {
      label: "Risco moderado",
      className: "warn"
    };
  }

  return {
    label: "Alto risco",
    className: "bad"
  };
}

function brand() {
  return `
    <div class="brand">
      <div class="brand-mark">U</div>

      <div>
        <strong>Faculdade Unicive</strong>

        <span>
          Segurança da Informação • Atividades Extensionistas I
        </span>
      </div>
    </div>
  `;
}

function page(content) {
  app.innerHTML = content;
}

async function render() {
  if (location.hash === ADMIN_HASH || state.screen === "admin") {
    state.screen = "admin";

    await renderAdmin();

    return;
  }

  if (state.screen === "intro") {
    renderIntro();
  } else if (state.screen === "register") {
    renderRegister();
  } else if (state.screen === "scenario") {
    renderScenario();
  } else if (state.screen === "final") {
    renderFinal();
  }
}

function renderIntro() {
  page(`
    <main class="page">

      <section class="layout">

        <div class="intro-panel">

          ${brand()}

          <p class="eyebrow">
            Simulador web interativo
          </p>

          <h1>
            Golpes digitais no WhatsApp
          </h1>

          <p class="lead">
            Experiência educativa para conscientização sobre golpes online.
          </p>

          <div class="notice">
            ${escapeHtml(ACADEMIC_NOTICE)}
          </div>

          <div class="btn-row">
            <button class="btn" data-action="register">
              Iniciar simulação
            </button>
          </div>

        </div>

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

          <h2>
            Antes de começar
          </h2>

          <form id="registerForm">

            <div class="field">

              <label>Nome completo</label>

              <input
                id="name"
                placeholder="Digite seu nome"
              />

            </div>

            <div class="field">

              <label>E-mail</label>

              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
              />

            </div>

            <label class="consent">

              <input id="consent" type="checkbox" />

              <span>
                Confirmo o contexto acadêmico.
              </span>

            </label>

            <p id="formError" class="error">
              Preencha corretamente.
            </p>

            <div class="btn-row">

              <button class="btn" type="submit">
                Começar
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  `);
}

function renderScenario() {
  const scenario = scenarios[state.step];

  page(`
    <main class="page">

      <section class="layout">

        <div class="phone">

          <div class="phone-screen">

            <div class="chat-header">

              <div class="avatar">
                ${escapeHtml(scenario.avatar)}
              </div>

              <div class="chat-title">

                <strong>
                  ${escapeHtml(scenario.contact)}
                </strong>

              </div>

            </div>

            <div class="messages">

              ${scenario.messages
                .map(
                  (message) => `
                    <div class="bubble in">
                      ${escapeHtml(message.text)}
                    </div>
                  `
                )
                .join("")}

            </div>

            <div class="choices">

              ${scenario.options
                .map(
                  (option, index) => `
                    <button
                      class="option"
                      data-choice="${index}"
                    >
                      ${escapeHtml(option.text)}
                    </button>
                  `
                )
                .join("")}

            </div>

          </div>

        </div>

      </section>

    </main>
  `);
}

function renderFinal() {
  const profile = riskProfile(state.score);

  page(`
    <main class="page">

      <section class="final-panel">

        ${brand()}

        <h2>
          Resultado Final
        </h2>

        <div class="score-ring">
          ${state.score}/${scenarios.length}
        </div>

        <p>
          <span class="pill ${profile.className}">
            ${profile.label}
          </span>
        </p>

        <div class="btn-row">

          <button class="btn" data-action="restart">
            Nova participação
          </button>

        </div>

      </section>

    </main>
  `);
}

async function renderAdmin() {
  const results = await getResults();

  const rows = results
    .map((result) => {
      const profile = riskProfile(result.score);

      return `
        <tr>

          <td>${escapeHtml(result.name)}</td>

          <td>${escapeHtml(result.email)}</td>

          <td>
            ${result.score}/${result.total}
          </td>

          <td>
            <span class="pill ${profile.className}">
              ${profile.label}
            </span>
          </td>

        </tr>
      `;
    })
    .join("");

  page(`
    <main class="page admin-page">

      <section class="admin-panel">

        ${brand()}

        <h2>
          Painel de resultados
        </h2>

        ${
          state.adminAuthed
            ? `
              <table>

                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Nota</th>
                    <th>Perfil</th>
                  </tr>
                </thead>

                <tbody>
                  ${rows}
                </tbody>

              </table>

              <div class="btn-row">

                <button class="btn" data-action="export">
                  Exportar CSV
                </button>

                <button class="btn secondary" data-action="clear">
                  Limpar dados
                </button>

              </div>
            `
            : `
              <form id="adminLogin">

                <div class="field">

                  <label>Usuário</label>

                  <input id="adminUser" />

                </div>

                <div class="field">

                  <label>Senha</label>

                  <input
                    id="adminPass"
                    type="password"
                  />

                </div>

                <p id="adminError" class="error">
                  Usuário ou senha inválidos.
                </p>

                <button class="btn" type="submit">
                  Entrar
                </button>

              </form>
            `
        }

      </section>

    </main>
  `);
}

function choose(index) {
  if (state.selected) return;

  const scenario = scenarios[state.step];

  const option = scenario.options[index];

  state.selected = option;

  if (option.safe) {
    state.score += 1;
  }

  state.decisions.push({
    scenario: scenario.title,
    category: scenario.category,
    choice: option.text,
    safe: option.safe
  });

  nextScenario();
}

async function persistCurrentResult() {
  if (!state.participant || state.saved) return;

  await saveResult({
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

async function nextScenario() {
  if (state.step + 1 >= scenarios.length) {
    await persistCurrentResult();

    state.screen = "final";
  } else {
    state.step += 1;

    state.selected = null;

    state.screen = "scenario";
  }

  render();
}

function restart() {
  state.screen = "register";

  state.participant = null;

  state.step = 0;

  state.score = 0;

  state.decisions = [];

  state.selected = null;

  state.saved = false;

  render();
}

document.addEventListener("click", async (event) => {
  const choice = event.target.closest("[data-choice]");

  if (choice) {
    choose(Number(choice.dataset.choice));

    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) return;

  const action = actionButton.dataset.action;

  if (action === "register") {
    state.screen = "register";
  }

  if (action === "restart") {
    restart();

    return;
  }

  if (action === "clear") {
    const snapshot = await db.collection("results").get();

    for (const item of snapshot.docs) {
      await db.collection("results").doc(item.id).delete();
    }

    render();

    return;
  }

  render();
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "registerForm") {
    event.preventDefault();

    const name = normalize(
      document.getElementById("name").value
    );

    const email = normalize(
      document.getElementById("email").value
    ).toLowerCase();

    const consent =
      document.getElementById("consent").checked;

    const error = document.getElementById("formError");

    if (name.length < 5 || !isEmail(email) || !consent) {
      error.classList.add("show");

      return;
    }

    state.participant = {
      name,
      email
    };

    state.screen = "scenario";

    render();
  }

  if (event.target.id === "adminLogin") {
    event.preventDefault();

    const user =
      document.getElementById("adminUser").value;

    const pass =
      document.getElementById("adminPass").value;

    const error =
      document.getElementById("adminError");

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      state.adminAuthed = true;

      render();
    } else {
      error.classList.add("show");
    }
  }
});

window.addEventListener("hashchange", () => {
  if (location.hash === ADMIN_HASH) {
    state.screen = "admin";
  } else {
    state.screen = "intro";
  }

  render();
});

if (location.hash === ADMIN_HASH) {
  state.screen = "admin";
}

render();