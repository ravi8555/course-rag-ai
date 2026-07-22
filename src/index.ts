// import {
//   timestampToSeconds,
//   secondsToTimestamp,
// } from "./utils";

// console.log(timestampToSeconds("00:01:30,500"));

// console.log(timestampToSeconds("00:01:30.500"));

// console.log(secondsToTimestamp(90.5));

// console.log(timestampToSeconds("00:00:00,000"));
// // 0

// console.log(timestampToSeconds("01:00:00.000"));
// // 3600

// console.log(timestampToSeconds("02:15:20,250"));
// // 8120.25

// console.log(timestampToSeconds("00:01:20,500"));

import fs from "fs/promises";
import { SrtParser, VttParser } from "./parsers";
import { TranscriptCleaner } from "./cleaner"; 

import { SemanticChunker } from "./chunking";
import {OpenAIEmbeddingService} from './embeddings'
import  {QdrantVectorStore}  from "./vectorstore";

import {SemanticSearcher} from './retrieval'


async function main() {
  const content = await fs.readFile(
    "./data/01_what-is-mobile-development_epm.srt",
    "utf8"
  );

  const parser = new SrtParser();

  const transcript = parser.parse(content, {
     lesson: {
      id: "lesson-001",
      title: "01 What is Mobile Development",
      order: 1,
      source: "srt",
    },
  });

//   console.log(JSON.stringify(transcript, null, 2));

// const parser = new SrtParser();

//   const transcript = parser.parse(content, {
//     lesson: {
//       id: "lesson-001",
//       title: "01 What is Mobile Development",
//       order: 1,
//       source: "srt",
//     },
//   });

//   const cleaner = new TranscriptCleaner();

//   const cleaned = cleaner.clean(transcript);

//   console.log(cleaned.segments.slice(0, 5));

// test -2

// const srt =  await fs.readFile(
//    "./data/01_what-is-mobile-development_epm.srt",
//    "utf8"
// ) 

// const vtt =  await fs.readFile(
//    "./data/01_what-is-mobile-development_epm.vtt",
//    "utf8"
// ) 

// const lesson = {
//         id: "lesson-001",
//         title: "What is Mobile Development",
//         order: 1,
//         source: "vtt" as const,
//     };

//     const srtDoc = new SrtParser().parse(srt, {
//         lesson: {
//             ...lesson,
//             source: "srt"
//         },
//     });

//     const vttDoc = new VttParser().parse(vtt, {
//         lesson,
//     });

//     console.log(srtDoc.segments);

//     console.log(vttDoc.segments.length);

// test-3


  const cleaner = new TranscriptCleaner();
  const cleanedTranscript = cleaner.clean(transcript);
  const chunker = new SemanticChunker();

  const chunks = chunker.chunk(cleanedTranscript);

//   console.log("====================================");
//   console.log(`Chunks Created : ${chunks.length}`);
//   console.log("====================================\n");

// //   chunks.forEach((chunk, index) => {
// //     console.log(`Chunk ${index + 1}`);
// //     console.log("-------------------------------");

// //     console.log(`ID       : ${chunk.id}`);
// //     console.log(`Start    : ${chunk.start}`);
// //     console.log(`End      : ${chunk.end}`);

// //     console.log(
// //       `Duration : ${chunk.metadata.duration.toFixed(2)} sec`
// //     );

// //     console.log(
// //       `Tokens   : ${chunk.metadata.tokenCount}`
// //     );

// //     console.log(
// //       `Segments : ${chunk.metadata.segmentIds.join(", ")}`
// //     );

// //     console.log("\nText:\n");

// //     console.log(chunk.text);

// //     console.log("\n====================================\n");
// //   });

//   console.table(
//   chunks.map((chunk) => ({
//     id: chunk.id,
//     start: chunk.start,
//     end: chunk.end,
//     duration: chunk.metadata.duration,
//     tokens: chunk.metadata.tokenCount,
//     segments: chunk.metadata.segmentIds.length,
//   }))
// );
// // test -4
// const embeddingService = new OpenAIEmbeddingService();

// const embedding = await embeddingService.embed(
//   chunks[0].text
// );

// console.log("Embedding Dimension:", embedding.length);

// console.log("First 10 Values:");

// console.log(embedding.slice(0, 10));

// const vectorStore = new QdrantVectorStore();
// await vectorStore.createCollection();

// for (const chunk of chunks) {

//     const embedding =
//         await embeddingService.embed(chunk.text);

//     await vectorStore.upsert({
//         chunk,
//         embedding,
//     });

// }

// test -5 
const searcher = new SemanticSearcher();

const results = await searcher.search(
    "What are the types of mobile apps?"
);


console.log("\n========================");

console.log("SEARCH RESULTS");

console.log("========================");

for (const result of results) {

    console.log(
        `Score: ${result.score.toFixed(3)}`
    );

    console.log(
        `Lesson: ${result.chunk.metadata.lessonTitle}`
    );

    console.log(
        `${result.chunk.start} - ${result.chunk.end}`
    );

    console.log(result.chunk.text);

    console.log("------------------------");

}

  
}

main();


