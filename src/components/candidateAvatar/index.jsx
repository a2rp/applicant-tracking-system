import styles from "./styles.module.css";

const getInitials = (name = "Candidate") => name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const CandidateAvatar = ({ candidate, size = "medium" }) => (
    <span className={`${styles.avatar} ${styles[size]}`}>
        {candidate.avatar ? (
            <img
                alt=""
                loading="lazy"
                src={`${import.meta.env.BASE_URL}assets/candidates/${candidate.avatar}`}
            />
        ) : getInitials(candidate.name)}
    </span>
);

export default CandidateAvatar;
