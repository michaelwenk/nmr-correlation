import { Values } from '../../types/correlation/values';

export function getCorrelationsByAtomType(
  correlations: Values,
  atomType: string,
): Values {
  return correlations
    ? correlations.filter((correlation) => correlation.atomType === atomType)
    : [];
}