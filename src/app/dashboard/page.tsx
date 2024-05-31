'use client'
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthActions, JobActions } from "../auth/utils";
import { useRouter } from "next/navigation";

type JobData = {
    id: string;
    job_name: string;
    company_name: string;
};  

const Dashboard = () => {
    const router = useRouter();
    const { logout, removeToken } = AuthActions();
    const { searchJobs } = JobActions();

    const { register, handleSubmit, formState: { errors } } = useForm<{ jobTitle: string }>();
    const [jobs, setJobs] = useState<JobData[]>([]);

    const handleLogout = async () => {
        try {
            const response = await logout();

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail)
            }

            removeToken()
            router.push("/")
        } catch (err) {
            removeToken();
            router.push("/");
        }
    };

    const onSubmit = async (data: { jobTitle: string }) => {
        try {
            const response = await searchJobs(data.jobTitle);

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }

            const jobList = await response.json();
            setJobs(jobList.data);
        } catch (err) {
            setJobs([])
            console.error("Job search error:", err);
        }
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const response = await searchJobs("");
                console.log(response.ok)
                if(!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData)
                }

                const jobList = await response.json();
                setJobs(jobList.data);
            } catch (err) {
                console.error("Error fetching all jobs:", err);
            }
        };

        fetchAllJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
                <h1 className="text-[black] text-xl text-rose-800 font-bold">Job Hunter</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <input
                        type="text"
                        placeholder="Enter job title"
                        {...register("jobTitle")}
                        className="w-full px-4 py-2 mt-2 text-[black] border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.jobTitle && (
                        <span className="text-xs text-red-600">
                            {errors.jobTitle.message}
                        </span>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                </form>
                <div className="mt-8 text-[black]">
                    <h3 className="text-lg font-semibold mb-4">Jobs</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border">Job Name</th>
                                    <th className="px-4 py-2 border">Company Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="text-center border">No results yet</td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="bg-white">
                                            <td className="px-4 py-2 border">{job.job_name}</td>
                                            <td className="px-4 py-2 border">{job.company_name}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-8 hover:bg-red-700 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
