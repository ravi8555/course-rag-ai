// src/vectorstore/QdrantVectorStore.ts
import { qdrant } from "./QdrantClient";
import { VectorDocument } from "./VectorDocument";
import { QdrantPayloadMapper } from "./QdrantPayloadMapper";

const COLLECTION_NAME = "course-rag";

export class QdrantVectorStore {

  async createCollection() {

    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
      c => c.name === COLLECTION_NAME
    );

    if (exists) {
      console.log("Collection already exists.");
      return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log("Collection created.");
  }

  async upsert(vector: VectorDocument) {
    

    await qdrant.upsert(COLLECTION_NAME, {
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
}   