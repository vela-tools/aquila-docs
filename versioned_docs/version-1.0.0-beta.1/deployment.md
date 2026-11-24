---
title: Deployment
sidebar_position: 2
description: "The container image, verifying it, its configuration, and what the broker and the network need"
keywords: ["container image", "GHCR", "Docker", "cosign", "configuration", "CORS", "content security policy"]
---

# Deployment

Aquila ships as a container image, `ghcr.io/vela-tools/aquila`. The image serves the built application with nginx, as an unprivileged user, on port 2361. There is no backend to run beside it and no database to provision: everything Aquila stores lives either on the broker or in the browser. [How Aquila works](index.mdx#how-aquila-works) shows how the parts connect.

## Run the image

```bash
docker run -p 2361:2361 \
  -e AQUILA_BROKER_URL=https://broker.example.com/ngsi-ld/v1 \
  -e AQUILA_BROKER_NAME="My broker" \
  ghcr.io/vela-tools/aquila:latest
```

The image has a health check that requests the application from inside the container.

## Verify the image

Every image is signed and carries a build provenance attestation. Verify both before running it:

```bash
cosign verify ghcr.io/vela-tools/aquila:latest \
  --certificate-identity-regexp '^https://github.com/vela-tools/aquila/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
gh attestation verify oci://ghcr.io/vela-tools/aquila:latest --repo vela-tools/aquila
```

## Configuration

The image reads two environment variables when the container starts:

| Variable | Default | Purpose |
| --- | --- | --- |
| `AQUILA_BROKER_URL` | `http://localhost:9090/ngsi-ld/v1` | The NGSI-LD API of the broker selected on first load, as the browser reaches it |
| `AQUILA_BROKER_NAME` | `Local broker` | The name shown for that broker |

The container writes them to `/config.json`, which the application loads when it opens. Changing them needs a restart of the container, not a new image.

They set only the first broker. Once a browser has saved a list of brokers, it uses that list and no longer reads the configuration. Users add, edit and remove brokers in the application, as [Brokers](guides/brokers.md) describes.

The broker URL is used by the browser, not by the container. It has to be an address the people using Aquila can reach from their machines.

## What the broker needs

**CORS.** Aquila calls the broker from the browser, so the broker has to allow Aquila's origin, the scheme, host and port Aquila is opened from, in its CORS settings. Without it, the browser blocks every response from the broker, and Aquila cannot use it. The broker also has to expose the `Link` and `NGSILD-Results-Count` response headers, which carry the JSON-LD context of an answer and the number of matching entities. Otherwise the browser hides them from Aquila. Scorpio takes these settings as environment variables:

```sh
QUARKUS_HTTP_CORS_ENABLED=true
QUARKUS_HTTP_CORS_ORIGINS=https://aquila.example.com
QUARKUS_HTTP_CORS_EXPOSED_HEADERS=Link,NGSILD-Results-Count
```

**A reachable notification URI.** The broker sends each notification itself, so the notification URI of a subscription has to be reachable from the broker. An address that works from your browser may not work from the broker. Inside a Docker network, for example, `localhost` is the broker's own container.

**NGSI-LD v1.9.1.** Aquila writes subscriptions as ETSI GS CIM 009 v1.9.1 defines them. It has been tested against Scorpio only. Where Scorpio differs from the specification, Aquila blocks the edits it would apply incorrectly, for every broker. [Broker compatibility](reference/broker-compatibility.md) lists them.

## Network and access

:::danger[Aquila has no logins]

Anyone who can open Aquila can see and change every subscription on the brokers it reaches. Do not expose Aquila, or the brokers it uses, on a network you do not trust without an authenticating proxy in front of both.

:::

The image sets a content security policy that lets Aquila load scripts, styles, fonts and images only from itself. Network requests, on the other hand, are allowed to any `http` or `https` address, since users can add any broker they like.

## Browsers

Aquila supports current versions of Chrome, Edge, Firefox and Safari.
