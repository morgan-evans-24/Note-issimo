import type { Note } from "./Note";

export interface DBEntry {
    userId: number,
    email: string,
    username: string
    notes: Note[]
}