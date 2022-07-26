import React, { useEffect } from 'react';
import './App.scss';
import { Header, MaxHeightContainer } from 'components';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { AddBandRoute, CreateSetlistRoute, CreateSongRoute, LoginRoute, SetlistRoute, SetlistsRoute, SongRoute, SongsRoute, UserRoute } from 'routes';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const { isLoggedIn, user } = useIdentityContext()

  const hasBands = user?.user_metadata.bandCode?.length > 0

  return (isLoggedIn) ? !hasBands ? <AddBandRoute /> : children : <LoginRoute />
}

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
        header={<Header />}
      >
        <Routes>
        <Route path="/" element={
            <ProtectedRoute>
              <Navigate replace to="/setlists" />
            </ProtectedRoute>
          } />
          <Route path="/user-settings" element={
            <ProtectedRoute>
              <UserRoute />
            </ProtectedRoute>
          } />
          <Route path="/create-setlist" element={
            <ProtectedRoute>
              <CreateSetlistRoute />
            </ProtectedRoute>
          } />
          <Route path="/create-song" element={
            <ProtectedRoute>
              <CreateSongRoute />
            </ProtectedRoute>
          } />
          <Route path="/songs" element={
            <ProtectedRoute>
              <SongsRoute />
            </ProtectedRoute>
          } />
          <Route path="/songs/:songId" element={
            <ProtectedRoute>
              <SongRoute />
            </ProtectedRoute>
          } />
          <Route path="/setlists" element={
            <ProtectedRoute>
              <SetlistsRoute />
            </ProtectedRoute>
          } />
          <Route path="/setlists/:id" element={
            <ProtectedRoute>
              <SetlistRoute />
            </ProtectedRoute>
          } />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;

// TODO 