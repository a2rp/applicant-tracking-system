import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const DashboardPage = lazy(() => import("./pages/dashboard/index.jsx"));
const CandidatesPage = lazy(() => import("./pages/candidates/index.jsx"));
const JobsPage = lazy(() => import("./pages/jobs/index.jsx"));
const PipelinePage = lazy(() => import("./pages/pipeline/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({
    candidates,
    jobs,
    setCandidates,
    setJobs,
    interviews,
    setInterviews,
    activity,
    recordActivity,
    stages,
    setStages,
}) => {
    const location = useLocation();
    const pageProps = {
        candidates,
        jobs,
        setCandidates,
        setJobs,
        interviews,
        setInterviews,
        activity,
        recordActivity,
        stages,
        setStages,
    };

    return (
        <Suspense fallback={<Loading />} key={location.pathname}>
            <Routes location={location}>
                <Route path="/" element={<DashboardPage {...pageProps} />} />
                <Route
                    path="/candidates"
                    element={
                        <CandidatesPage key={location.search} {...pageProps} />
                    }
                />
                <Route path="/jobs" element={<JobsPage {...pageProps} />} />
                <Route
                    path="/pipeline"
                    element={<PipelinePage {...pageProps} />}
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
