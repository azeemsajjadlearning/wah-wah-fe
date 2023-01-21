import { IsActiveMatchOptions } from '@angular/router';

export interface MenuItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type: 'basic' | 'collapsable';
  hidden?: (item: MenuItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  externalLink?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  exactMatch?: boolean;
  isActiveMatchOptions?: IsActiveMatchOptions;
  function?: (item: MenuItem) => void;
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  icon?: string;
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: MenuItem[];
  meta?: any;
}
