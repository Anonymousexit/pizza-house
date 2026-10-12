const header = document.querySelector('.header');
const nav = document.querySelector('.mobile-nav');
const navToggle = document.querySelector('.nav-toggle');
const dialog = document.querySelector('.menu-dialog');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let returnFocus;
function closeNav(){nav.classList.remove('open');header.classList.remove('nav-open');nav.inert=true;navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Open navigation');if(!dialog.open)document.body.classList.remove('locked');}
navToggle.addEventListener('click',()=>{if(nav.classList.contains('open')){closeNav();return;}nav.classList.add('open');header.classList.add('nav-open');nav.inert=false;document.body.classList.add('locked');navToggle.setAttribute('aria-expanded','true');navToggle.setAttribute('aria-label','Close navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeNav();navToggle.focus();}if(e.key==='Tab'&&nav.classList.contains('open')){const items=[navToggle,...nav.querySelectorAll('a,button')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeNav();});
const menu = {
 pizza:[['The Margherita','Tomato, mozzarella, fresh basil. The beautiful original.'],['Hot Honey Pepperoni','Pepperoni, mozzarella, tomato and a little sweet heat.'],['Mushroom & Thyme','Roasted mushrooms, mozzarella, thyme and garlic.'],['The House Special','A seasonal slice of whatever we’re excited about.']],
 sides:[['Garlic & Rosemary Bread','Wood-fired dough, garlic butter and fresh rosemary.'],['Burrata & Tomatoes','Creamy burrata, ripe tomatoes, basil and olive oil.'],['House Greens','Crisp leaves, shaved parmesan and a bright lemon dressing.']],
 drinks:[['Something Cold','A rotating selection of beers, served cold.'],['By the Glass','Easy-drinking reds, whites and rosé to share a pizza with.'],['Keeping It Soft','Sparkling drinks, lemonade and still or sparkling water.']]
};
const panel=document.querySelector('#menu-panel');
const tabs=[...document.querySelectorAll('[data-category]')];
let currentCategory='pizza', currentDish=0, closeTimer;
const stage=document.querySelector('.dish-stage');
const dots=document.querySelector('.dish-dots');
const categoryCopy={pizza:['FRESH<br>FROM<br><em>THE FIRE.</em>','From the oven'],sides:['A LITTLE<br>ON <em>THE<br>SIDE.</em>','Better together'],drinks:['HERE’S<br>TO <em>GOOD<br>TIMES.</em>','Raise a glass']};
function showDish(index, direction=1){
 const restoreDotFocus=dots.contains(document.activeElement);
 currentDish=(index+menu[currentCategory].length)%menu[currentCategory].length;
 const [name,description]=menu[currentCategory][currentDish];
 const label=document.createElement('span');label.className='dish-number';label.textContent=`${String(currentDish+1).padStart(2,'0')} / ${String(menu[currentCategory].length).padStart(2,'0')} — ${categoryCopy[currentCategory][1]}`;
 const h=document.createElement('h3');h.textContent=name;
 const p=document.createElement('p');p.textContent=description;
 stage.replaceChildren(label,h,p);
 dots.replaceChildren(...menu[currentCategory].map(([title],i)=>{const button=document.createElement('button');button.type='button';button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label',`Show ${title}`);button.setAttribute('aria-current',String(i===currentDish));button.addEventListener('click',()=>showDish(i,i>currentDish?1:-1));return button;}));
 if(restoreDotFocus)dots.children[currentDish]?.focus({preventScroll:true});
 if(!reduceMotion.matches)[label,h,p].forEach((el,i)=>el.animate([{opacity:0,transform:`translateY(${18+i*5}px) translateX(${direction*8}px)`},{opacity:1,transform:'none'}],{duration:480,delay:i*55,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
}
function showCategory(category){
 const changed=currentCategory!==category;currentCategory=category;dialog.dataset.category=category;
 tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});panel.setAttribute('aria-labelledby',`tab-${category}`);
 document.querySelector('.menu-visual-title').innerHTML=categoryCopy[category][0];
 if(changed&&!reduceMotion.matches)document.querySelector('.menu-photo').animate([{opacity:.35,transform:'scale(1.09)'},{opacity:1,transform:'scale(1.025)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
 showDish(0);
}
function closeMenu(){if(dialog.classList.contains('closing'))return;if(reduceMotion.matches){dialog.close();return;}dialog.classList.add('closing');closeTimer=setTimeout(()=>dialog.close(),270);}
function openMenu(button){clearTimeout(closeTimer);dialog.classList.remove('closing');returnFocus=nav.contains(button)?navToggle:button;closeNav();showCategory('pizza');dialog.showModal();document.body.classList.add('locked');dialog.append(cursor);}
function stepDish(delta){showDish(currentDish+delta,delta);}
const previousDish=document.querySelector('.previous-dish'),nextDish=document.querySelector('.next-dish');
previousDish.addEventListener('click',()=>stepDish(-1));nextDish.addEventListener('click',()=>stepDish(1));
// Arrow keys work on the dish panel; category tabs keep their own arrow-key behavior.
panel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stepDish(e.key==='ArrowRight'?1:-1);}});
let swipeStart=null;
stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipeStart=e.clientX;});
stage.addEventListener('pointerup',e=>{if(swipeStart!==null&&Math.abs(e.clientX-swipeStart)>45)stepDish(e.clientX<swipeStart?1:-1);swipeStart=null;});
stage.addEventListener('pointercancel',()=>swipeStart=null);
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>showCategory(tab.dataset.category));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();showCategory(tabs[next].dataset.category);}});});
document.querySelectorAll('[data-menu]').forEach(button=>button.addEventListener('click',()=>openMenu(button)));
document.querySelector('.close-menu').addEventListener('click',closeMenu);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeMenu();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMenu();}});
dialog.addEventListener('close',()=>{clearTimeout(closeTimer);dialog.classList.remove('closing');document.body.classList.remove('locked');document.body.append(cursor);returnFocus?.focus();});
showCategory('pizza');
if(!reduceMotion.matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
// Continuous hero-to-navigation wordmark. Only transforms are animated.
const heroPhoto=document.querySelector('.hero-photo');
const heroCopy=document.querySelector('.hero-copy');
const brand=document.querySelector('.flying-brand');
const originalTitle=document.querySelector('#hero-title');
const destination=document.querySelector('.small-logo');
let geometry, progress=0, targetProgress=0, motionFrame=0, lastFrame=0;
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
function measureBrand(){
 const original=originalTitle.getBoundingClientRect();
 const target=destination.getBoundingClientRect();
 brand.style.fontSize=getComputedStyle(originalTitle).fontSize;
 brand.style.letterSpacing=getComputedStyle(originalTitle).letterSpacing;
 geometry={startX:original.left+original.width/2,startY:original.top+scrollY+original.height/2,width:original.width,height:original.height,endX:target.left+target.width/2,endY:target.top+target.height/2,scale:Math.min(target.width/original.width,target.height/original.height),distance:document.querySelector('.hero').offsetHeight*.72};
 targetProgress=clamp(scrollY/geometry.distance);progress=targetProgress;paintBrand();brand.classList.add('ready');
}
function paintBrand(){
 if(!geometry)return;
 const p=progress;const eased=p*p*(3-2*p);
 const x=geometry.startX+(geometry.endX-geometry.startX)*eased;
 const y=geometry.startY+(geometry.endY-geometry.startY)*eased;
 const scale=1+(geometry.scale-1)*eased;
 brand.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${-2*(1-eased)}deg)`;
 document.body.classList.toggle('brand-docked',p>.94);
 heroCopy.querySelector('.eyebrow').style.opacity=String(1-clamp(p*3));
 heroCopy.querySelector('.hero-sub').style.opacity=String(1-clamp(p*2.4));
}
function animateBrand(time){
 const dt=lastFrame?Math.min(time-lastFrame,50):16.7;lastFrame=time;
 progress+=(targetProgress-progress)*(1-Math.exp(-dt/65));
 if(Math.abs(targetProgress-progress)<.0001)progress=targetProgress;
 paintBrand();
 if(progress!==targetProgress)motionFrame=requestAnimationFrame(animateBrand);else{motionFrame=0;lastFrame=0;}
}
function updateScroll(){
 header.classList.toggle('scrolled',scrollY>60);
 if(!geometry)return;
 targetProgress=clamp(scrollY/geometry.distance);
 if(reduceMotion.matches){progress=targetProgress>0.5?1:0;paintBrand();}
 else if(!motionFrame)motionFrame=requestAnimationFrame(animateBrand);
 if(!reduceMotion.matches&&scrollY<window.innerHeight*1.3)heroPhoto.style.transform=`translateY(${scrollY*.22}px)`;
}
window.addEventListener('scroll',updateScroll,{passive:true});
window.addEventListener('resize',measureBrand);
document.fonts.ready.then(()=>{measureBrand();updateScroll();});

// A quiet, spring-following cursor, inspired by Framer's motion interactions.
const cursor=document.querySelector('.cursor');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
let pointerX=-100,pointerY=-100,cursorX=-100,cursorY=-100,velocityX=0,velocityY=0,cursorFrame=0,cursorTime=0;
function springCursor(time){
 const dt=cursorTime?Math.min((time-cursorTime)/16.67,2):1;cursorTime=time;
 velocityX+=(pointerX-cursorX)*.19*dt;velocityY+=(pointerY-cursorY)*.19*dt;
 velocityX*=Math.pow(.66,dt);velocityY*=Math.pow(.66,dt);
 cursorX+=velocityX*dt;cursorY+=velocityY*dt;
 cursor.style.transform=`translate3d(${cursorX}px,${cursorY}px,0) translate(-50%,-50%)`;
 if(Math.abs(pointerX-cursorX)+Math.abs(pointerY-cursorY)+Math.abs(velocityX)+Math.abs(velocityY)>.08)cursorFrame=requestAnimationFrame(springCursor);else{cursorFrame=0;cursorTime=0;}
}
function hideCursor(){cursor.classList.remove('active');document.documentElement.classList.remove('custom-cursor');}
window.addEventListener('pointermove',e=>{
 if(!finePointer.matches||reduceMotion.matches||e.pointerType==='touch'){hideCursor();return;}
 pointerX=e.clientX;pointerY=e.clientY;
 if(!cursor.classList.contains('active')){cursorX=pointerX;cursorY=pointerY;velocityX=velocityY=0;}
 cursor.classList.add('active');document.documentElement.classList.add('custom-cursor');
 cursor.classList.toggle('hovering',!!e.target.closest('a,button,[role="tab"]'));
 if(!cursorFrame)cursorFrame=requestAnimationFrame(springCursor);
},{passive:true});
window.addEventListener('pointerdown',()=>cursor.classList.add('pressed'));
window.addEventListener('pointerup',()=>cursor.classList.remove('pressed'));
document.documentElement.addEventListener('pointerleave',hideCursor);window.addEventListener('blur',hideCursor);
document.addEventListener('keydown',e=>{if(e.key==='Tab')hideCursor();});
finePointer.addEventListener('change',hideCursor);
reduceMotion.addEventListener('change',()=>{hideCursor();heroPhoto.style.transform='';document.documentElement.classList.remove('js-motion');updateScroll();});

// Keep the chosen light/dark appearance through reloads.
const themeButton=document.querySelector('.theme-toggle');
function applyTheme(dark){
 document.documentElement.dataset.theme=dark?'dark':'light';
 themeButton.setAttribute('aria-pressed',String(dark));
 const label=dark?'Switch to light mode':'Switch to dark mode';themeButton.setAttribute('aria-label',label);themeButton.title=label;
 document.querySelector('meta[name="theme-color"]').content=dark?'#151712':'#f3efe3';
}
applyTheme(document.documentElement.dataset.theme==='dark');
themeButton.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';applyTheme(dark);try{localStorage.setItem('pizza-house-theme',dark?'dark':'light');}catch{}});
document.querySelector('#year').textContent=new Date().getFullYear();

// Small editorial beats: line reveals, drifting photography and tactile controls.
if(!reduceMotion.matches){
 const textObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('text-visible','eyebrow-visible');textObserver.unobserve(entry.target);}}),{threshold:.2});
 document.querySelectorAll('main h2').forEach(heading=>{
  const nodes=[...heading.childNodes];let line=document.createElement('span');let lines=[];
  nodes.forEach(node=>{if(node.nodeName==='BR'){lines.push(line);line=document.createElement('span');}else line.append(node);});lines.push(line);
  heading.replaceChildren(...lines.map((inner,index)=>{const outer=document.createElement('span');outer.className='text-line';outer.style.setProperty('--line-delay',`${index*85}ms`);outer.append(inner);return outer;}));
  heading.classList.add('text-reveal');textObserver.observe(heading);
 });
 document.querySelectorAll('.section-top .eyebrow,.good-times-copy>.eyebrow').forEach(el=>{el.classList.add('eyebrow-reveal');textObserver.observe(el);});
 const stars=[...document.querySelectorAll('.little-star,.big-star')];
 const friends=document.querySelector('.friends-photo');
 let accentFrame=0;
 function accentMotion(){
  accentFrame=0;if(reduceMotion.matches)return;
  stars.forEach(star=>{const box=star.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)star.style.setProperty('--star-turn',`${(innerHeight/2-box.top)*.045}deg`);});
  const box=document.querySelector('.good-times').getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)friends.style.transform=`translateY(${clamp((innerHeight/2-box.top-box.height/2)*.045,-30,30)}px)`;
 }
 window.addEventListener('scroll',()=>{if(!accentFrame)accentFrame=requestAnimationFrame(accentMotion);},{passive:true});accentMotion();
 document.querySelectorAll('.button,.theme-toggle,.dish-arrows button').forEach(button=>{
  button.addEventListener('pointermove',e=>{if(!finePointer.matches||reduceMotion.matches||e.pointerType==='touch')return;const box=button.getBoundingClientRect();button.style.setProperty('--magnet-x',`${clamp((e.clientX-box.left-box.width/2)*.07,-4,4)}px`);button.style.setProperty('--magnet-y',`${clamp((e.clientY-box.top-box.height/2)*.1,-3,3)}px`);});
  button.addEventListener('pointerleave',()=>{button.style.setProperty('--magnet-x','0px');button.style.setProperty('--magnet-y','0px');});
 });
}
