async function api(action, params = {}, post = false) {
  const url = CONFIG.API_URL;
  if (location.protocol === 'file:') throw new Error('파일을 더블클릭해서 열면 동작하지 않습니다. GitHub Pages 주소(또는 로컬 미리보기 주소 http://localhost:8080)로 접속하세요.');
  if (!url || url.includes('PASTE_YOUR')) throw new Error('config.js 의 API_URL 을 설정하세요.');
  let res;
  if (post) {
    // text/plain 으로 보내야 CORS preflight 없이 Apps Script 가 받는다
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...params }) });
  } else {
    res = await fetch(url + '?' + new URLSearchParams({ action, ...params }));
  }
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || '요청 실패');
  return j;
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = n => Number(n).toLocaleString('ko-KR');
const parseTime = s => new Date(String(s).replace(' ', 'T') + '+09:00');
function elapsed(from, to = new Date()) {
  const m = Math.max(0, Math.floor((to - parseTime(from)) / 60000));
  return m >= 60 ? Math.floor(m / 60) + '시간 ' + (m % 60) + '분' : m + '분';
}
function toast(msg, ok = true) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = ok ? 'ok show' : 'err show';
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3500);
}
