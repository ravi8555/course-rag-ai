// // src/vectorstore/QdrantVectorStore.ts
// import { qdrant } from "./QdrantClient";
// import { VectorDocument } from "./VectorDocument";
// import { QdrantPayloadMapper } from "./QdrantPayloadMapper";
// import { SearchOptions } from './SearchOptions'
// import { VectorSearchResult } from './VectorSearchResult'
// import { DocumentChunk } from "../types";
// import { VectorStore } from "./VectorStore";

// const COLLECTION_NAME = "course-rag";

// export class QdrantVectorStore implements VectorStore {

//   async createCollection() {

//     const collections = await qdrant.getCollections();

//     const exists = collections.collections.some(
//       c => c.name === COLLECTION_NAME
//     );

//     if (exists) {
//       console.log("Collection already exists.");
//       return;
//     }

//     await qdrant.createCollection(COLLECTION_NAME, {
//       vectors: {
//         size: 1536,
//         distance: "Cosine",
//       },
//     });

//     console.log("Collection created.");
//   }

//   async upsert(vector: VectorDocument) {
    

//     await qdrant.upsert(COLLECTION_NAME, {
//       wait: true,
//       points: [
//         {
//           id: vector.chunk.id,
//           vector: vector.embedding,
//           payload: QdrantPayloadMapper.toPayload(vector.chunk)
//         },
//       ],
//     });

//     console.log(`Inserted ${vector.chunk.id}`);
//   }

//   async search(
//   embedding: number[],
//   options?: SearchOptions
// ): Promise<VectorSearchResult[]> {

//   const response = await qdrant.query(COLLECTION_NAME, {
//     query: embedding,
//     limit: options?.limit ?? 5,
//     with_payload: true,
//   });

//   return response.points.map((point: any) => ({
//     score: point.score,
//     chunk: point.payload as DocumentChunk,
//   }));
// }
// }   



// src/vectorstore/QdrantVectorStore.ts
import { qdrant } from "./QdrantClient";
import { VectorDocument } from "./VectorDocument";
import { QdrantPayloadMapper } from "./QdrantPayloadMapper";
import { SearchOptions } from './SearchOptions'
import { VectorSearchResult } from './VectorSearchResult'
import { DocumentChunk } from "../types";
import { VectorStore } from "./VectorStore";

const COLLECTION_NAME = "course-rag";

export class QdrantVectorStore implements VectorStore {

  private readonly client = qdrant;

    constructor(
        private readonly collectionName = COLLECTION_NAME
    ) {}

  async createCollection() {



    const collections = await this.client.getCollections();

    const exists = collections.collections.some(
      c => c.name === COLLECTION_NAME
    );

    if (exists) {
      console.log("Collection already exists.");
      return;
    }

    await this.client.createCollection(this.collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log("Collection created.");
  }

  async upsert(vector: VectorDocument) {
    

    await this.client.upsert(this.collectionName, {
      wait: true,
      points: [
        {
          id: vector.chunk.id,
          vector: vector.embedding,
          payload: QdrantPayloadMapper.toPayload(vector.chunk)
        },
      ],
    });

    console.log(`Inserted ${vector.chunk.id}`);
  }

  async search(
    embedding: number[],
    options?: SearchOptions
): Promise<VectorSearchResult[]> {

    const response = await this.client.query(
        this.collectionName,
        {
            query: embedding,
            limit: options?.limit ?? 5,
            with_payload: true,
        }
    );

    return response.points.map((point: any) => ({
        score: point.score,
        chunk: point.payload as DocumentChunk,
    }));

}
}   