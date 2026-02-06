"use client";

import { useState, useMemo } from "react";
import { Course, MOCK_COURSES, ExternalCourse } from "@/lib/data/courses";
import { MOCK_CLUSTERS } from "@/lib/data/clusters";
import KU_COURSES_DATA from "@/data/ku_courses.json";
import { ExternalCourseCard } from "@/components/features/course-explorer/external-course-card";
import { CourseCard } from "./course-card";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export function CourseCatalog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"recommended" | "catalog">("recommended");

    // Cast the JSON data to the interface
    const externalCourses: ExternalCourse[] = KU_COURSES_DATA as ExternalCourse[];

    // Get unique cluster IDs that actually have courses, plus names
    const availableClusters = useMemo(() => {
        return MOCK_CLUSTERS.map(c => ({
            id: c.id,
            name: c.name.replace(/Cluster \d+: /, "") // Clean name for chips
        }));
    }, []);

    const filteredCourses = useMemo(() => {
        return MOCK_COURSES.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.institution.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCluster = selectedClusterId ? course.clusterId === selectedClusterId : true;

            return matchesSearch && matchesCluster;
        });
    }, [searchQuery, selectedClusterId]);

    const filteredExternalCourses = useMemo(() => {
        return externalCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.department.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [searchQuery, externalCourses]);

    return (
        <div className="space-y-8">
            {/* Search and Filter Section */}
            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-4 border-b border-slate-100 pb-4">
                    <Button
                        variant={activeTab === "recommended" ? "default" : "ghost"}
                        onClick={() => setActiveTab("recommended")}
                        className="rounded-full"
                    >
                        Recommended For You
                    </Button>
                    <Button
                        variant={activeTab === "catalog" ? "default" : "ghost"}
                        onClick={() => setActiveTab("catalog")}
                        className="rounded-full"
                    >
                        University Catalog
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search courses or institutions..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <BookOpen className="w-4 h-4" />
                        <span>Showing <strong>{activeTab === "recommended" ? filteredCourses.length : filteredExternalCourses.length}</strong> courses</span>
                    </div>
                </div>
            </div>

            {/* Cluster Categories - Only for Recommended Tab */}
            {activeTab === "recommended" && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Filter className="w-4 h-4" />
                        Filter by Field:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedClusterId === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedClusterId(null)}
                            className={cn("rounded-full", selectedClusterId === null ? "bg-blue-600" : "text-slate-600")}
                        >
                            All Fields
                        </Button>
                        {availableClusters.map((cluster) => (
                            <Button
                                key={cluster.id}
                                variant={selectedClusterId === cluster.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedClusterId(cluster.id)}
                                className={cn("rounded-full", selectedClusterId === cluster.id ? "bg-blue-600" : "text-slate-600")}
                            >
                                {cluster.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Course Grid */}
            {activeTab === "recommended" ? (
                filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                clusterName={availableClusters.find(c => c.id === course.clusterId)?.name}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onClear={() => { setSearchQuery(""); setSelectedClusterId(null); }} />
                )
            ) : (
                filteredExternalCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExternalCourses.map((course, i) => (
                            <ExternalCourseCard key={i} course={course} />
                        ))}
                    </div>
                ) : (
                    <EmptyState onClear={() => setSearchQuery("")} />
                )
            )}
        </div>
    );
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
            <Button
                variant="link"
                onClick={onClear}
                className="mt-2 text-blue-600"
            >
                Clear all filters
            </Button>
        </div>
    );
}

