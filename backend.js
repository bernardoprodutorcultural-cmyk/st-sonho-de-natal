// ST Solutions · camada de acesso ao Firebase (Auth + Firestore + Storage)
// Caminhos: o Sonho de Natal usa as coleções da raiz; os demais projetos usam projetos/<id>/<coleção>.
// Carregado como módulo; expõe window.STBackend e dispara "st-backend-ready".
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const cfg = window.ST_FIREBASE || null;
const ok = cfg && cfg.apiKey && !/COLE_AQUI/.test(cfg.apiKey) && cfg.projectId && !/SEU-PROJETO/.test(cfg.projectId);

if (ok) {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let storage = null;
  try { if (cfg.storageBucket && !/SEU-PROJETO/.test(cfg.storageBucket)) storage = getStorage(app); } catch (e) { storage = null; }
  const emailKey = e => String(e || "").trim().toLowerCase();

  window.STBackend = {
    projectId: cfg.projectId,
    storageAvailable: !!storage,
    onAuth(cb) { setPersistence(auth, browserLocalPersistence).catch(() => {}); onAuthStateChanged(auth, u => cb(u ? { email: emailKey(u.email), uid: u.uid } : null)); },
    signIn(email, pw) { return signInWithEmailAndPassword(auth, emailKey(email), pw); },
    signUp(email, pw) { return createUserWithEmailAndPassword(auth, emailKey(email), pw); },
    reset(email) { return sendPasswordResetEmail(auth, emailKey(email)); },
    signOut() { return signOut(auth); },
    async usuario(email) { try { const s = await getDoc(doc(db, "usuarios", emailKey(email))); return s.exists() ? s.data() : null; } catch (e) { return null; } },
    async papel(email) { try { const s = await getDoc(doc(db, "usuarios", emailKey(email))); return s.exists() ? (s.data().papel || null) : null; } catch (e) { return null; } },
    subscribe(col, cb, err) { return onSnapshot(collection(db, col), snap => { const o = {}; snap.docs.forEach(d => { o[d.id] = d.data(); }); cb(o, snap.metadata.fromCache); }, err); },
    subscribeDoc(col, id, cb, err) { return onSnapshot(doc(db, col, id), s => cb(s.exists() ? s.data() : null, s.metadata.fromCache), err); },
    set(col, id, data) { return setDoc(doc(db, col, id), data); },
    del(col, id) { return deleteDoc(doc(db, col, id)); },
    setUsuario(email, data) { return setDoc(doc(db, "usuarios", emailKey(email)), data); },
    delUsuario(email) { return deleteDoc(doc(db, "usuarios", emailKey(email))); },
    async upload(file, type, prefix) {
      if (!storage) throw new Error("storage_off");
      const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
      const base = /^(anexos|projetos\/[a-z0-9-]+\/anexos)$/.test(prefix || "") ? prefix : "anexos";
      const path = `${base}/${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}_${safe}`;
      const r = ref(storage, path);
      await uploadBytes(r, file, { contentType: type || file.type });
      const url = await getDownloadURL(r);
      return { id: path, url };
    }
  };
} else {
  window.STBackend = null;
}
window.dispatchEvent(new Event("st-backend-ready"));
