import { useEffect, useState, useRef } from "react";
import "./App.css";
import { GenericItem, DummyLog } from "./dymiumTypes";
import { DymiumTableView } from "./components/DymiumTable";

function App() {
  const [logs, setLogs] = useState<DummyLog[]>([]);
  const sseRef = useRef<EventSource>(null);

  useEffect(() => {
    sseRef.current = new EventSource("http://localhost:5000/events");

    sseRef.current.onopen = (e) => {
      console.log("open", e);
    };

    sseRef.current.onmessage = (e: MessageEvent<string>) => {
      console.log(JSON.parse(e.data));

      const messageData: DummyLog = JSON.parse(e.data);
      setLogs((prevLogs) => [messageData, ...prevLogs]);
    };

    return () => sseRef.current?.close();
  }, []);

  return (
    <>
      <main>
        <DymiumTableView data={logs} />
      </main>
    </>
  );
}

export default App;
