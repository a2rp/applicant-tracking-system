import { FiArrowUpRight, FiBriefcase, FiCalendar, FiChevronRight, FiSend, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import { pipelineStages, recentActivity, upcomingInterviews } from "../../data/seedData";
import styles from "./styles.module.css";

const DashboardPage = ({ candidates, jobs }) => {
    const activeCandidates = candidates.filter((candidate) => !["Hired", "Rejected"].includes(candidate.stage));
    const openJobs = jobs.filter((job) => job.status === "Open");
    const interviewCount = candidates.filter((candidate) => candidate.stage === "Interview").length;
    const offerCount = candidates.filter((candidate) => candidate.stage === "Offer").length;
    const maxStageCount = Math.max(1, ...pipelineStages.map((stage) => activeCandidates.filter((candidate) => candidate.stage === stage).length));
    const getRole = (candidate) => jobs.find((job) => job.id === candidate.jobId)?.title || "Role removed";

    return (
        <section className={styles.dashboard}>
            <div className={styles.pageHeader}>
                <div><p className={styles.breadcrumb}>Saturday, October 10</p><h1>Hiring overview</h1><p className={styles.description}>A clear view of the work moving across your team.</p></div>
                <div className={styles.headerActions}><span className={styles.dateChip}><FiCalendar aria-hidden="true" />Week of Oct 5</span><NavLink className={styles.primaryLink} to="/candidates?add=1"><FiUsers aria-hidden="true" />Add candidate</NavLink></div>
            </div>

            <div className={styles.metricGrid}>
                <NavLink className={styles.metricCard} to="/candidates"><span className={styles.metricIcon}><FiUsers aria-hidden="true" /></span><span className={styles.metricLabel}>Active candidates</span><strong>{activeCandidates.length}</strong><span className={styles.metricFootnote}><i />Across {openJobs.length} open roles</span></NavLink>
                <NavLink className={styles.metricCard} to="/jobs"><span className={styles.metricIcon}><FiBriefcase aria-hidden="true" /></span><span className={styles.metricLabel}>Open roles</span><strong>{openJobs.length}</strong><span className={styles.metricFootnote}>Across {new Set(openJobs.map((job) => job.department)).size} teams</span></NavLink>
                <NavLink className={styles.metricCard} to="/pipeline"><span className={styles.metricIcon}><FiCalendar aria-hidden="true" /></span><span className={styles.metricLabel}>In interviews</span><strong>{interviewCount}</strong><span className={styles.metricFootnote}>Next conversations today</span></NavLink>
                <NavLink className={styles.metricCard} to="/pipeline"><span className={styles.metricIcon}><FiSend aria-hidden="true" /></span><span className={styles.metricLabel}>Offers to close</span><strong>{offerCount}</strong><span className={styles.metricFootnote}>Keep the momentum going</span></NavLink>
            </div>

            <div className={styles.contentGrid}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}><div><h2>Candidate pipeline</h2><p>Where active candidates are today</p></div><NavLink className={styles.textLink} to="/pipeline">Open pipeline <FiArrowUpRight aria-hidden="true" className="actionArrow" /></NavLink></div>
                    <div className={styles.pipelineSummary}><strong>{activeCandidates.length}</strong><span>active profiles</span><span className={styles.summaryLegend}><i />Hiring in progress</span></div>
                    <div className={styles.stageChart}>
                        {pipelineStages.map((stage) => {
                            const count = activeCandidates.filter((candidate) => candidate.stage === stage).length;
                            return <div className={styles.stageRow} key={stage}><span>{stage}</span><div aria-label={count + " candidates in " + stage} className={styles.barTrack} role="img"><span className={styles[stage.toLowerCase()]} style={{ width: (count / maxStageCount) * 100 + "%" }} /></div><strong>{count}</strong></div>;
                        })}
                    </div>
                    <div className={styles.chartFooter}><span><i />Current candidates</span><span>Live from your workspace</span></div>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}><div><h2>Today and next</h2><p>Upcoming interview conversations</p></div><span className={styles.todayTag}>3 scheduled</span></div>
                    <div className={styles.interviewList}>
                        {upcomingInterviews.map((interview) => {
                            const candidate = candidates.find((item) => item.id === interview.candidateId);
                            if (!candidate) return null;
                            return <NavLink className={styles.interviewItem} key={interview.id} to={"/candidates?search=" + encodeURIComponent(candidate.name)}><CandidateAvatar candidate={candidate} size="small" /><span className={styles.interviewDetails}><strong>{candidate.name}</strong><small>{interview.kind} Â· {getRole(candidate)}</small></span><span className={styles.interviewTime}>{interview.time}<small>{interview.interviewer}</small></span><FiChevronRight aria-hidden="true" className={styles.rowArrow} /></NavLink>;
                        })}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/pipeline">View candidate pipeline <FiArrowUpRight aria-hidden="true" className="actionArrow" /></NavLink>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}><div><h2>Open roles</h2><p>Keep an eye on each search</p></div><NavLink aria-label="View all jobs" className={styles.iconLink} to="/jobs"><FiArrowUpRight aria-hidden="true" /></NavLink></div>
                    <div className={styles.roleList}>
                        {openJobs.slice(0, 4).map((job) => {
                            const count = candidates.filter((candidate) => candidate.jobId === job.id && candidate.stage !== "Rejected").length;
                            return <NavLink className={styles.roleItem} key={job.id} to="/jobs"><span className={styles.roleIcon}><FiBriefcase aria-hidden="true" /></span><span className={styles.roleInfo}><strong>{job.title}</strong><small>{job.department} Â· {job.location}</small></span><span className={styles.roleCount}>{count}<small>candidates</small></span><FiChevronRight aria-hidden="true" className={styles.rowArrow} /></NavLink>;
                        })}
                        {!openJobs.length && <p className={styles.emptyText}>No open roles yet. Add a role to start building your pipeline.</p>}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/jobs">Manage roles <FiArrowUpRight aria-hidden="true" className="actionArrow" /></NavLink>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}><div><h2>Recent activity</h2><p>A little movement goes a long way</p></div><span className={styles.activityLive}><i />Live</span></div>
                    <div className={styles.activityList}>
                        {recentActivity.map((activity) => {
                            const candidate = candidates.find((item) => item.id === activity.candidateId);
                            if (!candidate) return null;
                            return <NavLink className={styles.activityItem} key={activity.id} to={"/candidates?search=" + encodeURIComponent(candidate.name)}><CandidateAvatar candidate={candidate} size="small" /><span><strong>{candidate.name}</strong><small>{activity.action}</small></span><time>{activity.time}</time></NavLink>;
                        })}
                    </div>
                    <NavLink className={styles.cardBottomLink} to="/candidates">See all candidates <FiArrowUpRight aria-hidden="true" className="actionArrow" /></NavLink>
                </section>
            </div>
        </section>
    );
};

export default DashboardPage;
