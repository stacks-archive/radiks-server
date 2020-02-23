import requestPromise from 'request-promise';
import { UriOptions } from 'request';

/**
 * LRU cache for responses of calls to core node
 */
class CoreNodeCache {

  private values: Map<string, any> = new Map<string, any>();

  private maxEntries: number = 20;

  async request(options:{uri:string, json:boolean}): Promise<any> {
    const cachedResult: any = this.get(options.uri);

    if (cachedResult ) {
      return cachedResult;
    }

    return requestPromise(options).then((result:any) => {
      this.put(options.uri, result);
      return result;
    });
  }

 private get(key: string): any {
    const hasKey = this.values.has(key);
    let entry: any;
    if (hasKey) {
      entry = this.values.get(key);
      this.values.delete(key);
      this.values.set(key, entry);
    }
    return entry;
  }

  private put(key: string, value: Response) {
    if (this.values.size >= this.maxEntries) {
      const keyToDelete = this.values.keys().next().value;
      this.values.delete(keyToDelete);
    }
    this.values.set(key, value);
  }
}

export default CoreNodeCache;
