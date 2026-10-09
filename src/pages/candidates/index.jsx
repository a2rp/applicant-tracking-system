import { useMemo, useRef, useState } from "react";
import {
    FiBriefcase,
    FiCalendar,
    FiClipboard,
    FiDownload,
    FiEdit2,
    FiMail,
    FiMapPin,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import Dialog from "../../components/dialog";
import StageBadge from "../../components/stageBadge";
import { useToast } from "../../components/toast/useToast";
import { downloadCsv } from "../../utils/exportCsv";
import styles from "./styles.module.css";

const today = () => {
    const date = new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((part, index) => String(part).padStart(index ? 2 : 4, "0"))
        .join("-");
};

const InterviewForm = ({ candidate, onCancel, onSave }) => {
    const [error, setError] = useState("");
    const [values, setValues] = useState({
        date: today(),
        time: "10:00",
        kind: "Hiring manager conversation",
        interviewer: "",
    });
    const submit = (event) => {
        event.preventDefault();
        const scheduledAt = new Date(`${values.date}T${values.time}`).toISOString();
        if (new Date(scheduledAt) <= new Date()) {
            setError("Choose a future time for this interview.");
            return;
        }
        setError("");
        onSave({
            id: `interview-${Date.now()}`,
            candidateId: candidate.id,
            scheduledAt,
            kind: values.kind,
            interviewer: values.interviewer.trim(),
            status: "Scheduled",
            feedback: "",
        });
    };

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.fieldGrid}>
                <label className={styles.field}>
                    <span>Interview type</span>
                    <select
                        onChange={(event) => setValues({ ...values, kind: event.target.value })}
                        value={values.kind}
                    >
                        <option>Hiring manager conversation</option>
                        <option>Portfolio review</option>
                        <option>Technical screen</option>
                        <option>Team conversation</option>
                        <option>Culture conversation</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Interviewer</span>
                    <input
                        maxLength="70"
                        onChange={(event) => setValues({ ...values, interviewer: event.target.value })}
                        placeholder="Interviewer name"
                        required
                        value={values.interviewer}
                    />
                </label>
                <label className={styles.field}>
                    <span>Date</span>
                    <input
                        min={today()}
                        onChange={(event) => setValues({ ...values, date: event.target.value })}
                        required
                        type="date"
                        value={values.date}
                    />
                </label>
                <label className={styles.field}>
                    <span>Time</span>
                    <input
                        onChange={(event) => setValues({ ...values, time: event.target.value })}
                        required
                        type="time"
                        value={values.time}
                    />
                </label>
            </div>
            {error && <p className={styles.formError} role="alert">{error}</p>}
            <div className={styles.formActions}>
                <button className={styles.secondaryButton} onClick={onCancel} type="button">Cancel</button>
                <button className={styles.primaryButton} type="submit">Schedule interview</button>
            </div>
        </form>
    );
};

const ScorecardForm = ({ onCancel, onSave }) => {
    const [scores, setScores] = useState({ roleSkills: "3", communication: "3", problemSolving: "3", collaboration: "3" });
    const [notes, setNotes] = useState("");
    const criteria = [
        ["roleSkills", "Role skills"],
        ["communication", "Communication"],
        ["problemSolving", "Problem solving"],
        ["collaboration", "Collaboration"],
    ];
    return (
        <form className={styles.form} onSubmit={(event) => {
            event.preventDefault();
            onSave({ id: `scorecard-${Date.now()}`, scores: Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, Number(value)])), notes: notes.trim(), createdAt: new Date().toISOString() });
        }}>
            <div className={styles.fieldGrid}>
                {criteria.map(([key, label]) => (
                    <label className={styles.field} key={key}>
                        <span>{label}</span>
                        <select onChange={(event) => setScores({ ...scores, [key]: event.target.value })} value={scores[key]}>
                            <option value="1">1 · Needs development</option>
                            <option value="2">2 · Developing</option>
                            <option value="3">3 · Meets expectations</option>
                            <option value="4">4 · Strong</option>
                            <option value="5">5 · Exceptional</option>
                        </select>
                    </label>
                ))}
                <label className={`${styles.field} ${styles.fullWidth}`}>
                    <span>Evidence and feedback</span>
                    <textarea maxLength="800" onChange={(event) => setNotes(event.target.value)} placeholder="Share specific evidence from the conversation" rows="4" value={notes} />
                </label>
            </div>
            <div className={styles.formActions}>
                <button className={styles.secondaryButton} onClick={onCancel} type="button">Cancel</button>
                <button className={styles.primaryButton} type="submit">Save scorecard</button>
            </div>
        </form>
    );
};

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date + "T12:00:00"));

const formatInterviewDate = (date) =>
    new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));

const CandidateForm = ({ candidate, jobs, stages, onCancel, onSave }) => {
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
    const updateValue = (event) =>
        setValues((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    const submitForm = (event) => {
        event.preventDefault();
        onSave({
            ...candidate,
            ...values,
            id: candidate?.id || "candidate-" + Date.now(),
            avatar: candidate?.avatar || "",
            rating: candidate?.rating || 4,
            appliedAt:
                candidate?.appliedAt || new Date().toISOString().slice(0, 10),
        });
    };

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <div className={styles.fieldGrid}>
                <label className={styles.field}>
                    <span>Full name</span>
                    <input
                        autoComplete="name"
                        maxLength="70"
                        name="name"
                        onChange={updateValue}
                        placeholder="Candidate name"
                        required
                        value={values.name}
                    />
                </label>
                <label className={styles.field}>
                    <span>Email address</span>
                    <input
                        autoComplete="email"
                        name="email"
                        onChange={updateValue}
                        placeholder="name@example.com"
                        required
                        type="email"
                        value={values.email}
                    />
                </label>
                <label className={styles.field}>
                    <span>Role</span>
                    <select
                        name="jobId"
                        onChange={updateValue}
                        required
                        value={values.jobId}
                    >
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Hiring stage</span>
                    <select
                        name="stage"
                        onChange={updateValue}
                        value={values.stage}
                    >
                        {stages.map((stage) => (
                            <option key={stage}>{stage}</option>
                        ))}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Source</span>
                    <select
                        name="source"
                        onChange={updateValue}
                        value={values.source}
                    >
                        <option>Careers page</option>
                        <option>LinkedIn</option>
                        <option>Referral</option>
                        <option>Portfolio</option>
                        <option>Recruiter</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Location</span>
                    <input
                        autoComplete="address-level2"
                        name="location"
                        onChange={updateValue}
                        placeholder="City, country"
                        required
                        value={values.location}
                    />
                </label>
                <label className={styles.field}>
                    <span>Experience</span>
                    <input
                        name="experience"
                        onChange={updateValue}
                        placeholder="e.g. 5 years"
                        value={values.experience}
                    />
                </label>
                <label className={styles.field}>
                    <span>Recruiter note</span>
                    <input
                        name="note"
                        onChange={updateValue}
                        placeholder="A short hiring note"
                        value={values.note}
                    />
                </label>
            </div>
            <div className={styles.formActions}>
                <button
                    className={styles.secondaryButton}
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </button>
                <button className={styles.primaryButton} type="submit">
                    {candidate ? "Save changes" : "Add candidate"}
                </button>
            </div>
        </form>
    );
};

const CandidatesPage = ({ candidates, jobs, stages, setCandidates, interviews, setInterviews, recordActivity }) => {
    const notify = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        () => searchParams.get("search") || "",
    );
    const [stageFilter, setStageFilter] = useState("All stages");
    const [jobFilter, setJobFilter] = useState("All roles");
    const [dialogOpen, setDialogOpen] = useState(
        () => searchParams.get("add") === "1",
    );
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [interviewCandidate, setInterviewCandidate] = useState(null);
    const [scorecardCandidate, setScorecardCandidate] = useState(null);
    const [pendingInterviewCancel, setPendingInterviewCancel] = useState(null);
    const cancelRef = useRef(null);

    const visibleCandidates = useMemo(
        () =>
            candidates
                .filter((candidate) => {
                    const role =
                        jobs.find((job) => job.id === candidate.jobId)?.title ||
                        "";
                    const query = search.trim().toLowerCase();
                    const matchesQuery =
                        !query ||
                        candidate.name.toLowerCase().includes(query) ||
                        candidate.email.toLowerCase().includes(query) ||
                        role.toLowerCase().includes(query);
                    return (
                        matchesQuery &&
                        (stageFilter === "All stages" ||
                            candidate.stage === stageFilter) &&
                        (jobFilter === "All roles" ||
                            candidate.jobId === jobFilter)
                    );
                })
                .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)),
        [candidates, jobs, search, stageFilter, jobFilter],
    );

    const closeComposer = () => {
        setDialogOpen(false);
        if (searchParams.get("add") === "1") {
            setSearchParams(
                (current) => {
                    const next = new URLSearchParams(current);
                    next.delete("add");
                    return next;
                },
                { replace: true },
            );
        }
    };
    const roleName = (jobId) =>
        jobs.find((job) => job.id === jobId)?.title || "Role removed";
    const saveCandidate = (candidate) => {
        setCandidates((current) =>
            current.some((item) => item.id === candidate.id)
                ? current.map((item) =>
                      item.id === candidate.id ? candidate : item,
                  )
                : [candidate, ...current],
        );
        closeComposer();
        setSelectedCandidate(null);
        const action = editingCandidate ? "updated candidate details" : "added a candidate";
        notify(editingCandidate ? "Candidate details updated" : "Candidate added to your workspace");
        recordActivity({ candidateId: candidate.id, action });
        setEditingCandidate(null);
    };
    const changeStage = (id, stage) => {
        setCandidates((current) =>
            current.map((candidate) =>
                candidate.id === id ? { ...candidate, stage } : candidate,
            ),
        );
        notify("Candidate moved to " + stage);
        const candidate = candidates.find((item) => item.id === id);
        if (candidate) recordActivity({ candidateId: id, action: `moved to ${stage}` });
    };
    const removeCandidate = () => {
        setCandidates((current) =>
            current.filter((candidate) => candidate.id !== pendingDelete.id),
        );
        setPendingDelete(null);
        notify("Candidate removed");
        recordActivity({ candidateId: pendingDelete.id, action: "was removed from the workspace" });
    };
    const saveInterview = (interview) => {
        setInterviews((current) => [...current, interview].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)));
        setInterviewCandidate(null);
        notify("Interview scheduled for " + interviewCandidate.name);
        recordActivity({ candidateId: interview.candidateId, action: `scheduled a ${interview.kind.toLowerCase()}` });
    };
    const saveScorecard = (candidate, scorecard) => {
        setCandidates((current) => current.map((item) => item.id === candidate.id ? { ...item, scorecards: [...(item.scorecards || []), scorecard] } : item));
        setSelectedCandidate((current) => current?.id === candidate.id ? { ...current, scorecards: [...(current.scorecards || []), scorecard] } : current);
        setScorecardCandidate(null);
        notify("Scorecard saved to " + candidate.name + "’s profile");
        recordActivity({ candidateId: candidate.id, action: "received interview scorecard feedback" });
    };
    const finishInterview = (interview) => {
        setInterviews((current) => current.map((item) => item.id === interview.id ? { ...item, status: "Completed" } : item));
        setScorecardCandidate(selectedCandidate);
        notify("Interview marked complete. Add the interviewer’s scorecard.", "info");
        recordActivity({ candidateId: interview.candidateId, action: "completed an interview" });
    };
    const cancelInterview = () => {
        setInterviews((current) => current.map((item) => item.id === pendingInterviewCancel.id ? { ...item, status: "Cancelled" } : item));
        recordActivity({ candidateId: pendingInterviewCancel.candidateId, action: "cancelled an interview" });
        setPendingInterviewCancel(null);
        notify("Interview cancelled", "info");
    };
    const exportCandidates = () => {
        if (!visibleCandidates.length) {
            notify("There are no matching candidates to export", "warning");
            return;
        }
        downloadCsv("hirly-candidates.csv", ["Name", "Email", "Role", "Stage", "Source", "Location", "Experience", "Applied"], visibleCandidates.map((candidate) => [candidate.name, candidate.email, roleName(candidate.jobId), candidate.stage, candidate.source, candidate.location, candidate.experience, candidate.appliedAt]));
        notify(`${visibleCandidates.length} candidate${visibleCandidates.length === 1 ? "" : "s"} exported`, "success");
    };

    return (
        <section className={styles.candidatePage}>
            <div className={styles.pageHeader}>
                <div>
                    <p className={styles.breadcrumb}>Workspace / Candidates</p>
                    <h1>Candidates</h1>
                    <p className={styles.description}>
                        Keep every conversation and next step in one place.
                    </p>
                </div>
                <button
                    className={styles.primaryButton}
                    onClick={() => {
                        setEditingCandidate(null);
                        setDialogOpen(true);
                    }}
                    type="button"
                >
                    <FiPlus aria-hidden="true" />
                    Add candidate
                </button>
            </div>
            <div className={styles.summaryRow}>
                <span className={styles.summaryIcon}>
                    <FiUsers aria-hidden="true" />
                </span>
                <div>
                    <strong>{candidates.length}</strong>
                    <span>people in your workspace</span>
                </div>
                <span className={styles.summaryDivider} />
                <div>
                    <strong>
                        {
                            candidates.filter(
                                (candidate) =>
                                    !["Rejected", "Hired"].includes(
                                        candidate.stage,
                                    ),
                            ).length
                        }
                    </strong>
                    <span>active conversations</span>
                </div>
                <span className={styles.summaryNote}>Updated just now</span>
            </div>
            <div className={styles.toolbar}>
                <label className={styles.searchBox}>
                    <FiSearch aria-hidden="true" />
                    <input
                        aria-label="Search candidates"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name, email, or role"
                        value={search}
                    />
                </label>
                <label className={styles.selectBox}>
                    <span>Stage</span>
                    <select
                        aria-label="Filter by stage"
                        onChange={(event) => setStageFilter(event.target.value)}
                        value={stageFilter}
                    >
                        <option>All stages</option>
                        {stages.map((stage) => (
                            <option key={stage}>{stage}</option>
                        ))}
                    </select>
                </label>
                <label className={styles.selectBox}>
                    <span>Role</span>
                    <select
                        aria-label="Filter by role"
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
                <span className={styles.resultCount}>
                    {visibleCandidates.length} shown
                </span>
                <button className={styles.exportButton} onClick={exportCandidates} type="button">
                    <FiDownload aria-hidden="true" /> Export CSV
                </button>
            </div>
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div>
                        <h2>All candidates</h2>
                        <span>{visibleCandidates.length} profiles</span>
                    </div>
                    <span className={styles.tableHint}>
                        <FiCalendar aria-hidden="true" />
                        Recently added
                    </span>
                </div>
                <div className={styles.tableScroll}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Candidate</th>
                                <th scope="col">Applied for</th>
                                <th scope="col">Stage</th>
                                <th scope="col">Source</th>
                                <th scope="col">Applied</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td>
                                        <button
                                            className={styles.candidateButton}
                                            onClick={() =>
                                                setSelectedCandidate(candidate)
                                            }
                                            type="button"
                                        >
                                            <CandidateAvatar
                                                candidate={candidate}
                                                size="medium"
                                            />
                                            <span>
                                                <strong>
                                                    {candidate.name}
                                                </strong>
                                                <small>{candidate.email}</small>
                                            </span>
                                        </button>
                                    </td>
                                    <td>
                                        <span className={styles.roleCell}>
                                            <FiBriefcase aria-hidden="true" />
                                            {roleName(candidate.jobId)}
                                        </span>
                                    </td>
                                    <td>
                                        <label className={styles.stageSelect}>
                                            <span
                                                className={
                                                    styles.visuallyHidden
                                                }
                                            >
                                                Move {candidate.name} to a stage
                                            </span>
                                            <select
                                                aria-label={
                                                    "Move " +
                                                    candidate.name +
                                                    " to a stage"
                                                }
                                                onChange={(event) =>
                                                    changeStage(
                                                        candidate.id,
                                                        event.target.value,
                                                    )
                                                }
                                                value={candidate.stage}
                                            >
                                                {stages.map((stage) => (
                                                    <option key={stage}>
                                                        {stage}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </td>
                                    <td>
                                        <span className={styles.sourceCell}>
                                            {candidate.source}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.dateCell}>
                                            {formatDate(candidate.appliedAt)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!visibleCandidates.length && (
                        <div className={styles.emptyState}>
                            <FiSearch aria-hidden="true" />
                            <strong>No candidates found</strong>
                            <span>
                                Try another search or adjust your filters.
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {dialogOpen && (
                <Dialog
                    description={
                        editingCandidate
                            ? "Update the details used by your hiring team."
                            : "Add a person to a role and keep their next step visible."
                    }
                    onClose={closeComposer}
                    title={
                        editingCandidate ? "Edit candidate" : "Add candidate"
                    }
                >
                    <CandidateForm
                        candidate={editingCandidate}
                        jobs={jobs}
                        stages={stages}
                        onCancel={closeComposer}
                        onSave={saveCandidate}
                    />
                </Dialog>
            )}
            {selectedCandidate && (
                <Dialog
                    description={roleName(selectedCandidate.jobId)}
                    onClose={() => setSelectedCandidate(null)}
                    title={selectedCandidate.name}
                >
                    <div className={styles.detail}>
                        <div className={styles.detailTop}>
                            <CandidateAvatar
                                candidate={selectedCandidate}
                                size="large"
                            />
                            <div>
                                <StageBadge stage={selectedCandidate.stage} />
                                <p>
                                    {selectedCandidate.experience} experience Â·{" "}
                                    {selectedCandidate.location}
                                </p>
                            </div>
                        </div>
                        <div className={styles.detailGrid}>
                            <span>
                                <FiMail aria-hidden="true" />
                                {selectedCandidate.email}
                            </span>
                            <span>
                                <FiMapPin aria-hidden="true" />
                                {selectedCandidate.location}
                            </span>
                            <span>
                                <FiCalendar aria-hidden="true" />
                                Applied{" "}
                                {formatDate(selectedCandidate.appliedAt)}
                            </span>
                            <span>
                                <FiUsers aria-hidden="true" />
                                Source: {selectedCandidate.source}
                            </span>
                        </div>
                        <div className={styles.note}>
                            <strong>Recruiter note</strong>
                            <p>
                                {selectedCandidate.note ||
                                    "No recruiter note added yet."}
                            </p>
                        </div>
                        <section className={styles.interviewSection}>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <h3>Interviews</h3>
                                    <p>Schedule conversations and track interviewer feedback.</p>
                                </div>
                                <button className={styles.secondaryButton} onClick={() => setInterviewCandidate(selectedCandidate)} type="button">
                                    <FiCalendar aria-hidden="true" /> Schedule
                                </button>
                            </div>
                            {interviews.filter((item) => item.candidateId === selectedCandidate.id).length ? (
                                <div className={styles.interviewList}>
                                    {interviews.filter((item) => item.candidateId === selectedCandidate.id).map((interview) => (
                                        <article className={styles.interviewRow} key={interview.id}>
                                            <span className={styles.interviewIcon}><FiCalendar aria-hidden="true" /></span>
                                            <span className={styles.interviewInfo}>
                                                <strong>{interview.kind}</strong>
                                                <small>{formatInterviewDate(interview.scheduledAt)} · {interview.interviewer}</small>
                                            </span>
                                            <span className={`${styles.interviewStatus} ${styles[interview.status.toLowerCase()]}`}>{interview.status}</span>
                                            {interview.status === "Scheduled" && <button className={styles.inlineAction} onClick={() => finishInterview(interview)} type="button">Complete</button>}
                                            {interview.status === "Scheduled" && <button aria-label={`Cancel ${interview.kind}`} className={styles.inlineAction} onClick={() => setPendingInterviewCancel(interview)} type="button">Cancel</button>}
                                        </article>
                                    ))}
                                </div>
                            ) : <p className={styles.emptyInline}>No interviews scheduled for this candidate yet.</p>}
                        </section>
                        <section className={styles.scorecardSection}>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <h3>Interview scorecards</h3>
                                    <p>Structured feedback for a consistent hiring decision.</p>
                                </div>
                                <button className={styles.secondaryButton} onClick={() => setScorecardCandidate(selectedCandidate)} type="button">
                                    <FiClipboard aria-hidden="true" /> Add scorecard
                                </button>
                            </div>
                            {(selectedCandidate.scorecards || []).length ? (
                                <div className={styles.scorecardList}>
                                    {selectedCandidate.scorecards.map((scorecard) => {
                                        const values = Object.values(scorecard.scores);
                                        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
                                        return <article className={styles.scorecard} key={scorecard.id}>
                                            <div><strong>{average.toFixed(1)} / 5</strong><time>{formatInterviewDate(scorecard.createdAt)}</time></div>
                                            <p>{scorecard.notes || "No written feedback was added."}</p>
                                            <span>Role skills {scorecard.scores.roleSkills} · Communication {scorecard.scores.communication} · Problem solving {scorecard.scores.problemSolving} · Collaboration {scorecard.scores.collaboration}</span>
                                        </article>;
                                    })}
                                </div>
                            ) : <p className={styles.emptyInline}>No scorecards yet. Capture structured feedback after a conversation.</p>}
                        </section>
                        <div className={styles.detailActions}>
                            <button
                                className={styles.dangerButton}
                                onClick={() => {
                                    setPendingDelete(selectedCandidate);
                                    setSelectedCandidate(null);
                                }}
                                type="button"
                            >
                                <FiTrash2 aria-hidden="true" />
                                Remove
                            </button>
                            <button
                                className={styles.primaryButton}
                                onClick={() => {
                                    setEditingCandidate(selectedCandidate);
                                    setSelectedCandidate(null);
                                    setDialogOpen(true);
                                }}
                                type="button"
                            >
                                <FiEdit2 aria-hidden="true" />
                                Edit details
                            </button>
                        </div>
                    </div>
                </Dialog>
            )}
            {pendingDelete && (
                <Dialog
                    description={
                        "This removes " +
                        pendingDelete.name +
                        " from your local hiring workspace. This action cannot be undone."
                    }
                    initialFocusRef={cancelRef}
                    onClose={() => setPendingDelete(null)}
                    size="small"
                    title="Remove candidate?"
                >
                    <div className={styles.confirmActions}>
                        <button
                            className={styles.secondaryButton}
                            onClick={() => setPendingDelete(null)}
                            ref={cancelRef}
                            type="button"
                        >
                            Keep candidate
                        </button>
                        <button
                            className={styles.dangerSolidButton}
                            onClick={removeCandidate}
                            type="button"
                        >
                            Remove candidate
                        </button>
                    </div>
                </Dialog>
            )}
            {interviewCandidate && (
                <Dialog description={`Choose a time and interviewer for ${interviewCandidate.name}.`} onClose={() => setInterviewCandidate(null)} title="Schedule an interview">
                    <InterviewForm candidate={interviewCandidate} onCancel={() => setInterviewCandidate(null)} onSave={saveInterview} />
                </Dialog>
            )}
            {scorecardCandidate && (
                <Dialog description={`Rate the interview criteria for ${scorecardCandidate.name}.`} onClose={() => setScorecardCandidate(null)} title="Add interview scorecard">
                    <ScorecardForm onCancel={() => setScorecardCandidate(null)} onSave={(scorecard) => saveScorecard(scorecardCandidate, scorecard)} />
                </Dialog>
            )}
            {pendingInterviewCancel && (
                <Dialog description={`${pendingInterviewCancel.kind} with ${pendingInterviewCancel.interviewer} will be marked cancelled.`} onClose={() => setPendingInterviewCancel(null)} size="small" title="Cancel this interview?">
                    <div className={styles.confirmActions}>
                        <button className={styles.secondaryButton} onClick={() => setPendingInterviewCancel(null)} type="button">Keep interview</button>
                        <button className={styles.dangerSolidButton} onClick={cancelInterview} type="button">Cancel interview</button>
                    </div>
                </Dialog>
            )}
        </section>
    );
};

export default CandidatesPage;
