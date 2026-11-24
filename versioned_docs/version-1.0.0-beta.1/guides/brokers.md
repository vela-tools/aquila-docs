---
title: Brokers
sidebar_position: 1
description: "Adding, selecting and removing the NGSI-LD brokers Aquila works with, and what the connection status means"
keywords: ["broker", "context broker", "NGSI-LD", "@context", "connection status"]
---

# Brokers

Aquila works with one broker at a time. The broker button in the header shows the selected broker and its connection status, and opens the list of brokers, where you pick another one or add, edit and remove brokers.

## Adding a broker

A broker has three settings:

| Setting | Purpose |
| --- | --- |
| Name | How the broker is shown in the header and the list |
| NGSI-LD URL | The broker's NGSI-LD API, for example `https://broker.example.com/ngsi-ld/v1` |
| @context URL | Optional. The JSON-LD context Aquila uses for the names of types and attributes on this broker |

The URL is used by your browser, so it has to be an address your machine can reach, and the broker has to allow Aquila's origin in its CORS settings. [Deployment](../deployment.md#what-the-broker-needs) has the details.

Set an @context URL when the broker's data uses a context of its own, such as a Smart Data Models context, so that types and attributes appear under the short names that context gives them. The broker the container configures uses the NGSI-LD core context.

## Where the list is kept

The list of brokers is stored in your browser. It is not shared with other people using the same Aquila, and it does not follow you to another browser or machine.

While no brokers are saved in the browser, the list holds one broker, the one the container is configured with. [Deployment](../deployment.md#configuration) describes the two environment variables that set it. Once the browser has saved its own list, a later change to the container's configuration no longer affects it.

## Connection status

The status in the header shows whether the selected broker answers. A broker that answers with something Aquila cannot read is still shown as connected, and the error is in the status tooltip.
