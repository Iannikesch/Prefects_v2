---
title: "Conversion Tracking Audits: How to Check Whether Your Numbers Are Even Right"
description: "Broken tags and duplicate conversions quietly distort reports. Learn a 40-minute audit to check your conversion numbers against real orders before trusting a dashboard."
category: "data-analytics"
number: 61
image: "../../assets/insights/061-conversion-tracking-audits-how-to-check-whether-your-numbers-are-even-right.png"
author: "The Profectus Team"
pubDate: 2026-11-19
---

Before anyone argues about which channel is performing best, someone should check whether the numbers are right in the first place. Most businesses skip that step. They open a dashboard, see a conversion count, and treat it as fact, when the count might be inflated by duplicates, deflated by a broken tag, or quietly counting things nobody meant it to count.

## Broken tracking is quiet

Broken tracking rarely announces itself. A site redesign moves a thank-you page and the tag stops firing. A developer adds a second copy of the same tag to fix something unrelated. A checkout change adds a step, and the purchase event now fires one page too early. Each of these produces a number that looks perfectly normal on a dashboard, because the dashboard only reports what it receives. It has no way to know what it didn't.

## Start with a match test

A basic audit starts with the simplest possible test: do the numbers in the ad platform roughly match the numbers in the system where real transactions live? Pull last month's platform-reported conversions and set them next to orders in the store backend, or closed deals in the CRM. Some gap is normal, since platforms count differently and credit conversions across attribution windows. A gap of 5% to 10% is unremarkable. A gap of 60% means something is broken, and it could be broken in either direction.

## Test the tags

Next, test the tags themselves. Free browser extensions from the major platforms (Google's tag assistant and Meta's pixel helper, for example) show which tags fire on which pages. Then walk through the real customer path yourself. Land on the site from an ad, submit a form or complete a purchase, and watch what fires. You're looking for a tag that should fire and doesn't, a tag that fires twice, and a tag that fires on the wrong page. The whole exercise takes about forty minutes and finds problems more often than anyone expects.

## An example

Here's a made-up scenario. A regional dental group sees its cost per booked consultation drop by half over two months and credits a new ad campaign. A tracking audit finds that a website update added a second copy of the booking-confirmation tag, so every consultation was being counted twice. The real cost per consultation hadn't moved at all. The campaign had been given credit it never earned, and a budget increase was about to be approved on a number that was double the truth.

## Clean out test data

Test conversions deserve a look too. Many businesses leave test purchases, internal form submissions, and staff bookings in their data for months. If five people on the team each submitted the contact form to make sure it worked, those five leads count exactly the same as real ones. Filter out internal traffic and flag test records. It's a small habit, but it keeps the numbers honest, and it matters most for businesses with low volume, where five fake leads can distort a whole month.

## Define what counts

Then there's the question of what the conversion actually is. A 'lead' might be a form submission, a phone call of any length, or a tap on a click-to-call button. Those aren't equivalent. A phone call lasting four seconds isn't a lead. Check how each conversion action is defined inside the ad platform and ask whether it matches what the business would call a real opportunity. Ad platforms optimize toward whatever gets counted, so a sloppy definition teaches the algorithm to go find more sloppy leads.

## Watch the handoffs

Cross-domain handoffs cause a lot of quiet damage. If the purchase happens on a separate domain, such as a hosted booking page or a payment processor's checkout, the session can break, and the conversion gets credited to 'direct' or to the checkout provider itself instead of the ad that started the journey. Look at your referral reports for your own payment or booking tools showing up as a traffic source. If they do, the tracking needs a fix that carries the visitor across the gap.

Consent banners are another culprit now. If a cookie banner blocks tags until a visitor accepts, and most visitors decline or ignore it, a portion of real conversions will never be recorded in the browser. That's legitimate, and it's also a reason platform numbers may undercount. Know roughly how much your setup loses, so a steady gap between platform totals and backend totals doesn't come as a surprise.

## Document and repeat

Document what you find. A one-page log listing each conversion event, where it fires, what it's supposed to count, and the date it was last verified turns a one-time audit into something the next person can pick up. Without it, the same investigation gets repeated every time someone new takes over the account.

Re-run the audit on a schedule. Quarterly works for most small and mid-market accounts, plus any time the website, checkout, or CRM changes. Tracking decays. It's not a one-time repair, and it's closer to checking tire pressure than to fixing a flat. Skip it for a year and there's a decent chance something has been quietly wrong for months, with every report in that stretch built on it.

## The so-what

Here's the first thing to do. Pick one conversion action that matters, such as a purchase or a booked appointment, and match last month's platform number against the real count in your backend system. If the two sit within 10% of each other, move on. If they don't, stop reading performance reports until you know why.
