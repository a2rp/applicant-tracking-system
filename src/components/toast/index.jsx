import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX, FiXCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const ToastContext = createContext(null);
const iconByType = {
    success: FiCheckCircle,
    info: FiInfo,
    warning: FiAlertTriangle,
    error: FiXCircle,
};

const ToastItem = ({ toast, onDismiss }) => {
    const Icon = iconByType[toast.type] || iconByType.info;

    useEffect(() => {
        const timeout = window.setTimeout(() => onDismiss(toast.id), 4200);
        return () => window.clearTimeout(timeout);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={`${styles.toast} ${styles[toast.type] || styles.info}`}
            role={toast.type === "error" ? "alert" : "status"}
        >
            <Icon aria-hidden="true" className={styles.icon} />
            <span>{toast.message}</span>
            <button
                aria-label="Dismiss notification"
                className={styles.dismiss}
                onClick={() => onDismiss(toast.id)}
                type="button"
            >
                <FiX aria-hidden="true" />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);
    const notify = useCallback((message, type = "success") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((current) => [...current.slice(-3), { id, message, type }]);
        return id;
    }, []);

    return (
        <ToastContext.Provider value={notify}>
            {children}
            <div aria-label="Notifications" className={styles.toastStack}>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} onDismiss={dismiss} toast={toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const notify = useContext(ToastContext);
    if (!notify) throw new Error("useToast must be used inside ToastProvider");
    return notify;
};
