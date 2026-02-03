export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "E";

export const GRADE_POINTS: Record<Grade, number> = {
    "A": 12, "A-": 11,
    "B+": 10, "B": 9, "B-": 8,
    "C+": 7, "C": 6, "C-": 5,
    "D+": 4, "D": 3, "D-": 2,
    "E": 1,
};

export type SubjectGroup = "I" | "II" | "III" | "IV" | "V";

export interface Subject {
    code: string;
    name: string;
    group: SubjectGroup;
}

export const SUBJECTS: Subject[] = [
    // Group I (Compulsory)
    { code: "101", name: "English", group: "I" },
    { code: "102", name: "Kiswahili", group: "I" },
    { code: "121", name: "Mathematics", group: "I" }, // Typically Math Alt A
    // { code: "122", name: "Mathematics Alt B", group: "I" }, // Simplified handling for now

    // Group II (Sciences)
    { code: "231", name: "Biology", group: "II" },
    { code: "232", name: "Physics", group: "II" },
    { code: "233", name: "Chemistry", group: "II" },

    // Group III (Humanities)
    { code: "311", name: "History & Government", group: "III" },
    { code: "312", name: "Geography", group: "III" },
    { code: "313", name: "CRE", group: "III" },
    { code: "314", name: "IRE", group: "III" },
    { code: "315", name: "HRE", group: "III" },

    // Group IV (Technicals - Selection)
    { code: "443", name: "Agriculture", group: "IV" },
    { code: "441", name: "Home Science", group: "IV" },
    { code: "451", name: "Computer Studies", group: "IV" },
    // ... others can be added

    // Group V (Business & Foreign Utils)
    { code: "565", name: "Business Studies", group: "V" },
    { code: "501", name: "French", group: "V" },
    { code: "502", name: "German", group: "V" },
    { code: "511", name: "Music", group: "V" },
];

export interface StudentSubject {
    subjectCode: string;
    grade: Grade;
}
