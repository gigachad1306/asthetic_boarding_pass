(function(){

  /* ============================================================
     Airline brand colors — curated fallback (used regardless of
     whether the network lookups below succeed, since a live
     brand-color API is not reliably queryable cross-origin).
     ============================================================ */
  const AIRLINE_COLORS = {
    AI:{primary:'#E0272A',secondary:'#F5A623'}, '6E':{primary:'#13294B',secondary:'#F58220'},
    UK:{primary:'#5C2D91',secondary:'#F2A900'}, SG:{primary:'#EE2E24',secondary:'#FFCB05'},
    EK:{primary:'#D71920',secondary:'#C09A5B'}, QR:{primary:'#5C0632',secondary:'#8A1538'},
    EY:{primary:'#5D3954',secondary:'#BD8B13'}, BA:{primary:'#075AAA',secondary:'#EB2226'},
    AF:{primary:'#002157',secondary:'#EF3340'}, LH:{primary:'#05164D',secondary:'#F9BA00'},
    SQ:{primary:'#F99F1C',secondary:'#003876'}, CX:{primary:'#00543C',secondary:'#A79A78'},
    TG:{primary:'#4B0082',secondary:'#8E1537'}, JL:{primary:'#C4122E',secondary:'#4C4C4C'},
    NH:{primary:'#00468C',secondary:'#1BA3DE'}, DL:{primary:'#A6192E',secondary:'#003366'},
    AA:{primary:'#0078D2',secondary:'#C8102E'}, UA:{primary:'#002244',secondary:'#0091D0'},
    WN:{primary:'#304CB2',secondary:'#F9B612'}, AC:{primary:'#D22630',secondary:'#000000'},
    QF:{primary:'#E40000',secondary:'#1B1B1B'}, NZ:{primary:'#00205B',secondary:'#000000'},
    TK:{primary:'#C50830',secondary:'#5D2E0C'}, LX:{primary:'#E30613',secondary:'#1D1D1B'},
    KL:{primary:'#00A1DE',secondary:'#003876'}, IB:{primary:'#D7192D',secondary:'#F8B02C'},
    AZ:{primary:'#008C45',secondary:'#CD212A'}, FR:{primary:'#073590',secondary:'#F4C300'},
    U2:{primary:'#FF6600',secondary:'#12295C'}, VS:{primary:'#E10A0A',secondary:'#2E1A47'},
    B6:{primary:'#0033A0',secondary:'#00A0DF'}, AS:{primary:'#00385E',secondary:'#7AC142'},
    MH:{primary:'#010101',secondary:'#C8102E'}, GA:{primary:'#003876',secondary:'#00A651'},
    PR:{primary:'#003DA5',secondary:'#EE2E24'}, VN:{primary:'#00369C',secondary:'#FFCC29'},
    KE:{primary:'#00256C',secondary:'#8B7355'}, OZ:{primary:'#00349B',secondary:'#B10041'},
    CA:{primary:'#B90E27',secondary:'#F4A11D'}, MU:{primary:'#B90E27',secondary:'#1D3E7C'},
    CZ:{primary:'#008542',secondary:'#B90E27'}, ET:{primary:'#578237',secondary:'#F9B517'},
    SA:{primary:'#003876',secondary:'#F4A11D'}, LA:{primary:'#1B1B1B',secondary:'#E4032E'},
    AV:{primary:'#E4032E',secondary:'#1B1B1B'}, AM:{primary:'#00693E',secondary:'#C6093B'},
    AR:{primary:'#74ACDF',secondary:'#1B1B1B'}, IX:{primary:'#C1272D',secondary:'#F7941E'},
    G8:{primary:'#8DC63F',secondary:'#1B1B1B'}, I5:{primary:'#E4032E',secondary:'#F4A11D'}
  };
  const DEFAULT_ACCENT = {primary:'#1C2B39', secondary:'#DEC99C'};

  /* ============================================================
     Fallback airport / airline datasets (used instantly, then
     enriched by the live fetches below once/if they resolve).
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

  const FALLBACK_AIRLINES = Object.keys(AIRLINE_COLORS).reduce((arr, code) => arr, []).concat([]);
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
  const dataStatus = document.getElementById('dataStatus');

  function mergeByIata(base, extra){
    const seen = new Set(base.map(x => x.iata));
    extra.forEach(x => { if(x.iata && !seen.has(x.iata)){ base.push(x); seen.add(x.iata); } });
    return base;
  }

  /* Live enrichment #1: OurAirports-style dataset (mwgg/Airports on GitHub)
     — ~29,000 airports with IATA/ICAO codes, names and cities. */
  fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(json => {
      const extra = Object.values(json)
        .filter(a => a.iata && a.iata.length === 3)
        .map(a => ({ iata: a.iata, name: a.name, city: a.city || a.name, country: a.country }));
      AIRPORTS = mergeByIata(AIRPORTS, extra);
      updateStatus();
    })
    .catch(() => { updateStatus(); });

  /* Live enrichment #2: OpenFlights airline dataset — name/alias to
     IATA code mapping, used for the airline autocomplete. */
  fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat')
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(text => {
      const rows = parseCsv(text);
      const extra = rows
        .filter(r => r[3] && r[3] !== '\\N' && r[3].trim().length === 2 && r[7] === 'Y')
        .map(r => ({ iata: r[3].trim(), name: r[1].trim() }));
      AIRLINES = mergeByIata(AIRLINES, extra);
      updateStatus();
    })
    .catch(() => { updateStatus(); });

  let loadTicks = 0;
  function updateStatus(){
    loadTicks++;
    dataStatus.textContent = 'Live airport & airline lookup ready — ' + AIRPORTS.length + ' airports, ' + AIRLINES.length + ' airlines indexed.';
    if(loadTicks >= 2 || AIRPORTS.length > 100){
      setTimeout(() => { dataStatus.style.display = 'none'; }, 2500);
    }
  }
  setTimeout(() => {
    if(dataStatus) dataStatus.textContent = 'Using built-in airport & airline list (' + AIRPORTS.length + ' airports). Live lookups may still arrive.';
  }, 2500);

  function parseCsv(text){
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for(let i=0;i<text.length;i++){
      const c = text[i];
      if(inQuotes){
        if(c === '"'){
          if(text[i+1] === '"'){ field += '"'; i++; } else { inQuotes = false; }
        } else field += c;
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
    q = q.trim().toLowerCase();
    if(!q) return [];
    const starts = [], includes = [];
    for(const a of AIRPORTS){
      const hay = (a.city + ' ' + a.name + ' ' + a.iata).toLowerCase();
      if(a.iata.toLowerCase() === q || a.city.toLowerCase().startsWith(q)) starts.push(a);
      else if(hay.includes(q)) includes.push(a);
    }
    return starts.concat(includes).slice(0, 8);
  }
  function searchAirlines(q){
    q = q.trim().toLowerCase();
    if(!q) return [];
    const starts = [], includes = [];
    for(const a of AIRLINES){
      const hay = (a.name + ' ' + a.iata).toLowerCase();
      if(a.name.toLowerCase().startsWith(q) || a.iata.toLowerCase() === q) starts.push(a);
      else if(hay.includes(q)) includes.push(a);
    }
    return starts.concat(includes).slice(0, 8);
  }
  function exactCityMatches(q){
    q = q.trim().toLowerCase();
    return AIRPORTS.filter(a => a.city.toLowerCase() === q);
  }
  function exactAirlineMatches(q){
    q = q.trim().toLowerCase();
    return AIRLINES.filter(a => a.name.toLowerCase() === q);
  }

  function wireAutocomplete(inputId, listId, searchFn, renderItem, onSelect){
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    let activeIndex = -1;
    let currentResults = [];

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
    function pick(i){
      const r = currentResults[i];
      if(!r) return;
      onSelect(input, r);
      close();
    }
    input.addEventListener('input', () => {
      delete input.dataset.code; delete input.dataset.name; delete input.dataset.city; delete input.dataset.country;
      open(searchFn(input.value));
    });
    input.addEventListener('keydown', (e) => {
      const items = Array.from(list.children);
      if(e.key === 'ArrowDown'){ e.preventDefault(); activeIndex = Math.min(activeIndex+1, items.length-1); highlight(items); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); activeIndex = Math.max(activeIndex-1, 0); highlight(items); }
      else if(e.key === 'Enter'){ if(activeIndex >= 0){ e.preventDefault(); pick(activeIndex); } }
      else if(e.key === 'Escape'){ close(); }
    });
    function highlight(items){
      items.forEach((it,i) => it.classList.toggle('active', i===activeIndex));
      if(items[activeIndex]) items[activeIndex].scrollIntoView({block:'nearest'});
    }
    input.addEventListener('blur', () => setTimeout(close, 120));
    return input;
  }

  wireAutocomplete('from', 'fromList', searchAirports,
    (a) => `<button type="button"><span class="ac-main">${escapeHtml(a.iata)} &mdash; ${escapeHtml(a.city)}</span><span class="ac-sub">${escapeHtml(a.name)}, ${escapeHtml(a.country)}</span></button>`,
    (input, a) => { input.value = a.city; input.dataset.code = a.iata; input.dataset.name = a.name; input.dataset.city = a.city; }
  );
  wireAutocomplete('to', 'toList', searchAirports,
    (a) => `<button type="button"><span class="ac-main">${escapeHtml(a.iata)} &mdash; ${escapeHtml(a.city)}</span><span class="ac-sub">${escapeHtml(a.name)}, ${escapeHtml(a.country)}</span></button>`,
    (input, a) => { input.value = a.city; input.dataset.code = a.iata; input.dataset.name = a.name; input.dataset.city = a.city; }
  );
  wireAutocomplete('airline', 'airlineList', searchAirlines,
    (a) => `<button type="button"><span class="ac-main">${escapeHtml(a.name)}</span><span class="ac-sub">${escapeHtml(a.iata)}</span></button>`,
    (input, a) => { input.value = a.name; input.dataset.code = a.iata; }
  );

  function resolveAirport(input){
    if(input.dataset.code) return { iata: input.dataset.code, name: input.dataset.name, city: input.dataset.city, approx:false };
    const matches = exactCityMatches(input.value);
    if(matches.length === 1) return { iata: matches[0].iata, name: matches[0].name, city: matches[0].city, approx:false };
    const clean = (input.value||'').trim().replace(/[^a-zA-Z]/g,'');
    return { iata: (clean.slice(0,3)||'???').toUpperCase(), name:null, city: input.value.trim(), approx:true };
  }
  function resolveAirline(input){
    if(input.dataset.code) return { iata: input.dataset.code, name: input.value.trim(), approx:false };
    const matches = exactAirlineMatches(input.value);
    if(matches.length === 1) return { iata: matches[0].iata, name: matches[0].name, approx:false };
    return { iata: null, name: input.value.trim(), approx:true };
  }

  function escapeHtml(str){
    return (str||'').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function fmtDate(iso){
    if(!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    if(isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' });
  }
  function fmtTime(t){
    if(!t) return '—';
    const [h,m] = t.split(':');
    const hour = parseInt(h,10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = ((hour + 11) % 12) + 1;
    return h12 + ':' + m + ' ' + ampm;
  }

  /* ============================================================
     Card rendering
     ============================================================ */
  const entries = [];
  const collectionEl = document.getElementById('collection');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('count');
  const exportAllBtn = document.getElementById('exportAll');
  const form = document.getElementById('passForm');

  function updateMeta(){
    countEl.textContent = entries.length + (entries.length === 1 ? ' pass' : ' passes');
    emptyState.style.display = entries.length ? 'none' : 'block';
    exportAllBtn.hidden = entries.length === 0;
  }

  function logoUrl(iata){
    return 'https://images.kiwi.com/airlines/64/' + encodeURIComponent(iata) + '.png';
  }

  function buildCardHTML(data){
    const tilt = (Math.random() * 1.6 - 0.8).toFixed(2) + 'deg';
    const accent = (data.airlineCode && AIRLINE_COLORS[data.airlineCode]) || DEFAULT_ACCENT;
    const codeFromClass = data.fromApprox ? 'code approx' : 'code';
    const codeToClass = data.toApprox ? 'code approx' : 'code';
    const logo = data.airlineCode ? `<img class="logo" crossorigin="anonymous" src="${logoUrl(data.airlineCode)}" alt="" onerror="this.remove()">` : '';

    return `
      <div class="boarding-pass" style="--tilt:${tilt}; --accent:${accent.primary}; --accent-soft:${accent.secondary}">
        <div class="accent-stripe"></div>
        <div class="tape"></div>
        <div class="stamp-badge">BOARDED<br>${fmtDate(data.date)}</div>
        <div class="stub-main">
          <div class="bp-top">
            <div class="airline">
              ${logo}
              <span class="plane-icon">&#9992;</span>
              <span class="airline-name">${escapeHtml(data.airline)}${data.airlineCode ? ' &middot; ' + escapeHtml(data.airlineCode) : ''}</span>
            </div>
            <div class="class-tag">${escapeHtml(data.cls)}</div>
          </div>
          <div class="route">
            <div class="airport from">
              <span class="${codeFromClass}">${escapeHtml(data.fromCode)}</span>
              <span class="aname">${escapeHtml(data.fromCity)}</span>
            </div>
            <div class="path">
              <div class="dashed-line"></div>
              <span class="plane-mid">&#9992;</span>
            </div>
            <div class="airport to">
              <span class="${codeToClass}">${escapeHtml(data.toCode)}</span>
              <span class="aname">${escapeHtml(data.toCity)}</span>
            </div>
          </div>
          <div class="details-grid">
            <div><label>Passenger</label><span>${escapeHtml(data.name)}</span></div>
            <div><label>Flight</label><span>${escapeHtml((data.airlineCode||'')+' '+data.flightNo)}</span></div>
            <div><label>Date</label><span>${fmtDate(data.date)}</span></div>
            <div><label>Gate</label><span>${escapeHtml(data.gate) || '—'}</span></div>
            <div><label>Seat</label><span>${escapeHtml(data.seat) || '—'}</span></div>
            <div><label>Boarding</label><span>${fmtTime(data.boarding)}</span></div>
          </div>
          ${data.note ? `<div class="memory-note">&ldquo;${escapeHtml(data.note)}&rdquo;</div>` : ''}
        </div>
        <div class="perforation"></div>
        <div class="stub-tear">
          <div class="stub-row">
            <span class="stub-code">${escapeHtml(data.fromCode)}&rarr;${escapeHtml(data.toCode)}</span>
          </div>
          <div class="stub-mini">
            <div><label>Flight</label><span>${escapeHtml((data.airlineCode||'')+data.flightNo)}</span></div>
            <div><label>Seat</label><span>${escapeHtml(data.seat)||'—'}</span></div>
            <div><label>Gate</label><span>${escapeHtml(data.gate)||'—'}</span></div>
            <div><label>Class</label><span>${escapeHtml(data.cls.slice(0,4))}</span></div>
          </div>
          <div class="barcode"></div>
        </div>
      </div>
    `;
  }

  const ACTIONS_HTML = `
    <div class="card-actions">
      <button type="button" data-action="png">Save PNG</button>
      <button type="button" data-action="pdf">Save PDF</button>
      <button type="button" data-action="delete" class="danger">Remove</button>
    </div>
  `;

  function addEntry(data){
    const id = 'p' + Date.now() + Math.random().toString(36).slice(2,7);
    entries.unshift({ id, ...data });

    const wrapper = document.createElement('div');
    wrapper.className = 'pass-card pass-enter';
    wrapper.dataset.id = id;
    wrapper.innerHTML = `<div class="pass-scroll"><div class="capture-frame">${buildCardHTML(data)}</div></div>${ACTIONS_HTML}`;
    collectionEl.prepend(wrapper);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      wrapper.classList.add('pass-enter-active');
      wrapper.classList.remove('pass-enter');
    }));

    wrapper.addEventListener('click', onCardAction);
    updateMeta();
    wrapper.scrollIntoView({ behavior:'smooth', block:'nearest' });
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
  }

  /* Render a pass frame to a canvas. Cross-origin airline logos can taint the
     canvas and make toBlob()/toDataURL() throw, which silently kills the whole
     download — so we skip any element that fails to load with CORS. */
  async function renderFrame(frameEl){
    return html2canvas(frameEl, {
      backgroundColor: '#F8F1DD',
      scale: 3,
      useCORS: true,
      ignoreElements: (el) =>
        el.tagName === 'IMG' && (!el.complete || el.naturalWidth === 0)
    });
  }

  // Wrap canvas.toBlob in a promise so callers can await the actual file.
  function canvasToBlob(canvas, type){
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error('Canvas is empty or tainted.'));
      }, type);
    });
  }

  async function downloadPNG(frameEl, filenameBase){
    const canvas = await renderFrame(frameEl);
    const blob = await canvasToBlob(canvas, 'image/png');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filenameBase + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function downloadPDF(frameEl, filenameBase){
    const canvas = await renderFrame(frameEl);
    const { jsPDF } = window.jspdf;
    const wMM = 200;
    const hMM = (canvas.height / canvas.width) * wMM;
    const pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:[wMM, hMM] });
    // jsPDF.addImage needs a data URL / base64 — NOT a blob object URL.
    const dataUrl = canvas.toDataURL('image/png');
    pdf.addImage(dataUrl, 'PNG', 0, 0, wMM, hMM);
    pdf.save(filenameBase + '.pdf');
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

    const originalLabel = btn.textContent;
    btn.disabled = true; btn.textContent = '...';
    const action = btn.dataset.action === 'png' ? downloadPNG(frame, base) : downloadPDF(frame, base);
    action
      .catch(err => {
        console.error('Download failed:', err);
        alert('Sorry, that download failed. Please try again.');
      })
      .finally(() => { btn.disabled = false; btn.textContent = originalLabel; });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const fd = new FormData(form);
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const airlineInput = document.getElementById('airline');

    const fromR = resolveAirport(fromInput);
    const toR = resolveAirport(toInput);
    const airlineR = resolveAirline(airlineInput);

    const data = {
      name: fd.get('name').trim(),
      airline: airlineR.name,
      airlineCode: airlineR.iata,
      flightNo: fd.get('flightNo').trim(),
      fromCode: fromR.iata, fromCity: fromR.city, fromApprox: fromR.approx,
      toCode: toR.iata, toCity: toR.city, toApprox: toR.approx,
      date: fd.get('date'),
      cls: fd.get('cls'),
      gate: fd.get('gate').trim(),
      seat: fd.get('seat').trim(),
      boarding: fd.get('boarding'),
      note: fd.get('note').trim()
    };
    if(!data.name || !data.fromCity || !data.toCity || !data.airline || !data.flightNo || !data.date){
      form.reportValidity();
      return;
    }
    addEntry(data);
    form.reset();
    document.getElementById('name').focus();
  });

  exportAllBtn.addEventListener('click', async function(){
    const frames = Array.from(document.querySelectorAll('.capture-frame'));
    if(!frames.length) return;
    exportAllBtn.disabled = true;
    exportAllBtn.textContent = 'Preparing PDF…';
    try{
      const { jsPDF } = window.jspdf;
      let pdf = null;
      for(let i=0;i<frames.length;i++){
        const canvas = await renderFrame(frames[i]);
        const wMM = 200;
        const hMM = (canvas.height / canvas.width) * wMM;
        if(!pdf) pdf = new jsPDF({ orientation:'landscape', unit:'mm', format:[wMM,hMM] });
        else pdf.addPage([wMM,hMM], 'landscape');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, wMM, hMM);
      }
      pdf.save('the-boarding-pass-diary.pdf');
    } catch(err) {
      console.error('Export failed:', err);
      alert('Sorry, the diary export failed. Please try again.');
    } finally {
      exportAllBtn.disabled = false;
      exportAllBtn.textContent = 'Export whole diary as PDF';
    }
  });

  updateMeta();
})();
