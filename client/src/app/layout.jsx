import "@/index.css";
import Providers from "./providers.jsx";
import RouteAwareLayout from "./_components/RouteAwareLayout.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nestify - Find Your Next Chapter",
  description: "Property Rental & Booking Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" data-theme="nestify">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect" href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <RouteAwareLayout>{children}</RouteAwareLayout>
        </Providers>
      </body>
    </html>
  );
}
