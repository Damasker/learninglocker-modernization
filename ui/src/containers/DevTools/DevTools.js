// @ll-compat-audit: ok 2026-08-01
import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-H"
    changePositionKey="ctrl-Q">
    <LogMonitor />
  </DockMonitor>
);
