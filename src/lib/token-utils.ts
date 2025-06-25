
import type { CampaignCoreData, AdSet } from '@/types/campaign';
import { format } from 'date-fns';

interface TokenContext {
  campaign: CampaignCoreData;
  adSet: AdSet;
  adSetIndex: number;
  date: Date;
}

/**
 * Processes a string template with placeholders and replaces them with values from the context.
 * @param template The string containing placeholders like {{campaign.name}}.
 * @param context An object containing the data to be used for replacements.
 * @returns The processed string with placeholders replaced by actual values.
 */
export const processTokens = (template: string, context: TokenContext): string => {
  if (!template) return '';

  const tokens: Record<string, () => string> = {
    'campaign.name': () => context.campaign.name,
    'campaign.objective': () => context.campaign.objective,
    'adSet.audience': () => context.adSet.audience,
    'adSet.budget': () => String(context.adSet.budget),
    'adSet.index': () => String(context.adSetIndex + 1),
    'adSet.asset_count': () => String(context.adSet.selectedAssets.length),
    'adSet.first_asset_name': () => {
      const firstAsset = context.adSet.selectedAssets[0];
      if (!firstAsset) return '';
      const nameParts = firstAsset.name.split('.');
      if (nameParts.length > 1) {
        return nameParts.slice(0, -1).join('.');
      }
      return firstAsset.name;
    },
    'date.yyyy-mm-dd': () => format(context.date, 'yyyy-MM-dd'),
    'date.mm-dd-yyyy': () => format(context.date, 'MM-dd-yyyy'),
  };

  return template.replace(/\{\{([^}]+)\}\}/g, (match, tokenKey) => {
    const key = tokenKey.trim().toLowerCase();
    if (key in tokens) {
      try {
        return tokens[key]();
      } catch (e) {
        console.error(`Error processing token: ${key}`, e);
        return ''; // Return empty string for token if processing fails
      }
    }
    return match; // Return original placeholder if token not found
  });
};
