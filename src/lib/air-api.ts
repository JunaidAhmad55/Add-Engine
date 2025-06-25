
// Mock AIR integration service

export interface AIRAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  previewUrl: string;
  tags?: string[];
}

class AIRApiService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('air_api_key', key);
  }

  getStoredApiKey() {
    this.apiKey = localStorage.getItem('air_api_key');
    return this.apiKey;
  }

  isConnected(): boolean {
    return !!this.apiKey;
  }

  async connect(apiKey: string): Promise<{ success: boolean; error?: string }> {
    if (!apiKey) {
      return { success: false, error: 'API Key is required.' };
    }
    // Mock connection validation
    console.log('Connecting to AIR with API Key:', apiKey);
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.setApiKey(apiKey);
    return { success: true };
  }

  async getAssets(): Promise<{ success: boolean; assets?: AIRAsset[]; error?: string }> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to AIR.' };
    }

    console.log('Fetching assets from AIR...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock asset data
    const mockAssets: AIRAsset[] = [
      {
        id: 'air-asset-1',
        name: 'Summer_Campaign_Hero.png',
        type: 'image',
        previewUrl: '/placeholder.svg',
        tags: ['summer', 'sale']
      },
      {
        id: 'air-asset-2',
        name: 'Promo_Video_V2.mp4',
        type: 'video',
        previewUrl: '/placeholder.svg',
        tags: ['promo', 'video']
      },
      {
        id: 'air-asset-3',
        name: 'Lifestyle_Shoot_1.jpg',
        type: 'image',
        previewUrl: '/placeholder.svg',
        tags: ['lifestyle']
      }
    ];

    return { success: true, assets: mockAssets };
  }
}

export const airApiService = new AIRApiService();
