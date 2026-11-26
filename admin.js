const $ = s => document.querySelector(s);
let accessToken = null;

async function authRequest(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY},
    body: JSON.stringify({email, password})
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.msg || data.message || data.error_description || 'Login failed');
  return data;
}
async function loadOrders() {
  $('#dashboardMessage').textContent = 'Loading…';
  const r = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
    headers: {'apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':`Bearer ${accessToken}`}
  });
  if (!r.ok) {
    const detail = await r.text();
    throw new Error(detail || 'Orders could not be loaded. Check admin permission and SQL policies.');
  }
  const orders = await r.json();
  $('#totalOrders').textContent = orders.length;
  $('#pendingOrders').textContent = orders.filter(o => o.status === 'Pending').length;
  const body = $('#ordersBody');
  if (!orders.length) {
    body.innerHTML = '<tr><td colspan="9">Abhi koi order nahi aaya.</td></tr>';
  } else {
    body.innerHTML = orders.map(o => {
      const items = Array.isArray(o.items) ? o.items.map(i => `${escapeHtml(i.name)} × ${Number(i.quantity)||1}`).join('<br>') : '';
      const date = o.created_at ? new Date(o.created_at).toLocaleString() : '—';
      return `<tr>
        <td><b>${escapeHtml(o.order_number || o.id)}</b></td>
        <td>${escapeHtml(o.customer_name)}</td>
        <td>${escapeHtml(o.phone)}</td>
        <td>${escapeHtml(o.address)}, ${escapeHtml(o.city)}</td>
        <td class="items">${items}</td>
        <td><b>Rs ${Number(o.total).toLocaleString('en-PK')}</b></td>
        <td>${escapeHtml(o.payment_method)}</td>
        <td><select class="status" data-id="${escapeHtml(o.id)}">
          ${['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select></td><td>${escapeHtml(date)}</td></tr>`;
    }).join('');
    body.querySelectorAll('select[data-id]').forEach(sel => sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value, sel)));
  }
  $('#dashboardMessage').textContent = '';
}
function escapeHtml(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function updateStatus(id, status, control) {
  control.disabled = true;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':`Bearer ${accessToken}`,'Prefer':'return=minimal'},
      body:JSON.stringify({status})
    });
    if (!r.ok) throw new Error(await r.text());
    $('#dashboardMessage').style.color = '#067647';
    $('#dashboardMessage').textContent = 'Order status updated.';
    $('#pendingOrders').textContent = document.querySelectorAll('.status').length ? [...document.querySelectorAll('.status')].filter(s=>s.value==='Pending').length : 0;
  } catch(e) {
    $('#dashboardMessage').style.color = '#b42318';
    $('#dashboardMessage').textContent = 'Status update failed: ' + e.message;
  } finally { control.disabled = false; }
}
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  $('#loginBtn').disabled = true; $('#loginMessage').textContent = 'Signing in…';
  try {
    const data = await authRequest($('#email').value.trim(), $('#password').value);
    accessToken = data.access_token;
    $('#loginPanel').hidden = true; $('#dashboard').hidden = false; $('#logoutBtn').hidden = false;
    await loadOrders();
  } catch(err) {
    $('#loginMessage').textContent = err.message;
  } finally { $('#loginBtn').disabled = false; }
});

$('#forgotBtn').addEventListener('click', async () => {
  const email = $('#email').value.trim();
  if (!email) {
    $('#loginMessage').textContent = 'Pehle apna registered email likhein.';
    $('#email').focus();
    return;
  }
  $('#forgotBtn').disabled = true;
  $('#loginMessage').textContent = 'Password reset email bheji ja rahi hai…';
  try {
    const redirectTo = `${window.location.origin}/reset-password.html`;
    const r = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY},
      body: JSON.stringify({email})
    });
    if (!r.ok) {
      const detail = await r.json().catch(() => ({}));
      throw new Error(detail.msg || detail.message || 'Reset email send nahi hui. URL Configuration check karein.');
    }
    $('#loginMessage').style.color = '#067647';
    $('#loginMessage').textContent = 'Reset link email par bhej diya gaya hai. Inbox aur Spam folder check karein.';
  } catch (err) {
    $('#loginMessage').style.color = '#b42318';
    $('#loginMessage').textContent = err.message;
  } finally { $('#forgotBtn').disabled = false; }
});

$('#refreshBtn').addEventListener('click', () => loadOrders().catch(e => $('#dashboardMessage').textContent = e.message));
$('#logoutBtn').addEventListener('click', () => {
  accessToken = null; $('#dashboard').hidden = true; $('#loginPanel').hidden = false;
  $('#logoutBtn').hidden = true; $('#loginForm').reset(); $('#loginMessage').textContent = '';
});
