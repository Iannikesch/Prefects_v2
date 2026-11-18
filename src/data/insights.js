// Insights (the blog). Category keys match the image folders the posts were
// delivered in; the label is what readers see.
export const INSIGHT_CATEGORIES = {
  'data-analytics': 'Data & Analytics',
  'email-sms-retention': 'Email, SMS & Retention',
  'paid-media-performance': 'Paid Media & Performance',
  'agency-marketing-strategy': 'Agency & Marketing Strategy',
  'campaign-playbooks': 'Campaign Playbooks',
  'brand-creative': 'Brand & Creative',
};

// Posts in reading order: by their number in the source docs.
export const byNumber = (a, b) => a.data.number - b.data.number;

// Three related posts: the nearest numbers in the same category, wrapping round.
export function related(post, all) {
  const same = all.filter((p) => p.data.category === post.data.category).sort(byNumber);
  const i = same.findIndex((p) => p.id === post.id);
  const out = [];
  for (let k = 1; out.length < 3 && k < same.length; k++) out.push(same[(i + k) % same.length]);
  return out;
}
