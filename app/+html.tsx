import React from "react";
import { ScrollViewStyleReset } from "expo-router/html";

const pwaViewport =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

const baseStyle = `
html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
}
html {
  height: 100%;
}
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

/**
 * Desktop-only phone/device frame around the web app: a bezel with a fake
 * notch and home indicator, so a normal desktop browser tab looks like the
 * app is running on a phone. No-ops on narrow (mobile) viewports since none
 * of these rules apply there, and is explicitly collapsed when running as an
 * installed PWA (display-mode: standalone) since the app already fills the
 * screen natively in that case.
 */
const phoneFrameStyle = `
.mooney-phone-frame__screen {
  display: contents;
}
.mooney-phone-frame__notch,
.mooney-phone-frame__home-indicator {
  display: none;
}

@media (min-width: 768px) {
  html {
    background-color: #d9dee6;
  }

  body {
    position: static !important;
    height: auto !important;
    min-height: 100dvh;
    overflow: auto !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: radial-gradient(circle at 50% -10%, #eef1f5, #c7ced8);
  }

  #mooney-phone-frame {
    position: relative;
    flex-shrink: 0;
    width: 390px;
    height: 844px;
    max-height: calc(100dvh - 96px);
    background: #111318;
    border-radius: 56px;
    padding: 14px;
    box-shadow:
      0 40px 80px -20px rgba(15, 18, 25, 0.5),
      0 0 0 2px rgba(255, 255, 255, 0.06) inset;
  }

  #mooney-phone-frame #root {
    height: 100% !important;
  }

  .mooney-phone-frame__screen {
    display: flex !important;
    width: 100%;
    height: 100%;
    border-radius: 42px;
    overflow: hidden;
    background: #000;
  }

  .mooney-phone-frame__notch {
    display: block;
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 126px;
    height: 26px;
    background: #111318;
    border-radius: 0 0 16px 16px;
    z-index: 2;
  }

  .mooney-phone-frame__home-indicator {
    display: block;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.35);
    z-index: 2;
  }
}

@media (display-mode: standalone) {
  html {
    background-color: transparent;
  }

  body {
    position: fixed !important;
    height: 100dvh !important;
    overflow: hidden !important;
    display: block !important;
    padding: 0 !important;
    background: transparent !important;
  }

  #mooney-phone-frame {
    all: unset;
    display: contents;
  }

  #mooney-phone-frame #root {
    height: 100dvh !important;
  }

  .mooney-phone-frame__screen {
    display: contents !important;
  }

  .mooney-phone-frame__notch,
  .mooney-phone-frame__home-indicator {
    display: none !important;
  }
}
`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content={pwaViewport} />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Our Companion" />

        {/* App icons (manifest = Android/desktop install + icons;
            apple-touch-icon = iOS home screen; icon = browser tab) */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: baseStyle }} />
        <style dangerouslySetInnerHTML={{ __html: phoneFrameStyle }} />
      </head>
      <body>
        <div id="mooney-phone-frame">
          <div className="mooney-phone-frame__notch" aria-hidden="true" />
          <div className="mooney-phone-frame__screen">{children}</div>
          <div className="mooney-phone-frame__home-indicator" aria-hidden="true" />
        </div>
      </body>
    </html>
  );
}
