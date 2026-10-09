import { useMemo, useRef, useState } from "react";
import { FiBriefcase, FiEdit2, FiMapPin, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import CandidateAvatar from "../../components/candidateAvatar";
import Dialog from "../../components/dialog";
import styles from "./styles.module.css";

const JobForm = ({ job, onCancel, onSave }) => {
    const [values, setValues] = useState(() => ({
        title: job?.title || "",
        department: job?.department || "Engineering",
        location: job?.location || "",
        type: job?.type || "Full-time",
        salary: job?.salary || "",
        hiringManager: job?.hiringManager || "",
    }));
    const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    const submitForm = (event) => {
        event.preventDefault();
        onSave({ ...job, ...values, id: job?.id || "role-" + Date.now(), status: job?.status || "Open", createdAt: job?.createdAt || new Date().toISOString().slice(0, 10) });
    };

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <div className={styles.fieldGrid}>
                <label className={styles.field}><span>Role title</span><input maxLength="80" name="title" onChange={updateValue} placeholder="e.g. Product Designer" required value={values.title} /></label>
                <label className={styles.field}><span>Department</span><select name="department" onChange={updateValue} value={values.department}><option>Engineering</option><option>Design</option><option>Marketing</option><option>People</option><option>Analytics</option><option>Customer</option><option>Operations</option></select></label>
                <label className={styles.field}><span>Location</span><input name="location" onChange={updateValue} placeholder="Remote, US" required value={values.location} /></label>
                <label className={styles.field}><span>Employment type</span><select name="type" onChange={updateValue} value={values.type}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label>
                <label className={styles.field}><span>Salary range</span><input name="salary" onChange={updateValue} placeholder="$100k - $130k" value={values.salary} /></label>
                <label className={styles.field}><span>Hiring manager</span><input name="hiringManager" onChange={updateValue} placeholder="Name" required value={values.hiringManager} /></label>
            </div>
            <div className={styles.formActions}><button className={styles.secondaryButton} onClick={onCancel} type="button">Cancel</button><button className={styles.primaryButton} type="submit">{job ? "Save changes" : "Create role"}</button></div>
        </form>
    );
};

const JobsPage = ({ jobs, candidates, setJobs, setCandidates }) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All roles");
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [notice, setNotice] = useState("");
    const cancelRef = useRef(null);

    const visibleJobs = useMemo(() => jobs.filter((job) => {
        const query = search.trim().toLowerCase();
        return (!query || job.title.toLowerCase().includes(query) || job.department.toLowerCase().includes(query) || job.location.toLowerCase().includes(query))
            && (statusFilter === "All roles" || job.status === statusFilter);
    }), [jobs, search, statusFilter]);

    const notify = (message) => {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2600);
    };
    const saveJob = (job) => {
        setJobs((current) => current.some((item) => item.id === job.id)
            ? current.map((item) => item.id === job.id ? job : item)
            : [job, ...current]);
        setEditorOpen(false);
        notify(editingJob ? "Role details updated" : "Role created");
        setEditingJob(null);
    };
    const updateStatus = (id, status) => {
        setJobs((current) => current.map((job) => job.id === id ? { ...job, status } : job));
        notify("Role marked " + status.toLowerCase());
    };
    const removeJob = () => {
        setJobs((current) => current.filter((job) => job.id !== pendingDelete.id));
        setCandidates((current) => current.map((candidate) => candidate.jobId === pendingDelete.id ? { ...candidate, jobId: "" } : candidate));
        setPendingDelete(null);
        notify("Role removed. Candidate profiles were kept.");
    };

    return (
        <section className={styles.jobsPage}>
            <div className={styles.pageHeader}>
                <div><p className={styles.breadcrumb}>Workspace / Jobs</p><h1>Jobs</h1><p className={styles.description}>Give every search a clear owner and a healthy pipeline.</p></div>
                <button className={styles.primaryButton} onClick={() => { setEditingJob(null); setEditorOpen(true); }} type="button"><FiPlus aria-hidden="true" />Create role</button>
            </div>

            <div className={styles.summaryGrid}>
                <div><span className={styles.summaryIcon}><FiBriefcase aria-hidden="true" /></span><span><strong>{jobs.filter((job) => job.status === "Open").length}</strong><small>open roles</small></span></div>
                <div><span className={styles.summaryIcon}><FiUsers aria-hidden="true" /></span><span><strong>{candidates.filter((candidate) => !["Hired", "Rejected"].includes(candidate.stage)).length}</strong><small>active candidates</small></span></div>
                <div><span className={styles.summaryIcon}><span className={styles.dotIcon} /></span><span><strong>{new Set(jobs.filter((job) => job.status === "Open").map((job) => job.department)).size}</strong><small>teams hiring</small></span></div>
            </div>

            <div className={styles.toolbar}>
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input aria-label="Search roles" onChange={(event) => setSearch(event.target.value)} placeholder="Search role, team, or location" value={search} /></label>
                <label className={styles.statusFilter}><span>Show</span><select aria-label="Filter roles by status" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All roles</option><option>Open</option><option>Paused</option><option>Closed</option></select></label>
                <span className={styles.resultCount}>{visibleJobs.length} roles</span>
            </div>

            <div className={styles.sectionTitle}><div><h2>Your roles</h2><p>{jobs.length} searches in this workspace</p></div></div>
            <div className={styles.jobGrid}>
                {visibleJobs.map((job) => {
                    const applicants = candidates.filter((candidate) => candidate.jobId === job.id);
                    const activeApplicants = applicants.filter((candidate) => candidate.stage !== "Rejected");
                    const statusClass = styles[job.status.toLowerCase()];
                    return (
                        <article className={styles.jobCard} key={job.id}>
                            <div className={styles.jobCardTop}>
                                <span className={styles.jobIcon}><FiBriefcase aria-hidden="true" /></span>
                                <label className={styles.jobStatus}>
                                    <span className={styles.visuallyHidden}>Change {job.title} status</span>
                                    <select aria-label={"Change " + job.title + " status"} className={statusClass} onChange={(event) => updateStatus(job.id, event.target.value)} value={job.status}><option>Open</option><option>Paused</option><option>Closed</option></select>
                                </label>
                            </div>
                            <h3>{job.title}</h3>
                            <p className={styles.department}>{job.department}</p>
                            <div className={styles.jobMeta}><span><FiMapPin aria-hidden="true" />{job.location}</span><span>{job.type}</span></div>
                            <div className={styles.applicantRow}>
                                <div className={styles.avatarStack}>{applicants.slice(0, 3).map((candidate) => <CandidateAvatar candidate={candidate} key={candidate.id} size="small" />)}{applicants.length > 3 && <span className={styles.moreApplicants}>+{applicants.length - 3}</span>}</div>
                                <NavLink to={"/candidates?search=" + encodeURIComponent(job.title)}>{activeApplicants.length} candidates</NavLink>
                            </div>
                            <div className={styles.jobFooter}>
                                <span><small>Hiring manager</small><strong>{job.hiringManager}</strong></span>
                                <span className={styles.cardActions}>
                                    <button aria-label={"Edit " + job.title} onClick={() => { setEditingJob(job); setEditorOpen(true); }} type="button"><FiEdit2 aria-hidden="true" /></button>
                                    <button aria-label={"Remove " + job.title} onClick={() => setPendingDelete(job)} type="button"><FiTrash2 aria-hidden="true" /></button>
                                </span>
                            </div>
                        </article>
                    );
                })}
                {!visibleJobs.length && <div className={styles.emptyState}><FiSearch aria-hidden="true" /><strong>No roles found</strong><span>Try another search or create a new role.</span></div>}
            </div>

            {notice && <div aria-live="polite" className={styles.notice} role="status">{notice}</div>}
            {editorOpen && <Dialog description={editingJob ? "Update the role details and hiring owner." : "Set up a search for your team."} onClose={() => setEditorOpen(false)} title={editingJob ? "Edit role" : "Create a role"}><JobForm job={editingJob} onCancel={() => setEditorOpen(false)} onSave={saveJob} /></Dialog>}
            {pendingDelete && <Dialog description={"Candidates assigned to " + pendingDelete.title + " will stay in your workspace without a role assignment."} initialFocusRef={cancelRef} onClose={() => setPendingDelete(null)} size="small" title="Remove this role?"><div className={styles.confirmActions}><button className={styles.secondaryButton} onClick={() => setPendingDelete(null)} ref={cancelRef} type="button">Keep role</button><button className={styles.dangerButton} onClick={removeJob} type="button">Remove role</button></div></Dialog>}
        </section>
    );
};

export default JobsPage;
