import { db, storage, auth } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadOne(path, blobOrFile) {
  const r = ref(storage, path);
  try {
    await uploadBytes(r, blobOrFile);
    return getDownloadURL(r);
  } catch (e) {
    // Include path in the error log to help diagnose permission/CORS issues
    console.error('[saveDetectionRecord] upload failed', { path, err: e });
    throw e;
  }
}

/*
 * Writes one record at /users/{uid}/records/{tsISO}
 * and uploads 4 images under the same path in Storage.
 */
export async function saveDetectionRecord(uid, tsISO, {
  shipOriginal, debrisOriginal, shipResult, debrisResult
}) {
  const current = auth?.currentUser || null;
  if (!current) {
    const msg = '[saveDetectionRecord] no authenticated user found. Aborting upload.';
    console.error(msg);
    throw new Error(msg);
  }
  const email = current.email || null;
  if (uid !== current.uid) {
    console.warn('[saveDetectionRecord] uid param does not match auth.currentUser.uid', { uidParam: uid, authUid: current.uid });
  }

  const base = `users/${current.uid}/records/${tsISO}`;
  // console.debug('[saveDetectionRecord] uid, base:', { uid, base });
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
