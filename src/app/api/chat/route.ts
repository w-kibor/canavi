import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_CLUSTERS } from "@/lib/data/clusters";
import { MOCK_COURSES } from "@/lib/data/courses";
import { calculateAggregate, calculateClusterPoints } from "@/lib/logic/cluster-calculator";
import { filterCourses } from "@/lib/logic/course-matcher";
import { StudentSubject } from "@/lib/logic/subject-mapping";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
    try {
        if (!apiKey) {
            console.error("Gemini API Key is missing in process.env");
            return NextResponse.json(
                { error: "Server Configuration Error: API Key missing. Please restart the server to load .env.local changes." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const { message, grades } = (await req.json()) as ChatRequest;

        if (!grades || grades.length < 7) {
            return NextResponse.json(
                { error: "Please enter at least 7 subjects in the Grade Picker first." },
                { status: 400 }
            );
        }

        // 1. Calculate Logic Context
        const aggregate = calculateAggregate(grades);

        const clusterResults = MOCK_CLUSTERS.map((cluster) =>
            calculateClusterPoints(grades, cluster)
        );

        const eligibilityResults = filterCourses(MOCK_COURSES, grades, clusterResults);

        const eligibleCourses = eligibilityResults.filter((r) => r.status === "Eligible");
        const missedCourses = eligibilityResults.filter((r) => r.status !== "Eligible");

        // 2. Construct System Prompt
        const systemPrompt = `
      You are the "Senior Academic Advisor" for the KCSE Career Navigator.
      Your goal is to provide specific, data-driven career advice to a student based on their calculated performance.
      
       STUDENT PROFILE:
      - Aggregate Points: ${aggregate} / 84
      - Cluster Points: 
        ${clusterResults.map(c => `- ${c.clusterName}: ${c.points.toFixed(3)} (Qualified: ${c.qualified})`).join("\n        ")}
      
      ELIGIBILITY DATA (Strict Rules):
      The student matches the following courses (Points >= CUTOFF AND Grades >= REQUIREMENTS):
      ${eligibleCourses.map(e => `- ${e.course.name} at ${e.course.institution} (COP: ${e.course.cop})`).join("\n      ")}
      
      The student DOES NOT match these courses (Reason provided):
      ${missedCourses.map(e => `- ${e.course.name} at ${e.course.institution}: ${e.missingRequirements.join(", ")}`).join("\n      ")}
      
      YOUR INSTRUCTIONS:
      1. Act as a professional, encouraging but REALISTIC advisor.
      2. If the student asks about a specific course, CHECK the lists above.
         - If ELIGIBLE: Encourage them, mention their points (${aggregate}) vs the cutoff.
         - If NOT ELIGIBLE: Explain EXACTLY why (e.g., "You have 35 points, but Law requires 40", or "You have a C in Math, but Engineering requires C+").
         - SUGGEST ALTERNATIVES: If they fail a tailored course, look at the "Eligible" list for similar fields.
      3. Do NOT invent courses or requirements. Use ONLY the data provided above.
      4. If the student hasn't asked for a specific course, recommend 2-3 strongest options from the Eligible list.
      5. Keep responses concise (max 3-4 sentences unless explaining a complex rejection).
    `;

        // 3. Generate Response
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to advise the student based on their specific grades and the eligibility rules." }]
                }
            ]
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });

    } catch (error) {
        console.error("Chat Error:", error);
        return NextResponse.json(
            { error: "Failed to generate response. Please try again." },
            { status: 500 }
        );
    }
}

interface ChatRequest {
    message: string;
    grades: StudentSubject[];
}
