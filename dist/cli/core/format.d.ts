import { LoadedConfig } from '../config';
import { CompactInterfaceDetail, ListInterfacesResult, MockResult, SearchMatch, TypeGenerationResult } from '../types';
export declare function printConfig(config: LoadedConfig): void;
export declare function printList(results: ListInterfacesResult[]): void;
export declare function printSearch(matches: SearchMatch[]): void;
export declare function printInterface(detail: CompactInterfaceDetail): void;
export declare function printMock(result: MockResult): void;
export declare function printTypes(result: TypeGenerationResult): void;
