// The 13 capabilities (12 from the live site plus Identity Resolution), with the same URLs as the live site
// (/capabilities/<slug>) so old links and search ranking carry over.
// Item copy is from the live pages, with em dashes rewritten.
// `summary` is new: one line per capability, written from its own items.

export const THEMES = [
  { id: 'strategy', name: 'Strategy & Brand', blurb: 'Know who you are for, then say it so it lands.' },
  { id: 'media', name: 'Media & Audience', blurb: 'Reach the right person, in the right channel, at the right moment.' },
  { id: 'data', name: 'Data & Intelligence', blurb: 'The data underneath everything, and the models on top of it.' },
  { id: 'lifecycle', name: 'Lifecycle & Revenue', blurb: 'Turn every customer you reach into revenue that compounds.' },
];

const IDENTITY_ITEM = ['Identity Resolution', 'Connect fragmented customer data into a single, unified profile through deterministic matching. We translate CRM records, transaction histories, loyalty data, and telecommunications signals into addressable digital identities at scale with industry-leading match rates.'];

// The closing slab for pages without their own: the homepage, the overview and anything general.
export const DEFAULT_CLOSE = ['Your next customer is probably in our database.', "Let's go find them.", 'Start the conversation →'];

export const CAPABILITIES = [
  {
    slug: 'strategy-go-to-market',
    name: 'Strategy & Go-to-Market',
    theme: 'strategy',
    summary: 'Research, positioning and launch plans grounded in who actually buys, so every dollar has a job.',
    close: ['Every dollar needs a job.', 'Let\'s write the plan.', 'Start the plan →'],   // the closing slab: line, italic line, button
    items: [
      ['Market & Competitive Research', 'Deep analysis of your competitive landscape, market dynamics, category trends, and whitespace opportunities. We map the terrain so your strategy is grounded in reality, not assumptions.'],
      ['Ideal Customer Profile Definition', 'We define your highest-value audiences with precision using firmographic, demographic, behavioral, and psychographic criteria. Every campaign, channel, and message flows from a clearly defined ICP.'],
      ['Buyer Journey Mapping', "We map every stage of your customer's decision-making process, identifying friction points, drop-off moments, and conversion opportunities across all touchpoints."],
      ['Brand & Product Positioning', 'Define who you are, what you stand for, and why it matters in language your market actually responds to. We lead brands through rigorous positioning exercises that create strategic clarity and competitive separation.'],
      ['Messaging Architecture', 'A structured framework that defines your primary narrative, persona-specific value propositions, proof points, and tone of voice. This becomes the source document for every piece of communication your brand produces.'],
      ['Go-to-Market Strategy', 'Comprehensive launch and growth planning that aligns product, audience, channel, budget, timeline, and team. We build GTM strategies for new brands, new products, new markets, and new categories.'],
      ['Campaign & Launch Planning', 'End-to-end campaign architecture from concept through execution, including channel mix, creative requirements, timeline, KPIs, and measurement frameworks.'],
      ['Channel & Budget Strategy', 'Data-informed channel selection and budget allocation based on audience behavior, competitive presence, and performance modeling. Every dollar has a job.'],
      ['Offer & Pricing Strategy', 'Positioning your offer for maximum conversion and revenue. We develop pricing frameworks, promotional strategies, and offer architecture that balance acquisition with margin.'],
      ['Sales & Marketing Alignment', "We design the handoff between marketing and sales so leads don't die in the gap. Shared definitions, scoring models, SLAs, and feedback loops keep both teams accountable to revenue."],
    ],
  },
  {
    slug: 'brand-creative-storytelling',
    name: 'Brand, Creative & Storytelling',
    theme: 'strategy',
    summary: 'Identity, campaigns and content that turn audience intelligence into work people remember.',
    close: ['Your story is better than your ads.', 'Let\'s prove it.', 'Talk to our creative team →'],   // the closing slab: line, italic line, button
    items: [
      ['Brand Identity & Voice Development', 'Logos, color systems, typography, iconography, pattern libraries, and complete visual identity packages crafted with strategic intention. We deliver comprehensive brand guidelines (60 to 120+ pages) ensuring consistency across every application, location, and channel. Voice and tone frameworks ensure your brand sounds like itself everywhere.'],
      ['Creative Direction & Concepting', 'Big ideas that travel. We concept and produce integrated campaigns from initial insight through final delivery, spanning video, static, motion, audio, experiential, and interactive formats. Every campaign is built to work across channels, not just one.'],
      ['Integrated Campaign Strategy', 'Multi-channel campaign architecture that connects paid, owned, and earned touchpoints into a cohesive narrative. We plan how the story unfolds across every platform so the whole is greater than the sum of its parts.'],
      ['Copywriting for Brand, Performance & Lifecycle', 'Headlines, body copy, taglines, website copy, ad copy, email copy, SMS copy, blog posts, whitepapers, case studies, social content, scripts, and long-form editorial. All written to your brand voice and optimized for the specific channel and objective.'],
      ['Content & Editorial Planning', 'Editorial calendars, content pillars, topic strategy, SEO-informed planning, and production workflows that fuel always-on channels with high-quality content. We develop the system, not just the pieces.'],
      ['Video & Visual Direction', 'From 6-second bumpers to long-form brand films, our production team creates video content optimized for every screen and platform. We handle scripting, storyboarding, casting, production, post-production, motion graphics, animation, and versioning at scale. Commercial broadcast, digital, social, CTV: we produce for all of them.'],
      ['Social-First Creative', 'Content designed natively for social platforms, not repurposed from other channels. Platform-specific formats, trends, and behaviors inform every piece so your brand shows up the way audiences expect on each platform.'],
      ['Influencer, Creator & Operator Collaborations', 'We identify, vet, negotiate, and manage influencer, creator, chef, and operator partnerships, from macro talent to niche micro-influencers, with full performance tracking and content rights management.'],
      ['PR & Trade Media Strategy', 'Press kits, media pitching, story angle development, publication targeting, and trade media relationships that earn coverage and build credibility in the outlets your audience trusts.'],
      ['Experiential & Event Activations', 'Live experiences, pop-ups, launch events, trade shows, and brand activations that create memorable moments and generate content, data capture, and media coverage simultaneously.'],
      ['Photography', 'Product, lifestyle, corporate, editorial, food, property, and aerial drone photography. We plan and execute professional shoots that deliver a library of assets designed to fuel your marketing for months.'],
      ['Audio Production', 'Radio spots, podcast ads, voiceovers, streaming audio creative, and full production from scripting through final mix.'],
      ['Graphic Design & Collateral', 'Print design (magazines, newspapers, direct mail), digital ad creative (display banners, social ads, native ads), out-of-home creative (billboards, transit, digital screens), packaging design, brochures, sell sheets, event materials, infographics, and data visualizations.'],
    ],
  },
  {
    slug: 'website-digital-experience',
    name: 'Website & Digital Experience',
    theme: 'strategy',
    summary: 'Sites, landing systems and apps designed to convert, and wired to your data from day one.',
    close: ['Your site gets the traffic.', 'Let\'s make it close.', 'Talk about your site →'],   // the closing slab: line, italic line, button
    items: [
      ['Website Strategy & Information Architecture', 'Decision-driven site structure and navigation.'],
      ['UX & Conversion Rate Optimization', 'Research-backed design and A/B testing programs.'],
      ['Funnel & Landing Page Design', 'Conversion-optimized landing systems.'],
      ['Form Strategy & Lead Capture', 'Smart forms and progressive profiling.'],
      ['Booking & Routing Workflows', 'Automated scheduling and routing systems.'],
      ['Personalization Logic', 'Dynamic content and real-time audience adaptation.'],
      ['Event Tracking & Analytics', 'GA4, Adobe, or custom analytics implementation.'],
      ['SEO Foundations & Optimization', 'Technical SEO, schema, keyword targeting, speed optimization.'],
      ['Custom Website Development', 'WordPress, Shopify, Webflow, React, headless.'],
      ['E-Commerce Solutions', 'Checkout optimization, payment integrations, inventory systems.'],
      ['Mobile App Development', 'Loyalty, push, CRM integrations.'],
      ['Web Applications & Tools', 'Calculators, configurators, portals, custom apps.'],
    ],
  },
  {
    slug: 'paid-media-demand-generation',
    name: 'Paid Media & Demand Generation',
    theme: 'media',
    summary: 'Search, social, programmatic, CTV and more, targeted with first-party data and measured against revenue.',
    close: ['Stop paying to meet', 'the same stranger twice.', 'Talk to a media operator →'],   // the closing slab: line, italic line, button
    items: [
      ['Paid Search & Keyword Strategy', 'Capture intent at the moment it happens. We manage full-funnel SEM programs across Google, Bing, and emerging search platforms, from keyword strategy to bid management to landing page optimization.'],
      ['Paid Social Across Major Platforms', 'Reach and engage audiences across Meta, TikTok, LinkedIn, Pinterest, Snapchat, Reddit, and X. We develop platform-native strategies paired with custom audience targeting powered by your first-party data.'],
      ['Programmatic & Display Media', 'Access premium inventory across the open web, private marketplaces, and curated deals. We build and optimize programmatic campaigns using first-party data activation, contextual targeting, and real-time bidding strategies.'],
      ['Retargeting & Remarketing', "Re-engage visitors who showed intent but didn't convert. We build sophisticated retargeting programs across display, social, and CTV with frequency management and sequential messaging."],
      ['Lookalike & Expansion Modeling', 'Find more of your best customers. We build custom lookalike and expansion audiences based on your highest-value customer profiles and activate them across every major platform.'],
      ['Geo-Targeting & Conquesting', 'Location-based targeting, geo-fencing around competitor locations, proximity targeting, and market-specific campaigns that reach the right people in the right places.'],
      ['Connected TV (CTV) & Over-the-Top (OTT)', 'Bring the precision of digital to the impact of television. We plan and execute CTV and OTT campaigns with household-level targeting, frequency management, and closed-loop measurement tied back to your customer data.'],
      ['Streaming Audio & Podcast Advertising', 'Reach audiences through Spotify, Pandora, iHeart, and podcast placements with precise audience targeting and attribution. Host-read, programmatic, and branded options.'],
      ['Out-of-Home (OOH): Billboards, Transit, Digital Screens', 'Activate data-driven audiences in the physical world through traditional and programmatic digital out-of-home placements. Location-targeted, dayparted, and measurable.'],
      ['Radio & Print Media', 'Traditional and streaming radio, magazines, newspapers, and trade publications. Strategic placements backed by audience data and circulation alignment.'],
      ['Native Advertising', 'In-feed, content recommendation, and sponsored content placements that match the publisher environment while driving measurable engagement.'],
      ['Retail Media Networks', 'Reach high-intent shoppers at the digital shelf. We manage campaigns across Amazon, Walmart Connect, Instacart, Target Roundel, and other retail media networks, connecting shopper data to closed-loop sales measurement.'],
      ['Creative Testing Frameworks', 'Structured creative testing across formats, messages, audiences, and placements. We build testing roadmaps that continuously improve performance and surface insights that inform strategy.'],
      ['Budget Pacing & Optimization', 'Real-time budget management that maximizes performance across channels. We optimize pacing, allocation, and bidding to ensure your spend is always working its hardest.'],
      ['Attribution & Performance Analysis', "Multi-touch attribution, media mix modeling, and incrementality analysis that give you an honest picture of marketing's contribution to revenue. We build the frameworks. We report the truth."],
    ],
  },
  {
    slug: 'loyalty-lifecycle',
    name: 'Loyalty & Lifecycle',
    theme: 'lifecycle',
    summary: 'Loyalty programs and lifecycle journeys that turn a first purchase into a lifetime, sent on email and SMS we built ourselves.',
    // Renamed Oct 22 from Enterprise Email & Text Messaging (old URL redirects).
    // The first five items are new drafts; the rest are the live site's copy.
    close: ['One purchase is a start.', 'Let\'s make it a lifetime.', 'Build your program →'],   // the closing slab: line, italic line, button
    items: [
      ['Loyalty Program Design', 'Tiers, points, perks and the economics behind them. We design programs members actually want to climb, priced so the rewards pay for themselves.'],
      ['Member Lifecycle Journeys', 'Every stage of membership mapped and automated: join, first reward, tier up, lapse, return. Each member gets the next move that fits where they are.'],
      ['VIP & Tier Experiences', 'Recognition for the customers who matter most. Early access, surprise rewards and service that makes your best members feel known.'],
      ['Churn Prediction & Winback', 'Models that spot a member drifting before they leave, and journeys that bring them back with the right offer at the right moment.'],
      ['Loyalty Value Measurement', 'What the program is really worth: member lifetime value, incremental visits and the true cost of every reward, reported honestly.'],
      ['ESP Architecture & Setup', 'Full email service provider selection, configuration, and deployment. We build the technical foundation for high-volume, high-deliverability email programs from the ground up.'],
      ['Lifecycle & Journey Orchestration', 'End-to-end email programs mapped to customer lifecycle stages. Welcome series, onboarding sequences, nurture tracks, re-engagement campaigns, winback flows, and post-purchase journeys, all automated and behavioral.'],
      ['Behavioral & Event-Triggered Email', 'Real-time email triggers based on customer actions, inactions, milestones, and signals. Browse abandonment, cart abandonment, purchase confirmation, usage alerts, and custom behavioral triggers.'],
      ['Nurture & Waterfall Campaigns', 'Sophisticated multi-touch nurture sequences that move prospects through the funnel with content and offers matched to their stage and intent level.'],
      ['Dynamic Content & Personalization', 'Modular email content that assembles dynamically based on audience data, preferences, behavior, and real-time signals. Every recipient sees a message built for them.'],
      ['Deliverability Optimization', 'Sender reputation management, authentication (SPF, DKIM, DMARC), list hygiene, warm-up protocols, inbox placement monitoring, and sending practice optimization that protect your reach.'],
      ['A/B Testing & Performance Tuning', 'Structured testing programs across subject lines, content, send times, frequency, and segmentation. Every send generates data that improves the next one.'],
      ['CRM & CDP Integrations', 'Seamless connection between your email platform and your CRM, CDP, e-commerce system, and data layer. We ensure your email program has access to the full picture of each customer.'],
      ['10DLC Registration & Compliance', 'Full 10DLC brand and campaign registration, TCPA compliance, CTIA guidelines, opt-in documentation, opt-out management, quiet hours, and frequency caps. We protect your brand while maximizing reach.'],
      ['High-Volume Transactional Messaging', 'Order confirmations, shipping notifications, appointment reminders, account alerts, and verification codes delivered at enterprise throughput with reliability guarantees.'],
      ['Promotional SMS & MMS', 'Revenue-driving promotional campaigns with rich media, personalized offers, flash sales, event announcements, and seasonal promotions. Our SMS programs consistently return $11 to $14+ for every $1 spent.'],
      ['Two-Way Conversational Messaging', 'Turn SMS into a dialogue. We build conversational flows that let customers ask questions, make reservations, check order status, provide feedback, and engage with your brand in real time.'],
      ['Sales Rep Texting Workflows', 'Equip your sales team with compliant, trackable texting workflows integrated into your CRM. Reps can engage leads via text with templates, automation, and full visibility for management.'],
      ['Event-Triggered SMS', 'Real-time text messages triggered by customer behavior: abandoned carts, loyalty milestones, appointment reminders, weather conditions, location proximity, lapsed visit windows, and custom events.'],
      ['Opt-In Capture & Consent Management', 'QR codes, web forms, keyword opt-in, point-of-sale signup, social capture, and compliant consent documentation. We build your subscriber list the right way and segment it for precision targeting.'],
      ['Enterprise Throughput & Reliability', 'Infrastructure built for scale. High-volume sending with delivery monitoring, failover systems, and performance guarantees for brands that need SMS to work every time.'],
    ],
  },
  {
    slug: 'identity-resolution',
    name: 'Identity Resolution',
    theme: 'data',
    summary: 'Every email, device and purchase traced back to one real person.',
    // New capability (Oct 21), split out of Data, Identity & Infrastructure.
    // The first item is the live site's copy; the rest are new drafts.
    close: ['Somebody clicked today.', 'Let\'s put a name to it.', 'Find out who visited →'],   // the closing slab: line, italic line, button
    items: [
      IDENTITY_ITEM,
      ['Website Visitor Identification', "We put a name to a click. One line of code on your site matches visitors against our database of 230 million people, so a visit that would have ended as an anonymous session becomes a real profile in your CRM: who they are, how to reach them and what they read. Then they go straight into retargeting across direct mail, paid social and email, with a message that picks up where they left off."],
      ['Cross-Device & Cross-Channel Linking', 'Phones, laptops, inboxes, loyalty cards and store visits tied back to the same person, so one customer stops looking like five.'],
      ['Known & Unknown Audience Resolution', 'Resolve the customers you already have and the prospects you have never met against our database of 230 million people, including high-value audiences outside your program today.'],
      ['Match Rate Diagnostics', 'See how much of your file we can recognize, where the gaps are and what it takes to close them, before you spend a dollar on media.'],
    ],
  },
  {
    slug: 'data-identity-infrastructure',
    name: 'Customer Data & Infrastructure',
    theme: 'data',
    summary: 'The data layer, real-time profiles and governance everything else runs on.',
    close: ['Your customer lives in five systems.', 'Let\'s make it one.', 'Talk to a data operator →'],   // the closing slab: line, italic line, button
    items: [
      ['Data Layer Design & Deployment', 'We architect and deploy the foundational data layer that captures, normalizes, and routes customer interaction data across your entire digital ecosystem. This is the infrastructure everything else runs on.'],
      ['First-Party Data Capture', 'Design and implement systems that capture valuable first-party data at every customer touchpoint: website, app, email, SMS, events, point-of-sale, and customer service interactions.'],
      ['Audience Enrichment', 'Layer additional behavioral, demographic, psychographic, and intent signals onto your existing customer profiles. Enrichment creates a more complete picture that powers better targeting and personalization.'],
      ['Proprietary Database Activation', 'Activate your owned data assets across 500+ platforms in the advertising ecosystem. We serve as your neutral data hub, connecting walled gardens, DSPs, SSPs, social platforms, CTV partners, and retail media networks.'],
      ['CDP Integration & Configuration', 'Selection, implementation, and configuration of customer data platforms. We connect your CDP to every source and activation channel so your unified customer profiles are always current and always actionable.'],
      ['Real-Time Profile Updates', 'Customer profiles that update in real time as new interactions, purchases, and engagement signals flow in. No batch processing delays. No stale data powering your campaigns.'],
      ['Event Instrumentation & QA', 'Comprehensive event tracking implementation across web, app, and marketing platforms with rigorous quality assurance. We ensure your data is accurate, complete, and trustworthy before anything activates against it.'],
      ['Privacy, Consent & Governance', 'Privacy-safe frameworks built from day one. Consent capture, purpose limitation, data minimization, pseudonymization, role-based access controls, audit trails, and policy-based retention and deletion. Clean room solutions enable secure, privacy-compliant data collaboration with partners and publishers without exposing raw PII.'],
    ],
  },
  {
    slug: 'audience-intent-development',
    name: 'Audience & Intent Development',
    theme: 'media',
    summary: 'Audiences defined by what people actually do, scored by how ready they are to buy.',
    close: ['Your best customers are out there.', 'Let\'s go find them.', 'Find your audience →'],   // the closing slab: line, italic line, button
    items: [
      ['Custom Audience Creation', 'Audiences built from your first-party data, enrichment layers, and behavioral signals. We go beyond demographics to create segments defined by what people actually do, buy, search for, and respond to.'],
      ['Lookalike & Expansion Modeling', 'Find more of your best customers. We build statistical models based on your highest-value profiles and activate expansion audiences across programmatic, social, CTV, and direct channels.'],
      ['High-Intent Scoring', "Score prospects and customers based on intent signals: search behavior, content engagement, site activity, email interaction, and third-party intent data. Focus your spend and your sales team's time on the people most likely to convert."],
      ['Suppression & Waste Reduction', 'Eliminate wasted impressions by suppressing existing customers from acquisition campaigns, excluding low-value segments, and removing converted prospects from active funnels. Better targeting means better ROI.'],
      ['Account-Based Marketing (ABM)', 'Precision targeting of named accounts and buying committees within target organizations. We build ABM programs that coordinate paid media, email, direct mail, and sales outreach against your most valuable prospects.'],
      ['Geo-Fencing & Proximity Targeting', 'Location-based audience activation using geo-fencing around competitor locations, event venues, retail areas, and custom geographic boundaries.'],
      ['Upsell & Cross-Sell Audience Development', 'Identify existing customers with the highest propensity for additional purchases, upgrades, and cross-category expansion. We build audiences and triggers that grow customer lifetime value.'],
    ],
  },
  {
    slug: 'sales-enablement',
    name: 'Sales Enablement',
    theme: 'lifecycle',
    summary: 'Narratives, tools and handoffs that let marketing and sales work as one revenue team.',
    close: ['Your reps deserve better leads.', 'Let\'s hand them some.', 'Arm your sales team →'],   // the closing slab: line, italic line, button
    items: [
      ['Sales Narrative & Positioning', 'Clear, compelling sales narratives that align with your brand positioning and speak directly to buyer pain points, objections, and decision criteria.'],
      ['Objection Handling Frameworks', 'Documented frameworks for the most common objections your sales team encounters, with data-backed responses, proof points, and competitive positioning.'],
      ['Rep Toolkits & Scripts', 'Pitch decks, one-pagers, case study templates, ROI calculators, demo environments, proposal templates, battle cards, email templates, and call scripts: everything your reps need to sell with confidence.'],
      ['Lead Scoring & Routing', 'Automated lead scoring based on engagement, fit, and intent signals with intelligent routing to the right rep at the right time. No leads lost in the gap between marketing and sales.'],
      ['Intent Signal Interpretation', 'We help your sales team understand and act on intent signals: content downloads, page visits, email engagement, search behavior, and third-party intent data that indicate buying readiness.'],
      ['Marketing-to-Sales Handoff Design', 'Defined processes, shared definitions (MQL, SQL, SAL), SLAs, and feedback loops that ensure marketing and sales operate as a single revenue team, not competing departments.'],
      ['CRM Workflow Alignment', 'CRM configuration that mirrors your actual sales process. Pipeline stages, automation rules, task creation, follow-up sequences, and reporting dashboards built around how your team actually works.'],
    ],
  },
  {
    slug: 'analytics-attribution-optimization',
    name: 'Analytics, Attribution & Optimization',
    theme: 'data',
    summary: "An honest picture of what's working, and a plan to act on it.",
    close: ['Which dollar moved which customer?', 'Let\'s get you a receipt.', 'Get the real numbers →'],   // the closing slab: line, italic line, button
    items: [
      ['KPI Definition & Alignment', 'We define the metrics that actually matter for your business and align every team, channel, and campaign to those outcomes. Clarity on what success looks like prevents wasted effort and misaligned incentives.'],
      ['Funnel Diagnostics', 'Stage-by-stage analysis of your marketing and sales funnel identifying conversion bottlenecks, drop-off points, and optimization opportunities at every step from impression to revenue.'],
      ['Multi-Touch Attribution', "Attribution models that account for the full customer journey across channels and touchpoints. We implement and manage attribution frameworks that give credit where it's actually due."],
      ['Incrementality Analysis', 'Go beyond correlation. We design and run incrementality tests that prove whether your marketing spend is driving net-new outcomes or simply capturing demand that would have converted anyway.'],
      ['Revenue Contribution Modeling', 'Connect marketing activity directly to revenue. We build models that quantify how each channel, campaign, and tactic contributes to pipeline, closed deals, and customer lifetime value.'],
      ['Executive Dashboards', 'Custom dashboards built for leadership that surface the metrics that matter: pipeline velocity, conversion rates, revenue attribution, channel performance, and forecast accuracy. Real-time, accessible, and actionable.'],
      ['Ongoing Optimization Recommendations', "Data isn't useful if nobody acts on it. We deliver regular optimization recommendations based on performance data, test results, and market signals, then help implement them."],
    ],
  },
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    theme: 'data',
    summary: 'Chatbots, voice agents, workflows and custom models that take the manual work out of growth.',
    close: ['Let the model pick the moment.', 'You pick the goal.', 'Put AI to work →'],   // the closing slab: line, italic line, button
    items: [
      ['AI Chatbots (Website, SMS, Social)', 'Deploy intelligent conversational agents that answer FAQs, qualify leads, book appointments, take reservations, process simple orders, and escalate to humans when needed, 24/7 across every channel.'],
      ['Workflow Automation', 'Eliminate manual bottlenecks. We design and implement automated workflows across marketing, sales, and operations using platforms like Zapier, Make, HubSpot, and custom integrations.'],
      ['Lead Qualification & Scoring Systems', 'Automatically score and route leads based on engagement signals, firmographic data, behavioral patterns, and intent indicators so your sales team focuses on opportunities most likely to close.'],
      ['Marketing Automation', 'Sophisticated trigger-based campaigns across email, SMS, push, and direct mail that respond to customer behavior in real time without manual intervention.'],
      ['Predictive Analytics', 'Custom propensity, churn, lifetime value, and lookalike models built on your first-party data. Know what your customers will do next and act before your competitors do.'],
      ['Voice AI Solutions', 'Automated voice agents for appointment scheduling, order status, customer support, and outbound campaigns that sound natural and integrate with your existing systems.'],
      ['Custom AI Development', 'Purpose-built AI solutions tailored to your specific business challenges, from recommendation engines to content generation to anomaly detection.'],
    ],
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    theme: 'media',
    summary: 'Always-on social that builds community and, increasingly, sells.',
    close: ['Followers are nice.', 'Customers are better.', 'Talk social →'],   // the closing slab: line, italic line, button
    items: [
      ['Social Media Strategy & Content Creation', 'Platform-specific content strategies, publishing calendars, and original content creation for Instagram, TikTok, LinkedIn, Facebook, X, YouTube, Pinterest, and emerging platforms.'],
      ['Platform Management & Community', 'Daily management, engagement, community building, comment moderation, and audience development across all active platforms.'],
      ['Social Listening & Intelligence', 'Monitor brand sentiment, competitive activity, and cultural trends in real time. We turn social listening data into actionable insights that inform creative, messaging, and strategy.'],
      ['Social Commerce', 'Turn social channels into revenue drivers with shoppable content, live shopping events, and integrated social storefront experiences.'],
    ],
  },
  {
    slug: 'direct-mail-offline-media',
    name: 'Direct Mail & Offline Media',
    theme: 'media',
    summary: 'Physical media triggered by the same data that runs your digital programs.',
    close: ['The mailbox still works.', 'Let\'s prove it.', 'Plan a drop →'],   // the closing slab: line, italic line, button
    items: [
      ['Data-Driven Direct Mail', 'Trigger personalized direct mail pieces using the same audience data and behavioral signals that power your digital campaigns. We manage creative, production, printing, and fulfillment.'],
      ['Print & Collateral Design', 'Brochures, catalogs, sell sheets, event materials, packaging, and more, designed to extend your brand into the physical world with the same quality and consistency as your digital presence.'],
    ],
  },
];

export const bySlug = (slug) => CAPABILITIES.find((c) => c.slug === slug);
export const inTheme = (id) => CAPABILITIES.filter((c) => c.theme === id);

// The spine: five capabilities in order, each moving one customer one step.
// `state` is what the customer becomes once the step is done.
export const SPINE = [
  { slug: 'identity-resolution', verb: 'Recognize', state: 'Someone',
    line: 'A stranger becomes someone.',
    body: 'Every email, device and purchase traced back to one real person. Matched deterministically against our own database of 230 million people, not guessed from a rented graph.',
    does: ['Deterministic matching', 'Cross-device and cross-channel', 'Known customers and unknown prospects'] },
  { slug: 'data-identity-infrastructure', verb: 'Unify', state: 'Whole picture',
    line: 'Someone becomes a whole picture.',
    body: 'Your CRM, site, store and inbox finally agree. One profile per person, updated the moment they act, with consent built in from day one.',
    does: ['Data layer and event tracking', 'CDP setup and integration', 'Real-time profiles', 'Privacy and consent'] },
  { slug: 'audience-intent-development', verb: 'Understand', state: 'Priority',
    line: 'A picture becomes a priority.',
    body: 'Know who is worth the most, who is ready to buy now and who is about to walk. Then find more people just like your best.',
    does: ['Intent scoring', 'Lookalike expansion', 'Enrichment', 'Suppression of wasted spend'] },
  { slug: 'ai-automation', verb: 'Decide', state: 'Next move',
    line: 'A priority gets the right next move.',
    body: 'AI picks what to send, where and when, and sends it. Models trained on your own first-party data. Workflows that run while your team sleeps.',
    does: ['Predictive models', 'Trigger-based journeys', 'Chat and voice agents'] },
  { slug: 'analytics-attribution-optimization', verb: 'Prove', state: 'Proven',
    line: 'Every move gets a receipt.',
    body: 'Which dollar moved which person, counted honestly. Incrementality tests instead of vanity metrics, and a dashboard your CFO will actually read.',
    does: ['Multi-touch attribution', 'Incrementality testing', 'Executive dashboards'] },
];

// The services the spine runs through, in two groups.
export const SERVICE_GROUPS = [
  { title: 'Media', blurb: 'The channels where the next move lands.',
    slugs: ['paid-media-demand-generation', 'loyalty-lifecycle', 'direct-mail-offline-media', 'social-media-management'] },
  { title: 'Strategy', blurb: 'The story, the site and the team that close it.',
    slugs: ['strategy-go-to-market', 'brand-creative-storytelling', 'website-digital-experience', 'sales-enablement'] },
];

// Where a capability sits: its spine step or its service group, and what comes next.
export function placeOf(slug) {
  const i = SPINE.findIndex((s) => s.slug === slug);
  if (i >= 0) return { kind: 'spine', index: i, step: SPINE[i], next: SPINE[i + 1] ? bySlug(SPINE[i + 1].slug) : null, nextStep: SPINE[i + 1] || null };
  const g = SERVICE_GROUPS.find((g) => g.slugs.includes(slug));
  const j = g.slugs.indexOf(slug);
  return { kind: 'service', group: g, next: bySlug(g.slugs[(j + 1) % g.slugs.length]), nextStep: null };
}
