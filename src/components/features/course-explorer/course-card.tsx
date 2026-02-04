import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/data/courses";
import { GraduationCap, MapPin, Target } from "lucide-react";
import { cn } from "@/utils/cn";

interface CourseCardProps {
    course: Course;
    clusterName?: string;
}

export function CourseCard({ course, clusterName }: CourseCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200 overflow-hidden flex flex-col h-full group">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                        {course.name}
                    </CardTitle>
                </div>
                {clusterName && (
                    <Badge variant="secondary" className="w-fit mt-2 text-xs font-normal text-slate-600 bg-slate-100">
                        {clusterName}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{course.institution}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 text-sm mt-auto">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span>Cut-off: <span className="font-semibold text-emerald-700">{course.cop}</span> points</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span className="font-semibold">Key Requirements:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {course.minRequirements.map((req, i) => (
                            <span key={i} className="inline-flex items-center bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                Code {req.subjectCode}: {req.minGrade}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
