import React from 'react';

import Link from '@/components/Link';
import MetricsContentLoader from '@/components/Metrics/MetricsContentLoader';

export default function MetricCard({ header, link, metric, isCurrency }) {
  const [mounted, setMounted] = React.useState(false);

  // When mounted on client, now we can show the UI
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='w-full rounded-lg border-2 border-border-primary p-4 dark:border-border-primary-dark'>
      <Link aria-label={header} href={link}>
        {header}
      </Link>
      <p className='mt-2 text-3xl font-bold'>
        {metric > 0 && isCurrency && '$'}
        {metric > 0 ? metric.toLocaleString() : <MetricsContentLoader />}
      </p>
    </div>
  );
}
