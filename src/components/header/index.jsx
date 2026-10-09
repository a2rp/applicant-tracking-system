import { useEffect, useRef, useState } from "react";
import {
    FiBriefcase,
    FiGitBranch,
    FiGrid,
    FiLayers,
    FiMenu,
    FiPlus,
    FiSearch,
    FiUsers,
    FiX,
} from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const navigationLinks = [
    {
        label: "Overview",
        to: "/",
        icon: <FiGrid aria-hidden="true" />,
        end: true,
    },
    {
        label: "Candidates",
        to: "/candidates",
        icon: <FiUsers aria-hidden="true" />,
    },
    { label: "Jobs", to: "/jobs", icon: <FiBriefcase aria-hidden="true" /> },
    {
        label: "Pipeline",
        to: "/pipeline",
        icon: <FiLayers aria-hidden="true" />,
    },
];

const pageNames = {
    "/": "Overview",
    "/candidates": "Candidates",
    "/jobs": "Jobs",
    "/pipeline": "Pipeline",
};

const Header = ({ candidateCount = 0 }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const sidebarRef = useRef(null);
    const headerRef = useRef(null);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!menuOpen) return undefined;
        const closeIfOutside = (event) => {
            if (
                !sidebarRef.current?.contains(event.target) &&
                !headerRef.current?.contains(event.target)
            )
                setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeIfOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeIfOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    useEffect(() => {
        const focusSearch = (event) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", focusSearch);
        return () => document.removeEventListener("keydown", focusSearch);
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        const search = searchValue.trim();
        if (search)
            navigate("/candidates?search=" + encodeURIComponent(search));
    };

    return (
        <>
            <aside
                aria-label="Workspace navigation"
                className={menuOpen ? styles.sidebarOpen : styles.sidebar}
                id="workspace-navigation"
                ref={sidebarRef}
            >
                <NavLink
                    aria-label="Hirly overview"
                    className={styles.brand}
                    end
                    onClick={() => setMenuOpen(false)}
                    to="/"
                >
                    <span aria-hidden="true" className={styles.brandMark}>
                        <FiGitBranch />
                    </span>
                    <span className={styles.brandName}>
                        hirly<span>.</span>
                    </span>
                </NavLink>
                <div className={styles.sectionLabel}>WORKSPACE</div>
                <nav aria-label="Main navigation" className={styles.navigation}>
                    {navigationLinks.map((item) => (
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? styles.activeLink : styles.navLink
                            }
                            end={item.end}
                            key={item.to}
                            onClick={() => setMenuOpen(false)}
                            to={item.to}
                        >
                            <span aria-hidden="true" className={styles.navIcon}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {item.label === "Candidates" && (
                                <span className={styles.navCount}>
                                    {candidateCount}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.sidebarBottom}>
                    <div className={styles.planCard}>
                        <span className={styles.planIcon}>
                            <FiLayers aria-hidden="true" />
                        </span>
                        <div>
                            <strong>Hiring plan</strong>
                            <span>Q4 team growth</span>
                        </div>
                    </div>
                    <div className={styles.account}>
                        <span
                            aria-hidden="true"
                            className={styles.accountAvatar}
                        >
                            OC
                        </span>
                        <span className={styles.accountText}>
                            <strong>Olivia Chen</strong>
                            <span>Workspace admin</span>
                        </span>
                    </div>
                </div>
            </aside>

            {menuOpen && (
                <button
                    aria-label="Close navigation"
                    className={styles.backdrop}
                    onClick={() => setMenuOpen(false)}
                    type="button"
                />
            )}

            <header
                className={styles.topbar}
                ref={headerRef}
            >
                <div className={styles.topbarInner}>
                    <button
                        aria-controls="workspace-navigation"
                        aria-expanded={menuOpen}
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        className={styles.menuButton}
                        onClick={() => setMenuOpen((open) => !open)}
                        type="button"
                    >
                        {menuOpen ? (
                            <FiX aria-hidden="true" />
                        ) : (
                            <FiMenu aria-hidden="true" />
                        )}
                    </button>
                    <div aria-live="polite" className={styles.breadcrumb}>
                        <span>Workspace</span>
                        <span aria-hidden="true">/</span>
                        <strong>
                            {pageNames[location.pathname] || "Workspace"}
                        </strong>
                    </div>
                    <form
                        className={styles.search}
                        onSubmit={handleSearch}
                        role="search"
                    >
                        <FiSearch aria-hidden="true" />
                        <input
                            aria-label="Search candidates"
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            placeholder="Search candidates"
                            ref={searchRef}
                            type="search"
                            value={searchValue}
                        />
                        <kbd>Ctrl K</kbd>
                    </form>
                    <NavLink
                        aria-label="New candidate"
                        className={styles.quickAdd}
                        onClick={() => setMenuOpen(false)}
                        to="/candidates?add=1"
                    >
                        <FiPlus aria-hidden="true" />
                        <span>New candidate</span>
                    </NavLink>
                    <a
                        aria-label="Repository on GitHub"
                        className={styles.repositoryLink}
                        href="https://github.com/a2rp/applicant-tracking-system"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <FaGithub aria-hidden="true" />
                        <span>Repository</span>
                    </a>
                </div>
            </header>
        </>
    );
};

export default Header;
