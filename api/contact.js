// Contact form -> Resend -> Braxton and Ethan. Vercel runs this as /api/contact.
// Env (Vercel project settings): RESEND_API_KEY, CONTACT_TO (comma-separated),
// CONTACT_FROM (e.g. "Profectus Website <forms@profectusagency.com>").

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

// The email Braxton and Ethan get. Table layout and inline styles only, so it
// renders the same in Outlook, Gmail and phone mail apps. Brand: black header,
// "Profectus." wordmark with the purple dot, purple button, a thin gold rule.
const INK = '#0B0B0C', VIOLET = '#8E84F7', BTN = '#6E62E8', GOLD = '#D3A754', SOFT = '#6B6B73', LINE = '#ECECEF';
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function leadEmail({ name, email, company, phone, topic, website, message, subject }) {
  const href = website && !/^https?:\/\//i.test(website) ? `https://${website}` : website;
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }) + ' CT';
  const link = (url, text) => `<a href="${esc(url)}" style="color:${INK};text-decoration:underline;text-decoration-color:${VIOLET}">${esc(text)}</a>`;
  const rows = [
    ['Email', email && link(`mailto:${email}`, email)],
    ['Phone', phone && link(`tel:${phone.replace(/[^\d+]/g, '')}`, phone)],
    ['Website', website && link(href, website)],
  ].filter(([, v]) => v).map(([k, v]) => `
          <tr>
            <td style="padding:14px 0;border-top:1px solid ${LINE};font:500 11px/1.4 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${SOFT};width:110px;vertical-align:top">${k}</td>
            <td style="padding:14px 0;border-top:1px solid ${LINE};font:400 15px/1.5 ${FONT};color:${INK}">${v}</td>
          </tr>`).join('');
  const first = esc(name.split(/\s+/)[0]);
  const reply = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: your enquiry to Profectus`)}`;

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F4F4F6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F6"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:6px;overflow:hidden">
    <tr><td style="background:${INK};padding:28px 36px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font:800 26px/1 ${FONT};letter-spacing:-.03em;color:#FFFFFF">Profectus<span style="color:${VIOLET}">.</span></td>
        <td align="right" style="font:500 11px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${GOLD}">New lead</td>
      </tr></table>
    </td></tr>
    <tr><td style="height:2px;background:${GOLD};line-height:2px;font-size:0">&nbsp;</td></tr>
    <tr><td style="padding:36px 36px 8px">
      <p style="margin:0 0 10px;font:500 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${SOFT}">Interested in</p>
      <p style="margin:0 0 24px"><span style="display:inline-block;padding:8px 14px;border-radius:6px;background:#F0EEFE;color:#4B3FD1;font:600 14px/1.2 ${FONT}">${esc(topic || 'Not specified')}</span></p>
      <h1 style="margin:0 0 6px;font:700 30px/1.15 ${FONT};letter-spacing:-.02em;color:${INK}">${esc(name)}</h1>
      ${company ? `<p style="margin:0;font:400 16px/1.4 ${FONT};color:${SOFT}">${esc(company)}</p>` : ''}
    </td></tr>
    <tr><td style="padding:20px 36px 8px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
      </table>
      ${message ? `<p style="margin:20px 0 0;padding:18px 20px;background:#F7F7F9;border-left:3px solid ${VIOLET};border-radius:6px;font:400 15px/1.6 ${FONT};color:${INK};white-space:pre-wrap">${esc(message)}</p>` : ''}
    </td></tr>
    <tr><td style="padding:28px 36px 36px">
      <a href="${reply}" style="display:inline-block;padding:14px 24px;border-radius:6px;background:${BTN};color:#FFFFFF;font:600 15px/1 ${FONT};text-decoration:none">Reply to ${first} &rarr;</a>
      <p style="margin:14px 0 0;font:400 13px/1.5 ${FONT};color:${SOFT}">Or just hit reply. It goes straight to ${esc(email)}.</p>
    </td></tr>
    <tr><td style="padding:18px 36px;background:#FAFAFB;border-top:1px solid ${LINE};font:400 12px/1.5 ${FONT};color:${SOFT}">
      Sent from the contact form on <a href="https://profectusagency.com/contact" style="color:${SOFT}">profectusagency.com</a> · ${when}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

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

  const subject = `New lead: ${name}${company ? `, ${company}` : ''} · ${topic || 'General'}`;
  const html = leadEmail({ name, email, company, phone, topic, website, message, subject });

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: email,
      subject,
      html,
      text: `New lead from profectusagency.com\n\nService: ${topic}\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nPhone: ${phone}\nWebsite: ${website}\n\n${message}\n\nReply to this email to answer ${name} directly.`,
    }),
  });

  if (!r.ok) {
    console.error('Resend error', r.status, await r.text());
    return res.status(502).json({ ok: false, error: 'Something went wrong. Please email hello@profectusagency.com.' });
  }
  return res.status(200).json({ ok: true });
}
