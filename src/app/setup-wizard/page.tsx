'use client';

import React from 'react';
import { SmartSetupWizard } from '@/components/SmartSetupWizard';

export default function SetupWizardPage() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">JALAMITRA Farm Setup Wizard</h1>
        <p className="text-xs text-slate-600">Answer 9 simple questions to configure your farm parameters automatically.</p>
      </div>
      <SmartSetupWizard />
    </div>
  );
}
