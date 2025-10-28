import { db, storage } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

// Delete a record: remove storage objects referenced by download URLs (best-effort)
// and then delete the Firestore document at users/{uid}/records/{recordId}.
export async function deleteRecord(uid, recordId, imageUrls = []) {
  // Delete storage objects referenced by the download URLs. We derive the
  // storage path by extracting the encoded path after '/o/' in the download URL
  // and decoding it.
  for (const url of imageUrls || []) {
    if (!url) continue;
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname || ""; // e.g. /v0/b/<bucket>/o/users%2F...%2Ffile.png
      const split = pathname.split("/o/");
      if (split.length > 1) {
        const encoded = split[1].split("?")[0];
        const storagePath = decodeURIComponent(encoded);
        const r = ref(storage, storagePath);
        await deleteObject(r);
      } else {
        // Fallback: try using the full URL as ref (may work for gs:// or other forms)
        try {
          const r = ref(storage, url);
          await deleteObject(r);
        } catch (e) {
          console.warn('[deleteRecord] could not delete storage object for url', url, e);
        }
      }
    } catch (e) {
      console.warn('[deleteRecord] failed to parse/delete url', url, e);
    }
  }

  // Delete Firestore doc (best-effort)
  try {
    await deleteDoc(doc(db, "users", uid, "records", recordId));
  } catch (e) {
    console.error('[deleteRecord] failed to delete Firestore doc', { uid, recordId, err: e });
    throw e;
  }
}
