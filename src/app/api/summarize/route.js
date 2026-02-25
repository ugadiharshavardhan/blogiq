import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import connectDB from "@/lib/mongodb";
import Summary from "@/models/Summary";
import * as cheerio from "cheerio";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function splitByWords(text, wordsPerChunk = 2000) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
        chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
    return chunks;
}

function chunkPrompt(chunk, type, chunkNumber) {
    return `You are an expert AI summarizer for Antigravity.
        This is part ${chunkNumber} of a long article.
        Summarize this section clearly and concisely.

        Rules:
        - Write naturally flowing sentences.
        - Avoid repeating previous ideas.
        - Keep it readable for typing animation display.
        - Do not mention "chunk" or "section" in output.
        - Do not add external knowledge.
        - CRITICAL RULE: Return ONLY the raw plain text summary. DO NOT wrap the text in quotes, JSON, code blocks, or markdown formatting blocks. DO NOT provide conversational filler.
        ${type === "technical" ? "- Focus heavily on facts, data, methodology, and technical specifics. If this specific chunk is not highly technical, simply provide an analytical summary of the factual information presented instead without apologizing." : ""}
        ${type === "bullets" ? "- CRITICAL RULE: You MUST format your entire response as a list of bullet points. Start EVERY SINGLE line with a dash (-). DO NOT write introductory or concluding paragraphs. ONLY return bullet points." : ""}

        Style: ${type}

        Content:
        ${chunk}`;
}

export async function POST(req) {
    try {
        const { blogId, url, content: baseContent, type } = await req.json();

        if (!blogId || (!url && !baseContent)) {
            return NextResponse.json(
                { error: "Blog ID and content/url required." },
                { status: 400 }
            );
        }

        await connectDB();
        const existingSummary = await Summary.findOne({ blogId, type });
        if (existingSummary) {
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(existingSummary.summary));
                    controller.close();
                }
            });
            return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }
        let rawText = baseContent || "";
        if (url) {
            try {
                const fetchRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
                if (fetchRes.ok) {
                    const html = await fetchRes.text();
                    const $ = cheerio.load(html);
                    $('script, style, nav, header, footer, aside, .ad, iframe').remove();
                    rawText = $('p, h1, h2, h3, article').text();
                }
            } catch (e) {
            }
        }

        let safeText = rawText.replace(/\s+/g, " ").trim();
        if (!safeText) safeText = (baseContent || "").replace(/\s+/g, " ").trim();
        const chunks = splitByWords(safeText, 2000);

        const stream = new ReadableStream({
            async start(controller) {
                let fullSummary = "";

                for (let i = 0; i < chunks.length; i++) {
                    try {
                        const completion = await groq.chat.completions.create({
                            model: "llama-3.1-8b-instant",
                            messages: [{ role: "user", content: chunkPrompt(chunks[i], type, i + 1) }],
                            temperature: 0.5,
                            max_tokens: 500,
                        });

                        let chunkSummary = completion.choices[0]?.message?.content || "";
                        chunkSummary = chunkSummary.replace(/^"|"$/g, '').replace(/```[\s\S]*?```/g, '').trim();

                        const separator = (i > 0 && chunkSummary) ? "\n\n" : "";
                        const chunkPayload = separator + chunkSummary;

                        controller.enqueue(new TextEncoder().encode(chunkPayload));
                        fullSummary += chunkPayload;
                    } catch (err) {
                        if (i === 0) controller.enqueue(new TextEncoder().encode("Error processing summary."));
                    }
                }
                if (fullSummary.trim()) {
                    try {
                        await Summary.create({ blogId, type, summary: fullSummary });
                    } catch (dbErr) {
                    }
                }

                controller.close();
            }
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

    } catch (error) {
        return NextResponse.json(
            { error: error?.message || "AI summarization failed." },
            { status: 500 }
        );
    }
}
