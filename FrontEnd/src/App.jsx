import React, { useState } from 'react'
import MapView from './pages/MapView'
import Home from './pages/Home'
import PageLoader from './components/PageLoader'

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <PageLoader onLoadComplete={() => setIsLoading(false)} />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}>
        <Home />
      </div>
    </>
  )
}

export default App