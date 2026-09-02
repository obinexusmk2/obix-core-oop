import { applyAction } from "obix-ir";
export function toOOP(artifact) {
    class Component {
        #state;
        #props;
        constructor(opts = {}) {
            this.#state = opts.state ?? artifact.initialState;
            this.#props = Object.freeze({ ...artifact.props, ...(opts.props ?? {}) });
        }
        get state() {
            return this.#state;
        }
        set state(_v) {
            throw new TypeError(`[OBIX] ${artifact.name}.state is read-only`);
        }
        get props() {
            return this.#props;
        }
        dispatch(actionName, payload) {
            this.#state = applyAction(artifact, this.#state, actionName, payload, this.#props);
            return this.#state;
        }
        replay(trace) {
            for (const [name, payload] of trace)
                this.dispatch(name, payload);
            return this.#state;
        }
        render() {
            return artifact.render ? artifact.render(this.#state, this.#props) : "";
        }
        validate() {
            return artifact.validate ? artifact.validate(this.#state, this.#props) : { valid: true, violations: [] };
        }
    }
    for (const name of Object.keys(artifact.actions)) {
        Object.defineProperty(Component.prototype, name, {
            value(payload) {
                return this.dispatch(name, payload);
            },
            writable: false,
            enumerable: false,
        });
    }
    for (const name of Object.keys(artifact.derived)) {
        Object.defineProperty(Component.prototype, name, {
            get() {
                return artifact.derived[name](this.state, this.props);
            },
            enumerable: false,
        });
    }
    return Component;
}
//# sourceMappingURL=index.js.map