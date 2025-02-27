import { useEffect, useState, useRef } from "react";
import "./App.css";
import { DymiumLiveTable } from "./components/DymiumTable";
import { Card, Container, Row } from "react-bootstrap";

enum Tab {
  Home = "home",
  Deployments = "deployments",
  Logs = "logs",
}

function App() {
  const [tab, setTab] = useState<Tab>(Tab.Logs);

  return (
    <>
      <main>
        <Card className="w-75 mx-auto">
          <Card.Header className="text-start">Example Interface</Card.Header>

          <Card.Body className="container-fluid">
            <div className="d-flex flex-row small text-secondary">
              <div
                onClick={() => setTab(Tab.Home)}
                className={`${
                  tab === Tab.Home
                    ? "small border-start border-top border-end rounded-top"
                    : ""
                } px-4 py-2 dymium-tab`}
              >
                Home
              </div>
              <div
                onClick={() => setTab(Tab.Deployments)}
                className={`${
                  tab === Tab.Deployments
                    ? "small border-start border-top border-end rounded-top"
                    : ""
                } px-4 py-2 dymium-tab`}
              >
                Deployments
              </div>
              <div
                onClick={() => setTab(Tab.Logs)}
                className={`${
                  tab === Tab.Logs
                    ? "small border-start border-top border-end rounded-top"
                    : ""
                } px-4 py-2 dymium-tab`}
              >
                Logs
              </div>
            </div>
            <hr className="text-secondary w-100 my-0" />
            {tab === Tab.Logs ? (
              <DymiumLiveTable sseUrl="http://localhost:5000/events" />
            ) : (
              <p className="p-4">Under construction...</p>
            )}
          </Card.Body>
        </Card>
      </main>
    </>
  );
}

export default App;
