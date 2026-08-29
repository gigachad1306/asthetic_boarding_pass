(function(){
  'use strict';

  /* ============================================================
     Airline brand colors — curated. Tints each pass by airline.
     ============================================================ */
  const AIRLINE_COLORS = {
    AI:{primary:'#E0272A',secondary:'#F5A623'}, '6E':{primary:'#13294B',secondary:'#F58220'},
    UK:{primary:'#5C2D91',secondary:'#F2A900'}, SG:{primary:'#EE2E24',secondary:'#FFCB05'},
    EK:{primary:'#D71920',secondary:'#C09A5B'}, QR:{primary:'#5C0632',secondary:'#8A1538'},
    EY:{primary:'#5D3954',secondary:'#BD8B13'}, BA:{primary:'#075AAA',secondary:'#EB2226'},
    AF:{primary:'#002157',secondary:'#EF3340'}, LH:{primary:'#05164D',secondary:'#F9BA00'},
    SQ:{primary:'#1A3668',secondary:'#F99F1C'}, CX:{primary:'#00543C',secondary:'#A79A78'},
    TG:{primary:'#4B0082',secondary:'#8E1537'}, JL:{primary:'#C4122E',secondary:'#4C4C4C'},
    NH:{primary:'#00468C',secondary:'#1BA3DE'}, DL:{primary:'#A6192E',secondary:'#003366'},
    AA:{primary:'#0078D2',secondary:'#C8102E'}, UA:{primary:'#002244',secondary:'#0091D0'},
    WN:{primary:'#304CB2',secondary:'#F9B612'}, AC:{primary:'#D22630',secondary:'#1B1B1B'},
    QF:{primary:'#E40000',secondary:'#1B1B1B'}, NZ:{primary:'#00205B',secondary:'#1B1B1B'},
    TK:{primary:'#C50830',secondary:'#5D2E0C'}, LX:{primary:'#E30613',secondary:'#1D1D1B'},
    KL:{primary:'#00A1DE',secondary:'#003876'}, IB:{primary:'#D7192D',secondary:'#F8B02C'},
    AZ:{primary:'#008C45',secondary:'#CD212A'}, FR:{primary:'#073590',secondary:'#F4C300'},
    U2:{primary:'#FF6600',secondary:'#12295C'}, VS:{primary:'#E10A0A',secondary:'#2E1A47'},
    B6:{primary:'#0033A0',secondary:'#00A0DF'}, AS:{primary:'#00385E',secondary:'#7AC142'},
    MH:{primary:'#1B1B1B',secondary:'#C8102E'}, GA:{primary:'#003876',secondary:'#00A651'},
    PR:{primary:'#003DA5',secondary:'#EE2E24'}, VN:{primary:'#00369C',secondary:'#FFCC29'},
    KE:{primary:'#00256C',secondary:'#8B7355'}, OZ:{primary:'#00349B',secondary:'#B10041'},
    CA:{primary:'#B90E27',secondary:'#F4A11D'}, MU:{primary:'#B90E27',secondary:'#1D3E7C'},
    CZ:{primary:'#008542',secondary:'#B90E27'}, ET:{primary:'#578237',secondary:'#F9B517'},
    SA:{primary:'#003876',secondary:'#F4A11D'}, LA:{primary:'#1B1B1B',secondary:'#E4032E'},
    AV:{primary:'#E4032E',secondary:'#1B1B1B'}, AM:{primary:'#00693E',secondary:'#C6093B'},
    AR:{primary:'#74ACDF',secondary:'#1B1B1B'}, IX:{primary:'#C1272D',secondary:'#F7941E'},
    G8:{primary:'#8DC63F',secondary:'#1B1B1B'}, I5:{primary:'#E4032E',secondary:'#F4A11D'}
  };
  // House green as the default accent, keeping the Voyage look for unknown airlines.
  const DEFAULT_ACCENT = {primary:'#183c32', secondary:'#d77b45'};

  /* ============================================================
     Fallback datasets (instant), enriched by live fetch below.
     ============================================================ */
  const FALLBACK_AIRPORTS = [
    ['DEL','Indira Gandhi International','Delhi','India'],['BOM','Chhatrapati Shivaji Maharaj Intl','Mumbai','India'],
    ['BLR','Kempegowda International','Bengaluru','India'],['MAA','Chennai International','Chennai','India'],
    ['HYD','Rajiv Gandhi International','Hyderabad','India'],['CCU','Netaji Subhas Chandra Bose Intl','Kolkata','India'],
    ['AMD','Sardar Vallabhbhai Patel Intl','Ahmedabad','India'],['IXJ','Jammu Airport','Jammu','India'],
    ['PNQ','Pune Airport','Pune','India'],['GOI','Goa International (Dabolim)','Goa','India'],
    ['GOX','Manohar International','Goa','India'],['COK','Cochin International','Kochi','India'],
    ['JAI','Jaipur International','Jaipur','India'],['IXC','Chandigarh Airport','Chandigarh','India'],
    ['LKO','Chaudhary Charan Singh Intl','Lucknow','India'],['SXR','Srinagar Airport','Srinagar','India'],
    ['JFK','John F. Kennedy International','New York','United States'],['EWR','Newark Liberty International','Newark','United States'],
    ['LAX','Los Angeles International','Los Angeles','United States'],['ORD',"O'Hare International",'Chicago','United States'],
    ['SFO','San Francisco International','San Francisco','United States'],['LHR','Heathrow','London','United Kingdom'],
    ['LGW','Gatwick','London','United Kingdom'],['LCY','London City','London','United Kingdom'],
    ['STN','Stansted','London','United Kingdom'],['CDG','Charles de Gaulle','Paris','France'],
    ['ORY','Orly','Paris','France'],['AMS','Schiphol','Amsterdam','Netherlands'],
    ['FRA','Frankfurt Airport','Frankfurt','Germany'],['MUC','Munich Airport','Munich','Germany'],
    ['DXB','Dubai International','Dubai','United Arab Emirates'],['AUH','Abu Dhabi International','Abu Dhabi','United Arab Emirates'],
    ['DOH','Hamad International','Doha','Qatar'],['IST','Istanbul Airport','Istanbul','Turkey'],
    ['SIN','Changi Airport','Singapore','Singapore'],['HKG','Hong Kong International','Hong Kong','Hong Kong'],
    ['ICN','Incheon International','Seoul','South Korea'],['NRT','Narita International','Tokyo','Japan'],
    ['HND','Haneda Airport','Tokyo','Japan'],['BKK','Suvarnabhumi Airport','Bangkok','Thailand'],
    ['KUL','Kuala Lumpur International','Kuala Lumpur','Malaysia'],['CGK','Soekarno-Hatta International','Jakarta','Indonesia'],
    ['SYD','Kingsford Smith','Sydney','Australia'],['MEL','Melbourne Airport','Melbourne','Australia'],
    ['AKL','Auckland Airport','Auckland','New Zealand'],['YYZ','Toronto Pearson','Toronto','Canada'],
    ['YVR','Vancouver International','Vancouver','Canada'],['GRU','Guarulhos International','Sao Paulo','Brazil'],
    ['EZE','Ministro Pistarini','Buenos Aires','Argentina'],['JNB','O.R. Tambo International','Johannesburg','South Africa'],
    ['CAI','Cairo International','Cairo','Egypt'],['ADD','Bole International','Addis Ababa','Ethiopia'],
    ['KEF','Keflavik International','Reykjavik','Iceland'],['CPH','Copenhagen Airport','Copenhagen','Denmark'],
    ['ARN','Stockholm Arlanda','Stockholm','Sweden'],['OSL','Oslo Airport','Oslo','Norway'],
    ['ZRH','Zurich Airport','Zurich','Switzerland'],['VIE','Vienna International','Vienna','Austria'],
    ['FCO','Leonardo da Vinci','Rome','Italy'],['MXP','Malpensa','Milan','Italy'],
    ['MAD','Adolfo Suarez Barajas','Madrid','Spain'],['BCN','Barcelona-El Prat','Barcelona','Spain'],
    ['LIS','Humberto Delgado','Lisbon','Portugal'],['ATH','Athens International','Athens','Greece'],
    ['MEX','Mexico City International','Mexico City','Mexico'],['YYC','Calgary International','Calgary','Canada']
  ].map(a => ({iata:a[0], name:a[1], city:a[2], country:a[3]}));

  const AIRLINE_NAMES = {
    AI:'Air India', '6E':'IndiGo', UK:'Vistara', SG:'SpiceJet', EK:'Emirates', QR:'Qatar Airways',
    EY:'Etihad Airways', BA:'British Airways', AF:'Air France', LH:'Lufthansa', SQ:'Singapore Airlines',
    CX:'Cathay Pacific', TG:'Thai Airways', JL:'Japan Airlines', NH:'All Nippon Airways', DL:'Delta Air Lines',
    AA:'American Airlines', UA:'United Airlines', WN:'Southwest Airlines', AC:'Air Canada', QF:'Qantas',
    NZ:'Air New Zealand', TK:'Turkish Airlines', LX:'Swiss International Air Lines', KL:'KLM',
    IB:'Iberia', AZ:'ITA Airways', FR:'Ryanair', U2:'easyJet', VS:'Virgin Atlantic', B6:'JetBlue',
    AS:'Alaska Airlines', MH:'Malaysia Airlines', GA:'Garuda Indonesia', PR:'Philippine Airlines',
    VN:'Vietnam Airlines', KE:'Korean Air', OZ:'Asiana Airlines', CA:'Air China', MU:'China Eastern',
    CZ:'China Southern', ET:'Ethiopian Airlines', SA:'South African Airways', LA:'LATAM Airlines',
    AV:'Avianca', AM:'Aeromexico', AR:'Aerolineas Argentinas', IX:'Air India Express', G8:'Go First', I5:'AirAsia India'
  };
  const FALLBACK_AIRLINE_LIST = Object.keys(AIRLINE_NAMES).map(code => ({iata: code, name: AIRLINE_NAMES[code]}));

  let AIRPORTS = FALLBACK_AIRPORTS.slice();
  let AIRLINES = FALLBACK_AIRLINE_LIST.slice();

  const $ = id => document.getElementById(id);
  const dataStatus = $('dataStatus');

  function mergeByIata(base, extra){
    const seen = new Set(base.map(x => x.iata));
    extra.forEach(x => { if(x.iata && !seen.has(x.iata)){ base.push(x); seen.add(x.iata); } });
    return base;
  }

  /* Live enrichment: ~29k airports + airline name→code map. */
  fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(json => {
      const extra = Object.values(json)
        .filter(a => a.iata && a.iata.length === 3)
        .map(a => ({ iata: a.iata, name: a.name, city: a.city || a.name, country: a.country }));
      AIRPORTS = mergeByIata(AIRPORTS, extra); updateStatus();
    }).catch(updateStatus);

  fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat')
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(text => {
      const rows = parseCsv(text);
      const extra = rows
        .filter(r => r[3] && r[3] !== '\\N' && r[3].trim().length === 2 && r[7] === 'Y')
        .map(r => ({ iata: r[3].trim(), name: r[1].trim() }));
      AIRLINES = mergeByIata(AIRLINES, extra); updateStatus();
    }).catch(updateStatus);

  let loadTicks = 0;
  function updateStatus(){
    loadTicks++;
    dataStatus.textContent = 'Live lookup ready — ' + AIRPORTS.length + ' airports, ' + AIRLINES.length + ' airlines.';
    if(loadTicks >= 2 || AIRPORTS.length > 100){
      setTimeout(() => { dataStatus.textContent = ''; }, 2500);
    }
  }
  setTimeout(() => {
    if(dataStatus && !dataStatus.textContent.startsWith('Live')){
      dataStatus.textContent = 'Using built-in list (' + AIRPORTS.length + ' airports). Live lookups may still arrive.';
    }
  }, 2500);

  function parseCsv(text){
    const rows = []; let row = [], field = '', inQuotes = false;
    for(let i=0;i<text.length;i++){
      const c = text[i];
      if(inQuotes){
        if(c === '"'){ if(text[i+1] === '"'){ field += '"'; i++; } else inQuotes = false; }
        else field += c;
      } else {
        if(c === '"') inQuotes = true;
        else if(c === ','){ row.push(field); field=''; }
        else if(c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; }
        else if(c === '\r'){ /* skip */ }
        else field += c;
      }
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    return rows;
  }

  /* ============================================================
     Autocomplete
     ============================================================ */
  function searchAirports(q){
    q = q.trim().toLowerCase(); if(!q) return [];
    const starts = [], includes = [];
    for(const a of AIRPORTS){
      const hay = (a.city + ' ' + a.name + ' ' + a.iata).toLowerCase();
      if(a.iata.toLowerCase() === q || a.city.toLowerCase().startsWith(q)) starts.push(a);
      else if(hay.includes(q)) includes.push(a);
    }
    return starts.concat(includes).slice(0, 8);
  }
  function searchAirlines(q){
    q = q.trim().toLowerCase(); if(!q) return [];
    const starts = [], includes = [];
    for(const a of AIRLINES){
      const hay = (a.name + ' ' + a.iata).toLowerCase();
      if(a.name.toLowerCase().startsWith(q) || a.iata.toLowerCase() === q) starts.push(a);
      else if(hay.includes(q)) includes.push(a);
    }
    return starts.concat(includes).slice(0, 8);
  }
  const exactCity = q => AIRPORTS.filter(a => a.city.toLowerCase() === q.trim().toLowerCase());
  const exactAirline = q => AIRLINES.filter(a => a.name.toLowerCase() === q.trim().toLowerCase());

  function wireAutocomplete(inputId, listId, searchFn, renderItem, onSelect){
    const input = $(inputId), list = $(listId);
    let activeIndex = -1, currentResults = [];
    function close(){ list.classList.remove('open'); list.innerHTML=''; activeIndex=-1; }
    function open(results){
      currentResults = results;
      list.innerHTML = results.map((r,i) => renderItem(r,i)).join('');
      list.classList.toggle('open', results.length > 0);
      activeIndex = -1;
      Array.from(list.children).forEach((btn, i) => {
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); pick(i); });
      });
    }
    function pick(i){ const r = currentResults[i]; if(!r) return; onSelect(input, r); close(); refreshPreview(); }
    input.addEventListener('input', () => {
      delete input.dataset.code; delete input.dataset.name; delete input.dataset.city;
      open(searchFn(input.value));
    });
    input.addEventListener('keydown', (e) => {
      const items = Array.from(list.children);
      if(e.key === 'ArrowDown'){ e.preventDefault(); activeIndex = Math.min(activeIndex+1, items.length-1); hl(items); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); activeIndex = Math.max(activeIndex-1, 0); hl(items); }
      else if(e.key === 'Enter'){ if(activeIndex >= 0){ e.preventDefault(); pick(activeIndex); } }
      else if(e.key === 'Escape'){ close(); }
    });
    function hl(items){ items.forEach((it,i)=>it.classList.toggle('active', i===activeIndex)); if(items[activeIndex]) items[activeIndex].scrollIntoView({block:'nearest'}); }
    input.addEventListener('blur', () => setTimeout(close, 120));
  }

  wireAutocomplete('from', 'fromList', searchAirports,
    (a) => `<button type="button"><span class="ac-main">${esc(a.iata)} — ${esc(a.city)}</span><span class="ac-sub">${esc(a.name)}, ${esc(a.country)}</span></button>`,
    (input, a) => { input.value = a.city; input.dataset.code = a.iata; input.dataset.name = a.name; input.dataset.city = a.city; });
  wireAutocomplete('to', 'toList', searchAirports,
    (a) => `<button type="button"><span class="ac-main">${esc(a.iata)} — ${esc(a.city)}</span><span class="ac-sub">${esc(a.name)}, ${esc(a.country)}</span></button>`,
    (input, a) => { input.value = a.city; input.dataset.code = a.iata; input.dataset.name = a.name; input.dataset.city = a.city; });
  wireAutocomplete('airline', 'airlineList', searchAirlines,
    (a) => `<button type="button"><span class="ac-main">${esc(a.name)}</span><span class="ac-sub">${esc(a.iata)}</span></button>`,
    (input, a) => { input.value = a.name; input.dataset.code = a.iata; });

  function resolveAirport(input){
    if(input.dataset.code) return { iata: input.dataset.code, city: input.dataset.city, approx:false };
    const m = exactCity(input.value);
    if(m.length === 1) return { iata: m[0].iata, city: m[0].city, approx:false };
    const clean = (input.value||'').trim().replace(/[^a-zA-Z]/g,'');
    return { iata: (clean.slice(0,3)||'???').toUpperCase(), city: input.value.trim(), approx:true };
  }
  function resolveAirline(input){
    if(input.dataset.code) return { iata: input.dataset.code, name: input.value.trim() };
    const m = exactAirline(input.value);
    if(m.length === 1) return { iata: m[0].iata, name: m[0].name };
    // maybe they typed a 2-char code directly
    const v = input.value.trim();
    if(/^[A-Za-z0-9]{2}$/.test(v) && AIRLINE_NAMES[v.toUpperCase()]) return { iata:v.toUpperCase(), name:AIRLINE_NAMES[v.toUpperCase()] };
    return { iata: null, name: v };
  }

  /* ============================================================
     Helpers
     ============================================================ */
  function esc(str){
    return (str||'').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function fmtDate(iso){
    if(!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    if(isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
  }
  function fmtTime(t){
    if(!t) return '—';
    const [h,m] = t.split(':'); const hour = parseInt(h,10);
    const ampm = hour >= 12 ? 'PM' : 'AM'; const h12 = ((hour + 11) % 12) + 1;
    return h12 + ':' + m + ' ' + ampm;
  }
  // Real boarding-pass name format: LASTNAME/FIRSTNAME (falls back gracefully).
  function paxName(last, first){
    last = (last||'').trim(); first = (first||'').trim();
    if(!last && !first) return 'PASSENGER NAME';
    if(!first) return last.toUpperCase();
    if(!last) return first.toUpperCase();
    return (last + ', ' + first).toUpperCase();
  }
  function randomPNR(){
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r = '';
    for(let i=0;i<6;i++) r += chars[Math.floor(Math.random()*chars.length)];
    return r;
  }
  function logoUrl(iata){ return 'https://images.kiwi.com/airlines/64/' + encodeURIComponent(iata) + '.png'; }

  // Deterministic barcode bars from a seed string.
  function barcodeBars(seedStr){
    const s = String(seedStr || 'VOYAGE'); let seed = 0;
    for(let i=0;i<s.length;i++) seed += s.charCodeAt(i) * (i + 1);
    let html = '';
    for(let i=0;i<42;i++){
      const n = Math.abs(Math.sin(seed + i * 17));
      const w = Math.max(1, Math.floor(n * 5) + 1);
      html += `<i style="width:${w}px"></i>`;
    }
    return html;
  }

  /* ============================================================
     Card rendering (Voyage boarding pass)
     ============================================================ */
  function buildCardHTML(d){
    const accent = (d.airlineCode && AIRLINE_COLORS[d.airlineCode]) || DEFAULT_ACCENT;
    const logoInner = d.airlineCode
      ? `<img crossorigin="anonymous" src="${logoUrl(d.airlineCode)}" alt="" onerror="this.remove()">`
      : (d.airlineCode || '✦');
    const codeMark = d.airlineCode ? esc(d.airlineCode) : '✦';
    const flightLabel = ((d.airlineCode||'') + ' ' + d.flightNo).trim();

    return `
    <div class="boarding-pass" style="--accent:${accent.primary}; --accent-2:${accent.secondary}">
      <div class="boarding-main">
        <div class="pass-top">
          <div class="airline">
            <div class="airline-logo">${logoInner || codeMark}</div>
            <div class="airline-info">
              <strong>${esc(d.airline) || 'Airline'}</strong>
              <small>Flight ${esc(flightLabel) || '—'}</small>
            </div>
          </div>
          <div class="pass-type"><b>VOYAGE</b>Boarding Pass</div>
        </div>

        <div class="passenger-line">
          <span class="pl-label">Passenger</span>
          <span class="pl-name">${esc(d.paxName)}</span>
        </div>

        <div class="route">
          <div class="airport">
            <div class="airport-code${d.fromApprox ? ' approx' : ''}">${esc(d.fromCode)}</div>
            <div class="city-name">${esc(d.fromCity)}</div>
          </div>
          <div class="route-line"><div class="line"></div><div class="plane">✈</div><div class="line"></div></div>
          <div class="airport">
            <div class="airport-code${d.toApprox ? ' approx' : ''}">${esc(d.toCode)}</div>
            <div class="city-name">${esc(d.toCity)}</div>
          </div>
        </div>

        <div class="pass-details">
          <div><span class="detail-label">Date</span><strong class="detail-value">${fmtDate(d.date)}</strong></div>
          <div><span class="detail-label">Boarding</span><strong class="detail-value">${fmtTime(d.boarding)}</strong></div>
          <div><span class="detail-label">Gate</span><strong class="detail-value">${esc(d.gate) || '—'}</strong></div>
          <div><span class="detail-label">Term.</span><strong class="detail-value">${esc(d.terminal) || '—'}</strong></div>
          <div><span class="detail-label">Class</span><strong class="detail-value">${esc(d.cls)}</strong></div>
        </div>

        ${d.note ? `<div class="memory-note">“${esc(d.note)}”</div>` : ''}
      </div>

      <div class="perf"></div>

      <div class="boarding-side">
        <div class="side-top"><span>BOARDING PASS</span><span>${esc(d.terminal) || 'T—'}</span></div>
        <div class="side-route">
          <div class="codes"><strong>${esc(d.fromCode)}</strong><span class="side-plane">✈</span><strong>${esc(d.toCode)}</strong></div>
        </div>
        <div class="side-pnr"><span>Booking ref · PNR</span><strong>${esc(d.pnr)}</strong></div>
        <div class="side-seat">
          <div><span>Seat</span><strong>${esc(d.seat) || '—'}</strong></div>
          <div><span>Gate</span><strong>${esc(d.gate) || '—'}</strong></div>
        </div>
        <div class="barcode">${barcodeBars(d.pnr + d.flightNo)}</div>
        <div class="barcode-number">${esc((d.pnr||'') + ' ' + (d.airlineCode||'') + d.flightNo)}</div>
      </div>
    </div>`;
  }

  /* ============================================================
     Live preview
     ============================================================ */
  function readForm(){
    const fromR = resolveAirport($('from'));
    const toR = resolveAirport($('to'));
    const airlineR = resolveAirline($('airline'));
    return {
      paxName: paxName($('lastName').value, $('firstName').value),
      airline: airlineR.name || 'Your Airline',
      airlineCode: airlineR.iata,
      flightNo: $('flightNo').value.trim(),
      fromCode: fromR.iata, fromCity: fromR.city || 'Departure', fromApprox: fromR.approx,
      toCode: toR.iata, toCity: toR.city || 'Arrival', toApprox: toR.approx,
      date: $('date').value,
      cls: ($('cls').value || 'ECONOMY').toUpperCase(),
      gate: $('gate').value.trim().toUpperCase(),
      seat: $('seat').value.trim().toUpperCase(),
      terminal: $('terminal').value.trim().toUpperCase(),
      boarding: $('boarding').value,
      pnr: ($('pnr').value.trim().toUpperCase()) || previewPNR,
      note: $('note').value.trim()
    };
  }

  let previewPNR = randomPNR();
  const livePass = $('livePass');
  function refreshPreview(){ livePass.innerHTML = buildCardHTML(readForm()); }

  // wire every field to live-update the preview
  ['lastName','firstName','airline','flightNo','cls','from','to','date','boarding','gate','seat','terminal','pnr','note']
    .forEach(id => { const el = $(id); if(el){ el.addEventListener('input', refreshPreview); el.addEventListener('change', refreshPreview); } });

  /* ============================================================
     Diary collection
     ============================================================ */
  const entries = [];
  const collectionEl = $('collection');
  const emptyState = $('emptyState');
  const tripCount = $('tripCount');
  const exportAllBtn = $('exportAll');
  const form = $('passForm');

  const ACTIONS_HTML = `
    <div class="card-actions">
      <button type="button" data-action="png">Save PNG</button>
      <button type="button" data-action="pdf">Save PDF</button>
      <button type="button" data-action="delete" class="danger">Remove</button>
    </div>`;

  function updateMeta(){
    tripCount.textContent = entries.length;
    emptyState.style.display = entries.length ? 'none' : 'block';
    exportAllBtn.hidden = entries.length === 0;
  }

  function addEntry(data){
    const id = 'p' + Date.now() + Math.random().toString(36).slice(2,6);
    entries.unshift({ id, ...data });

    const wrapper = document.createElement('div');
    wrapper.className = 'pass-card pass-enter';
    wrapper.dataset.id = id;
    wrapper.innerHTML = `<div class="pass-wrap"><div class="capture-frame">${buildCardHTML(data)}</div></div>${ACTIONS_HTML}`;
    collectionEl.prepend(wrapper);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrapper.classList.add('pass-enter-active'); wrapper.classList.remove('pass-enter');
    }));

    wrapper.addEventListener('click', onCardAction);
    updateMeta();
  }

  function removeEntry(wrapper){
    const id = wrapper.dataset.id;
    wrapper.classList.add('pass-exit');
    wrapper.addEventListener('transitionend', () => {
      wrapper.remove();
      const idx = entries.findIndex(e => e.id === id);
      if(idx > -1) entries.splice(idx, 1);
      updateMeta();
    }, { once:true });
    showToast('Journey removed');
  }

  /* ============================================================
     Capture + download (hardened)
     ============================================================ */
  // html2canvas 1.4.1 can't parse color-mix(); pre-compute an rgb() equivalent
  // for the green stub so capture never throws "unsupported color function".
  function hexToRgb(hex){
    hex = (hex||'').trim().replace('#',''); if(hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    const n = parseInt(hex,16); return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  function darken(hex, keep){ // keep = fraction of original toward black
    const c = hexToRgb(hex);
    const f = x => Math.round(x * keep);
    return `rgb(${f(c.r)}, ${f(c.g)}, ${f(c.b)})`;
  }

  function sanitizeClone(doc, dropLogos){
    if(dropLogos) doc.querySelectorAll('.airline-logo img').forEach(img => img.remove());
    // Replace the color-mix() gradient on .boarding-side with plain rgb() stops.
    doc.querySelectorAll('.boarding-pass').forEach(bp => {
      const accent = (bp.style.getPropertyValue('--accent') || '#183c32').trim();
      const side = bp.querySelector('.boarding-side');
      if(side){
        try { side.style.background = `linear-gradient(158deg, ${accent}, ${darken(accent, 0.78)})`; }
        catch(_){ side.style.background = accent; }
      }
    });
  }

  function renderFrame(frameEl, dropLogos){
    return html2canvas(frameEl, {
      backgroundColor: '#fffdf8',
      scale: 2,
      useCORS: true,
      logging: false,
      onclone: (doc) => sanitizeClone(doc, dropLogos)
    });
  }

  async function captureCanvas(frameEl){
    const canvas = await renderFrame(frameEl, false);
    try { canvas.toDataURL('image/png'); return canvas; }   // throws if tainted
    catch(_){ return renderFrame(frameEl, true); }
  }

  function canvasToBlob(canvas, type){
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas is empty or tainted.')), type);
    });
  }

  async function downloadPNG(frameEl, base){
    const canvas = await captureCanvas(frameEl);
    const blob = await canvasToBlob(canvas, 'image/png');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = base + '.png';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function downloadPDF(frameEl, base){
    const canvas = await captureCanvas(frameEl);
    const { jsPDF } = window.jspdf;
    const wMM = 210, hMM = (canvas.height / canvas.width) * wMM;
    const pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:[wMM, hMM] });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, wMM, hMM);
    pdf.save(base + '.pdf');
  }

  function onCardAction(e){
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const wrapper = e.currentTarget;
    const frame = wrapper.querySelector('.capture-frame');
    const id = wrapper.dataset.id;
    const entry = entries.find(en => en.id === id);
    const base = 'boarding-pass_' + (entry ? entry.fromCode + '-' + entry.toCode : id);

    if(btn.dataset.action === 'delete'){ removeEntry(wrapper); return; }

    const label = btn.textContent;
    btn.disabled = true; btn.textContent = '…';
    const run = btn.dataset.action === 'png' ? downloadPNG(frame, base) : downloadPDF(frame, base);
    run
      .then(() => showToast((btn.dataset.action === 'png' ? 'PNG' : 'PDF') + ' downloaded ✓'))
      .catch(err => {
        console.error('Download failed:', err);
        alert('Download failed: ' + (err && err.message ? err.message : 'unknown error') +
              '\n\nOn some phones the file opens in a new tab instead — long-press it to save.');
      })
      .finally(() => { btn.disabled = false; btn.textContent = label; });
  }

  /* ============================================================
     Submit + export-all + demo
     ============================================================ */
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = readForm();
    if($('lastName').value.trim() === '' && $('firstName').value.trim() === ''){ alert('Please enter the passenger name.'); return; }
    if(!$('from').value.trim() || !$('to').value.trim() || !$('airline').value.trim() || !data.flightNo || !data.date){
      alert('Please fill airline, flight number, both cities, and the date.'); return;
    }
    addEntry(data);
    showToast('Journey added to your diary ✈');

    form.reset();
    $('cls').value = 'ECONOMY';
    $('boarding').value = '08:30';
    previewPNR = randomPNR();
    refreshPreview();
    $('lastName').focus();
  });

  exportAllBtn.addEventListener('click', async function(){
    const frames = Array.from(document.querySelectorAll('.collection .capture-frame'));
    if(!frames.length) return;
    exportAllBtn.disabled = true; const label = exportAllBtn.textContent; exportAllBtn.textContent = 'Preparing PDF…';
    try{
      const { jsPDF } = window.jspdf; let pdf = null;
      for(let i=0;i<frames.length;i++){
        const canvas = await captureCanvas(frames[i]);
        const wMM = 210, hMM = (canvas.height / canvas.width) * wMM;
        if(!pdf) pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:[wMM,hMM] });
        else pdf.addPage([wMM,hMM], 'landscape');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, wMM, hMM);
      }
      pdf.save('voyage-travel-diary.pdf');
      showToast('Diary exported ✓');
    } catch(err){
      console.error('Export failed:', err);
      alert('Diary export failed: ' + (err && err.message ? err.message : 'unknown error'));
    } finally {
      exportAllBtn.disabled = false; exportAllBtn.textContent = label;
    }
  });

  $('demoBtn').addEventListener('click', function(){
    $('lastName').value = 'Sharma';
    $('firstName').value = 'Aarav';
    const air = $('airline'); air.value = 'Air India'; air.dataset.code = 'AI';
    $('flightNo').value = '204';
    $('cls').value = 'BUSINESS';
    const f = $('from'); f.value = 'Delhi'; f.dataset.code = 'DEL'; f.dataset.city = 'Delhi';
    const t = $('to'); t.value = 'Reykjavik'; t.dataset.code = 'KEF'; t.dataset.city = 'Reykjavik';
    $('date').value = new Date().toISOString().split('T')[0];
    $('boarding').value = '21:40';
    $('gate').value = 'B12';
    $('seat').value = '2A';
    $('terminal').value = 'T3';
    $('pnr').value = 'VY6K2P';
    $('note').value = 'Window seat, first snow from above.';
    refreshPreview();
    showToast('Demo flight loaded');
  });

  /* ============================================================
     Toast
     ============================================================ */
  let toastTimer;
  function showToast(msg){
    const toast = $('toast');
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ============================================================
     Init
     ============================================================ */
  refreshPreview();
  updateMeta();
})();
