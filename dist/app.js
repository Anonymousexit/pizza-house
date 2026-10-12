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
function showCategory(category){panel.replaceChildren(...menu[category].map(([name,description])=>{const row=document.createElement('article');row.className='menu-item';const h=document.createElement('h3');h.textContent=name;const p=document.createElement('p');p.textContent=description;row.append(h,p);return row;}));tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});panel.setAttribute('aria-labelledby',`tab-${category}`);}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>showCategory(tab.dataset.category));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();showCategory(tabs[next].dataset.category);}});});
document.querySelectorAll('[data-menu]').forEach(button=>button.addEventListener('click',()=>{returnFocus=nav.contains(button)?navToggle:button;closeNav();showCategory('pizza');dialog.showModal();document.body.classList.add('locked');}));
document.querySelector('.close-menu').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('locked');returnFocus?.focus();});
showCategory('pizza');
if(!reduceMotion.matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
let ticking=false;const heroPhoto=document.querySelector('.hero-photo');const heroCopy=document.querySelector('.hero-copy');
function updateScroll(){const y=window.scrollY;header.classList.toggle('scrolled',y>60);if(!reduceMotion.matches&&y<window.innerHeight*1.3){heroPhoto.style.transform=`translateY(${y*.22}px)`;heroCopy.style.opacity=String(Math.max(0,1-y/(window.innerHeight*.65)));}ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();
document.querySelector('#year').textContent=new Date().getFullYear();
