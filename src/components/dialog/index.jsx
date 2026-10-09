import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Dialog = ({ title, description, children, onClose, initialFocusRef, size = "medium" }) => {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const previousFocus = document.activeElement;
        const panel = panelRef.current;
        const firstFocusTarget = initialFocusRef?.current || panel?.querySelector(
            "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]",
        );

        firstFocusTarget?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeRef.current();
            }

            if (event.key !== "Tab" || !panel) return;
            const focusable = Array.from(panel.querySelectorAll(
                "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]",
            ));
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previousFocus?.focus?.();
        };
    }, [initialFocusRef]);

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className={[styles.dialog, styles[size]].join(" ")}
                ref={panelRef}
                role="dialog"
            >
                <header className={styles.dialogHeader}>
                    <div>
                        <h2 id={titleId}>{title}</h2>
                        {description && <p id={descriptionId}>{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button">
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <div className={styles.dialogBody}>{children}</div>
            </section>
        </div>
    );
};

export default Dialog;
