import { Values } from '../../types/correlation/values';
import { addAttachment } from '../correlation/addAttachment';
import { hasAttachmentAtomType } from '../correlation/hasAttachmentAtomType';
import { removeAttachments } from '../correlation/removeAttachments';

/**
 * Sets the attachment information (indices of attached atoms).
 * And from that, the equivalence value for protons can be set too.
 *
 * @param {Values} values
 */
export function setAttachmentsAndProtonEquivalences(
  correlations: Values,
): Values {
  // update attachment information between heavy atoms and protons via HSQC or HMQC
  correlations.forEach((correlation) => {
    // remove previous set attachments
    removeAttachments(correlation);
    // add attachments
    correlation.link
      .filter(
        (link) =>
          link.experimentType === 'hsqc' || link.experimentType === 'hmqc',
      )
      .forEach((link) => {
        const otherAtomType = link.atomType[link.axis === 'x' ? 1 : 0];
        link.match.forEach((matchIndex) => {
          addAttachment(correlation, otherAtomType, matchIndex);
        });
      });
  });
  // reset previously set proton equivalences and set new ones
  // check heavy atoms with an unambiguous protons count
  correlations.forEach((correlation) => {
    if (
      correlation.atomType !== 'H' &&
      correlation.protonsCount.length === 1 &&
      hasAttachmentAtomType(correlation, 'H')
    ) {
      let equivalences = 1;
      if (correlation.protonsCount[0] === 3) {
        equivalences = 3;
      } else if (correlation.protonsCount[0] === 2) {
        equivalences = 2;
      }
      const sharedEquivalences =
        (correlation.equivalence * equivalences) /
        correlation.attachment.H.length;
      correlation.attachment.H.forEach((attachedProtonIndex) => {
        correlations[attachedProtonIndex].equivalence = sharedEquivalences;
      });
    }
  });

  return correlations;
}
