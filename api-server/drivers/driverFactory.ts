/**
 * Factory for creating driver instances based on the specified type
 */

import StorageDriver from './storageDriver';
import MongoDriver from './mongoDriver';

export class DriverFactory {
    /**
     * Creates a driver instance based on the specified type and options
     * @param type The type of driver to create (e.g., 'localStorage', 'sessionStorage', 'indexedDB')
     * @param options The options to pass to the driver constructor
     * @returns An instance of the specified driver
     */
    static createDriver(type: string, options: any): StorageDriver {
        switch (type) {
            case 'mongo':
                return new MongoDriver(options);
            default:
                throw new Error(`Unsupported driver type: ${type}`);
        }
    }
}