import { LogbookSection, LogbookSectionInput } from '../__generated__/graphql';

export const stringifyLogbookSection = (
  section: LogbookSection | LogbookSectionInput,
): string => {
  return [section.region, section.river, section.section]
    .filter((i) => !!i)
    .join(' - ');
};
