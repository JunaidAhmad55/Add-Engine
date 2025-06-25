import { useState, useCallback } from 'react';
import type { CampaignCoreData, CreativeAsset, AdCopyVariant, AdSet } from '@/types/campaign';

const initialCampaignData: CampaignCoreData = {
  name: '',
  objective: '',
  budget: '',
  audience: '',
};

const initialAdSet: AdSet = {
  id: Date.now(),
  name: 'Ad Set 1',
  budget: '',
  audience: 'Broad Audience',
  selectedAssets: [],
};

const initialCopyVariant: AdCopyVariant = {
  id: Date.now(),
  headline: '',
  primaryText: '',
  cta: 'Learn More',
};

export function useCampaignState(initialSampleAssets: CreativeAsset[] = []) {
  const [campaignData, setCampaignData] = useState<CampaignCoreData>(initialCampaignData);
  const [availableAssets, setAvailableAssets] = useState<CreativeAsset[]>(initialSampleAssets.map(asset => ({ ...asset, tags: asset.tags || [] })));
  const [adSets, setAdSets] = useState<AdSet[]>([initialAdSet]);
  const [copyVariants, setCopyVariants] = useState<AdCopyVariant[]>([initialCopyVariant]);

  const addAdSet = useCallback(() => {
    setAdSets(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `Ad Set ${prev.length + 1}`,
        budget: '',
        audience: 'Broad Audience',
        selectedAssets: [],
      },
    ]);
  }, []);

  const removeAdSet = useCallback((id: number) => {
    setAdSets(prev => prev.filter(adSet => adSet.id !== id));
  }, []);

  const duplicateAdSet = useCallback((id: number) => {
    setAdSets(prev => {
      const adSetToDuplicate = prev.find(adSet => adSet.id === id);
      if (!adSetToDuplicate) return prev;

      const duplicatedAdSet: AdSet = {
        ...adSetToDuplicate,
        id: Date.now(),
        name: `${adSetToDuplicate.name} (Copy)`,
      };

      const originalIndex = prev.findIndex(adSet => adSet.id === id);
      const newAdSets = [...prev];
      newAdSets.splice(originalIndex + 1, 0, duplicatedAdSet);

      return newAdSets;
    });
  }, []);

  const updateAdSet = useCallback((id: number, field: string, value: string | CreativeAsset[]) => {
    setAdSets(prev =>
      prev.map(adSet =>
        adSet.id === id ? { ...adSet, [field]: value } : adSet
      )
    );
  }, []);
  
  const handleAssetToggle = useCallback((adSetId: number, asset: CreativeAsset) => {
    setAdSets(prevAdSets =>
      prevAdSets.map(adSet => {
        if (adSet.id === adSetId) {
          const isSelected = adSet.selectedAssets.find(a => a.id === asset.id);
          const newSelectedAssets = isSelected
            ? adSet.selectedAssets.filter(a => a.id !== asset.id)
            : [...adSet.selectedAssets, asset];
          return { ...adSet, selectedAssets: newSelectedAssets };
        }
        return adSet;
      })
    );
  }, []);

  const addUploadedAssets = useCallback((newAssets: CreativeAsset[]) => {
    setAvailableAssets(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const uniqueNewAssets = newAssets.filter(a => !existingIds.has(a.id)).map(asset => ({ ...asset, tags: asset.tags || [] }));
      return [...prev, ...uniqueNewAssets];
    });
  }, []);

  const addTagToAsset = useCallback((assetId: string, tag: string) => {
    const normalizedTag = tag.trim();
    if (!normalizedTag) return;

    setAvailableAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId
          ? { ...asset, tags: [...new Set([...(asset.tags || []), normalizedTag])] }
          : asset
      )
    );
    setAdSets(prevAdSets =>
      prevAdSets.map(adSet => ({
        ...adSet,
        selectedAssets: adSet.selectedAssets.map(asset =>
          asset.id === assetId
            ? { ...asset, tags: [...new Set([...(asset.tags || []), normalizedTag])] }
            : asset
        ),
      }))
    );
  }, []);

  const removeTagFromAsset = useCallback((assetId: string, tagToRemove: string) => {
    setAvailableAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId
          ? { ...asset, tags: (asset.tags || []).filter(t => t !== tagToRemove) }
          : asset
      )
    );
    setAdSets(prevAdSets =>
      prevAdSets.map(adSet => ({
        ...adSet,
        selectedAssets: adSet.selectedAssets.map(asset =>
          asset.id === assetId
            ? { ...asset, tags: (asset.tags || []).filter(t => t !== tagToRemove) }
            : asset
        ),
      }))
    );
  }, []);

  const addCopyVariant = () => {
    setCopyVariants(prev => [
      ...prev,
      { id: Date.now(), headline: '', primaryText: '', cta: 'Learn More' },
    ]);
  };

  const removeCopyVariant = (id: number) => {
    setCopyVariants(prev => prev.filter(variant => variant.id !== id));
  };

  const updateCopyVariant = (id: number, field: string, value: string) => {
    setCopyVariants(prev =>
      prev.map(variant =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };
  
  const resetCampaignState = useCallback(() => {
    setCampaignData(initialCampaignData);
    setAvailableAssets(initialSampleAssets.map(asset => ({ ...asset, tags: asset.tags || [] })));
    setAdSets([{ ...initialAdSet, id: Date.now(), selectedAssets: [] }]);
    setCopyVariants([{ ...initialCopyVariant, id: Date.now() }]);
  }, [initialSampleAssets]);

  return {
    campaignData,
    setCampaignData,
    availableAssets,
    addUploadedAssets,
    adSets,
    addAdSet,
    removeAdSet,
    updateAdSet,
    duplicateAdSet,
    handleAssetToggle,
    addTagToAsset,
    removeTagFromAsset,
    copyVariants,
    setCopyVariants,
    addCopyVariant,
    removeCopyVariant,
    updateCopyVariant,
    resetCampaignState,
    initialCampaignData,
    initialAdSet,
    initialCopyVariant
  };
}
