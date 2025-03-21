import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Aside from "../components/aside/aside";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>Spotify Profile</title>
            <link rel="shortcut icon" href="/spotify.svg" />
          </Head>
          <div className="flex flex-col-reverse md:flex-row h-[-webkit-fill-available]">
            <Aside />
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
