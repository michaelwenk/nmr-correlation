import { Tolerance } from '../../types/correlation/tolerance';
import { Values } from '../../types/correlation/values';
import { Experiment1DSignals } from '../../types/experiment/experiment1DSignals';
import { addLink } from '../correlation/addLink';
import { buildCorrelation } from '../correlation/buildCorrelation';
import { buildLink } from '../correlation/buildLink';
import { containsLink } from '../correlation/containsLink';
import { hasLinks } from '../correlation/hasLinks';
import { removeLink } from '../correlation/removeLink';
import { checkMatch } from '../general/checkMatch';

/**
 * Adds new correlations from 1D data or adds links to already existing ones.
 *
 * @param {Values} correlations
 * @param {Experiment1DSignals} signals1D
 * @param {Tolerance} tolerance
 */
export function addFromData1D(
  correlations: Values,
  signals1D: Experiment1DSignals,
  tolerance: Tolerance,
): Values {
  // remove previous set links from 1D, but not pseudo links
  correlations.forEach((correlation) => {
    const linksToRemove = correlation.link.filter(
      (link) => link.experimentType === '1d',
    );
    linksToRemove.forEach((link) => removeLink(correlation, link.id));
  });
  Object.keys(signals1D).forEach((atomType) => {
    signals1D[atomType].forEach((signal1D) => {
      const matchedCorrelationIndices = correlations
        .map((correlation, k) =>
          correlation.pseudo === false &&
          correlation.atomType === atomType &&
          checkMatch(
            correlation.signal.delta,
            signal1D.signal.delta,
            tolerance[atomType],
          )
            ? k
            : -1,
        )
        .filter((index) => index >= 0)
        .filter((index, i, a) => a.indexOf(index) === i);

      if (matchedCorrelationIndices.length === 0) {
        const pseudoIndex = correlations.findIndex(
          (correlation) =>
            correlation.atomType === atomType &&
            correlation.pseudo === true &&
            !hasLinks(correlation),
        );
        const newCorrelation = buildCorrelation({
          atomType: signal1D.atomType,
          experimentID: signal1D.experimentID,
          experimentType: signal1D.experimentType,
          signal: { delta: signal1D.signal.delta, id: signal1D.signal.id },
        });
        if (pseudoIndex >= 0) {
          correlations[pseudoIndex] = newCorrelation;
        } else {
          correlations.push(newCorrelation);
        }
      } else {
        const link = buildLink({
          experimentType: signal1D.experimentType,
          experimentID: signal1D.experimentID,
          signal: signal1D.signal,
          atomType: [atomType],
        });
        // if allowed then add links from 1D data in first match only
        if (!containsLink(correlations[matchedCorrelationIndices[0]], link)) {
          addLink(correlations[matchedCorrelationIndices[0]], link);
        }
      }
    });
  });

  return correlations;
}
