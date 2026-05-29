const ADMIN_HASH = "#painel-resultados-unicive-douglas-2026";

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
    message:"Detectamos um acesso suspeito. Envie o código SMS recebido para validar sua conta.",
    explanation:"Golpistas usam engenharia social para roubar sua conta do WhatsApp.",
    options:[
      {
        text:"Enviar o código",
        correct:false
      },
      {
        text:"Ignorar e ativar verificação em duas etapas",
        correct:true
      },
      {
        text:"Passar parcialmente o código",
        correct:false
      }
    ]
  },

  {
    title:"Familiar pedindo Pix",
    avatar:"👤",
    sender:"Filho(a)",
    risk:"CRÍTICO",
    message:"Troquei de número. Preciso urgente de um Pix para pagar uma conta.",
    explanation:"Criminosos usam fotos reais e criam urgência emocional.",
    options:[
      {
        text:"Fazer o Pix imediatamente",
        correct:false
      },
      {
        text:"Ligar para o número antigo e confirmar",
        correct:true
      },
      {
        text:"Transferir metade do valor",
        correct:false
      }
    ]
  },

  {
    title:"Promoção falsa",
    avatar:"🎁",
    sender:"Empresa famosa",
    risk:"MÉDIO",
    message:"Parabéns! Você ganhou um voucher de R$500. Clique no link.",
    explanation:"Links falsos podem roubar seus dados pessoais.",
    options:[
      {
        text:"Clicar imediatamente",
        correct:false
      },
      {
        text:"Verificar no site oficial",
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
  screen:"intro",
  participant:null,
  step:0,
  score:0,
  selected:null,
  answers:[]
};

function render(){

  if(location.hash === ADMIN_HASH){
    renderAdmin();
    return;
  }

  if(state.screen === "intro"){
    renderIntro();
  }

  if(state.screen === "register"){
    renderRegister();
  }

  if(state.screen === "scenario"){
    renderScenario();
  }

  if(state.screen === "result"){
    renderResult();
  }
}

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
          Você saberia identificar um golpe digital?
        </h2>

        <p class="text">
          Simulador interativo de engenharia social para conscientização sobre golpes digitais aplicados via WhatsApp.
        </p>

        <div class="card-grid">

          <div class="info-card">
            <strong>💬 Simulações Reais</strong>
            <p class="text">
              Cenários inspirados em golpes reais.
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

        <button class="btn btn-primary btn-block" style="margin-top:24px;" onclick="startRegister()">
          Iniciar Simulação
        </button>

        <p class="notice">
          Projeto acadêmico educacional desenvolvido para conscientização digital.
        </p>

      </section>

      <div class="phone">

        <div class="phone-screen">

          <div class="chat-top">

            <div class="avatar">
              🛡️
            </div>

            <div>
              <strong>WhatsApp Seguro</strong>
              <p style="font-size:.85rem;">
                Simulador Educacional
              </p>
            </div>

          </div>

          <div class="messages">

            <div class="bubble">
              Olá 👋
              <br><br>
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
}

function startRegister(){
  state.screen = "register";
  render();
}

function renderRegister(){

  app.innerHTML = `
  
  <main class="page">

    <section class="panel" style="max-width:700px;width:100%;">

      <div class="logo">

        <div class="logo-icon">
          🛡️
        </div>

        <div>
          <h1>Cadastro do Participante</h1>
          <p>Preencha seus dados</p>
        </div>

      </div>

      <div class="form-group">
        <label>Nome</label>
        <input type="text" id="name">
      </div>

      <div class="form-group">
        <label>E-mail</label>
        <input type="email" id="email">
      </div>

      <div class="form-group">
        <label>Faixa Etária</label>

        <select id="age">
          <option value="">Selecione</option>
          <option>18-25</option>
          <option>26-40</option>
          <option>41-60</option>
          <option>60+</option>
        </select>
      </div>

      <button class="btn btn-primary btn-block" onclick="startSimulation()">
        Entrar no Simulador
      </button>

    </section>

  </main>

  `;
}

function startSimulation(){

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value;

  if(!name || !email || !age){
    alert("Preencha todos os campos.");
    return;
  }

  state.participant = {
    name,
    email,
    age
  };

  state.screen = "scenario";
  state.step = 0;
  state.score = 0;
  state.answers = [];

  render();
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

            <div
              class="option"
              onclick="selectOption(${index})"
              id="option-${index}"
            >

              ${opt.text}

            </div>

          `).join("")}

          <button
            class="btn btn-primary btn-block"
            style="margin-top:10px;"
            onclick="confirmOption()"
          >
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

  const sc = scenarios[state.step];
  const option = sc.options[state.selected];

  state.answers.push({
    scenario:sc.title,
    answer:option.text,
    correct:option.correct
  });

  if(option.correct){
    state.score++;
  }

  alert(
    option.correct
      ? "Resposta correta!"
      : "Você caiu no golpe."
  );

  state.selected = null;

  if(state.step < scenarios.length - 1){

    state.step++;
    render();

  }else{

    await saveResult();
    state.screen = "result";
    render();

  }
}

async function saveResult(){

  try{

    await db.collection("resultados_simulacao").add({

      participant:state.participant,
      score:state.score,
      total:scenarios.length,
      answers:state.answers,
      createdAt:new Date().toISOString()

    });

  }catch(error){

    console.error(error);

  }
}

function renderResult(){

  const percent = Math.round(
    (state.score / scenarios.length) * 100
  );

  app.innerHTML = `
  
  <main class="page">

    <section class="panel result-card" style="max-width:700px;width:100%;">

      <div class="logo" style="justify-content:center;">

        <div class="logo-icon">
          🛡️
        </div>

      </div>

      <h2 class="title" style="font-size:2.2rem;">
        Simulação Finalizada
      </h2>

      <div
        class="result-score"
        style="--percent:${percent}%"
      >
        <strong>${percent}%</strong>
        <span>${state.score}/${scenarios.length} acertos</span>
      </div>

      <p class="text">
        Obrigado por participar do projeto acadêmico de conscientização digital.
      </p>

      <button
        class="btn btn-primary btn-block"
        style="margin-top:20px;"
        onclick="restartSimulation()"
      >
        Reiniciar
      </button>

    </section>

  </main>

  `;
}

function restartSimulation(){

  state.screen = "intro";
  state.step = 0;
  state.score = 0;
  state.selected = null;
  state.answers = [];

  render();
}

async function renderAdmin(){

  const snapshot = await db
    .collection("resultados_simulacao")
    .orderBy("createdAt","desc")
    .get();

  let rows = "";

  let total = 0;
  let perfect = 0;
  let avg = 0;

  snapshot.forEach(doc=>{

    const data = doc.data();

    total++;

    avg += data.score;

    if(data.score === data.total){
      perfect++;
    }

    rows += `
    
      <tr>

        <td>${data.participant.name}</td>
        <td>${data.participant.email}</td>
        <td>${data.participant.age}</td>
        <td>${data.score}/${data.total}</td>

        <td>

          <span class="badge ${
            data.score === data.total
              ? "badge-success"
              : "badge-danger"
          }">

            ${
              data.score === data.total
                ? "Seguro"
                : "Vulnerável"
            }

          </span>

        </td>

      </tr>

    `;
  });

  avg = total > 0
    ? (avg / total).toFixed(1)
    : 0;

  app.innerHTML = `
  
  <main class="page">

    <div class="admin-wrapper">

      <div class="admin-top">

        <div class="logo">

          <div class="logo-icon">
            📊
          </div>

          <div>
            <h1>Painel Administrativo</h1>
            <p>Resultados da Simulação</p>
          </div>

        </div>

        <button class="btn btn-danger" onclick="logoutAdmin()">
          Sair
        </button>

      </div>

      <div class="metric-grid">

        <div class="metric">
          <h3>${total}</h3>
          <p>Total Participantes</p>
        </div>

        <div class="metric">
          <h3>${perfect}</h3>
          <p>Perfis Seguros</p>
        </div>

        <div class="metric">
          <h3>${avg}</h3>
          <p>Média Geral</p>
        </div>

      </div>

      <div class="table-wrap">

        <table class="table">

          <thead>

            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Idade</th>
              <th>Pontuação</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            ${rows}

          </tbody>

        </table>

      </div>

    </div>

  </main>

  `;
}

function logoutAdmin(){

  location.hash = "";
  state.screen = "intro";

  render();
}

window.addEventListener("hashchange",render);

render();