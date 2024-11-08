import { Routes, Route, useLocation } from "react-router-dom";
import NotFoundPage from "./components/404";
import nprogress from "nprogress";
import { useEffect } from "react";
import { AuthRoutes, PrivateRoutes, PublicRoutes } from "./route";
import { _Routes } from "./types/route";

export default function App() {
  let location = useLocation();

  useEffect(() => {
    nprogress.start();
    nprogress.done();
  }, [location.pathname]);
  return (
    <Routes>
      <Route element={<PublicRoutes.layout />}>
        {PublicRoutes.routes.map((item: _Routes) => (
          <Route key={item.path} path={item.path} element={<item.element />} />
        ))}
      </Route>
      <Route element={<AuthRoutes.layout />}>
        {AuthRoutes.routes.map((item: _Routes) => (
          <Route key={item.path} path={item.path} element={<item.element />} />
        ))}
      </Route>
      <Route element={<PrivateRoutes.layout />}>
        {PrivateRoutes.routes.map((item: _Routes) => (
          <Route key={item.path} path={item.path} element={<item.element />} />
        ))}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
