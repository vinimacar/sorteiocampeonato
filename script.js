const selecoes = [
  { nome: "Brasil", codigo: "br" },
  { nome: "Argentina", codigo: "ar" },
  { nome: "Alemanha", codigo: "de" },
  { nome: "França", codigo: "fr" },
  { nome: "Itália", codigo: "it" },
  { nome: "Espanha", codigo: "es" },
  { nome: "Inglaterra", codigo: "gb-eng" }, 
  { nome: "Portugal", codigo: "pt" },
  { nome: "Holanda", codigo: "nl" },
  { nome: "Bélgica", codigo: "be" },
  { nome: "Croácia", codigo: "hr" },
  { nome: "Uruguai", codigo: "uy" },
  { nome: "México", codigo: "mx" },
  { nome: "Estados Unidos", codigo: "us" },
  { nome: "Japão", codigo: "jp" },
  { nome: "Coreia do Sul", codigo: "kr" },
  { nome: "Senegal", codigo: "sn" },
  { nome: "Marrocos", codigo: "ma" },
  { nome: "Nigéria", codigo: "ng" },
  { nome: "Austrália", codigo: "au" },
  { nome: "Suíça", codigo: "ch" },
  { nome: "Polônia", codigo: "pl" },
  { nome: "Dinamarca", codigo: "dk" },
  { nome: "Sérvia", codigo: "rs" },
  { nome: "Colômbia", codigo: "co" },
  { nome: "Chile", codigo: "cl" },
  { nome: "Camarões", codigo: "cm" },
  { nome: "Gana", codigo: "gh" },
  { nome: "Equador", codigo: "ec" },
  { nome: "Irã", codigo: "ir" },
  { nome: "Arábia Saudita", codigo: "sa" },
  { nome: "Canadá", codigo: "ca" }
];

window.onload = function() {
  const area = document.getElementById("area-selecoes");
  selecoes.forEach(sel => {
    const div = document.createElement("div");
    div.className = "card-selecao";
    div.draggable = true;
    div.ondragstart = drag;
    div.dataset.nome = sel.nome;
    div.dataset.codigo = sel.codigo;
    div.innerHTML = `<img src="img/${sel.codigo}.png" width="40" alt="${sel.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='img/un.png';"> ${sel.nome}`;
    area.appendChild(div);
  });

  for (let i = 1; i <= 4; i++) {
    const pote = document.getElementById(`pote${i}`);
    pote.ondragover = allowDrop;
    pote.ondrop = drop;
    pote.ondragenter = e => e.target.classList.add("dragover");
    pote.ondragleave = e => e.target.classList.remove("dragover");
  }
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
  div.innerHTML = `<img src="img/${data.codigo}.png" width="40" alt="${data.nome}" class="me-2 rounded shadow-sm" onerror="this.onerror=null;this.src='img/un.png';"> ${data.nome}`;
  div.ondragstart = drag;
  target.appendChild(div);
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
      html += `<div><img src="img/${sel.codigo}.png" width="40" alt="${sel.nome}" onerror="this.onerror=null;this.src='img/un.png';"> ${sel.nome}</div>`;
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
          `<img src="img/${grupo[i].codigo}.png" width="40" alt="${grupo[i].nome}" onerror="this.onerror=null;this.src='img/un.png';"> ${grupo[i].nome} x 
           <img src="img/${grupo[j].codigo}.png" width="40" alt="${grupo[j].nome}" onerror="this.onerror=null;this.src='img/un.png';"> ${grupo[j].nome}`
        );
      }
    }

    html += jogos.map(j => `<li>${j}</li>`).join("");
    html += "</ul>";
    tabelaDiv.innerHTML += html;
  });
}
