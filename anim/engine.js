// 3D 工法動畫共用引擎：每支動畫只要提供 steps（文字）與 build（建模）
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export { THREE };

const CIRC = ['','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫'];

/**
 * cfg = {
 *   title: '高架木地板施工順序',
 *   steps: [{t,d,tip}, ...]   // steps[0] 是「施工前」
 *   views: {def:{dir,dist,target}, 6:{...}}  // 各步鏡頭（沒寫就用 def）
 *   cut:   {cat: [THREE.Plane...]}            // 剖面按鈕要切的分類
 *   cutLabel, note, build(kit)
 * }
 */
export function createAnim(cfg) {
  const STEPS = cfg.steps;
  const LAST = STEPS.length - 1;

  /* ---------- 版面 ---------- */
  document.body.innerHTML = `
<div class="top"><a href="../">← 室裝乙級學習站</a><a href="./">3D 工法動畫目錄</a><span>${cfg.title}</span></div>
<main class="wrap">
  <section class="stage">
    <div class="titles">
      <div class="kicker">室內裝修工程管理</div>
      <div class="sub">${cfg.title}</div>
      <h1 id="title"></h1>
    </div>
    <div id="view"><div class="hint">拖曳旋轉・滾輪／雙指縮放</div><div id="err">3D 載入失敗，請確認網路連線後重新整理。</div></div>
    <div class="prog"><i id="bar"></i></div>
    <p id="desc"></p>
    <div class="ctrl">
      <button class="btn" id="prev">◀ 上一步</button>
      <button class="btn pri" id="play">▶ 播放</button>
      <button class="btn" id="next">下一步 ▶</button>
      ${cfg.cut ? `<button class="btn" id="cut" title="${cfg.cutLabel||'切開外層，看裡面的構造'}">剖面</button>` : ''}
      <button class="btn" id="reset">重看視角</button>
    </div>
  </section>
  <aside class="panel">
    <div class="tip"><b>考點</b><span id="tip"></span></div>
    <h2>${LAST} 步驟（點選跳到該步）</h2>
    <ol class="steps" id="list"></ol>
    <div class="foot">鍵盤：← → 切換步驟，空白鍵播放／暫停。${cfg.note || '模型比例有誇大，方便看清楚各層構造。'}</div>
  </aside>
</main>`;
  const $ = id => document.getElementById(id);
  const view = $('view');

  /* ---------- 場景 ---------- */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true}); }
  catch (e) { $('err').style.display='flex'; throw e; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  view.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(cfg.bg || '#eef0f1');
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = cfg.minDist ?? 2.5; controls.maxDistance = 22;   // 小物件（鉸鍊、磚）可拉更近
  controls.maxPolarAngle = Math.PI * (cfg.maxPolar ?? 0.49);   // 天花板類要能從下往上看
  if (cfg.minPolar) controls.minPolarAngle = Math.PI * cfg.minPolar;

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc8c0, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(...(cfg.sun || [4, 8, 5]));
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left:-5, right:5, top:5, bottom:-5, near:1, far:25});
  sun.shadow.bias = -0.0004;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({opacity:.12}));
  ground.rotation.x = -Math.PI/2; ground.position.y = cfg.groundY ?? -0.2; ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- 建模小工具 ---------- */
  const EDGE = new THREE.LineBasicMaterial({color:'#3f3a36', transparent:true, opacity:.35});
  const mat = (color, o={}) => new THREE.MeshStandardMaterial({color, roughness:.8, ...o});
  function box(w, h, d, m, {edges=true, shadow=true}={}) {
    const g = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(g, m.clone());
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    if (edges) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), EDGE.clone()));
    return mesh;
  }
  // 用「最小角、最大角」放方塊
  function span(x0,y0,z0,x1,y1,z1,m,opt){
    const mesh = box(x1-x0, y1-y0, z1-z0, m, opt);
    mesh.position.set((x0+x1)/2, (y0+y1)/2, (z0+z1)/2);
    return mesh;
  }
  function pipe(a, b, r, m){
    const A=new THREE.Vector3(...a), B=new THREE.Vector3(...b);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,A.distanceTo(B),16), m.clone());
    mesh.position.copy(A).add(B).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), B.clone().sub(A).normalize());
    mesh.castShadow=true;
    return mesh;
  }
  function group(...children){ const g=new THREE.Group(); children.forEach(c=>g.add(c)); return g; }
  // 向下（或任意方向）箭頭：from → to
  function arrow(from, to, m){
    const A=new THREE.Vector3(...from), B=new THREE.Vector3(...to);
    const dir=B.clone().sub(A); const len=dir.length(); dir.normalize();
    const g=new THREE.Group();
    const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,len-.12,12), m.clone()); shaft.position.y=(len-.12)/2;
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.055,.12,16), m.clone()); tip.position.y=len-.06;
    g.add(shaft,tip); g.position.copy(A);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
    return g;
  }

  // 文字標籤（永遠面向鏡頭），字太長會自動縮小
  function label(text, x, y, z, w=1.3){
    const c=document.createElement('canvas'); c.width=512; c.height=128;
    const g=c.getContext('2d');
    g.fillStyle='#fffbeb'; g.strokeStyle='#d97706'; g.lineWidth=8;
    g.beginPath(); g.roundRect(6,6,500,116,28); g.fill(); g.stroke();
    g.fillStyle='#92400e';
    let fs=54; do { g.font=`bold ${fs}px "Noto Sans TC","Microsoft JhengHei",sans-serif`; fs-=2; } while (g.measureText(text).width>450 && fs>20);
    g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,256,68);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex, depthTest:false}));
    s.scale.set(w, w/4, 1); s.position.set(x,y,z); s.renderOrder=10;
    return s;
  }

  /* ---------- 動畫項目 ---------- */
  const items = [];
  const DUR = 0.55;
  function add(step, obj, {delay=0, drop=0.45, until=99, cat='', glow=true}={}) {
    const mats=[];
    obj.traverse(o=>{ if(o.material){ const m=o.material; m.transparent=true; m.userData.base=m.opacity; if(!glow) m.userData.glowable=false; mats.push(m);} });
    items.push({step, obj, delay, drop, until, cat, mats, baseY:obj.position.y, t0:-1, glow:0});
    obj.visible = false;
    scene.add(obj);
    return obj;
  }
  const fixed = obj => { scene.add(obj); return obj; };

  cfg.build({THREE, scene, mat, box, span, pipe, group, arrow, label, add, fixed, EDGE});

  /* ---------- 剖面 ---------- */
  let cut=false;
  function applyCut(){
    items.forEach(it=>{
      if(!cfg.cut || !(it.cat in cfg.cut)) return;
      const planes = cut ? cfg.cut[it.cat] : null;
      it.mats.forEach(m=>{ m.clippingPlanes = planes; m.needsUpdate = true; });
    });
    $('cut')?.classList.toggle('on', cut);
  }

  /* ---------- 鏡頭 ---------- */
  const VIEWS = cfg.views || {};
  let fly=null;
  function fitScale(){ const a=camera.aspect; return a<1.2 ? Math.min(1.9, 1.2/a) : 1; }
  function goal(k){
    const v = VIEWS[k] || VIEWS.def;
    const dir = new THREE.Vector3(...v.dir).normalize();
    const tgt = new THREE.Vector3(...v.target);
    return {pos: tgt.clone().add(dir.multiplyScalar(v.dist*fitScale())), tgt};
  }
  function flyTo(k, instant=false){
    const g=goal(k);
    if(instant){ camera.position.copy(g.pos); controls.target.copy(g.tgt); fly=null; controls.update(); return; }
    fly=g;
  }
  controls.addEventListener('start', ()=>{ fly=null; });

  /* ---------- 步驟控制 ---------- */
  let cur=0, playing=false, autoTimer=null;
  const ease=p=>1-Math.pow(1-p,3);
  function setP(it,p){
    const e=ease(p);
    it.obj.position.y = it.baseY + (1-e)*it.drop;
    const o=Math.min(1,p*1.6);
    it.mats.forEach(m=>{
      m.opacity=m.userData.base*o;
      // 不透明材質淡入完成後改回不透明，避免和半透明層（塗裝、PE 布）排序錯亂
      if (m.userData.base>=1) { const t = o<1; if (m.transparent!==t) { m.transparent=t; m.needsUpdate=true; } }
    });
  }
  function setGlow(it,g){
    it.mats.forEach(m=>{ if(m.emissive && m.userData.glowable!==false){
      if(m.userData.e0===undefined){ m.userData.e0=m.emissive.clone(); m.userData.ei0=m.emissiveIntensity; }
      if(g>0){ m.emissive.set('#f59e0b'); m.emissiveIntensity=.55*g; }
      else { m.emissive.copy(m.userData.e0); m.emissiveIntensity=m.userData.ei0; }
    }});
  }
  function stepLength(k){
    let m=0; items.forEach(it=>{ if(it.step===k) m=Math.max(m,it.delay); });
    return m+DUR;
  }
  function goTo(k, anim=true){
    cur=Math.max(0,Math.min(LAST,k));
    const now=performance.now()/1000;
    items.forEach(it=>{
      const vis = it.step<=cur && cur<=it.until;
      if(!vis){ it.obj.visible=false; it.t0=-1; it.glow=0; setGlow(it,0); return; }
      if(it.step===cur && anim){ it.obj.visible=true; it.t0=now+it.delay; setP(it,0); }
      else if(!it.obj.visible || it.t0>0){ it.obj.visible=true; it.t0=-1; setP(it,1); }
    });
    updateUI();
    if(anim) flyTo(cur);
    if(playing) schedule();
  }
  function schedule(){
    clearTimeout(autoTimer);
    if(cur>=LAST){ setPlaying(false); return; }
    autoTimer=setTimeout(()=>goTo(cur+1), (stepLength(cur)+2.6)*1000);
  }
  function setPlaying(p){
    playing=p;
    $('play').textContent = p ? '❚❚ 暫停' : (cur>=LAST ? '↻ 重播' : '▶ 播放');
    if(!p) clearTimeout(autoTimer);
  }

  /* ---------- UI ---------- */
  const list=$('list');
  STEPS.slice(1).forEach((s,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`<span class="n">${i+1}</span><span>${s.t}</span>`;
    li.onclick=()=>{ setPlaying(false); goTo(i+1); };
    list.appendChild(li);
  });
  function updateUI(){
    const s=STEPS[cur];
    $('title').innerHTML = cur ? `<span class="no">${cur}</span>${s.t}` : s.t;
    $('desc').textContent=s.d;
    $('tip').textContent=s.tip;
    $('bar').style.width=(cur/LAST*100)+'%';
    $('prev').disabled = cur===0;
    $('next').disabled = cur===LAST;
    [...list.children].forEach((li,i)=>{ li.classList.toggle('cur',i+1===cur); li.classList.toggle('done',i+1<cur); });
    if(!playing) setPlaying(false);
    document.title = (cur?`${CIRC[cur]} ${s.t}｜`:'')+cfg.title+'｜3D 工法動畫';
  }
  $('prev').onclick=()=>{ setPlaying(false); goTo(cur-1); };
  $('next').onclick=()=>{ setPlaying(false); goTo(cur+1); };
  $('play').onclick=()=>{
    if(playing){ setPlaying(false); return; }
    setPlaying(true);
    if(cur>=LAST){ goTo(0,false); flyTo(0); schedule(); }
    else goTo(cur+1);
  };
  if($('cut')) $('cut').onclick=()=>{ cut=!cut; applyCut(); };
  $('reset').onclick=()=>flyTo(cur);
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){ setPlaying(false); goTo(cur+1); }
    else if(e.key==='ArrowLeft'){ setPlaying(false); goTo(cur-1); }
    else if(e.key===' '){ e.preventDefault(); $('play').click(); }
  });

  /* ---------- 迴圈 ---------- */
  function resize(){
    const w=view.clientWidth, h=view.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(view);
  resize();

  renderer.setAnimationLoop(()=>{
    const now=performance.now()/1000;
    for(const it of items){
      if(it.t0>0){
        const p=(now-it.t0)/DUR;
        if(p>=1){ setP(it,1); it.t0=-1; it.glow=now; }
        else setP(it,Math.max(0,p));
      }
      if(it.glow>0){
        const g=1-(now-it.glow)/1.4;
        if(g<=0){ it.glow=0; setGlow(it,0); } else setGlow(it,g);
      }
    }
    if(fly){
      camera.position.lerp(fly.pos,.06);
      controls.target.lerp(fly.tgt,.06);
      if(camera.position.distanceTo(fly.pos)<.01) fly=null;
    }
    controls.update();
    renderer.render(scene,camera);
  });

  const start = parseInt(new URLSearchParams(location.search).get('step')) || 0;
  flyTo(start, true);
  goTo(start, false);
}
