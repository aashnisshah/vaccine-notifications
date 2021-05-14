import React, {useState, useEffect} from "react";
import "./../styles/global.scss";
import NavbarCustom from "./../components/NavbarCustom";
import IndexPage from "./index";
import DashboardPage from "./dashboard";
import TosPage from "./tos";
import PasswordReset from './PasswordReset';
import PostsPage from "./posts";
import PrivacyPage from "./privacy";
import PreviousAlertsPage from "./previousAlerts";
import AuthPage from "./auth";
import { Switch, Route, Router } from "./../util/router.js";
import FirebaseActionPage from "./firebase-action.js";
import NotFoundPage from "./not-found.js";
import Footer from "./../components/Footer";
import "./../util/analytics.js";
import { AuthProvider } from "./../util/auth.js";
import logo from "./../images/VNLogo.png";

function App(props) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }
  }, [])

    return (
        <AuthProvider>
            <Router>
                <>
                    <NavbarCustom
                        bg="white"
                        variant="light"
                        expand="md"
                        logo={logo}
                    />

                    <Switch>
                        <Route exact path="/" component={IndexPage} />

                        {/* <Route exact path="/contact" component={ContactPage} /> */}

                        <Route
                            exact
                            path="/dashboard"
                            component={DashboardPage}
                        />

                        <Route exact path="/alerts" component={PreviousAlertsPage} />

                        <Route exact path="/resetpass" component={PasswordReset} />

                        <Route exact path="/posts" component={PostsPage} />

                        <Route exact path="/privacy" component={PrivacyPage} />

                        <Route exact path="/tos" component={TosPage} />

                        <Route exact path="/auth/:type" component={AuthPage} />

                        <Route
                            exact
                            path="/firebase-action"
                            component={FirebaseActionPage}
                        />

                        <Route component={NotFoundPage} />
                    </Switch>

                  {!isMobile && (
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
                  )}   
                </>
            </Router>
        </AuthProvider>
    );
}

export default App;
