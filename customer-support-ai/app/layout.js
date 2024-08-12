import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
          <title>AI Assistant</title>
          <meta name='AI Assistant' content='Track C' />
        </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
