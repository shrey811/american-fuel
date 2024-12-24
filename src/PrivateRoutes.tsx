import React, { ComponentType, Suspense } from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import { authHeader } from 'modules/authHeader';
import ContentLayout from 'components/ContentLayout/contentLayout';

interface PrivateRouteProps extends Omit<RouteProps, 'component'> {
  component: ComponentType<any>;
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const headers = authHeader();
  const isAuthenticated = 'Authorization' in headers; // Check if 'Authorization' key exists
  // console.log("isAuthenticated", isAuthenticated);

  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> <FallbackLoader /></div>}>
      {isAuthenticated ? <ContentLayout> <Component {...rest} /></ContentLayout> : <Navigate to="/" replace />}
    </Suspense>
  );
};

export default PrivateRoutes;

// import React, { useContext, Suspense } from 'react';
// import { Navigate } from 'react-router-dom';
// import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
// import ContentLayout from 'components/ContentLayout/contentLayout';
// import { LoginContext } from './Context';

// interface PrivateRouteProps {
//   element: React.ReactElement;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
//   const { isLoggedIn } = useContext(LoginContext);

//   return isLoggedIn ? (
//     <Suspense fallback={<FallbackLoader />}>
//       <ContentLayout>{element}</ContentLayout>
//     </Suspense>
//   ) : (
//     <Navigate to="/" replace />
//   );
// };

// export default PrivateRoute;
