/* Växtlighetsguide 3.0 – lokal prototyp */
const STORAGE_KEY="vaxtlighetsguide.v3";
const LEGACY_KEYS=["vaxtencyklopedin.v1","vaxtligt-talat.v2"];
const initial={
 sources:[
  {id:"src-grona",title:"Grönatakhandboken – Växtbädd och Vegetation",publisher:"AB Svensk Byggtjänst",year:"2021",edition:"Andra utgåvan",isbn:"978-91-7917-072-1",type:"Kursmaterial",url:"",note:"Används för uppgifter om växtbäddar och vegetation på gröna tak. Kontrollera titelblad och sidangivelser mot originalet."},
  {id:"src-skud",title:"Svensk Kulturväxtdatabas (SKUD)",publisher:"SKUD / Blomsterlandet",type:"Extern källa",url:"https://skud.blomsterlandet.se/",note:"Nomenklaturreferens. Återanvänd inte databasposter utan att kontrollera villkor."},
  {id:"src-movium",title:"Movium Plantarum",publisher:"SLU Movium",type:"Extern källa",url:"https://plantarum.slu.se/",note:"Professionell växtdatabas. Använd som referens; kopiera inte skyddade texter eller bilder."},
  {id:"src-genbank",title:"SLU Nationella genbanken för trädgårdsväxter",publisher:"Sveriges lantbruksuniversitet",type:"Extern källa",url:"https://www.slu.se/nationellagenbanken/",note:"Referens för bevarade kulturväxter, sorter och kulturhistoria."}
 ],
 plants:[
  {id:"p-forsythia",swedish:"Forsythia",latin:"Forsythia × intermedia",category:"Buskar",status:"needs_sources",intro:"Registerpost påbörjad. Odlingsuppgifter, sortvariationer och härdighet ska kompletteras med kontrollerade källor.",sources:[]},
  {id:"p-paradisbuske",swedish:"Paradisbuske",latin:"Kolkwitzia amabilis",category:"Buskar",status:"needs_sources",intro:"Registerpost påbörjad. Höjd, bredd, blomning och beskärningsråd ska verifieras för svenskt odlingssammanhang.",sources:[]},
  {id:"p-rosenskara",swedish:"Rosenskära",latin:"Cosmos bipinnatus",category:"Annueller",status:"needs_sources",intro:"Registerpost påbörjad. Såtid, groning, blomning och odlingsråd ska dokumenteras med källa.",sources:[]},
  {id:"p-ringblomma",swedish:"Ringblomma",latin:"Calendula officinalis",category:"Annueller",status:"needs_sources",intro:"Registerpost påbörjad. Sådd, blomning, användning och självsådd ska kompletteras med källor.",sources:[]},
  {id:"p-fingerborgsblomma",swedish:"Fingerborgsblomma",latin:"Digitalis purpurea",category:"Tvååriga",status:"needs_sources",intro:"Registerpost påbörjad. Livscykel, frösådd, ståndort och giftighet ska verifieras.",sources:[]},
  {id:"p-tuvror",swedish:"Tuvrör",latin:"Calamagrostis × acutiflora",category:"Prydnadsgräs",status:"needs_sources",intro:"Registerpost påbörjad. Sorter, höjd, ståndort och vinterstruktur ska kompletteras.",sources:[]}
 ]
};
let db=loadDB(),editor=false,selected=null,compareIds=[],listIds=loadList();
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const statusText=s=>s==="verified"?"Källgranskad":s==="needs_sources"?"Källa saknas":"Utkast";
function loadList(){try{return JSON.parse(localStorage.getItem("vaxtlighetsguide.v3.list")||"[]")}catch{return []}}
function persistList(){localStorage.setItem("vaxtlighetsguide.v3.list",JSON.stringify(listIds));}
function loadDB(){
 try{
  const current=localStorage.getItem(STORAGE_KEY);if(current)return normalize(JSON.parse(current));
  for(const key of LEGACY_KEYS){const raw=localStorage.getItem(key);if(raw){const migrated=normalize(JSON.parse(raw));localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated));return migrated;}}
 }catch(e){console.warn("Kunde inte läsa sparad data",e);}
 return structuredClone(initial);
}
function normalize(data){return {sources:Array.isArray(data.sources)?data.sources:[],plants:Array.isArray(data.plants)?data.plants:[]};}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));render();}
function safeArray(v){return Array.isArray(v)?v:[];}
function currentFilters(){
 return {q:$("search").value.trim().toLocaleLowerCase("sv"),cat:$("categoryFilter").value,status:$("statusFilter").value,
 light:$("siteLight").value,moisture:$("siteMoisture").value,soil:$("siteSoil").value.toLocaleLowerCase("sv"),zone:$("siteZone").value};
}
function matches(p,f){
 if(f.cat&&p.category!==f.cat)return false;if(f.status&&p.status!==f.status)return false;
 const hay=[p.swedish,p.latin,p.category,p.intro,p.description,p.care,p.design,p.eco,p.soil,p.light].join(" ").toLocaleLowerCase("sv");
 if(f.q&&!hay.includes(f.q))return false;
 if(f.light&&!String(p.light||"").toLocaleLowerCase("sv").includes(f.light.toLocaleLowerCase("sv")))return false;
 if(f.moisture&&!String(p.moisture||"").toLocaleLowerCase("sv").includes(f.moisture.toLocaleLowerCase("sv")))return false;
 if(f.soil&&!String(p.soil||"").toLocaleLowerCase("sv").includes(f.soil))return false;
 if(f.zone&&!new RegExp(`(^|\\W)${f.zone}(\\W|$)`,"i").test(String(p.zone||"")))return false;
 return true;
}
function sortPlants(items){
 const mode=$("sortBy").value;return [...items].sort((a,b)=>{
  if(mode==="heightAsc"||mode==="heightDesc"){const x=Number(a.height)||Infinity,y=Number(b.height)||Infinity;return mode==="heightAsc"?x-y:y-x;}
  if(mode==="bloom"){const x=firstMonth(a.bloomMonths),y=firstMonth(b.bloomMonths);return x-y;}
  return a.swedish.localeCompare(b.swedish,"sv");
 });
}
function firstMonth(raw){const n=String(raw||"").split(/[,; ]+/).map(Number).filter(x=>x>=1&&x<=12);return n.length?Math.min(...n):99;}
function render(){
 $("plantCount").textContent=db.plants.length;$("sourceCount").textContent=db.sources.length;
 $("verifiedCount").textContent=db.plants.filter(p=>p.status==="verified").length;
 $("addPlant").classList.toggle("hidden",!editor);$("modeBadge").textContent=editor?"Redigering aktiv – lokalt":"Lokalt arbetsläge";
 const f=currentFilters(),list=sortPlants(db.plants.filter(p=>matches(p,f)));
 $("resultSummary").textContent=`Visar ${list.length} av ${db.plants.length} växtposter`;
 $("plantGrid").innerHTML=list.map(p=>`<article class="plant-card ${selected===p.id?"selected":""}" data-id="${esc(p.id)}">
  <label class="compare-pick"><input type="checkbox" data-compare="${esc(p.id)}" ${compareIds.includes(p.id)?"checked":""}> Jämför</label>
  <div class="plant-photo">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.swedish)}" loading="lazy">`:"❧"}</div>
  <div class="plant-card-body"><h3>${esc(p.swedish)}</h3><div class="latin">${esc(p.latin)}</div><div class="chips"><span class="chip">${esc(p.category)}</span><span class="status ${esc(p.status)}">${statusText(p.status)}</span></div></div></article>`).join("");
 $("empty").classList.toggle("hidden",list.length>0);
 document.querySelectorAll(".plant-card").forEach(card=>card.addEventListener("click",e=>{if(e.target.closest(".compare-pick"))return;showDetail(card.dataset.id)}));
 document.querySelectorAll("[data-compare]").forEach(cb=>cb.addEventListener("change",()=>toggleCompare(cb.dataset.compare,cb.checked)));
 renderBloomCalendar();renderCompare();renderSavedList();
}
function toggleCompare(id,on){
 if(on&&!compareIds.includes(id)){if(compareIds.length>=4){alert("Du kan jämföra högst fyra växter.");render();return;}compareIds.push(id);}
 if(!on)compareIds=compareIds.filter(x=>x!==id);renderCompare();renderCompareCount();
}
function renderCompareCount(){$("compareCount").textContent=compareIds.length?`${compareIds.length} av 4 valda.`:"Välj upp till fyra växter i registret.";}
function renderCompare(){
 const panel=$("comparePanel"),plants=compareIds.map(id=>db.plants.find(p=>p.id===id)).filter(Boolean);
 renderCompareCount();if(plants.length<2){panel.classList.add("hidden");panel.innerHTML="";return;}
 panel.classList.remove("hidden");
 const rows=[["Vetenskapligt namn",p=>p.latin],["Växtgrupp",p=>p.category],["Höjd",p=>p.height?`${p.height} cm`:"Ej angiven"],["Bredd",p=>p.width?`${p.width} cm`:"Ej angiven"],["Ljus",p=>p.light],["Markfukt",p=>p.moisture],["Jord",p=>p.soil],["Härdighet",p=>p.hardiness],["Zon – vedartade",p=>p.zone],["Blomning",p=>p.bloom],["Blomfärg",p=>p.flower],["Ekologiskt värde",p=>p.eco],["Källstatus",p=>statusText(p.status)]];
 panel.innerHTML=`<div class="compare-head"><b>Jämförelse · ${plants.length} växter</b><button class="textbtn" id="clearCompare">Rensa jämförelse</button></div><div class="compare-scroll"><table class="compare-table"><thead><tr><th>Egenskap</th>${plants.map(p=>`<th>${esc(p.swedish)}<small>${esc(p.latin)}</small></th>`).join("")}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><th>${label}</th>${plants.map(p=>`<td>${esc(get(p)||"Ej dokumenterat")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
 $("clearCompare").onclick=()=>{compareIds=[];render();};
}
function renderBloomCalendar(){
 const months=["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
 const counts=months.map((_,i)=>db.plants.filter(p=>String(p.bloomMonths||"").split(/[,; ]+/).map(Number).includes(i+1)).length);
 const max=Math.max(1,...counts);
 $("bloomCalendar").innerHTML=months.map((m,i)=>`<div class="month"><span>${m}</span><b>${counts[i]||"–"}</b><i style="--fill:${Math.round(counts[i]/max*100)}%"></i></div>`).join("");
 const total=counts.reduce((a,b)=>a+b,0);$("bloomSummary").textContent=`${total} registrerade växt–månadskopplingar`;
}
function renderSavedList(){
 const items=listIds.map(id=>db.plants.find(p=>p.id===id)).filter(Boolean);
 $("listCount").textContent=items.length;$("exportList").disabled=!items.length;
 $("savedList").innerHTML=items.length?items.map(p=>`<div class="saved-item"><span><b>${esc(p.swedish)}</b><br><i>${esc(p.latin)}</i></span><button data-remove-list="${esc(p.id)}" aria-label="Ta bort ${esc(p.swedish)}">Ta bort</button></div>`).join(""):'<p class="muted">Inga växter valda ännu. Lägg till via växtporträttet.</p>';
 document.querySelectorAll("[data-remove-list]").forEach(b=>b.onclick=()=>{listIds=listIds.filter(x=>x!==b.dataset.removeList);persistList();renderSavedList();});
}
function showDetail(id){
 selected=id;const p=db.plants.find(x=>x.id===id);if(!p)return;render();
 const refs=safeArray(p.sources).map(s=>{const src=db.sources.find(x=>x.id===s.sourceId);return src?`<div class="source-item"><b>${esc(src.title)}</b><br>${esc(s.chapter||"Avsnitt ej angivet")} · ${s.page?`Tryckt s. ${esc(s.page)}`:"tryckt sida ej verifierad"}${s.pdfPage?` · PDF s. ${esc(s.pdfPage)}`:""}<br>${esc(s.claim||"Påstående ej specificerat")}${src.url?`<br><a href="${esc(src.url)}" target="_blank" rel="noopener">Öppna källa ↗</a>`:""}</div>`:""}).join("");
 const inList=listIds.includes(p.id);
 $("detail").innerHTML=`${p.image?`<div class="detail-photo"><img src="${esc(p.image)}" alt="${esc(p.swedish)}"></div>`:""}<div class="detail-content">
 <small>${esc(p.category)} · ${statusText(p.status).toUpperCase()}</small><h2>${esc(p.swedish)}</h2><div class="latin">${esc(p.latin)}</div><p class="detail-intro">${esc(p.intro||"Introduktion saknas ännu.")}</p>
 <button class="btn ${inList?"ghost":"primary"} full" id="addToList">${inList?"✓ Tillagd i min växtlista":"+ Lägg till i min växtlista"}</button>
 <div class="data-grid">${[["Höjd",p.height?`${p.height} cm`:"Ej angiven"],["Bredd",p.width?`${p.width} cm`:"Ej angiven"],["Ljus",p.light],["Markfukt",p.moisture],["Jord",p.soil],["Härdighet",p.hardiness],["Zon (vedartad)",p.zone],["Blomning",p.bloom],["Blomfärg",p.flower]].map(([a,b])=>`<div class="datum"><span>${a}</span><b>${esc(b||"Ej angivet")}</b></div>`).join("")}</div>
 ${section("Botanisk beskrivning",p.description)}${section("Odling och skötsel",p.care)}${section("Gestaltning och användning",p.design)}${section("Ekologiskt värde",p.eco)}
 ${relationSection("Positiva växtrelationer",p.goodCompanions,"good")}${relationSection("Olämpliga växtrelationer",p.badCompanions,"bad")}
 <div class="detail-section"><h4>Källor och verifiering</h4>${refs||"<p>Ingen källhänvisning registrerad. Uppgifterna ska inte betraktas som verifierade.</p>"}</div>
 ${editor?'<button class="btn primary full" id="editCurrent">Redigera växtpost</button>':""}</div>`;
 $("addToList").onclick=()=>{if(!listIds.includes(id))listIds.push(id);persistList();renderSavedList();showDetail(id);};
 if(editor)$("editCurrent").onclick=()=>openForm(p);
}
function section(title,value){return `<div class="detail-section"><h4>${title}</h4><p>${esc(value||"Ej dokumenterat ännu.")}</p></div>`;}
function relationSection(title,raw,kind){const rows=String(raw||"").split("\n").map(x=>x.trim()).filter(Boolean);return `<div class="detail-section"><h4>${title}</h4>${rows.length?rows.map(x=>`<p class="relation-line ${kind}">${esc(x)}</p>`).join(""):"<p>Inga dokumenterade relationer registrerade.</p>"}</div>`;}
const fieldMap={Swedish:"swedish",Latin:"latin",Category:"category",Status:"status",Intro:"intro",Height:"height",Width:"width",Light:"light",Moisture:"moisture",Soil:"soil",Hardiness:"hardiness",Bloom:"bloom",Flower:"flower",Zone:"zone",BloomMonths:"bloomMonths",GoodCompanions:"goodCompanions",BadCompanions:"badCompanions",Description:"description",Care:"care",Design:"design",Eco:"eco",Image:"image"};
function openForm(p=null){
 $("plantDialog").showModal();$("dialogTitle").textContent=p?"Redigera växt":"Ny växt";$("editId").value=p?.id||"";
 for(const [id,key] of Object.entries(fieldMap))$("f"+id).value=p?.[key]??(key==="category"?"Buskar":key==="status"?"draft":"");
 $("fSource").innerHTML=db.sources.map(s=>`<option value="${esc(s.id)}">${esc(s.title)}</option>`).join("");
 const src=p?.sources?.[0];$("fSource").value=src?.sourceId||db.sources[0]?.id||"";$("fChapter").value=src?.chapter||"";$("fPage").value=src?.page||"";$("fPdfPage").value=src?.pdfPage||"";$("fClaim").value=src?.claim||"";
 $("deletePlant").classList.toggle("hidden",!p);
}
function closeForm(){$("plantDialog").close();}
$("plantForm").addEventListener("submit",e=>{
 e.preventDefault();const id=$("editId").value||"p-"+crypto.randomUUID(),old=db.plants.find(x=>x.id===id)||{},p={...old,id};
 for(const [f,k] of Object.entries(fieldMap)){const v=$("f"+f).value;p[k]=["height","width"].includes(k)?(v?Number(v):null):v;}
 const sourceId=$("fSource").value,chapter=$("fChapter").value.trim(),page=$("fPage").value.trim(),pdfPage=$("fPdfPage").value.trim(),claim=$("fClaim").value.trim();
 p.sources=sourceId?[{sourceId,chapter,page,pdfPage,claim}]:[];
 if(p.status==="verified"&&(!sourceId||!chapter||!page||!claim)){alert("Källgranskad kräver källa, kapitel/avsnitt, verifierad tryckt sida och angivet påstående.");return;}
 const i=db.plants.findIndex(x=>x.id===id);if(i>=0)db.plants[i]=p;else db.plants.unshift(p);
 selected=id;closeForm();save();showDetail(id);
});
$("deletePlant").onclick=()=>{const id=$("editId").value;if(confirm("Ta bort växtposten permanent från denna webbläsares lokala data?")){db.plants=db.plants.filter(p=>p.id!==id);listIds=listIds.filter(x=>x!==id);persistList();compareIds=compareIds.filter(x=>x!==id);selected=null;closeForm();save();$("detail").innerHTML='<div class="detail-empty"><h2>Välj en växt</h2></div>';}};
$("toggleEditor").onclick=()=>{editor=!editor;render();if(selected)showDetail(selected);};
$("addPlant").onclick=()=>openForm();$("closeDialog").onclick=$("cancelDialog").onclick=closeForm;
$("applySite").onclick=render;$("resetSite").onclick=()=>{["siteLight","siteMoisture","siteSoil","siteZone"].forEach(id=>$(id).value="");render();};
["search","categoryFilter","statusFilter","sortBy"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",render));
$("clearFilters").onclick=()=>{["search","categoryFilter","statusFilter","siteLight","siteMoisture","siteSoil","siteZone"].forEach(id=>$(id).value="");render();};
$("listName").addEventListener("input",()=>{});
$("clearList").onclick=()=>{if(confirm("Töm den aktuella växtlistan?")){listIds=[];persistList();renderSavedList();}};
$("exportList").onclick=()=>{
 const rows=[["Lista",$("listName").value],["Svenskt namn","Vetenskapligt namn","Växtgrupp","Höjd cm","Bredd cm","Ljus","Markfukt","Jord","Härdighet","Källstatus"]];
 for(const p of listIds.map(id=>db.plants.find(x=>x.id===id)).filter(Boolean))rows.push([p.swedish,p.latin,p.category,p.height??"",p.width??"",p.light||"",p.moisture||"",p.soil||"",p.hardiness||"",statusText(p.status)]);
 const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(";")).join("\r\n");download(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),safeFilename($("listName").value)+".csv");
};
$("exportBtn").onclick=()=>download(new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),"vaxtlighetsguide-data.json");
$("importFile").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const incoming=normalize(JSON.parse(await file.text()));if(!Array.isArray(incoming.plants)||!Array.isArray(incoming.sources))throw Error("Ogiltigt dataformat");if(confirm(`Importera ${incoming.plants.length} växtposter och ${incoming.sources.length} källor? Nuvarande lokala data ersätts.`)){db=incoming;save();selected=null;compareIds=[];listIds=[];persistList();$("detail").innerHTML='<div class="detail-empty"><h2>Välj en växt</h2></div>';}}catch(err){alert("Importen misslyckades: "+err.message);}e.target.value="";};
function safeFilename(s){return String(s||"vaxtlista").toLowerCase().replace(/[^a-zåäö0-9]+/g,"-").replace(/^-|-$/g,"")||"vaxtlista";}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
render();