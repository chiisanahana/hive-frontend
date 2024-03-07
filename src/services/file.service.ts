import { ID, Client, Storage } from 'appwrite';

class FileService {
    readonly client = new Client()
        .setEndpoint(import.meta.env.VITE_STORAGE_URL)
        .setProject(import.meta.env.VITE_PROJECT_ID);
    readonly storage = new Storage(this.client);
    readonly bucketId = import.meta.env.VITE_BUCKET_ID;
    
    getFiles(): Promise<any> {
        return this.storage.listFiles(this.bucketId);
    }

    getFile(fileId: string): URL {
        return this.storage.getFilePreview(this.bucketId, fileId);
    }

    uploadFile(file: File): Promise<any> {
        return this.storage.createFile(this.bucketId, ID.unique(), file);
    }

    deleteFile(fileId: string): Promise<any> {
        return this.storage.deleteFile(this.bucketId, fileId);
    }
}

export default new FileService();