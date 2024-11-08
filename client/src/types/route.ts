export interface _Routes {
  path: string;
  element: () => JSX.Element;
}

export interface RouteGuards {
  layout: () => JSX.Element;
  routes: _Routes[];
}
