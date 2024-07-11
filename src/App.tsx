import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<string | undefined>();
  const lock = useRef<WakeLockSentinel | undefined>();

  useEffect(() => {
    const getLock = async () => {
      if (active) {
        if (lock.current === undefined) {
          try {
            lock.current = await navigator.wakeLock.request('screen');
          } catch (e) {
            setStatus("the lock can not be gotten because of " + e);
          }
        }
      } else {
        lock.current?.release().then(() => lock.current = undefined);
      }
    }

    getLock();

    return () => {
      lock.current?.release().then(() => lock.current = undefined);
    }

  }, [active])

  return (
    <div data-tauri-drag-region className={`container ${active ? 'lock' : 'unlock'}`}>
      <p data-tauri-drag-region>Wakelock</p>
      <button onClick={() => setActive(prev => !prev)}>{active ? "active" : "desactive"}</button>
    </div>
  );
}

export default App;
