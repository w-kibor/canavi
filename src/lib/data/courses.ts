import { ClusterRequirement } from "../logic/cluster-calculator";

export interface Course {
    id: string;
    code: string;
    name: string;
    institution: string;
    clusterId: number; // Links to the 20 clusters
    cop: number; // Cut-off Point (e.g., 42.5)
    minRequirements: {
        subjectCode: string;
        minGrade: string; // e.g., "C+"
    }[];
}

export interface ExternalCourse {
    title: string;
    department: string;
    campus: string;
    category: string;
    link: string;
    institution: string;
}

// Helper to define Grade order to compare (A > A- > ...)
// We can reuse the points from subject-mapping or just define a helper.
// For simplicity in data, we store strings. Logic will handle comparison.

export const MOCK_COURSES: Course[] = [
    // Engineering (Cluster 7)
    {
        id: "eng-1",
        code: "12345",
        name: "Bachelor of Science in Civil Engineering",
        institution: "University of Nairobi (UoN)",
        clusterId: 7,
        cop: 43.5,
        minRequirements: [
            { subjectCode: "121", minGrade: "C+" }, // Math
            { subjectCode: "232", minGrade: "C+" }, // Physics
            { subjectCode: "233", minGrade: "C+" }, // Chem
            { subjectCode: "101", minGrade: "C+" }, // Eng
        ]
    },
    {
        id: "eng-2",
        code: "12346",
        name: "Bachelor of Science in Electrical Engineering",
        institution: "JKUAT",
        clusterId: 7,
        cop: 41.8,
        minRequirements: [
            { subjectCode: "121", minGrade: "C+" },
            { subjectCode: "232", minGrade: "C+" },
            { subjectCode: "233", minGrade: "C+" },
        ]
    },

    // Law (Cluster 1)
    {
        id: "law-1",
        code: "54321",
        name: "Bachelor of Laws (LL.B)",
        institution: "Strathmore University",
        clusterId: 1,
        cop: 40.0,
        minRequirements: [
            { subjectCode: "101", minGrade: "B" }, // English B
        ]
    },
    {
        id: "law-2",
        code: "54322",
        name: "Bachelor of Laws (LL.B)",
        institution: "Kenyatta University (KU)",
        clusterId: 1,
        cop: 38.5,
        minRequirements: [
            { subjectCode: "101", minGrade: "B" },
        ]
    },

    // Medicine & Health (Cluster 13)
    {
        id: "med-1",
        code: "98765",
        name: "Bachelor of Medicine and Bachelor of Surgery",
        institution: "University of Nairobi (UoN)",
        clusterId: 13,
        cop: 45.3, // Very high
        minRequirements: [
            { subjectCode: "231", minGrade: "B+" }, // Bio
            { subjectCode: "233", minGrade: "B+" }, // Chem
        ]
    },
    {
        id: "nursing-1",
        code: "98766",
        name: "Bachelor of Science in Nursing",
        institution: "Moi University",
        clusterId: 13,
        cop: 39.2,
        minRequirements: [
            { subjectCode: "231", minGrade: "C+" },
        ]
    },

    // IT & CS (Cluster 20)
    {
        id: "cs-1",
        code: "45678",
        name: "Bachelor of Science in Computer Science",
        institution: "JKUAT",
        clusterId: 20,
        cop: 41.0,
        minRequirements: [
            { subjectCode: "121", minGrade: "C+" }, // Math
        ]
    },
    {
        id: "it-1",
        code: "45679",
        name: "Bachelor of Science in Information Technology",
        institution: "Murang'a University",
        clusterId: 20,
        cop: 34.5,
        minRequirements: [
            { subjectCode: "121", minGrade: "C" }, // Lower Match Req
        ]
    },

    // Business (Cluster 2)
    {
        id: "com-1",
        code: "67890",
        name: "Bachelor of Commerce",
        institution: "Kenyatta University (KU)",
        clusterId: 2,
        cop: 36.0,
        minRequirements: [
            { subjectCode: "121", minGrade: "C" }, // Math or Business usually
        ]
    },
    {
        id: "econ-1",
        code: "67891",
        name: "Bachelor of Economics",
        institution: "Maseno University",
        clusterId: 2,
        cop: 33.8,
        minRequirements: [
            { subjectCode: "121", minGrade: "C+" },
        ]
    }
];
