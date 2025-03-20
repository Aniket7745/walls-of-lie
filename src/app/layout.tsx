// app/layout.tsx
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "./globals.css"; // your Tailwind or global styles

export const metadata = {
  title: "My App",
  description: "Awesome Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
