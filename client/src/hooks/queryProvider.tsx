import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export function ReactQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
