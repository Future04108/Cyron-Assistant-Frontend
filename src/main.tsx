import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// @ts-expect-error react-alert ships without TS types in this repo
import { positions, Provider as AlertProvider } from 'react-alert';
import App from './App';
import './styles/index.css';
import { AuthProvider } from './hooks/useAuth';
import { AppProvider } from './context/AppContext';
import { AlertTemplate } from './components/alerts/AlertTemplate';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AlertProvider
          template={AlertTemplate}
          position={positions.TOP_RIGHT}
          timeout={6000}
          offset="16px"
        >
          <AppProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AppProvider>
        </AlertProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

