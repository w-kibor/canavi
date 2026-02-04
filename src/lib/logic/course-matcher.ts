import { ClusterResult } from "./cluster-calculator";
import { Course } from "../data/courses";
import { StudentSubject, GRADE_POINTS } from "./subject-mapping";

export type EligibilityStatus = "Eligible" | "MissedCOP" | "MissedSubject";

export interface EligibilityResult {
    course: Course;
    status: EligibilityStatus;
    missingRequirements: string[]; // Details like "Math (Need C+, Got C)"
}

export function checkEligibility(
    course: Course,
    studentGrades: StudentSubject[],
    clusterResults: ClusterResult[]
): EligibilityResult {
    const missingReqs: string[] = [];

    // 1. Check Cluster Points (COP)
    const studentCluster = clusterResults.find((c) => c.clusterId === course.clusterId);
    const studentPoints = studentCluster ? studentCluster.points : 0;

    if (studentPoints < course.cop) {
        // If points are lower, it's a COP fail.
        // However, we also want to check subjects to give full feedback.
        // Ideally "MissedCOP" is primary reason if subjects are okay.
    }

    // 2. Check Subject Requirements
    let missedSubjects = false;
    for (const req of course.minRequirements) {
        const studentSub = studentGrades.find((s) => s.subjectCode === req.subjectCode);
        if (!studentSub) {
            missingReqs.push(`Subject ${req.subjectCode} missing`);
            missedSubjects = true;
            continue;
        }

        const studentPoints = GRADE_POINTS[studentSub.grade];
        const reqPoints = GRADE_POINTS[req.minGrade as keyof typeof GRADE_POINTS];

        if (studentPoints < reqPoints) {
            missedSubjects = true;
            missingReqs.push(
                `Subject ${req.subjectCode}: Required ${req.minGrade}, Got ${studentSub.grade}`
            );
        }
    }

    if (missedSubjects) {
        return { course, status: "MissedSubject", missingRequirements: missingReqs };
    }

    if (studentPoints < course.cop) {
        // Logic: If subjects pass but points fail
        missingReqs.push(`Cluster Points: Required ${course.cop}, Got ${studentPoints.toFixed(3)}`);
        return { course, status: "MissedCOP", missingRequirements: missingReqs };
    }

    return { course, status: "Eligible", missingRequirements: [] };
}

export function filterCourses(
    courses: Course[],
    studentGrades: StudentSubject[],
    clusterResults: ClusterResult[]
): EligibilityResult[] {
    return courses.map(course => checkEligibility(course, studentGrades, clusterResults));
}
