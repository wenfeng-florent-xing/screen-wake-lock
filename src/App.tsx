import { invoke } from "@tauri-apps/api";
import { useEffect, useRef, useState } from "react";
import { onEventShowMenu } from "tauri-plugin-context-menu";
import "./App.css";
function App() {
  const [active, setActive] = useState(true);
  const [_, setStatus] = useState<string | undefined>();
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

  useEffect(() => {
    onEventShowMenu('contextmenu', {
        // pos: { ...},
        items: [
          {
            label: "Exit",
            disabled: false,
            shortcut: "ctrl+M",
            event: async () => {
              console.log("clicked")
              await invoke("exit_command")
            }
          }
        ]
      })
  }, [])

  return (
    <div data-tauri-drag-region className={`container ${active ? 'lock' : 'unlock'}`}>
      <p data-tauri-drag-region>Wakelock</p>
      <button onClick={() => setActive(prev => !prev)}>{active ? "deactivate" : "activate"}</button>
    </div>
  );
}

export default App;
