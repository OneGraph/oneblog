// @flow

import config from '../config';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (config.gaTrackingId && window.gtag) {
    window.gtag('config', config.gaTrackingId, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
  nonInteraction,
}: {
  action: string,
  category?: ?string,
  label?: ?string,
  value?: ?(string | number),
  nonInteraction?: ?boolean,
}) => {
  if (config.gaTrackingId && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: nonInteraction,
    });
  }
};
