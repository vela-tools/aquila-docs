---
title: Roadmap
sidebar_position: 6
description: "What comes next for Aquila, in the short term and in the long term"
keywords: ["roadmap", "alert history", "email", "SMS", "webhooks"]
---

# Roadmap

This is the current plan. Its order and scope may change.

## Short term

Most of the short-term work depends on a new Aquila backend. The browser keeps reading subscriptions, types and entities directly from the broker, and the backend takes over writing Aquila's subscriptions and delivering alerts.

- Alert history works for every subscription. The backend receives the standard NGSI-LD notifications and stores each one.
- Brokers are set up once, in the backend, instead of in every browser. Creating, editing and deleting subscriptions all go through the backend, and Aquila marks the subscriptions it made on the broker.
- Alerts can go out by email or SMS, carry notification headers, or go to webhooks that need authentication. The broker can still call the notification URI itself, or the backend can receive the notification and deliver it. A notification about several entities goes out as a single message that lists them.
- You can remove a value from a subscription. The backend does it by rebuilding the subscription on the broker.
- Subscriptions that were deleted, changed or added directly on the broker show up in the list, along with expired ones, and Aquila offers to recreate them.
- Tenants can be set per broker.
- Aquila handles the backend being down.
- Aquila and the backend get container images and a Compose file to run them together, so they can be deployed where only the brokers can reach the notification endpoint.

Logins are not part of this. Anyone who can open Aquila will still see and edit every subscription.

## Long term

- Better handling of subscriptions created outside Aquila: a marker for settings Aquila doesn't show, and read-only display of geographic areas other than a circle.
- `temporalQ` and `datasetId` in the editor.
- Linked entities (`join`), if Scorpio supports them.
- `id` and `idPattern` entity selectors in the editor.
- OR groups in the condition builder. Text mode already accepts any query.
- MQTT endpoints.
- Context source subscriptions.
- Server-side paging for the subscription list.
- Logins and owners.
- Accessibility: keyboard access to the geographic region editor and the delete confirmation, including inside the subscription editor; an error message on every invalid field rather than just a red border; buttons named after the subscription they act on; and automated accessibility checks on every change.
