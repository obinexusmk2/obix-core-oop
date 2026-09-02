import test from "node:test";
import assert from "node:assert/strict";
import { toOOP } from "../dist/index.js";
import { TimerDOP } from "obix-timer";

test("generated action methods delegate to applyAction; derived are getters", () => {
  const Timer = toOOP(TimerDOP);
  const t = new Timer({ props: { limitSeconds: 5 } });
  t.Start();
  t.Tick();
  t.Tick();
  assert.deepEqual(t.state, { seconds: 2, running: true });
  assert.equal(t.stopped, false);
  t.Stop();
  assert.deepEqual(t.state, { seconds: 2, running: false });
});

test("state is read-only from outside; props are frozen", () => {
  const Timer = toOOP(TimerDOP);
  const t = new Timer();
  assert.throws(() => {
    t.state = { seconds: 99, running: true };
  }, /read-only/);
  assert.ok(Object.isFrozen(t.props));
});

test("render + validate are exposed on instances", () => {
  const Timer = toOOP(TimerDOP);
  const t = new Timer({ state: { seconds: 5, running: false }, props: { limitSeconds: 5 } });
  assert.match(t.render(), /Finished/);
  assert.equal(t.validate().valid, true);
});
