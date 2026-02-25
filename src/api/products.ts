import axios from 'axios';
import type { ProductsResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ProductsResponse> => {
  const { limit = 20, skip = 0, sortBy, order, search } = params;

  if (search) {
    const { data } = await axios.get<ProductsResponse>(
      `${BASE_URL}/products/search`,
      {
        params: { q: search, limit, skip },
      }
    );
    return data;
  }

  const { data } = await axios.get<ProductsResponse>(`${BASE_URL}/products`, {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    },
  });
  return data;
};