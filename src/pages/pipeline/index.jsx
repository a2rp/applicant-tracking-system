import { useMemo, useState } from "react";
import { FiArrowRight, FiPlus, FiSearch, FiSettings, FiTrash2, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import Dialog from "../../components/dialog";
import StageBadge from "../../components/stageBadge";
import { useToast } from "../../components/toast/useToast";
import styles from "./styles.module.css";

const PipelinePage = ({ candidates, jobs, setCandidates, stages, setStages, recordActivity }) => {
    const notify = useToast();
    const [jobFilter, setJobFilter] = useState("All roles");
    const [search, setSearch] = useState("");
    const [stageManagerOpen, setStageManagerOpen] = useState(false);
    const [newStage, setNewStage] = useState("");
    const [stageError, setStageError] = useState("");
    const pipelineStages = stages.filter((stage) => stage !== "Rejected");
    const activeCandidates = useMemo(
        () =>
            candidates.filter((candidate) => {
                const query = search.trim().toLowerCase();
                return (
                    candidate.stage !== "Rejected" &&
                    (jobFilter === "All roles" ||
                        candidate.jobId === jobFilter) &&
                    (!query || candidate.name.toLowerCase().includes(query))
                );
            }),
        [candidates, jobFilter, search],
    );
    const roleName = (candidate) =>
        jobs.find((job) => job.id === candidate.jobId)?.title || "Role removed";
    const moveCandidate = (id, stage) => {
        setCandidates((current) =>
            current.map((candidate) =>
                candidate.id === id ? { ...candidate, stage } : candidate,
            ),
        );
        const candidate = candidates.find((item) => item.id === id);
        notify(`${candidate?.name || "Candidate"} moved to ${stage}`);
        recordActivity({ candidateId: id, action: `moved to ${stage}` });
    };
    const addStage = (event) => {
        event.preventDefault();
        const stage = newStage.trim().replace(/\s+/g, " ");
        if (!stage) {
            setStageError("Enter a stage name before adding it.");
            return;
        }
        if (stages.some((item) => item.toLowerCase() === stage.toLowerCase())) {
            setStageError("A stage with that name already exists.");
            return;
        }
        if (stage.length > 30) {
            setStageError("Keep stage names to 30 characters or fewer.");
            return;
        }
        setStages((current) => [...current.filter((item) => item !== "Rejected"), stage, "Rejected"]);
        setNewStage("");
        setStageError("");
        notify(`${stage} stage added`);
        recordActivity({ label: "Hiring stages", entityType: "stage", action: `added the ${stage} stage` });
    };
    const removeStage = (stage) => {
        const assigned = candidates.filter((candidate) => candidate.stage === stage).length;
        if (assigned || ["Applied", "Rejected"].includes(stage)) {
            notify(assigned ? `Move all ${assigned} candidates out of ${stage} before removing it` : `${stage} is a required system stage`, "warning");
            return;
        }
        setStages((current) => current.filter((item) => item !== stage));
        notify(`${stage} stage removed`, "info");
        recordActivity({ label: "Hiring stages", entityType: "stage", action: `removed the ${stage} stage` });
    };

    return (
        <section className={styles.pipelinePage}>
            <div className={styles.pageHeader}>
                <div>
                    <p className={styles.breadcrumb}>Workspace / Pipeline</p>
                    <h1>Hiring pipeline</h1>
                    <p className={styles.description}>
                        Move candidates forward and keep every role in view.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryButton} onClick={() => setStageManagerOpen(true)} type="button">
                        <FiSettings aria-hidden="true" /> Manage stages
                    </button>
                    <NavLink className={styles.primaryLink} to="/candidates?add=1">
                        <FiUsers aria-hidden="true" /> Add candidate
                    </NavLink>
                </div>
            </div>
            <div className={styles.toolbar}>
                <label className={styles.searchBox}>
                    <FiSearch aria-hidden="true" />
                    <input
                        aria-label="Search pipeline candidates"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Find a candidate"
                        value={search}
                    />
                </label>
                <label className={styles.roleFilter}>
                    <span>Role</span>
                    <select
                        aria-label="Filter pipeline by role"
                        onChange={(event) => setJobFilter(event.target.value)}
                        value={jobFilter}
                    >
                        <option value="All roles">All roles</option>
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </label>
                <span className={styles.totalCount}>
                    {activeCandidates.length} active candidates
                </span>
            </div>
            <div aria-label="Hiring stages" className={styles.board}>
                {pipelineStages.map((stage) => {
                    const stageCandidates = activeCandidates.filter(
                        (candidate) => candidate.stage === stage,
                    );
                    return (
                        <section
                            aria-label={stage + " stage"}
                            className={styles.column}
                            key={stage}
                        >
                            <div className={styles.columnHeader}>
                                <div>
                                    <span className={styles[stage.toLowerCase()] || styles.neutralStage} />
                                    <h2>{stage}</h2>
                                </div>
                                <span className={styles.columnCount}>
                                    {stageCandidates.length}
                                </span>
                            </div>
                            <div className={styles.candidateList}>
                                {stageCandidates.map((candidate) => (
                                    <article
                                        className={styles.candidateCard}
                                        key={candidate.id}
                                    >
                                        <div className={styles.cardTop}>
                                            <CandidateAvatar
                                                candidate={candidate}
                                                size="medium"
                                            />
                                            <StageBadge
                                                stage={candidate.stage}
                                            />
                                        </div>
                                        <NavLink
                                            className={styles.candidateName}
                                            to={
                                                "/candidates?search=" +
                                                encodeURIComponent(
                                                    candidate.name,
                                                )
                                            }
                                        >
                                            {candidate.name}
                                            <FiArrowRight
                                                aria-hidden="true"
                                                className="actionArrow"
                                            />
                                        </NavLink>
                                        <p className={styles.roleName}>
                                            {roleName(candidate)}
                                        </p>
                                        <div className={styles.cardMeta}>
                                            <span>{candidate.location}</span>
                                            <span>via {candidate.source}</span>
                                        </div>
                                        <label className={styles.moveSelect}>
                                            <span>Move to</span>
                                            <select
                                                aria-label={
                                                    "Move " +
                                                    candidate.name +
                                                    " to a stage"
                                                }
                                                onChange={(event) =>
                                                    moveCandidate(
                                                        candidate.id,
                                                        event.target.value,
                                                    )
                                                }
                                                value={candidate.stage}
                                            >
                                                {stages.map((nextStage) => <option key={nextStage}>{nextStage}</option>)}
                                            </select>
                                        </label>
                                    </article>
                                ))}
                                {!stageCandidates.length && (
                                    <div className={styles.emptyColumn}>
                                        <span>No candidates here</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
            {stageManagerOpen && (
                <Dialog description="Customize the stages used across candidates and the pipeline board." onClose={() => setStageManagerOpen(false)} title="Manage hiring stages">
                    <div className={styles.stageManager}>
                        <form className={styles.addStageForm} onSubmit={addStage}>
                            <label>
                                <span>New stage name</span>
                                <input maxLength="30" onChange={(event) => setNewStage(event.target.value)} placeholder="e.g. Case study" value={newStage} />
                            </label>
                            <button className={styles.primaryLink} type="submit"><FiPlus aria-hidden="true" /> Add stage</button>
                        </form>
                        {stageError && <p className={styles.stageError} role="alert">{stageError}</p>}
                        <div className={styles.stageManagerList}>
                            {stages.map((stage) => {
                                const count = candidates.filter((candidate) => candidate.stage === stage).length;
                                const locked = ["Applied", "Rejected"].includes(stage);
                                return <div className={styles.stageManagerRow} key={stage}>
                                    <span><StageBadge stage={stage} /> <small>{count} {count === 1 ? "candidate" : "candidates"}</small></span>
                                    <button aria-label={`Remove ${stage} stage`} disabled={locked || count > 0} onClick={() => removeStage(stage)} title={locked ? "Required system stage" : count ? "Move candidates out of this stage first" : "Remove stage"} type="button"><FiTrash2 aria-hidden="true" /></button>
                                </div>;
                            })}
                        </div>
                        <p className={styles.managerHint}>Stages with candidates assigned are locked until those candidates move elsewhere. Applied and Rejected are required system stages.</p>
                    </div>
                </Dialog>
            )}
        </section>
    );
};

export default PipelinePage;
