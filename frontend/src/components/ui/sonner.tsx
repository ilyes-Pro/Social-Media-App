import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-border': '0',

          '--success-bg': '#ffffff',
          '--success-text': '#4ade80',
          '--success-border': 'none',
          '--error-bg': ' var(--color-bg)',
          '--error-text': '#f87171',
          '--error-border': '0',
          '--warning-bg': '#facc15',
          '--warning-text': '#000000',
          '--info-bg': '#60a5fa',
          '--info-text': '#ffffff',
          '--border-radius': '0.5rem',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
