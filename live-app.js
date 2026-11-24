import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Public browser credentials only. Never add a service_role/secret key here.
const SUPABASE_URL = 'https://xldqvhzyfhljvcvgzzyz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_0-4GYFA1-Nb1I6mNQmZ7Iw_4xvIf4Be';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

let session = null;
let user = null;
let profile = null;
let state = { books: [], activeId: null };
let currentBookId = null;
let reportSentence = null;
const DRAFTS = '1000kalem_live_drafts_v1';
const $ = (id) => document.getElementById(id);
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message) { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),3200); }
function showModal(id) { $(id)?.classList.add('show'); }
function hideModal(id) { $(id)?.classList.remove('show'); }
function showView(view) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));
  ['library','mybooks','completed'].forEach(v=>$(v+'View').classList.toggle('hidden',v!==view));
  $('workspace').classList.add('hidden');
  if(view==='mybooks') renderMyBooks();
  if(view==='completed') renderCompleted();
}
function getBook(id=currentBookId) { return state.books.find(b=>b.id===id); }
function didContribute(book) { return !!book?.joined; }
function coverMarkup(book) {
  const names=[...new Set((book.sentences||[]).map(s=>s.author))].filter(Boolean).slice(-18);
  return `<div class="book-cover"><div class="cover-kicker">KOLEKTİF ROMAN</div><div class="cover-title">1000<small>CÜMLE</small></div><div class="cover-names">${names.map(esc).join(' · ')}</div><div class="cover-foot">1000 KALEM</div></div>`;
}
function bookCard(book) {
  const n=book.sentence_count||0, done=book.status==='completed', joined=didContribute(book);
  const card=document.createElement('article'); card.className='book-card';
  card.innerHTML=`${coverMarkup(book)}<div class="book-info"><div class="book-type">${esc(book.genre||'Serbest')}</div><div class="book-state ${done?'done':''}">${done?'✓ TAMAMLANDI':joined?'✓ KATILDIN':'● KATILIMA AÇIK'}</div><h3>${esc(book.title)}</h3><p class="book-desc">${esc(book.description)}</p><div class="book-extra">${n.toLocaleString('tr-TR')} cümle · ${book.author_count||'—'} yazar<br>${done?'Tamamlanmış ortak eser':`${Math.max(0,1000-n)} cümle kaldı`}</div><div class="progress-row"><span>${n} / 1000 cümle</span><span>%${(n/10).toFixed(1)}</span></div><div class="progress"><span style="width:${Math.min(100,n/10)}%"></span></div><div class="book-actions"><button class="book-open" data-open>${joined||done?'Kitabı oku':'Hikâyeye katıl'} →</button>${joined?'<span class="book-tag">Katkın var</span>':''}</div></div>`;
  card.querySelector('[data-open]').onclick=()=>openBook(book.id); return card;
}
async function fetchBooks() {
  const {data,error}=await supabase.from('books').select('id,title,genre,description,status,sentence_count,created_at').in('status',['open','completed']).order('created_at',{ascending:false});
  if(error) throw error;
  let joined=new Set();
  if(user){ const {data:mine,error:mineError}=await supabase.from('contributions').select('book_id').eq('user_id',user.id); if(mineError) throw mineError; joined=new Set((mine||[]).map(x=>x.book_id)); }
  state.books=await Promise.all((data||[]).map(async b=>{
    const {data:sentences,error:sentenceError}=await supabase.from('sentences').select('id,book_id,author_id,author_label,sentence_number,content,created_at').eq('book_id',b.id).eq('status','published').order('sentence_number',{ascending:false}).limit(1);
    if(sentenceError) throw sentenceError;
    const latest=(sentences||[]).map(mapSentence);
    return {...b,joined:joined.has(b.id),sentences:latest,author_count:null};
  }));
  renderLibrary();
  if(currentBookId && getBook(currentBookId) && !$('workspace').classList.contains('hidden')) await openBook(currentBookId,false);
}
function mapSentence(s) { return {id:s.id,text:s.content,author:s.author_label,authorId:s.author_id,createdAt:s.created_at,number:s.sentence_number}; }
function renderLibrary() {
  const books=state.books.filter(b=>b.status==='open'); const box=$('books'); box.innerHTML='';
  books.forEach(b=>box.appendChild(bookCard(b)));
  $('bookCount').textContent=books.length+' AÇIK HİKÂYE';
  if(!books.length) box.innerHTML='<div class="empty">Şu anda açık kitap yok. Yönetici yeni kitap yayımladığında burada görünecek.</div>';
  renderCompleted();
}
function renderCompleted() {
  const box=$('completedBooks'); box.innerHTML=''; const books=state.books.filter(b=>b.status==='completed');
  books.forEach(b=>box.appendChild(bookCard(b)));
  if(!books.length) box.innerHTML='<div class="empty">Henüz tamamlanan kitap yok. İlk ortak kitabın bitişini birlikte bekleyelim.</div>';
}
async function openBook(id,scroll=true) {
  currentBookId=id; const book=getBook(id); if(!book) return;
  let contrib=null; if(user){ const {data,error:contribError}=await supabase.from('contributions').select('id').eq('book_id',id).eq('user_id',user.id).maybeSingle(); if(contribError){toast(contribError.message);return;} contrib=data; }
  book.joined=!!contrib;
  const {data:rows,error}=await supabase.from('sentences').select('id,book_id,author_id,author_label,sentence_number,content,created_at').eq('book_id',id).eq('status','published').order('sentence_number',{ascending:true});
  if(error) { toast('Kitap açılamadı: '+error.message); return; }
  book.sentences=(rows||[]).map(mapSentence);
  $('workspace').classList.remove('hidden'); showView('library'); $('workspace').classList.remove('hidden'); renderWorkspace();
  if(scroll) $('workspace').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderWorkspace() {
  const b=getBook(); if(!b) return; const sentences=b.sentences||[]; const n=b.sentence_count||sentences.length; const last=sentences[sentences.length-1]; const joined=b.joined; const done=b.status==='completed';
  $('activeGenre').textContent=(b.genre||'Serbest')+' · '+(done?'TAMAMLANDI':'KATILIMA AÇIK'); $('activeTitle').textContent=b.title; $('activeMeta').textContent=`${n} / 1000 cümle`;
  $('coverUser').textContent='@'+(profile?.nickname||'Yazar'); $('coverCopy').textContent=joined?`@${profile.nickname} bu hikâyeye katkıda bulundu. Artık kitabın tamamını okuyabilir ve paylaşabilirsin.`:`@${profile?.nickname||'Yazar'} adı kişisel kapağında yer alıyor. Katkını yaptığında yazarlar arasında da yerini alacaksın.`;
  $('lastSentence').textContent=last?.text||'Bu hikâyenin ilk cümlesi henüz yayımlanmadı.'; $('lastByline').textContent=last?`${last.number}. cümle · ${last.author}`:'Henüz yazar yok';
  const form=$('contributionForm'),locked=$('lockedMessage'),actions=$('readActions'),all=$('allLines');
  if(joined||done) { form.classList.add('hidden'); locked.classList.remove('hidden'); locked.textContent=joined?'Bu kitaptaki katkı hakkını kullandın. Artık hikâyenin tamamı sana açık.':'Bu kitap tamamlandı. Ortak eseri okuyabilirsin.'; actions.classList.remove('hidden'); all.classList.add('hidden'); }
  else { form.classList.remove('hidden'); locked.classList.add('hidden'); actions.classList.add('hidden'); all.classList.add('hidden'); const draft=read(DRAFTS,{})[b.id]||''; $('newSentence').value=draft; updateCounter(); $('draftStatus').textContent=draft?'Taslağın bu cihazda kaydedildi.':'Taslak otomatik kaydedilir.'; }
  if(joined||done) renderAll();
}
function renderAll() {
  const b=getBook(); if(!b) return; $('lineCount').textContent=(b.sentences||[]).length+' CÜMLE'; const box=$('sentenceList'); box.innerHTML='';
  (b.sentences||[]).forEach(s=>{const el=document.createElement('div');el.className='sentence';el.innerHTML=`<div class="sentence-no">${String(s.number).padStart(3,'0')}</div><div><div class="sentence-text">${esc(s.text)}</div><div class="sentence-author">${esc(s.author)}</div><div class="sentence-tools"><button class="link-btn" data-report>İçeriği bildir</button></div></div>`;el.querySelector('[data-report]').onclick=()=>{reportSentence=s.id;showModal('reportModal')};box.appendChild(el);});
}
function updateCounter() { const ta=$('newSentence'),n=ta.value.length; $('charCount').textContent=n+' / 200'; $('submitBtn').disabled=n===0||n>200||!ta.value.trim(); const d=read(DRAFTS,{}); if(currentBookId){d[currentBookId]=ta.value;write(DRAFTS,d);} }
function validSentence(s) {
  if(!s.trim()) return 'Bir cümle yazmalısın.'; if(s.length>200) return 'Cümlen 200 karakteri geçemez.'; if(/[\r\n]/.test(s)) return 'Lütfen tek satırlık bir cümle yaz.'; if(/https?:\/\/|www\./i.test(s)) return 'Cümlelerde bağlantı ve reklam paylaşma.'; if(/(.)\1{9,}/u.test(s)) return 'Tekrarlanan karakterleri kontrol et.'; if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(s)||/(?:\+?90|0)?\s?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/.test(s)) return 'E-posta veya telefon gibi kişisel iletişim bilgileri paylaşma.'; return '';
}
function submitPreview() { const b=getBook(),txt=$('newSentence').value.trim(); if(!user){showModal('loginModal');toast('Katkı göndermek için e-posta doğrulamasıyla giriş yap.');return;} if(!b||b.joined||b.status!=='open') return toast('Bu kitaba katkı gönderilemiyor.'); const err=validSentence(txt); if(err){toast(err);$('newSentence').focus();return;} $('previewText').textContent=txt;showModal('previewModal'); }
async function confirmSubmit() {
  const b=getBook(),txt=$('newSentence').value.trim(); if(!b||!txt) return;
  const latest=(b.sentences||[]).slice(-1)[0]; $('confirmSubmitBtn').disabled=true;
  try {
    const {data,error}=await supabase.rpc('submit_sentence',{p_book_id:b.id,p_content:txt,p_expected_last_sentence_id:latest?.id??null});
    if(error) throw error; const result=Array.isArray(data)?data[0]:data;
    if(result?.submission_status==='rate_limited') throw new Error('10 dakika içinde en fazla 5 katkı gönderebilirsin.');
    hideModal('previewModal'); const drafts=read(DRAFTS,{});delete drafts[b.id];write(DRAFTS,drafts);toast(result?.book_completed?'Tebrikler! Kitap tamamlandı.':'Cümlen yayımlandı. Artık kitabın tamamını okuyabilirsin.');await fetchBooks();await openBook(b.id,false);
  } catch(e) { toast(errorMessage(e)); if(String(e.message||'').includes('story_changed_refresh')) { await fetchBooks(); await openBook(b.id,false); } }
  finally { $('confirmSubmitBtn').disabled=false; }
}
function errorMessage(e) { const m=String(e?.message||e); const known={already_contributed:'Bu kitaba daha önce katkıda bulunmuşsun.',story_changed_refresh:'Senden önce başka biri yazdı. Son cümleyi yeniledik; tekrar deneyebilirsin.',book_not_open:'Bu kitap şu anda katkıya kapalı.',book_completed:'Bu kitap tamamlandı.',authentication_required:'Devam etmek için giriş yapmalısın.'}; for(const [k,v] of Object.entries(known)) if(m.includes(k)) return v; return m; }
async function sendReport() { if(reportSentence==null)return; if(!user){showModal('loginModal');toast('Bildirim göndermek için giriş yapmalısın.');return;} try { const {error}=await supabase.rpc('report_sentence',{p_sentence_id:reportSentence,p_reason:$('reportReason').value});if(error)throw error;hideModal('reportModal');toast('Bildirimin alındı. Teşekkür ederiz.'); } catch(e){toast(errorMessage(e));} finally{reportSentence=null;} }
async function loadProfile() {
  const {data,error}=await supabase.from('profiles').select('id,nickname,role').eq('id',user.id).single();
  if(error) throw error; profile=data; $('userChip').textContent='@'+profile.nickname; $('userChip').classList.remove('hidden'); $('changeNickBtn').textContent='Takma ad'; $('signOutBtn').classList.remove('hidden'); $('loginBtn').textContent='Giriş bağlantısını gönder'; $('loginEmail').value=user.email||''; $('loginNick').value=profile.nickname; hideModal('loginModal');
  $('adminTools')?.remove(); if(profile.role==='admin') addAdminTools();
}
function addAdminTools() {
  if($('adminTools'))return; const nav=document.querySelector('.navtabs'); const panel=document.createElement('section');panel.id='adminTools';panel.className='panel';panel.style.margin='18px 0';
  panel.innerHTML=`<div class="section-head"><div><h2>Yönetici alanı</h2><p>Yeni kitap oluştur ve ilk cümlesini belirle.</p></div><span class="countpill">ADMIN</span></div><div class="admin-form-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"><input class="field" id="adminTitle" maxlength="80" placeholder="Kitap adı"><input class="field" id="adminGenre" maxlength="32" placeholder="Tür (örn. Gizem)"><input class="field" id="adminDescription" maxlength="240" placeholder="Kısa açıklama" style="grid-column:1/-1"><textarea class="field" id="adminFirstSentence" maxlength="200" placeholder="Yönetici başlangıç cümlesi (en fazla 200 karakter)" style="grid-column:1/-1;min-height:90px"></textarea><button class="btn primary" id="adminCreateBook" style="grid-column:1/-1">Kitabı oluştur ve yayımla</button></div>`;
  nav.insertAdjacentElement('afterend',panel); $('adminCreateBook').onclick=createBook;
}
async function createBook() {
  const title=$('adminTitle').value.trim(),genre=$('adminGenre').value.trim()||'Serbest',description=$('adminDescription').value.trim(),first=$('adminFirstSentence').value.trim();
  if(title.length<2||!first||first.length>200||/[\r\n]/.test(first)){toast('Kitap adı ve tek satırlık, en fazla 200 karakterlik başlangıç cümlesi gerekli.');return;}
  $('adminCreateBook').disabled=true;
  try { const {data,error}=await supabase.rpc('admin_create_book',{p_title:title,p_genre:genre,p_description:description,p_first_sentence:first});if(error)throw error; $('adminTitle').value='';$('adminGenre').value='';$('adminDescription').value='';$('adminFirstSentence').value='';toast('Kitap oluşturuldu ve yayımlandı.');await fetchBooks();await openBook(data,false); }
  catch(e){toast(errorMessage(e));} finally{$('adminCreateBook').disabled=false;}
}
async function renderMyBooks() {
  const nb=$('notificationsBox');nb.innerHTML='<div class="empty">Bildirimler yükleniyor…</div>';
  try { const [{data:notes,error:ne},{data:rows,error:ce}]=await Promise.all([supabase.from('user_notifications').select('id,kind,message,book_id,created_at,read_at').order('created_at',{ascending:false}).limit(50),supabase.from('contributions').select('id,book_id,sentence_id,created_at,books(title),sentences(sentence_number,content)').order('created_at',{ascending:false})]);if(ne)throw ne;if(ce)throw ce;
    nb.innerHTML=notes?.length?'<div class="section-head"><div><h2>Bildirimler</h2><p>Kitaplarınla ilgili gelişmeler.</p></div></div>':'<div class="section-head"><div><h2>Bildirimler</h2><p>Henüz bildirimin yok.</p></div></div>';
    for(const n of notes||[]){const d=document.createElement('div');d.className='statebox';d.textContent=n.message+' · '+new Date(n.created_at).toLocaleDateString('tr-TR');nb.appendChild(d);if(!n.read_at) await supabase.from('user_notifications').update({read_at:new Date().toISOString()}).eq('id',n.id);}
    const c=rows||[],unique=[...new Set(c.map(x=>x.book_id))];$('profileStats').innerHTML=`<div class="stat"><strong>${c.length}</strong><span>Yazdığın cümle</span></div><div class="stat"><strong>${unique.length}</strong><span>Katıldığın kitap</span></div><div class="stat"><strong>${state.books.filter(b=>b.status==='completed'&&unique.includes(b.id)).length}</strong><span>Tamamlanan kitap</span></div>`;
    const box=$('myContributions');box.innerHTML='';if(!c.length){box.innerHTML='<div class="empty">Henüz bir kitaba katkı yapmadın.</div>';return;}
    c.forEach(x=>{const el=document.createElement('article');el.className='contrib-card';el.innerHTML=`<div><h4>${esc(x.books?.title||'Kitap')}</h4><p>${x.sentences?.sentence_number||'—'}. cümle · “${esc(x.sentences?.content||'')}”</p></div><button class="btn soft" data-open>Kitabı aç</button>`;el.querySelector('[data-open]').onclick=()=>openBook(x.book_id);box.appendChild(el);});
  } catch(e){nb.innerHTML='<div class="empty">Veriler yüklenemedi: '+esc(errorMessage(e))+'</div>';}
}
async function shareBook() { const b=getBook();if(!b)return;const url=location.href.split('#')[0]+'#book='+encodeURIComponent(b.id);const data={title:'1000 Kalem · '+b.title,text:'Bu ortak hikâyeye göz at: '+b.title,url};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(url);toast('Kitap bağlantısı kopyalandı.');}}catch(e){if(e.name!=='AbortError')toast('Paylaşım tamamlanamadı.');} }
async function requestMagicLink() {
  const email=$('loginEmail').value.trim().toLowerCase(),nickname=$('loginNick').value.trim().replace(/\s+/g,' ');
  if(!/^\S+@\S+\.\S+$/.test(email)){toast('Geçerli bir e-posta adresi gir.');return;}
  if(nickname.length<2||nickname.length>24||/[<>]/.test(nickname)){toast('Takma ad 2–24 karakter olmalı.');return;}
  $('loginBtn').disabled=true;
  try {
    const redirectTo=window.location.origin+window.location.pathname;
    const {error}=await supabase.auth.signInWithOtp({
      email,
      options:{shouldCreateUser:true,data:{nickname},emailRedirectTo:redirectTo}
    });
    if(error)throw error;
    $('loginHint').textContent='Giriş bağlantısını e-posta adresine gönderdik. E-postanı açıp bağlantıya tıkla. Bağlantı aynı tarayıcıda açıldığında hesabın otomatik olarak etkinleşir.';
    $('loginBtn').textContent='Bağlantıyı yeniden gönder';
    toast('Giriş bağlantısı e-posta adresine gönderildi.');
  } catch(e){toast(errorMessage(e));}
  finally{$('loginBtn').disabled=false;}
}
async function afterLogin() { const {data:{session:s}}=await supabase.auth.getSession();session=s;user=s?.user||null;if(user){await loadProfile();}else{profile=null;$('userChip').classList.add('hidden');$('changeNickBtn').textContent='Giriş / Takma ad';$('signOutBtn').classList.add('hidden');$('adminTools')?.remove();}await fetchBooks();document.body.classList.remove('needs-login'); }
function bindUI() {
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>showView(t.dataset.view)));
  $('loginBtn').onclick=requestMagicLink;$('changeNickBtn').onclick=()=>{$('loginBtn').textContent='Giriş bağlantısını gönder';$('loginHint').textContent='Takma adın 2–24 karakter olmalı. E-posta adresin diğer kullanıcılara gösterilmez.';$('loginNick').value=profile?.nickname||'';$('loginEmail').value=user?.email||'';showModal('loginModal');};$('signOutBtn').onclick=async()=>{const {error}=await supabase.auth.signOut();if(error)toast(error.message);else{toast('Oturum kapatıldı.');await afterLogin();}};
  $('profileBtn').onclick=()=>showView('mybooks');$('backLibraryBtn').onclick=()=>{ $('workspace').classList.add('hidden');showView('library');window.scrollTo({top:$('.navtabs').offsetTop-20,behavior:'smooth'}); };
  $('newSentence').addEventListener('input',updateCounter);$('newSentence').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')submitPreview();});$('previewBtn').onclick=submitPreview;$('submitBtn').onclick=submitPreview;$('confirmSubmitBtn').onclick=confirmSubmit;$('editAgainBtn').onclick=()=>{hideModal('previewModal');$('newSentence').focus();};$('readBookBtn').onclick=()=>{renderAll();$('allLines').classList.remove('hidden');$('allLines').scrollIntoView({behavior:'smooth',block:'start'});};$('shareBookBtn').onclick=shareBook;$('cancelReportBtn').onclick=()=>hideModal('reportModal');$('sendReportBtn').onclick=sendReport;
  document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');}));
}
async function boot() {
  bindUI();
  $('loginTitle').textContent='Aramıza hoş geldin.';$('loginNick').value='';$('loginBtn').textContent='Giriş bağlantısını gönder';
  supabase.auth.onAuthStateChange((_event,newSession)=>{session=newSession;user=newSession?.user||null;if(user) setTimeout(()=>afterLogin().catch(e=>toast(errorMessage(e))),0);else {profile=null;state.books=[];$('userChip').classList.add('hidden');showModal('loginModal');}});
  try { await afterLogin(); }
  catch(e){toast('Supabase bağlantısı kurulamadı: '+errorMessage(e));showModal('loginModal');}
  const hash=new URLSearchParams(location.hash.replace(/^#/,'')).get('book');if(hash&&user)await openBook(hash);
}
boot();
