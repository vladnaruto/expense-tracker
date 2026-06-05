
const categories=[
["🍔","Їжа"],["🚗","Транспорт"],["🛡️","Страхування"],["🐾","Тварини"],
["🏠","Квартира"],["💡","Комунальні"],["🎮","Розваги"],["📦","Інше"]
];
let currentCategory="";
let editId=null;

const cats=document.getElementById("cats");
categories.forEach(c=>{
 let b=document.createElement("button");
 b.innerText=c[0]+" "+c[1];
 b.onclick=()=>{currentCategory=c[1];document.getElementById("catTitle").innerText=c[0]+" "+c[1];document.getElementById("form").classList.remove("hidden");}
 cats.appendChild(b);
});

function getData(){return JSON.parse(localStorage.getItem("expenses")||"[]");}
function setData(d){localStorage.setItem("expenses",JSON.stringify(d));}

function saveExpense(){
 const amount=parseFloat(document.getElementById("amount").value);
 if(!amount)return;
 const comment=document.getElementById("comment").value;
 let data=getData();

 if(editId){
   const i=data.findIndex(x=>x.id===editId);
   data[i]={...data[i],amount,comment,category:currentCategory};
   editId=null;
 } else {
   data.unshift({id:Date.now(),amount,comment,category:currentCategory,date:new Date().toISOString()});
 }
 setData(data);
 document.getElementById("amount").value="";
 document.getElementById("comment").value="";
 render();
}

function render(){
 const data=getData();
 const list=document.getElementById("list");
 list.innerHTML="";
 let today=0,week=0,month=0;
 const now=new Date();

 data.forEach(e=>{
   const d=new Date(e.date);
   if(d.toDateString()===now.toDateString()) today+=e.amount;
   if((now-d)/(1000*60*60*24)<=7) week+=e.amount;
   if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()) month+=e.amount;

   const row=document.createElement("div");
   row.className="item";
   row.innerHTML=`<div><b>${e.category}</b><br>${e.comment||""}</div>
   <div>${e.amount.toFixed(2)} €
   <span class="small">
   <button onclick="editExpense(${e.id})">✏️</button>
   <button onclick="deleteExpense(${e.id})">🗑️</button>
   </span></div>`;
   list.appendChild(row);
 });

 document.getElementById("today").innerText=today.toFixed(2)+" €";
 document.getElementById("week").innerText=week.toFixed(2)+" €";
 document.getElementById("month").innerText=month.toFixed(2)+" €";
}

function deleteExpense(id){
 setData(getData().filter(x=>x.id!==id));
 render();
}

function editExpense(id){
 const e=getData().find(x=>x.id===id);
 editId=id;
 currentCategory=e.category;
 document.getElementById("amount").value=e.amount;
 document.getElementById("comment").value=e.comment;
 document.getElementById("form").classList.remove("hidden");
}

render();
