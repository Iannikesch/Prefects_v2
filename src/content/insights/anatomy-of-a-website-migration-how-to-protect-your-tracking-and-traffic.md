---
title: "Anatomy of a Website Migration: How to Protect Your Tracking and Traffic"
description: "A redesign or platform change can wipe out search traffic and break tracking. Learn the baseline, redirect map, tag inventory and launch checks that prevent it."
category: "campaign-playbooks"
number: 99
image: "../../assets/insights/099-anatomy-of-a-website-migration-how-to-protect-your-tracking-and-traffic.png"
author: "The Profectus Team"
pubDate: 2026-11-17
---

A website redesign or platform change feels like a creative project, with new layouts, new photography, and a fresh look. It's also one of the riskiest moments in a business's marketing. Done carelessly, a migration can wipe out search traffic, break conversion tracking, and disconnect forms from the CRM, often all at once and sometimes without anyone noticing for weeks.

## A creative project with real risk

The risk comes from how much a website quietly does. It holds years of search rankings tied to specific URLs. It carries tracking tags that feed analytics and ad platforms. It connects forms to email systems and CRMs. Each of those connections is invisible when it works and costly when it breaks. A migration plan needs to account for all of them, not just the pages people can see.

## Baseline and redirects

Start with a baseline. Before anything changes, record organic traffic by page, top keyword rankings, conversion counts and rates, page speed, and a list of every tracking tag and integration. Export it. This is the benchmark the new site will be measured against, and it's the only way to tell afterward whether the migration helped, hurt, or did nothing.

Next, map the URLs. Every old page that has traffic, rankings, or links pointing to it needs a destination on the new site, and the old URL needs to redirect to it with a permanent (301) redirect. A spreadsheet with old URL, new URL, and notes is the core document of the project. Skipping it is the single most common cause of traffic loss after a migration.

## An example

Take an example with made-up numbers. A regional retailer moving to a new ecommerce platform. The new site launches with fresh URLs, and nobody builds a redirect map for the 340 old product and category pages. Within a month, organic traffic is down 38%, and several top-ranking pages return error messages to people clicking from search results. The fix, building the redirect map after the fact, takes two weeks and recovers most of the loss over the following two months, but those months of missed sales can't be recovered.

## Tags, forms and integrations

Inventory the tracking. List every tag, pixel, and script on the old site: analytics, ad platform conversions, call tracking, heatmaps, chat tools. Decide which ones belong on the new site and verify each is installed and firing. Pay special attention to conversion events, since a new checkout or form can change the page or event the tag depends on.

Test forms and integrations before launch. Submit every form on the staging site and confirm that the data lands in the CRM, the email platform, and any notification inbox. A form that looks perfect and silently sends data nowhere is a typical migration casualty, and it can go unnoticed until someone asks why leads dried up.

## Launch carefully

Resist changing everything at once. A migration that also rewrites every page, restructures the site's navigation, and changes URLs makes it nearly impossible to tell which change caused a drop in traffic. Where possible, keep URLs and core content stable during the move, and make big content changes in a separate phase afterward.

Choose the launch timing carefully. Avoid peak season, major promotions, and the days before a long holiday when no one will be around to fix problems. A quiet midweek launch, with the team available for the following days, gives the best chance of catching and fixing issues quickly.

Use a staging environment and keep it out of search results. A test copy of the new site that gets indexed by search engines can create duplicate-content confusion. Make sure it's blocked from indexing, and make sure that block is removed on the live site at launch. Leaving a 'noindex' instruction on the live site is a classic and avoidable disaster.

## Monitor and keep a way back

After launch, monitor closely. For the first two weeks, check daily: traffic against the baseline, errors reported in search console tools, conversion counts, form submissions, and page speed. Some fluctuation in search rankings after a migration is normal even when it's done well, so look for patterns and sharp drops, not small wiggles.

Keep the old site's data accessible. Back up the old site and its analytics before decommissioning. Historical performance may be needed for comparisons, and old content may need to be retrieved. Storage is cheap, and rebuilding lost history isn't possible.

Plan for rollback. Know before launch how the team would restore the old site if something catastrophic happened, and who has the authority to call it. Most migrations never need it, but having the option written down turns a panic into a procedure, and it makes launch day considerably less stressful.

Check the new site's speed and mobile experience before launch, not after. Migrations often introduce heavier pages, new scripts, or layouts that behave differently on phones, which hurts both conversions and ad costs. A pre-launch pass with the same tools used on the old site makes the comparison fair.

## The so-what

If a redesign or platform change is on the calendar, create a migration checklist now with these sections: baseline data, URL redirect map, tag inventory, form tests, launch date, and post-launch monitoring plan. Share it with whoever is building the site and ask them to confirm each item in writing before launch.
