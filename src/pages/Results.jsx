import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideEffectBarChart from "../components/SideEffectBarChart";
import TestimoniesSummary from "../components/TestimoniesSummary";
import ActionableInsights from "../components/ActionableInsights";

function Results() {
    const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
    const location = useLocation();
    const { age, weight, sex, ethnicity } = location.state || {};
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const queryParams = new URLSearchParams({
                    age,
                    weight,
                    sex,
                    ethnicity,
                });

                const response = await fetch(
                    `${API_BASE_URL}/dashboard?${queryParams.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchDashboardData();
    }, [age, weight, sex, ethnicity]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    const { patient_info, probabilities, testimony, actionable_insights } =
        dashboardData;

    // Extract the "most_common" array
    const mostCommon = probabilities.most_common;

    // Find the entry with the key "age weight sex"
    const jointReactionsEntry = mostCommon.find(
        (entry) => entry[0] === "age weight sex"
    );

    // Map the reactions data to the format expected by SideEffectBarChart
    let sideEffectData = [];
    if (jointReactionsEntry && jointReactionsEntry.length > 1) {
        const jointRelatedReactions = jointReactionsEntry[1]; // This is the reactions data
        sideEffectData = jointRelatedReactions.map((item) => ({
            label: item[0], // Reaction name
            value: item[1], // Probability
        }));
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-6">Analysis Results</h2>

            {/* Patient Information */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">
                    Patient Information:
                </h3>
                <p>Age: {patient_info.age}</p>
                <p>Weight: {patient_info.weight} kg</p>
                <p>Sex: {patient_info.sex}</p>
                <p>Ethnicity: {patient_info.ethnicity}</p>
            </div>

            {/* Most Common Side Effects */}
            {sideEffectData.length > 0 ? (
                <SideEffectBarChart
                    title="Most Common Side Effects"
                    data={sideEffectData}
                    barColor="bg-blue-500"
                />
            ) : (
                <p>No side effects data available.</p>
            )}

            {/* Additional components if needed */}
            {/* <TestimoniesSummary data={testimony} /> */}
            {/* <ActionableInsights data={actionable_insights} /> */}
        </div>
    );
}

export default Results;
