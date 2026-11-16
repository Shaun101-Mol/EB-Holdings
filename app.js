/* ===== EDIT THIS PART ONLY ===== */
const CONFIG={phone:"0728214859",email:"mustafashaun987.com",max:120};
// Optional: give a dress a name, category and price by its photo number. Others show as "Dress N".
const DRESS_INFO={
 // 1:{name:"Sunset Gown",cat:"Evening",price:"R1200"},
 // 2:{name:"Garden Party",cat:"Wedding guest",price:"R900"},
};
/* ===== END EDIT ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pg=document.body.dataset.page;
const L=[["index","Home"],["catering","Catering"],["dresses","Dresses"],["contact","Contact"]];
document.body.insertAdjacentHTML("afterbegin",`<div class="sw"></div><nav><div class="wrap"><a href="index.html"><img src="images/logo.jpg" alt="EB Holdings"></a>
<button class="burger" aria-label="Menu">☰</button><ul id="menu">${L.map(l=>`<li><a href="${l[0]}.html" class="${l[0]==pg?"on":""}">${l[1]}</a></li>`).join("")}<li><button class="bk" id="bk">Basket<b id="cnt">0</b></button></li></ul></div></nav>`);
document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap"><img src="images/logo.jpg" alt="EB Holdings"><div><a href="catering.html">Catering</a><a href="dresses.html">Dresses</a><a href="contact.html">Contact</a><br>© ${new Date().getFullYear()} EB Holdings</div></div></footer>
<div class="lb" id="lb"><button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><div id="lbc"></div><button class="n" aria-label="Next">›</button><div class="c" id="lbn"></div></div>
<aside class="dr" id="dr"><h3>Your basket</h3><ul id="bl"></ul><p style="font-size:13px;color:#666;margin:10px 0">Sends your list to us on WhatsApp. No payment yet.</p><button class="btn" id="send">Send on WhatsApp</button><button class="btn s" style="margin-top:8px;background:#fff;color:#1c1c1c;border-color:#1c1c1c" id="cl">Close</button></aside><div class="toast" id="toast"></div>`);
$(".burger").onclick=()=>$("#menu").classList.toggle("open");
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||a.target||/^(#|mailto|http)/.test(a.getAttribute("href")))return;e.preventDefault();document.body.classList.add("leave");setTimeout(()=>location.href=a.href,450)});
addEventListener("pageshow",()=>document.body.classList.remove("leave"));
const toast=t=>{const e=$("#toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",2600)};
const wa=t=>window.open(`https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(t)}`,"_blank");
let mem=[];const get=()=>{try{return JSON.parse(localStorage.getItem("eb")||"[]")}catch(e){return mem}};
const set=a=>{mem=a;try{localStorage.setItem("eb",JSON.stringify(a))}catch(e){}draw()};
const add=i=>{const a=get();if(a.includes(i))return toast("Already in your basket");a.push(i);set(a);toast("Added: "+i)};
const text=()=>"Hi EB Holdings, I'd like to enquire about:\n"+get().map(x=>"- "+x).join("\n");
function draw(){const a=get();$("#cnt").textContent=a.length;$("#bl").innerHTML=a.length?a.map((x,i)=>`<li>${x}<button data-i="${i}">Remove</button></li>`).join(""):"<li>Nothing yet. Add dresses or catering packages.</li>"}
$("#bk").onclick=()=>$("#dr").classList.add("on");$("#cl").onclick=()=>$("#dr").classList.remove("on");
$("#bl").onclick=e=>{const i=e.target.dataset.i;if(i!=null){const a=get();a.splice(i,1);set(a)}};
$("#send").onclick=()=>get().length?wa(text()):toast("Your basket is empty");draw();
// Lightbox
let items=[],cur=0;const lb=$("#lb");
function show(i){cur=(i+items.length)%items.length;const it=items[cur];$("#lbc").innerHTML=it.src?`<img src="${it.src}" alt="${it.label}">`:`<div class="tile t"><span>${it.label}</span></div>`;$("#lbn").textContent=`${it.label}  (${cur+1} of ${items.length})`;lb.classList.add("on")}
lb.onclick=e=>{if(e.target.matches(".x,#lb"))lb.classList.remove("on");if(e.target.matches(".p"))show(cur-1);if(e.target.matches(".n"))show(cur+1)};
addEventListener("keydown",e=>{if(!lb.classList.contains("on"))return;if(e.key=="Escape")lb.classList.remove("on");if(e.key=="ArrowLeft")show(cur-1);if(e.key=="ArrowRight")show(cur+1)});
let sx=0;lb.ontouchstart=e=>sx=e.touches[0].clientX;lb.ontouchend=e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))};
// Auto-detect every photo: images/<dir>/1.jpg, 2.jpg ...
async function probe(dir){const E=["jpg","jpeg","png","webp","JPG","JPEG","PNG"];const r=await Promise.all(Array.from({length:CONFIG.max},(_,i)=>new Promise(res=>{let k=0;const t=()=>{if(k>=E.length)return res(0);const im=new Image();im.onload=()=>res([i+1,E[k]]);im.onerror=()=>{k++;t()};im.src=`images/${dir}/${i+1}.${E[k]}`};t()})));return r.filter(Boolean)}
const tile=(src,label,i)=>{const d=document.createElement("div");d.className="tile";d.tabIndex=0;d.innerHTML=(src?`<img loading="lazy" src="${src}" alt="${label}">`:"")+`<span>${label}</span>`;d.onclick=()=>show(i);d.onkeydown=e=>e.key=="Enter"&&show(i);return d};
async function gallery(el,dir,isDress){
 let nums=await probe(dir),ph=!nums.length;if(ph)nums=[[1,"jpg"],[2,"jpg"],[3,"jpg"],[4,"jpg"],[5,"jpg"],[6,"jpg"]];
 const all=nums.map(([n,x])=>{const f=DRESS_INFO[n]||{};return{src:ph?"":`images/${dir}/${n}.${x}`,label:isDress?(f.name||"Dress "+n):(ph?"Photo coming soon":"Catering "+n),cat:f.cat||"",price:f.price||"",n}});
 let view=all,shown=0;const STEP=12;
 const more=document.createElement("div");more.className="more";more.innerHTML='<button class="btn">Show more photos</button>';
 const next=()=>{view.slice(shown,shown+STEP).forEach((it,k)=>{const t=tile(it.src,it.label,shown+k);if(isDress){const c=document.createElement("div");c.className="card";c.appendChild(t);const i=document.createElement("div");i.className="i";i.innerHTML=`<h3>${it.label}</h3><small>${it.cat||"Dress"}</small><b>${it.price||"Price on request"}</b><button class="btn s">Add to basket</button>`;i.querySelector("button").onclick=()=>add(it.label+(it.src?` (photo ${it.n})`:""));c.appendChild(i);el.appendChild(c)}else el.appendChild(t)});shown+=STEP;more.style.display=shown<view.length?"block":"none"};
 const draw2=()=>{el.innerHTML="";shown=0;items=view;next()};
 el.after(more);more.onclick=()=>{next();items=view};draw2();
 if(isDress){const cats=[...new Set(all.map(a=>a.cat).filter(Boolean))];if(cats.length){const f=$("#filters");["All",...cats].forEach(c=>{const b=document.createElement("button");b.className="tab";b.textContent=c;b.onclick=()=>{$$(".tab",f).forEach(x=>x.setAttribute("aria-selected",x==b));view=c=="All"?all:all.filter(a=>a.cat==c);draw2()};f.appendChild(b)});const want=new URLSearchParams(location.search).get("cat");($$(".tab",f).find(b=>b.textContent==want)||f.firstChild).click()}}
 const cnt=$("#count");if(cnt&&!ph)cnt.textContent=all.length+" pieces";
}
if($("#cg"))gallery($("#cg"),"catering",false);
if($("#dg"))gallery($("#dg"),"dresses",true);
// Catering package tabs
if($("#tabs")){const P={"Weddings":["Full-service buffet or plated meals","Cake table and dessert bar","Staff, setup and clean-up"],"Corporate":["Breakfast and lunch boxes","Boardroom platters","Weekly standing orders"],"Parties":["Finger food and braai platters","Kids' party menus","Drinks and dessert add-ons"]};
 const sel=n=>{$$(".tab",$("#tabs")).forEach(b=>b.setAttribute("aria-selected",b.textContent==n));$("#panel").innerHTML=`<div><h3>${n} catering</h3><p style="margin:8px 0 16px">Tell us your date and guest count and we'll send a tailored quote.</p><button class="btn">Add to basket</button></div><ul>${P[n].map(x=>`<li>${x}</li>`).join("")}</ul>`;$("#panel .btn").onclick=()=>add(n+" catering")};
 Object.keys(P).forEach(n=>{const b=document.createElement("button");b.className="tab";b.textContent=n;b.onclick=()=>sel(n);$("#tabs").appendChild(b)});sel("Weddings")}
// Event Matcher
if($("#quiz")){const M={"A wedding":["Wedding catering","Wedding guest"],"A work event":["Corporate catering","Evening"],"A birthday":["Party catering","Evening"],"A dinner out":["","Evening"]};
 Object.keys(M).forEach(k=>{const b=document.createElement("button");b.className="opt";b.textContent=k;b.onclick=()=>{$$(".opt").forEach(x=>x.setAttribute("aria-pressed",x==b));const[c,d]=M[k];const r=$("#res");r.className="res on";r.innerHTML=`<h3>Your ${k.toLowerCase().replace("a ","")} sorted</h3><p>${c?`Food: our <b>${c}</b> package.<br>`:""}Outfit: browse our <b>${d}</b> dresses.</p><div class="row">${c?'<button class="btn" id="qa">Add catering to basket</button>':""}<a class="btn g" href="dresses.html?cat=${encodeURIComponent(d)}">See dresses</a></div>`;if(c)$("#qa").onclick=()=>add(c)};$("#opts").appendChild(b)})}
// Contact
if($("#form"))$("#form").onsubmit=e=>{e.preventDefault();wa(`Hi EB Holdings, my name is ${$("#n").value}.\nAbout: ${$("#t").value}\nDate: ${$("#d").value||"not set"}\nGuests: ${$("#g").value||"n/a"}\nDetails: ${$("#m").value}`+(get().length?"\n\n"+text():""));toast("Opening WhatsApp. Press send there.")};
if($("#em"))$("#em").innerHTML=`<a href="mailto:${CONFIG.email}" style="color:#d9650f;font-weight:700">${CONFIG.email}</a>`;
