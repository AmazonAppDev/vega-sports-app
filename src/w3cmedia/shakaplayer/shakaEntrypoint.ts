// due to problematic typings of shaka that cause the
// imported module not to be tied properly to the types,
// this file acts as a TS proxy that properly types the shaka import

// @ts-expect-error -- ignore the errors that arise from this import
import shakaImpl from './dist/shaka-player.compiled';

// force-reexport the imported implementation as the type of the
// global (configured in tsconfig) shaka namespace
export default shakaImpl as typeof shaka;
