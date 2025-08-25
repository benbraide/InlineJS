import { ChangeType } from "../types/change";
import { IChanges } from "../types/changes";
/**
 *
 * @param type The type of change ('set' | 'delete')
 * @param path The full path to the property that changed (e.g. 'myProxy.data.name')
 * @param prop The name of the property that changed (e.g. 'name')
 * @param changes The changes instance to add the change to
 * @param shouldBubble Whether to bubble the change up to parent paths
 */
export declare function AddChanges(type: ChangeType, path: string, prop: string, changes?: IChanges, shouldBubble?: boolean): void;
