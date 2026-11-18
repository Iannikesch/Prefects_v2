---
title: "Building a Lead Scoring Model: A Worked Example"
description: "Lead scoring ranks leads by how likely they are to close. See a worked example using fit and behavior, sample point values, and the routing rules that make a score useful."
category: "campaign-playbooks"
number: 39
image: "../../assets/insights/039-building-a-lead-scoring-model-a-worked-example.png"
author: "The Profectus Team"
pubDate: 2026-11-17
---

Every lead a business generates gets treated the same by most sales teams by default: called in the order it came in, worked with roughly equal effort, regardless of how likely that specific lead actually is to close. Lead scoring exists to fix exactly that, by assigning each incoming lead a number based on behaviors and characteristics that correlate with an actual sale, so sales effort gets concentrated where it's statistically most likely to pay off.

## Fit, engagement and intent

The building blocks of a scoring model usually split into three categories: fit, engagement and intent. Fit covers who the lead is, company size, industry, budget signals, geographic location, anything that describes whether this type of prospect has historically converted well regardless of what they've done on a website. Behavior covers what the lead has actually done, requesting a demo versus downloading a generic guide, visiting a pricing page multiple times versus reading one blog post once, replying to an email versus letting three follow-ups go unanswered. A strong scoring model weighs both, since a perfect-fit prospect showing no real engagement and a poor-fit prospect showing intense engagement both represent real, if different, risks of wasted sales time.

Intent covers signals that someone is close to buying, such as repeated visits to a pricing page, a proposal opened or a request for a quote.

## A worked example

Here's an illustration with made-up data. A B2B software company builds a scoring model from scratch, starting by pulling eighteen months of closed-won and closed-lost deal history from its CRM. Looking at that history, certain patterns emerge: leads who requested a demo within their first two touches closed at a rate several times higher than leads who never requested one at all. Leads from companies in a specific employee-size range closed at a noticeably higher rate than leads far outside that range in either direction. Leads who visited the pricing page more than twice closed at meaningfully higher rates than those who never visited it.

Each of those patterns becomes a scoring rule: points added for a demo request, points added for falling inside the ideal company-size range, points added for repeated pricing page visits, and correspondingly, points subtracted or withheld for signals that historically correlated with a lead going nowhere, like a personal email domain on a B2B form or no engagement at all in the two weeks following the initial form fill. The specific point values matter less than getting the relative weighting roughly right, since the goal is a usable ranking, not a perfectly calibrated statistical model on day one.

Here's what the resulting scorecard might look like:

| Signal | Points |
|---|---|
| Requested a demo | +30 |
| Company size in ideal range | +15 |
| Visited pricing page 2+ times | +15 |
| Replied to an email | +10 |
| Personal email domain | -10 |
| No engagement 14 days after form | -15 |

(Illustrative points.)

## Make the score change behavior

Once built, the score needs a threshold that actually changes behavior, not just a number sitting quietly in a CRM field nobody looks at. A common approach: leads above a certain score get routed to a sales rep immediately for a same-day call, leads in a middle range get a lighter-touch nurture sequence before a rep gets involved, and leads below a certain floor get left in a long-term nurture flow without immediate sales outreach at all. Without that behavioral trigger attached to the score, the entire model is just an interesting data exercise that changes nothing about how the sales team actually spends its day.

Attach each lead's history when it routes, so the rep knows what the person viewed before the first call.

## Keep it current

Calibration is ongoing, not a one-time build. As a business's product, pricing, or target market shifts, the behaviors and characteristics that used to predict a close can stop predicting it as reliably, and a model built two years ago on old deal data can quietly start misrouting leads without anyone noticing until close rates start slipping for no obvious reason. Revisiting the underlying deal data every six months to a year, and adjusting the scoring rules against fresh data, keeps the model tracking the business as it actually exists rather than as it existed when the model was first built.

## Get sales involved

Sales team buy-in matters as much as the model's accuracy, and it's easy to overlook. A scoring model the sales team doesn't trust simply gets ignored in practice, no matter how carefully it was built, since reps will fall back on their own gut instinct the moment the score contradicts it. Involving sales leaders in setting the rules, rather than handing down a finished score from marketing alone, tends to produce a model people actually use rather than one that quietly gets worked around.

## Test your assumptions

A common mistake worth flagging directly: building a scoring model around what a business assumes should predict a close, rather than what the actual historical data shows. Intuition about an ideal customer profile is a reasonable starting point for a hypothesis, but it should get tested against real closed-deal data before becoming a scoring rule, since gut instinct and actual conversion patterns don't always line up as closely as a sales leader might expect going in.

## The so-what

Start by pulling the last year of closed-won and closed-lost deals from your CRM and looking for the two or three behaviors or characteristics that show up most consistently among the deals that actually closed. That short list, even before a full scoring system gets built around it, is usually enough to start having sales prioritize differently starting this week.
