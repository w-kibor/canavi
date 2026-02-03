import { Grade, GRADE_POINTS, StudentSubject, SUBJECTS, SubjectGroup } from "./subject-mapping";

export interface ClusterRequirement {
    id: number;
    name: string;
    subjects: {
        subject1: string[]; // e.g. ["121"] (Math)
        subject2: string[]; // e.g. ["101", "102"] (Eng or Kis)
        subject3: string[]; // e.g. ["231", "232"]
        subject4: string[]; // e.g. Any from Group II
    };
}

export interface ClusterResult {
    clusterId: number;
    clusterName: string;
    points: number;
    qualified: boolean; // Based on basic subject availability, not COPs
}

function getPoints(grade: Grade): number {
    return GRADE_POINTS[grade];
}

function getStudentGrade(subjects: StudentSubject[], code: string): number {
    const subject = subjects.find((s) => s.subjectCode === code);
    return subject ? getPoints(subject.grade) : 0;
}

// Helper to get best subject from a list of codes
function getBestSubjectFromList(studentSubjects: StudentSubject[], allowedCodes: string[], excludeCodes: string[] = []): { code: string; points: number } | null {
    const candidates = studentSubjects
        .filter((s) => allowedCodes.includes(s.subjectCode) && !excludeCodes.includes(s.subjectCode))
        .map((s) => ({ code: s.subjectCode, points: getPoints(s.grade) }));

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.points - a.points);
    return candidates[0];
}

// Helper to get mapped subject object
function getSubjectDetails(code: string) {
    return SUBJECTS.find((s) => s.code === code);
}

export function calculateAggregate(studentSubjects: StudentSubject[]): number {
    // Standard KCSE Aggregate (Best 7)
    // 1. Eng (101), Kis (102), Math (121) - Compulsory
    // 2. Best 2 Sciences (Group II)
    // 3. Best 2 Others

    const usedCodes: string[] = [];
    let totalPoints = 0;

    // 1. Compulsory
    ["101", "102", "121"].forEach((code) => {
        const p = getStudentGrade(studentSubjects, code);
        totalPoints += p;
        usedCodes.push(code);
    });

    // 2. Best 2 Sciences
    const sciences = SUBJECTS.filter((s) => s.group === "II").map((s) => s.code);

    for (let i = 0; i < 2; i++) {
        const bestSci = getBestSubjectFromList(studentSubjects, sciences, usedCodes);
        if (bestSci) {
            totalPoints += bestSci.points;
            usedCodes.push(bestSci.code);
        }
    }

    // 3. Best 2 Others (Any remaining)
    const allCodes = SUBJECTS.map((s) => s.code);
    for (let i = 0; i < 2; i++) {
        const bestOther = getBestSubjectFromList(studentSubjects, allCodes, usedCodes);
        if (bestOther) {
            totalPoints += bestOther.points;
            usedCodes.push(bestOther.code);
        }
    }

    // Cap at 84 just in case, though logic typically limits it.
    return Math.min(totalPoints, 84);
}

export function calculateClusterPoints(
    studentSubjects: StudentSubject[],
    cluster: ClusterRequirement
): ClusterResult {
    const aggregate = calculateAggregate(studentSubjects); // t

    // Calculate Cluster Subjects Sum (s)
    // We need to pick the best subject for each of the 4 slots defined in the cluster
    // ensuring we don't reuse subjects across slots if not allowed (slots are distinct)

    let clusterSubjectPoints = 0;
    const usedCodesInCluster: string[] = [];
    let qualified = true;

    const slots = [cluster.subjects.subject1, cluster.subjects.subject2, cluster.subjects.subject3, cluster.subjects.subject4];

    for (const allowedCodes of slots) {
        // If allowedCodes is empty or "Any Group X", we need logic to handle groups.
        // For now assuming specific codes are passed or expanded before calling.
        // NOTE: This simplies "Any Group II" to just list of Group II codes.

        const best = getBestSubjectFromList(studentSubjects, allowedCodes, usedCodesInCluster);
        if (!best) {
            // Missing a required subject for this cluster
            qualified = false;
            // We continue to calculate what we can, or return 0? 
            // Usually if you miss a subject, you can't do the course. 
            // But for points, maybe we assume 0 points for that slot.
        } else {
            clusterSubjectPoints += best.points;
            usedCodesInCluster.push(best.code);
        }
    }

    // Formula: w = sqrt( (s/48) * (t/84) ) * 48
    // s = clusterSubjectPoints (max 48)
    // t = aggregate (max 84)

    const s = clusterSubjectPoints;
    const t = aggregate;

    const rawPoints = Math.sqrt((s / 48) * (t / 84)) * 48;

    // Truncate/Round? usually 3 decimal places
    const points = Math.round(rawPoints * 1000) / 1000;

    return {
        clusterId: cluster.id,
        clusterName: cluster.name,
        points: qualified ? points : 0,
        qualified
    };
}
