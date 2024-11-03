import React from "react";

function SideEffectBarChart({ title, data, barColor }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="space-y-4">
                {data.map((prob, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span>{prob.label}</span>
                            <span>{prob.value.toFixed(2) * 100}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded h-6">
                            <div
                                className={`h-6 rounded ${barColor}`}
                                style={{ width: `${prob.value * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SideEffectBarChart;
