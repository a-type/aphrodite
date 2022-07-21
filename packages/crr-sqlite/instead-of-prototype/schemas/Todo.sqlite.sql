-- can use https://sqlite-utils.datasette.io/en/stable/ to generate these based on a base schema??
-- you can use an in-mem sqlite db to create the schema and then introspect the schema to generate the other schemas.
-- rather than trying to parse the schema.

CREATE VIEW
  IF NOT EXISTS "todo" AS SELECT
    "id",
    "listId",
    "text",
    "completed"
  FROM
    "todo_crr"
  WHERE
    "todo_crr"."crr_cl" % 2 = 1;

CREATE TABLE
  IF NOT EXISTS "todo_crr" (
    "id" integer NOT NULL,
    "listId" integer NOT NULL,
    "listId_v" integer DEFAULT 0,
    "text" text NOT NULL,
    "text_v" integer DEFAULT 0,
    "completed" boolean NOT NULL,
    "completed_v" integer DEFAULT 0,
    "crr_cl" integer DEFAULT 1,
    "crr_db_v" integer NOT NULL,
    primary key ("id")
  );

CREATE TRIGGER IF NOT EXISTS "insert_todo_trig"
  INSTEAD OF INSERT ON "todo"
BEGIN
  -- is there a better way to grab this version?
  -- sucks to use a single incr value across all writes to all tables.
  -- we could do table rather than global db versions...
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  INSERT INTO "todo_crr" (
    "id",
    "listId",
    "listId_v",
    "text",
    "text_v",
    "completed",
    "completed_v",
    "crr_cl",
    "crr_db_v"
  ) VALUES (
    NEW.id,
    NEW.listId,
    0,
    NEW.text,
    0,
    NEW.completed,
    0,
    1,
    (SELECT "version" FROM "crr_db_version")
  ) ON CONFLICT ("id") DO UPDATE SET
    "listId" = EXCLUDED."listId",
    "listId_v" = CASE WHEN EXCLUDED."listId" != "listId" THEN "listId_v" + 1 ELSE "listId_v" END,
    "text" = EXCLUDED."text",
    "text_v" = CASE WHEN EXCLUDED."text" != "text" THEN "text_v" + 1 ELSE "text_v" END,
    "completed" = EXCLUDED."completed",
    "completed_v" = CASE WHEN EXCLUDED."completed" != "completed" THEN "completed_v" + 1 ELSE "completed_v" END,
    "crr_cl" = "crr_cl" + 1,
    "crr_db_v" = EXCLUDED."crr_db_v";
END;

CREATE TRIGGER IF NOT EXISTS "update_todo_trig"
  INSTEAD OF UPDATE ON "todo"
BEGIN
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  UPDATE "todo_crr" SET
    "listId" = NEW."listId",
    "listId_v" = CASE WHEN OLD."listId" != NEW."listId" THEN "listId_v" + 1 ELSE "listId_v" END,
    "text" = NEW."text",
    "text_v" = CASE WHEN OLD."text" != NEW."text" THEN "text_v" + 1 ELSE "text_v" END,
    "completed" = NEW."completed",
    "completed_v" = CASE WHEN OLD."completed" != NEW."completed" THEN "completed_v" + 1 ELSE "completed_v" END,
    "crr_db_v" = (SELECT "version" FROM "crr_db_version")
  WHERE "id" = NEW."id";
END;

CREATE TRIGGER IF NOT EXISTS "delete_todo_trig"
  INSTEAD OF DELETE ON "todo"
BEGIN
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  UPDATE "todo_crr" SET "crr_cl" = "crr_cl" + 1 WHERE "id" = OLD."id";
END;
