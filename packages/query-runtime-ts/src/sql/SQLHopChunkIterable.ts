/**
 * SQLHopChunkIterable is needed to correctly handle an input source of ids to the query.
 * Basically like SQLSourceChunkIterable except "specAndOpsToQuery" would receive a set of source ids
 * from which the hop starts.
 *
 * HopChunkIterables are only used when a hop could not be rolled into a source expression.
 * As such, the hop chunk iterable receives a set of ids that represent the set of nodes being hopped to.
 *
 * What does this look like?
 * - Field edges
 *  - IDs contained in the fields are provided to the hop iterable
 *    - `where B.id IN (_input ids_)`
 * - FK edges
 *  - IDs of the prior nodes are provided to the hop iterable which then crafts a `where B.fk IN (_input ids_)`
 * - Followed Jx edges
 *   - ID2s provided
 * - Non followed jx edges
 *   - ID1s provided...... this means the hop iterable output is an edge?
 * - Inverse jx edges
 * - Non followed inverse jx edges
 */
