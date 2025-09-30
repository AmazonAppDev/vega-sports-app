import {
  getTrackVariantLabel,
  type LabelTrackInfoParam,
} from '../getTrackVariantLabel';

describe('ApiClient service', () => {
  it.each([
    {
      width: 300,
      height: 200,
      frameRate: 30,
      label: 'Unknown Resolution 30fps',
    },
    {
      width: 1280,
      height: 720,
      frameRate: undefined,
      label: '720p HD',
    },
    {
      width: 1920,
      height: 1080,
      frameRate: 60,
      label: '1080p FHD 60fps',
    },
    {
      width: 1000,
      height: 500,
      frameRate: undefined,
      label: 'Unknown Resolution',
    },
    {
      width: 1000,
      height: 500,
      frameRate: 30,
      label: 'Unknown Resolution 30fps',
    },
    {
      width: undefined,
      height: 1080,
      frameRate: undefined,
      label: 'Unknown Resolution',
    },
    {
      width: 3840,
      height: 2160,
      frameRate: undefined,
      label: '4K UHD',
    },
    {
      width: 7680,
      height: 4320,
      frameRate: 120,
      label: '8K UHD 120fps',
    },
    {
      width: 720,
      height: 480,
      frameRate: undefined,
      label: '480p',
    },
    {
      width: 720,
      height: 576,
      frameRate: 25,
      label: '576p 25fps',
    },
    {
      width: 300,
      height: 200,
      frameRate: 30,
      label: 'Unknown Resolution 30fps',
    },
    {
      width: 300,
      height: 200,
      frameRate: undefined,
      label: 'Unknown Resolution',
    },
    {
      width: 1920,
      height: 1080,
      frameRate: undefined,
      label: '1080p FHD',
    },
    {
      width: 3840,
      height: 2160,
      frameRate: 30,
      label: '4K UHD 30fps',
    },
    {
      width: 7680,
      height: 4320,
      frameRate: undefined,
      label: '8K UHD',
    },
  ] as (LabelTrackInfoParam & { label: string })[])(
    '$width x $height @ $fps fps -> $label',
    ({ label, ...testCase }) => {
      expect(getTrackVariantLabel(testCase)).toEqual(label);
    },
  );
});
