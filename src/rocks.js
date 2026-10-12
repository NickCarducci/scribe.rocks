import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase.js";

// Same layout as FirestoreRockSyncService.swift:
// scriberocks_users/{uid}/rocks/{UUID} { text, createdAt, updatedAt, isDiamond, deleted? }
// Deletes are tombstones (deleted: true) so other devices learn about them.

const userDoc = (uid) => doc(db, "scriberocks_users", uid);
const rocksCol = (uid) => collection(userDoc(uid), "rocks");

export function fromFirestore(id, data) {
  if (typeof data.text !== "string" || !data.createdAt) return null;
  const createdAt = data.createdAt.toDate();
  return {
    id,
    text: data.text,
    createdAt,
    updatedAt: data.updatedAt?.toDate() ?? createdAt,
    isDiamond: data.isDiamond === true,
    deleted: data.deleted === true,
  };
}

/** Live list of a user's rocks, newest first, tombstones removed. */
export function watchRocks(uid, onRocks, onError) {
  return onSnapshot(
    rocksCol(uid),
    (snapshot) => {
      const rocks = snapshot.docs
        .map((d) => fromFirestore(d.id, d.data()))
        .filter((rock) => rock && !rock.deleted)
        .sort((a, b) => b.createdAt - a.createdAt);
      onRocks(rocks);
    },
    onError,
  );
}

function write(uid, rock) {
  return setDoc(doc(rocksCol(uid), rock.id), {
    text: rock.text,
    createdAt: Timestamp.fromDate(rock.createdAt),
    updatedAt: Timestamp.fromDate(rock.updatedAt),
    isDiamond: rock.isDiamond,
    ...(rock.deleted ? { deleted: true } : {}),
  });
}

export function addRock(uid, text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const now = new Date();
  // Uppercase to match Swift's UUID().uuidString.
  const rock = { id: crypto.randomUUID().toUpperCase(), text: trimmed, createdAt: now, updatedAt: now, isDiamond: false };
  return write(uid, rock);
}

export function updateRock(uid, rock, changes) {
  return write(uid, { ...rock, ...changes, updatedAt: new Date() });
}

export function deleteRock(uid, rock) {
  return write(uid, { ...rock, deleted: true, updatedAt: new Date() });
}

/** Account deletion: remove every document this app stores for the user. */
export async function deleteAllData(uid) {
  const snapshot = await getDocs(rocksCol(uid));
  for (let i = 0; i < snapshot.docs.length; i += 450) {
    const batch = writeBatch(db);
    snapshot.docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  await deleteDoc(userDoc(uid));
}
