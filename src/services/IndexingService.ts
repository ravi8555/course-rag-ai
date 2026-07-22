import { DocumentChunk } from "../types";
import { EmbeddingService } from "../embeddings";
import { VectorStore } from "../vectorstore";

export class IndexingService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStore: VectorStore
  ) {}

  async index(chunks: DocumentChunk[]): Promise<void> {
    const texts = chunks.map(chunk => chunk.text);

    const embeddings =
      await this.embeddingService.embedBatch(texts);

    if (chunks.length !== embeddings.length) {
      throw new Error(
        "Chunks and embeddings count mismatch."
      );
    }

    const vectors = chunks.map((chunk, index) => ({
      chunk,
      embedding: embeddings[index],
    }));

    for (const vector of vectors) {
      await this.vectorStore.upsert(vector);
    }
  }
}