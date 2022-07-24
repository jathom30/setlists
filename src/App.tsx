import React, { useEffect } from 'react';
import './App.scss';
import { MaxHeightContainer } from './components';
import { Route, Routes } from 'react-router-dom';

function App() {
  
  useEffect(() => {
    const handleResize = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div className="App">
      <MaxHeightContainer
        fullHeight
        header={<p>Header</p>}
      >
        <Routes>
          <Route path="/" element={<div>Main</div>} />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;
