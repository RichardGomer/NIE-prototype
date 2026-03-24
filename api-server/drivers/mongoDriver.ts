import { MongoClient, ObjectId } from "mongodb";
import StorageDriver from "./storageDriver.ts";


interface MongoDriverOptions {
  connectionString: string;
  dbName: string;
}

class MongoDriver implements StorageDriver {

  private options: MongoDriverOptions;
  private clientPromise: Promise<MongoClient> | null;

  constructor(options: MongoDriverOptions) {
    this.options = options;
    this.clientPromise = null;
  }

  protected normalizeId(id: string): ObjectId {
    return new ObjectId(id);
  }

  public async getDb() {

    const dbName = new URL(this.options.connectionString).pathname.replace(/((^\/+)|(\/+$))/g, "");
    if (!dbName) throw new Error("Database name is not specified in MONGO_URI");

    if (!this.clientPromise) {
      this.clientPromise = MongoClient.connect(this.options.connectionString);
    }
    
    const client = await this.clientPromise;
    return client.db();
  }

  public async addNewItem(collectionName: string, item: any) {
    const db = await this.getDb();
    const result = await db.collection(collectionName).insertOne(item);
    return result.insertedId.toString();
  }

  public async updateItem(collectionName: string, id: string, newItem: any) {
    const db = await this.getDb();
    const result = await db.collection(collectionName).updateOne({ _id: this.normalizeId(id) }, newItem);
    return result.modifiedCount;
  }

  public async deleteFragment(fragId: string) {
    const db = await this.getDb();
    await db.collection("fragments").deleteOne({ _id: this.normalizeId(fragId) });
  }

  public async deleteDocument(docId: string) {
    const db = await this.getDb();
    const normalizedDocId = this.normalizeId(docId);
    await db.collection("fragments").deleteMany({ docid: normalizedDocId });
    await db.collection("documents").deleteOne({ _id: normalizedDocId });
  }

  public async deleteAnnotation(annotationId: string) {
    const db = await this.getDb();
    await db.collection("annotations").deleteOne({ _id: this.normalizeId(annotationId) });
  }

  public async getItem(collectionName: string, itemId: string) {
    const db = await this.getDb();
    return db.collection(collectionName).findOne({ _id: this.normalizeId(itemId) });
  }

  public async getAllFragments_fromSpecificDoc(docId: string) {
    const db = await this.getDb();
    return db.collection("fragments").find({ docid: this.normalizeId(docId) }).toArray();
  }

  public async getAllAnnotations_fromSpecificFragment(fragId: string) {
    const db = await this.getDb();
    const normalizedFragId = this.normalizeId(fragId);
    return db.collection("annotations").find({ linkedFragments: { $in: [normalizedFragId] } }).toArray();
  }

  public async tagItem(collectionName: string, itemId: string, tag: string) {
    const db = await this.getDb();
    await db.collection(collectionName).updateOne(
      { _id: this.normalizeId(itemId) },
      { $addToSet: { tags: tag } }
    );
  }

  public async searchByTagList_OR(collectionName: string, tagList: string[]) {
    const db = await this.getDb();
    return db.collection(collectionName).find({ tags: { $in: tagList } }).toArray();
  }

  public async searchByTagList_AND(collectionName: string, tagList: string[]) {
    const db = await this.getDb();
    return db.collection(collectionName).find({ tags: { $all: tagList } }).toArray();
  }

  public async getAllDocuments() {
    const db = await this.getDb();
    return db.collection("documents").find({}).toArray();
  }

  public async getAllFragments() {
    const db = await this.getDb();
    return db.collection("fragments").find({}).toArray();
  }

  public async getAllAnnotations() {
    const db = await this.getDb();
    return db.collection("annotations").find({}).toArray();
  }

  public async getAllFloors(): Promise<any[]> {
    const db = await this.getDb();
    return db.collection("virtualFloors").find({}).toArray();
  }

}


export default MongoDriver;