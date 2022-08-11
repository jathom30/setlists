import React, { useEffect } from 'react';
import './App.scss';
import { FlexBox, Header, MaxHeightContainer, RouteWrapper } from 'components';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { AddBandRoute, LoginRoute } from 'routes';
import { useGetBands } from 'hooks';
import { routes } from 'utils';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, user, isConfirmedUser } = useIdentityContext()

  const bandsQuery = useGetBands()
  const hasBands = bandsQuery.data && bandsQuery.data?.length > 0

  return isLoggedIn
    ? !isConfirmedUser
      ? (
        <FlexBox flexDirection='column' gap="1rem" padding='1rem'>
          <h2>Verify your email address</h2>
          <p>A verification email has been sent to {user?.email}. To complete the sign up process, please click the link in the email.</p>
        </FlexBox>
      )
      : (!hasBands && bandsQuery.isSuccess)
        ? <RouteWrapper><AddBandRoute /></RouteWrapper>
        : children
    : <LoginRoute />
}

function App() {
  const { isLoggedIn, isConfirmedUser } = useIdentityContext()

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
        header={(isLoggedIn && isConfirmedUser) && <Header />}
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
                {/* <RouteWrapper> */}
                {route.element}
                {/* </RouteWrapper> */}
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
// ? save settings of auto-gen when going back to prev route
// edit set name when viewing
