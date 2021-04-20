import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import { Link } from "./../util/router.js";
import "./Footer.scss";

function Footer(props) {
  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
      className="footer"
    >
      <Container>
        <div className="FooterComponent__inner">
          <div className="copyright left">
            {props.copyright}<br />

            
          </div>
          <div className="links right">
            <a
              href="https://twitter.com/vaccinenotifs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon">
                <i className="fab fa-twitter" />
              </span>
            </a>
            <Link to="/#faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="social right">
            Made with ❤️ by&nbsp;<a href="https://elixirlabs.org" target="_blank" rel="noopener noreferrer">Elixir Labs</a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Footer;
