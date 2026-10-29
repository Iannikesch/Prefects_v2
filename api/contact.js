// Contact form -> Resend -> Braxton and Ethan. Vercel runs this as /api/contact.
// Env (Vercel project settings): RESEND_API_KEY, CONTACT_TO (comma-separated),
// CONTACT_FROM (e.g. "Profectus Website <forms@profectusagency.com>").

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Spam: bots fill the hidden field, or submit faster than a person can type.
  // Pretend it worked so they don't retry.
  if (b.fax || Number(b.elapsed) < 3000) return res.status(200).json({ ok: true });

  const name = clip(b.name, 120);
  const email = clip(b.email, 200);
  const company = clip(b.company, 200);
  const phone = clip(b.phone, 40);
  const topic = clip(b.topic, 80);
  const website = clip(b.website, 200);
  const message = clip(b.message, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please add your name and a valid email.' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO || !process.env.CONTACT_FROM) {
    console.error('Contact form: Resend env vars not set');
    return res.status(503).json({ ok: false, error: 'Something went wrong. Please email hello@profectusagency.com.' });
  }

  const rows = [['Topic', topic], ['Name', name], ['Email', email], ['Company', company], ['Phone', phone], ['Website', website]]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join('');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `Website enquiry: ${topic || 'General'} from ${name}`,
      html: `<table style="font:14px/1.5 sans-serif">${rows}</table>${message ? `<p style="font:14px/1.6 sans-serif;white-space:pre-wrap">${esc(message)}</p>` : ''}`,
      text: `${topic}\n${name} <${email}>\n${company}\n${phone}\n\n${message}`,
    }),
  });

  if (!r.ok) {
    console.error('Resend error', r.status, await r.text());
    return res.status(502).json({ ok: false, error: 'Something went wrong. Please email hello@profectusagency.com.' });
  }
  return res.status(200).json({ ok: true });
}
