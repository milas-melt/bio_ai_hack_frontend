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
    const [selectedAttribute, setSelectedAttribute] = useState("age");
    const [showAdvancedDiagnostic, setShowAdvancedDiagnostic] = useState(false);

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
        return (
            <div className="flex justify-center items-center h-screen">
                <div
                    className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
                    role="status"
                    aria-label="Loading"
                ></div>
            </div>
        );
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

    // Extract attribute options, excluding "age weight sex"
    const attributeOptions = mostCommon
        .map((entry) => entry[0])
        .filter((attr) => attr !== "age weight sex");

    // Find data for the selected attribute
    const selectedAttributeEntry = mostCommon.find(
        (entry) => entry[0] === selectedAttribute
    );

    let attributeSideEffectData = [];
    if (selectedAttributeEntry && selectedAttributeEntry.length > 1) {
        const reactions = selectedAttributeEntry[1];
        attributeSideEffectData = reactions.map((item) => ({
            label: item[0],
            value: item[1],
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

            {/* Toggle Button for Advanced Diagnostic */}
            <button
                onClick={() =>
                    setShowAdvancedDiagnostic(!showAdvancedDiagnostic)
                }
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
                {showAdvancedDiagnostic
                    ? "Hide Advanced Diagnostic"
                    : "Show Advanced Diagnostic"}
            </button>

            {/* Advanced Diagnostic Section */}
            <div
                className={`mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
                    showAdvancedDiagnostic
                        ? "max-h-screen opacity-100 delay-200"
                        : "max-h-0 opacity-0 delay-200"
                }`}
            >
                <h3 className="text-xl font-semibold mb-4">
                    Advanced Diagnostic
                </h3>
                <div className="flex border-b mb-4">
                    {attributeOptions.map((attribute) => (
                        <button
                            key={attribute}
                            onClick={() => setSelectedAttribute(attribute)}
                            className={`mr-4 pb-2 focus:outline-none ${
                                selectedAttribute === attribute
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500 hover:text-blue-500"
                            }`}
                        >
                            {attribute.charAt(0).toUpperCase() +
                                attribute.slice(1)}
                        </button>
                    ))}
                </div>
                {attributeSideEffectData.length > 0 ? (
                    <SideEffectBarChart
                        title={`Side Effects for ${
                            selectedAttribute.charAt(0).toUpperCase() +
                            selectedAttribute.slice(1)
                        }`}
                        data={attributeSideEffectData}
                        barColor="bg-green-500"
                    />
                ) : (
                    <p>No data available for {selectedAttribute}.</p>
                )}
            </div>

            {/* Additional components if needed */}
            {/* <TestimoniesSummary data={testimony} /> */}
            {/* <ActionableInsights data={actionable_insights} /> */}
        </div>
    );
}

export default Results;
