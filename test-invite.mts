/**
 * End-to-end check of the invite lifecycle against the real Firestore, including
 * the rules in firestore.rules — a rejected write only shows up at runtime, so
 * this is the smallest thing that fails if invite codes or the pending/replied
 * signal break. Cleans up after itself.
 *
 *   npx tsx test-invite.mts
 */
import assert from "node:assert/strict";
import { createInvite, getRSVP, updateRSVP, deleteRSVP } from "./src/firebase";

const created = await createInvite("Invite Lifecycle Test");

try {
  assert.match(created.id, /^[23456789abcdefghjkmnpqrstuvwxyz]{6}$/, "code should be 6 unambiguous chars");

  const pending = await getRSVP(created.id);
  assert.ok(pending, "the invite should be readable by its code");
  assert.equal(pending.timestamp, "", "a new invite is pending, i.e. has no timestamp");
  assert.equal(pending.guestName, "Invite Lifecycle Test");

  // What RSVPModal writes when the guest replies through their link.
  await updateRSVP(created.id, {
    guestName: "Invite Lifecycle Test",
    guestCount: 2,
    phone: "0123456789",
    email: "",
    dietChoice: "vegetarian",
    attending: true,
    timestamp: new Date().toLocaleString(),
  });

  const replied = await getRSVP(created.id);
  assert.ok(replied, "the invite should still exist after replying");
  assert.notEqual(replied.timestamp, "", "a reply stamps the timestamp — this is the 'responded' flag");
  assert.equal(replied.guestCount, 2);
  assert.equal(replied.dietChoice, "vegetarian");
  assert.equal(replied.attending, true);

  assert.equal(await getRSVP("zzzzzz"), null, "an unknown code resolves to null, not a throw");

  console.log(`ok — invite ${created.id} created, read, replied to, and read back`);
} finally {
  await deleteRSVP(created.id);
}

process.exit(0);
