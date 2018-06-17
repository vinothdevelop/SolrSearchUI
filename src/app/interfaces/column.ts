export interface Column {
    name: string;
    type: string;
    docValues: boolean;
    indexed: boolean;
    stored: boolean;
    multiValued: boolean;
    required: boolean;
    termPositions: boolean;
    termVectors: boolean;
    termOffsets: boolean;
    omitNorms: boolean;
    filterType: string;
    filterValue: string;
    validFilter: boolean;
}
