---
name: kafka-connect-lab
description: "Hands-on Kafka Connect lab: move data without code — run a source and a sink connector, write connector config JSON, pick converters (JSON/Avro) for serialization, and drive it via the REST API. Use for 'Kafka Connect lab', 'the integration', 'source and sink connectors', 'connector config', 'converters', 'FileStream connector', 'Kafka Connect hands-on lab', or learning Connect by doing."
argument-hint: "The integration"
---

# Kafka Connect Lab

Learn Kafka Connect by wiring a source and a sink yourself — config over code, with converters handling
serialization — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [cdc-pipeline-coach](../cdc-pipeline-coach/SKILL.md) and [data-pipeline-designer](../data-pipeline-designer/SKILL.md).

## When to use

- The learner must integrate an external system (file, DB, S3) with Kafka without writing a producer/consumer.
- Reinforcing the connector → converter → topic path and config-driven integration.

## Mental model

Connect runs **connectors** from config: a **source** imports into a topic, a **sink** exports out, and
**converters** (set per worker) serialize/deserialize keys and values between Connect and Kafka.

## Procedure

1. **Start Connect:** a `docker compose` broker + Connect worker; hit the REST API with `curl
   localhost:8083/` and `/connector-plugins` to list installed connectors.
2. **Add a source:** POST a `FileStreamSource` config (`{name, connector.class, topic, file}`) to
   `/connectors`; append to the file and read the topic — Apache Kafka docs, *Kafka Connect*, kafka.apache.org, 2024.
3. **Add a sink:** POST a `FileStreamSink` reading the same topic to an output file; confirm data flows
   source-file → topic → sink-file.
4. **Set converters:** compare `key/value.converter` = `JsonConverter` (with/without schemas) vs. Avro with a
   Schema Registry; converters — not connectors — own serialization.
5. **Operate:** check `/connectors/<name>/status`, watch task state, and PUT an updated config to reconfigure.
6. **Verify & clean up:** DELETE the connectors, confirm they stop, then `docker compose down`.

## Output shape

```
Worker: standalone | distributed (REST :8083)
Source: FileStreamSource → topic <t> | Sink: topic <t> → FileStreamSink
Config: JSON {name, connector.class, topic, …} POST /connectors
Converters: key/value.converter = Json | Avro (schema?)
Verify: /status + tasks RUNNING | Cleanup: DELETE + down
```

## Tips

- Converters are set on the **worker/connector**, not baked into the connector class — a mismatch garbles data.
- Prefer **distributed** mode (even one worker) in production for REST-managed, fault-tolerant connectors.
- End with the **Learning Footer** (`AGENTS.md`) — one converter to swap + one connector status to inspect yourself.
