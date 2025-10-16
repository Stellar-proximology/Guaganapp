import { useState } from 'react';
import SmartBrowser from './components/SmartBrowser';
import './App.css';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <SmartBrowser />
    </div>
  );
}

export default App;
