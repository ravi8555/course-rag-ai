// src/course/CourseLoader.ts
import fs from "fs/promises";
import path from "path";

import { Course, CourseLesson } from "./Course";

export class CourseLoader {

    async load(
        directory: string,
        courseId: string,
        courseTitle: string
    ): Promise<Course> {

        const files = await fs.readdir(directory);

        const transcriptFiles = files
            .filter(file =>
                file.endsWith(".srt") ||
                file.endsWith(".vtt")
            )
            .sort();

        const lessons: CourseLesson[] = transcriptFiles.map((file, index) => ({
    id: `lesson-${String(index + 1).padStart(3, "0")}`,
    title: path.parse(file).name,
    order: index + 1,
    filePath: path.join(directory, file),
    source: file.endsWith(".vtt") ? "vtt" : "srt",
}));

        return {

            id: courseId,

            title: courseTitle,

            lessons

        };

    }

}