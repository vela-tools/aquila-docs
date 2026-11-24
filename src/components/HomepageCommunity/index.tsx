import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import site from '@site/project.json';
import styles from './styles.module.css';

const { project } = site;
const repoUrl = `https://github.com/vela-tools/${project.slug}`;

const links = [
  {
    label: 'Issues',
    href: `${repoUrl}/issues`,
    note: 'Bug reports and feature requests.',
  },
  {
    label: 'Discussions',
    href: `${repoUrl}/discussions`,
    note: 'Questions and documentation feedback.',
  },
  {
    label: 'Newsletter',
    href: 'https://velacontext.com/newsletter',
    note: 'Release notes and project news.',
  },
  {
    label: 'Security policy',
    href: `${repoUrl}/security/policy`,
    note: 'How to report a vulnerability privately.',
  },
];

export default function HomepageCommunity(): ReactNode {
  return (
    <section className={styles.community}>
      <div className="container">
        <Heading as="h2" className={styles.title}>
          Community
        </Heading>
        <p className={styles.lead}>
          {project.name} is not accepting external source-code contributions
          yet. Bug reports, feature requests, and documentation feedback are
          welcome.
        </p>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <Link className="home-card" href={link.href}>
                <span className="home-card__label">{link.label}</span>
                <span className="home-card__body">{link.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.contact}>
          General contact:{' '}
          <Link href="mailto:info@senlab.io">info@senlab.io</Link>. Never report
          a security vulnerability through a public issue. Follow the{' '}
          <Link href={`${repoUrl}/security/policy`}>security policy</Link>{' '}
          instead.
        </p>
      </div>
    </section>
  );
}
