import { useMemo, useState } from "react";
import { FiArrowRight, FiSearch, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import StageBadge from "../../components/stageBadge";
import { pipelineStages } from "../../data/seedData";
import styles from "./styles.module.css";

const PipelinePage = ({ candidates, jobs, setCandidates }) => {
    const [jobFilter, setJobFilter] = useState("All roles");
    const [search, setSearch] = useState("");
    const activeCandidates = useMemo(() => candidates.filter((candidate) => {
        const query = search.trim().toLowerCase();
        return candidate.stage !== "Rejected"
            && (jobFilter === "All roles" || candidate.jobId === jobFilter)
            && (!query || candidate.name.toLowerCase().includes(query));
    }), [candidates, jobFilter, search]);
    const roleName = (candidate) => jobs.find((job) => job.id === candidate.jobId)?.title || "Role removed";
    const moveCandidate = (id, stage) => {
        setCandidates((current) => current.map((candidate) => candidate.id === id ? { ...candidate, stage } : candidate));
    };

    return (
        <section className={styles.pipelinePage}>
            <div className={styles.pageHeader}>
                <div><p className={styles.breadcrumb}>Workspace / Pipeline</p><h1>Hiring pipeline</h1><p className={styles.description}>Move candidates forward and keep every role in view.</p></div>
                <NavLink className={styles.primaryLink} to="/candidates?add=1"><FiUsers aria-hidden="true" />Add candidate</NavLink>
            </div>
            <div className={styles.toolbar}>
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input aria-label="Search pipeline candidates" onChange={(event) => setSearch(event.target.value)} placeholder="Find a candidate" value={search} /></label>
                <label className={styles.roleFilter}><span>Role</span><select aria-label="Filter pipeline by role" onChange={(event) => setJobFilter(event.target.value)} value={jobFilter}><option value="All roles">All roles</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
                <span className={styles.totalCount}>{activeCandidates.length} active candidates</span>
            </div>
            <div aria-label="Hiring stages" className={styles.board}>
                {pipelineStages.map((stage) => {
                    const stageCandidates = activeCandidates.filter((candidate) => candidate.stage === stage);
                    return (
                        <section aria-label={stage + " stage"} className={styles.column} key={stage}>
                            <div className={styles.columnHeader}>
                                <div><span className={styles[stage.toLowerCase()]} /><h2>{stage}</h2></div>
                                <span className={styles.columnCount}>{stageCandidates.length}</span>
                            </div>
                            <div className={styles.candidateList}>
                                {stageCandidates.map((candidate) => (
                                    <article className={styles.candidateCard} key={candidate.id}>
                                        <div className={styles.cardTop}><CandidateAvatar candidate={candidate} size="medium" /><StageBadge stage={candidate.stage} /></div>
                                        <NavLink className={styles.candidateName} to={"/candidates?search=" + encodeURIComponent(candidate.name)}>{candidate.name}<FiArrowRight aria-hidden="true" className="actionArrow" /></NavLink>
                                        <p className={styles.roleName}>{roleName(candidate)}</p>
                                        <div className={styles.cardMeta}><span>{candidate.location}</span><span>via {candidate.source}</span></div>
                                        <label className={styles.moveSelect}><span>Move to</span><select aria-label={"Move " + candidate.name + " to a stage"} onChange={(event) => moveCandidate(candidate.id, event.target.value)} value={candidate.stage}>{pipelineStages.map((nextStage) => <option key={nextStage}>{nextStage}</option>)}<option>Rejected</option></select></label>
                                    </article>
                                ))}
                                {!stageCandidates.length && <div className={styles.emptyColumn}><span>No candidates here</span></div>}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
};

export default PipelinePage;