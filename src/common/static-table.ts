/**
 * This class handles the big data tables. The "type code" meant for type safety is a bit cumbersome,
 * but its usability is rather simple if you look at how it is used in the codebase.
 * */

/** Mandatory property for each member in the tables */
type BaseRow = { id: number };

/**
 * Given an object T with properties, and an array of property names K, which
 * must be an array of properties of T, then this is becomes an array
 * where each element must match the type of the each property, in the order
 * they are assigned in K.
 * */
type RowFromKeys<T extends BaseRow, K extends (keyof T)[]> = {
  [I in keyof K]: K[I] extends keyof T ? T[K[I]] : never;
};

/**
 * Defines a data table, which functions similarly to a SQL
 * table, but it is only meant to be used for reading data,
 * not deleting, creating or updating. It is used
 * for storing big chunks of data in organized way, for example
 * data on all the items in the game.
 * 
 * The first type argument is an object meant to represent each "row"
 * in this table.
 * 
 * The second type argument is an array containing all the property names
 * of the first type argument, in a specific order. Essentially, this should
 * be an array that lists all properties in the order you will be placing them
 * in the constructor argument.
 */
export class StaticDataTable<T extends BaseRow, K extends (keyof T)[]> {
  private data: T[];

  /**
   * @param keys This should be the exact same as the second type argument
   * @param data An array, where each element is another array, containing elements for each property, in the order you have defined the properties of the type T
   */
  constructor(keys: K, data: RowFromKeys<T, K>[]) {
    this.data = [];

    for (const row of data) {
      const object = {} as T;

      for (let i = 0; i < keys.length; i++) {
        object[keys[i]] = row[i];
      }

      this.data.push(object);
    }
  }

  /** Given an ID number, get an item in the database. */
  public get(id: number): T {
    return this.data.find((item) => item.id === id);
  }
}
