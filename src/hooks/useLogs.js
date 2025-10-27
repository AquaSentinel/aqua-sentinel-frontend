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

export default function useLogs(uidProp) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub = null;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const uid = uidProp || auth.currentUser?.uid;
        if (!uid) {
          setLogs([]);
          setLoading(false);
          return;
        }

        const col = collection(db, "users", uid, "records");
        const q = query(col, orderBy("createdAt", "desc"));
        unsub = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => {
              const ddata = d.data() || {};
              // Ensure createdAt is a JS Date when available
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
    }
    init();

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [uidProp]);

  return { logs, loading, error };
}
