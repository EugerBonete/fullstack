import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script defer src="../path/to/flowbite/dist/flowbite.min.js"></script>
      </body>
    </Html>
  );
}
