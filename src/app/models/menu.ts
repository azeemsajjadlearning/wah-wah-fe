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

export interface SideMenu {
  _id: string;
  id: string;
  title: string;
  type: string;
  icon: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AllPermission {
  _id: string;
  users: string[];
  menu: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
