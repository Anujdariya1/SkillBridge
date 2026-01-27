import { useEffect, useState } from "react";
import { getHealth } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHealth()
      .then(data => setMessage(data.status))
      .catch(() => setMessage("Backend not reachable"));
  }, []);

  return (
    <div>
      <h1>SkillBridge</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
