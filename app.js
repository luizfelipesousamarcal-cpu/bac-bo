let history = JSON.parse(localStorage.getItem("history")) || [];

let player = 0;
let banker = 0;
let tie = 0;

history.forEach(resultado => {

    if(resultado === "PLAYER") player++;

    if(resultado === "BANKER") banker++;

    if(resultado === "TIE") tie++;

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

function salvarDados(){

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}

function atualizarGrafico(){

    chart.data.datasets[0].data=[
        player,
        banker,
        tie
    ];

    chart.update();

}function atualizarPainel(){

    document.getElementById("player").innerText = player;
    document.getElementById("banker").innerText = banker;
    document.getElementById("tie").innerText = tie;

    atualizarGrafico();

    const lista = document.getElementById("history");

    lista.innerHTML = "";

    history.slice(0,30).forEach(resultado=>{

        const li = document.createElement("li");

        li.innerText = resultado;

        lista.appendChild(li);

    });

    const rodadas = document.getElementById("analiseRodadas");

    if(rodadas){

        rodadas.innerText = history.length;

    }

}

function addResult(resultado){

    history.unshift(resultado);

    if(resultado==="PLAYER") player++;

    if(resultado==="BANKER") banker++;

    if(resultado==="TIE") tie++;

    salvarDados();

    atualizarPainel();

    atualizarSequencia();

}function atualizarSequencia(){

    const status = document.getElementById("statusAnalise");
    const sequencia = document.getElementById("sequenciaAtual");

    if(history.length === 0){

        if(sequencia) sequencia.innerText = "-";
        if(status) status.innerText = "⚪ Nenhum resultado registrado";

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

    if(sequencia){
        sequencia.innerText = contador + " " + atual;
    }

    if(status){

        if(history.length < 20){

            status.innerText = "🟡 Coletando dados...";

        }else{

            status.innerText = "🟢 Sessão em andamento";

        }

    }

}

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

}

atualizarPainel();
atualizarSequencia();
