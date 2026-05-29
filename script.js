```javascript
const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SEU_AUTH",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER",
  appId: "SEU_APP_ID"
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
    message:"Detectamos um acesso suspeito. Envie o código SMS recebido para validar sua conta.",
    options:[
      {
        text:"Enviar o código",
        correct:false
      },
      {
        text:"Ignorar e ativar 2FA",
        correct:true
      }
    ]
  }
];

const state = {
  step:0,
  selected:null
};

function renderIntro(){

  app.innerHTML = `
  
  <main class="page">

    <div class="container">

      <section class="panel">

        <div class="logo">
          <div class="logo-icon">🛡️</div>

          <div>
            <h1>WhatsApp Seguro</h1>
            <p>Projeto Acadêmico Unicive</p>
          </div>
        </div>

        <h2 class="title">
          Você saberia identificar um golpe digital?
        </h2>

        <p class="text">
          Simulador interativo de engenharia social desenvolvido para conscientização sobre golpes digitais aplicados via WhatsApp.
        </p>

        <div class="card-grid">

          <div class="info-card">
            <strong>💬 Simulações reais</strong>
            <p class="text">
              Baseado em golpes reais.
            </p>
          </div>

          <div class="info-card">
            <strong>🧠 Engenharia Social</strong>
            <p class="text">
              Aprenda técnicas usadas por criminosos.
            </p>
          </div>

          <div class="info-card">
            <strong>🔒 Segurança Digital</strong>
            <p class="text">
              Desenvolva percepção crítica.
            </p>
          </div>

        </div>

        <button class="btn btn-primary btn-block" id="startBtn" style="margin-top:24px;">
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

  document.getElementById("startBtn")
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
            <p style="font-size:.82rem;">
              Risco ${sc.risk}
            </p>
          </div>

        </div>

        <div class="messages">

          <div class="bubble">
            ${sc.message}
          </div>

        </div>

        <div class="options">

          ${sc.options.map((opt,index)=>`

            <div class="option"
              onclick="selectOption(${index})"
              id="option-${index}">

              ${opt.text}

            </div>

          `).join("")}

          <button
            class="btn btn-primary btn-block"
            style="margin-top:10px;"
            onclick="confirmOption()">

            Confirmar

          </button>

        </div>

      </div>

    </div>

  </main>

  `;
}

function selectOption(index){

  state.selected = index;

  document.querySelectorAll(".option")
    .forEach(el=>el.classList.remove("active"));

  document.getElementById(`option-${index}`)
    .classList.add("active");
}

async function confirmOption(){

  if(state.selected === null){
    alert("Selecione uma opção.");
    return;
  }

  const scenario = scenarios[state.step];
  const option = scenario.options[state.selected];

  await db.collection("resultados_simulacao")
    .add({
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

  renderIntro();
}

renderIntro();