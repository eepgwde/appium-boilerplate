export module Local {
    export class Actions0 {

        private actions: { id: string; type: string; actions: FlatArray<{ type: string; value: string }[][], 1>[] };

        constructor(mesg: string) {
            const chars = Array.from(mesg)
            const k1 = chars.map(v => [(this.keyPress(v, "keyDown")), (this.keyPress(v, "keyUp"))]).flat()
            this.actions = this.keyActions(k1)
        }

        get value(): object[] {
            return Array(this.actions)
        }

        keyPress(ch: string, dir: string): { type: string; value: string } {
            return {
                type: dir,
                value: ch
            }
        }

        keyActions(ks: FlatArray<{ type: string; value: string }[][], 1>[]):
            { id: string; type: string; actions: FlatArray<{ type: string; value: string }[][], 1>[] } {
            return {
                type: "key",
                actions: ks,
                id: "default keyboard"
            }
        }

    }
}
