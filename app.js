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
