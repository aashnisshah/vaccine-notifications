import React from "react";
import "./../styles/global.scss";
import NavbarCustom from "./../components/NavbarCustom";
import IndexPage from "./index";
import ContactPage from "./contact";
import DashboardPage from "./dashboard";
import SettingsPage from "./settings";
import AuthPage from "./auth";
import { Switch, Route, Router } from "./../util/router.js";
import FirebaseActionPage from "./firebase-action.js";
import NotFoundPage from "./not-found.js";
import Footer from "./../components/Footer";
import "./../util/analytics.js";
import { AuthProvider } from "./../util/auth.js";

function App(props) {
  return (
    <AuthProvider>
      <Router>
        <>
          <NavbarCustom
            bg="white"
            variant="light"
            expand="md"
            logo="https://uploads.divjoy.com/logo.svg"
          />

          <Switch>
            <Route exact path="/" component={IndexPage} />

            <Route exact path="/contact" component={ContactPage} />

            <Route exact path="/dashboard" component={DashboardPage} />

            <Route exact path="/settings/:section" component={SettingsPage} />

            <Route exact path="/auth/:type" component={AuthPage} />

            <Route
              exact
              path="/firebase-action"
              component={FirebaseActionPage}
            />

            <Route component={NotFoundPage} />
          </Switch>

          <Footer
            bg="light"
            textColor="dark"
            size="sm"
            bgImage=""
            bgImageOpacity={1}
            description="Notify you when vaccine appointments are available in your area"
            copyright="© 2021 Vaccine Notifications"
            logo="https://uploads.divjoy.com/logo.svg"
          />
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;