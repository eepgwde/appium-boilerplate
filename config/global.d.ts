// weaves
// This adds a hashCode method to JavaScript String.
// It is implemented and used in Source0.ts

export {}

declare global {
    interface String {
        hashCode() : number;
    }
}
