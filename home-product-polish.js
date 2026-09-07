(()=>{
  if(window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__)return;
  window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__=true;

  const area=document.getElementById('area');
  const form=document.getElementById('careSearchForm');
  const careQuery=document.getElementById('careQuery');
  if(!area||!form||!careQuery)return;

  // Keep homepage enhancements deliberately side-effect-light. The previous
  // implementation observed the results grid and then rewrote that same grid
  // from inside the observer, which could create a self-triggering mutation
  // loop and make mobile browsers appear completely unresponsive.
  const normalize=v=>String(v||'').trim().toLowerCase();
  const areaAliases=new Map([
    ['ginza','Chuo'],['tsukiji','Chuo'],['nihonbashi','Chuo'],
    ['marunouchi','Chiyoda'],['otemachi','Chiyoda'],['akihabara','Chiyoda'],['tokyo','Chiyoda'],
    ['roppongi','Minato'],['akasaka','Minato'],['shinagawa','Minato'],
    ['shibuya','Shibuya'],['ebisu','Shibuya'],['harajuku','Shibuya'],
    ['shinjuku','Shinjuku'],['kabukicho','Shinjuku'],
    ['ikebukuro','Toshima'],['ueno','Taito'],['asakusa','Taito'],
    ['bunkyo','Bunkyo'],['hongo','Bunkyo']
  ]);

  function canonicalArea(value){
    const raw=normalize(value)
      .replace(/^tokyo\s+/,'')
      .replace(/\s+(station|st\.?|ward|ku)$/,'')
      .replace(/[-‐‑–—]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
    return areaAliases.get(raw)||value.trim();
  }

  form.addEventListener('submit',()=>{
    const original=area.value.trim();
    if(!original)return;
    const canonical=canonicalArea(original);
    if(canonical!==original){
      area.dataset.enteredArea=original;
      area.value=canonical;
    }else{
      delete area.dataset.enteredArea;
    }
  },true);

  const urgentTerms=[
    'chest pain','difficulty breathing','trouble breathing','shortness of breath',
    'cannot breathe','can\'t breathe','stroke','face droop','arm weakness',
    'slurred speech','unconscious','unresponsive','severe bleeding','heavy bleeding',
    'seizure','convulsion'
  ];

  const urgentNotice=document.createElement('aside');
  urgentNotice.className='home-urgent-notice';
  urgentNotice.hidden=true;
  urgentNotice.setAttribute('role','alert');
  urgentNotice.innerHTML='<div><strong>This may need urgent care.</strong><span>Japan Health is not an emergency-triage service. If you think this could be a medical emergency in Japan, call 119 or go to an emergency department.</span></div><a class="home-urgent-call" href="tel:119" aria-label="Call emergency services in Japan at 119">Call 119</a>';
  form.insertAdjacentElement('afterend',urgentNotice);

  function updateUrgentNotice(){
    const query=normalize(careQuery.value);
    urgentNotice.hidden=!urgentTerms.some(term=>query.includes(term));
  }
  careQuery.addEventListener('input',updateUrgentNotice);
  form.addEventListener('submit',updateUrgentNotice,true);
  updateUrgentNotice();

  if(!document.getElementById('tokyo-area-suggestions')){
    const datalist=document.createElement('datalist');
    datalist.id='tokyo-area-suggestions';
    ['Ginza','Shinjuku','Shibuya','Roppongi','Akihabara','Tokyo Station','Marunouchi','Ikebukuro','Ueno','Bunkyo','Tsukiji'].forEach(name=>{
      const option=document.createElement('option');
      option.value=name;
      datalist.appendChild(option);
    });
    area.setAttribute('list',datalist.id);
    area.insertAdjacentElement('afterend',datalist);
  }

  const style=document.createElement('style');
  style.textContent='.home-urgent-notice{max-width:calc(1180px - 56px);margin:12px auto 0;padding:14px 16px;border:1px solid #f0b8a8;border-radius:14px;background:#fff7f4;color:#713220;display:flex;align-items:center;justify-content:space-between;gap:16px}.home-urgent-notice[hidden]{display:none!important}.home-urgent-notice div{display:grid;gap:3px}.home-urgent-notice strong{font-size:12px}.home-urgent-notice span{font-size:10px;line-height:1.5;color:#7a493a}.home-urgent-call{flex:0 0 auto;border-radius:10px;padding:10px 14px;background:#a52d1d;color:#fff;text-decoration:none;font-size:11px;font-weight:900}@media(max-width:700px){.home-urgent-notice{margin:12px 20px 0;align-items:flex-start}}@media(max-width:520px){.home-urgent-notice{flex-direction:column}.home-urgent-call{width:100%;box-sizing:border-box;text-align:center}}';
  document.head.appendChild(style);
})();
