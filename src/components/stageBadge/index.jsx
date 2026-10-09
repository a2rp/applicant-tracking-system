import styles from "./styles.module.css";

const StageBadge = ({ stage }) => {
    const stageClass = styles[stage.toLowerCase()] || styles.neutral;

    return (
        <span className={[styles.badge, stageClass].join(" ")}>{stage}</span>
    );
};

export default StageBadge;
