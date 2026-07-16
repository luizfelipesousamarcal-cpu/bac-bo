let history = [];

let player = 0;
let banker = 0;
let tie = 0;

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx,{
    type:"bar",
    data:{
        labels:["Player","Banker","Tie"],
        datasets:[{
            label:"Resultados",
            data:[0,0,0]
        }]
    }
});

function addResult(result){

    history.unshift(result);

    if(result==="PLAYER") player++;
    if(result==="BANKER") banker++;
    if(result==="TIE") tie++;

    document.getElementById("player").innerText = player;
    document.getElementById("banker").innerText = banker;
    document.getElementById("tie").innerText = tie;

    chart.data.datasets[0].data=[player,banker,tie];
    chart.update();

    const list=document.getElementById("history");

    const item=document.createElement("li");
    item.innerText=result;

    list.prepend(item);

    if(list.children.length>30){
        list.removeChild(list.lastChild);
    }
}function atualizarAnalise(){

    const total = history.length;

    document.getElementById("analiseRodadas").innerText = total;

    document.getElementById("ultimosResultados").innerText =
        history.slice(0,10).join(" ");

    let p = total ? (player/total*100).toFixed(1) : 0;
    let b = total ? (banker/total*100).toFixed(1) : 0;
    let t = total ? (tie/total*100).toFixed(1) : 0;

    document.getElementById("playerPercent").innerText = p+"%";
    document.getElementById("bankerPercent").innerText = b+"%";
    document.getElementById("tiePercent").innerText = t+"%";

    let seq = 1;

    if(total>0){

        let ultimo = history[0];

        for(let i=1;i<history.length;i++){

            if(history[i]===ultimo){
                seq++;
            }else{
                break;
            }

        }

        document.getElementById("sequenciaAtual").innerText =
            seq+" "+ultimo;

        if(seq>=4){

            document.getElementById("statusAnalise").innerText =
            "🟡 Sequência longa observada";

        }else if(total>=30){

            document.getElementById("statusAnalise").innerText =
            "🟢 Dados suficientes para análise";

        }else{

            document.getElementById("statusAnalise").innerText =
            "⚪ Coletando mais dados";

        }

    }

           }
