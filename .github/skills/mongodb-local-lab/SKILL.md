---
name: mongodb-local-lab
description: "Hands-on lab: run MongoDB locally with Docker — free, no subscription. Start the official mongo image, create collections, insert documents, and run queries with mongosh. Use for 'MongoDB lab', 'run Mongo locally', 'MongoDB in Docker', 'mongosh queries', 'local document store no subscription', or learning NoSQL document databases by doing."
argument-hint: "The document store"
---

# MongoDB Local Lab

Learn MongoDB by *running a real document store locally* — free, no cloud, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [nosql-data-modeling](../nosql-data-modeling/SKILL.md) and [sql-coach](../sql-coach/SKILL.md).

## When to use

- The learner wants a disposable local Mongo to practise documents, collections, and queries.
- Reinforcing schema-flexible modelling before choosing SQL vs NoSQL for a project.

## Mental model

- A **document** is a JSON/BSON object living in a **collection** (a table with no fixed schema). The
  **official `mongo` image** ships the `mongosh` shell; set `MONGO_INITDB_ROOT_USERNAME`/`_PASSWORD`
  for auth and persist data on `/data/db` (Docker Official Image `mongo`, hub.docker.com, 2024).

## Procedure

1. **Concept:** Mongo is a document database on TCP **27017**; you query it with `mongosh` using
   JavaScript-like methods, not SQL.
2. **Run (Docker):** start the compose below, then `docker ps` to confirm it is healthy *before* connecting.
3. **Connect:** `docker exec -it mg mongosh -u root -p` drops you into a JS REPL.
4. **Exercise:** `use shop`, `db.products.insertMany([...])`, then `db.products.find({ price: { $lt: 50
   } })` and `db.products.updateOne(...)` — read each cursor result.
5. **Verify:** `show collections` and `db.products.countDocuments()` match your inserts.
6. ⚠ **Clean up:** `docker compose down` (add `-v` **only** when you truly want to delete the volume).

## Output shape

```
# compose.yaml
services:
  db:
    image: mongo:7
    environment: { MONGO_INITDB_ROOT_USERNAME: root, MONGO_INITDB_ROOT_PASSWORD: devpass }
    ports: ["127.0.0.1:27017:27017"]   # dev only — bound to localhost
    volumes: [mongodata:/data/db]
volumes: { mongodata: {} }

docker compose up -d && docker exec -it <container> mongosh -u root -p
# use shop → db.products.insertMany([...]) → db.products.find({...}) → down
```

## Tips

- ⚠ Dev only: bind 27017 to `127.0.0.1`; an exposed, unauthenticated Mongo is a classic breach.
- Model for your **queries**: embed data you read together, reference data that grows unbounded — see [nosql-data-modeling](../nosql-data-modeling/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one document to model + one query to write yourself.
