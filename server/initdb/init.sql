CREATE TABLE IF NOT EXISTS callDetailRecords (
    id integer PRIMARY KEY,
    mnc integer,
    bytes_used integer NOT NULL,
    dmcc varchar(100),
    cell_id integer,
    ip varchar(20)
);