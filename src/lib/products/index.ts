import { Meilisearch } from "meilisearch";

export interface Product {
  Index: string;
  Name: string;
  Description: string;
  Brand: string;
  Category: string;
  Price: string;
  Currency: string;
  Stock: string;
  EAN: string;
  Color: string;
  Size: string;
  Availability: string;
  "Internal ID": string;
  [key: string]: string;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
}

/**
 * Centrally fetch products from MeiliSearch with pagination, search, and filtering support.
 * Works on both client and server (Next.js nodes).
 */
export async function getProductsData(
  page: number = 1,
  limit: number = 10,
  query: string = "",
  filter: string = "",
  start?: number
): Promise<ProductsResponse> {
  const client = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
  });

  try {
    const searchParams: any = {
      limit,
    };

    // MeiliSearch filter syntax: attribute = value
    if (filter) {
      searchParams.filter = filter;
    }

    if (start !== undefined) {
      searchParams.offset = start;
    } else {
      searchParams.page = page;
      searchParams.hitsPerPage = limit;
    }

    // Ensure query is a string and trimmed
    const searchQuery = (query || "").toString().trim();

    const result = await client.index("products").search(searchQuery, searchParams);

    return {
      products: result.hits as unknown as Product[],
      totalCount: result.totalHits || result.estimatedTotalHits || 0,
    };
  } catch (error) {
    console.error("Error fetching products from MeiliSearch:", error);
    return {
      products: [],
      totalCount: 0,
    };
  }
}

/**
 * Delete a product document from MeiliSearch by its unique identifier.
 */
export async function deleteProductData(id: string): Promise<boolean> {
  const client = new Meilisearch({
    host: "http://localhost:7700",
    apiKey: "masterKey",
  });

  try {
    const response = await client.index("products").deleteDocument(id);
    console.log("Delete document request submitted. Task UID:", response.taskUid);
    return true;
  } catch (error) {
    console.error("Error deleting product from MeiliSearch:", error);
    return false;
  }
}
