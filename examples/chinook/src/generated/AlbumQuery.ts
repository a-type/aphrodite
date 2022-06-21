// SIGNED-SOURCE: <a87d3479f6fe5b105371588b5f24924b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Album from "./Album.js";
import { Data } from "./Album.js";
import { default as spec } from "./AlbumSpec.js";
import Artist from "./Artist.js";
import { default as ArtistSpec } from "./ArtistSpec.js";
import ArtistQuery from "./ArtistQuery.js";
import { default as TrackSpec } from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";

export default class AlbumQuery extends DerivedQuery<Album> {
  static create(ctx: Context) {
    return new AlbumQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new AlbumQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): AlbumQuery {
    return new AlbumQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Album>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, Album>("id"), p)
    );
  }

  whereTitle(p: Predicate<Data["title"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"title", Data, Album>("title"), p)
    );
  }

  whereArtistId(p: Predicate<Data["artistId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"artistId", Data, Album>("artistId"), p)
    );
  }
  queryArtist(): ArtistQuery {
    return new ArtistQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.artist),
      modelLoad(this.ctx, ArtistSpec.createFrom)
    );
  }
  queryTracks(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.tracks),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }

  take(n: number) {
    return new AlbumQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Album>("id"), direction)
    );
  }

  orderByTitle(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"title", Data, Album>("title"), direction)
    );
  }

  orderByArtistId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"artistId", Data, Album>("artistId"),
        direction
      )
    );
  }
}
