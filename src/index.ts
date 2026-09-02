/**
 * obix-adapter-oop
 *
 * The OOP projection: a generated class. `state` and `props` are private;
 * `props` is frozen; `state` is read-only from outside. Every generated action
 * method (`Start(payload)`, `Tick(payload)`, …) delegates to `dispatch`, which
 * calls obix-ir.applyAction. There is never a second implementation of an action.
 */
import { applyAction } from "obix-ir";
import type {
  DOPArtifact,
  State,
  Props,
  Payload,
  ActionTrace,
  ValidationResult,
} from "obix-spec";

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
  new (opts?: { state?: S; props?: Partial<P> }): OOPInstance<S, P>;
}

export function toOOP<S extends object = State, P extends object = Props>(
  artifact: DOPArtifact<S, P>,
): OOPConstructor<S, P> {
  class Component {
    #state: S;
    #props: P;

    constructor(opts: { state?: S; props?: Partial<P> } = {}) {
      this.#state = opts.state ?? artifact.initialState;
      this.#props = Object.freeze({ ...artifact.props, ...(opts.props ?? {}) }) as P;
    }

    get state(): S {
      return this.#state;
    }
    set state(_v: S) {
      throw new TypeError(`[OBIX] ${artifact.name}.state is read-only`);
    }
    get props(): P {
      return this.#props;
    }

    dispatch(actionName: string, payload?: Payload): S {
      this.#state = applyAction(artifact, this.#state, actionName, payload, this.#props);
      return this.#state;
    }

    replay(trace: ActionTrace): S {
      for (const [name, payload] of trace) this.dispatch(name, payload);
      return this.#state;
    }

    render(): string {
      return artifact.render ? artifact.render(this.#state, this.#props) : "";
    }

    validate(): ValidationResult {
      return artifact.validate ? artifact.validate(this.#state, this.#props) : { valid: true, violations: [] };
    }
  }

  // generated action methods — all delegate, none re-implement
  for (const name of Object.keys(artifact.actions)) {
    Object.defineProperty(Component.prototype, name, {
      value(this: Component, payload?: Payload) {
        return this.dispatch(name, payload);
      },
      writable: false,
      enumerable: false,
    });
  }

  // generated derived getters
  for (const name of Object.keys(artifact.derived)) {
    Object.defineProperty(Component.prototype, name, {
      get(this: Component) {
        return artifact.derived[name]!(this.state, this.props);
      },
      enumerable: false,
    });
  }

  return Component as unknown as OOPConstructor<S, P>;
}
