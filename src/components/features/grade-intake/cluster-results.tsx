import { ClusterResult } from "@/lib/logic/cluster-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClusterResultsProps {
    aggregate: number;
    results: ClusterResult[];
}

export function ClusterResults({ aggregate, results }: ClusterResultsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none">
                <CardHeader>
                    <CardTitle className="text-slate-300">Aggregate Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tighter text-blue-400">{aggregate} <span className="text-xl text-slate-500 font-normal">/ 84</span></div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Your Cluster Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((r) => (
                        <Card key={r.clusterId} className="border-slate-200 shadow-sm bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{r.clusterName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-slate-900">{r.points.toFixed(3)}</span>
                                    <span className="text-xs text-slate-400">/ 48.000</span>
                                </div>
                                {!r.qualified && (
                                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium">
                                        Missing Requirements
                                    </div>
                                )}
                                {r.qualified && (
                                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-medium">
                                        Qualified for Calc
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
