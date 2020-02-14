import React from "react";
import "./App.css";
import Card from "./Card";

function App() {
  return (
    <div>
      <div className="app-title">
        <h1>Browse All</h1>
      </div>
      <div className="app-header">
        <p>
          Learn new skills and discover the power of Microsoft products with
          step-by-step guidance. Start your journey today by exploring our
          learning paths and modules.
        </p>
      </div>

      <div>
        <Card />
      </div>
    </div>
  );
}

export default App;
