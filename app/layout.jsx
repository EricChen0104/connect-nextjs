import "@styles/globals.css";
import Nav from "@components/Nav";
import Logo from "@components/Logo";

import Provider from "@components/Provider";

export const metadata = {
  title: "Connect social media",
  description: "free to post any thing on it",
};

const RootLayout = ({ children }) => {
  return (
    <html>
      <body className="bg-cyan-300">
        <Provider>
          <main className="">
            <Logo />

            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
