---
title: Known limitations
sidebar_position: 5
description: "What this beta does not do yet: no logins, Scorpio only, no alert history for new subscriptions, and the subscription settings it cannot change"
keywords: ["known limitations", "beta", "Scorpio", "security"]
---

# Known limitations

Aquila is in beta and has not been independently audited. This page lists what this release does not do yet, so you can plan around it. The missing logins and the broker behaviour below are not vulnerabilities in Aquila: access control is the job of the broker and of the proxy in front of it.

:::danger[No logins]

Aquila has no logins of its own. Anyone who can open it can see and change every subscription on the brokers it reaches. Do not expose Aquila, or the brokers it uses, on a network you do not trust without an authenticating proxy in front of both.

:::

:::warning[Tested against Scorpio only]

Aquila has been tested against the Scorpio broker only. Scorpio cannot make some of the edits the NGSI-LD specification allows, and Aquila blocks those edits for every broker. [Broker compatibility](reference/broker-compatibility.md) lists them.

:::

## Subscriptions

**A field cannot be removed from an existing subscription.** Once a subscription has a description, a query, watched attributes or another optional value, the value can be changed but not emptied. Delete the subscription and create it again.

**Notifications can only be sent to a URL.** You can't add custom headers to notifications, send them by email or SMS, or deliver them over MQTT. The broker sends each notification as JSON to the notification URI, and that's all you can configure.

**Alert history doesn't include new subscriptions.** The **Alert history** tab only shows alerts recorded by the notification service used with earlier versions of Aquila. To see what a subscription sends, point it at a receiver you control.

**Subscriptions created outside Aquila are shown in part.** A geographic area other than a circle is shown as no geo filter, and setting a circle replaces it. Settings Aquila does not map, such as `temporalQ` and `datasetId`, are kept on the broker when you edit the subscription, but not shown.

**The list is read in full.** Aquila reads every subscription on the broker at once. There is no server-side paging, so a broker with a very large number of subscriptions takes longer to list.

## What comes next

The [roadmap](roadmap.md) says which of these are planned, short term or long term.
