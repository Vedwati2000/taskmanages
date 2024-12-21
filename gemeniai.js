import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDt-B9yLBP2vdSJV9eSY7X1p5fdXXlC4vw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text();
}
