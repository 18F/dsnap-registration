import React from 'react';
import { Trans } from 'react-i18next';
import LockIcon from 'components/icons/lock';

const SecurityAlert = () => (
  <div className="bg-accent-warm-lighter tablet:grid-col-6 padding-2 margin-y-3">
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-1 margin-top-05">
          <LockIcon />
        </div>
        <div className="grid-col-11 text-base">
          <Trans i18nKey="general.security">
            This information is kept confidential and secure as required by law. <a href="https://google.com">Learn more</a>
          </Trans>
        </div>
      </div>
    </div>
  </div>
);

export default SecurityAlert;
