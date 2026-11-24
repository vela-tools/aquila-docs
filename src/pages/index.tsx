import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageSovereignty from '@site/src/components/HomepageSovereignty';
import HomepageEditions from '@site/src/components/HomepageEditions';
import HomepageCommunity from '@site/src/components/HomepageCommunity';
import site from '@site/project.json';

import styles from './index.module.css';

const { project, landing } = site;

// The status notice is plain text with at most one Markdown-style link, such
// as "Open beta. Read the [known limitations](/docs/known-limitations) first."
function Notice({ text }: { text: string }) {
  const match = text.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/s);
  return (
    <p className={styles.heroNotice}>
      {match ? (
        <>
          {match[1]}
          <Link className={styles.heroLeadLink} to={match[3]}>
            {match[2]}
          </Link>
          {match[4]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

// The bold lead and the tagline below it mirror the two-line header of the
// project README. The tagline lives in siteConfig because it also serves as
// the site's meta description.
function Hero() {
  const { siteConfig } = useDocusaurusContext();
  const notice: string | null = landing.notice;
  return (
    <header className={clsx('hero', styles.hero)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroLead}>{project.headline}</p>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        {/* Optional: a project-specific illustration goes here, between the
            tagline and the buttons, as a component under src/components. */}
        <div className={styles.heroButtons}>
          <Link
            className={clsx('button button--lg', styles.heroButtonPrimary)}
            to="/docs/getting-started">
            Get started
          </Link>
          <Link
            className={clsx('button button--lg', styles.heroButtonSecondary)}
            to="/docs/">
            Read the docs
          </Link>
        </div>
        {notice && <Notice text={notice} />}
      </div>
    </header>
  );
}

function Banner() {
  return (
    <div className={styles.banner}>
      <img
        src={useBaseUrl('/img/vela-banner.svg')}
        alt={landing.bannerAlt}
        width={7000}
        height={2400}
        loading="lazy"
      />
      <p className={styles.scope}>
        <Link href="https://ngsi-ld.org/">NGSI-LD</Link> is the linked-data
        model used by many smart-city, IoT, and dataspace platforms across
        Europe. {landing.scope}
      </p>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    // The Layout title becomes "<title> | <name>". The name alone is
    // ambiguous in a search result, so the page leads with what it is.
    <Layout
      title={`Open-source ${project.kind}`}
      description={siteConfig.tagline}>
      <Hero />
      <main>
        <Banner />
        <HomepageSovereignty />
        <HomepageEditions />
        <HomepageCommunity />
      </main>
    </Layout>
  );
}
