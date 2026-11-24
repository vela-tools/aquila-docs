---
title: Broker compatibility
sidebar_position: 2
description: "Where Scorpio differs from the NGSI-LD specification, and how Aquila handles each difference"
keywords: ["Scorpio", "broker compatibility", "NGSI-LD", "subscription update"]
---

# Broker compatibility

Aquila has been tested against Scorpio only, using the `scorpiobroker/all-in-one-runner` image that the Compose file in the repository runs. Scorpio cannot make some of the edits the NGSI-LD specification allows, and when it rejects a change it often stores part of it anyway. A subscription left half-changed may stop notifying without any sign in the list.

So Aquila blocks those edits, for every broker, and says why in the editor. It does not send a change that would fail or silently break the subscription.

## Edits Aquila blocks

| You try to | What Aquila does | Why |
| --- | --- | --- |
| Empty a field the subscription already has: description, query, scope query, watched attributes, expiry, throttling or triggers | **Save** refuses, with "This broker can't remove the … from an existing subscription. Delete the subscription and create it again." | Scorpio stores the literal `urn:ngsi-ld:null` as the value, which for a query matches nothing, or rejects the change |
| Switch between "on change" and "every N seconds" | The switch is disabled when editing | Scorpio rejects the change but writes it anyway, leaving a subscription that never notifies |
| Change the language | Read-only when editing | Scorpio rejects any change that contains it, and drops the rest of the change |
| Change the JSON-LD context of notifications | Read-only when editing. Shows Scorpio's own copy, a URL under `/ngsi-ld/v1/jsonldContexts/` | Scorpio stores its own copy and rejects changes |
| Use linked entities (`join`) | Disabled | Scorpio rejects any subscription with it |
| Change the types of a subscription that also selects entities by id | The types are locked | Aquila cannot edit id selectors yet, and changing the types would delete them |
| Set a minimum time between notifications | Allowed, with "This broker doesn't apply throttling." | Scorpio stores it but ignores it |

## When the broker rejects a change

If the broker rejects a change Aquila did send, Aquila reads the subscription again and says "The broker rejected the change, but may have applied part of it. The list shows what it has now." The editor continues from what the broker has, so you are never editing a version that no longer exists.

## Other differences

- An expired subscription keeps `status: active` on Scorpio, so Aquila never shows a subscription as expired.
- Notifications in key-values format carry `"@context": [null]` on each entity.
