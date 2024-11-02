import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideEffectBarChart from "../components/SideEffectBarChart";
import TestimoniesSummary from "../components/TestimoniesSummary";
import ActionableInsights from "../components/ActionableInsights";

function Results() {
    const location = useLocation();
    const { age, weight, medicalHistory } = location.state || {};
    const [
        mostCommonSideEffectsProbabilities,
        setMostCommonSideEffectsProbabilities,
    ] = useState([]);
    const [
        mostSevereSideEffectsProbabilities,
        setMostSevereSideEffectsProbabilities,
    ] = useState([]);

    useEffect(() => {
        // Generate random probabilities for demonstration purposes
        setMostCommonSideEffectsProbabilities([
            { label: "Side Effect A", value: Math.random() * 100 },
            { label: "Side Effect B", value: Math.random() * 100 },
            { label: "Side Effect C", value: Math.random() * 100 },
            { label: "Side Effect D", value: Math.random() * 100 },
        ]);

        setMostSevereSideEffectsProbabilities([
            { label: "Side Effect A", value: Math.random() * 100 },
            { label: "Side Effect B", value: Math.random() * 100 },
            { label: "Side Effect C", value: Math.random() * 100 },
            { label: "Side Effect D", value: Math.random() * 100 },
        ]);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-6">Analysis Results</h2>

            {/* Patient Information */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">
                    Patient Information:
                </h3>
                <p>Age: {age}</p>
                <p>Weight: {weight} kg</p>
                <p>Medical History: {medicalHistory}</p>
            </div>

            {/* Most Common Side Effects */}
            <SideEffectBarChart
                title="Most Common Reported Side Effects:"
                data={mostCommonSideEffectsProbabilities}
                barColor="bg-blue-500"
            />

            {/* Most Severe Side Effects */}
            <SideEffectBarChart
                title="Most Severe Reported Side Effects:"
                data={mostSevereSideEffectsProbabilities}
                barColor="bg-red-500"
            />

            {/* Testimonies Summary */}
            <TestimoniesSummary />

            {/* Actionable Insights */}
            <ActionableInsights />
        </div>
    );
}

export default Results;
