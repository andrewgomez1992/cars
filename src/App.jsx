import { useState } from "react";
import PortfolioScene from "./scenes/PortfolioScene";
import { Overlay } from "./components/Overlay";

const App = () => {
  const [zone, setZone] = useState(null);

  return (
    <>
      <PortfolioScene onEnterZone={setZone} onLeaveZone={() => setZone(null)} />
      {zone && <Overlay type={zone} onClose={() => setZone(null)} />}
    </>
  );
};

export default App;
