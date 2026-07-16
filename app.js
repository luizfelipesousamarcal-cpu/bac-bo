let history = JSON.parse(localStorage.getItem("history")) || [];

let player = 0;
let banker = 0;
let tie = 0;

history.forEach(r => {
    if (r === "PLAYER") player++;
    if (r === "BANKER") banker++;
    if (r === "TIE") tie++;
});

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["PLAYER", "BANKER", "TIE"],
        datasets: [{
            label: "Resultados",
            data: [player, banker, tie],
            backgroundColor: [
                "#3b82f6",
                "#ef4444",
                "#facc15"
            ],
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

function atualizarPainel() {

    document.getElementById("player").innerText = player;
    document.getElementById("banker").innerText = banker;
    document.getElementById("tie").innerText = tie;

    chart.data.datasets[0].data = [
        player,
        banker,
        tie
    ];

    chart.update();

    const lista = document.getElementById("history");

    lista.innerHTML = "";

    history.slice(0,30).forEach(item => {

        const li = document.createElement("li");

        li.innerText = item;

        lista.appendChild(li);

    });

    const total = history.length;

    document.getElementById("analiseRodadas").innerText = total;

    if(total > 0){

        document.getElementById("playerPercent").innerText =
        ((player/total)*100).toFixed(1)+"%";

        document.getElementById("bankerPercent").innerText =
        ((banker/total)*100).toFixed(1)+"%";

        document.getElementById("tiePercent").innerText =
        ((tie/total)*100).toFixed(1)+"%";

    }

    document.getElementById("ultimosResultados").innerText =
    history.slice(0,10).join(" • ");

}function addResult(result){

    history.unshift(result);

    if(result==="PLAYER") player++;
    if(result==="BANKER") banker++;
    if(result==="TIE") tie++;

    localStorage.setItem("history", JSON.stringify(history));

    atualizarPainel();

    atualizarSequencia();

}

function atualizarSequencia(){

    if(history.length===0){
        document.getElementById("sequenciaAtual").innerText="-";
        document.getElementById("statusAnalise").innerText="⚪ Aguardando dados...";
        return;
    }

    const atual=history[0];

    let contador=0;

    for(const item of history){

        if(item===atual){
            contador++;
        }else{
            break;
        }

    }

    document.getElementById("sequenciaAtual").innerText=
        contador+" "+atual;

    if(history.length<20){

        document.getElementById("statusAnalise").innerText=
        "🟡 Poucos dados registrados";

    }else if(contador>=5){

        document.getElementById("statusAnalise").innerText=
        "🔴 Sequência longa em andamento";

    }else{

        document.getElementById("statusAnalise").innerText=
        "🟢 Dados suficientes para análise";

    }

}

atualizarPainel();

atualizarSequencia()
  ;function limparHistorico(){

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

}
