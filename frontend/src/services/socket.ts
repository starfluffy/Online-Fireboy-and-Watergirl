type SocketListener = (...args: unknown[]) => void;

class MemorySocket {
  private listeners = new Map<string, Set<SocketListener>>();

  on(event: string, listener: SocketListener) {
    const current = this.listeners.get(event) ?? new Set<SocketListener>();
    current.add(listener);
    this.listeners.set(event, current);
  }

  once(event: string, listener: SocketListener) {
    const wrapper: SocketListener = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  off(event: string, listener?: SocketListener) {
    if (!listener) {
      this.listeners.delete(event);
      return;
    }

    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, ...args: unknown[]) {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

export const socket = new MemorySocket();