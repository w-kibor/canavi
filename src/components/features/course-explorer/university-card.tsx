import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UniversityCardProps {
    name: string;
    courseCount: number;
    onClick: () => void;
    isSelected: boolean;
}

export function UniversityCard({ name, courseCount, onClick, isSelected }: UniversityCardProps) {
    return (
        <div
            className={`
                group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                ${isSelected
                    ? "bg-blue-50 border-blue-200 shadow-md scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-blue-100 hover:shadow-lg hover:-translate-y-1"
                }
            `}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`
                    p-3 rounded-xl transition-colors
                    ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"}
                `}>
                    <GraduationCap className="w-8 h-8" />
                </div>
                <Badge variant={isSelected ? "default" : "secondary"} className="rounded-full">
                    {courseCount} Courses
                </Badge>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                    Browse all available undergraduate and postgraduate programs.
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium">
                <span className={isSelected ? "text-blue-700" : "text-slate-600 group-hover:text-blue-600"}>
                    {isSelected ? "Currently Viewing" : "Explore Programs"}
                </span>
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "translate-x-0 text-blue-600" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-blue-600"}`} />
            </div>
        </div>
    );
}
