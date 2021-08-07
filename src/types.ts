/**
 * These types are derived from @google-cloud/logging NPM package.
 *
 * Read more: https://cloud.google.com/logging/docs/structured-logging#special-payload-fields
 */
export declare const INSERT_ID_KEY = 'logging.googleapis.com/insertId';
export declare const LABELS_KEY = 'logging.googleapis.com/labels';
export declare const OPERATION_KEY = 'logging.googleapis.com/operation';
export declare const SOURCE_LOCATION_KEY =
  'logging.googleapis.com/sourceLocation';
export declare const SPAN_ID_KEY = 'logging.googleapis.com/spanId';
export declare const TRACE_KEY = 'logging.googleapis.com/trace';
export declare const TRACE_SAMPLED_KEY = 'logging.googleapis.com/trace_sampled';

export type StructuredJsonSeverity =
  | 'DEFAULT'
  | 'DEBUG'
  | 'INFO'
  | 'NOTICE'
  | 'WARNING'
  | 'ERROR'
  | 'CRITICAL'
  | 'ALERT'
  | 'EMERGENCY';

export interface StructuredJson {
  severity?: StructuredJsonSeverity;
  message?: string | unknown;
  httpRequest?: unknown;
  timestamp?: string;
  [INSERT_ID_KEY]?: string;
  [OPERATION_KEY]?: unknown;
  [SOURCE_LOCATION_KEY]?: unknown;
  [LABELS_KEY]?: unknown;
  [SPAN_ID_KEY]?: string;
  [TRACE_KEY]?: string;
  [TRACE_SAMPLED_KEY]?: boolean;
  logName?: string;
  resource?: unknown;
}
