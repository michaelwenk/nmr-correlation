import { Spectrum2D } from '../types';

export const spectrumEditedHSQC: Spectrum2D = {
  id: 'spectrumEditedHSQC',
  info: {
    dimension: 2,
    isFid: false,
    experiment: 'hsqc',
    nucleus: ['1H', '13C'],
    pulseSequence: 'hsqced',
  },
  zones: {
    values: [
      {
        id: 'spectrumEditedHSQC_zone1',
        kind: 'signal',
        signal: [
          {
            id: 'spectrumEditedHSQC_zone1_1',
            x: { delta: 1.7 },
            y: { delta: 16.4 },
            kind: 'signal',
            peak: [{ z: 1000 }], // for determination of sign
            sign: 0, // dummy value
          },
        ],
      },
      {
        id: 'spectrumEditedHSQC_zone2',
        kind: 'signal',
        signal: [
          {
            id: 'spectrumEditedHSQC_zone2_1',
            x: { delta: 1.8 },
            y: { delta: 51.3 },
            kind: 'signal',
            peak: [{ z: -1000 }], // for determination of sign
            sign: 0, // dummy value
          },
        ],
      },
    ],
  },
};
