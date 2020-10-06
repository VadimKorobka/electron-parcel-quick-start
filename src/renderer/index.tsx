import * as React from "react";
import ReactDOM from "react-dom";
import resolver from "../services/resolver";

const App = () => {
  const sendIpcEvent = React.useCallback(() => {
    resolver.ipcRenderer.send("click");
  }, []);

  return (
    <div>
      <h1>Electron + React + TypeScript + Parcel</h1>
      <button onClick={sendIpcEvent}>Click me and look at the terminal</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
