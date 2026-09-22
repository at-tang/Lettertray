import { HistoryEntry } from "../../classes/History";

    const Database = require('better-sqlite3');
    const path = require('path');
    const { app } = require('electron');



export function createHistoryEntry(entries: HistoryEntry[], db) {
    const stmt = db.prepare('INSERT INTO history_entries (origin_dir, new_dir, file_name, time) VALUES (@originDir, @newDir, @fileName, @time)');

    for (const entry of entries) {
        stmt.run(entry.originDir, entry.newDir, entry.fileName, entry.time)
    }
    return;

}

export function getHistoryDatabase(db, query: string, limit: number, offset: number) {
    const stmt = db.prepare('SELECT * FROM history_entries WHERE file_name ILIKE @query || oldDir ILIKE @query || newDir ILIKE @query ORDER BY time DESC LIMIT @limit OFFSET @offset')
}