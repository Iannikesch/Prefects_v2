// The four case studies, with the same URLs as the live site
// (/case-studies/<slug>). Copy is from the live pages with em dashes
// rewritten. Stats are pulled from each page's own "What Changed" text;
// anything the page didn't state is a marked placeholder.

export const CASE_STUDIES = [
  {
    slug: 'morning-grounds-coffee',
    client: 'Morning Grounds Coffee',
    title: 'Regional Coffee Chain, Complete Brand Transformation',
    date: '2025-10-15',
    // The live subheading was template text ("Understanding due diligence..."),
    // so this line is new, written from the page's own story.
    summary: 'Eight locations with declining sales and no customer data, rebuilt around identity, loyalty and direct channels. Four new locations opened within a year.',
    services: ['brand-creative-storytelling', 'loyalty-lifecycle', 'data-identity-infrastructure', 'paid-media-demand-generation'],
    stats: [
      { value: '$14+', label: 'Returned for every $1 on the direct channel' },
      { value: '4', label: 'New locations opened within a year' },
      { value: '8', label: 'Locations unified on one data foundation' },
      { value: '[X%]', label: 'Revenue growth', confirm: true },
    ],
    inherited: 'Eight locations running on habit and reputation, two things that erode slowly and then all at once. Sales were declining, there was no customer data infrastructure, no digital presence, and the brand had never made a deliberate decision about who it was for. They had loyal customers they couldn’t identify and a competitive market they couldn’t see clearly.',
    built: 'A complete transformation grounded in data from the start. Brand identity and positioning built on a real understanding of who their customer was and what made the experience worth choosing. A loyalty and lifecycle infrastructure that made customer identity visible across every location. An SMS program running on our direct channel infrastructure, at cost economics that made real-frequency communication rational. And retargeting built on identity resolution that reached lapsed customers, not just the ones a pixel happened to catch.',
    changed: 'The direct channel alone returned more than $14 for every $1 spent. Revenue grew materially. Four new locations opened within a year. And the business had a data foundation that got smarter with every interaction, compounding the advantage rather than resetting it with every campaign.',
  },
  {
    slug: 'nonna-s-table',
    client: 'Nonna’s Table',
    title: 'Family Restaurant Chain, Expansion & Modernization',
    date: '2025-10-02',
    summary: 'A three-location family restaurant with no customer data or unified infrastructure, modernized with CRM, behavioral email and SMS, AI engagement, and systems validated for a twelve-location expansion.',
    services: ['data-identity-infrastructure', 'loyalty-lifecycle', 'ai-automation', 'brand-creative-storytelling'],
    stats: [
      { value: '$680', label: 'Customer lifetime value, up from $420' },
      { value: '12', label: 'Locations the systems are validated for' },
      { value: '3', label: 'Locations unified into one record per guest' },
      { value: '[X%]', label: 'Lift in repeat visit frequency', confirm: true },
    ],
    inherited: 'Three beloved locations operating entirely on institutional memory. No CRM, no unified customer data, and no way to know who their best guests were or how to reach them outside the four walls. The owners had a real business worth scaling and no infrastructure that could survive it.',
    built: 'A modern data and marketing operating foundation built for growth. Unified customer identity across all three locations, connecting visit history, preference data, and engagement signals into a single record per guest. Lifecycle programs built on behavioral triggers. Direct channel communications priced to run at a frequency that actually builds habit. And a brand system designed to hold across every location without losing the warmth that had always made it work.',
    changed: 'Repeat visit frequency climbed significantly. Customer lifetime value grew from $420 to $680. And when the expansion conversation returned, the infrastructure was ready, because it had been built to scale from the beginning.',
  },
  {
    slug: 'serenity-collective',
    client: 'Serenity Collective',
    title: 'Luxury Wellness Retreat, Complete Brand Launch',
    date: '2025-09-17',
    summary: 'Zero brand presence to 85% occupancy at premium pricing in six months, built on precise audience targeting, identity-based acquisition, and retention infrastructure from day one.',
    services: ['brand-creative-storytelling', 'audience-intent-development', 'paid-media-demand-generation', 'strategy-go-to-market'],
    stats: [
      { value: '85%', label: 'Occupancy at premium pricing within six months' },
      { value: '$425K', label: 'In retreat bookings' },
      { value: '4.9/5', label: 'Guest satisfaction score' },
      { value: '40%', label: 'Rebooking rate' },
    ],
    inherited: 'A world-class hospitality experience with no brand, no audience, and no bookings. Everything had been invested in building the product. Nothing had been built for being found by the people who would pay premium prices to experience it.',
    built: 'A brand built from scratch with the precision that audience intelligence makes possible. Positioning that owned a specific, defensible space in the wellness landscape. Acquisition infrastructure built on our proprietary data, reaching the exact audience profile, by behavior and intent, most likely to book at premium pricing and come back. And retention programming designed to turn a first visit into a lasting relationship.',
    changed: 'Within six months: 85% occupancy at premium pricing, $425K in retreat bookings, a 4.9/5.0 guest satisfaction score, and a 40% rebooking rate. The brand launched with a data foundation that meant every subsequent season would be smarter than the last.',
  },
  {
    slug: 'flowstate-ai',
    client: 'Flowstate AI',
    title: 'B2B SaaS Startup, Brand Identity & Go-to-Market',
    date: '2025-09-04',
    summary: 'From 15 beta users and no brand to $612K ARR and a Series A closed at 40% above projections, built on audience intelligence, precise positioning, and an integrated sales and marketing program.',
    services: ['strategy-go-to-market', 'brand-creative-storytelling', 'paid-media-demand-generation', 'analytics-attribution-optimization', 'sales-enablement'],
    stats: [
      { value: '$612K', label: 'ARR within six months' },
      { value: '58', label: 'Paying customers, up from 15 beta users' },
      { value: '$4.2M', label: 'Series A at an $18M valuation, 40% above projections' },
      { value: '22:1', label: 'LTV to CAC ratio' },
    ],
    inherited: 'Fifteen beta users, no brand, and a product that was genuinely exceptional but couldn’t yet be communicated in a way that resonated with buyers, or with investors. The gap between what the product did and what the market understood about it was costing deals and delaying the raise needed to scale.',
    built: 'A complete go-to-market program built on a clear strategic foundation. ICP definition grounded in behavioral and firmographic data about who actually buys and how they decide. Brand identity and positioning built to communicate differentiation immediately: in a sales conversation, a pitch deck, and the market simultaneously. A paid and owned activation program built on our audience infrastructure, reaching the right buyers at the right moment. And the analytics framework to measure what was working from the first campaign forward.',
    changed: 'Within six months: 58 paying customers, $612K ARR, and a $4.2M Series A closed at an $18M valuation, 40% above projections. A 22:1 LTV to CAC ratio. Investors cited the brand specifically. That outcome happens when data, strategy, creative, and activation work as one integrated system.',
  },
];

export const formatDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${m}.${d}.${y}`;
};
export const caseBySlug = (slug) => CASE_STUDIES.find((c) => c.slug === slug);
export const casesFor = (capabilitySlug) => CASE_STUDIES.filter((c) => c.services.includes(capabilitySlug));
