//Firebase service

import { initializeApp } from "firebase/app";
import {
    initializeFirestore,
    persistentLocalCache,
    getDoc,
    doc,
    CACHE_SIZE_UNLIMITED
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }), // Or another appropriate size
});

export const getDesignsFromFirebase = async () => {
    try {
        const designs = [];
        let batchCount = 1;
        while (true) {
            const designsSnapshot = await getDoc(
                doc(db, `cache/public/designs/designs-batch-${batchCount}`)
            );
            if (designsSnapshot.exists()) {
                const batchDesignsData = designsSnapshot.data().designs;
                if (Array.isArray(batchDesignsData)) {
                    const processedBatch = batchDesignsData.map(design => {
                        let keywordsArray = [];
                        if (typeof design.keywords === 'string') {
                            keywordsArray = design.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                        } else if (Array.isArray(design.keywords)) {
                            keywordsArray = design.keywords.map(k => String(k).trim().toLowerCase()).filter(Boolean);
                        }
                        return {
                            ...design,
                            id: design.id || `gen_id_${Math.random().toString(36).substr(2, 9)}`, // Ensure ID exists
                            keywords: [...new Set(keywordsArray)] // Ensure unique keywords
                        };
                    });
                    designs.push(...processedBatch);
                }
                batchCount++;
            } else {
                break; // No more batches
            }
        }
        return designs;
    } catch (error) {
        console.error("Error fetching designs from Firebase:", error);
        // It's good practice to return an empty array or re-throw,
        // depending on how you want to handle errors upstream.
        return []; // Return empty array on error to prevent app crash
    }
};