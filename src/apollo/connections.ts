import { encodeCursor } from './cursor';

export const itemsToConnection = (
  items: any[],
  total: number,
  orderBy?: string,
) => {
  const edges = items.map((node) => ({
    cursor: encodeCursor({
      ordId: node.ordId,
      value: orderBy ? node[orderBy] : undefined,
    }),
    node,
  }));
  const hasMore = edges.length < total;
  if (!edges.length) {
    return { hasMore, endCursor: null };
  }
  const endEdge = edges[edges.length - 1];
  return { edges, pageInfo: { hasMore, endCursor: endEdge.cursor } };
};
