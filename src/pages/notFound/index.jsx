import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section className={styles.notFound}>
        <span className={styles.code}>404</span>
        <h1>This page is not in the pipeline</h1>
        <p>The link may be old, or the page may have moved.</p>
        <Link to="/">
            <FiArrowLeft aria-hidden="true" />
            Back to overview
        </Link>
    </section>
);

export default NotFoundPage;
