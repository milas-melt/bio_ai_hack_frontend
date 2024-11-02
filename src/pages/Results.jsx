import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideEffectBarChart from "../components/SideEffectBarChart";
import TestimoniesSummary from "../components/TestimoniesSummary";
import ActionableInsights from "../components/ActionableInsights";

function Results() {
    const location = useLocation();
    const { age, weight, ethnicity } = location.state || {};
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5050/dashboard?age=${age}&weight=${weight}&ethnicity=${ethnicity}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        `HTTP error! status: ${response.status}, response: ${errorText}`
                    );
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError(error.message);
            }
        }

        fetchDashboardData();
    }, [age, weight, ethnicity]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    const { patient_info, probabilities, testimony, actionable_insights } =
        dashboardData;

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
                <p>Ethnicity: {patient_info.ethnicity}</p>
            </div>

            {/* Most Common Side Effects */}
            <SideEffectBarChart
                title="Most Common Reported Side Effects:"
                data={Object.entries(probabilities.most_common).map(
                    ([key, value]) => ({
                        label: key,
                        value: value.vomiting * 100, // Assuming you want to show vomiting probability
                    })
                )}
                barColor="bg-blue-500"
            />

            {/* Testimonies Summary */}
            <TestimoniesSummary testimony={testimony} />

            {/* Actionable Insights */}
            <ActionableInsights insights={actionable_insights} />
        </div>
    );
}

export default Results;
