/* ============ AquaFix Plumbing — app.js ============ */
(function(){
  'use strict';

  /* ---- icon library (Lucide-style 24x24 stroke paths) ---- */
  var ICONS = {
    droplet:'<path d="M12 2.69 17.66 8.34A8 8 0 1 1 6.34 8.34L12 2.69z"/>',
    filter:'<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
    thermometer:'<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
    search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    shield:'<path d="M20 13c0 5-3.5 7.5-7.7 8.95a1 1 0 0 1-.6.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    dollar:'<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    google:'<path d="M21.35 11.1H12v3.83h5.35a4.58 4.58 0 0 1-1.98 3v2.5h3.2c1.87-1.72 2.95-4.27 2.95-7.29 0-.7-.06-1.37-.17-2.04z" fill="#4285F4" stroke="none"/><path d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.2-2.5c-.9.6-2.04.96-3.42.96-2.63 0-4.86-1.78-5.66-4.17H3.05v2.59A10 10 0 0 0 12 22z" fill="#34A853" stroke="none"/><path d="M6.34 13.86A6 6 0 0 1 6.02 12c0-.64.11-1.27.32-1.86V7.55H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.45l3.29-2.59z" fill="#FBBC05" stroke="none"/><path d="M12 5.97c1.48 0 2.8.51 3.85 1.5l2.84-2.84A10 10 0 0 0 12 2 10 10 0 0 0 3.05 7.55l3.29 2.59C7.14 7.75 9.37 5.97 12 5.97z" fill="#EA4335" stroke="none"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    percent:'<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'
  };
  function svg(name, stroke){
    var s = stroke===false ? '' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg viewBox="0 0 24 24" '+s+'>'+ICONS[name]+'</svg>';
  }
  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/></svg>';

  /* ---- fill 5-star spans ---- */
  document.querySelectorAll('.stars[data-stars]').forEach(function(el){
    el.innerHTML = STAR.repeat(parseInt(el.dataset.stars,10)||5);
  });

  /* ---- services ---- */
  var SERVICES = [
    {ic:'droplet', t:'Emergency Plumbing', d:'24/7 rapid response for burst pipes, floods and urgent leaks.'},
    {ic:'filter', t:'Blocked Drains', d:'High-pressure jetting and CCTV diagnosis to clear any blockage.'},
    {ic:'thermometer', t:'Hot Water Systems', d:'Repair, replace and install gas, electric and solar systems.'},
    {ic:'search', t:'Leak Detection', d:'Non-invasive acoustic tech to find hidden leaks before damage spreads.'},
    {ic:'wrench', t:'Bathroom Renovations', d:'Full plumbing for new bathrooms, fixtures, tapware and waste.'},
    {ic:'flame', t:'Gas Fitting', d:'Licensed gas installation, repairs and certified safety checks.'}
  ];
  document.getElementById('svcGrid').innerHTML = SERVICES.map(function(s){
    return '<article class="svc-card">'
      + '<div class="svc-ic">'+svg(s.ic)+'</div>'
      + '<h3>'+s.t+'</h3><p>'+s.d+'</p>'
      + '<span class="more">Learn more '+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>'
      + '</article>';
  }).join('');

  /* ---- why us ---- */
  var WHY = [
    {ic:'shield', t:'Licensed &amp; Insured', d:'Fully accredited NSW master plumbers.'},
    {ic:'clock', t:'Same Day Service', d:'On-site within hours, not days.'},
    {ic:'dollar', t:'Upfront Pricing', d:'Fixed quotes — no hidden fees, ever.'},
    {ic:'award', t:'10+ Years Experience', d:'Thousands of Sydney homes served.'}
  ];
  document.getElementById('whyGrid').innerHTML = WHY.map(function(w){
    return '<article class="why-card">'
      + '<div class="why-ic">'+svg(w.ic)+'</div>'
      + '<h3>'+w.t+'</h3><p>'+w.d+'</p>'
      + '</article>';
  }).join('');

  /* ---- map chips ---- */
  var AREAS = ['Sydney CBD','Parramatta','Penrith','Liverpool','Hornsby','Sutherland','Bondi','North Shore'];
  document.getElementById('mapChips').innerHTML = AREAS.map(function(a){
    return '<span class="map-chip">'+svg('pin')+a+'</span>';
  }).join('');

  /* ---- hero: google mark, checks, strip ---- */
  var heroG = document.getElementById('heroG');
  if(heroG) heroG.innerHTML = '<svg viewBox="0 0 24 24">'+ICONS.google+'</svg>';

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var HCHECKS = ['$0 Call-Out','Same Day Service','Upfront Pricing','Licensed & Insured'];
  var heroChecks = document.getElementById('heroChecks');
  if(heroChecks) heroChecks.innerHTML = HCHECKS.map(function(t){
    return '<li><span class="ck">'+CHECK+'</span>'+t+'</li>';
  }).join('');

  var HSTRIP = [
    {ic:'dollar', t:'$0 Call-Out'},
    {ic:'clock', t:'Same Day'},
    {ic:'droplet', t:'24/7 Emergency'},
    {ic:'shield', t:'Licensed & Insured'},
    {ic:'percent', t:'Fixed Pricing'},
    {ic:'pin', t:'Local Sydney Team'}
  ];
  var heroStrip = document.getElementById('heroStrip');
  if(heroStrip) heroStrip.innerHTML = HSTRIP.map(function(s){
    return '<span class="item">'+svg(s.ic)+s.t+'</span>';
  }).join('');

  /* ---- hero form: filled state + validation ---- */
  var heroForm = document.getElementById('heroForm');
  if(heroForm){
    heroForm.querySelectorAll('select, input[type=date]').forEach(function(el){
      el.addEventListener('change', function(){ el.classList.toggle('filled', !!el.value); });
    });
    heroForm.querySelectorAll('input').forEach(function(inp){
      inp.addEventListener('input', function(){ inp.closest('.hfield').classList.remove('error'); });
    });
    heroForm.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = true;
      var f = heroForm;
      var checks = [
        [f.name, f.name.value.trim().length > 1],
        [f.phone, f.phone.value.replace(/\D/g,'').length >= 8],
        [f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)]
      ];
      checks.forEach(function(c){
        c[0].closest('.hfield').classList.toggle('error', !c[1]);
        ok = ok && c[1];
      });
      if(!ok){ heroForm.querySelector('.hfield.error input').focus(); return; }

      var btn = heroForm.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var formData = {
        name: f.name.value.trim(),
        phone: f.phone.value.trim(),
        email: f.email.value.trim(),
        suburb: f.suburb ? f.suburb.value.trim() : '',
        service: f.service ? f.service.value : '',
        preferred_date: f.date ? f.date.value : null,
        preferred_time: f.time ? f.time.value : '',
        message: f.message ? f.message.value.trim() : '',
        source: 'hero_form'
      };
      if(!formData.preferred_date) delete formData.preferred_date;

      fetch(supabase.url + '/rest/v1/enquiries', {
        method: 'POST',
        headers: supabase.headers,
        body: JSON.stringify(formData)
      })
      .then(function(res){
        if(!res.ok) throw new Error('submit failed');
        document.getElementById('heroFormWrap').style.display = 'none';
        document.getElementById('heroSuccess').classList.add('show');
      })
      .catch(function(){
        btn.disabled = false;
        btn.textContent = 'Submit';
        var errEl = heroForm.querySelector('.hero-form-error');
        if(!errEl){
          errEl = document.createElement('p');
          errEl.className = 'hero-form-error';
          errEl.style.cssText = 'color:#ff7a7a;font-size:13px;margin-top:10px;text-align:center';
          heroForm.querySelector('.hero-submit').after(errEl);
        }
        errEl.textContent = 'Something went wrong. Please call us directly.';
      });
    });
  }

  /* ---- nav scroll shadow ---- */
  var nav = document.getElementById('nav');
  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- mobile drawer ---- */
  var drawer = document.getElementById('drawer');
  document.getElementById('navToggle').addEventListener('click', function(){ drawer.classList.add('open'); });
  drawer.querySelectorAll('[data-close]').forEach(function(el){
    el.addEventListener('click', function(){ drawer.classList.remove('open'); });
  });

  /* ---- gallery pagination ---- */
  var gDots = document.getElementById('galleryDots');
  var gPages = document.querySelectorAll('.gallery-page');
  gDots.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var i = parseInt(btn.dataset.go,10);
      gPages.forEach(function(p,idx){ p.classList.toggle('active', idx===i); });
      gDots.querySelectorAll('button').forEach(function(b,idx){ b.classList.toggle('active', idx===i); });
    });
  });

  /* ---- reviews carousel (uses live data if loaded, else fallback) ---- */
  var REVIEWS_FALLBACK = [
    {q:'Called at 7am with a burst pipe — they were here by 9 and fixed it under quote. Lifesavers!', n:'Sarah M.', i:'S', src:'google'},
    {q:'Replaced our hot water system same day. Friendly, tidy and the price was exactly what they quoted.', n:'James T.', i:'J', src:'google'},
    {q:'Cleared a blocked drain that two other plumbers couldn\'t. CCTV showed exactly the issue. Brilliant.', n:'Priya K.', i:'P', src:'google'},
    {q:'Renovated our whole bathroom and the plumbing is flawless. Tidy workmanship and great communication.', n:'Daniel R.', i:'D', src:'google'},
    {q:'Came out late on a Sunday for a gas leak. Professional, calm and sorted it safely. Can\'t fault them.', n:'Megan L.', i:'M', src:'google'},
    {q:'Honest upfront pricing and no surprises on the invoice. Our go-to plumbers from now on.', n:'Tom H.', i:'T', src:'google'}
  ];
  var revGoogle = '<svg viewBox="0 0 24 24">'+ICONS.google+'</svg>';
  var currentReviews = REVIEWS_FALLBACK;
  var pos = 0;

  function buildRevHTML(reviews){
    return reviews.map(function(r){
      var initial = (r.reviewer_name || r.n || '?')[0].toUpperCase();
      var name = r.reviewer_name || r.n || '';
      var quote = r.review_text || r.q || '';
      var stars = parseInt(r.stars,10) || 5;
      return '<article class="rev-card">'
        + '<span class="stars">'+STAR.repeat(stars)+'</span>'
        + '<p class="rev-quote">"'+escHtml(quote)+'"</p>'
        + '<div class="rev-author">'
        +   '<span class="rev-avatar">'+initial+'</span>'
        +   '<div><div class="rev-name">'+escHtml(name)+'</div>'
        +   '<div class="rev-src">'+revGoogle+' Google Review</div></div>'
        + '</div></article>';
    }).join('');
  }

  function renderRevTrack(reviews){
    document.getElementById('revTrack').innerHTML = buildRevHTML(reviews);
    currentReviews = reviews;
    pos = 0;
    buildDots();
    renderRev();
  }

  function perView(){ return window.innerWidth <= 680 ? 1 : (window.innerWidth <= 980 ? 2 : 3); }
  function maxPos(){ return Math.max(0, currentReviews.length - perView()); }

  function buildDots(){
    var revDots = document.getElementById('revDots');
    var n = maxPos() + 1;
    revDots.innerHTML = '';
    for(var i=0;i<n;i++){
      var b = document.createElement('button');
      b.className = 'rd' + (i===pos?' active':'');
      b.setAttribute('aria-label','Review '+(i+1));
      (function(idx){ b.addEventListener('click', function(){ pos = idx; renderRev(); }); })(i);
      revDots.appendChild(b);
    }
  }

  function syncDots(){
    var dots = document.getElementById('revDots').querySelectorAll('.rd');
    dots.forEach(function(d,i){ d.classList.toggle('active', i===pos); });
  }

  function renderRev(){
    var track = document.getElementById('revTrack');
    var revDots = document.getElementById('revDots');
    var card = track.querySelector('.rev-card');
    if(!card) return;
    var step = card.getBoundingClientRect().width + 24;
    pos = Math.min(pos, maxPos());
    track.style.transform = 'translateX('+(-pos*step)+'px)';
    if(revDots.children.length !== maxPos()+1) buildDots(); else syncDots();
  }

  document.getElementById('revPrev').addEventListener('click', function(){ pos = pos<=0 ? maxPos() : pos-1; renderRev(); });
  document.getElementById('revNext').addEventListener('click', function(){ pos = pos>=maxPos() ? 0 : pos+1; renderRev(); });
  window.addEventListener('resize', renderRev);

  /* swipe (mobile) */
  var sx=0, sy=0, swiping=false;
  var vp = document.querySelector('.rev-viewport');
  vp.addEventListener('touchstart', function(e){ sx=e.touches[0].clientX; sy=e.touches[0].clientY; swiping=true; }, {passive:true});
  vp.addEventListener('touchend', function(e){
    if(!swiping) return; swiping=false;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){
      if(dx < 0) pos = pos>=maxPos() ? maxPos() : pos+1;
      else pos = pos<=0 ? 0 : pos-1;
      renderRev();
    }
  }, {passive:true});

  /* render fallback immediately; Supabase data overwrites if available */
  renderRevTrack(REVIEWS_FALLBACK);

  /* ---- booking form (bottom section) ---- */
  var form = document.getElementById('bookForm');
  var formSuccess = document.getElementById('formSuccess');

  function setError(field, on){ field.classList.toggle('error', on); }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = true;
    var name = form.name, phone = form.phone, email = form.email;
    var nameOk = name.value.trim().length > 1; setError(name.closest('.field'), !nameOk); ok = ok && nameOk;
    var phoneOk = phone.value.replace(/\D/g,'').length >= 8; setError(phone.closest('.field'), !phoneOk); ok = ok && phoneOk;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value); setError(email.closest('.field'), !emailOk); ok = ok && emailOk;
    if(!ok){ form.querySelector('.field.error input').focus(); return; }

    var submitBtn = form.querySelector('button[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var formData = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      service: form.service ? form.service.value : '',
      preferred_date: form.date ? form.date.value : null,
      message: form.message ? form.message.value.trim() : '',
      source: 'book_form'
    };
    if(!formData.preferred_date) delete formData.preferred_date;

    fetch(supabase.url + '/rest/v1/enquiries', {
      method: 'POST',
      headers: supabase.headers,
      body: JSON.stringify(formData)
    })
    .then(function(res){
      if(!res.ok) throw new Error('submit failed');
      form.style.display = 'none';
      formSuccess.classList.add('show');
    })
    .catch(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request a Quote';
      var errEl = form.querySelector('.book-form-error');
      if(!errEl){
        errEl = document.createElement('p');
        errEl.className = 'book-form-error';
        errEl.style.cssText = 'color:#dc2626;font-size:13px;margin-top:10px;text-align:center';
        form.querySelector('.form-submit').prepend(errEl);
      }
      errEl.textContent = 'Something went wrong. Please call us directly.';
    });
  });

  form.querySelectorAll('input').forEach(function(inp){
    inp.addEventListener('input', function(){ setError(inp.closest('.field'), false); });
  });

  /* ---- active nav link on scroll ---- */
  var sections = ['services','why','gallery','reviews','contact'];
  var navLinks = {};
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var id = a.getAttribute('href').slice(1); navLinks[id] = a;
  });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        Object.values(navLinks).forEach(function(a){ a.style.color=''; a.style.background=''; });
        var link = navLinks[en.target.id];
        if(link){ link.style.color='var(--orange)'; }
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(function(id){ var el=document.getElementById(id); if(el) spy.observe(el); });

  /* ============================================================
     SUPABASE INTEGRATION
     ============================================================ */

  function escHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ---- 1. Load Settings ---- */
  function loadSettings(){
    if(typeof supabase === 'undefined') return;
    fetch(supabase.url + '/rest/v1/settings?select=*', { headers: supabase.headers })
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(rows){
        if(!rows || !rows.length) return;
        var cfg = {};
        rows.forEach(function(r){ cfg[r.key] = r.value; });

        if(cfg.business_name){
          document.title = cfg.business_name + ' — Your Trusted Local Plumber in Sydney';
          document.querySelectorAll('.business-name').forEach(function(el){ el.textContent = cfg.business_name; });
        }

        if(cfg.phone){
          var rawPhone = cfg.phone.replace(/\D/g,'');
          document.querySelectorAll('.phone-number').forEach(function(el){ el.textContent = cfg.phone; });
          document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
            a.href = 'tel:' + rawPhone;
            /* update visible text only if it looks like a phone number */
            if(/^[\d\s()+\-]+$/.test(a.textContent.trim())) a.textContent = cfg.phone;
          });
        }

        if(cfg.email){
          document.querySelectorAll('.contact-email').forEach(function(el){ el.textContent = cfg.email; });
          document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
            a.href = 'mailto:' + cfg.email;
            if(a.textContent.includes('@')) a.textContent = cfg.email;
          });
        }

        if(cfg.whatsapp){
          var waNum = cfg.whatsapp.replace(/\D/g,'');
          var waUrl = 'https://wa.me/' + waNum;
          document.querySelectorAll('.fab-wa, .mbtn-wa').forEach(function(a){ a.href = waUrl; });
        }

        if(cfg.hero_photo && cfg.hero_photo.trim()){
          var heroSlot = document.querySelector('#hero-photo');
          if(heroSlot){
            var heroImg = document.createElement('img');
            heroImg.src = cfg.hero_photo;
            heroImg.alt = 'Hero photo';
            heroImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
            heroSlot.replaceWith(heroImg);
          }
        }

        if(cfg.logo_url && cfg.logo_url.trim()){
          document.querySelectorAll('.brand-mark').forEach(function(el){
            el.innerHTML = '<img src="'+cfg.logo_url+'" alt="Logo" style="width:100%;height:100%;object-fit:contain">';
          });
        }
      })
      .catch(function(){}); /* silent — hardcoded values remain */
  }

  /* ---- 2. Load Testimonials ---- */
  function loadTestimonials(){
    if(typeof supabase === 'undefined') return;
    fetch(supabase.url + '/rest/v1/testimonials?select=*&order=sort_order.asc', { headers: supabase.headers })
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(rows){
        if(rows && rows.length) renderRevTrack(rows);
        /* else fallback already rendered */
      })
      .catch(function(){});
  }

  /* ---- 3. Load Gallery ---- */
  function loadGallery(){
    if(typeof supabase === 'undefined') return;
    fetch(supabase.url + '/rest/v1/gallery?select=*&order=sort_order.asc', { headers: supabase.headers })
      .then(function(res){ return res.ok ? res.json() : []; })
      .then(function(rows){
        if(!rows || !rows.length) return; /* keep image-slot placeholders */

        /* Split into pages of 6 */
        var pages = [];
        for(var i=0;i<rows.length;i+=6) pages.push(rows.slice(i,i+6));

        /* Heights to cycle through for visual variety */
        var heights = [300,230,240,300,250,220];

        var galSection = document.getElementById('gallery');
        /* Remove existing gallery-pages */
        galSection.querySelectorAll('.gallery-page').forEach(function(el){ el.remove(); });

        var dotsWrap = document.getElementById('galleryDots');
        dotsWrap.innerHTML = '';

        var wrap = galSection.querySelector('.wrap');
        pages.forEach(function(pageRows, pi){
          var pageEl = document.createElement('div');
          pageEl.className = 'gallery-page' + (pi===0?' active':'');
          pageEl.dataset.page = pi;

          var masonry = document.createElement('div');
          masonry.className = 'masonry';
          pageRows.forEach(function(row, ri){
            var h = heights[ri % heights.length];
            var img = document.createElement('img');
            img.src = escHtml(row.url);
            img.alt = escHtml(row.caption || 'Job photo');
            img.style.cssText = 'width:100%;height:'+h+'px;object-fit:cover;border-radius:12px;display:block';
            img.loading = 'lazy';
            masonry.appendChild(img);
          });
          pageEl.appendChild(masonry);
          wrap.insertBefore(pageEl, dotsWrap);

          /* dot button */
          var dotBtn = document.createElement('button');
          dotBtn.dataset.go = pi;
          dotBtn.setAttribute('aria-label','Page '+(pi+1));
          if(pi===0) dotBtn.className = 'active';
          dotsWrap.appendChild(dotBtn);
        });

        /* re-bind dot clicks now that they're rebuilt */
        dotsWrap.querySelectorAll('button').forEach(function(btn){
          btn.addEventListener('click', function(){
            var idx = parseInt(btn.dataset.go,10);
            galSection.querySelectorAll('.gallery-page').forEach(function(p,i){ p.classList.toggle('active', i===idx); });
            dotsWrap.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('active', i===idx); });
          });
        });
      })
      .catch(function(){});
  }

  /* ---- kick off all Supabase fetches ---- */
  loadSettings();
  loadTestimonials();
  loadGallery();

})();
