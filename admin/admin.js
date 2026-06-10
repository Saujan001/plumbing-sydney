/* ============ AquaFix Admin — app ============ */

/* ---------- auth guard — must be first ---------- */
const adminToken = localStorage.getItem('adminToken');
if (!adminToken) {
  window.location.href = 'login.html';
}

/* ---------- Supabase Storage helpers ---------- */
async function deleteFromStorage(publicUrl) {
  if (!publicUrl) return;
  try {
    const marker = '/object/public/uploads/';
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const filePath = publicUrl.substring(idx + marker.length);
    const token = localStorage.getItem('adminToken');

    const res = await fetch(`https://zrkawewphxvskwkpsywi.supabase.co/storage/v1/object/uploads/${filePath}`, {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpya2F3ZXdwaHh2c2t3a3BzeXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA5NDUsImV4cCI6MjA5NjQ4Njk0NX0.720XSZ7kEIVm0o0_RC6N18MwL_1YrQ-8nZ7dt6b9wLs',
        'Authorization': `Bearer ${token}`
      }
    });
    const responseText = await res.text();
    if (res.status === 404) return;
    if (!res.ok) console.warn('Delete failed:', responseText);
  } catch (e) {
    console.warn('Could not delete old file:', e);
  }
}

async function uploadToStorage(file, folder) {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}.${ext}`;
  const token = localStorage.getItem('adminToken');

  const res = await fetch(`https://zrkawewphxvskwkpsywi.supabase.co/storage/v1/object/uploads/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpya2F3ZXdwaHh2c2t3a3BzeXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTA5NDUsImV4cCI6MjA5NjQ4Njk0NX0.720XSZ7kEIVm0o0_RC6N18MwL_1YrQ-8nZ7dt6b9wLs',
      'Authorization': `Bearer ${token}`,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  });

  if (!res.ok) {
    const responseText = await res.text();
    throw new Error(responseText);
  }

  return `https://zrkawewphxvskwkpsywi.supabase.co/storage/v1/object/public/uploads/${filename}`;
}

(function(){
  'use strict';
  var ICONS = window.ICONS, DATA = window.DATA;

  // extra nav icons
  ICONS.layout = '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>';
  ICONS.camera = '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>';

  function ic(name, w){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+ICONS[name]+'</svg>';
  }
  function icFill(name){ return '<svg viewBox="0 0 24 24" fill="currentColor">'+ICONS[name]+'</svg>'; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  /* ---- token refresh ---- */
  function refreshToken(){
    var rt = localStorage.getItem('adminRefreshToken');
    if(!rt) return Promise.reject(new Error('No refresh token'));
    return fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt })
    }).then(function(res){ return res.json(); }).then(function(data){
      if(!data.access_token) throw new Error('Refresh failed');
      localStorage.setItem('adminToken', data.access_token);
      if(data.refresh_token) localStorage.setItem('adminRefreshToken', data.refresh_token);
      return data.access_token;
    });
  }

  /* ---- shared fetch helpers ---- */
  function sbFetch(url, opts){
    return fetch(url, opts).then(function(res){
      if(res.status === 401){
        return refreshToken().then(function(newToken){
          var newOpts = Object.assign({}, opts, {
            headers: Object.assign({}, opts.headers, { 'Authorization': 'Bearer ' + newToken })
          });
          return fetch(url, newOpts).then(function(res2){
            if(!res2.ok) return res2.text().then(function(t){ throw new Error(t||res2.status); });
            var ct2 = res2.headers.get('content-type')||'';
            return ct2.includes('json') ? res2.json() : res2.text().then(function(){ return null; });
          });
        }).catch(function(){
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
          window.location.replace('login.html');
        });
      }
      if(!res.ok) return res.text().then(function(t){ throw new Error(t||res.status); });
      var ct = res.headers.get('content-type')||'';
      return ct.includes('json') ? res.json() : res.text().then(function(){ return null; });
    });
  }
  function sbGet(path, extraHeaders){
    return sbFetch(supabaseAdmin.url + path, { headers: Object.assign({}, supabaseAdmin.headers, extraHeaders||{}) });
  }
  function sbPost(path, body){
    return sbFetch(supabaseAdmin.url + path, { method:'POST', headers: supabaseAdmin.headers, body: JSON.stringify(body) });
  }
  function sbPatch(path, body){
    return sbFetch(supabaseAdmin.url + path, { method:'PATCH', headers: supabaseAdmin.headers, body: JSON.stringify(body) });
  }
  function sbDelete(path){
    return sbFetch(supabaseAdmin.url + path, { method:'DELETE', headers: supabaseAdmin.headers });
  }

  /* ---------- nav config ---------- */
  var NAV = {
    dashboard:{icon:'grid', label:'Dashboard', title:'Dashboard'},
    settings:{icon:'settings', label:'Site Settings', title:'Site Settings'},
    branding:{icon:'palette', label:'Branding & Logo', title:'Branding & Logo'},
    hero:{icon:'layout', label:'Hero Section', title:'Hero Section'},
    services:{icon:'wrench', label:'Services', title:'Services'},
    whyus:{icon:'shield', label:'Why Choose Us', title:'Why Choose Us'},
    gallery:{icon:'camera', label:'Gallery', title:'Gallery'},
    testimonials:{icon:'star', label:'Testimonials', title:'Testimonials'},
    contact:{icon:'phone', label:'Contact Details', title:'Contact Details'},
    serviceareas:{icon:'pin', label:'Service Areas', title:'Service Areas'},
    social:{icon:'share', label:'Social Media', title:'Social Media'},
    enquiries:{icon:'inbox', label:'Enquiries Inbox', title:'Enquiries Inbox'}
  };

  function updateEnqBadge(count){
    var b = $('.sb-item[data-nav="enquiries"] .sb-badge');
    var item = $('.sb-item[data-nav="enquiries"]');
    if(!item) return;
    if(b){ if(count){ b.textContent=count; } else { b.remove(); } }
    else if(count){ item.insertAdjacentHTML('beforeend','<span class="sb-badge">'+count+'</span>'); }
  }

  // fill sidebar item contents (badge placeholder — will be updated after fetch)
  $all('.sb-item[data-nav]').forEach(function(btn){
    var k = btn.dataset.nav, n = NAV[k];
    btn.innerHTML = ic(n.icon) + '<span>'+n.label+'</span>';
  });
  $('#previewBtn').innerHTML = ic('external')+'<span>Preview Site</span>';
  $('#logoutBtn').innerHTML = ic('logout')+'<span>Logout</span>';
  $('#topPreview').innerHTML = ic('eye')+'Preview Site';
  $('#hamb').innerHTML = ic('menu');

  /* ---------- router ---------- */
  function go(key){
    $all('.sb-item[data-nav]').forEach(function(b){ b.classList.toggle('active', b.dataset.nav===key); });
    $all('.panel').forEach(function(p){ p.classList.toggle('active', p.dataset.panel===key); });
    $('#pageTitle').textContent = NAV[key].title;
    closeSidebar();
    window.scrollTo(0,0);
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-nav]');
    if(t){ go(t.dataset.nav); }
  });

  /* ---------- mobile sidebar ---------- */
  var sidebar = $('#sidebar'), scrim = $('#sbScrim');
  function openSidebar(){ sidebar.classList.add('open'); scrim.classList.add('show'); }
  function closeSidebar(){ sidebar.classList.remove('open'); scrim.classList.remove('show'); }
  $('#hamb').addEventListener('click', openSidebar);
  scrim.addEventListener('click', closeSidebar);

  /* ---------- logout ---------- */
  $('#logoutBtn').addEventListener('click', function(){
    var token = localStorage.getItem('adminToken') || '';
    fetch(supabaseAdmin.url + '/auth/v1/logout', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + token
      }
    }).finally(function(){
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
      location.replace('login.html');
    });
  });

  /* ---------- toast ---------- */
  function toast(msg, isErr){
    var t = document.createElement('div');
    t.className = 'toast'+(isErr?' err':'');
    t.innerHTML = '<span class="ti">'+ic(isErr?'close':'check',2.4)+'</span><span>'+esc(msg)+'</span>';
    $('#toastWrap').appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 400); }, 2600);
  }

  /* ---------- modal ---------- */
  var modal = $('#modal');
  function openModal(title, bodyHtml, footHtml){
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = bodyHtml;
    $('#modalFoot').innerHTML = footHtml;
    modal.classList.add('open');
  }
  function closeModal(){ modal.classList.remove('open'); }
  modal.addEventListener('click', function(e){ if(e.target.closest('[data-modal-close]')) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeModal(); closeSidebar(); } });

  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  function pill(s){
    var map = {new:'new', read:'read', actioned:'actioned'};
    var cls = map[s] || 'read';
    return '<span class="pill '+cls+'">'+esc(s.charAt(0).toUpperCase()+s.slice(1))+'</span>';
  }
  function fmtDate(d){
    if(!d) return '—';
    var dt = new Date(d.includes('T') ? d : d+'T00:00:00');
    return isNaN(dt) ? d : dt.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'});
  }

  /* =========================================================
     1. DASHBOARD STATS — live from Supabase
  ========================================================= */
  function loadDashboard(){
    // Fetch total + new enquiry counts using Prefer: count=exact
    var countHeaders = Object.assign({}, supabaseAdmin.headers, {'Prefer': 'count=exact'});

    Promise.all([
      fetch(supabaseAdmin.url + '/rest/v1/enquiries?select=id', { headers: countHeaders }),
      fetch(supabaseAdmin.url + '/rest/v1/enquiries?select=id&status=eq.new', { headers: countHeaders })
    ]).then(function(responses){
      var total = parseInt(responses[0].headers.get('content-range')||'0/0', 10) || 0;
      var newCount = parseInt(responses[1].headers.get('content-range')||'0/0', 10) || 0;
      // content-range format is "0-N/total" — extract total after /
      var cr0 = responses[0].headers.get('content-range')||'';
      var cr1 = responses[1].headers.get('content-range')||'';
      total = cr0.includes('/') ? parseInt(cr0.split('/')[1],10)||0 : 0;
      newCount = cr1.includes('/') ? parseInt(cr1.split('/')[1],10)||0 : 0;

      updateEnqBadge(newCount);

      var stats = [
        {ic:'inbox', cls:'o', val:total,    lbl:'Total Enquiries', d:'+12%', up:true},
        {ic:'mail',  cls:'b', val:newCount, lbl:'New Enquiries',   d:'+'+newCount, up:true},
        {ic:'phone', cls:'g', val:142,      lbl:'Phone Clicks',    d:'+18%', up:true},
        {ic:'share', cls:'n', val:87,       lbl:'WhatsApp Clicks', d:'-4%',  up:false}
      ];
      $('#statGrid').innerHTML = stats.map(function(s){
        return '<div class="stat"><div class="ic '+s.cls+'">'+ic(s.ic)+'</div>'
          + '<div class="val">'+s.val+'</div><div class="lbl">'+s.lbl+'</div>'
          + '<div class="delta '+(s.up?'up':'down')+'">'+ic(s.up?'trendUp':'trendDown',2.2)+s.d+' vs last week</div></div>';
      }).join('');

      return responses[0].json();
    }).catch(function(){ return []; }).then(function(){
      // Load 5 most recent enquiries for the dashboard preview table
      sbGet('/rest/v1/enquiries?select=*&order=created_at.desc&limit=5')
        .then(function(rows){
          rows = rows || [];
          if(!rows.length){
            rows = DATA.enquiries.slice(0,5);
          }
          $('#dashRecent').innerHTML = rows.map(function(e){
            var dateVal = e.created_at || e.date || '';
            return '<tr><td class="nm">'+esc(e.name||'')+'</td><td>'+esc(e.service||'')+'</td>'
              + '<td class="muted">'+fmtDate(dateVal)+'</td><td>'+pill(e.status||'new')+'</td></tr>';
          }).join('');
        }).catch(function(){
          $('#dashRecent').innerHTML = DATA.enquiries.slice(0,5).map(function(e){
            return '<tr><td class="nm">'+esc(e.name)+'</td><td>'+esc(e.service)+'</td>'
              + '<td class="muted">'+fmtDate(e.date)+'</td><td>'+pill(e.status)+'</td></tr>';
          }).join('');
        });
    });
  }

  /* =========================================================
     2. ENQUIRIES INBOX — live from Supabase
  ========================================================= */
  var liveEnquiries = [];

  function renderEnquiries(rows){
    liveEnquiries = rows;
    var tb = $('#enqBody');
    tb.innerHTML = '';
    var newCount = rows.filter(function(e){ return e.status==='new'; }).length;
    $('#enqCount').textContent = rows.length + ' total · ' + newCount + ' new';
    updateEnqBadge(newCount);

    rows.forEach(function(e){
      var tr = document.createElement('tr');
      tr.className = 'row-click';
      tr.dataset.id = e.id;
      var dateVal = e.created_at || e.preferred_date || e.date || '';
      tr.innerHTML = '<td class="nm">'+esc(e.name||'')+'</td>'
        + '<td class="muted">'+esc(e.phone||'')+'</td>'
        + '<td>'+esc(e.service||'')+'</td>'
        + '<td class="muted">'+fmtDate(dateVal)+'</td>'
        + '<td>'+pill(e.status||'new')+'</td>';

      tr.addEventListener('click', function(){
        // open detail modal
        if(e.status==='new'){
          sbPatch('/rest/v1/enquiries?id=eq.'+e.id, {status:'read'}).then(function(){
            e.status='read';
            tr.querySelector('td:last-child').innerHTML = pill('read');
            updateEnqBadge(liveEnquiries.filter(function(x){ return x.status==='new'; }).length);
          }).catch(function(){});
        }
        openEnqModal(e, tr);
      });
      tb.appendChild(tr);
    });
  }

  function openEnqModal(e, tr){
    var dateVal = e.created_at || e.preferred_date || e.date || '';
    var body = '<div class="inner" style="display:grid;grid-template-columns:1fr 1fr;gap:16px 28px">'
      + blk('Name', e.name||'') + blk('Phone', e.phone||'')
      + blk('Email', e.email||'') + blk('Service', e.service||'')
      + blk('Submitted', fmtDate(dateVal)) + blk('Status', e.status||'new')
      + (e.suburb ? blk('Suburb', e.suburb) : '')
      + (e.preferred_time ? blk('Preferred Time', e.preferred_time) : '')
      + '<div class="blk msg" style="grid-column:1/-1"><div class="k" style="font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700;margin-bottom:3px">Message</div>'
      +   '<div class="v" style="font-size:14.5px;color:var(--body);line-height:1.6">'+esc(e.message||'—')+'</div></div>'
      + '</div>';
    var foot = '<button class="btn btn-ghost" data-modal-close>Close</button>'
      + '<button class="btn btn-soft btn-sm" id="modalMarkRead">'+ic('check',2.2)+' Mark as Read</button>'
      + '<button class="btn btn-navy btn-sm" id="modalMarkActioned">'+ic('check',2.2)+' Mark Actioned</button>'
      + '<button class="btn btn-danger-soft btn-sm" id="modalDelEnq">'+ic('trash',2)+' Delete</button>';
    openModal('Enquiry — '+esc(e.name||''), body, foot);

    $('#modalMarkRead').addEventListener('click', function(){
      sbPatch('/rest/v1/enquiries?id=eq.'+e.id, {status:'read'}).then(function(){
        e.status='read';
        if(tr) tr.querySelector('td:last-child').innerHTML = pill('read');
        updateEnqBadge(liveEnquiries.filter(function(x){ return x.status==='new'; }).length);
        toast('Marked as read'); closeModal();
      }).catch(function(){ toast('Update failed', true); });
    });
    $('#modalMarkActioned').addEventListener('click', function(){
      sbPatch('/rest/v1/enquiries?id=eq.'+e.id, {status:'actioned'}).then(function(){
        e.status='actioned';
        if(tr) tr.querySelector('td:last-child').innerHTML = pill('actioned');
        toast('Marked as actioned'); closeModal();
      }).catch(function(){ toast('Update failed', true); });
    });
    $('#modalDelEnq').addEventListener('click', function(){
      if(!confirm('Delete this enquiry? This cannot be undone.')) return;
      sbDelete('/rest/v1/enquiries?id=eq.'+e.id).then(function(){
        liveEnquiries = liveEnquiries.filter(function(x){ return x.id!==e.id; });
        renderEnquiries(liveEnquiries);
        toast('Enquiry deleted'); closeModal();
      }).catch(function(){ toast('Delete failed', true); });
    });
  }

  function blk(k,v){
    return '<div class="blk"><div class="k" style="font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700;margin-bottom:3px">'+k+'</div>'
      + '<div class="v" style="font-size:14.5px;color:var(--ink);font-weight:600">'+esc(v)+'</div></div>';
  }

  function loadEnquiries(){
    sbGet('/rest/v1/enquiries?select=*&order=created_at.desc')
      .then(function(rows){
        if(rows && rows.length){
          renderEnquiries(rows);
          loadDashboard(); // refresh dash counts too
        } else {
          renderEnquiries(DATA.enquiries); // fallback to mock data
        }
      })
      .catch(function(){
        renderEnquiries(DATA.enquiries);
      });
  }

  // CSV export
  $('#exportCsv').addEventListener('click', function(){
    var rows = liveEnquiries.length ? liveEnquiries : DATA.enquiries;
    var headers = ['Name','Phone','Email','Suburb','Service','Preferred Date','Message','Status','Submitted'];
    var csv = [headers].concat(rows.map(function(e){
      return [e.name,e.phone,e.email,e.suburb||'',e.service,e.preferred_date||e.date||'',e.message,e.status,e.created_at||e.date||''];
    })).map(function(r){
      return r.map(function(c){ return '"'+String(c||'').replace(/"/g,'""')+'"'; }).join(',');
    }).join('\n');
    var blob = new Blob([csv], {type:'text/csv'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download='aquafix-enquiries.csv'; a.click();
    URL.revokeObjectURL(url);
    toast('Exported '+rows.length+' enquiries');
  });

  /* =========================================================
     3. SETTINGS PANEL — live from Supabase
  ========================================================= */
  var liveSettings = {};

  function renderSettings(rows){
    liveSettings = {};
    rows.forEach(function(r){ liveSettings[r.key] = r; });

    var panel = $('[data-panel="settings"] .card-pad') || $('[data-panel="settings"] .card');
    if(!panel) return;

    // Build a dynamic form from whatever keys exist in the table
    var LABELS = {
      business_name:'Business Name', tagline:'Tagline', abn:'ABN', licence:'Licence Number',
      phone:'Phone Number', email:'Email Address', whatsapp:'WhatsApp Number',
      announcement:'Announcement Bar Text', announcement_on:'Show Announcement Bar'
    };

    var formHtml = '<div class="form-grid">';
    rows.forEach(function(r){
      var lbl = LABELS[r.key] || r.key.replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
      formHtml += '<div class="field'+(r.key==='announcement'?' full':'')+'"><label>'+esc(lbl)+'</label>'
        + '<input type="text" data-setting-key="'+esc(r.key)+'" value="'+esc(r.value||'')+'"></div>';
    });
    formHtml += '</div>';
    formHtml += '<div class="save-bar"><button class="btn btn-ghost" id="settingsDiscard">Discard</button>'
      + '<button class="btn btn-orange" id="settingsSave">Save Changes</button></div>';

    panel.innerHTML = formHtml;

    $('#settingsDiscard').addEventListener('click', function(){ loadSettings(); });
    $('#settingsSave').addEventListener('click', function(){
      var inputs = $all('[data-setting-key]', panel);
      var saves = inputs.map(function(inp){
        var key = inp.dataset.settingKey;
        var val = inp.value.trim();
        return sbPatch('/rest/v1/settings?key=eq.'+encodeURIComponent(key), {value: val});
      });
      Promise.all(saves)
        .then(function(){ toast('Settings saved!'); loadSettings(); })
        .catch(function(){ toast('Save failed — check connection', true); });
    });
  }

  function loadSettings(){
    sbGet('/rest/v1/settings?select=*')
      .then(function(rows){
        if(rows && rows.length) renderSettings(rows);
      })
      .catch(function(){}); // leave existing static form intact on error
  }

  /* =========================================================
     4. TESTIMONIALS MANAGER — live from Supabase
  ========================================================= */
  var liveReviews = [];

  function renderReviews(rows){
    liveReviews = rows;
    var list = $('#revList');
    list.innerHTML = rows.map(function(r){
      var stars='';
      for(var i=0;i<5;i++) stars += '<span style="color:'+(i<(r.stars||r.rating||5)?'var(--gold)':'#d4dae6')+'">'+STAR+'</span>';
      var name = r.reviewer_name || r.name || '';
      var text = r.review_text || r.text || '';
      var src  = r.source || 'Google Review';
      return '<div class="list-row" data-id="'+r.id+'">'
        + '<span class="rev-av">'+esc(name.charAt(0)||'?')+'</span>'
        + '<div class="list-main"><div class="rev-stars">'+stars+'</div>'
        +   '<h4>'+esc(name)+' <span style="font-weight:500;color:var(--muted);font-size:12.5px">· '+esc(src)+'</span></h4>'
        +   '<p>'+esc(text)+'</p></div>'
        + '<div class="list-actions">'
        +   '<button class="btn btn-ghost btn-icon" data-edit-rev="'+r.id+'">'+ic('edit',2)+'</button>'
        +   '<button class="btn btn-danger-soft btn-icon" data-del-rev="'+r.id+'">'+ic('trash',2)+'</button>'
        + '</div></div>';
    }).join('');
    $('#revCount').textContent = rows.length + ' reviews';
  }

  function loadReviews(){
    sbGet('/rest/v1/testimonials?select=*&order=sort_order.asc')
      .then(function(rows){
        renderReviews(rows && rows.length ? rows : DATA.reviews);
      })
      .catch(function(){ renderReviews(DATA.reviews); });
  }

  document.addEventListener('click', function(e){
    var ed = e.target.closest('[data-edit-rev]');
    var dl = e.target.closest('[data-del-rev]');
    if(ed){
      var rev = liveReviews.find(function(r){ return String(r.id)===ed.dataset.editRev; });
      if(rev) openReviewModal(rev);
    }
    if(dl){
      var id = dl.dataset.delRev;
      if(!confirm('Delete this review?')) return;
      sbDelete('/rest/v1/testimonials?id=eq.'+id)
        .then(function(){
          liveReviews = liveReviews.filter(function(r){ return String(r.id)!==id; });
          renderReviews(liveReviews); toast('Review deleted');
        })
        .catch(function(){ toast('Delete failed', true); });
    }
  });

  $('#addReview').addEventListener('click', function(){ openReviewModal(null); });

  var pickedRating = 5;
  function openReviewModal(rev){
    pickedRating = rev ? (rev.stars || rev.rating || 5) : 5;
    var name = rev ? (rev.reviewer_name || rev.name || '') : '';
    var text = rev ? (rev.review_text || rev.text || '') : '';
    var src  = rev ? (rev.source || 'Google Review') : 'Google Review';

    function starsBtns(){
      var h='';
      for(var i=1;i<=5;i++) h+='<button type="button" class="'+(i<=pickedRating?'on':'')+'" data-star="'+i+'">'+STAR+'</button>';
      return h;
    }
    var body = '<div class="field" style="margin-bottom:16px"><label>Reviewer Name</label>'
      + '<input type="text" id="revName" value="'+esc(name)+'" placeholder="e.g. Sarah M."></div>'
      + '<div class="field" style="margin-bottom:16px"><label>Star Rating</label>'
      + '<div class="star-select" id="starSel">'+starsBtns()+'</div></div>'
      + '<div class="field" style="margin-bottom:16px"><label>Review Text</label>'
      + '<textarea id="revText" placeholder="What did the customer say?">'+esc(text)+'</textarea></div>'
      + '<div class="field"><label>Source Label</label>'
      + '<input type="text" id="revSource" value="'+esc(src)+'"></div>';
    var foot = '<button class="btn btn-ghost" data-modal-close>Cancel</button>'
      + '<button class="btn btn-orange" id="revSave">'+(rev?'Save Review':'Add Review')+'</button>';
    openModal(rev?'Edit Review':'Add New Review', body, foot);

    $('#starSel').addEventListener('click', function(e){
      var b = e.target.closest('[data-star]'); if(!b) return;
      pickedRating = +b.dataset.star;
      $all('#starSel button').forEach(function(x){ x.classList.toggle('on', +x.dataset.star<=pickedRating); });
    });

    $('#revSave').addEventListener('click', function(){
      var rname=$('#revName').value.trim(), rtext=$('#revText').value.trim(), rsource=$('#revSource').value.trim();
      if(!rname||!rtext){ toast('Name and review text required', true); return; }
      var payload = { reviewer_name:rname, stars:pickedRating, review_text:rtext, source:rsource };
      var p = rev
        ? sbPatch('/rest/v1/testimonials?id=eq.'+rev.id, payload).then(function(){ toast('Review updated'); })
        : sbPost('/rest/v1/testimonials', Object.assign(payload, {sort_order: liveReviews.length+1})).then(function(){ toast('Review added'); });
      p.then(function(){ loadReviews(); closeModal(); })
       .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     5. SERVICES MANAGER — live from Supabase
  ========================================================= */
  var liveServices = [];

  function renderServices(rows){
    liveServices = rows;
    var list = $('#svcList');
    list.innerHTML = rows.map(function(s){
      var icon = s.icon || 'wrench';
      var desc = s.description || s.desc || '';
      return '<div class="list-row" draggable="true" data-id="'+s.id+'">'
        + '<span class="drag-handle">'+ic('drag',2)+'</span>'
        + '<span class="list-ic">'+ic(icon)+'</span>'
        + '<div class="list-main"><h4>'+esc(s.title||'')+'</h4><p>'+esc(desc)+'</p></div>'
        + '<div class="list-actions">'
        +   '<button class="btn btn-ghost btn-icon" data-edit-svc="'+s.id+'">'+ic('edit',2)+'</button>'
        +   '<button class="btn btn-danger-soft btn-icon" data-del-svc="'+s.id+'">'+ic('trash',2)+'</button>'
        + '</div></div>';
    }).join('');
    $('#svcCount').textContent = rows.length + ' services';
    makeSortable(list, '.list-row', function(order){
      var patches = order.map(function(id, idx){
        return sbPatch('/rest/v1/services?id=eq.'+id, {sort_order: idx+1});
      });
      Promise.all(patches).then(function(){ toast('Order saved'); }).catch(function(){ toast('Order save failed', true); });
    });
  }

  function loadServices(){
    sbGet('/rest/v1/services?select=*&order=sort_order.asc')
      .then(function(rows){
        renderServices(rows && rows.length ? rows : DATA.services);
      })
      .catch(function(){ renderServices(DATA.services); });
  }

  document.addEventListener('click', function(e){
    var ed = e.target.closest('[data-edit-svc]');
    var dl = e.target.closest('[data-del-svc]');
    if(ed){
      var svc = liveServices.find(function(s){ return String(s.id)===ed.dataset.editSvc; });
      if(svc) openServiceModal(svc);
    }
    if(dl){
      var id = dl.dataset.delSvc;
      if(!confirm('Delete this service?')) return;
      sbDelete('/rest/v1/services?id=eq.'+id)
        .then(function(){
          liveServices = liveServices.filter(function(s){ return String(s.id)!==id; });
          renderServices(liveServices); toast('Service deleted');
        })
        .catch(function(){ toast('Delete failed', true); });
    }
  });

  $('#addService').addEventListener('click', function(){ openServiceModal(null); });

  var pickedIcon = 'wrench';
  function openServiceModal(svc){
    pickedIcon = svc ? (svc.icon||'wrench') : 'wrench';
    var iconsHtml = window.SERVICE_ICONS.map(function(n){
      return '<button type="button" class="'+(n===pickedIcon?'sel':'')+'" data-pick-icon="'+n+'">'+ic(n)+'</button>';
    }).join('');
    var body = '<div class="field" style="margin-bottom:16px"><label>Icon</label><div class="icon-pick" id="iconPick">'+iconsHtml+'</div></div>'
      + '<div class="field" style="margin-bottom:16px"><label>Title</label>'
      + '<input type="text" id="svcTitle" value="'+esc(svc?svc.title:'')+'" placeholder="e.g. Blocked Drains"></div>'
      + '<div class="field"><label>Description</label>'
      + '<textarea id="svcDesc" placeholder="Short description…">'+esc(svc?(svc.description||svc.desc):'')+'</textarea></div>';
    var foot = '<button class="btn btn-ghost" data-modal-close>Cancel</button>'
      + '<button class="btn btn-orange" id="svcSave">'+(svc?'Save Service':'Add Service')+'</button>';
    openModal(svc?'Edit Service':'Add New Service', body, foot);

    $('#iconPick').addEventListener('click', function(e){
      var b = e.target.closest('[data-pick-icon]'); if(!b) return;
      pickedIcon = b.dataset.pickIcon;
      $all('#iconPick button').forEach(function(x){ x.classList.toggle('sel', x===b); });
    });

    $('#svcSave').addEventListener('click', function(){
      var title = $('#svcTitle').value.trim(), desc = $('#svcDesc').value.trim();
      if(!title){ toast('Please enter a title', true); return; }
      var payload = { icon:pickedIcon, title:title, description:desc };
      var p = svc
        ? sbPatch('/rest/v1/services?id=eq.'+svc.id, payload).then(function(){ toast('Service updated'); })
        : sbPost('/rest/v1/services', Object.assign(payload, {sort_order: liveServices.length+1})).then(function(){ toast('Service added'); });
      p.then(function(){ loadServices(); closeModal(); })
       .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     GALLERY — Supabase-backed
  ========================================================= */
  var liveGallery = [];

  function renderGallery(rows){
    liveGallery = rows || [];
    var grid = $('#galGrid');
    grid.innerHTML = liveGallery.map(function(g){
      var src = g.url || g.img || '';
      var inner = src ? '<img src="'+esc(src)+'" alt="">' : '<div class="ph">'+esc(g.caption||g.label||'')+'</div>';
      return '<div class="gal-item" draggable="true" data-id="'+g.id+'">'+inner
        + '<button class="gal-del" data-del-gal="'+g.id+'">'+ic('trash',2)+'</button></div>';
    }).join('') + '<button class="gal-add" id="galAdd">'+ic('plus',2.2)+'Add Photos</button>';
    makeSortable(grid, '.gal-item', function(order){
      var patches = order.map(function(id, idx){
        return sbPatch('/rest/v1/gallery?id=eq.'+id, {sort_order: idx+1});
      });
      Promise.all(patches).then(function(){ toast('Order saved'); }).catch(function(){ toast('Order save failed', true); });
    });
    $('#galAdd').addEventListener('click', function(){
      pickFiles(true, function(files){
        var uploads = files.map(function(f){
          return uploadToStorage(f, 'gallery').then(function(url){
            return sbPost('/rest/v1/gallery', {url: url, caption: '', sort_order: liveGallery.length + 1});
          });
        });
        Promise.all(uploads)
          .then(function(){
            toast(files.length+' photo'+(files.length>1?'s':'')+' uploaded!');
            loadGalleryAdmin();
          })
          .catch(function(){ toast('Upload failed', true); });
      });
    });
  }

  function loadGalleryAdmin(){
    sbGet('/rest/v1/gallery?select=*&order=sort_order.asc')
      .then(function(rows){ renderGallery(rows && rows.length ? rows : DATA.gallery); })
      .catch(function(){ renderGallery(DATA.gallery); });
  }

  document.addEventListener('click', function(e){
    var d = e.target.closest('[data-del-gal]');
    if(d){
      var id = d.dataset.delGal;
      var row = liveGallery.find(function(g){ return String(g.id)===id; });
      var photoUrl = row ? (row.url || '') : '';
      deleteFromStorage(photoUrl);
      sbDelete('/rest/v1/gallery?id=eq.'+id)
        .then(function(){ liveGallery = liveGallery.filter(function(g){ return String(g.id)!==id; }); renderGallery(liveGallery); toast('Photo deleted'); })
        .catch(function(){ toast('Delete failed', true); });
    }
  });

  /* =========================================================
     CONTACT — tag input + save
  ========================================================= */
  var areas = ['Sydney CBD','Parramatta','Penrith','Liverpool','Hornsby','Sutherland'];
  function renderTags(){
    var box = $('#areaTags'); var input = box.querySelector('input');
    box.querySelectorAll('.tag').forEach(function(t){ t.remove(); });
    areas.forEach(function(a,i){
      var t = document.createElement('span'); t.className='tag';
      t.innerHTML = esc(a)+'<button data-tag="'+i+'">'+ic('close',2.4)+'</button>';
      box.insertBefore(t, input);
    });
  }
  $('#areaTags').addEventListener('keydown', function(e){
    if((e.key==='Enter'||e.key===',') && e.target.value.trim()){
      e.preventDefault(); areas.push(e.target.value.trim().replace(/,$/,'')); e.target.value=''; renderTags();
    } else if(e.key==='Backspace' && !e.target.value){ areas.pop(); renderTags(); }
  });
  $('#areaTags').addEventListener('click', function(e){
    var b=e.target.closest('[data-tag]'); if(b){ areas.splice(+b.dataset.tag,1); renderTags(); }
  });

  $('#contactSave').addEventListener('click', function(){
    var saves = [
      sbPatch('/rest/v1/settings?key=eq.phone',          {value: $('#contactPhone').value.trim()}),
      sbPatch('/rest/v1/settings?key=eq.email',          {value: $('#contactEmail').value.trim()}),
      sbPatch('/rest/v1/settings?key=eq.address',        {value: $('#contactAddress').value.trim()}),
      sbPatch('/rest/v1/settings?key=eq.google_maps_url',{value: $('#contactMapsUrl').value.trim()})
    ];
    // Replace all service_areas rows
    var areasSave = sbDelete('/rest/v1/service_areas?sort_order=gte.0').then(function(){
      if(!areas.length) return;
      return sbPost('/rest/v1/service_areas', areas.map(function(name, i){ return {name:name, sort_order:i+1}; }));
    });
    saves.push(areasSave);
    Promise.all(saves)
      .then(function(){ toast('Contact details saved!'); })
      .catch(function(){ toast('Save failed', true); });
  });

  /* =========================================================
     SOCIAL — with save
  ========================================================= */
  var SOCIAL = [
    {key:'facebook', label:'Facebook', icon:'share', ph:'https://facebook.com/aquafix', val:'https://facebook.com/aquafixplumbing', on:true},
    {key:'instagram', label:'Instagram', icon:'camera', ph:'https://instagram.com/aquafix', val:'https://instagram.com/aquafix_plumbing', on:true},
    {key:'whatsapp', label:'WhatsApp', icon:'phone', ph:'+61 4xx xxx xxx', val:'+61 400 123 456', on:true},
    {key:'google', label:'Google Business Profile', icon:'star', ph:'https://g.page/aquafix', val:'https://g.page/aquafix-plumbing', on:false}
  ];
  function renderSocial(){
    var html = SOCIAL.map(function(s){
      return '<div class="toggle-row">'
        + '<div class="tr-info" style="display:flex;align-items:center;gap:12px">'
        +   '<span class="list-ic" style="width:38px;height:38px;border-radius:10px">'+ic(s.icon)+'</span>'
        +   '<div><h4>'+s.label+'</h4><p>'+(s.on?'Visible on site':'Hidden')+'</p></div>'
        + '</div>'
        + '<label class="switch"><input type="checkbox" data-social="'+s.key+'" '+(s.on?'checked':'')+'><span class="track"></span></label>'
        + '</div>'
        + '<div class="field" style="padding:4px 0 16px;border-bottom:1px solid var(--line-2)">'
        +   '<input type="url" data-social-url="'+s.key+'" value="'+esc(s.val)+'" placeholder="'+s.ph+'" '+(s.on?'':'disabled style="opacity:.5"')+'>'
        + '</div>';
    }).join('');
    $('#socialCard').innerHTML = html + '<div class="save-bar"><button class="btn btn-ghost" id="socialDiscard">Discard</button><button class="btn btn-orange" id="socialSave">Save Changes</button></div>';
    $('#socialCard').addEventListener('change', function(e){
      var c = e.target.closest('[data-social]'); if(!c) return;
      var s = SOCIAL.find(function(x){return x.key===c.dataset.social;}); s.on=c.checked; renderSocial();
    }, {once:true});
    $('#socialSave').addEventListener('click', function(){
      var urlInputs = $all('[data-social-url]');
      urlInputs.forEach(function(inp){ var s = SOCIAL.find(function(x){return x.key===inp.dataset.socialUrl;}); if(s) s.val=inp.value.trim(); });
      var saves = SOCIAL.map(function(s){
        return sbPatch('/rest/v1/settings?key=eq.'+s.key, {value: s.val});
      });
      Promise.all(saves)
        .then(function(){ toast('Social links saved!'); })
        .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     HERO PANEL — save
  ========================================================= */
  function initHeroSave(){
    $('#heroSave').addEventListener('click', function(){
      var badge = $('#heroBadgeToggle') ? $('#heroBadgeToggle').checked : true;
      var saves = [
        sbPatch('/rest/v1/settings?key=eq.hero_heading',       {value: $('#heroHeadingInput').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_subheading',    {value: $('#heroSubheadingInput').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_badge_text',    {value: $('#heroBadgeTextInput').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_badge_visible', {value: badge ? 'true' : 'false'}),
        sbPatch('/rest/v1/settings?key=eq.hero_star_rating',   {value: $('#heroStarRatingInput').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_review_count',  {value: $('#heroReviewCountInput').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_trust_1',       {value: $('#heroTrust1').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_trust_2',       {value: $('#heroTrust2').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_trust_3',       {value: $('#heroTrust3').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.hero_trust_4',       {value: $('#heroTrust4').value.trim()})
      ];
      Promise.all(saves)
        .then(function(){ toast('Hero section saved!'); })
        .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     SETTINGS PANEL — save (site settings)
  ========================================================= */
  function initSettingsSave(){
    $('#settingsSave2').addEventListener('click', function(){
      var annOn = $('#settingsAnnouncementOn') ? $('#settingsAnnouncementOn').checked : false;
      var saves = [
        sbPatch('/rest/v1/settings?key=eq.business_name',   {value: $('#settingsBusinessName').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.tagline',         {value: $('#settingsTagline').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.abn',             {value: $('#settingsAbn').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.licence',         {value: $('#settingsLicence').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.announcement',    {value: $('#settingsAnnouncement').value.trim()}),
        sbPatch('/rest/v1/settings?key=eq.announcement_on', {value: annOn ? 'true' : 'false'})
      ];
      Promise.all(saves)
        .then(function(){ toast('Settings saved!'); loadSettings(); })
        .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     BRANDING — colour save
  ========================================================= */
  function initBrandingSave(){
    $('#brandingSave').addEventListener('click', function(){
      var saves = [
        sbPatch('/rest/v1/settings?key=eq.colour_primary', {value: ($('[data-color="primary"]')||{}).value||''}),
        sbPatch('/rest/v1/settings?key=eq.colour_accent',  {value: ($('[data-color="accent"]')||{}).value||''}),
        sbPatch('/rest/v1/settings?key=eq.colour_bg',      {value: ($('[data-color="bg"]')||{}).value||''}),
        sbPatch('/rest/v1/settings?key=eq.colour_text',    {value: ($('[data-color="text"]')||{}).value||''})
      ];
      Promise.all(saves)
        .then(function(){ toast('Brand colours saved!'); })
        .catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     WHY US — CRUD
  ========================================================= */
  var liveWhyUs = [];

  function renderWhyUs(rows){
    liveWhyUs = rows || [];
    var list = $('#whyList');
    list.innerHTML = rows.map(function(w){
      var desc = w.description || w.desc || '';
      return '<div class="list-row" draggable="true" data-id="'+w.id+'">'
        + '<span class="drag-handle">'+ic('drag',2)+'</span>'
        + '<span class="list-ic">'+ic(w.icon||'shield')+'</span>'
        + '<div class="list-main"><h4>'+esc(w.title||'')+'</h4><p>'+esc(desc)+'</p></div>'
        + '<div class="list-actions">'
        +   '<button class="btn btn-ghost btn-icon" data-edit-why="'+w.id+'">'+ic('edit',2)+'</button>'
        +   '<button class="btn btn-danger-soft btn-icon" data-del-why="'+w.id+'">'+ic('trash',2)+'</button>'
        + '</div></div>';
    }).join('');
    $('#whyCount').textContent = rows.length + ' items';
    makeSortable(list, '.list-row', function(order){
      var patches = order.map(function(id, idx){
        return sbPatch('/rest/v1/why_us?id=eq.'+id, {sort_order: idx+1});
      });
      Promise.all(patches).then(function(){ toast('Order saved'); }).catch(function(){ toast('Order save failed', true); });
    });
  }

  function loadWhyUsAdmin(){
    sbGet('/rest/v1/why_us?select=*&order=sort_order.asc')
      .then(function(rows){ renderWhyUs(rows||[]); })
      .catch(function(){ renderWhyUs([]); });
  }

  document.addEventListener('click', function(e){
    var ed = e.target.closest('[data-edit-why]');
    var dl = e.target.closest('[data-del-why]');
    if(ed){
      var item = liveWhyUs.find(function(w){ return String(w.id)===ed.dataset.editWhy; });
      if(item) openWhyModal(item);
    }
    if(dl){
      var id = dl.dataset.delWhy;
      if(!confirm('Delete this item?')) return;
      sbDelete('/rest/v1/why_us?id=eq.'+id)
        .then(function(){ liveWhyUs=liveWhyUs.filter(function(w){ return String(w.id)!==id; }); renderWhyUs(liveWhyUs); toast('Item deleted'); })
        .catch(function(){ toast('Delete failed', true); });
    }
  });

  $('#addWhyUs').addEventListener('click', function(){ openWhyModal(null); });

  function openWhyModal(item){
    var body = '<div class="field" style="margin-bottom:16px"><label>Icon Name</label>'
      + '<input type="text" id="whyIcon" value="'+esc(item?item.icon||'shield':'shield')+'" placeholder="e.g. shield, clock, dollar, award"></div>'
      + '<div class="field" style="margin-bottom:16px"><label>Title</label>'
      + '<input type="text" id="whyTitle" value="'+esc(item?item.title||'':'')+'" placeholder="e.g. Licensed & Insured"></div>'
      + '<div class="field"><label>Description</label>'
      + '<textarea id="whyDesc" placeholder="Short tagline…">'+esc(item?(item.description||item.desc||''):'')+'</textarea></div>';
    var foot = '<button class="btn btn-ghost" data-modal-close>Cancel</button>'
      + '<button class="btn btn-orange" id="whySave">'+(item?'Save':'Add Item')+'</button>';
    openModal(item?'Edit Item':'Add Why Us Item', body, foot);
    $('#whySave').addEventListener('click', function(){
      var title=$('#whyTitle').value.trim(), desc=$('#whyDesc').value.trim(), icon=$('#whyIcon').value.trim()||'shield';
      if(!title){ toast('Please enter a title', true); return; }
      var payload={icon:icon, title:title, description:desc};
      var p = item
        ? sbPatch('/rest/v1/why_us?id=eq.'+item.id, payload).then(function(){ toast('Item updated'); })
        : sbPost('/rest/v1/why_us', Object.assign(payload,{sort_order:liveWhyUs.length+1})).then(function(){ toast('Item added'); });
      p.then(function(){ loadWhyUsAdmin(); closeModal(); }).catch(function(){ toast('Save failed', true); });
    });
  }

  /* =========================================================
     SERVICE AREAS — list + add + delete + reorder
  ========================================================= */
  var liveAreas = [];

  function renderAreaList(rows){
    liveAreas = rows || [];
    var list = $('#areaList');
    list.innerHTML = rows.map(function(a){
      return '<div class="list-row" draggable="true" data-id="'+a.id+'">'
        + '<span class="drag-handle">'+ic('drag',2)+'</span>'
        + '<div class="list-main"><h4>'+esc(a.name)+'</h4></div>'
        + '<div class="list-actions">'
        +   '<button class="btn btn-danger-soft btn-icon" data-del-area="'+a.id+'">'+ic('trash',2)+'</button>'
        + '</div></div>';
    }).join('');
    makeSortable(list, '.list-row', function(order){
      var patches = order.map(function(id, idx){
        return sbPatch('/rest/v1/service_areas?id=eq.'+id, {sort_order: idx+1});
      });
      Promise.all(patches).catch(function(){ toast('Order save failed', true); });
    });
  }

  function loadServiceAreasAdmin(){
    sbGet('/rest/v1/service_areas?select=*&order=sort_order.asc')
      .then(function(rows){ renderAreaList(rows||[]); areas = (rows||[]).map(function(r){ return r.name; }); renderTags(); })
      .catch(function(){ renderAreaList([]); });
  }

  document.addEventListener('click', function(e){
    var dl = e.target.closest('[data-del-area]');
    if(dl){
      var id = dl.dataset.delArea;
      sbDelete('/rest/v1/service_areas?id=eq.'+id)
        .then(function(){ liveAreas=liveAreas.filter(function(a){ return String(a.id)!==id; }); renderAreaList(liveAreas); toast('Area deleted'); })
        .catch(function(){ toast('Delete failed', true); });
    }
  });

  $('#addAreaBtn').addEventListener('click', function(){
    var val = $('#newAreaInput').value.trim(); if(!val) return;
    sbPost('/rest/v1/service_areas', {name:val, sort_order: liveAreas.length+1})
      .then(function(){ $('#newAreaInput').value=''; loadServiceAreasAdmin(); toast('Area added'); })
      .catch(function(){ toast('Add failed', true); });
  });

  /* =========================================================
     BRANDING (unchanged)
  ========================================================= */
  function initBranding(){
    function updateSwatch(){
      var cols = $all('[data-color]').map(function(i){ return {k:i.dataset.color, v:i.value}; });
      $('#swatchPreview').innerHTML = cols.map(function(c){
        var dark = isDark(c.v);
        return '<div class="sw" style="background:'+c.v+';color:'+(dark?'#fff':'#1B2A4A')+'">'+c.k+'</div>';
      }).join('');
    }
    $all('[data-color]').forEach(function(inp){
      inp.addEventListener('input', function(){
        inp.closest('.color-field').querySelector('.hex').textContent = inp.value.toUpperCase();
        updateSwatch();
      });
    });
    updateSwatch();
    var sel = $('#fontSelect');
    sel.addEventListener('change', function(){
      var f = sel.value;
      if(['Inter','Helvetica Neue'].indexOf(f)===-1){
        var id='gf-'+f.replace(/\s/g,'');
        if(!document.getElementById(id)){
          var l=document.createElement('link'); l.id=id; l.rel='stylesheet';
          l.href='https://fonts.googleapis.com/css2?family='+f.replace(/\s/g,'+')+':wght@400;700&display=swap';
          document.head.appendChild(l);
        }
      }
      $('#fontSample').style.fontFamily = '"'+f+'", sans-serif';
    });
  }
  function isDark(hex){
    var c = hex.replace('#',''); if(c.length===3) c=c.split('').map(function(x){return x+x;}).join('');
    var r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16);
    return (0.299*r+0.587*g+0.114*b) < 150;
  }

  /* =========================================================
     UPLOADERS
  ========================================================= */
  function pickFiles(multiple, cb){
    var inp = document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.multiple=!!multiple;
    inp.addEventListener('change', function(){ if(inp.files.length) cb([].slice.call(inp.files)); });
    inp.click();
  }

  function showUploadPreview(zone, file, publicUrl){
    var prev = zone.parentElement.querySelector('.upload-preview');
    if(prev) prev.remove();
    var p = document.createElement('div'); p.className='upload-preview';
    p.innerHTML = '<img src="'+esc(publicUrl)+'" alt=""><div><div class="nm">'+esc(file.name)+'</div><div class="sz">'+(file.size/1024).toFixed(0)+' KB · uploaded</div></div>';
    zone.parentElement.appendChild(p);
  }

  function initUploaders(){
    $all('[data-upload]').forEach(function(zone){
      var key = zone.dataset.upload;

      function handle(files){
        var f = files[0]; if(!f) return;

        if(key === 'hero'){
          sbGet('/rest/v1/settings?key=eq.hero_photo&select=value')
            .then(function(rows){ return rows && rows[0] ? rows[0].value : ''; })
            .then(function(oldUrl){ return deleteFromStorage(oldUrl); })
            .then(function(){ return uploadToStorage(f, 'hero'); })
            .then(function(url){
              return sbPatch('/rest/v1/settings?key=eq.hero_photo', {value: url}).then(function(){ return url; });
            }).then(function(url){
              showUploadPreview(zone, f, url);
              toast('Hero photo updated!');
            }).catch(function(){ toast('Hero upload failed', true); });

        } else if(key === 'logo'){
          sbGet('/rest/v1/settings?key=eq.logo_url&select=value')
            .then(function(rows){ return rows && rows[0] ? rows[0].value : ''; })
            .then(function(oldUrl){ return deleteFromStorage(oldUrl); })
            .then(function(){ return uploadToStorage(f, 'logo'); })
            .then(function(url){
              return sbPatch('/rest/v1/settings?key=eq.logo_url', {value: url}).then(function(){ return url; });
            }).then(function(url){
              showUploadPreview(zone, f, url);
              toast('Logo updated!');
            }).catch(function(){ toast('Logo upload failed', true); });

        } else {
          /* fallback for any other upload zones (favicon etc) — local preview only */
          var localUrl = URL.createObjectURL(f);
          showUploadPreview(zone, f, localUrl);
          toast(key.charAt(0).toUpperCase()+key.slice(1)+' uploaded');
        }
      }

      zone.addEventListener('click', function(){ pickFiles(false, handle); });
      zone.addEventListener('dragover', function(e){ e.preventDefault(); zone.classList.add('drag'); });
      zone.addEventListener('dragleave', function(){ zone.classList.remove('drag'); });
      zone.addEventListener('drop', function(e){ e.preventDefault(); zone.classList.remove('drag'); if(e.dataTransfer.files.length) handle([].slice.call(e.dataTransfer.files)); });
    });
  }

  /* =========================================================
     DRAG-TO-REORDER (shared)
  ========================================================= */
  function makeSortable(container, sel, onReorder){
    var dragEl = null;
    container.addEventListener('dragstart', function(e){
      var item = e.target.closest(sel); if(!item) return;
      dragEl = item; item.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
    });
    container.addEventListener('dragend', function(){
      if(!dragEl) return;
      dragEl.classList.remove('dragging');
      $all(sel, container).forEach(function(x){ x.classList.remove('drop-target'); });
      var order = $all(sel, container).map(function(x){ var id=x.dataset.id; return isNaN(+id)?id:+id; });
      dragEl=null; onReorder(order);
    });
    container.addEventListener('dragover', function(e){
      e.preventDefault(); if(!dragEl) return;
      var target = e.target.closest(sel); if(!target||target===dragEl) return;
      var items = $all(sel, container);
      var di = items.indexOf(dragEl), ti = items.indexOf(target);
      if(di<ti) target.after(dragEl); else target.before(dragEl);
    });
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function() {
    /* populate welcome name from stored session */
    try {
      var adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      var displayName = adminUser.email ? adminUser.email.split('@')[0] : 'Admin';
      var welcomeEl = document.getElementById('adminWelcome');
      var welcomeDashEl = document.getElementById('adminWelcomeDash');
      var avatarEl = document.getElementById('adminAvatar');
      if(welcomeEl) welcomeEl.textContent = displayName;
      if(welcomeDashEl) welcomeDashEl.textContent = displayName;
      if(avatarEl) avatarEl.textContent = displayName.substring(0,2).toUpperCase();
    } catch(e){}

    loadGalleryAdmin();
    renderTags();
    renderSocial();
    initBranding();
    initBrandingSave();
    initUploaders();
    initHeroSave();
    initSettingsSave();
    loadDashboard();
    loadEnquiries();
    loadSettings();
    loadServices();
    loadReviews();
    loadWhyUsAdmin();
    loadServiceAreasAdmin();
  });

})();
