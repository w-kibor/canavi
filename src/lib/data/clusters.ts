import { ClusterRequirement } from "../logic/cluster-calculator";
import { SUBJECTS } from "../logic/subject-mapping";

// Helper to get codes by group
const getGroupCodes = (groupLike: string) => SUBJECTS.filter(s => s.group === groupLike).map(s => s.code);
const getCodes = (...codes: string[]) => codes;

const groupII = getGroupCodes("II");
const groupIII = getGroupCodes("III");
const groupIV = getGroupCodes("IV");
const groupV = getGroupCodes("V");
const allHumanities = [...groupIII]; // simplified
const allSciences = [...groupII];

export const MOCK_CLUSTERS: ClusterRequirement[] = [
    {
        id: 1,
        name: "Cluster 1: Law & Related",
        subjects: {
            subject1: ["101"], // Eng
            subject2: ["102"], // Kis
            subject3: ["121"], // Math (or alt)
            subject4: [...allHumanities, ...allSciences] // Any Group III or II usually? Actually usually Hist/Geo required.
            // Keeping it simplified for demo.
        }
    },
    {
        id: 2,
        name: "Cluster 2: Business & Related",
        subjects: {
            subject1: ["121"], // Math
            subject2: ["101"], // Eng
            subject3: ["102"], // Kis (Often Eng or Kis, but let's say strict)
            subject4: [...groupV, ...allSciences] // Business or Science
        }
    },
    {
        id: 7,
        name: "Cluster 7: Engineering (Degree)",
        subjects: {
            subject1: ["121"], // Math
            subject2: ["232"], // Physics
            subject3: ["233"], // Chemistry
            subject4: ["101", "102", "231"] // Eng/Kis/Bio
        }
    },
    {
        id: 13,
        name: "Cluster 13: Medicine, Nursing, Health",
        subjects: {
            subject1: ["101"], // Eng
            subject2: ["231"], // Bio
            subject3: ["233"], // Chem
            subject4: ["121", "232"] // Math/Phy
        }
    },
    {
        id: 20,
        name: "Cluster 20: IT & Computer Science",
        subjects: {
            subject1: ["121"], // Math
            subject2: ["232"], // Phy
            subject3: ["101", "102"],
            subject4: ["233", "231", "451"] // Chem/Bio/Comp
        }
    }
];
