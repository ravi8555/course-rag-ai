// src/retrieval/SemanticSearcher.ts

import { OpenAIEmbeddingService } from "../embeddings/OpenAIEmbeddingService";
import { qdrant } from "../vectorstore/QdrantClient";
import { SearchResult } from "./SearchResult";

const COLLECTION_NAME = "course-rag";

export class SemanticSearcher {

    private embeddingService = new OpenAIEmbeddingService();

    async search(
    question: string,
    topK = 5
): Promise<SearchResult[]> {
const embedding = await this.embeddingService.embed(question);

const response = await qdrant.query(COLLECTION_NAME, {
    query: embedding,
    limit: topK,
    with_payload: true,
     with_vector: false,
});

console.dir(response.points, { depth: null });

return response.points.map(point => ({
    score: point.score,
    chunk: point.payload as any,
}));

}



}

