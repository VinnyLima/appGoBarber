import React from 'react';

import { AuthProvider } from './auth';

const AppProvidfer: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvidfer;
