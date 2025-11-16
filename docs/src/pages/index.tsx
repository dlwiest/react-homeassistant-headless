import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const features = [
  {
    title: 'Flexible API',
    icon: '🪝',
    description: 'Choose render props for full control or hooks for direct access. Both patterns work seamlessly.',
  },
  {
    title: 'Lightweight & Performant',
    icon: '⚡',
    description: 'Built for speed and efficiency. Smart subscription management means you can build complex dashboards without worrying about performance.',
  },
  {
    title: 'Headless Design',
    icon: '🎨',
    description: 'Completely unstyled components. Build exactly the interface you want with full design control.',
  },
  {
    title: 'Real-time Updates',
    icon: '🔌',
    description: 'Automatic WebSocket connection management. Entity states update without having to manage polling.',
  },
  {
    title: 'Built-in State Management',
    icon: '📦',
    description: 'No Redux or Context needed. Automatic state synchronization and WebSocket management out of the box.',
  },
  {
    title: 'Simple Service Calls',
    icon: '🛠️',
    description: 'Clean API for turning on lights, calling scripts, and triggering any Home Assistant service.',
  },
];

const additionalFeatures = [
  {
    title: 'Component Library',
    description: 'Light, Switch, MediaPlayer, Climate, and more built-in components.',
  },
  {
    title: 'Fully Typed',
    description: 'Complete type definitions for all entities and their properties.',
  },
  {
    title: 'Auth Just Works',
    description: 'OAuth 2.0 and long-lived token support with auto-detection.',
  },
];

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            The React toolkit for Home Assistant UIs
          </Heading>
          <p className={styles.heroSubtitle}>
            A headless React library providing hooks for Home Assistant entities, services, and real-time state. 
            Build custom dashboards and interfaces without the hassle of WebSockets or HASS service calls.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.primaryButton} to="/docs/intro">
              Get Started
            </Link>
            <Link className={styles.secondaryButton} to="/docs/entities/light">
              Browse Entities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Build better interfaces
        </Heading>
        <p className={styles.sectionSubtitle}>
          Everything you need to create custom Home Assistant dashboards
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <Heading as="h3" className={styles.featureTitle}>
                {feature.title}
              </Heading>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeSection() {
  return (
    <section className={styles.codeSection}>
      <div className="container">
        <div className={styles.codeLayout}>
          <div className={styles.codeExample}>
            <pre className={styles.codeBlock}>
              <code>{`// Render props
<Light entityId="light.floor_lamp">
  {({ isOn, toggle }) => (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Light>

// Or hooks
const light = useLight('light.floor_lamp')
<button onClick={light.toggle}>
  {light.isOn ? 'ON' : 'OFF'}
</button>`}</code>
            </pre>
          </div>
          <div className={styles.codeFeatures}>
            <Heading as="h2" className={styles.sectionTitle}>
              Choose your style
            </Heading>
            <p className={styles.sectionSubtitle}>
              Use render props for full control or hooks for direct access
            </p>
            <div className={styles.additionalFeatures}>
              {additionalFeatures.map((feature, idx) => (
                <div key={idx} className={styles.additionalFeature}>
                  <Heading as="h3" className={styles.additionalFeatureTitle}>
                    {feature.title}
                  </Heading>
                  <p className={styles.additionalFeatureDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to build?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Start creating custom Home Assistant interfaces today
          </p>
          <div className={styles.ctaButtons}>
            <Link className={styles.primaryButton} to="/docs/intro">
              Get Started
            </Link>
            <Link
              className={styles.secondaryButton}
              to="/docs/entities/light">
              Browse Entities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Build Home Assistant apps with pure React"
      description="A lightweight hook and headless component library that abstracts WebSockets, state management, and service calls for Home Assistant">
      <HeroSection />
      <main>
        <WhySection />
        <CodeSection />
        <CTASection />
      </main>
    </Layout>
  );
}
