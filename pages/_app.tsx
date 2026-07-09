import type { AppProps } from "next/app";
import CrtThemeController from "../src/components/CrtThemeController";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <CrtThemeController />
    </>
  );
}

export default MyApp;