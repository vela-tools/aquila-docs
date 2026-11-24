---
title: Entity explorer
sidebar_position: 4
description: "Browsing the entity types, entities and attributes on a broker, and starting a subscription from an attribute"
keywords: ["entity explorer", "entity types", "attributes", "NGSI-LD entities"]
---

# Entity explorer

The **Entity explorer** tab shows what is on the selected broker: its entity types, the entities of each type, and their attributes. Use it to find the type and attribute names a subscription needs, in the short form the broker's @context gives them.

![The entity explorer, with the entity types, the entities of AirQualityObserved, and the attributes of one entity](../assets/entity-explorer.png)

Picking an attribute opens the [subscription editor](subscription-editor.md) with that type and attribute already filled in. This is the quickest way to start a subscription on data you can see.

The explorer only reads. It does not change entities.
