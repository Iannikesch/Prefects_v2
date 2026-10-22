// Site-wide settings. Change a value here and it changes everywhere.

// The AI product has no name yet. Every page, nav item and heading reads this.
export const AI_NAME = '[AI Product]';
export const AI_PATH = '/ai';

export const SITE = {
  name: 'Profectus Agency',
  url: 'https://profectusagency.com',
  description:
    'Profectus is a data-driven marketing agency powered by a proprietary data spine with near-full domestic coverage, built by a team with decades of experience at world-class brands.',
  // Where contact enquiries go. Placeholder until the client confirms.
  contactEmail: '[CONTACT EMAIL]',
};

export const NAV = [
  { label: 'Capabilities', href: '/capabilities' },
  { label: AI_NAME, href: AI_PATH },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
];

// Homepage "Firm Highlights", from the live homepage.
export const STATS = [
  { value: '32%', label: 'Average same-store sales lift for retail clients' },
  { value: '94%', label: 'Average SMS open rate across campaigns' },
  { value: '500+', label: 'Platform integrations for audience activation' },
  { value: '22:1', label: 'LTV to CAC ratio for SaaS go-to-market engagements' },
  { value: '85%', label: 'Occupancy achieved within 6 months for a luxury launch' },
];

export const INDUSTRIES = [
  'Retail & E-Commerce', 'Financial Services', 'Nonprofit & Education',
  'Travel & Hospitality', 'Consumer Packaged Goods', 'Healthcare & Pharmaceuticals',
  'Wellness & Lifestyle', 'Media & Entertainment', 'Restaurants & Hospitality',
  'Telecommunications', 'Real Estate & Development',
];

// "Why Profectus", from the live homepage.
export const WHY = [
  {
    title: "We Built the Infrastructure. We Didn't License It.",
    text: "Our proprietary data spine was built and refined over decades for world-class brands. It gives clients near-complete domestic audience coverage with powerful identity resolution, targeting, and activation capabilities. Most agencies resell someone else's data. This is ours.",
  },
  {
    title: "We Reach Who Others Can't.",
    text: 'Third-party cookies are gone, leaving most platforms with limited audience visibility. Our cookieless activation infrastructure reaches up to 87% of identifiable audiences on one major ad platform and up to 95% on another. While competitors guess, you reach.',
  },
  {
    title: 'The Most Competitive Messaging Pricing on the Planet.',
    text: 'We offer industry-leading pricing for email, SMS, and push. Not as a loss leader, but because we built the infrastructure ourselves. Lower sending costs mean higher frequency, stronger relationships, and more revenue.',
  },
  {
    title: 'World-Class Brand Experience. Applied to Every Client.',
    text: "Our strategies and systems were built running marketing inside some of the world's most complex organizations. That experience isn't theoretical. It's embedded in how we operate every day.",
  },
];

// "How It Works", from the live About page.
export const PROCESS = [
  {
    title: 'Define Identity',
    text: 'We connect your customer data to our proprietary spine, resolve identities across devices and channels, and build a unified audience view, including known customers, unknown prospects, and high-value audiences currently outside your program.',
  },
  {
    title: 'Build the Engine',
    text: 'We build the activation system: custom audience architecture across first-, second-, and third-party data, lifecycle and loyalty infrastructure, scalable direct channels, and creative informed by real audience insights.',
  },
  {
    title: 'Activate & Compound',
    text: 'Campaigns launch, performance is measured against revenue, and insights feed back into the data layer, making every future campaign smarter, more efficient, and more effective.',
  },
];

// Why Profectus: what you get from a platform, and from us. Used on the
// homepage and every capability page. Claims come from the live site's copy
// plus the owner's 230M database (Oct 21). "Holding company" and "no
// inventory" await the owner's OK.
export const EDGE = [
  ['What you get', 'A login and a support ticket.', 'The operators who ran it for world-class brands, on your account.'],
  ['Whose data', "Rented from someone else's graph.", 'Our own database of 230 million people. Near-full domestic coverage.'],
  ['Where your budget goes', 'Into their own network first.', 'Wherever it works. 500+ platforms and no inventory to protect.'],
  ['What sending costs', 'Priced for enterprise contracts.', 'Built in-house, priced so sending more often finally pays.'],
  ['Who it answers to', 'Shareholders and a holding company.', 'You, and the number you hired us to move.'],
];
