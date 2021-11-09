import Identifiable from './Identifiable';

/**
 * This data structure is essentially an array of object, with an associated map based on the "id" property of those objects.
 * 
 * CountedCollection maintains:
 * - an array of Identifiable objects (objects with at least one property "id" of type string or number).
 * - a Record of strings (the id of each Identifiable object) mapped to the "count" of that object.
 * 
 * The purpose of this data structure is to record the number/count of a given Identifiable object, storing only the 1 instance of that object. 
 */
export default class CountedCollection<T extends Identifiable> {
  items: T[] = []; // the set of Identifiable objects for this collection
  counts: Record<string | number, number> = {}; // the map of item ids to their associated counts

  constructor(data: Partial<CountedCollection<T>> = {}) {
    let copy: Partial<CountedCollection<T>> = {
      items: [],
      counts: {}
    };

    if (data.items) {
      copy.items = [...data.items];
    }
    if (data.counts) {
      copy.counts = { ...data.counts };
    }

    Object.assign(this, copy);

    if (!this.counts) {
      this.items.forEach((item) => this.counts[item.id] = 1);
    }
  }

  /**
   * Get the number of total items as a sum of the counts for each item id. 
   */
  public getTotalCount() {
    let totalCount = 0;
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      totalCount += this.counts[item.id];
    }

    return totalCount;
  }

  public addCollection(data: CountedCollection<T>) {
    for (let i = 0; i < data.items.length; i++) {
      let item = data.items[i];
      this.add(item, data.counts[item.id]);
    }
  }

  /**
   * Add an item to the collection, incrementing that item's count if it already exists.
   * 
   * @param item the item to add/increment
   */
  public addOne(item: T) {
    this.add(item, 1);
  }

  /**
   * Add some number to the count for a given item
   * 
   * @param item the item to add/increment
   * @param count the number to add to the given item's count
   */
  public add(item: T, count: number) {
    const existingCount = this.counts[item.id] ? this.counts[item.id] : 0;
    if (!existingCount) {
      this.items = [
        ...this.items,
        item
      ];
    }

    this.counts[item.id] = existingCount + count;
  }

  /**
   * Subtract 1 from the given item's count, removing that item if its count is equal to 1.
   * 
   * @param item the item to subtract/decrement
   */
  public subtractOne(item: T) {
    this.subtract(item, 1);
  }

  /**
   * Subtract some number from the count for a given item.
   * 
   * @param item the item to subtract/decrement
   * @param count the number to subtract from the given item's count
   */
  public subtract(item: T, count: number) {
    const existingCount = this.counts[item.id] ? this.counts[item.id] : 0;
    if (count > existingCount) {
      count = existingCount;
    }

    if (count === existingCount) {
      let idx = -1;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === item.id) {
          idx = i;
        }
      }

      if (idx > -1) {
        this.items.splice(idx, 1);
      }
    }

    this.counts[item.id] = existingCount - count;
  }

  /**
   * Remove an item from the collection.
   * 
   * @param item the item to remove
   */
  public removeAll(item: T) {
    this.subtract(item, this.items.length);
  }
}
