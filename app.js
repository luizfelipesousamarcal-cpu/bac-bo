// =======================================
// PAINEL ESTATÍSTICO BAC BO
// =======================================

let history = JSON.parse(localStorage.getItem("history")) || [];

let player = 0;
let banker = 0;
let tie = 0;

history.forEach(item => {

    if(item === "PLAYER"){
        player++;
    }

    if(item === "BANKER"){
        banker++;
    }

    if(item === "TIE"){
        tie++;
    }

});

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx,{

    type:"bar",

    data:{
        labels:["PLAYER","BANKER","TIE"],

        datasets:[{

            label:"Resultados",

            data:[player,banker,tie],

            backgroundColor:[
                "#3b82f6",
                "#ef4444",
                "#facc15"
            ],

            borderRadius:10

        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:false,

        plugins:{
            legend:{
                display:false
            }
        }
    }

});

function salvarHistorico(){

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}

function atualizarGrafico(){

    chart.data.datasets[0].data = [
        player,
        banker,
        tie
    ];

    chart.update();

}// =======================================
// ATUALIZAR PAINEL
// =======================================

function atualizarPainel(){

    // Atualiza contadores
    document.getElementById("player").innerText = player;
    document.getElementById("banker").innerText = banker;
    document.getElementById("tie").innerText = tie;

    // Atualiza gráfico
    atualizarGrafico();

    // Atualiza histórico
    const lista = document.getElementById("history");

    lista.innerHTML = "";

    history.slice(0,30).forEach(item => {

        const li = document.createElement("li");

        li.innerText = item;

        lista.appendChild(li);

    });

    // Total de rodadas
    const rodadas = document.getElementById("analiseRodadas");

    if(rodadas){

        rodadas.innerText = history.length;

    }
// =======================================
// ADICIONAR RESULTADO
// =======================================

function addResult(resultado){

    // Adiciona o resultado no início do histórico
    history.unshift(resultado);

    // Atualiza os contadores
    switch(resultado){

        case "PLAYER":
            player++;
            break;

        case "BANKER":
            banker++;
            break;

        case "TIE":
            tie++;
            break;

    }

    // Salva no navegador
    salvarHistorico();

    // Atualiza tudo
    atualizarPainel();
    atualizarSequencia();
    atualizarSugestao();

      }// =======================================
// ATUALIZAR SEQUÊNCIA
// =======================================

function atualizarSequencia(){

    const status = document.getElementById("statusAnalise");
    const sequenciaAtual = document.getElementById("sequenciaAtual");

    if(!status || !sequenciaAtual){
        return;
    }

    if(history.length === 0){

        sequenciaAtual.innerText = "-";
        status.innerText = "⚪ Aguardando resultados...";

        return;

    }

    const atual = history[0];

    let contador = 1;

    for(let i = 1; i < history.length; i++){

        if(history[i] === atual){

            contador++;

        }else{

            break;

        }

    }

    sequenciaAtual.innerText = contador + " " + atual;

    if(history.length < 20){

        status.innerText = "🟡 Coletando dados...";

    }else if(contador >= 5){

        status.innerText = "🔴 Sequência longa detectada";

    }else{

        status.innerText = "🟢 Dados suficientes para análise";

    }// =======================================
// ATUALIZAR SUGESTÃO
// =======================================

function atualizarSugestao(){

    const signal = document.getElementById("signal");
    const barra = document.getElementById("confidenceBar");
    const texto = document.getElementById("confidenceText");
    const motivos = document.getElementById("signalReasons");

    if(!signal || !barra || !texto || !motivos){
        return;
    }

    if(history.length < 20){

        signal.innerText = "⚪ Aguardando dados";
        signal.style.color = "#ffffff";

        barra.style.width = "0%";
        barra.style.background = "#22c55e";

        texto.innerText = "0%";

        motivos.innerHTML = "<li>Registre pelo menos 20 rodadas.</li>";

        return;

    }

    const ultimos = history.slice(0,30);

    const player30 = ultimos.filter(x => x === "PLAYER").length;
    const banker30 = ultimos.filter(x => x === "BANKER").length;
    const tie30 = ultimos.filter(x => x === "TIE").length;

    const atual = history[0];

    let sequencia = 1;

    for(let i = 1; i < history.length; i++){

        if(history[i] === atual){
            sequencia++;
        }else{
            break;
        }

    }

    let escolha = "";
    let confianca = 55;
    let lista = [];

    if(sequencia >= 5){

        escolha = atual === "PLAYER" ? "BANKER" : "PLAYER";
        confianca = 82;

        lista.push("Sequência de " + sequencia + " " + atual);
        lista.push("Possível reversão estatística");

    }else{

        if(player30 >= banker30){

            escolha = "PLAYER";

            confianca = Math.min(90, 55 + ((player30 - banker30) * 3));

            lista.push("PLAYER predominou nas últimas 30");
            lista.push("PLAYER: " + player30);
            lista.push("BANKER: " + banker30);

        }else{

            escolha = "BANKER";

            confianca = Math.min(90, 55 + ((banker30 - player30) * 3));

            lista.push("BANKER predominou nas últimas 30");
            lista.push("PLAYER: " + player30);
            lista.push("BANKER: " + banker30);

        }

        if(tie30 > 0){

            lista.push("TIE: " + tie30);

        }

}
    signal.innerText =
        escolha === "PLAYER"
        ? "🔵 PLAYER"
        : "🔴 BANKER";

    signal.style.color =
        escolha === "PLAYER"
        ? "#3b82f6"
        : "#ef4444";

    barra.style.width = confianca + "%";

    if(confianca >= 80){

        barra.style.background = "#22c55e";

    }else if(confianca >= 65){

        barra.style.background = "#facc15";

    }else{

        barra.style.background = "#ef4444";

    }

    texto.innerText = confianca + "%";

    motivos.innerHTML = "";

    lista.forEach(item => {

        const li = document.createElement("li");

        li.innerText = item;

        motivos.appendChild(li);

    });

      }// =======================================
// LIMPAR HISTÓRICO
// =======================================

function limparHistorico(){

    if(!confirm("Deseja apagar todo o histórico?")){
        return;
    }

    history = [];

    player = 0;
    banker = 0;
    tie = 0;

    localStorage.removeItem("history");

    atualizarPainel();
    atualizarSequencia();
    atualizarSugestao();

}

// =======================================
// INICIALIZAÇÃO
// =======================================

atualizarPainel();
atualizarSequencia();
atualizarSugestao();
}
