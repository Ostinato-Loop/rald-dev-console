// RALD Dev Console — auth state store (localStorage-backed)
// LILCKY STUDIO LIMITED

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  role?: string;
  rald_internal_id?: string;
  trust_level?: string;
}

interface State {
  token: string | null;
  user: AuthUser | null;
}

const KEY_TOKEN = "rald_dev_token";
const KEY_USER  = "rald_dev_user";

let _state: State = {
  token: localStorage.getItem(KEY_TOKEN),
  user: (() => {
    try { return JSON.parse(localStorage.getItem(KEY_USER) ?? "null"); }
    catch { return null; }
  })(),
};

const _listeners: Array<() => void> = [];

export function getState(): State { return _state; }

export function setState(patch: Partial<State>) {
  _state = { ..._state, ...patch };
  if (patch.token !== undefined) {
    if (patch.token) localStorage.setItem(KEY_TOKEN, patch.token);
    else localStorage.removeItem(KEY_TOKEN);
  }
  if (patch.user !== undefined) {
    if (patch.user) localStorage.setItem(KEY_USER, JSON.stringify(patch.user));
    else localStorage.removeItem(KEY_USER);
  }
  _listeners.forEach((fn) => fn());
}

export function clearAuth() {
  setState({ token: null, user: null });
}

export function subscribe(fn: () => void): () => void {
  _listeners.push(fn);
  return () => {
    const idx = _listeners.indexOf(fn);
    if (idx > -1) _listeners.splice(idx, 1);
  };
}
