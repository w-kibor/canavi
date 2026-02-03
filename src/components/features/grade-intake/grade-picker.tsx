"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Grade, SUBJECTS, Subject, StudentSubject } from "@/lib/logic/subject-mapping";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface GradePickerProps {
    onCalculate: (grades: StudentSubject[]) => void;
}

const GRADES: Grade[] = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

export function GradePicker({ onCalculate }: GradePickerProps) {
    // Initialize with Compulsory: Math, Eng, Kisw
    const [subjects, setSubjects] = useState<StudentSubject[]>([
        { subjectCode: "101", grade: "A" }, // Eng
        { subjectCode: "102", grade: "A" }, // Kisw
        { subjectCode: "121", grade: "A" }, // Math
    ]);

    const [availableSubjects] = useState<Subject[]>(SUBJECTS);

    const addSubject = () => {
        // Find first unused subject
        const unused = availableSubjects.find(
            (s) => !subjects.some((us) => us.subjectCode === s.code)
        );
        if (unused) {
            setSubjects([...subjects, { subjectCode: unused.code, grade: "A" }]);
        }
    };

    const removeSubject = (index: number) => {
        // Prevent removing first 3 (Compulsory)
        if (index < 3) return;
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const updateSubject = (index: number, code: string) => {
        const newSubjects = [...subjects];
        newSubjects[index].subjectCode = code;
        setSubjects(newSubjects);
    };

    const updateGrade = (index: number, grade: Grade) => {
        const newSubjects = [...subjects];
        newSubjects[index].grade = grade;
        setSubjects(newSubjects);
    };

    const isValid = subjects.length >= 7;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Enter Your Grades</CardTitle>
                <p className="text-sm text-slate-500">Select at least 7 subjects to calculate your cluster points.</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subjects.map((studentSubject, index) => {
                        const isCompulsory = index < 3;
                        // Filter list to exclude already selected subjects (except current one)
                        const options = availableSubjects.filter(
                            (s) =>
                                s.code === studentSubject.subjectCode ||
                                !subjects.some((us) => us.subjectCode === s.code)
                        );

                        return (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="w-8 text-sm text-slate-400 font-mono text-center">
                                    {index + 1}.
                                </div>
                                <div className="flex-1">
                                    <select
                                        className={cn(
                                            "w-full p-2 rounded-md border text-slate-700 bg-white",
                                            isCompulsory && "bg-slate-100 cursor-not-allowed"
                                        )}
                                        value={studentSubject.subjectCode}
                                        onChange={(e) => updateSubject(index, e.target.value)}
                                        disabled={isCompulsory}
                                    >
                                        {options.map((s) => (
                                            <option key={s.code} value={s.code}>
                                                {s.code} - {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <select
                                        className="w-full p-2 rounded-md border text-slate-700 bg-white"
                                        value={studentSubject.grade}
                                        onChange={(e) => updateGrade(index, e.target.value as Grade)}
                                    >
                                        {GRADES.map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {!isCompulsory && (
                                    <Button
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-50 px-2"
                                        onClick={() => removeSubject(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                                {isCompulsory && <div className="w-10" />}
                            </div>
                        );
                    })}

                    <div className="pt-4 flex justify-between items-center border-t border-slate-200 mt-6">
                        <Button variant="outline" onClick={addSubject} disabled={subjects.length >= 8}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Subject
                        </Button>

                        <div className="flex flex-col items-end">
                            <Button onClick={() => onCalculate(subjects)} disabled={!isValid}>
                                Calculate Points
                            </Button>
                            {!isValid && (
                                <span className="text-xs text-red-500 mt-1">Add {7 - subjects.length} more subject(s)</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
