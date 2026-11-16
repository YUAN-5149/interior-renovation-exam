// 學科分頁：分析與策略、練習、模擬考、錯題本
(function(){
const NUM="①②③④⑤";
const WY=[...new Set(W.map(r=>r[0]))].sort();
const wq=W.map(r=>({y:r[0],n:r[1],ans:r[2],q:r[3],o:r[4],c:r[5],fig:r[6],g:r[7],gy:r[8],t:r[1]<=60?"s":"m",k:r[0]+"-"+r[1]}));
let WR={};try{WR=JSON.parse(localStorage.getItem("ic-wrong")||"{}")}catch(e){}
const saveW=()=>{try{localStorage.setItem("ic-wrong",JSON.stringify(WR))}catch(e){}};
const E=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const pct=(a,b)=>b?Math.round(a/b*100):0;
let sub="ana";

window.renderWritten=function(){
  const root=document.querySelector("#v-written");
  root.innerHTML=`<div class="card" style="padding:10px 12px"><div class="filters" id="wtabs">
   ${[["ana","分析與策略"],["prac","練習"],["mock","模擬考"],["wrong","錯題本"]].map(([k,n])=>`<button class="btn ${sub===k?"pri":""}" data-w="${k}">${n}</button>`).join("")}
  </div></div><div id="wbody"></div>`;
  root.querySelectorAll("#wtabs button").forEach(b=>b.onclick=()=>{sub=b.dataset.w;renderWritten()});
  ({ana:renderAna,prac:renderPrac,mock:renderWMockSetup,wrong:renderWrong})[sub]();
};

// ---------- 分析與策略 ----------
function renderAna(){
  const last=WY[WY.length-1];
  const rep=WY.map(y=>{const qs=wq.filter(q=>q.y===y);return {y,n:qs.length,seen:qs.filter(q=>q.gy.some(x=>x<y)).length}});
  const lastRep=rep[rep.length-1];
  const comm=WY.map(y=>wq.filter(q=>q.y===y&&q.c==="common").length);
  const cnt={};wq.forEach(q=>cnt[q.c]=(cnt[q.c]||0)+1);
  const mx=Math.max(...Object.values(cnt));
  const bars=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="bar"><span class="lab">${WCATS[k].n}</span><span class="trk"><span class="fill" style="display:block;width:${v/mx*100}%;background:${WCATS[k].c}"></span></span><span class="v">${v}</span></div>`).join("");
  const heat=Object.keys(WCATS).filter(k=>cnt[k]).map(k=>`<tr><td style="text-align:left">${WCATS[k].n}</td>${WY.map(y=>{const n=wq.filter(q=>q.y===y&&q.c===k).length;const a=Math.min(n/14,1);return `<td style="background:${n?`color-mix(in srgb, ${WCATS[k].c} ${Math.round(15+a*55)}%, white)`:"#fff"}">${n||""}</td>`}).join("")}<td><b>${cnt[k]}</b></td></tr>`).join("");
  const repBars=rep.slice(1).map(r=>`<div class="bar"><span class="lab" style="width:70px">${r.y} 年</span><span class="trk"><span class="fill" style="display:block;width:${pct(r.seen,r.n)}%;background:#b45309"></span></span><span class="v" style="width:90px">${pct(r.seen,r.n)}%（${r.seen} 題）</span></div>`).join("");
  // 高頻題
  const groups={};wq.forEach(q=>(groups[q.g]=groups[q.g]||[]).push(q));
  const hot=Object.values(groups).map(qs=>({qs,ys:[...new Set(qs.map(q=>q.y))].sort()})).filter(x=>x.ys.length>=3).sort((a,b)=>b.ys.length-a.ys.length||b.ys[b.ys.length-1]-a.ys[a.ys.length-1]);
  const hotRow=x=>(x=>{const q=x.qs[x.qs.length-1];const at=[...q.ans].map(c=>`${NUM[c-1]} ${E(q.o[c-1]||"")}`).join("；");
    return `<tr><td><b>${x.ys.length}</b></td><td style="font-size:12px;min-width:92px">${x.ys.join(" ")}</td><td><span class="pill" style="background:${WCATS[q.c].c}">${WCATS[q.c].n.split("（")[0]}</span> ${q.t==="m"?'<span class="pill" style="background:#0f766e">複選</span>':""}${E(q.q)}${q.fig?' <span class="mut">（含圖）</span>':""}</td><td>${at}</td></tr>`})(x);
  const TH='<tr><th>次數</th><th>出現年度</th><th>題目</th><th>答案</th></tr>';
  const hotHtml=`<div style="overflow-x:auto"><table>${TH}${hot.slice(0,20).map(hotRow).join("")}</table></div>`+(hot.length>20?`<details style="margin-top:10px"><summary class="btn" style="display:inline-block">展開其餘 ${hot.length-20} 組</summary><div style="overflow-x:auto;margin-top:8px"><table>${TH}${hot.slice(20).map(hotRow).join("")}</table></div></details>`:"");
  document.querySelector("#wbody").innerHTML=`
  <div class="grid g4">
   <div class="card"><div class="mut">歷屆學科題數</div><div class="stat">${wq.length}</div><div class="mut">${WY[0]}～${last} 年，每年 80 題</div></div>
   <div class="card"><div class="mut">${last} 年考過的舊題</div><div class="stat" style="color:var(--acc)">${pct(lastRep.seen,lastRep.n)}%</div><div class="mut">${lastRep.seen}／${lastRep.n} 題在之前年度出現過</div></div>
   <div class="card"><div class="mut">重複 3 年以上的高頻題</div><div class="stat">${hot.length}</div><div class="mut">組（見下方清單）</div></div>
   <div class="card"><div class="mut">共同科目</div><div class="stat">${Math.round(comm.reduce((a,b)=>a+b,0)/comm.length)}</div><div class="mut">平均每年題數（職安衛、倫理、環保、節能）</div></div>
  </div>

  <div class="card"><h2>考試規則</h2>
   <table><tr><th>題型</th><th>題數</th><th>配分</th><th>計分方式</th></tr>
   <tr><td>單選題（第 1～60 題）</td><td>60</td><td>每題 1 分，共 60 分</td><td>答錯不倒扣</td></tr>
   <tr><td>複選題（第 61～80 題）</td><td>20</td><td>每題 2 分，共 40 分</td><td>要完全答對才給分，答錯不倒扣</td></tr></table>
   <p class="mut" style="margin-bottom:0">測試時間 100 分鐘，滿分 100，<b>60 分及格</b>。平均每題約 75 秒。</p></div>

  <div class="card"><h2>考試策略規劃</h2>
   <div class="callout" style="margin-bottom:12px"><b>核心結論：學科是「刷題」的考試。</b>舊題重複率逐年上升，${last} 年有 ${pct(lastRep.seen,lastRep.n)}% 的題目在前幾年出現過，而且學科題目出自勞動部技能檢定中心公告的學科題庫。把這 ${wq.length} 題刷熟，再補官方題庫，就能穩定過關。</div>
   <h3>一、目標分數（建議 75 分以上，留安全餘裕）</h3>
   <table><tr><th>題型</th><th>目標</th><th>得分</th><th>說明</th></tr>
   <tr><td>單選 60 題</td><td>答對 50 題</td><td>50</td><td>多數是背誦題，刷熟後最穩</td></tr>
   <tr><td>複選 20 題</td><td>全對 13 題</td><td>26</td><td>沒有部分給分，是失分大宗，要精準記憶每個選項</td></tr>
   <tr><td colspan="2"><b>合計</b></td><td><b>76</b></td><td>及格線 60，保留約 15 分容錯</td></tr></table>

   <h3 style="margin-top:14px">二、三階段準備計畫（約 6 週，每天 60～90 分鐘）</h3>
   <table><tr><th>階段</th><th>時間</th><th>做法</th><th>完成標準</th></tr>
   <tr><td><b>1. 高頻題先拿分</b></td><td>第 1～2 週</td><td>先背下方「高頻重複題」清單，再用「練習」勾選「只看重複出現的題目」，依類別逐一刷完</td><td>重複題正確率 90%</td></tr>
   <tr><td><b>2. 分類全面刷題</b></td><td>第 3～4 週</td><td>依類別練習全部 ${wq.length} 題，順序：法規 → 職安衛 → 共同科目 → CNS 符號 → 計算 → 各工種施工。答錯的會自動進「錯題本」</td><td>每類正確率 80%</td></tr>
   <tr><td><b>3. 年度卷與模擬考</b></td><td>第 5～6 週</td><td>每天一份「年度原卷」限時 100 分鐘，從最新年度往回做；每 3 天清一次錯題本；考前一週改做「隨機組卷」</td><td>連續 3 次模擬考 75 分以上</td></tr></table>

   <h3 style="margin-top:14px">三、各類別讀法</h3>
   <ul>
    <li><b>法規、職安衛（占比最高）</b>：數字題最多，例如 2 公尺、1.2 公尺、十年內累計二年、通道傾斜 30 度、扶手 75 公分。建議整理成「數字卡」，和術科 B 卷共用。</li>
    <li><b>共同科目</b>：題目來自共同科目題庫（職業安全衛生、工作倫理與職業道德、環境保護、節能減碳），屬常識題，刷 2 輪就能拿分，不要放棄。</li>
    <li><b>CNS 符號</b>：看圖題，要搭配附圖練習；和術科 A 卷第 2 題共用，練一次兩邊得分。</li>
    <li><b>數量計算</b>：1 坪＝36 才（面積）、1 才＝30.3cm×30.3cm、1 坪＝3.3058 m²、木材 1 才＝1 台寸×1 台寸×10 台尺；計算題公式固定，熟練即可。</li>
    <li><b>各工種施工</b>：與術科 C 卷高度重疊，術科讀到的施工要點可直接拿來答學科。</li>
   </ul>

   <h3 style="margin-top:14px">四、考場答題策略</h3>
   <ul>
    <li><b>時間分配</b>：單選約 45 分鐘、複選約 35 分鐘，留 20 分鐘檢查與畫卡。</li>
    <li><b>先易後難</b>：第一輪只答有把握的題目，卡住的先做記號，最後回頭處理。</li>
    <li><b>答錯不倒扣，每題都要作答</b>：真的不會也要猜，不要留白。</li>
    <li><b>複選題</b>：要完全答對才給分。逐一判斷每個選項的對錯。統計 105～115 年共 220 題複選，答案<b>不是 2 個就是 3 個選項</b>（3 個占 65%），從未出現只選 1 個或 4 個全選。所以確定 2 個、第 3 個沒把握時，傾向選 3 個。</li>
    <li><b>注意否定句</b>：「何者錯誤」「何者不是」「不包括」最容易看錯，先把否定字圈起來。</li>
    <li><b>新題靠術科知識</b>：沒看過的題目多半是施工常識，可以用術科讀到的內容推理。</li>
   </ul></div>

  <div class="card"><h2>舊題重複率（各年度題目在前幾年出現過的比例）</h2>${repBars}
   <p class="mut">重複率由題幹與選項的相似度自動比對，選項順序不同也算同一題，僅供參考。</p></div>
  <div class="card"><h3>題型分布（${wq.length} 題）</h3>${bars}</div>
  <div class="card"><h3>各年度題型分布</h3><div style="overflow-x:auto"><table class="heat"><tr><th>類別</th>${WY.map(y=>`<th>${y}</th>`).join("")}<th>合計</th></tr>${heat}</table></div>
   <p class="mut">類別依題目關鍵字自動分類，少數題目可能歸類不精確。</p></div>
  <div class="card"><h2>高頻重複題（出現 3 個年度以上，共 ${hot.length} 組）</h2>
   ${hotHtml}</div>`;
}

// ---------- 題目卡 ----------
function wCard(q,i,mode){
  const multi=q.t==="m";
  const opts=(q.o.length?q.o:["","","",""]).map((o,j)=>`<label class="wopt" data-j="${j+1}"><input type="${multi?"checkbox":"radio"}" name="wq-${q.k}-${mode}" value="${j+1}"> ${NUM[j]} ${E(o)}</label>`).join("");
  const wr=WR[q.k];
  return `<div class="card q" id="wc-${mode}-${q.k}" data-k="${q.k}">
   <div class="meta">${i!=null?`<b style="color:var(--ink)">${i}.</b>`:""}<b style="color:var(--ink)">${q.y} 年 第 ${q.n} 題</b>
    <span class="pill" style="background:${multi?"#0f766e":"#57534e"}">${multi?"複選 2 分":"單選 1 分"}</span>
    <span class="pill" style="background:${WCATS[q.c].c}">${WCATS[q.c].n.split("（")[0]}</span>
    ${q.gy.length?`<span class="pill" style="background:#b45309">也出現在 ${q.gy.join("、")}</span>`:""}
    ${wr?`<span class="pill" style="background:var(--bad)">錯過 ${wr} 次</span>`:""}</div>
   <div class="txt">${E(q.q)}</div>
   ${q.fig?`<img src="img/w/${q.y}-${q.n}.png" alt="${q.y} 年第 ${q.n} 題附圖" loading="lazy">`:""}
   <div class="wopts">${opts}</div>
   ${mode==="prac"?`<div class="acts"><button class="btn pri" onclick="wCheck('${q.k}','prac')">確認答案</button><span class="wres mut"></span></div>`:""}
  </div>`;
}
function picked(k,mode){return [...document.querySelectorAll(`#wc-${mode}-${CSS.escape(k)} input:checked`)].map(i=>i.value).sort().join("")}
function mark(k,mode,user){
  const q=wq.find(x=>x.k===k);const el=document.querySelector(`#wc-${mode}-${CSS.escape(k)}`);
  const ok=user===q.ans;
  el.querySelectorAll(".wopt").forEach(l=>{const j=l.dataset.j;l.classList.toggle("right",q.ans.includes(j));l.classList.toggle("wrongpick",user.includes(j)&&!q.ans.includes(j));l.querySelector("input").disabled=true});
  el.classList.add(ok?"s-g":"s-b");
  const r=el.querySelector(".wres");if(r)r.innerHTML=ok?`<b style="color:var(--ok)">答對了</b>`:`<b style="color:var(--bad)">答錯</b>，正確答案：${[...q.ans].map(c=>NUM[c-1]).join("")}`;
  if(!ok){WR[k]=(WR[k]||0)+1}else if(WR[k]&&mode==="prac"){delete WR[k]}
  saveW();return ok;
}
window.wCheck=function(k,mode){const u=picked(k,mode);if(!u)return;mark(k,mode,u)};

// ---------- 練習 ----------
let pFilt={y:"",c:"",t:"",rep:false,wr:false,s:"",page:0};
function renderPrac(){
  document.querySelector("#wbody").innerHTML=`<div class="card"><div class="filters">
   <select id="wy"><option value="">全部年度</option>${WY.map(y=>`<option ${pFilt.y==y?"selected":""}>${y}</option>`).join("")}</select>
   <select id="wc"><option value="">全部類別</option>${Object.entries(WCATS).map(([k,v])=>`<option value="${k}" ${pFilt.c===k?"selected":""}>${v.n}</option>`).join("")}</select>
   <select id="wt"><option value="">單選＋複選</option><option value="s" ${pFilt.t==="s"?"selected":""}>只看單選</option><option value="m" ${pFilt.t==="m"?"selected":""}>只看複選</option></select>
   <label class="mut"><input type="checkbox" id="wrep" ${pFilt.rep?"checked":""}> 只看重複出現的題目</label>
   <input type="search" id="ws" placeholder="搜尋題目關鍵字" value="${E(pFilt.s)}">
  </div><div class="mut" id="wn" style="margin-top:8px"></div></div><div id="wlist"></div><div id="wpg" class="filters" style="justify-content:center"></div>`;
  const up=()=>{pFilt={...pFilt,y:$("#wy").value,c:$("#wc").value,t:$("#wt").value,rep:$("#wrep").checked,s:$("#ws").value.trim(),page:0};drawPrac()};
  ["#wy","#wc","#wt","#wrep"].forEach(s=>$(s).onchange=up);$("#ws").oninput=up;
  drawPrac();
}
function drawPrac(){
  const f=pFilt,PER=20;
  const r=wq.filter(q=>(!f.y||q.y==f.y)&&(!f.c||q.c===f.c)&&(!f.t||q.t===f.t)&&(!f.rep||q.gy.length)&&(!f.s||(q.q+q.o.join("")).includes(f.s)));
  const pages=Math.max(1,Math.ceil(r.length/PER));
  $("#wn").textContent=`符合 ${r.length} 題，第 ${f.page+1}／${pages} 頁`;
  $("#wlist").innerHTML=r.slice(f.page*PER,(f.page+1)*PER).map(q=>wCard(q,null,"prac")).join("")||`<div class="card mut">沒有符合條件的題目。</div>`;
  $("#wpg").innerHTML=pages>1?`<button class="btn" ${f.page?"":"disabled"} id="pp">上一頁</button><span class="mut">${f.page+1}／${pages}</span><button class="btn" ${f.page<pages-1?"":"disabled"} id="np">下一頁</button>`:"";
  if(pages>1){$("#pp").onclick=()=>{f.page--;drawPrac();scrollTo(0,0)};$("#np").onclick=()=>{f.page++;drawPrac();scrollTo(0,0)}}
}

// ---------- 模擬考 ----------
let wTimer=null,wSet=[];
function renderWMockSetup(){
  clearInterval(wTimer);
  document.querySelector("#wbody").innerHTML=`<div class="card"><h2>學科模擬考</h2>
   <p>和正式考試相同：單選 60 題、複選 20 題，限時 100 分鐘，交卷後自動計分（複選全對才給分），答錯的題目會加入錯題本。</p>
   <div class="filters">
    <select id="wm"><option value="rand">隨機組卷（優先抽高頻重複題）</option>${WY.slice().reverse().map(y=>`<option value="${y}">${y} 年原卷</option>`).join("")}</select>
    <select id="wmt"><option value="100">限時 100 分鐘（正式）</option><option value="0">不計時</option></select>
    <button class="btn pri" id="wgo">開始</button>
   </div></div>`;
  $("#wgo").onclick=startWMock;
}
function startWMock(){
  const m=$("#wm").value,mins=+$("#wmt").value;
  if(m==="rand"){
    const pick=(t,n)=>{const g={};wq.filter(q=>q.t===t).forEach(q=>(g[q.g]=g[q.g]||[]).push(q));
      const arr=Object.values(g).map(qs=>({q:qs[Math.floor(Math.random()*qs.length)],w:new Set(qs.map(x=>x.y)).size+Math.random()*2}));
      arr.sort((a,b)=>b.w-a.w);const top=arr.slice(0,Math.round(n*2.2)).sort(()=>Math.random()-.5);return top.slice(0,n).map(x=>x.q)};
    wSet=[...pick("s",60),...pick("m",20)];
  } else wSet=wq.filter(q=>q.y==m).sort((a,b)=>a.n-b.n);
  let left=mins*60;
  document.querySelector("#wbody").innerHTML=`<div class="timer"><span>${m==="rand"?"隨機組卷":m+" 年原卷"}・${wSet.length} 題</span><span class="t" id="wtm">${mins?fmt2(left):"不計時"}</span><button class="btn" id="wsub">交卷</button></div>
   <div class="card mut" style="font-size:13px">第 1～60 題單選（每題 1 分），第 61～80 題複選（每題 2 分，全對才給分）。</div>
   <div id="wmq">${wSet.map((q,i)=>wCard(q,i+1,"mock")).join("")}</div>
   <div class="card" style="text-align:center"><button class="btn pri" id="wsub2">交卷並計分</button></div>`;
  $("#wsub").onclick=$("#wsub2").onclick=finishWMock;
  if(mins)wTimer=setInterval(()=>{left--;$("#wtm").textContent=fmt2(Math.max(left,0));if(left<=600)$("#wtm").style.color="#fca5a5";if(left<=0)finishWMock()},1000);
}
const fmt2=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
function finishWMock(){
  if(!wSet.length)return;clearInterval(wTimer);
  let s1=0,s2=0,blank=0;const byc={};
  wSet.forEach(q=>{const u=picked(q.k,"mock");if(!u)blank++;const ok=mark(q.k,"mock",u);
    if(ok){q.t==="s"?s1++:s2++}
    byc[q.c]=byc[q.c]||[0,0];byc[q.c][1]++;if(ok)byc[q.c][0]++});
  const total=s1+s2*2,pass=total>=60;
  const weak=Object.entries(byc).map(([k,[a,b]])=>({k,a,b,r:a/b})).sort((x,y)=>x.r-y.r);
  const box=document.createElement("div");box.className="card";
  box.innerHTML=`<h2>成績：<span style="color:${pass?"var(--ok)":"var(--bad)"}">${total} 分（${pass?"及格":"未及格"}）</span></h2>
   <p>單選答對 ${s1}／60（${s1} 分），複選全對 ${s2}／20（${s2*2} 分），未作答 ${blank} 題。答錯的題目已加入錯題本。</p>
   <table><tr><th>類別</th><th>答對／題數</th><th>正確率</th></tr>${weak.map(w=>`<tr><td>${WCATS[w.k].n}</td><td>${w.a}／${w.b}</td><td style="color:${w.r<.6?"var(--bad)":w.r<.8?"var(--mid)":"var(--ok)"}"><b>${Math.round(w.r*100)}%</b></td></tr>`).join("")}</table>
   <p class="mut">正確率低於 60% 的類別，建議到「練習」用類別篩選重刷。</p>`;
  $("#wmq").before(box);$("#wtm").textContent="已交卷";
  document.querySelectorAll("#wsub,#wsub2").forEach(b=>b.disabled=true);
  wSet=[];scrollTo(0,0);
}

// ---------- 錯題本 ----------
function renderWrong(){
  const r=wq.filter(q=>WR[q.k]).sort((a,b)=>WR[b.k]-WR[a.k]);
  document.querySelector("#wbody").innerHTML=`<div class="card"><h2>錯題本（${r.length} 題）</h2>
   <p class="mut">練習或模擬考答錯的題目會自動加入；在「練習」或這裡重新答對，就會從錯題本移除。紀錄只存在這台裝置的瀏覽器中。</p>
   ${r.length?`<button class="btn" id="wclr">清空錯題本</button>`:""}</div>
   <div id="wlist">${r.map(q=>wCard(q,null,"prac")).join("")||'<div class="card mut">目前沒有錯題。</div>'}</div>`;
  if(r.length)$("#wclr").onclick=()=>{WR={};saveW();renderWrong()};
}
const $=s=>document.querySelector(s);
})();
