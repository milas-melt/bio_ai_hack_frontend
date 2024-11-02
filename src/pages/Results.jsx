// src/pages/Results.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Results() {
    const location = useLocation();
    const { age, weight, medicalHistory } = location.state || {};
    const [probabilities, setProbabilities] = useState([]);
    const [
        mostCommonSideEffectsProbabilities,
        setMostCommonSideEffectsProbabilities,
    ] = useState([]);
    const [
        mostSevereSideEffectsProbabilities,
        setMostSevereSideEffectsProbabilities,
    ] = useState([]);

    useEffect(() => {
        // Generate random probabilities
        setMostCommonSideEffectsProbabilities([
            { label: "Side Effect A", value: Math.random() * 100 },
            { label: "Side Effect B", value: Math.random() * 100 },
            { label: "Side Effect C", value: Math.random() * 100 },
        ]);
        setMostSevereSideEffectsProbabilities([
            { label: "Side Effect A", value: Math.random() * 100 },
            { label: "Side Effect B", value: Math.random() * 100 },
            { label: "Side Effect C", value: Math.random() * 100 },
        ]);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-6">Analysis Results</h2>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">
                    Patient Information:
                </h3>
                <p>Age: {age}</p>
                <p>Weight: {weight} kg</p>
                <p>Medical History: {medicalHistory}</p>
            </div>
            <h3 className="text-xl font-semibold mb-4">
                Most common reported side effects:
            </h3>
            <div className="space-y-4">
                {mostCommonSideEffectsProbabilities.map((prob, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span>{prob.label}</span>
                            <span>{prob.value.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded h-6">
                            <div
                                className="bg-blue-500 h-6 rounded"
                                style={{ width: `${prob.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <h3 className="text-xl font-semibold mb-4">
                Most severe reported side effects:
            </h3>
            <div className="space-y-4">
                {mostSevereSideEffectsProbabilities.map((prob, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span>{prob.label}</span>
                            <span>{prob.value.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded h-6">
                            <div
                                className="bg-red-500 h-6 rounded"
                                style={{ width: `${prob.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Results;
