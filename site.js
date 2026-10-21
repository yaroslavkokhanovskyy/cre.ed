/* CRE-Ed.com — shared app code: header/footer, auth, data (Supabase or demo mode). */
(function () {
  const CFG = window.CREED || {};
  const DEMO = !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY;
  const WEEKS = window.CREED_WEEKS || [];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  const OFFERS = {
    bcr90: { slug: 'bcr90', n: 1, name: 'Become a Commercial Realtor in 90 Days', who: 'Licensed residential agents moving into commercial, and career changers licensing now or about to.', price: 797, label: 'Founding member price',
      bullets: ['12-week video series, one video per week', 'Foundation (weeks 1–4), Building the Business (5–8), Closing Deals (9–12)', 'Downloadable homework sheet every week', 'Coaching with Coach Lijoy for all 90 days'],
      fine: 'This program helps you build a commercial practice. It does not provide a real estate licence. In Ontario, licensing runs through the Humber program and RECO registration.', home: 'members.html#/p1' },
    deal90: { slug: 'deal90', n: 2, name: 'Analyze and Find Your First Commercial Deal in 90 Days', who: 'Investors, business owners who want to own their building, and professionals with capital.', price: 1997, plan: { n: 3, each: 666 },
      bullets: ['8 modules, about 30 lessons (roughly 5 hours)', 'One worksheet per module', 'Built-in Deal Analyzer', 'Coaching with Coach Lijoy for all 90 days'], home: 'members.html#/p2' }
  };
  const BOOKS = [
    { slug: 'buy-cre', title: 'How To Buy Canadian Commercial Real Estate', img: 'assets/book-buy-cre.png', desc: 'A complete toolkit for institutional and private investors navigating Canadian commercial property.', price: 199.99 },
    { slug: 'golden-cashflow', title: 'The Golden Rules for Commercial Real Estate Investors', img: 'assets/book-cashflow.png', desc: 'A practical guide to understanding and protecting cash flow in commercial real estate.', price: 19.99 },
    { slug: 'golden-lease', title: 'The Golden Rules for Negotiating a Commercial Lease', img: 'assets/book-lease.png', desc: 'Essential commercial lease clauses and negotiation principles for owners, tenants, and advisors.', price: 19.99 }
  ];

  /* ---------- tiny helpers ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n, d) => '$' + Number(n).toLocaleString('en-CA', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 0 : d });
  const params = () => new URLSearchParams(location.search);
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function lsGet(k, d) { try { const v = localStorage.getItem('creed:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem('creed:' + k, JSON.stringify(v)); } catch (e) { } }
  /* Demo-mode accounts live in this browser only (passwords are hashed). The live site uses Supabase. */
  async function sha(s) {
    try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('creed:' + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
    catch (e) { let h = 5381; for (const c of String(s)) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'x' + h; }
  }
  const accts = () => lsGet('accounts', {});
  const ukey = u => ((u && (u.email || u.phone)) || '').toLowerCase();
  const sessionOf = a => { const u = Object.assign({}, a); delete u.hash; return u; };
  function putAcct(u) { const k = ukey(u); if (!k) return; const a = accts(); a[k] = Object.assign({}, a[k] || {}, u); lsSet('accounts', a); }
  const cap = t => t ? t[0].toUpperCase() + t.slice(1) : '';
  const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  /* ---------- Supabase (real mode) ---------- */
  let sb = null;
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  async function initSB() {
    if (DEMO || sb) return;
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  }

  /* ---------- state ---------- */
  const S = { user: null, ents: [] };

  /* ---------- Auth ---------- */
  const Auth = {
    async load() {
      if (DEMO) {
        S.user = lsGet('user', null);
        if (S.user && (S.user.id === 'demo' || !ukey(S.user))) { try { localStorage.removeItem('creed:user'); } catch (e) { } S.user = null; }
        S.ents = S.user ? lsGet('ents:' + ukey(S.user), []) : []; return;
      }
      const { data } = await sb.auth.getSession();
      const u = data && data.session && data.session.user;
      S.user = u ? { id: u.id, provider: (u.app_metadata && u.app_metadata.provider) || 'email', created: u.created_at || '', email: u.email || '', phone: u.phone || (u.user_metadata && u.user_metadata.phone) || '', name: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || '', marketing: !!(u.user_metadata && u.user_metadata.marketing_ok) } : null;
      S.ents = [];
      if (S.user) {
        const r = await sb.from('entitlements').select('offer,status').eq('status', 'active');
        S.ents = (r.data || []).map(x => x.offer);
      }
    },
    async signUp(name, email, password, phone, marketing) {
      if (DEMO) {
        const a = accts(), k = email.toLowerCase();
        if (a[k]) return { error: 'An account with this email already exists. Log in instead.' };
        const acct = { id: 'u_' + Date.now().toString(36), email, name, phone: phone || '', marketing: !!marketing, provider: 'email', providers: ['email'], created: new Date().toISOString(), hash: await sha(password) };
        a[k] = acct; lsSet('accounts', a); S.user = sessionOf(acct); lsSet('user', S.user); S.ents = lsGet('ents:' + k, []); return { ok: true };
      }
      const r = await sb.auth.signUp({ email, password, options: { data: { full_name: name, phone: phone || '', marketing_ok: !!marketing }, emailRedirectTo: location.origin + '/members.html' } });
      if (r.error) return { error: r.error.message };
      return { ok: true, confirm: !r.data.session };
    },
    async oauth(provider) {
      if (DEMO) {
        const who = await providerModal(provider); if (!who) return { cancelled: true };
        const a = accts(), k = who.email.toLowerCase();
        const acct = a[k] || { id: 'u_' + Date.now().toString(36), email: who.email, name: who.name || who.email.split('@')[0], phone: '', marketing: false, provider, providers: [], created: new Date().toISOString() };
        if (!(acct.providers || []).includes(provider)) acct.providers = (acct.providers || (acct.hash ? ['email'] : [])).concat(provider);
        if (!acct.name && who.name) acct.name = who.name;
        a[k] = acct; lsSet('accounts', a); S.user = Object.assign(sessionOf(acct), { provider }); lsSet('user', S.user); S.ents = lsGet('ents:' + k, []);
        return { ok: true, demo: true };
      }
      const r = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: location.origin + '/members.html' } });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async phoneStart(phone, name) {
      if (DEMO) return { ok: true, demo: true, code: '123456' };
      const r = await sb.auth.signInWithOtp({ phone, options: { data: { full_name: name || '' } } });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async phoneVerify(phone, code, name) {
      if (DEMO) {
        if (code !== '123456') return { error: 'That code is not right. Check the 6 digits and try again.' };
        const a = accts(), k = phone.toLowerCase(); const acct = a[k] || { id: 'p_' + Date.now().toString(36), email: '', name: name || '', phone, marketing: false, provider: 'phone', providers: ['phone'], created: new Date().toISOString() };
        a[k] = acct; lsSet('accounts', a); S.user = sessionOf(acct); lsSet('user', S.user); S.ents = lsGet('ents:' + k, []); return { ok: true };
      }
      const r = await sb.auth.verifyOtp({ phone, token: code, type: 'sms' });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async signIn(email, password) {
      if (DEMO) {
        const a = accts()[email.toLowerCase()];
        if (!a) return { error: 'No account found for that email. Create a free account first.' };
        if (!a.hash) { const pv = (a.providers || [a.provider]).filter(x => x && x !== 'email')[0]; return { error: 'This account signs in with ' + cap(pv || 'a social login') + '. Use the ' + cap(pv || 'social') + ' button above.' }; }
        if (a.hash !== await sha(password)) return { error: 'Incorrect email or password.' };
        S.user = sessionOf(a); lsSet('user', S.user); S.ents = lsGet('ents:' + ukey(a), []); return { ok: true };
      }
      const r = await sb.auth.signInWithPassword({ email, password });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async signOut() { if (DEMO) { try { localStorage.removeItem('creed:user'); } catch (e) { } } else { await sb.auth.signOut(); } location.href = 'index.html'; },
    async reset(email) {
      if (DEMO) return { ok: true, demo: true };
      const r = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/members.html?reset=1#/account' });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async setPassword(pw) {
      if (DEMO) { const a = accts(), k = ukey(S.user); if (a[k]) { a[k].hash = await sha(pw); if (!(a[k].providers || []).includes('email')) a[k].providers = (a[k].providers || []).concat('email'); lsSet('accounts', a); } return { ok: true }; }
      const r = await sb.auth.updateUser({ password: pw });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async setProfile(name, phone) {
      if (DEMO) { const u = lsGet('user', {}); u.name = name; u.phone = phone; lsSet('user', u); putAcct(u); S.user = u; return { ok: true }; }
      const r = await sb.auth.updateUser({ data: { full_name: name, phone } });
      if (!r.error) { await sb.from('profiles').update({ full_name: name, phone }).eq('id', S.user.id); S.user.name = name; S.user.phone = phone; }
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async setMarketing(on) {
      if (DEMO) { const u = lsGet('user', {}); u.marketing = !!on; lsSet('user', u); putAcct(u); S.user = u; return { ok: true }; }
      const r = await sb.auth.updateUser({ data: { marketing_ok: !!on } });
      if (!r.error) { await sb.from('profiles').update({ marketing_ok: !!on }).eq('id', S.user.id); S.user.marketing = !!on; }
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async avatar() {
      if (DEMO) return lsGet('avatar:' + ukey(S.user), '');
      const r = await sb.from('profiles').select('avatar_url').eq('id', S.user.id).maybeSingle();
      return (r.data && r.data.avatar_url) || '';
    },
    async setAvatar(blob, dataUrl) {
      if (DEMO) { lsSet('avatar:' + ukey(S.user), dataUrl); return { ok: true, url: dataUrl }; }
      const path = S.user.id + '/avatar.jpg';
      const up = await sb.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
      if (up.error) return { error: up.error.message };
      const url = sb.storage.from('avatars').getPublicUrl(path).data.publicUrl + '?v=' + Date.now();
      await sb.from('profiles').update({ avatar_url: url }).eq('id', S.user.id);
      return { ok: true, url };
    },
    async setName(name) {
      if (DEMO) { const u = lsGet('user', {}); u.name = name; lsSet('user', u); putAcct(u); S.user = u; return { ok: true }; }
      const r = await sb.auth.updateUser({ data: { full_name: name } });
      if (!r.error) { await sb.from('profiles').update({ full_name: name }).eq('id', S.user.id); S.user.name = name; }
      return r.error ? { error: r.error.message } : { ok: true };
    }
  };

  /* ---------- Access ---------- */
  const Access = {
    isOwner() { const e = ((S.user && S.user.email) || '').toLowerCase(); return !!e && (CFG.OWNER_EMAILS || []).map(x => x.toLowerCase()).includes(e); },
    has(offer) { return this.isOwner() || S.ents.includes(offer); },
    canWatch(week) { return !!S.user && (this.has('bcr90') || (CFG.FREE_WEEKS || []).includes(week)); },
    async simulatePurchase(offer) { const k = 'ents:' + ukey(S.user), e = lsGet(k, []); if (!e.includes(offer)) e.push(offer); lsSet(k, e); S.ents = e; }
  };

  /* ---------- Demo dialogs (live site: Google, Apple and Stripe host these steps) ---------- */
  const BRAND = {
    google: { name: 'Google', head: 'Sign in with Google', sub: 'to continue to CRE-Ed', label: 'Google email', logo: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z"/><path fill="#34A853" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.5 10.5 0 0 0 12 22.5z"/><path fill="#FBBC05" d="M6.2 14.1a6.3 6.3 0 0 1 0-4.2V7.2H2.7a10.5 10.5 0 0 0 0 9.6z"/><path fill="#EA4335" d="M12 5.6c1.5 0 2.9.5 4 1.6l3-3A10.4 10.4 0 0 0 12 1.5 10.5 10.5 0 0 0 2.7 7.2l3.5 2.7C7 7.4 9.3 5.6 12 5.6z"/></svg>' },
    apple: { name: 'Apple', head: 'Sign in with Apple ID', sub: 'to continue to CRE-Ed', label: 'Apple ID (email)', logo: '<svg viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3.1.7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.9zM14.2 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.7-1.3z"/></svg>' },
    facebook: { name: 'Facebook', head: 'Log in with Facebook', sub: 'to continue to CRE-Ed', label: 'Facebook email', logo: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1877F2"/><path fill="#fff" d="M13.3 21v-7h2.4l.4-2.8h-2.8V9.5c0-.8.3-1.4 1.4-1.4h1.5V5.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2h-2.4V14h2.4v7z"/></svg>' }
  };
  function openDialog(html, cls) {
    const d = document.createElement('div'); d.className = 'modal pm'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="pmbox ' + (cls || '') + '">' + html + '</div>'; document.body.appendChild(d); document.body.style.overflow = 'hidden';
    const close = () => { d.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esck); };
    const esck = e => { if (e.key === 'Escape') d.querySelector('[data-x]') && d.querySelector('[data-x]').click(); };
    document.addEventListener('keydown', esck);
    return { d, close };
  }
  function providerModal(provider) {
    const B = BRAND[provider] || { name: cap(provider), head: 'Sign in with ' + cap(provider), sub: 'to continue to CRE-Ed', label: 'Email', logo: '' };
    return new Promise(res => {
      const { d, close } = openDialog(`<div class="pmlogo">${B.logo}</div><h3>${esc(B.head)}</h3><p class="pmsub">${esc(B.sub)}</p>
        <div class="msg" id="pmm"></div>
        <form id="pmf" novalidate><div class="field"><label for="pme">${esc(B.label)}</label><input id="pme" type="email" autocomplete="email" autofocus></div>
        <div class="field"><label for="pmn">Your name (optional)</label><input id="pmn" autocomplete="name"></div>
        <button class="btn block" type="submit">Continue</button><button class="btn ghost block" type="button" data-x style="margin-top:10px">Cancel</button></form>
        <p class="pmfine">Demo sign-in: this prototype does not contact ${esc(B.name)}. On the live site this step happens on ${esc(B.name)}’s own page, and CRE-Ed never sees your ${esc(B.name)} password.</p>`);
      const m = d.querySelector('#pmm');
      d.querySelector('[data-x]').onclick = () => { close(); res(null); };
      d.querySelector('#pmf').onsubmit = e => {
        e.preventDefault(); const em = d.querySelector('#pme').value.trim();
        if (!validEmail(em)) { m.className = 'msg show err'; m.textContent = 'Enter a valid email address.'; return; }
        const nm = d.querySelector('#pmn').value.trim(); close(); res({ email: em, name: nm });
      };
      setTimeout(() => { const i = d.querySelector('#pme'); i && i.focus(); }, 30);
    });
  }
  const luhn = n => { let sum = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } sum += d; alt = !alt; } return n.length >= 12 && sum % 10 === 0; };
  const TEST_OK = ['4242424242424242', '5555555555554444', '4000056655665556'];
  function chargeOf(offer, plan) {
    const o = OFFERS[offer];
    if (plan === 'installments' && o.plan) return { today: o.plan.each, line: o.plan.n + ' monthly payments of ' + money(o.plan.each) + '. Today: payment 1 of ' + o.plan.n + '.' };
    return { today: o.price, line: 'One payment. 30-day money-back guarantee.' };
  }
  function payModal(offer, plan) {
    const o = OFFERS[offer], c = chargeOf(offer, plan), amt = money(c.today, 2) + ' CAD';
    return new Promise(res => {
      const { d, close } = openDialog(`<button class="mx" data-x aria-label="Close">×</button>
        <div class="pyhead"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>Secure checkout</span></div>
        <div class="pysum"><div><b>${esc(o.name)}</b><small>${esc(c.line)}</small></div><strong>${amt}</strong></div>
        <div class="pytest"><b>Test mode.</b> Use card 4242 4242 4242 4242, any future date and any 3 digits. Nothing is charged. Never enter a real card number here.</div>
        <div class="msg" id="pym"></div>
        <form id="pyf" novalidate>
         <div class="field"><label for="pyn">Name on card</label><input id="pyn" autocomplete="cc-name"></div>
         <div class="field"><label for="pyc">Card number</label><input id="pyc" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" maxlength="23"></div>
         <div class="pyrow"><div class="field"><label for="pye">Expiry</label><input id="pye" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" maxlength="7"></div>
         <div class="field"><label for="pyv">CVC</label><input id="pyv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4"></div>
         <div class="field"><label for="pyz">Postal code</label><input id="pyz" autocomplete="postal-code" placeholder="M5V 2T6" maxlength="10"></div></div>
         <button class="btn block lg" type="submit" id="pyb">Pay ${amt}</button></form>
        <p class="pyfine">Paying as ${esc(S.user.email || S.user.phone)}. 30-day money-back guarantee.</p>`, 'pay');
      const $d = s => d.querySelector(s), m = $d('#pym');
      const err = t => { m.className = 'msg show err'; m.textContent = t; };
      $d('#pyc').oninput = e => { const v = e.target.value.replace(/\D/g, '').slice(0, 19); e.target.value = v.replace(/(.{4})/g, '$1 ').trim(); };
      $d('#pye').oninput = e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2); e.target.value = v; };
      d.querySelector('[data-x]').onclick = () => { close(); res(false); };
      $d('#pyf').onsubmit = async e => {
        e.preventDefault(); m.className = 'msg';
        const nm = $d('#pyn').value.trim(), num = $d('#pyc').value.replace(/\s/g, ''), ex = $d('#pye').value.replace(/\D/g, ''), cv = $d('#pyv').value.trim(), zp = $d('#pyz').value.trim();
        if (!nm) return err('Enter the name on the card.');
        if (!luhn(num)) return err('That card number is not valid. Check it and try again.');
        const mo = +ex.slice(0, 2), yr = 2000 + +ex.slice(2, 4), now = new Date();
        if (ex.length !== 4 || mo < 1 || mo > 12) return err('Enter the expiry as MM / YY.');
        if (yr < now.getFullYear() || (yr === now.getFullYear() && mo < now.getMonth() + 1)) return err('That card has expired.');
        if (!/^\d{3,4}$/.test(cv)) return err('Enter the 3 or 4 digit security code.');
        if (zp.length < 3) return err('Enter your postal code.');
        const b = $d('#pyb'); b.disabled = true; b.textContent = 'Processing…';
        await new Promise(r => setTimeout(r, 1300));
        if (num === '4000000000000002') { b.disabled = false; b.textContent = 'Pay ' + amt; return err('Your card was declined. Try a different card.'); }
        if (!TEST_OK.includes(num)) { b.disabled = false; b.textContent = 'Pay ' + amt; return err('Demo mode only accepts test cards. Use 4242 4242 4242 4242.'); }
        const no = 'CRE-' + Date.now().toString(36).toUpperCase().slice(-6);
        await Access.simulatePurchase(offer);
        const ok = 'orders:' + ukey(S.user), L = lsGet(ok, []); L.push({ no, offer, plan: plan || 'full', amount: c.today, at: new Date().toISOString() }); lsSet(ok, L);
        d.querySelector('.pmbox').innerHTML = `<div class="pyok"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg><h3>Payment received</h3>
          <p>Thank you. You now have access to <b>${esc(o.name)}</b>.</p>
          <dl><div><dt>Amount</dt><dd>${amt}</dd></div><div><dt>Receipt</dt><dd>${no}</dd></div><div><dt>Account</dt><dd>${esc(S.user.email || S.user.phone)}</dd></div></dl>
          <button class="btn block lg" id="pygo">Open my program</button></div>`;
        d.querySelector('#pygo').onclick = () => { close(); res(true); };
      };
      setTimeout(() => { const i = $d('#pyn'); i && i.focus(); }, 30);
    });
  }

  /* ---------- Payments ---------- */
  async function checkout(offer, plan) {
    if (!S.user) { location.href = 'login.html?next=' + encodeURIComponent('programs.html'); return; }
    if (DEMO) {
      const paid = await payModal(offer, plan);
      if (paid) location.href = OFFERS[offer].home;
      return;
    }
    const r = await sb.functions.invoke('create-checkout', { body: { offer, plan: plan || 'full', origin: location.origin } });
    if (r.error || !r.data || !r.data.url) { toast('Could not start checkout. Please try again.'); return; }
    location.href = r.data.url;
  }

  /* ---------- Data ---------- */
  const Data = {
    isAdmin() { if (DEMO) return true; const e = ((S.user && S.user.email) || '').toLowerCase(); return !!e && (CFG.ADMIN_EMAILS || []).map(x => x.toLowerCase()).includes(e); },
    async library() { // owner-uploaded content, newest first
      if (DEMO) return lsGet('libitems', []);
      const r = await sb.from('library_items').select('*').order('created_at', { ascending: false });
      return (r.data || []).map(x => Object.assign({}, x, { url: x.file_path ? sb.storage.from('library').getPublicUrl(x.file_path).data.publicUrl : x.link }));
    },
    async addLibrary(it, file) {
      if (DEMO) { const a = lsGet('libitems', []); a.unshift({ id: 'l' + Date.now(), kind: it.kind, title: it.title, description: it.description, category: it.category, url: it.link || (file ? URL.createObjectURL(file) : ''), session: !!file }); lsSet('libitems', a.filter(x => x.url || !x.session)); return { ok: true }; }
      let path = null;
      if (file) { path = Date.now() + '-' + file.name.replace(/[^\w.-]+/g, '_'); const u = await sb.storage.from('library').upload(path, file); if (u.error) return { error: u.error.message }; }
      const r = await sb.from('library_items').insert({ kind: it.kind, title: it.title, description: it.description, category: it.category, link: it.link || null, file_path: path });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async delLibrary(id) {
      if (DEMO) { lsSet('libitems', lsGet('libitems', []).filter(x => x.id !== id)); return { ok: true }; }
      const r = await sb.from('library_items').delete().eq('id', id); return r.error ? { error: r.error.message } : { ok: true };
    },
    async hw() { // {week: {itemIndex: true}}
      if (DEMO) return lsGet('hw', {});
      const r = await sb.from('homework_progress').select('week,item,done');
      const o = {}; (r.data || []).forEach(x => { if (x.done) (o[x.week] = o[x.week] || {})[x.item] = true; }); return o;
    },
    async setHw(week, item, done) {
      if (DEMO) { const o = lsGet('hw', {}); o[week] = o[week] || {}; if (done) o[week][item] = true; else delete o[week][item]; lsSet('hw', o); return; }
      await sb.from('homework_progress').upsert({ user_id: S.user.id, week, item, done, updated_at: new Date().toISOString() });
    },
    async sheet(week) {
      if (DEMO) return lsGet('sheet' + week, {});
      const r = await sb.from('worksheets').select('data').eq('week', week).maybeSingle();
      return (r.data && r.data.data) || {};
    },
    async saveSheet(week, data) {
      if (DEMO) { lsSet('sheet' + week, data); return { ok: true }; }
      const r = await sb.from('worksheets').upsert({ user_id: S.user.id, week, data, updated_at: new Date().toISOString() });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async submit(kind, week, message) {
      if (DEMO) { const a = lsGet('subs', []); a.push({ kind, week, message, at: new Date().toISOString() }); lsSet('subs', a); return { ok: true }; }
      const r = await sb.from('submissions').insert({ user_id: S.user.id, kind, week: week || null, message });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async mySubs() {
      if (DEMO) return lsGet('subs', []).slice().reverse();
      const r = await sb.from('submissions').select('kind,week,message,created_at').order('created_at', { ascending: false }).limit(20);
      return (r.data || []).map(x => ({ kind: x.kind, week: x.week, message: x.message, at: x.created_at }));
    },
    async contact(name, email, topic, message) {
      if (DEMO) { const a = lsGet('contact', []); a.push({ name, email, topic, message }); lsSet('contact', a); return { ok: true }; }
      const r = await sb.from('contact_messages').insert({ name, email, topic, message });
      return r.error ? { error: r.error.message } : { ok: true };
    },
    async ask(messages, offer) {
      if (DEMO) return { ok: true, demo: true, text: demoAnswer(messages[messages.length - 1].content) };
      const r = await sb.functions.invoke('savannah', { body: { messages, offer } });
      if (r.error || !r.data) return { error: 'Savannah is unavailable right now. Please try again, or send your question to Coach Lijoy.' };
      return r.data.error ? { error: r.data.error } : { ok: true, text: r.data.text };
    },
    async episode(file) { // returns the player HTML as text
      if (DEMO) { const r = await fetch('episodes/' + file); if (!r.ok) throw new Error('missing'); return r.text(); }
      const r = await sb.storage.from('episodes').download(file);
      if (r.error) throw r.error; return r.data.text();
    }
  };

  /* ---------- Layout ---------- */
  const NAV = [['Learn', 'members.html'], ['Coaching', 'programs.html'], ['Meet Lijoy', 'about.html']];
  const ICON_USER = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>';
  const ICON_MENU = '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function renderChrome(page) {
    const here = (location.pathname.split('/').pop() || 'index.html');
    const on = h => h === here ? 'on' : '';
    const logged = !!S.user;
    const nav = logged ? NAV : [];
    const links = nav.map(([t, h]) => `<a href="${h}" class="${on(h)}">${t}</a>`).join('');
    const acctLinks = logged
      ? `<a href="members.html#/account">My account</a><a href="#" data-logout>Log out</a>`
      : `<a href="login.html?mode=login">Log in</a><a href="login.html?mode=signup">Start Free</a>`;
    const hdr = document.createElement('header');
    hdr.className = 'hdr';
    hdr.innerHTML = `<div class="in"><a class="logo" href="index.html" aria-label="CRE-Ed home">CRE<span>-Ed</span></a>
      <nav class="nav" aria-label="Main">${links}</nav>
      <div class="hdr-r">
        ${logged ? `<button class="ibtn" id="acctBtn" aria-label="Account" aria-haspopup="true">${ICON_USER}</button>` : `<a class="login-link" href="login.html?mode=login">Log in</a><a class="btn sm" href="login.html?mode=signup">Start Free</a>`}
        ${logged ? `<button class="ibtn plain hamb" id="hamb" aria-label="Menu" aria-expanded="false">${ICON_MENU}</button>` : ''}
      </div></div>
      <div class="dd" id="dd" role="menu">${logged ? `<div class="who"><b>${esc(S.user.name || S.user.email || S.user.phone)}</b>${S.user.name && (S.user.email || S.user.phone) ? `<span>${esc(S.user.email || S.user.phone)}</span>` : ''}</div>` : ''}${acctLinks}</div>`;
    const menu = document.createElement('div');
    menu.className = 'menu'; menu.id = 'menu';
    menu.innerHTML = links + `<div class="acct">${acctLinks}</div>`;
    document.body.prepend(menu); document.body.prepend(hdr);
    const hb = $('#hamb');
    if (hb) hb.onclick = () => { const o = menu.classList.toggle('open'); hb.innerHTML = o ? ICON_X : ICON_MENU; hb.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
    const ab = $('#acctBtn'), dd = $('#dd');
    if (ab) { ab.onclick = e => { e.stopPropagation(); dd.classList.toggle('open'); }; document.addEventListener('click', () => dd.classList.remove('open')); }
    else dd.remove();
    $$('[data-logout]').forEach(a => a.onclick = e => { e.preventDefault(); Auth.signOut(); });

    const f = document.createElement('footer');
    f.className = 'ftr';
    f.innerHTML = `<div class="wrap"><div class="top"><a class="logo" href="index.html" style="color:var(--navy)">CRE<span>-Ed</span></a>
      ${logged ? `<div class="links"><a href="members.html">Learn</a><a href="programs.html">Coaching</a><a href="about.html">Meet Lijoy</a></div>` : ''}</div>
      <div class="legal">
      <p>CRE-Ed.com is an educational platform focused on commercial real estate education and collaboration. Real estate trading services, where applicable, are provided through registered real estate brokerages in accordance with Ontario law. Lijoy Ulahannan, Broker, Property.ca Inc., Brokerage. Lijoy Ulahannan, Mortgage Broker, Licence #M08004558, Mortgage Architects – A Better Way (ABW), FSRA Licence #12728.</p>
      <p>This website is for informational and educational purposes only and is not legal, financial, investment, or real estate advice.</p>
      <p>© ${new Date().getFullYear()} CRE-Ed.com · Canada${CFG.HST ? ` · <span class="mono">HST # ${esc(CFG.HST)}</span>` : ''}</p></div></div>`;
    document.body.appendChild(f);
    if (DEMO) { const c = document.createElement('div'); c.className = 'demo-chip'; c.textContent = 'Demo mode: accounts and test payments stay in this browser.'; document.body.appendChild(c); }
  }


  /* ---------- shared components ---------- */
  const ICON_SHIELD = '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>';
  function offerCards(el, note) {
    const one = OFFERS.bcr90, two = OFFERS.deal90;
    const card = (o, extra) => `<div class="card offer${o.n == 1 ? ' feat1' : ''}"><p class="eyebrow">Offer ${o.n}</p><h3>${esc(o.name)}</h3>
      <p class="who">${esc(o.who)}</p>
      <div class="price">${money(o.price)}<small>CAD</small></div>${extra}
      <ul class="checks">${o.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>${o.fine ? `<p class="fine">${esc(o.fine)}</p>` : ''}
      <div class="buy"><button class="btn block" data-buy="${o.slug}">Start Offer ${o.n}</button>${o.plan ? `<p class="alt"><a href="#" class="link fine" data-plan="${o.slug}">or pay in 3 installments of $666</a></p>` : ''}</div></div>`;
    el.innerHTML = `<div class="msg info" id="paid"></div><div class="grid g2 offers">${card(one, `<p class="tag">${esc(one.label)}</p>`)}${card(two, `<p class="pay">or 3 payments of $666</p>`)}</div>
      <p class="guar">${ICON_SHIELD}<span>30-day money-back guarantee</span></p>`;
    $$('[data-buy]', el).forEach(b => {
      const o = b.dataset.buy;
      if (Access.has(o)) { b.textContent = 'Open'; b.onclick = () => location.href = OFFERS[o].home; }
      else b.onclick = () => checkout(o, 'full');
    });
    $$('[data-plan]', el).forEach(a => a.onclick = e => { e.preventDefault(); Access.has(a.dataset.plan) ? (location.href = OFFERS[a.dataset.plan].home) : checkout(a.dataset.plan, 'installments'); });
    const p = params().get('paid');
    if (p && OFFERS[p]) {
      const m = $('#paid', el); m.classList.add('show');
      m.innerHTML = 'Thank you. Your access to <b>' + esc(OFFERS[p].name) + '</b> is being unlocked.' + (Access.has(p) ? ' <a href="' + OFFERS[p].home + '">Open it now →</a>' : ' This can take a few seconds. Refresh the page if it does not appear.');
      if (!Access.has(p) && !DEMO) { let n = 0; const t = setInterval(async () => { await Auth.load(); if (Access.has(p) || ++n > 10) { clearInterval(t); location.href = 'programs.html?paid=' + p; } }, 2500); }
    }
  }

  /* Demo-mode "Savannah": searches the course content. The live site answers with AI (supabase/functions/savannah). */
  function demoAnswer(q) {
    const words = String(q).toLowerCase().match(/[a-z0-9]{3,}/g) || [];
    const O2 = window.CREED_O2;
    const docs = WEEKS.map(w => ({ ref: 'Week ' + w.n + ' · ' + w.tool, txt: [w.title, w.blurb, w.toolDesc].concat(w.hw).join(' '), say: w.blurb + ' Start with: ' + w.hw[0] }))
      .concat(O2 ? O2.MODULES.flatMap(m => m.lessons.map(l => ({ ref: 'Offer 2, Module ' + m.n + ' · ' + l.t, txt: l.t + ' ' + l.d, say: l.d }))) : []);
    let best = null, bs = 0;
    docs.forEach(d => { const t = d.txt.toLowerCase(); const sc = words.reduce((a, w) => a + (t.includes(w) ? 1 : 0), 0); if (sc > bs) { bs = sc; best = d; } });
    return (best && bs > 0 ? 'Here is where this is covered: ' + best.ref + '. ' + best.say : 'I could not find that in the course material. Send it to Coach Lijoy and you will get a personal answer.') +
      '\n\n(Demo mode: on the live site Savannah answers in full, any time. This preview only searches the course content.)';
  }

  /* Member coaching desk: Savannah, daily check-in, live Q&A, extra calls */
  function desk(el, offer) {
    const sess = (CFG.LIVE_QA || []).filter(x => x && x.date);
    const kinds = ['Daily check-in', 'Weekly homework', 'Deal to underwrite', 'BOV draft', 'LOI', 'Question'];
    el.innerHTML = `<div class="grid g2 desk">
      <div class="card flat"><h3>Ask Savannah</h3><p class="fine">Instant answers 24/7, grounded in the course. For anything deeper, send it to Coach Lijoy.</p>
        <div class="chat" id="chat" aria-live="polite"><div class="b a">Hi, I’m Savannah. Ask me about NOI, cap rates, DSCR, leases, financing, or what to do this week.</div></div>
        <form id="chatf" class="chatf"><input id="chati" placeholder="Ask a question…" autocomplete="off" aria-label="Ask Savannah"><button class="btn sm" type="submit">Ask</button></form></div>
      <div class="card flat"><h3>Send to Coach Lijoy</h3><p class="fine">A daily check-in, homework, a deal to review or a question. You get a personal reply.</p>
        <div class="msg" id="dm"></div><form id="df"><div class="row2"><div class="field"><label for="dk">What are you sending?</label><select id="dk">${kinds.map(k => `<option>${k}</option>`).join('')}</select></div><div class="field"><label for="dwk">Week (optional)</label><select id="dwk"><option value="">None</option>${WEEKS.map(w => `<option value="${w.n}">Week ${w.n}</option>`).join('')}</select></div></div>
        <div class="field"><textarea id="dt" required placeholder="Write your update, or paste a link to your file."></textarea></div><button class="btn sm" type="submit">Send</button></form><div id="hist"></div></div>
      <div class="card flat"><h3>Live Q&A every two weeks</h3><p class="fine">Bring your questions to Coach Lijoy live. Replays are posted if you miss one.</p>
        ${sess.length ? `<ul class="plain">${sess.map(x => `<li><b>${esc(new Date(x.date + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }))}</b>${x.time ? ' · ' + esc(x.time) : ''} ${x.join ? `<a class="link" href="${esc(x.join)}" target="_blank" rel="noopener">Join</a>` : ''} ${x.replay ? `<a class="link" href="${esc(x.replay)}" target="_blank" rel="noopener">Replay</a>` : ''}</li>`).join('')}</ul>` : '<p class="fine" style="margin:0">Session dates are posted here before each Q&amp;A.</p>'}</div>
      <div class="card flat"><h3>Book a call</h3><p class="fine">A one-on-one call every two weeks is included. Extra calls are $120 CAD per hour.</p>
        <p style="margin:0">${CFG.BOOKING_URL ? `<a class="btn sm" href="${esc(CFG.BOOKING_URL)}" target="_blank" rel="noopener">Book a time</a>` : `<a class="btn sm" href="about.html?topic=Coaching">Request a time</a>`}</p></div></div>`;
    const hist = [];
    $('#chatf', el).onsubmit = async e => {
      e.preventDefault(); const i = $('#chati', el), q = i.value.trim(); if (!q) return; i.value = '';
      const box = $('#chat', el), add = (t, c) => { const d = document.createElement('div'); d.className = 'b ' + c; d.textContent = t; box.appendChild(d); box.scrollTop = box.scrollHeight; return d; };
      add(q, 'u'); hist.push({ role: 'user', content: q }); const w = add('…', 'a');
      const r = await Data.ask(hist.slice(-10), offer);
      w.textContent = r.error || r.text; if (r.text) hist.push({ role: 'assistant', content: r.text });
    };
    const showHist = async () => { const a = await Data.mySubs(); $('#hist', el).innerHTML = a.length ? `<h4 style="margin:22px 0 8px;font-size:16px">Recent</h4>` + a.slice(0, 5).map(s => `<div class="fine" style="padding:8px 0;border-top:1px solid var(--line)"><b>${esc(s.kind)}</b>${s.week ? ' · Week ' + s.week : ''} · ${new Date(s.at).toLocaleDateString('en-CA')}<br>${esc(String(s.message).slice(0, 140))}</div>`).join('') : ''; };
    showHist();
    $('#df', el).onsubmit = async e => {
      e.preventDefault(); const m = $('#dm', el); const r = await Data.submit($('#dk', el).value, +$('#dwk', el).value || null, $('#dt', el).value);
      m.className = 'msg show ' + (r.ok ? 'ok' : 'err'); m.textContent = r.ok ? 'Sent. Coach Lijoy will reply with what to do next.' : (r.error || 'Could not send.'); if (r.ok) { $('#dt', el).value = ''; showHist(); }
    };
  }

  /* Offer 2 progress: lessons completed per module are stored like homework under week 100+module */
  async function progress2() {
    const O2 = window.CREED_O2; const hw = await Data.hw(); let total = 0, done = 0; const per = {};
    O2.MODULES.forEach(m => { const d = Object.keys(hw[O2.lessonKey(m.n)] || {}).length; per[m.n] = { done: d, total: m.lessons.length }; total += m.lessons.length; done += d; });
    return { hw, per, total, done };
  }

  async function init(opts) {
    opts = opts || {};
    try { history.scrollRestoration = 'manual'; } catch (e) { }
    window.scrollTo(0, 0);
    window.addEventListener('pageshow', () => window.scrollTo(0, 0));
    document.addEventListener('click', e => { // every link lands at the top of its page
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const u = new URL(a.href, location.href); if (u.origin !== location.origin) return;
      const same = u.pathname === location.pathname;
      if (same && !u.hash && !u.search) { e.preventDefault(); if (/members\.html$/.test(u.pathname) && location.hash !== '#/library') location.hash = '#/library'; window.scrollTo(0, 0); return; }
      window.scrollTo(0, 0);
    }, true);
    try { await initSB(); await Auth.load(); } catch (e) { console.error(e); }
    renderChrome(opts.page);
    window.scrollTo(0, 0);
    if (opts.auth && S.user) document.body.classList.remove('gate');
    if (opts.auth && !S.user) { location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search + location.hash)); return false; }
    return true;
  }

  /* ---------- progress helpers ---------- */
  async function progress() {
    const hw = await Data.hw();
    let total = 0, done = 0; const per = {};
    WEEKS.forEach(w => { const d = Object.keys(hw[w.n] || {}).length; per[w.n] = { done: d, total: w.hw.length }; total += w.hw.length; done += d; });
    return { hw, per, total, done };
  }

  window.CRE = { CFG, DEMO, S, Auth, Access, Data, OFFERS, BOOKS, WEEKS, PHASES: window.CREED_PHASES, O2: window.CREED_O2, $, $$, esc, money, params, toast, init, checkout, progress, progress2, offerCards, desk, lsGet, lsSet };
})();
