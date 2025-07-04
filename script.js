const selecoes = [
  { nome: "Brasil", codigo: "br", continente: "sulamerica" },
  { nome: "Argentina", codigo: "ar", continente: "sulamerica" },
  { nome: "Uruguai", codigo: "uy", continente: "sulamerica" },
  { nome: "Colômbia", codigo: "co", continente: "sulamerica" },
  { nome: "Chile", codigo: "cl", continente: "sulamerica" },
  { nome: "Equador", codigo: "ec", continente: "sulamerica" },
   // se quiser adicionar mais

  { nome: "Alemanha", codigo: "de", continente: "europa" },
  { nome: "França", codigo: "fr", continente: "europa" },
  { nome: "Itália", codigo: "it", continente: "europa" },
  { nome: "Espanha", codigo: "es", continente: "europa" },
  { nome: "Inglaterra", codigo: "gb-eng", continente: "europa" },
  { nome: "Portugal", codigo: "pt", continente: "europa" },
  { nome: "Holanda", codigo: "nl", continente: "europa" },
  { nome: "Bélgica", codigo: "be", continente: "europa" },
  { nome: "Croácia", codigo: "hr", continente: "europa" },
  { nome: "Suíça", codigo: "ch", continente: "europa" },
  { nome: "Polônia", codigo: "pl", continente: "europa" },
  { nome: "Dinamarca", codigo: "dk", continente: "europa" },
  { nome: "Sérvia", codigo: "rs", continente: "europa" },

  { nome: "Senegal", codigo: "sn", continente: "africa" },
  { nome: "Marrocos", codigo: "ma", continente: "africa" },
  { nome: "Nigéria", codigo: "ng", continente: "africa" },
  { nome: "Camarões", codigo: "cm", continente: "africa" },
  { nome: "Gana", codigo: "gh", continente: "africa" },

  { nome: "Japão", codigo: "jp", continente: "asia" },
  { nome: "Coreia do Sul", codigo: "kr", continente: "asia" },
  { nome: "Irã", codigo: "ir", continente: "asia" },
  { nome: "Arábia Saudita", codigo: "sa", continente: "asia" },

  { nome: "México", codigo: "mx", continente: "norte" },
  { nome: "Estados Unidos", codigo: "us", continente: "norte" },
  { nome: "Canadá", codigo: "ca", continente: "norte" },
  { nome: "Costa Rica", codigo: "cr", continente: "norte" },

  { nome: "Austrália", codigo: "au", continente: "oceania" }
];

window.onload = function() {
  const areas = {
    sulamerica: document.getElementById("area-selecoes-sulamerica"),
    europa: document.getElementById("area-selecoes-europa"),
    africa: document.getElementById("area-selecoes-africa"),
    asia: document.getElementById("area-selecoes-asia"),
    norte: document.getElementById("area-selecoes-norte"),
    oceania: document.getElementById("area-selecoes-oceania")
  };
  selecoes.forEach(sel => {
    const div = document.createElement("div");
    div.className = "card-selecao";
    div.draggable = true;
    div.ondragstart = drag;
    div.dataset.nome = sel.nome;
    div.dataset.codigo = sel.codigo;
    div.innerHTML = `<img src="https://flagcdn.com/40x30/${sel.codigo}.png" width="40" alt="${sel.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${sel.nome}`;
    areas[sel.continente].appendChild(div);
  });

  for (let i = 1; i <= 4; i++) {
    const pote = document.getElementById(`pote${i}`);
    pote.ondragover = allowDrop;
    pote.ondrop = drop;
    pote.ondragenter = e => e.target.classList.add("dragover");
    pote.ondragleave = e => e.target.classList.remove("dragover");
  }

  // Permitir drag nos grupos
  const grupos = ["A","B","C","D","E","F","G","H"];
  grupos.forEach(letra => {
    const grupoDiv = document.getElementById(`grupo${letra}`);
    grupoDiv.ondragover = allowDrop;
    grupoDiv.ondrop = dropGrupo;
    grupoDiv.ondragenter = e => e.target.classList.add("dragover");
    grupoDiv.ondragleave = e => e.target.classList.remove("dragover");
  });
};

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", JSON.stringify({
    nome: ev.target.dataset.nome,
    codigo: ev.target.dataset.codigo
  }));
}

function drop(ev) {
  ev.preventDefault();
  const target = ev.target.closest('.pote');
  if (!target) return;

  if (target.children.length >= 8) {
    alert("Este pote já tem 8 seleções.");
    target.classList.remove("dragover");
    return;
  }

  const data = JSON.parse(ev.dataTransfer.getData("text"));

  // Remove todas as cópias dessa seleção
  const allCards = document.querySelectorAll(".card-selecao");
  allCards.forEach(card => {
    if (card.dataset.nome === data.nome) card.remove();
  });

  const div = document.createElement("div");
  div.className = "card-selecao";
  div.draggable = true;
  div.dataset.nome = data.nome;
  div.dataset.codigo = data.codigo;
  div.innerHTML = `<img src="https://flagcdn.com/40x30/${data.codigo}.png" width="40" alt="${data.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${data.nome}`;
  div.ondragstart = drag;
  target.appendChild(div);
  target.classList.remove("dragover");
}

// Função para dropar nos grupos
function dropGrupo(ev) {
  ev.preventDefault();
  const target = ev.target.closest('.grupo-drop');
  if (!target) return;

  // Procura a primeira posição vazia
  const posicoes = Array.from(target.querySelectorAll('.grupo-posicao'));
  const posVazia = posicoes.find(pos => !pos.querySelector('.card-selecao'));
  if (!posVazia) {
    alert("Este grupo já tem 4 seleções.");
    target.classList.remove("dragover");
    return;
  }

  const data = JSON.parse(ev.dataTransfer.getData("text"));

  // Remove todas as cópias dessa seleção dos grupos
  const allCards = document.querySelectorAll(".grupo-drop .card-selecao");
  allCards.forEach(card => {
    if (card.dataset.nome === data.nome) card.remove();
  });

  // Remove do pote (ou de onde estiver)
  const poteCard = document.querySelector(`.pote .card-selecao[data-nome="${data.nome}"]`);
  if (poteCard) poteCard.remove();

  // Cria o card da seleção
  const div = document.createElement("div");
  div.className = "card-selecao";
  div.draggable = true;
  div.dataset.nome = data.nome;
  div.dataset.codigo = data.codigo;
  div.ondragstart = drag;
  div.innerHTML = `<img src="https://flagcdn.com/40x30/${data.codigo}.png" width="40" alt="${data.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${data.nome}`;

  // Limpa o texto da posição e adiciona o card
  posVazia.innerHTML = "";
  posVazia.appendChild(div);

  target.classList.remove("dragover");
}

let gruposSorteados = [];

function sortearGrupos() {
  for (let i = 1; i <= 4; i++) {
    const pote = document.getElementById(`pote${i}`);
    if (pote.children.length !== 8) {
      alert(`O Pote ${i} deve conter 8 seleções.`);
      return;
    }
  }

  gruposSorteados = [[], [], [], [], [], [], [], []];

  for (let poteNum = 1; poteNum <= 4; poteNum++) {
    const poteDiv = document.getElementById(`pote${poteNum}`);
    const selecoesPote = Array.from(poteDiv.children).map(d => ({
      nome: d.dataset.nome,
      codigo: d.dataset.codigo
    }));
    let embaralhadas = selecoesPote.sort(() => Math.random() - 0.5);
    embaralhadas.forEach((sel, idx) => {
      gruposSorteados[idx].push(sel);
    });
  }

  alert("Sorteio realizado!");
}

function mostrarGrupos() {
  if (gruposSorteados.length === 0 || gruposSorteados[0].length === 0) {
    alert("Por favor, faça o sorteio primeiro.");
    return;
  }

  const gruposDiv = document.getElementById("grupos");
  gruposDiv.innerHTML = "";
  const letras = "ABCDEFGH";

  gruposSorteados.forEach((grupo, idx) => {
    const col = document.createElement("div");
    col.className = "col-md-3";
    let html = `<div class="grupo"><h6>Grupo ${letras[idx]}</h6>`;
    grupo.forEach(sel => {
      html += `<div><img src="https://flagcdn.com/40x30/${sel.codigo}.png" width="40" alt="${sel.nome}" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${sel.nome}</div>`;
    });
    html += `</div>`;
    col.innerHTML = html;
    gruposDiv.appendChild(col);
  });
  document.getElementById("grupos").innerHTML = html;
}

function gerarTabela() {
  if (gruposSorteados.length === 0 || gruposSorteados[0].length === 0) {
    alert("Por favor, faça o sorteio primeiro.");
    return;
  }

  const tabelaDiv = document.getElementById("tabela");
  tabelaDiv.innerHTML = "<h3>Tabela de Jogos</h3>";
  const letras = "ABCDEFGH";

  gruposSorteados.forEach((grupo, idx) => {
    let html = `<h5>Grupo ${letras[idx]}</h5><ul>`;
    const jogos = [];

    for (let i = 0; i < grupo.length; i++) {
      for (let j = i + 1; j < grupo.length; j++) {
        jogos.push(
          `<img src="https://flagcdn.com/40x30/${grupo[i].codigo}.png" width="40" alt="${grupo[i].nome}" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${grupo[i].nome} x ` +
          `${grupo[j].nome} <img src="https://flagcdn.com/40x30/${grupo[j].codigo}.png" width="40" alt="${grupo[j].nome}" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';">`
        );
      }
    }

    html += jogos.map(j => `<li>${j}</li>`).join("");
    html += "</ul>";
    tabelaDiv.innerHTML += html;
  });
}

function distribuirAutomaticamente() {
  // Limpa todos os potes
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`pote${i}`).innerHTML = "";
  }
  // Embaralha as seleções
  const embaralhadas = [...selecoes].sort(() => Math.random() - 0.5);
  // Distribui 8 seleções para cada pote
  for (let i = 0; i < embaralhadas.length; i++) {
    const poteNum = Math.floor(i / 8) + 1;
    const sel = embaralhadas[i];
    const div = document.createElement("div");
    div.className = "card-selecao";
    div.draggable = true;
    div.ondragstart = drag;
    div.dataset.nome = sel.nome;
    div.dataset.codigo = sel.codigo;
    div.innerHTML = `<img src="https://flagcdn.com/40x30/${sel.codigo}.png" width="40" alt="${sel.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='https://flagcdn.com/40x30/un.png';"> ${sel.nome}`;
    document.getElementById(`pote${poteNum}`).appendChild(div);
  }
  // Limpa a área de seleções
  document.getElementById("area-selecoes").innerHTML = "";
}
