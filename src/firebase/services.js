import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { db } from "./config";

// --- USER PROFILE SERVICES ---

/**
 * Creates or updates a user profile in Firestore
 * @param {string} uid - The Firebase Auth user ID
 * @param {object} profileData - The data to store (name, role, etc.)
 */
export const setUserProfile = async (uid, profileData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

/**
 * Fetches a user profile by UID
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// --- LAWYER DISCOVERY SERVICES ---

/**
 * Fetches verified lawyers based on category and region
 */
export const getLawyers = async ({ category, region }) => {
  let q = query(collection(db, "users"), where("role", "==", "lawyer"), where("verified", "==", true));
  
  if (category) q = query(q, where("category", "==", category));
  if (region) q = query(q, where("region", "==", region));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- CONSULTATION SERVICES ---

/**
 * Creates a new booking
 */
export const createBooking = async (bookingData) => {
  return await addDoc(collection(db, "consultations"), {
    ...bookingData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetches consultations for a specific user
 */
export const getBookings = async (userId, role) => {
  const field = role === 'lawyer' ? 'lawyerId' : 'clientId';
  const q = query(collection(db, "consultations"), where(field, "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

// --- DOCUMENT SERVICES ---

/**
 * Saves document metadata
 */
export const saveDocumentMetadata = async (metadata) => {
  return await addDoc(collection(db, "documents"), {
    ...metadata,
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetches documents for a user
 */
export const getDocuments = async (userId) => {
  const q = query(collection(db, "documents"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

// --- ADMIN SERVICES ---

/**
 * Fetches lawyers pending verification
 */
export const getPendingLawyers = async () => {
  const q = query(collection(db, "users"), where("role", "==", "lawyer"), where("verified", "==", false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Verifies a lawyer
 */
export const verifyLawyer = async (lawyerId) => {
  const lawyerRef = doc(db, "users", lawyerId);
  await updateDoc(lawyerRef, { verified: true, verifiedAt: serverTimestamp() });
};

/**
 * Fetches all users (Admin only)
 */
export const getAllUsers = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

/**
 * Manually adds a lawyer profile (Admin only)
 */
export const addLawyerProfile = async (lawyerData) => {
  return await addDoc(collection(db, "users"), {
    ...lawyerData,
    role: "lawyer",
    verified: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a user profile (Admin only)
 */
export const deleteUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
};
