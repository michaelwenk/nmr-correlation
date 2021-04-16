import { signalKindsToInclude } from '../../constants/signalKinds';
import lodashCloneDeep from 'lodash/cloneDeep';
import { getAtomTypeFromNucleus } from '../general/getAtomTypeFromNucleus';
import { checkMatch } from '../general/checkMatch';
import { ExperimentsType } from '../../types/experiment/experimentsType';
import { Experiment1DSignals } from '../../types/experiment/experiment1DSignals';
import { Spectrum1D } from '../../types/spectrum/spectrum1D';
import { Experiment1DSignal } from '../../types/experiment/experiment1DSignal';

/**
 * Get all DEPT signals from experiments with allowed signal kinds in "SignalKindsToInclude"
 * @param {ExperimentsType} experiments1DExtra
 */
export function getSignalsDEPT(
  experiments1DExtra: ExperimentsType,
): Experiment1DSignals {
  // store valid signals from 1D extra experiments, e.g. DEPT, APT
  const _signalsDEPT: Experiment1DSignals = {};
  // store valid signals from 2D experiments
  Object.keys(experiments1DExtra)
    .filter((experimentType) => experimentType === 'dept')
    .forEach((experimentType) =>
      experiments1DExtra[experimentType].forEach((_experimentDEPT) => {
        const experimentDEPT: Spectrum1D = _experimentDEPT as Spectrum1D;
        const _signals: Array<Experiment1DSignal> = [];
        const match: Array<string> | null = experimentDEPT.info.pulseSequence.match(
          /\d/g,
        );
        if (match) {
          const mode = match.reduce((_mode, digit) => _mode + digit);
          const atomType = getAtomTypeFromNucleus(experimentDEPT.info.nucleus);
          const __signals = experimentDEPT.ranges.values
            .map((range) =>
              range.signal
                .filter((signal) => signalKindsToInclude.includes(signal.kind))
                .map((signal) => {
                  return { ...signal, sign: range.absolute > 0 ? 1 : -1 };
                }),
            )
            .flat();
          __signals.forEach((signal) => {
            if (
              !_signals.some((_signal) =>
                checkMatch(_signal.signal.delta, signal.delta, 0.0),
              )
            ) {
              _signals.push({
                experimentType,
                experimentID: experimentDEPT.id,
                mode,
                atomType,
                signal: lodashCloneDeep(signal),
              });
            }
          });

          _signalsDEPT[mode] = _signals;
        }
      }),
    );

  return _signalsDEPT;
}
