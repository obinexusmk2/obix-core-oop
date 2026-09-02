import type { DOPArtifact, State, Props, Payload, ActionTrace, ValidationResult } from "obix-spec";
export interface OOPInstance<S extends object, P extends object> {
    readonly state: S;
    readonly props: P;
    dispatch(actionName: string, payload?: Payload): S;
    replay(trace: ActionTrace): S;
    render(): string;
    validate(): ValidationResult;
    [action: string]: unknown;
}
export interface OOPConstructor<S extends object, P extends object> {
    new (opts?: {
        state?: S;
        props?: Partial<P>;
    }): OOPInstance<S, P>;
}
export declare function toOOP<S extends object = State, P extends object = Props>(artifact: DOPArtifact<S, P>): OOPConstructor<S, P>;
//# sourceMappingURL=index.d.ts.map