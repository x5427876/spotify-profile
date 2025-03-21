import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Aside from "../components/aside/aside";
import BlockUI from "../components/blockUI";
import { LoadingProvider, useLoading } from "../lib/context/loadingContext";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function AppContent({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const router = useRouter();
  const { setIsLoading, isLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router, setIsLoading]);

  return (
    <>
      <Head>
        <title>Spotify Profile</title>
        <link rel="shortcut icon" href="/spotify.svg" />
      </Head>
      <div className="flex h-full flex-col-reverse md:flex-row">
        <Aside />
        <Component {...pageProps} />
      </div>
      <BlockUI isOpen={isLoading} />
    </>
  );
}

export default function MyApp(props: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <AppContent {...props} />
        </LoadingProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
