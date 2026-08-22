"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          background: "#0b0b12",
          color: "#f4f4f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>The app failed to load. Please try again.</p>
          <button onClick={() => reset()}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
