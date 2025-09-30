const resolutionToLabel = [
  { width: 720, height: 480, label: '480p' },
  { width: 720, height: 576, label: '576p' },
  { width: 1280, height: 720, label: '720p HD' },
  { width: 1920, height: 1080, label: '1080p FHD' },
  { width: 3840, height: 2160, label: '4K UHD' },
  { width: 7680, height: 4320, label: '8K UHD' },
];

export type LabelTrackInfoParam = Pick<
  shaka.extern.Track,
  'width' | 'height' | 'frameRate'
>;

export function getTrackVariantLabel({
  width,
  height,
  frameRate,
}: LabelTrackInfoParam): string {
  const match = resolutionToLabel.find(
    (res) => res.width === width && res.height === height,
  );

  let label = match?.label ?? 'Unknown Resolution';

  if (frameRate !== undefined) {
    label += ` ${frameRate}fps`;
  }

  return label;
}
