import type { SimulationState } from "./index";

export function saveStateToIndexedDB(state: SimulationState) {
  const req = indexedDB.open('clickerDB', 1);
  req.onupgradeneeded = function(e: any) {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('sim')) {
      db.createObjectStore('sim');
    }
  };
  req.onsuccess = function(e: any) {
    const db = e.target.result;
    const tx = db.transaction('sim', 'readwrite');
    const store = tx.objectStore('sim');
    store.put(state, 'state');
    tx.oncomplete = () => db.close();
  };
}

export function loadStateFromIndexedDB(cb: (s: SimulationState | undefined) => void) {
  const req = indexedDB.open('clickerDB', 1);
  req.onupgradeneeded = function(e: any) {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('sim')) {
      db.createObjectStore('sim');
    }
  };
  req.onsuccess = function(e: any) {
    const db = e.target.result;
    const tx = db.transaction('sim', 'readonly');
    const store = tx.objectStore('sim');
    const getReq = store.get('state');
    getReq.onsuccess = function() {
      cb(getReq.result);
      db.close();
    };
    getReq.onerror = function() {
      cb(undefined);
      db.close();
    };
  };
}
