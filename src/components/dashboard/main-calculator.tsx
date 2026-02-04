"use client";

import { useState } from "react";
import { GradePicker } from "@/components/features/grade-intake/grade-picker";
import { ClusterResults } from "@/components/features/grade-intake/cluster-results";
import { ChatInterface } from "@/components/features/agent/chat-interface";
import { calculateAggregate, calculateClusterPoints, ClusterResult } from "@/lib/logic/cluster-calculator";
import { StudentSubject } from "@/lib/logic/subject-mapping";
import { MOCK_CLUSTERS } from "@/lib/data/clusters";

export function MainCalculator() {
    const [results, setResults] = useState<ClusterResult[] | null>(null);
    const [aggregate, setAggregate] = useState<number>(0);
    const [grades, setGrades] = useState<StudentSubject[] | null>(null);

    const handleCalculate = (currentGrades: StudentSubject[]) => {
        // 0. Update Grades State
        setGrades(currentGrades);

        // 1. Calculate Aggregate
        const agg = calculateAggregate(currentGrades);
        setAggregate(agg);

        // 2. Calculate Clusters
        const clusterResults = MOCK_CLUSTERS.map((cluster) =>
            calculateClusterPoints(currentGrades, cluster)
        );
        setResults(clusterResults);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                    KCSE Career Navigator
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Calculate your weighted cluster points and discover your eligible courses for KUCCPS placement.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12 xl:col-span-5">
                    <GradePicker onCalculate={handleCalculate} />
                </div>

                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    {results ? (
                        <>
                            <ClusterResults aggregate={aggregate} results={results} />
                            <ChatInterface grades={grades!} hasCalculated={true} />
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                            <div className="text-center">
                                <p>Enter your grades to view your cluster points.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
