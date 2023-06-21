import React from "react";
import Head from "next/head";

import type { AppProps } from "next/app";
import Layout from "~/components/Layout";

import "../styles/globals.css";
import CosmosProvider from "~/providers/CosmosProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                refetchOnWindowFocus: false,
              },
            },
          })
        }
      >
        <CosmosProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster position="bottom-center" reverseOrder={false} />
        </CosmosProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
