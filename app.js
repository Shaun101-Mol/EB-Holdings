const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pg=document.body.dataset.page,C=CONFIG,cache={};
const st=k=>({get(){if(cache[k])return cache[k];try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}},set(v){cache[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}});
const BK=st("eb"),FV=st("ebf");
const L=[["index","Home"],["catering","Catering"],["dresses","Dresses"],["contact","Contact"]];
document.body.insertAdjacentHTML("afterbegin",`<nav><div class="wrap"><a href="index.html"><img src="images/logo.jpg" alt="EB Holdings"></a><button class="burger" aria-label="Menu">☰</button><ul id="menu">${L.map(l=>`<li><a href="${l[0]}.html" class="${l[0]==pg?"on":""}">${l[1]}</a></li>`).join("")}<li><button class="bk" id="bk">Basket<b id="cnt">0</b></button></li></ul></div><div class="pg" id="pg"></div></nav>`);
document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap"><img src="images/logo.jpg" alt="EB Holdings"><div><a href="catering.html">Catering</a><a href="dresses.html">Dresses</a><a href="contact.html">Contact</a><br>${C.hours}<br>${C.area}<br>© ${new Date().getFullYear()} EB Holdings</div></div></footer>
<button class="fab" id="fab">Chat with us</button>
<div class="lb" id="lb"><button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><div id="lbc"></div><button class="n" aria-label="Next">›</button><div class="c" id="lbn"></div></div>
<aside class="dr" id="dr"><h3>Your basket</h3><ul id="bl"></ul><p style="font-size:13px;color:#666;margin:10px 0">Sends your list to us on WhatsApp. No payment yet.</p><button class="btn" id="send">Send on WhatsApp</button><button class="btn s" style="margin-top:8px;background:#fff;color:#1c1c1c;border-color:#1c1c1c" id="cl">Close</button></aside><div class="toast" id="toast"></div>`);
$(".burger").onclick=()=>$("#menu").classList.toggle("open");
addEventListener("scroll",()=>$("#pg").style.width=scrollY/((document.documentElement.scrollHeight-innerHeight)||1)*100+"%",{passive:true});
const toast=t=>{const e=$("#toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",2600)};
const wa=t=>window.open(`https://wa.me/${C.phone}?text=${encodeURIComponent(t)}`,"_blank");
$("#fab").onclick=()=>wa("Hi EB Holdings! ");
// ---- Loading screen ----
const ld=$("#ld"),LT={index:"Welcome home",catering:"Setting the table",dresses:"Steaming the dresses",contact:"Opening the line"};
const setT=p=>$("#ldt").textContent=LT[p]||"Loading",prog=v=>{$("#ldp").textContent=v+"%";$("#ldb").style.width=v+"%"};
const openLd=()=>ld.classList.add("open");
function count(done,v=0){const iv=setInterval(()=>{v=Math.min(100,v+Math.ceil(Math.random()*14)+4);prog(v);if(v>=100){clearInterval(iv);setTimeout(done,150)}},60)}
let from=null;try{from=sessionStorage.getItem("ebd");sessionStorage.removeItem("ebd")}catch(e){}
setT(from||pg);
if(from){prog(100);setTimeout(openLd,450)}else count(()=>document.readyState=="complete"?openLd():addEventListener("load",openLd));
setTimeout(openLd,4500);addEventListener("pageshow",e=>e.persisted&&openLd());
ld.addEventListener("pointerdown",e=>{for(let i=0;i<10;i++){const s=document.createElement("i");s.className="sp";s.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;--dx:${(Math.random()-.5)*180}px;--dy:${-60-Math.random()*160}px`;ld.appendChild(s);setTimeout(()=>s.remove(),900)}});
ld.addEventListener("pointermove",e=>$("#mid").style.transform=`translate(${(e.clientX/innerWidth-.5)*34}px,${(e.clientY/innerHeight-.5)*34}px)`);
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||a.target||/^(#|mailto|http)/.test(a.getAttribute("href")))return;e.preventDefault();const h=a.getAttribute("href");if(ld.classList.contains("busy"))return;ld.classList.add("busy");ld.classList.remove("open");prog(0);setT(h.split(".")[0].split("?")[0]);try{sessionStorage.setItem("ebd",h.split(".")[0].split("?")[0])}catch(_){}count(()=>location.href=h)});
// ---- Basket ----
const add=i=>{const a=BK.get().slice();if(a.includes(i))return toast("Already in your basket");a.push(i);BK.set(a);draw();toast("Added: "+i)};
const text=()=>"Hi EB Holdings, I'd like to enquire about:\n"+BK.get().map(x=>"- "+x).join("\n");
function draw(){const a=BK.get();$("#cnt").textContent=a.length;$("#bl").innerHTML=a.length?a.map((x,i)=>`<li>${x}<button data-i="${i}">Remove</button></li>`).join(""):"<li>Nothing yet. Add dresses or catering packages.</li>"}
$("#bk").onclick=()=>$("#dr").classList.add("on");$("#cl").onclick=()=>$("#dr").classList.remove("on");
$("#bl").onclick=e=>{const i=e.target.dataset.i;if(i!=null){const a=BK.get().slice();a.splice(i,1);BK.set(a);draw()}};
$("#send").onclick=()=>BK.get().length?wa(text()):toast("Your basket is empty");draw();
// ---- Lightbox with slideshow ----
let items=[],cur=0,tm=null;const lb=$("#lb");
const stop=()=>{clearInterval(tm);tm=null};
function show(i){cur=(i+items.length)%items.length;const it=items[cur];$("#lbc").innerHTML=it.src?`<img src="${it.src}" alt="${it.label}">`:`<div class="tile t"><span>${it.label}</span></div>`;$("#lbn").innerHTML=`${it.label} (${cur+1} of ${items.length})<br>${it.dress?'<button id="lba">Add to basket</button>':""}<button id="lbp">${tm?"Pause":"Play slideshow"}</button>`;lb.classList.add("on");
 if(it.dress)$("#lba").onclick=()=>add(it.label+(it.src?` (photo ${it.n})`:""));
 $("#lbp").onclick=()=>{if(tm){stop()}else tm=setInterval(()=>show(cur+1),2500);show(cur)}}
lb.onclick=e=>{if(e.target.matches(".x,#lb")){lb.classList.remove("on");stop()}if(e.target.matches(".p"))show(cur-1);if(e.target.matches(".n"))show(cur+1)};
addEventListener("keydown",e=>{if(!lb.classList.contains("on"))return;if(e.key=="Escape"){lb.classList.remove("on");stop()}if(e.key=="ArrowLeft")show(cur-1);if(e.key=="ArrowRight")show(cur+1)});
let sx=0;lb.ontouchstart=e=>sx=e.touches[0].clientX;lb.ontouchend=e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))};
// ---- Galleries ----
const IMG=s=>`<img loading="lazy" decoding="async" onerror="(this.closest('.card')||this.parentNode).remove()" src="${s}" alt="">`;
const tile=(it,i)=>{const d=document.createElement("div");d.className="tile";d.tabIndex=0;d.innerHTML=(it.src?IMG(it.src):"")+`<span>${it.label}</span>`;d.onclick=()=>show(i);d.onkeydown=e=>e.key=="Enter"&&show(i);return d};
function gallery(el,dir,isDress){
 const cf=C[dir],ph=!cf.count;
 const all=Array.from({length:ph?6:cf.count},(_,i)=>{const n=i+1,f=isDress?(DRESS_INFO[n]||{}):{};return{n,dress:isDress,src:ph?"":`images/${dir}/${n}.${cf.ext}`,label:isDress?(f.name||"Dress "+n):(ph?"Photo coming soon":"Catering "+n),cat:f.cat||"",price:f.price||""}});
 let view=all,shown=0,cat="All",favOnly=false;const STEP=12;
 const more=document.createElement("div");more.className="more";more.innerHTML='<button class="btn">Show more photos</button>';el.after(more);
 const card=(it,i)=>{const c=document.createElement("div");c.className="card";c.appendChild(tile(it,i));
  const h=document.createElement("button");h.className="hrt";h.setAttribute("aria-label","Favourite");h.textContent=FV.get().includes(it.n)?"♥":"♡";
  h.onclick=()=>{let a=FV.get();a=a.includes(it.n)?a.filter(x=>x!=it.n):[...a,it.n];FV.set(a);h.textContent=a.includes(it.n)?"♥":"♡";if(favOnly)apply()};c.appendChild(h);
  const d=document.createElement("div");d.className="i";d.innerHTML=`<h3>${it.label}</h3><small>${it.cat||"Dress"}</small><b>${it.price||"Price on request"}</b><div class="r"><select aria-label="Size">${C.sizes.map(s=>`<option>${s}</option>`).join("")}</select><button class="btn s">Add to basket</button></div>`;
  d.querySelector("button").onclick=()=>add(`${it.label}${it.src?" (photo "+it.n+")":""}, size ${d.querySelector("select").value}`);c.appendChild(d);return c};
 const next=()=>{view.slice(shown,shown+STEP).forEach((it,k)=>el.appendChild(isDress?card(it,shown+k):tile(it,shown+k)));shown+=STEP;more.style.display=shown<view.length?"block":"none"};
 const redraw=()=>{el.innerHTML="";shown=0;items=view;next();if(!view.length)el.innerHTML='<p style="color:#ccc">No dresses match. Clear the search or filters.</p>'};
 more.onclick=next;
 const apply=()=>{const q=$("#q").value.toLowerCase(),so=$("#so").value;let v=all.filter(a=>(cat=="All"||a.cat==cat)&&a.label.toLowerCase().includes(q)&&(!favOnly||FV.get().includes(a.n)));v=so=="a"?v.sort((a,b)=>a.label.localeCompare(b.label)):v.sort((a,b)=>b.n-a.n);view=v;redraw()};
 if(!isDress){redraw();return}
 $("#q").oninput=apply;$("#so").onchange=apply;$("#fv").onclick=()=>{favOnly=!favOnly;$("#fv").setAttribute("aria-selected",favOnly);apply()};
 const cats=[...new Set(all.map(a=>a.cat).filter(Boolean))],f=$("#filters");
 if(cats.length)["All",...cats].forEach(c=>{const b=document.createElement("button");b.className="tab";b.textContent=c;b.onclick=()=>{$$(".tab",f).forEach(x=>x.setAttribute("aria-selected",x==b));cat=c;apply()};f.appendChild(b)});
 const want=new URLSearchParams(location.search).get("cat"),pre=$$(".tab",f).find(b=>b.textContent==want)||$(".tab",f);
 if(pre)pre.setAttribute("aria-selected",true),cat=pre.textContent;apply();
 if($("#count")&&!ph)$("#count").textContent=all.length+" pieces"}
if($("#cg"))gallery($("#cg"),"catering",false);
if($("#dg"))gallery($("#dg"),"dresses",true);
// ---- Home rails and hero tilt ----
function rail(el,dir){const cf=C[dir];if(!el||!cf.count)return;for(let n=cf.count;n>Math.max(0,cf.count-10);n--){const a=document.createElement("a");a.className="tile";a.href=dir+".html";a.innerHTML=IMG(`images/${dir}/${n}.${cf.ext}`)+`<span>${dir=="dresses"?(DRESS_INFO[n]?.name||"Dress "+n):"Catering"}</span>`;el.appendChild(a)}}
rail($("#rc"),"catering");rail($("#rd"),"dresses");
const lc=$(".logocard");if(lc)$(".hero").onmousemove=e=>lc.style.transform=`rotate(-2deg) perspective(700px) rotateY(${(e.clientX/innerWidth-.5)*12}deg) rotateX(${(.5-e.clientY/innerHeight)*10}deg)`;
// ---- Catering tabs and estimator ----
if($("#tabs")){const P={"Weddings":["Full-service buffet or plated meals","Cake table and dessert bar","Staff, setup and clean-up"],"Corporate":["Breakfast and lunch boxes","Boardroom platters","Weekly standing orders"],"Parties":["Finger food and braai platters","Kids' party menus","Drinks and dessert add-ons"]};
 const sel=n=>{$$(".tab",$("#tabs")).forEach(b=>b.setAttribute("aria-selected",b.textContent==n));$("#panel").innerHTML=`<div><h3>${n} catering</h3><p style="margin:8px 0 16px">Tell us your date and guest count and we'll send a tailored quote.</p><button class="btn">Add to basket</button></div><ul>${P[n].map(x=>`<li>${x}</li>`).join("")}</ul>`;$("#panel .btn").onclick=()=>add(n+" catering")};
 Object.keys(P).forEach(n=>{const b=document.createElement("button");b.className="tab";b.textContent=n;b.onclick=()=>sel(n);$("#tabs").appendChild(b)});sel("Weddings")}
if($("#gs")){let tier=Object.keys(C.tiers)[1]||Object.keys(C.tiers)[0];const ex=new Set(),fm=n=>C.currency+n.toLocaleString();
 const calc=()=>{const g=+$("#gs").value,pp=C.tiers[tier]+[...ex].reduce((s,k)=>s+C.extras[k],0),tot=g*pp;$("#gv").textContent=g;
  $("#est").innerHTML=`<h3>About ${fm(tot)}</h3><p>${g} guests, ${tier} menu${ex.size?", plus "+[...ex].join(", "):""}. That's about ${fm(pp)} per guest.</p><div class="row"><button class="btn" id="eq">Add estimate to basket</button></div>`;
  $("#eq").onclick=()=>add(`Catering estimate: ${g} guests, ${tier}${ex.size?" + "+[...ex].join(", "):""} (about ${fm(tot)})`)};
 Object.keys(C.tiers).forEach(t=>{const b=document.createElement("button");b.className="opt";b.textContent=`${t} (${C.currency}${C.tiers[t]} each)`;b.setAttribute("aria-pressed",t==tier);b.onclick=()=>{tier=t;$$(".opt",$("#tiers")).forEach(x=>x.setAttribute("aria-pressed",x==b));calc()};$("#tiers").appendChild(b)});
 Object.keys(C.extras).forEach(k=>{const l=document.createElement("label");l.innerHTML=`<input type="checkbox"> ${k} (+${C.currency}${C.extras[k]} each)`;l.firstChild.onchange=e=>{e.target.checked?ex.add(k):ex.delete(k);calc()};$("#ext").appendChild(l)});
 $("#gs").oninput=calc;calc()}
// ---- Event matcher ----
if($("#quiz")){const M={"A wedding":["Wedding catering","Wedding guest"],"A work event":["Corporate catering","Evening"],"A birthday":["Party catering","Evening"],"A dinner out":["","Evening"]};
 Object.keys(M).forEach(k=>{const b=document.createElement("button");b.className="opt";b.textContent=k;b.onclick=()=>{$$(".opt").forEach(x=>x.setAttribute("aria-pressed",x==b));const[c,d]=M[k];const r=$("#res");r.className="res on";r.innerHTML=`<h3>Your ${k.toLowerCase().replace("a ","")} sorted</h3><p>${c?`Food: our <b>${c}</b> package.<br>`:""}Outfit: browse our <b>${d}</b> dresses.</p><div class="row">${c?'<button class="btn" id="qa">Add catering to basket</button>':""}<a class="btn g" href="dresses.html?cat=${encodeURIComponent(d)}">See dresses</a></div>`;if(c)$("#qa").onclick=()=>add(c)};$("#opts").appendChild(b)})}
// ---- Contact ----
if($("#form")){$("#hrs").textContent=C.hours;$("#ar").textContent=C.area;$("#form").onsubmit=e=>{e.preventDefault();wa(`Hi EB Holdings, my name is ${$("#n").value}.\nAbout: ${$("#t").value}\nDate: ${$("#d").value||"not set"}\nGuests: ${$("#g").value||"n/a"}\nDetails: ${$("#m").value}`+(BK.get().length?"\n\n"+text():""));toast("Opening WhatsApp. Press send there.")}}
if($("#em"))$("#em").innerHTML=`<a href="mailto:${C.email}" style="color:#d9650f;font-weight:700">${C.email}</a>`;
