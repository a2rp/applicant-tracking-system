import { useCallback, useState } from "react";
import AppRoutes from "./AppRoutes";
import styles from "./App.module.css";
import Footer from "./components/footer";
import Header from "./components/header";
import { ToastProvider } from "./components/toast";
import {
    createInitialActivity,
    createInitialInterviews,
    initialCandidates,
    initialJobs,
    stages as initialStages,
} from "./data/seedData";

const App = () => {
    const [candidates, setCandidates] = useState(initialCandidates);
    const [jobs, setJobs] = useState(initialJobs);
    const [interviews, setInterviews] = useState(createInitialInterviews);
    const [activity, setActivity] = useState(createInitialActivity);
    const [stages, setStages] = useState(initialStages);
    const recordActivity = useCallback((entry) => {
        setActivity((current) => [
            { id: `activity-${Date.now()}`, createdAt: new Date().toISOString(), ...entry },
            ...current,
        ].slice(0, 30));
    }, []);

    return (
        <ToastProvider>
            <div className={styles.appShell}>
                <a className={styles.skipLink} href="#main-content">
                    Skip to content
                </a>
                <Header candidateCount={candidates.length} />
                <main className={styles.main} id="main-content">
                    <AppRoutes
                        candidates={candidates}
                        jobs={jobs}
                        setCandidates={setCandidates}
                        setJobs={setJobs}
                        interviews={interviews}
                        setInterviews={setInterviews}
                        activity={activity}
                        recordActivity={recordActivity}
                        stages={stages}
                        setStages={setStages}
                    />
                </main>
                <Footer />
            </div>
        </ToastProvider>
    );
};

export default App;
