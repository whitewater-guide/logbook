export const itemsToConnection = (
  items: any[] | undefined,
  total: number,
  orderBy?: string,
) => {
  const edges =
    items?.map((node) => {
      return {
        cursor: {
          ordId: node.ord_id,
          value: orderBy ? node[orderBy] : undefined,
        },
        node,
      };
    }) || [];
  const hasMore = edges.length < total;
  if (!edges.length) {
    return { edges, pageInfo: { hasMore, endCursor: null } };
  }
  const endEdge = edges[edges.length - 1];
  return { edges, pageInfo: { hasMore, endCursor: endEdge.cursor } };
};
