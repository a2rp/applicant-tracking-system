import { useMemo, useRef, useState } from "react";
import { FiBriefcase, FiCalendar, FiEdit2, FiMail, FiMapPin, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import Dialog from "../../components/dialog";
import StageBadge from "../../components/stageBadge";
import { stages } from "../../data/seedData";
import styles from "./styles.module.css";

const formatDate = (date) => new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
}).format(new Date(date + "T12:00:00"));

const CandidateForm = ({ candidate, jobs, onCancel, onSave }) => {
    const [values, setValues] = useState(() => ({
        name: candidate?.name || "",
        email: candidate?.email || "",
        jobId: candidate?.jobId || jobs[0]?.id || "",
        stage: candidate?.stage || "Applied",
        source: candidate?.source || "Careers page",
        location: candidate?.location || "",
        experience: candidate?.experience || "",
        note: candidate?.note || "",
    }));
    const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    const submitForm = (event) => {
        event.preventDefault();
        onSave({
            ...candidate,
            ...values,
            id: candidate?.id || "candidate-" + Date.now(),
            avatar: candidate?.avatar || "",
            rating: candidate?.rating || 4,
            appliedAt: candidate?.appliedAt || new Date().toISOString().slice(0, 10),
        });
    };

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <div className={styles.fieldGrid}>
                <label className={styles.field}><span>Full name</span><input autoComplete="name" maxLength="70" name="name" onChange={updateValue} placeholder="Candidate name" required value={values.name} /></label>
                <label className={styles.field}><span>Email address</span><input autoComplete="email" name="email" onChange={updateValue} placeholder="name@example.com" required type="email" value={values.email} /></label>
                <label className={styles.field}><span>Role</span><select name="jobId" onChange={updateValue} required value={values.jobId}>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
                <label className={styles.field}><span>Hiring stage</span><select name="stage" onChange={updateValue} value={values.stage}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                <label className={styles.field}><span>Source</span><select name="source" onChange={updateValue} value={values.source}><option>Careers page</option><option>LinkedIn</option><option>Referral</option><option>Portfolio</option><option>Recruiter</option></select></label>
                <label className={styles.field}><span>Location</span><input autoComplete="address-level2" name="location" onChange={updateValue} placeholder="City, country" required value={values.location} /></label>
                <label className={styles.field}><span>Experience</span><input name="experience" onChange={updateValue} placeholder="e.g. 5 years" value={values.experience} /></label>
                <label className={styles.field}><span>Recruiter note</span><input name="note" onChange={updateValue} placeholder="A short hiring note" value={values.note} /></label>
            </div>
            <div className={styles.formActions}>
                <button className={styles.secondaryButton} onClick={onCancel} type="button">Cancel</button>
                <button className={styles.primaryButton} type="submit">{candidate ? "Save changes" : "Add candidate"}</button>
            </div>
        </form>
    );
};

const CandidatesPage = ({ candidates, jobs, setCandidates }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get("search") || "");
    const [stageFilter, setStageFilter] = useState("All stages");
    const [jobFilter, setJobFilter] = useState("All roles");
    const [dialogOpen, setDialogOpen] = useState(() => searchParams.get("add") === "1");
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [notice, setNotice] = useState("");
    const cancelRef = useRef(null);

    const visibleCandidates = useMemo(() => candidates.filter((candidate) => {
        const role = jobs.find((job) => job.id === candidate.jobId)?.title || "";
        const query = search.trim().toLowerCase();
        const matchesQuery = !query || candidate.name.toLowerCase().includes(query)
            || candidate.email.toLowerCase().includes(query) || role.toLowerCase().includes(query);
        return matchesQuery
            && (stageFilter === "All stages" || candidate.stage === stageFilter)
            && (jobFilter === "All roles" || candidate.jobId === jobFilter);
    }).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)), [candidates, jobs, search, stageFilter, jobFilter]);

    const notify = (message) => {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2600);
    };
    const closeComposer = () => {
        setDialogOpen(false);
        if (searchParams.get("add") === "1") {
            setSearchParams((current) => {
                const next = new URLSearchParams(current);
                next.delete("add");
                return next;
            }, { replace: true });
        }
    };
    const roleName = (jobId) => jobs.find((job) => job.id === jobId)?.title || "Role removed";
    const saveCandidate = (candidate) => {
        setCandidates((current) => current.some((item) => item.id === candidate.id)
            ? current.map((item) => item.id === candidate.id ? candidate : item)
            : [candidate, ...current]);
        closeComposer();
        setSelectedCandidate(null);
        notify(editingCandidate ? "Candidate details updated" : "Candidate added to your workspace");
        setEditingCandidate(null);
    };
    const changeStage = (id, stage) => {
        setCandidates((current) => current.map((candidate) => candidate.id === id ? { ...candidate, stage } : candidate));
        notify("Candidate moved to " + stage);
    };
    const removeCandidate = () => {
        setCandidates((current) => current.filter((candidate) => candidate.id !== pendingDelete.id));
        setPendingDelete(null);
        notify("Candidate removed");
    };

    return (
        <section className={styles.candidatePage}>
            <div className={styles.pageHeader}>
                <div><p className={styles.breadcrumb}>Workspace / Candidates</p><h1>Candidates</h1><p className={styles.description}>Keep every conversation and next step in one place.</p></div>
                <button className={styles.primaryButton} onClick={() => { setEditingCandidate(null); setDialogOpen(true); }} type="button"><FiPlus aria-hidden="true" />Add candidate</button>
            </div>
            <div className={styles.summaryRow}>
                <span className={styles.summaryIcon}><FiUsers aria-hidden="true" /></span>
                <div><strong>{candidates.length}</strong><span>people in your workspace</span></div>
                <span className={styles.summaryDivider} />
                <div><strong>{candidates.filter((candidate) => !["Rejected", "Hired"].includes(candidate.stage)).length}</strong><span>active conversations</span></div>
                <span className={styles.summaryNote}>Updated just now</span>
            </div>
            <div className={styles.toolbar}>
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input aria-label="Search candidates" onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or role" value={search} /></label>
                <label className={styles.selectBox}><span>Stage</span><select aria-label="Filter by stage" onChange={(event) => setStageFilter(event.target.value)} value={stageFilter}><option>All stages</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                <label className={styles.selectBox}><span>Role</span><select aria-label="Filter by role" onChange={(event) => setJobFilter(event.target.value)} value={jobFilter}><option value="All roles">All roles</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
                <span className={styles.resultCount}>{visibleCandidates.length} shown</span>
            </div>
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}><div><h2>All candidates</h2><span>{visibleCandidates.length} profiles</span></div><span className={styles.tableHint}><FiCalendar aria-hidden="true" />Recently added</span></div>
                <div className={styles.tableScroll}>
                    <table>
                        <thead><tr><th scope="col">Candidate</th><th scope="col">Applied for</th><th scope="col">Stage</th><th scope="col">Source</th><th scope="col">Applied</th></tr></thead>
                        <tbody>
                            {visibleCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td><button className={styles.candidateButton} onClick={() => setSelectedCandidate(candidate)} type="button"><CandidateAvatar candidate={candidate} size="medium" /><span><strong>{candidate.name}</strong><small>{candidate.email}</small></span></button></td>
                                    <td><span className={styles.roleCell}><FiBriefcase aria-hidden="true" />{roleName(candidate.jobId)}</span></td>
                                    <td><label className={styles.stageSelect}><span className={styles.visuallyHidden}>Move {candidate.name} to a stage</span><select aria-label={"Move " + candidate.name + " to a stage"} onChange={(event) => changeStage(candidate.id, event.target.value)} value={candidate.stage}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label></td>
                                    <td><span className={styles.sourceCell}>{candidate.source}</span></td>
                                    <td><span className={styles.dateCell}>{formatDate(candidate.appliedAt)}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!visibleCandidates.length && <div className={styles.emptyState}><FiSearch aria-hidden="true" /><strong>No candidates found</strong><span>Try another search or adjust your filters.</span></div>}
                </div>
            </div>
            {notice && <div aria-live="polite" className={styles.notice} role="status">{notice}</div>}

            {dialogOpen && (
                <Dialog description={editingCandidate ? "Update the details used by your hiring team." : "Add a person to a role and keep their next step visible."} onClose={closeComposer} title={editingCandidate ? "Edit candidate" : "Add candidate"}>
                    <CandidateForm candidate={editingCandidate} jobs={jobs} onCancel={closeComposer} onSave={saveCandidate} />
                </Dialog>
            )}
            {selectedCandidate && (
                <Dialog description={roleName(selectedCandidate.jobId)} onClose={() => setSelectedCandidate(null)} title={selectedCandidate.name}>
                    <div className={styles.detail}>
                        <div className={styles.detailTop}><CandidateAvatar candidate={selectedCandidate} size="large" /><div><StageBadge stage={selectedCandidate.stage} /><p>{selectedCandidate.experience} experience Â· {selectedCandidate.location}</p></div></div>
                        <div className={styles.detailGrid}>
                            <span><FiMail aria-hidden="true" />{selectedCandidate.email}</span>
                            <span><FiMapPin aria-hidden="true" />{selectedCandidate.location}</span>
                            <span><FiCalendar aria-hidden="true" />Applied {formatDate(selectedCandidate.appliedAt)}</span>
                            <span><FiUsers aria-hidden="true" />Source: {selectedCandidate.source}</span>
                        </div>
                        <div className={styles.note}><strong>Recruiter note</strong><p>{selectedCandidate.note || "No recruiter note added yet."}</p></div>
                        <div className={styles.detailActions}>
                            <button className={styles.dangerButton} onClick={() => { setPendingDelete(selectedCandidate); setSelectedCandidate(null); }} type="button"><FiTrash2 aria-hidden="true" />Remove</button>
                            <button className={styles.primaryButton} onClick={() => { setEditingCandidate(selectedCandidate); setSelectedCandidate(null); setDialogOpen(true); }} type="button"><FiEdit2 aria-hidden="true" />Edit details</button>
                        </div>
                    </div>
                </Dialog>
            )}
            {pendingDelete && (
                <Dialog description={"This removes " + pendingDelete.name + " from your local hiring workspace. This action cannot be undone."} initialFocusRef={cancelRef} onClose={() => setPendingDelete(null)} size="small" title="Remove candidate?">
                    <div className={styles.confirmActions}><button className={styles.secondaryButton} onClick={() => setPendingDelete(null)} ref={cancelRef} type="button">Keep candidate</button><button className={styles.dangerSolidButton} onClick={removeCandidate} type="button">Remove candidate</button></div>
                </Dialog>
            )}
        </section>
    );
};

export default CandidatesPage;
