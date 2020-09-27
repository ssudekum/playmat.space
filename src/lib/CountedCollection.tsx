import Identifiable from './Identifiable';

export default class CountedCollection<T extends Identifiable> {
    items: T[] = [];
    counts:  Record<string | number, number> = {};

    constructor(data: Partial<CountedCollection<T>> = {}) {
        Object.assign(this, data);
        if (!data.counts) {
            this.items.forEach((item) => this.counts[item.id] = 1);
        }
    }

    public add(item: T) {
        this.addMany(item, 1);
    }

    public addMany(item: T, count: number) {
        const existingCount = this.counts[item.id] ? this.counts[item.id] : 0;
        if (!existingCount) {
            this.items = [
                ...this.items,
                item
            ];
        }

        this.counts[item.id] = existingCount + count;
    }

    public remove(item: T) {
        this.removeMany(item, 1);
    }

    public removeMany(item: T, count: number) {
        const existingCount = this.counts[item.id] ? this.counts[item.id] : 0;
        if (count > existingCount) {
            count = existingCount;
        } 

        if (count === existingCount) {
            let idx = -1;
            for (let i = 0; i < this.items.length; i++) {
                if(this.items[i].id === item.id) {
                    idx = i;
                }
            }

            if (idx > -1) {
                this.items.splice(idx, 1);
            }
        }

        this.counts[item.id] = existingCount - count;
    }
    
    public removeAll(item: T) {
        this.removeMany(item, this.items.length);
    }
}

