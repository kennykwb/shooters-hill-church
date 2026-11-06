const socialIcons={youtube:'<path d="M23 7s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.5 12 3.5 12 3.5s-4.4 0-7.7.2c-.5.1-1.5.1-2.4 1C1.2 5.4 1 7 1 7S.8 8.8.8 10.7v1.8C.8 14.4 1 16 1 16s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 7.5.2 7.5.2s4.4 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.6.2-3.5v-1.8C23.2 8.8 23 7 23 7zM9.7 15.3V7.9l6.4 3.7-6.4 3.7z"/>',facebook:'<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>'};
const socialLinks=[['youtube','YouTube',yt],['facebook','Facebook',fb],['instagram','Instagram',ig]];
function socials(labelled=false){return `<div class="social-icons" aria-label="Church social media">${socialLinks.map(([key,name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Shooters Hill on ${name} (opens in a new tab)" title="${name}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${socialIcons[key]}</svg>${labelled?`<span>${name}</span>`:''}</a>`).join('')}</div>`}
const strip=document.createElement('div');strip.className='connect-strip';strip.innerHTML=`<span>We are not just a church; we are family!</span>${socials()}`;document.querySelector('header').before(strip);
document.querySelector('.footer-grid>div:first-child').insertAdjacentHTML('beforeend',socials());
const pagePath = location.pathname.replace(/index.html$/, '');
const gatherings = [
  {
    id: 'evening-of-information',
    title: 'An Evening of Information',
    date: 'Saturday, 7 November 2026',
    time: '4:00 pm',
    caption: 'Bring your family and your questions to Shooters Hill. An attorney will explain wills and land titles, a Sagicor representative will discuss insurance and financial protection, and a funeral director from Golden Gates Mortuary Ltd will walk us through funeral arrangements. Join us for an evening of conversation about the decisions families face when planning ahead.',
    image: '/assets/evening-of-information-2026.jpg',
    calendar: '/evening-of-information.ics'
  },
  {
    id: 'uncommon-favor',
    title: 'Uncommon Favor 2026',
    date: 'Saturday, 12 December 2026',
    time: '9:30 am',
    caption: 'Join our church family for the 11th staging of Uncommon Favor. This year’s theme is “From Limitations to Elevation.” Gather with us in Shooters Hill, Bull Bay, St. Andrew, or follow our official channels for livestream updates.',
    image: '/assets/uncommon-favor-2026.jpg',
    calendar: '/uncommon-favor-2026.ics'
  }
];

function eventCard(event) {
  const artwork = event.image
    ? `<a class="gathering-art" href="${event.image}" data-flyer="${event.id}" aria-label="View full ${event.title} flyer"><img loading="lazy" src="${event.image}" alt="${event.title} flyer"></a>`
    : `<div class="gathering-type" aria-hidden="true"><img src="/assets/church-logo-updated.png" alt=""><span>An Evening of</span><b>Information</b><small>Legal matters · Insurance · Funeral planning</small></div>`;
  return `<article class="gathering" id="${event.id}">${artwork}<div class="gathering-body">
    <p class="gathering-date">${event.date} · ${event.time} Jamaica time</p>
    <h2>${event.title}</h2><p>${event.caption}</p>
    <div class="actions"><a class="btn" href="${maps}" target="_blank" rel="noopener noreferrer">Get directions ↗</a>
    <a class="btn outline" href="${event.calendar}" download>Add to calendar ↓</a></div>
    <button type="button" class="share-event textlink" data-share="${event.id}">Share event ↗</button>
    <span class="share-status" role="status"></span></div></article>`;
}

function gatheringsSection() {
  return `<section class="gatherings-section"><h2>Upcoming gatherings</h2><div class="gathering-grid">${gatherings.map(eventCard).join('')}</div></section>`;
}

if (pagePath === '/updates/') {
  document.querySelector('main').innerHTML = `<div class="updates-head"><span class="eyebrow">Life at Shooters Hill</span><h1>Church Life<br><em>& Updates</em></h1><p>Gatherings, announcements and moments from our church family.</p></div>${gatheringsSection()}<section class="updates-connect"><div><h2>Follow our church</h2><p>Find service broadcasts and announcements on our official channels.</p></div>${socials(true)}</section>`;
}
if (pagePath === '/events/') {
  document.querySelector('.pagehead').insertAdjacentHTML('afterend', gatheringsSection());
  document.querySelectorAll('.notice').forEach(note => {
    if (note.textContent.includes('No upcoming special events')) note.remove();
  });
}
if (pagePath === '/') {
  document.querySelector('main>.visit').insertAdjacentHTML('beforebegin', gatheringsSection());
 const hero=document.querySelector('.hero');hero.querySelector('.hero-content').innerHTML='<div class="eyebrow" id="slide-tag"></div><h1 id="slide-title"></h1><p id="slide-copy"></p><div class="actions" id="slide-actions"></div>';
 const slides=[
 ['We are family','We are not just a church;<br><em>we are family!</em>','Welcome to Shooters Hill. A place to worship, grow and share life together.','/assets/slide-5.webp','50% 0%','/contact/','Plan your visit'],
 ['New beginnings','A step of faith.<br><em>A new beginning.</em>','Growing in faith, together as a church family.','/assets/slide-1.webp','52% 0%','/about/documents/beliefs/','Explore our faith'],
 ['Care & connection','Together in faith.<br><em>Close in fellowship.</em>','Join us for worship and encouragement every Sabbath.','/assets/slide-2.webp','53% 0%','/contact/','Join us this Sabbath'],
 ['Worship & prayer','Many voices.<br><em>One family.</em>','Gather with us in Shooters Hill on Saturdays, 9:30 am–4:00 pm.','/assets/slide-3.webp','50% 0%','/watch/','Watch online'],
 ['Life at Shooters Hill','Faith shared.<br><em>Community celebrated.</em>','Discover the gatherings and moments that bring us together.','/assets/slide-4.webp','50% 0%','/updates/','Church life & updates']];
 hero.insertAdjacentHTML('afterbegin',`<div class="hero-photos" aria-hidden="true">${slides.map((s,i)=>`<img src="${s[3]}" alt="" style="object-position:${s[4]}" ${i===0?'fetchpriority="high"':''}>`).join('')}</div>`);
 hero.style.background='none';let slide=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;const dots=hero.querySelector('.dots');dots.innerHTML=slides.map((s,i)=>`<button class="dot" aria-label="Show photo ${i+1}: ${s[0]}" data-slide="${i}"></button>`).join('');
 function show(n){slide=(n+slides.length)%slides.length;const s=slides[slide];hero.querySelector('#slide-tag').textContent=s[0];hero.querySelector('#slide-title').innerHTML=s[1];hero.querySelector('#slide-copy').textContent=s[2];hero.querySelector('#slide-actions').innerHTML=`<a class="btn light" href="${s[5]}">${s[6]} ↗</a>`;hero.querySelectorAll('.hero-photos img').forEach((im,i)=>im.classList.toggle('visible',i===slide));dots.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===slide);b.setAttribute('aria-pressed',String(i===slide))});}
 let touchStart=null;
 hero.addEventListener('touchstart',e=>{if(e.touches.length===1&&!e.target.closest('a,button'))touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
 hero.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(slide+(dx<0?1:-1));},{passive:true});
 hero.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
 dots.querySelectorAll('button').forEach(b=>b.onclick=()=>show(+b.dataset.slide));hero.querySelector('#prev').onclick=()=>show(slide-1);hero.querySelector('#next').onclick=()=>show(slide+1);const pause=hero.querySelector('#pause');function state(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow')}pause.onclick=()=>{paused=!paused;state()};state();show(0);setInterval(()=>{if(!paused&&!document.hidden&&!hero.matches(':hover,:focus-within'))show(slide+1)},10000);
}
document.querySelectorAll('[data-flyer]').forEach(link => {
  const event = gatherings.find(item => item.id === link.dataset.flyer);
  const dialog = document.createElement('dialog');
  dialog.className = 'flyer-dialog';
  dialog.setAttribute('aria-label', event.title + ' flyer');
  dialog.innerHTML = `<button class="close-flyer">Close ×</button><img src="${event.image}" loading="lazy" alt="${event.title} flyer"><a href="${event.image}" download>Download flyer ↓</a>`;
  document.body.append(dialog);
  link.onclick = e => { e.preventDefault(); dialog.showModal(); };
  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.onclick = e => { if (e.target === dialog) dialog.close(); };
});
document.querySelectorAll('[data-share]').forEach(button => {
  button.onclick = async () => {
    const event = gatherings.find(item => item.id === button.dataset.share);
    const url = location.origin + '/updates/#' + event.id;
    try {
      if (navigator.share) await navigator.share({title:event.title, text:event.date + ' · ' + event.time, url});
      else { await navigator.clipboard.writeText(url); button.nextElementSibling.textContent = 'Event link copied.'; }
    } catch (error) {
      if (error.name !== 'AbortError') button.nextElementSibling.textContent = url;
    }
  };
});
