import { db, storage, auth } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadOne(path, blobOrFile) {
  const r = ref(storage, path);
  await uploadBytes(r, blobOrFile);
  return getDownloadURL(r);
}

/*
 * Writes one record at /users/{uid}/records/{tsISO}
 * and uploads 4 images under the same path in Storage.
 */
export async function saveDetectionRecord(uid, tsISO, {
  shipOriginal, debrisOriginal, shipResult, debrisResult
}) {
const email = auth?.currentUser?.email || null;
  const base = `users/${uid}/records/${tsISO}`;
//   console.debug('[saveDetectionRecord] uid, base:', { uid, base });
  const [u1, u2, u3, u4] = await Promise.all([
    uploadOne(`${base}/ship-original.png`,   shipOriginal),
    uploadOne(`${base}/debris-original.png`, debrisOriginal),
    uploadOne(`${base}/ship-result.png`,     shipResult),
    uploadOne(`${base}/debris-result.png`,   debrisResult),
  ]);

    try {
        // console.debug('[saveDetectionRecord] writing Firestore doc', { path: `users/${uid}/records/${tsISO}` });
        await setDoc(doc(db, "users", uid, "records", tsISO), {
          images: [u1, u2, u3, u4],
          emailId: email,
          createdAt: serverTimestamp(),
        });
    } catch (e) {
    // Re-throw after logging so caller can handle UI errors
    console.error('[saveDetectionRecord] Firestore write failed:', e);
    throw e;
  }

  return [u1, u2, u3, u4];
}
