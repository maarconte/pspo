export interface AlertProps {
  children?: React.ReactNode;
  classes?: string;
  color?: 'error' | 'info' | 'success' | 'warning' | string;
  severity?: 'error' | 'info' | 'success' | 'warning' | string;
  variant?: 'filled' | 'outlined' | 'standard' | string;
}
