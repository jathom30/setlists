import React, { MouseEvent, useEffect } from 'react';
import './App.scss';
import { Button, Header, MaxHeightContainer } from 'components';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { BandRoute, LoginRoute, UserRoute } from 'routes';
import { useQuery } from '@tanstack/react-query';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const { isLoggedIn } = useIdentityContext()
  // const location = useLocation()

  // if (location.hash.includes('recovery_token')) {
  //   return (
  //     <AccountRecoveryRoute />
  //   )
  // }

  return (isLoggedIn) ? children : <LoginRoute />
}

function App() {
  // const {logoutUser, user} = useIdentityContext()
  // const navigate = useNavigate()

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

  // const logoutUserQuery = useQuery(
  //   ['logout', user?.email],
  //   logoutUser,
  //   {
  //     enabled: false,
  //     retry: false,
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //     onSettled: () => {
  //       navigate('/')
  //     }
  //   }
  // )

  // const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   logoutUserQuery.refetch()
  // }

  return (
    <div className="App">
      <MaxHeightContainer
        fullHeight
        header={<Header />}
      >
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Link to="band-settings">Band Settings</Link>
            </ProtectedRoute>
          } />
          <Route path="/band-settings" element={
            <ProtectedRoute>
              <BandRoute />
            </ProtectedRoute>
          } />
          <Route path="/user-settings" element={
            <ProtectedRoute>
              <UserRoute />
            </ProtectedRoute>
          } />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;
