import { useState } from "react";
import AppRoutes from "./AppRoutes";
import styles from "./App.module.css";
import Footer from "./components/footer";
import Header from "./components/header";
import { initialCandidates, initialJobs } from "./data/seedData";

const App = () => {
    const [candidates, setCandidates] = useState(initialCandidates);
    const [jobs, setJobs] = useState(initialJobs);

    return (
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
                />
            </main>
            <Footer />
        </div>
    );
};

export default App;
