// src/retrieval/SearchResult.ts

import { DocumentChunk } from "../types";

export interface SearchResult {

    score: number;

    chunk: DocumentChunk;

}