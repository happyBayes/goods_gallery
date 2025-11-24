/**
 * Design Storage Service
 * 
 * Manages local storage of generated designs using IndexedDB.
 * Provides CRUD operations and storage management.
 */

import { GeneratedDesign } from '../types/creativeDesign';

/**
 * Service for managing design storage in IndexedDB
 */
export class DesignStorageService {
    private dbName = 'CreativeDesignDB';
    private storeName = 'designs';
    private version = 1;
    private db: IDBDatabase | null = null;

    /**
     * Initialize the IndexedDB database
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'id'
                    });

                    // Create indexes for efficient querying
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('artifactId', 'artifactId', { unique: false });
                }
            };
        });
    }

    /**
     * Ensure database is initialized
     */
    private async ensureInitialized(): Promise<void> {
        if (!this.db) {
            await this.init();
        }
    }

    /**
     * Save a design to storage
     */
    async saveDesign(design: GeneratedDesign): Promise<void> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(design);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all designs from storage
     */
    async getAllDesigns(): Promise<GeneratedDesign[]> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a specific design by ID
     */
    async getDesign(id: string): Promise<GeneratedDesign | null> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get designs for a specific artifact
     */
    async getDesignsByArtifact(artifactId: string): Promise<GeneratedDesign[]> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('artifactId');
            const request = index.getAll(artifactId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a design from storage
     */
    async deleteDesign(id: string): Promise<void> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update an existing design
     */
    async updateDesign(design: GeneratedDesign): Promise<void> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(design);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all designs from storage
     */
    async clearAll(): Promise<void> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get the total number of designs
     */
    async getCount(): Promise<number> {
        await this.ensureInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Close the database connection
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

// Export a singleton instance
export const designStorage = new DesignStorageService();
