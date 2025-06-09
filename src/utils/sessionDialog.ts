// This file was created while vibing the dialog application and is not used at the moment.
export interface DialogMessage {
  type: string;
  payload?: any;
  id?: string;
}

interface SessionDialogOptions {
  scope?: string[];
  width?: number;
  height?: number;
  onReady?: () => void;
  onMessage?: (message: DialogMessage) => void;
  onClose?: () => void;
}

export class SessionDialogManager {
  private window: Window | null = null;
  private messageHandlers: Map<string, (message: DialogMessage) => void> = new Map();
  private options: SessionDialogOptions;

  constructor(options: SessionDialogOptions = {}) {
    this.options = {
      width: 600,
      height: 800,
      ...options
    };
  }

  open(): Promise<Window> {
    return new Promise((resolve, reject) => {
      if (this.window && !this.window.closed) {
        this.window.focus();
        resolve(this.window);
        return;
      }

      const { width, height } = this.options;
      const left = (screen.width - width!) / 2;
      const top = (screen.height - height!) / 2;

      const features = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'scrollbars=yes',
        'resizable=yes',
        'menubar=no',
        'toolbar=no',
        'location=no',
        'status=no'
      ].join(',');

      this.window = window.open('/session-dialog', 'sessionDialog', features);

      if (!this.window) {
        reject(new Error('Failed to open dialog window. Please check if popup blocker is enabled.'));
        return;
      }

      // Set up message listener
      const messageListener = (event: MessageEvent<DialogMessage>) => {
        if (event.source !== this.window) return;

        const { type, payload, id } = event.data;

        switch (type) {
          case 'DIALOG_READY':
            // Dialog is ready, set initial scope if provided
            if (this.options.scope) {
              this.sendMessage({
                type: 'SET_SCOPE',
                payload: { scope: this.options.scope },
                id: this.generateId()
              });
            }
            this.options.onReady?.();
            resolve(this.window!);
            break;

          case 'DIALOG_CLOSING':
            this.cleanup();
            this.options.onClose?.();
            break;

          default:
            // Handle custom messages
            if (id && this.messageHandlers.has(id)) {
              this.messageHandlers.get(id)!(event.data);
              this.messageHandlers.delete(id);
            }
            this.options.onMessage?.(event.data);
        }
      };

      window.addEventListener('message', messageListener);

      // Handle window close detection
      const checkClosed = setInterval(() => {
        if (this.window?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          this.cleanup();
          this.options.onClose?.();
        }
      }, 1000);

      // Store cleanup function
      this.cleanup = () => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        this.window = null;
        this.messageHandlers.clear();
      };
    });
  }

  sendMessage(message: DialogMessage): Promise<DialogMessage> {
    return new Promise((resolve, reject) => {
      if (!this.window || this.window.closed) {
        reject(new Error('Dialog window is not open'));
        return;
      }

      const id = message.id || this.generateId();
      const messageWithId = { ...message, id };

      // Set up response handler if this is a request that expects a response
      if (!message.id) {
        this.messageHandlers.set(id, resolve);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (this.messageHandlers.has(id)) {
            this.messageHandlers.delete(id);
            reject(new Error('Message timeout'));
          }
        }, 10000);
      }

      this.window.postMessage(messageWithId, '*');

      // If message already has an id, it's a response, resolve immediately
      if (message.id) {
        resolve(messageWithId);
      }
    });
  }

  async setScope(scope: string[]): Promise<void> {
    await this.sendMessage({
      type: 'SET_SCOPE',
      payload: { scope }
    });
  }

  async ping(): Promise<number> {
    const response = await this.sendMessage({
      type: 'PING'
    });
    return response.payload?.timestamp || Date.now();
  }

  close(): void {
    if (this.window && !this.window.closed) {
      this.window.close();
    }
    this.cleanup();
  }

  private cleanup = () => {
    // Will be overridden in open()
  };

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Convenience function for simple usage
export function openSessionDialog(options: SessionDialogOptions = {}): Promise<SessionDialogManager> {
  const manager = new SessionDialogManager(options);
  return manager.open().then(() => manager);
}