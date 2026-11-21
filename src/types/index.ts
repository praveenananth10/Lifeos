/**
 * LifeOS Core Types & Data Contracts
 */

export * from './lifeos';

export type Theme = 'light' | 'dark';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferredTheme: Theme;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'backlog' | 'todo' | 'in_progress' | 'done' | 'archived';

export interface MetricStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}
