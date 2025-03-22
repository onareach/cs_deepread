import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "CS DeepRead",
  description: "Upload, search, and manage book text",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
