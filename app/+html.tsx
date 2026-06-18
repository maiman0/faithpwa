import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS here is the most reliable way to handle the viewport issues in PWA/Mobile Safari */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  height: 100%;
}
html {
  height: 100%;
}
/*
 * body and #root MUST be the same height. The browser's URL/search bar shrinks
 * the dynamic viewport (dvh < lvh); if body used the large viewport (inset: 0)
 * while #root used dvh, the body background showed through as a band by the
 * search bar. Pinning both to dvh removes that whitespace/bg. Standalone
 * (home-screen) has no URL bar, so dvh == lvh and nothing changes there.
 */
body {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
}
#root {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}
/* iOS Safari fallback — keep body and #root matched there too. */
@supports (-webkit-touch-callout: none) {
  body,
  #root {
    height: -webkit-fill-available;
  }
}
`;
