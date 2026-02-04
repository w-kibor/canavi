import { CourseCatalog } from "@/components/features/course-explorer/course-catalog";
import { Compass, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 rounded-lg p-1.5 group-hover:bg-blue-700 transition-colors">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">Canavi</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50">
                                Calculator
                            </Button>
                        </Link>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            Explore Degrees
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-2">
                        <Compass className="w-4 h-4" />
                        <span>Discover Your Future</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Explore Diverse Degree Courses
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Don't limit yourself to the usual choices. Browse through hundreds of unique degree programs, filter by your interests, and find the perfect match for your grades.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <CourseCatalog />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-white py-12 mt-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Canavi. Making career guidance accessible to all students.</p>
                    <p className="text-slate-400 text-xs mt-2">Data is based on mock samples for demonstration.</p>
                </div>
            </div>
        </main>
    );
}
