import "@/main.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WishlistProvider } from "@/contexts/WishlistContext";

export const metadata = {
  title: "Galactica",
  description: "Your space travel agency",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="inter">
        <WishlistProvider>
          <Navbar />
          {children}
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}
