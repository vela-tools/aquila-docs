import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import site from '@site/project.json';
import styles from './styles.module.css';

const { sovereignty } = site.landing;

// Condensed from the Sovereignty section of the project README. The third
// point is the same in every project.
const points = [
  {
    label: 'An EU open standard',
    body: sovereignty.standard,
  },
  {
    label: sovereignty.configLabel,
    body: sovereignty.config,
  },
  {
    label: 'Your machines',
    body: 'The FOSS edition runs under the EUPL-1.2 with no account, no licence key, and no telemetry.',
  },
];

export default function HomepageSovereignty(): ReactNode {
  return (
    <section className={styles.sovereignty}>
      <div className="container">
        <Heading as="h2" className={styles.title}>
          Sovereignty
        </Heading>
        <p className={styles.lead}>{sovereignty.lead}</p>

        <div className={styles.points}>
          {points.map((point) => (
            <div key={point.label} className="home-card">
              <h3 className="home-card__label">{point.label}</h3>
              <p className="home-card__body">{point.body}</p>
            </div>
          ))}
        </div>

        <p className={styles.more}>
          SenLab's full position on ownership, export, and reversibility is at{' '}
          <Link href="https://velacontext.com/sovereignty">
            velacontext.com/sovereignty
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
