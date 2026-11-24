import type { ReactNode } from 'react';

import styles from './styles.module.css';

type Kind = 'aquila' | 'external';

type Area = 'browser' | 'image' | 'broker' | 'endpoint';

interface Party {
  area: Area;
  kind: Kind;
  name: string;
  caption: string;
}

// The shape of an Aquila deployment, drawn like the Libra threat model's: the
// browser runs Aquila and calls the broker, the broker calls the notification
// URI, and the browser loads Aquila itself from the container image. Aquila's
// own parts carry the brand edge; the broker and the notification URI, which
// Aquila uses but does not run, are dashed.
const parties: Party[] = [
  {
    area: 'browser',
    kind: 'aquila',
    name: 'Aquila, in the browser',
    caption: 'Reads and writes subscriptions. Keeps the list of brokers.',
  },
  {
    area: 'image',
    kind: 'aquila',
    name: 'Aquila container',
    caption: 'Serves the app and /config.json. Holds no data.',
  },
  {
    area: 'broker',
    kind: 'external',
    name: 'Context broker',
    caption: 'Stores the subscriptions and checks every change against them.',
  },
  {
    area: 'endpoint',
    kind: 'external',
    name: 'Notification URI',
    caption: 'Receives a notification when an entity matches.',
  },
];

type Arrow = 'toBroker' | 'toEndpoint' | 'toImage';

const arrows: Arrow[] = ['toBroker', 'toEndpoint', 'toImage'];

export default function DeploymentShape(): ReactNode {
  return (
    <figure
      className={styles.shape}
      aria-label="The browser loads Aquila from its container and calls the context broker. The broker sends notifications to the notification URI of each subscription.">
      {parties.map((party) => (
        <div
          key={party.area}
          className={`${styles.node} ${styles[party.kind]} ${styles[party.area]}`}>
          <span className={styles.name}>{party.name}</span>
          <span className={styles.caption}>{party.caption}</span>
        </div>
      ))}
      {arrows.map((arrow) => (
        <span
          key={arrow}
          aria-hidden="true"
          className={`${styles.arrow} ${styles[arrow]}`}
        />
      ))}
    </figure>
  );
}
