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

const app = document.getElementById("app");

const scenarios = [
  {
    title:"Código de Verificação",
    avatar:"🛠️",
    sender:"Suporte WhatsApp",
    risk:"ALTO",
    message:
      "Detectamos um acesso suspeito em sua conta. Para confirmar sua identidade envie o código SMS recebido.",
    explanation:
      "Golpistas tentam roubar sua conta pedindo o código de verificação enviado por SMS.",
    options:[
      {
        text:"Enviar o código recebido",
        correct:false
      },
      {
        text:"Ignorar e ativar verificação em duas etapas",
        correct:true
      },
      {
        text:"Pedir mais informações ao golpista",
        correct:false
      }
    ]
  },

  {
    title:"Falso Familiar",
    avatar:"👤",
    sender:"Filho(a)",
    risk:"CRÍTICO",
    message:
      "Oi mãe, troquei de número. Preciso pagar uma conta urgente. Pode fazer um PIX pra mim?",
    explanation:
      "Criminosos usam fotos e nomes de familiares para pedir dinheiro.",
    options:[
      {
        text:"Fazer o PIX rapidamente",
        correct:false
      },
      {
        text:"Ligar para o número antigo e confirmar",
        correct:true
      },
      {
        text:"Transferir apenas metade",
        correct:false
      }
    ]
  },

  {
    title:"Promoção Falsa",
    avatar:"🎁",
    sender:"Promoção Online",
    risk:"MÉDIO",
    message:
      "Você ganhou um voucher de R$500! Clique no link para resgatar agora.",
    explanation:
      "Links falsos podem roubar dados pessoais e instalar malware.",
    options:[
      {
        text:"Clicar no link",
        correct:false
      },
      {
        text:"Verificar canais oficiais da empresa",
        correct:true
      },
      {
        text:"Compartilhar com amigos",
        correct:false
      }
    ]
  }
];

const state = {
  step:0,
  selected:null,
  score:0
};

function renderIntro(){

  app.innerHTML = `
  
  <main class="page">

    <div class="container">

      <section class="panel">

        <div class="logo">

          <div class="logo-icon">
            🛡️
          </div>

          <div>
            <h1>WhatsApp Seguro</h1>
            <p>Projeto Acadêmico Unicive</p>
          </div>

        </div>

        <h2 class="title">
          Você conseguiria identificar um golpe digital?
        </h2>

        <p class="text">
          Simulador interativo de engenharia social desenvolvido para conscientização sobre golpes digitais aplicados via WhatsApp.
        </p>

        <div class="card-grid">

          <div class="info-card">
            <strong>💬 Simulações reais</strong>
            <p class="text">
              Cenários inspirados em golpes reais.
            </p>
          </div>

          <div class="info-card">
            <strong>🧠 Engenharia Social</strong>
            <p class="text">
              Aprenda técnicas utilizadas por criminosos.
            </p>
          </div>

          <div class="info-card">
            <strong>🔒 Segurança Digital</strong>
            <p class="text">
              Desenvolva percepção crítica.
            </p>
          </div>

        </div>

        <button
          class="btn btn-primary btn-block"
          id="startBtn"
          style="margin-top:28px;">

          Iniciar Simulação

        </button>

      </section>

      <div class="phone">

        <div class="phone-screen">

          <div class="chat-top">

            <div class="avatar">
              🛡️
            </div>

            <div>
              <strong>WhatsApp Seguro</strong>
              <p style="font-size:.85rem;opacity:.85;">
                Simulador Educacional
              </p>
            </div>

          </div>

          <div class="messages">

            <div class="bubble">
              Olá 👋<br><br>
              Este simulador apresentará situações reais de golpes digitais.
            </div>

            <div class="bubble">
              Seu objetivo será identificar comportamentos suspeitos e tomar decisões seguras.
            </div>

          </div>

        </div>

      </div>

    </div>

  </main>

  `;

  document
    .getElementById("startBtn")
    .addEventListener("click",renderScenario);
}

function renderScenario(){

  const sc = scenarios[state.step];

  app.innerHTML = `
  
  <main class="page">

    <div class="phone">

      <div class="phone-screen">

        <div class="chat-top">

          <div class="avatar">
            ${sc.avatar}
          </div>

          <div>
            <strong>${sc.sender}</strong>
            <div class="badge badge-danger">
              Risco ${sc.risk}
            </div>
          </div>

        </div>

        <div class="messages">

          <div class="bubble">
            ${sc.message}
          </div>

        </div>

        <div class="options">

          ${sc.options.map((opt,index)=>`

            <div
              class="option"
              onclick="selectOption(${index})"
              id="option-${index}">

              ${opt.text}

            </div>

          `).join("")}

          <button
            class="btn btn-primary btn-block"
            style="margin-top:10px;"
            onclick="confirmOption()">

            Confirmar Resposta

          </button>

        </div>

      </div>

    </div>

  </main>

  `;
}

function selectOption(index){

  state.selected = index;

  document
    .querySelectorAll(".option")
    .forEach(el => el.classList.remove("active"));

  document
    .getElementById(`option-${index}`)
    .classList.add("active");
}

async function confirmOption(){

  if(state.selected === null){

    alert("Selecione uma opção.");
    return;
  }

  const scenario = scenarios[state.step];
  const option = scenario.options[state.selected];

  if(option.correct){
    state.score++;
  }

  await db.collection("resultados_simulacao").add({
    scenario:scenario.title,
    selected:option.text,
    correct:option.correct,
    createdAt:new Date().toISOString()
  });

  alert(
    option.correct
      ? "Resposta correta!"
      : "Você caiu no golpe."
  );

  state.selected = null;

  if(state.step < scenarios.length - 1){

    state.step++;
    renderScenario();

  } else {

    renderFinal();

  }
}

function renderFinal(){

  const percent = Math.round(
    (state.score / scenarios.length) * 100
  );

  app.innerHTML = `

  <main class="page">

    <div class="panel" style="max-width:700px;width:100%;">

      <div class="logo">

        <div class="logo-icon">
          🛡️
        </div>

        <div>
          <h1>Simulação Finalizada</h1>
          <p>Projeto Acadêmico Unicive</p>
        </div>

      </div>

      <div class="result-box">

        <h2>Resultado Final</h2>

        <p class="text">
          Confira sua pontuação de segurança digital.
        </p>

        <div
          class="score"
          style="--percent:${percent}%">

          <strong>${percent}%</strong>

          <span>${state.score}/${scenarios.length} acertos</span>

        </div>

        <button
          class="btn btn-primary btn-block"
          onclick="restartSimulation()">

          Reiniciar Simulação

        </button>

      </div>

    </div>

  </main>

  `;
}

function restartSimulation(){

  state.step = 0;
  state.score = 0;
  state.selected = null;

  renderIntro();
}

renderIntro();