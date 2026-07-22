// src/types/chunk.ts

// export interface TranscriptChunk {

//     id:string;

//     lessonId:string;

//     lessonTitle:string;

//     start:number;

//     end:number;

//     text:string;

//     tokenCount:number;

//     segmentIds:number[];

// }

// export interface DocumentChunk {

//     id:string;

//     documentId:string;

//     lessonId:string;

//     start:number;

//     end:number;

//     text:string;

//     metadata:Record<string, unknown>;

// }


// src/types/chunk.ts

export interface ChunkMetadata {
  lessonTitle: string;
  source: "srt" | "vtt" | "youtube";

  segmentIds: number[];

  tokenCount: number;

  duration: number;
}

export interface DocumentChunk {
  id: string;

  documentId: string;

  lessonId: string;

  start: number;

  end: number;

  text: string;

  metadata: ChunkMetadata;
}