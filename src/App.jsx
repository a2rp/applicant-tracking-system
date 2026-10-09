import { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import styles from "./App.module.css";
import Footer from "./components/footer";
import Header from "./components/header";
import { initialCandidates, initialJobs } from "./data/seedData";

const readStoredData = (key, initialValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
        return initialValue;
    }
};

const App = () => {
    const [candidates, setCandidates] = useState(() => readStoredData("hirly-candidates-v1", initialCandidates));
    const [jobs, setJobs] = useState(() => readStoredData("hirly-jobs-v1", initialJobs));

    useEffect(() => {
        localStorage.setItem("hirly-candidates-v1", JSON.stringify(candidates));
    }, [candidates]);

    useEffect(() => {
        localStorage.setItem("hirly-jobs-v1", JSON.stringify(jobs));
    }, [jobs]);

    return (
        <div className={styles.appShell}>
            <a className={styles.skipLink} href="#main-content">Skip to content</a>
            <Header candidateCount={candidates.length} />
            <main className={styles.main} id="main-content">
                <AppRoutes candidates={candidates} jobs={jobs} setCandidates={setCandidates} setJobs={setJobs} />
            </main>
            <Footer />
        </div>
    );
};

export default App;