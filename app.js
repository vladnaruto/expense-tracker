
const categories=['Їжа','Транспорт','Страхування','Тварини','Квартира','Комунальні','Розваги','Інше'];
let currentCategory='', editId=null;

function showTab(id){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.getElementById(id).classList.add('active');}
function getData(){return JSON.parse(localStorage.getItem('expenses')||'[]')}
function setData(d){localStorage.setItem('expenses',JSON.stringify(d))}

const cats=document.getElementById('cats');
categories.forEach(c=>{
 let b=document.createElement('button');
 b.textContent=c;
 b.onclick=()=>{currentCategory=c;catTitle.textContent=c;form.classList.remove('hidden');}
 cats.appendChild(b);
});

function saveExpense(){
 let d=getData();
 const amount=parseFloat(amountEl.value);
 if(!amount) return;
 const obj={id:editId||Date.now(),category:currentCategory,amount,comment:commentEl.value,date:new Date().toISOString()};
 if(editId){d=d.map(x=>x.id===editId?obj:x);editId=null;} else d.unshift(obj);
 setData(d); amountEl.value=''; commentEl.value=''; render();
}
const amountEl=document.getElementById('amount');
const commentEl=document.getElementById('comment');

function render(){
 const data=getData(), now=new Date();
 let today=0,week=0,month=0;
 list.innerHTML='';
 data.forEach(e=>{
  const d=new Date(e.date);
  if(d.toDateString()==now.toDateString()) today+=e.amount;
  if((now-d)/86400000<=7) week+=e.amount;
  if(d.getMonth()==now.getMonth()&&d.getFullYear()==now.getFullYear()) month+=e.amount;
  const row=document.createElement('div');
  row.className='item';
  row.innerHTML=`<span>${e.category} - ${e.amount.toFixed(2)}€</span>
  <span><button onclick="editExpense(${e.id})">✏️</button><button onclick="delExpense(${e.id})">🗑️</button></span>`;
  list.appendChild(row);
 });
 todayEl.textContent=today.toFixed(2)+'€';
 weekEl.textContent=week.toFixed(2)+'€';
 monthEl.textContent=month.toFixed(2)+'€';
}
function editExpense(id){const e=getData().find(x=>x.id===id);editId=id;currentCategory=e.category;amountEl.value=e.amount;commentEl.value=e.comment;showTab('categories');form.classList.remove('hidden');}
function delExpense(id){setData(getData().filter(x=>x.id!==id));render();}
function setTheme(t){localStorage.setItem('theme',t);document.body.className=t==='dark'?'dark':'';}
if(localStorage.getItem('theme')==='dark') document.body.className='dark';
render();
