import React, { useEffect } from 'react';
import './App.scss';
import { Header, MaxHeightContainer, RouteWrapper } from 'components';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { AddBandRoute, CreateSetlistRoute, CreateSongRoute, LoginRoute, SetlistRoute, SetlistsRoute, SongRoute, SongsRoute, UserRoute } from 'routes';

const routes = [
  {
    key: 'user',
    path: "/user-settings",
    element: <UserRoute />
  },
  {
    key: 'create-setlist',
    path: "/create-setlist",
    element: <CreateSetlistRoute />
  },
  {
    key: 'create-song',
    path: "/create-song",
    element: <CreateSongRoute />
  },
  {
    key: 'songs',
    path: "/songs",
    element: <SongsRoute />
  },
  {
    key: 'song',
    path: "/songs/:songId",
    element: <SongRoute />
  },
  {
    key: 'setlists',
    path: "/setlists",
    element: <SetlistsRoute />
  },
  {
    key: 'setlist',
    path: "/setlists/:id",
    element: <SetlistRoute />
  },
]

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
          {routes.map(route => (
            <Route key={route.key} path={route.path} element={
              <ProtectedRoute>
                <RouteWrapper>
                  {route.element}
                </RouteWrapper>
              </ProtectedRoute>
            } />
          ))}
          
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;

// TODO 