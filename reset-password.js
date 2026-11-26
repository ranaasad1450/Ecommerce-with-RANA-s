const $ = s => document.querySelector(s);
let recoveryToken = null;
const hash = new URLSearchParams(window.location.hash.slice(1));
recoveryToken = hash.get('access_token');
const recoveryType = hash.get('type');

if (!recoveryToken || recoveryType !== 'recovery') {
  $('#resetMessage').textContent = 'Reset link invalid ya expire ho chuka hai. Admin page se naya reset link mangwayein.';
  $('#saveBtn').disabled = true;
}

$('#resetForm').addEventListener('submit', async e => {
  e.preventDefault();
  const password = $('#newPassword').value;
  const confirm = $('#confirmPassword').value;
  if (password.length < 6) {
    $('#resetMessage').textContent = 'Password kam az kam 6 characters ka hona chahiye.';
    return;
  }
  if (password !== confirm) {
    $('#resetMessage').textContent = 'Dono passwords match nahi karte.';
    return;
  }
  $('#saveBtn').disabled = true;
  $('#resetMessage').textContent = 'Password update ho raha hai…';
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${recoveryToken}`
      },
      body: JSON.stringify({password})
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.msg || data.message || data.error_description || 'Password update nahi ho saka. Naya reset link mangwayein.');
    $('#resetMessage').style.color = '#067647';
    $('#resetMessage').textContent = 'Password successfully update ho gaya. Ab Admin Login par ja sakte hain.';
    $('#resetForm').reset();
    $('#saveBtn').textContent = 'Updated';
  } catch (err) {
    $('#resetMessage').textContent = err.message;
    $('#saveBtn').disabled = false;
  }
});
