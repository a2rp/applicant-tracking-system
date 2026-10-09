import {
    FiArrowUpRight,
    FiBriefcase,
    FiCalendar,
    FiChevronRight,
    FiSend,
    FiUsers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import styles from "./styles.module.css";

const DashboardPage = ({ candidates, jobs, stages, interviews, activity }) => {
    const pipelineStages = stages.filter((stage) => stage !== "Rejected");
    const activeCandidates = candidates.filter(
        (candidate) => !["Hired", "Rejected"].includes(candidate.stage),
    );
    const pipelineCandidates = candidates.filter((candidate) => candidate.stage !== "Rejected");
    const openJobs = jobs.filter((job) => job.status === "Open");
    const upcoming = interviews
        .filter((interview) => interview.status === "Scheduled" && new Date(interview.scheduledAt) >= new Date())
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
    const interviewCount = upcoming.length;
    const offerCount = candidates.filter(
        (candidate) => candidate.stage === "Offer",
    ).length;
    const scorecardValues = candidates.flatMap((candidate) =>
        (candidate.scorecards || []).flatMap((scorecard) => Object.values(scorecard.scores)),
    );
    const averageScore = scorecardValues.length
        ? (scorecardValues.reduce((total, value) => total + value, 0) / scorecardValues.length).toFixed(1)
        : null;
    const maxStageCount = Math.max(
        1,
        ...pipelineStages.map(
            (stage) =>
                pipelineCandidates.filter(
                    (candidate) => candidate.stage === stage,
                ).length,
        ),
    );
    const getRole = (candidate) =>
        jobs.find((job) => job.id === candidate.jobId)?.title || "Role removed";
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const weekLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(weekStart);
    const todayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(now);
    const interviewLabel = (dateValue) => {
        const date = new Date(dateValue);
        const dateText = date.toDateString() === now.toDateString()
            ? "Today"
            : new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(date);
        return `${dateText} · ${new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date)}`;
    };
    const relativeTime = (dateValue) => {
        const minutes = Math.max(0, Math.floor((now - new Date(dateValue)) / 60000));
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)} hr${minutes >= 120 ? "s" : ""} ago`;
        return `${Math.floor(minutes / 1440)} day${minutes >= 2880 ? "s" : ""} ago`;
    };

    return (
        <section className={styles.dashboard}>
            <div className={styles.pageHeader}>
                <div>
                    <p className={styles.breadcrumb}>{todayLabel}</p>
                    <h1>Hiring overview</h1>
                    <p className={styles.description}>
                        A clear view of the work moving across your team.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <span className={styles.dateChip}>
                        <FiCalendar aria-hidden="true" />
                        Week of {weekLabel}
                    </span>
                    <NavLink
                        className={styles.primaryLink}
                        to="/candidates?add=1"
                    >
                        <FiUsers aria-hidden="true" />
                        Add candidate
                    </NavLink>
                </div>
            </div>

            <div className={styles.metricGrid}>
                <NavLink className={styles.metricCard} to="/candidates">
                    <span className={styles.metricIcon}>
                        <FiUsers aria-hidden="true" />
                    </span>
                    <span className={styles.metricLabel}>
                        Active candidates
                    </span>
                    <strong>{activeCandidates.length}</strong>
                    <span className={styles.metricFootnote}>
                        <i />
                        Across {openJobs.length} open roles
                    </span>
                </NavLink>
                <NavLink className={styles.metricCard} to="/jobs">
                    <span className={styles.metricIcon}>
                        <FiBriefcase aria-hidden="true" />
                    </span>
                    <span className={styles.metricLabel}>Open roles</span>
                    <strong>{openJobs.length}</strong>
                    <span className={styles.metricFootnote}>
                        Across{" "}
                        {new Set(openJobs.map((job) => job.department)).size}{" "}
                        teams
                    </span>
                </NavLink>
                <NavLink className={styles.metricCard} to="/pipeline">
                    <span className={styles.metricIcon}>
                        <FiCalendar aria-hidden="true" />
                    </span>
                    <span className={styles.metricLabel}>In interviews</span>
                    <strong>{interviewCount}</strong>
                    <span className={styles.metricFootnote}>
                        Scheduled conversations ahead
                    </span>
                </NavLink>
                <NavLink className={styles.metricCard} to="/pipeline">
                    <span className={styles.metricIcon}>
                        <FiSend aria-hidden="true" />
                    </span>
                    <span className={styles.metricLabel}>Offers to close</span>
                    <strong>{offerCount}</strong>
                    <span className={styles.metricFootnote}>
                        Keep the momentum going
                    </span>
                </NavLink>
            </div>

            <div className={styles.contentGrid}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2>Candidate pipeline</h2>
                            <p>Where active candidates are today</p>
                        </div>
                        <NavLink className={styles.textLink} to="/pipeline">
                            Open pipeline{" "}
                            <FiArrowUpRight
                                aria-hidden="true"
                                className="actionArrow"
                            />
                        </NavLink>
                    </div>
                    <div className={styles.pipelineSummary}>
                        <strong>{activeCandidates.length}</strong>
                        <span>active profiles</span>
                        <span className={styles.summaryLegend}>
                            <i />
                            Hiring in progress
                        </span>
                    </div>
                    <div className={styles.stageChart}>
                        {pipelineStages.map((stage) => {
                            const count = pipelineCandidates.filter(
                                (candidate) => candidate.stage === stage,
                            ).length;
                            return (
                                <div className={styles.stageRow} key={stage}>
                                    <span>{stage}</span>
                                    <div
                                        aria-label={
                                            count + " candidates in " + stage
                                        }
                                        className={styles.barTrack}
                                        role="img"
                                    >
                                        <span
                                            className={
                                                styles[stage.toLowerCase()] || styles.customStage
                                            }
                                            style={{
                                                width:
                                                    (count / maxStageCount) *
                                                        100 +
                                                    "%",
                                            }}
                                        />
                                    </div>
                                    <strong>{count}</strong>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.chartFooter}>
                        <span>
                            <i />
                            Current candidates
                        </span>
                        <span>Live from your workspace</span>
                    </div>
                    <NavLink className={styles.scorecardInsight} to="/candidates">
                        <span>
                            <strong>Interview scorecard average</strong>
                            <small>{averageScore ? `${scorecardValues.length} ratings across completed scorecards` : "Add structured interviewer feedback to build a hiring report"}</small>
                        </span>
                        <b>{averageScore ? `${averageScore} / 5` : "—"}</b>
                    </NavLink>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2>Today and next</h2>
                            <p>Scheduled interview conversations</p>
                        </div>
                        <span className={styles.todayTag}>{interviewCount} scheduled</span>
                    </div>
                    <div className={styles.interviewList}>
                        {upcoming.slice(0, 4).map((interview) => {
                            const candidate = candidates.find(
                                (item) => item.id === interview.candidateId,
                            );
                            if (!candidate) return null;
                            return (
                                <NavLink
                                    className={styles.interviewItem}
                                    key={interview.id}
                                    to={
                                        "/candidates?search=" +
                                        encodeURIComponent(candidate.name)
                                    }
                                >
                                    <CandidateAvatar
                                        candidate={candidate}
                                        size="small"
                                    />
                                    <span className={styles.interviewDetails}>
                                        <strong>{candidate.name}</strong>
                                        <small>
                                            {interview.kind} ·{" "}
                                            {getRole(candidate)}
                                        </small>
                                    </span>
                                    <span className={styles.interviewTime}>
                                        {interviewLabel(interview.scheduledAt)}
                                        <small>{interview.interviewer}</small>
                                    </span>
                                    <FiChevronRight
                                        aria-hidden="true"
                                        className={styles.rowArrow}
                                    />
                                </NavLink>
                            );
                        })}
                        {!upcoming.length && <p className={styles.emptyText}>No interviews are scheduled. Open a candidate profile to plan the next conversation.</p>}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/pipeline">
                        View candidate pipeline{" "}
                        <FiArrowUpRight
                            aria-hidden="true"
                            className="actionArrow"
                        />
                    </NavLink>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2>Open roles</h2>
                            <p>Keep an eye on each search</p>
                        </div>
                        <NavLink
                            aria-label="View all jobs"
                            className={styles.iconLink}
                            to="/jobs"
                        >
                            <FiArrowUpRight aria-hidden="true" />
                        </NavLink>
                    </div>
                    <div className={styles.roleList}>
                        {openJobs.slice(0, 4).map((job) => {
                            const count = candidates.filter(
                                (candidate) =>
                                    candidate.jobId === job.id &&
                                    candidate.stage !== "Rejected",
                            ).length;
                            return (
                                <NavLink
                                    className={styles.roleItem}
                                    key={job.id}
                                    to="/jobs"
                                >
                                    <span className={styles.roleIcon}>
                                        <FiBriefcase aria-hidden="true" />
                                    </span>
                                    <span className={styles.roleInfo}>
                                        <strong>{job.title}</strong>
                                        <small>
                                            {job.department} Â· {job.location}
                                        </small>
                                    </span>
                                    <span className={styles.roleCount}>
                                        {count}
                                        <small>candidates</small>
                                    </span>
                                    <FiChevronRight
                                        aria-hidden="true"
                                        className={styles.rowArrow}
                                    />
                                </NavLink>
                            );
                        })}
                        {!openJobs.length && (
                            <p className={styles.emptyText}>
                                No open roles yet. Add a role to start building
                                your pipeline.
                            </p>
                        )}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/jobs">
                        Manage roles{" "}
                        <FiArrowUpRight
                            aria-hidden="true"
                            className="actionArrow"
                        />
                    </NavLink>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h2>Recent activity</h2>
                            <p>A little movement goes a long way</p>
                        </div>
                        <span className={styles.activityLive}>
                            <i />
                            Live
                        </span>
                    </div>
                    <div className={styles.activityList}>
                        {activity.slice(0, 5).map((item) => {
                            const candidate = candidates.find(
                                (candidateItem) => candidateItem.id === item.candidateId,
                            );
                            const title = candidate?.name || item.label || "Workspace";
                            return (
                                <NavLink
                                    className={styles.activityItem}
                                    key={item.id}
                                    to={candidate ? "/candidates?search=" + encodeURIComponent(candidate.name) : item.entityType === "stage" ? "/pipeline" : item.entityType === "job" ? "/jobs" : "/candidates"}
                                >
                                    {candidate ? <CandidateAvatar candidate={candidate} size="small" /> : <span className={styles.activityIcon}><FiBriefcase aria-hidden="true" /></span>}
                                    <span>
                                        <strong>{title}</strong>
                                        <small>{item.action}</small>
                                    </span>
                                    <time>{relativeTime(item.createdAt)}</time>
                                </NavLink>
                            );
                        })}
                        {!activity.length && <p className={styles.emptyText}>Actions across this workspace will appear here.</p>}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/candidates">
                        See all candidates{" "}
                        <FiArrowUpRight
                            aria-hidden="true"
                            className="actionArrow"
                        />
                    </NavLink>
                </section>
            </div>
        </section>
    );
};

export default DashboardPage;
