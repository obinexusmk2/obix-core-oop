# obix-adapter-oop

**The OOP projection — a generated class.**

```bash
npm install obix-adapter-oop
```

## API

```ts
const Timer = toOOP(artifact);
const t = new Timer({ props: { limitSeconds: 5 } });
t.Start();          // generated method -> dispatch("Start") -> applyAction(...)
t.Tick();
t.state;            // read-only; assigning throws
t.props;            // frozen
t.finished;         // generated derived getter
t.render(); t.validate();
```

`state` and `props` are `#private`. `props` is frozen. Assigning `state` throws.
Every generated `Start` / `Tick` / … method delegates to `dispatch`, which calls
`obix-ir.applyAction`. There is never a second implementation of an action.

## Dependency role

`obix-spec` + `obix-ir`. Consumed by `obix-equivalence` and `obix-timer`.

## Level 0 status

✅ Complete.
