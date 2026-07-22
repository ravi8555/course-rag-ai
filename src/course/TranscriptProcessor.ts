// src/course/TranscriptProcessor.ts
import fs from "fs/promises";
import path from "path";

import { CourseLesson } from "./Course";

import { SrtParser } from "../parsers/SrtParser";
import { VttParser } from "../parsers/VttParser";

import { TranscriptCleaner } from "../cleaner";
import { SemanticChunker } from "../chunking";

import { DocumentChunk } from "../types";

export class TranscriptProcessor {

    private readonly cleaner =
        new TranscriptCleaner();

    private readonly chunker =
        new SemanticChunker();

    async process(
        lesson: CourseLesson
    ): Promise<DocumentChunk[]> {

        console.log(`📄 Processing ${lesson.title}`);

        const content =
            await fs.readFile(
                lesson.filePath,
                "utf8"
            );

        const parser =
            path.extname(lesson.filePath) === ".vtt"
                ? new VttParser()
                : new SrtParser();

const transcript = parser.parse(content, {
    lesson: {
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        source: lesson.source,
    },
});

        const cleaned =
            this.cleaner.clean(transcript);

        return this.chunker.chunk(cleaned);

    }

}