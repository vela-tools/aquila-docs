import type { ReactNode } from 'react';
import Heading from '@theme/Heading';

import site from '@site/project.json';
import styles from './styles.module.css';

// Open-core projects only: set landing.editions in project.json to null and
// the section disappears.
export default function HomepageEditions(): ReactNode {
  const editions: string | null = site.landing.editions;
  if (!editions) return null;
  return (
    <section className={styles.editions}>
      <div className="container">
        <Heading as="h2" className={styles.title}>
          Editions
        </Heading>
        <p className={styles.body}>{editions}</p>
      </div>
    </section>
  );
}
