const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
    const envPath = path.join(process.cwd(), '.env.local');

    let apiKey = '';
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('GEMINI_API_KEY=')) {
                apiKey = line.split('=')[1].trim();
                if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
                    apiKey = apiKey.slice(1, -1);
                }
                break;
            }
        }
    }

    if (!apiKey) {
        console.error('No API Key found.');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-3-pro-preview";
    console.log(`Testing ${modelName} with new SDK...`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, can you confirm you are Gemini 3.0 Pro?");
        console.log(`SUCCESS: ${modelName} works!`);
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error(`FAILED: ${modelName}`);
        console.error('Error:', error.message);
    }
}

main();
