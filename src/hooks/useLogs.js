import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function useLogs(uidProp) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubSnapshot = null;
    let unsubAuth = null;

    const subscribeForUid = (uid) => {
      // cleanup previous snapshot listener
      if (typeof unsubSnapshot === "function") {
        try {
          unsubSnapshot();
        } catch (e) {
          // ignore
        }
        unsubSnapshot = null;
      }

      if (!uid) {
        setLogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const col = collection(db, "users", uid, "records");
        const q = query(col, orderBy("createdAt", "desc"));
        unsubSnapshot = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => {
              const ddata = d.data() || {};
              let createdAt = null;
              if (ddata.createdAt && ddata.createdAt.toDate) {
                createdAt = ddata.createdAt.toDate();
              }
              return {
                id: d.id,
                images: ddata.images || [],
                emailId: ddata.emailId || null,
                createdAt,
                raw: ddata,
              };
            });
            setLogs(items);
            setLoading(false);
          },
          (e) => {
            console.error("useLogs snapshot error", e);
            setError(e);
            setLoading(false);
          }
        );
      } catch (e) {
        console.error("useLogs init error", e);
        setError(e);
        setLoading(false);
      }
    };

    // initial subscribe using provided uidProp or current auth user
    const initialUid = uidProp || auth.currentUser?.uid;
    subscribeForUid(initialUid);

    // re-subscribe when auth state changes (handles sign-in/out and external edits)
    unsubAuth = onAuthStateChanged(auth, (user) => {
      const newUid = uidProp || user?.uid || null;
      subscribeForUid(newUid);
    });

    return () => {
      if (typeof unsubSnapshot === "function") unsubSnapshot();
      if (typeof unsubAuth === "function") unsubAuth();
    };
  }, [uidProp]);

  return { logs, loading, error };
}
