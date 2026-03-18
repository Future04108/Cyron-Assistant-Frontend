declare module 'react-alert' {
  import * as React from 'react';

  export type AlertType = 'info' | 'success' | 'error';

  export interface AlertOptions {
    timeout?: number;
    type?: AlertType;
    onOpen?: () => void;
    onClose?: () => void;
  }

  export interface AlertComponentProps {
    options: AlertOptions;
    message: React.ReactNode;
    close: () => void;
  }

  export interface AlertComponentPropsWithStyle extends AlertComponentProps {
    style: React.CSSProperties;
  }

  export interface AlertInstance {
    show: (message: React.ReactNode, options?: AlertOptions) => void;
    success: (message: React.ReactNode, options?: AlertOptions) => void;
    error: (message: React.ReactNode, options?: AlertOptions) => void;
    info: (message: React.ReactNode, options?: AlertOptions) => void;
    remove: (alert: any) => void;
    removeAll: () => void;
  }

  export const positions: Record<string, string>;

  export const Provider: React.ComponentType<
    React.PropsWithChildren<{
      template: React.ComponentType<any>;
      timeout?: number;
      position?: string;
      offset?: string | number;
      containerStyle?: React.CSSProperties;
      transition?: any;
    }>
  >;

  export function useAlert(): AlertInstance;
}

