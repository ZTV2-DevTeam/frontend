export interface SystemMessage {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  messageType: 'user' | 'developer' | 'operator' | 'support';
  showFrom: string; // ISO date string
  showTo: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_active: boolean;
}

export interface SystemMessageSchema {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  messageType: 'user' | 'developer' | 'operator' | 'support';
  showFrom: string;
  showTo: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SystemMessageCreateSchema {
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'error';
  messageType?: 'user' | 'developer' | 'operator' | 'support';
  showFrom: string; // ISO datetime string
  showTo: string; // ISO datetime string
}

export interface SystemMessageUpdateSchema {
  title?: string;
  message?: string;
  severity?: 'info' | 'warning' | 'error';
  messageType?: 'user' | 'developer' | 'operator' | 'support';
  showFrom?: string;
  showTo?: string;
}

export interface DismissedSystemMessage {
  messageId: number;
  dismissedAt: string; // ISO date string
}

export interface SystemMessageDisplayProps {
  message: SystemMessage;
  onDismiss: (messageId: number) => void;
  isDismissed: boolean;
}

export interface SystemMessagesContainerProps {
  className?: string;
  maxMessages?: number;
  severityFilter?: 'info' | 'warning' | 'error';
  messageTypeFilter?: 'user' | 'developer' | 'operator' | 'support';
}