// we need to disable eslint rule because @AppEnvs module is just 'virtual'
// refer to service README Getting Started or Type Definitions section
// eslint-disable-next-line import/no-unresolved
import type { ExpectValueType } from '@AppEnvs';

export type BoolCandidate = NonNullable<ExpectValueType<boolean>>;

export type { ExpectValueType };
