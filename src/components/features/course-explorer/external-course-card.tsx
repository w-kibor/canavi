"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalCourse } from "@/lib/data/courses";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExternalCourseCardProps {
    course: ExternalCourse;
}

export function ExternalCourseCard({ course }: ExternalCourseCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200 overflow-hidden flex flex-col h-full group">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600 w-full" />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                        {course.title}
                    </CardTitle>
                </div>
                <Badge variant="outline" className="w-fit mt-2 text-xs font-normal text-slate-600 bg-slate-50 border-slate-200">
                    {course.category}
                </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{course.department}</span>
                </div>

                {course.campus && (
                    <div className="flex items-start gap-2 text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1" title={course.campus}>{course.campus}</span>
                    </div>
                )}

                <div className="mt-auto pt-4">
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full gap-2 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50">
                            <span>View Details at {course.institution}</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
