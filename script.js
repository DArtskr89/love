const openCard = document.getElementById('openCard');
const flowersStage = document.getElementById('flowersStage');
const flowerBurst = document.getElementById('flowerBurst');
const bgMusic = document.getElementById('bgMusic');
const harvey = document.getElementById('harvey');
const playHarvey = document.getElementById('playHarvey');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const soundToggle = document.getElementById('soundToggle');
let opened = false;
let bgWanted = true;

function makePetals(){
  const box = document.getElementById('petals');
  for(let i=0;i<26;i++){
    const p=document.createElement('i'); p.className='petal';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=(6+Math.random()*8)+'s';
    p.style.animationDelay=(-Math.random()*10)+'s';
    p.style.setProperty('--drift',(-80+Math.random()*160)+'px');
    p.style.opacity=.35+Math.random()*.5;
    box.appendChild(p);
  }
}
makePetals();

function bloomFlowers(){
  flowerBurst.innerHTML='';
  const imgs=['flower1.png','flower2.png','flower3.png','flower4.png','flower5.png'];
  const spots=[
    [50,50,0,1.35],[16,24,.15,.86],[83,28,.28,.9],[18,77,.44,.88],[82,76,.6,.9],
    [50,13,.76,.7],[49,88,.9,.78],[8,51,1.05,.68],[93,54,1.18,.67],[33,39,1.32,.7],[68,60,1.45,.72]
  ];
  spots.forEach((s,i)=>{
    const im=document.createElement('img');
    im.src=''+imgs[i%imgs.length]; im.className='bloom';
    im.style.left=s[0]+'%'; im.style.top=s[1]+'%'; im.style.animationDelay=s[2]+'s';
    im.style.width=`clamp(120px, ${24*s[3]}vw, ${330*s[3]}px)`;
    flowerBurst.appendChild(im);
  });
}

openCard.addEventListener('click', async ()=>{
  if(opened) return;
  opened=true; openCard.classList.add('open');
  bloomFlowers();
  try{ bgMusic.volume=.24; await bgMusic.play(); soundToggle.classList.remove('muted'); }catch(e){}
  setTimeout(()=>flowersStage.scrollIntoView({behavior:'smooth'}),1050);
});

soundToggle.addEventListener('click', async ()=>{
  bgWanted=!bgWanted;
  if(bgWanted){
    bgMusic.volume=.24;
    try{await bgMusic.play()}catch(e){}
    soundToggle.textContent='♫'; soundToggle.classList.remove('muted');
  }else{
    bgMusic.pause(); soundToggle.textContent='♪'; soundToggle.classList.add('muted');
  }
});

function fmt(sec){ if(!Number.isFinite(sec))return '0:00'; const m=Math.floor(sec/60),s=Math.floor(sec%60); return `${m}:${String(s).padStart(2,'0')}` }
harvey.addEventListener('loadedmetadata',()=>durationEl.textContent=fmt(harvey.duration));
harvey.addEventListener('timeupdate',()=>{currentTime.textContent=fmt(harvey.currentTime); progress.value=harvey.duration?(harvey.currentTime/harvey.duration)*100:0});
harvey.addEventListener('ended',()=>playHarvey.textContent='▶');
progress.addEventListener('input',()=>{ if(harvey.duration) harvey.currentTime=(progress.value/100)*harvey.duration; });
playHarvey.addEventListener('click',async ()=>{
  if(harvey.paused){
    const wasBg=!bgMusic.paused; harvey.dataset.resumeBg=wasBg?'1':'0';
    if(wasBg) bgMusic.pause();
    try{await harvey.play(); playHarvey.textContent='Ⅱ'}catch(e){}
  }else{
    harvey.pause(); playHarvey.textContent='▶';
    if(harvey.dataset.resumeBg==='1' && bgWanted){ try{await bgMusic.play()}catch(e){} }
  }
});
harvey.addEventListener('ended',async()=>{ if(harvey.dataset.resumeBg==='1'&&bgWanted){try{await bgMusic.play()}catch(e){}} });

document.addEventListener('pointerdown',e=>{
  if(Math.random()>.72){ const s=document.createElement('span'); s.className='spark'; s.textContent=Math.random()>.5?'♡':'✿'; s.style.left=e.clientX+'px'; s.style.top=e.clientY+'px'; document.body.appendChild(s); setTimeout(()=>s.remove(),900); }
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting && en.target===flowersStage && !flowerBurst.children.length) bloomFlowers(); });
},{threshold:.25}); observer.observe(flowersStage);
