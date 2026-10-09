import { FaCoffee, FaCodepen, FaFacebookF, FaGithub, FaLinkedinIn, FaPatreon, FaYoutube } from "react-icons/fa";
import { FiGlobe, FiLifeBuoy, FiMail } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const footerLinks = [
    { label: "Portfolio", detail: "ashishranjan.net", tooltip: "Visit my portfolio", href: "https://www.ashishranjan.net", icon: <FiGlobe aria-hidden="true" /> },
    { label: "GitHub", detail: "github.com/a2rp", tooltip: "View my GitHub profile", href: "https://github.com/a2rp", icon: <FaGithub aria-hidden="true" /> },
    { label: "CodePen", detail: "codepen.io/ash1198", tooltip: "Explore my CodePen projects", href: "https://codepen.io/ash1198", icon: <FaCodepen aria-hidden="true" /> },
    { label: "LinkedIn", detail: "linkedin.com/in/aashishranjan", tooltip: "Connect on LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: <FaLinkedinIn aria-hidden="true" /> },
    { label: "Facebook", detail: "facebook.com/theash.ashish", tooltip: "Visit Facebook profile", href: "https://www.facebook.com/theash.ashish/", icon: <FaFacebookF aria-hidden="true" /> },
    { label: "YouTube", detail: "youtube.com/@ashishranjan-ashz", tooltip: "Visit YouTube channel", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: <FaYoutube aria-hidden="true" /> },
    { label: "Email", detail: "ash.ranjan09@gmail.com", tooltip: "Send an email", href: "mailto:ash.ranjan09@gmail.com", icon: <FiMail aria-hidden="true" /> },
    { label: "Support", detail: "a2rp-donation-page.netlify.app", tooltip: "Support my work", href: "https://a2rp-donation-page.netlify.app/", icon: <FiLifeBuoy aria-hidden="true" /> },
    { label: "Buy Me a Coffee", detail: "buymeacoffee.com/ashishranjan", tooltip: "Buy me a coffee", href: "https://buymeacoffee.com/ashishranjan", icon: <FaCoffee aria-hidden="true" /> },
    { label: "Patreon", detail: "patreon.com/ashishranjan", tooltip: "Support on Patreon", href: "https://www.patreon.com/ashishranjan", icon: <FaPatreon aria-hidden="true" /> },
    { label: "Source code", detail: "github.com/a2rp/applicant-tracking-system", tooltip: "View this project's source code", href: "https://github.com/a2rp/applicant-tracking-system", icon: <FaGithub aria-hidden="true" /> },
];

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.inner}>
            <div className={styles.identity}>
                <Link aria-label="Hirly home" className={styles.brand} to="/">
                    <img alt="" src={import.meta.env.BASE_URL + "logo.png"} />
                    <span>hirly<span className={styles.brandDot}>.</span></span>
                </Link>
                <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp">Ashish Ranjan</a>. All rights reserved.</p>
            </div>
            <nav aria-label="Footer links" className={styles.links}>
                {footerLinks.map((item) => (
                    <a
                        aria-label={item.tooltip}
                        data-tooltip-content={item.label}
                        data-tooltip-detail={item.detail}
                        data-tooltip-id="footer-links-tooltip"
                        data-tooltip-label={item.label}
                        href={item.href}
                        key={item.label}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                    >
                        {item.icon}
                    </a>
                ))}
                <Tooltip
                    arrowSize={7}
                    border="1px solid rgb(255 255 255 / 14%)"
                    className={styles.tooltip}
                    classNameArrow={styles.tooltipArrow}
                    id="footer-links-tooltip"
                    offset={8}
                    opacity={1}
                    place="top"
                    render={({ activeAnchor }) => (
                        <div className={styles.tooltipContent}>
                            <strong>{activeAnchor?.getAttribute("data-tooltip-label")}</strong>
                            <span>{activeAnchor?.getAttribute("data-tooltip-detail")}</span>
                        </div>
                    )}
                />
            </nav>
        </div>
    </footer>
);

export default Footer;
