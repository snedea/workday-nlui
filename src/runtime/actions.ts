// src/runtime/actions.ts
// Minimal UI glue for template interactions
// Provides event bus for demo interactions without business logic

export type ActionPayload = Record<string, any>;
type Handler = (payload?: ActionPayload) => void;

const handlers = new Map<string, Handler>();

export function on(action: string, fn: Handler) {
  handlers.set(action, fn);
}

export function off(action: string) {
  handlers.delete(action);
}

export function emit(action: string, payload?: ActionPayload) {
  const handler = handlers.get(action);
  if (handler) {
    handler(payload);
  } else {
    console.warn(`No handler registered for action: ${action}`);
  }
}

// Utility to show toast notifications
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  // Create and show a toast notification
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
    'bg-blue-600'
  }`;
  toast.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      ${message}
    </div>
  `;

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}