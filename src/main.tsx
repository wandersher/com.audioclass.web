import { createRoot } from "react-dom/client";

import "./main.css";
import "./libs/firebase";

import { App, ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";
import Router from "./Router";
import { FirebaseProvider } from "./libs/firebase";
import { FirestoreProvider } from "./libs/firestore";

const theme = {
  token: {},
  components: {
    Layout: {},
    Menu: {
      colorBgContainer: "transparent",
    },
  },
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider theme={theme}>
    <App>
      <FirebaseProvider>
        <FirestoreProvider>
          <HashRouter basename="/">
            <Router />
          </HashRouter>
        </FirestoreProvider>
      </FirebaseProvider>
    </App>
  </ConfigProvider>
);
