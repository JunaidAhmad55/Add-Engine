
// Re-export types from db-types.ts for convenience and compatibility
export * from './db-types';
// Specifically re-export CreateAssetPayload if it's defined in db-types or asset-service
// Assuming CreateAssetPayload is from asset-service as per its definition
export type { CreateAssetPayload } from './services/asset-service';


// Import services
import * as campaignTemplateService from './services/campaign-template-service';
import * as assetService from './services/asset-service';
import * as campaignService from './services/campaign-service';
import * as adVariantService from './services/ad-variant-service';
import * as adSetService from './services/ad-set-service';
import * as activityLogService from './services/activity-log-service';
import * as performanceService from './services/performance-service';
import * as assetFolderService from './services/asset-folder-service';

// Mock services (user service is still mock, others are replaced)
import * as userServiceMock from './mock/user-service';


// The main 'db' object that combines Supabase services and mock services
export const db = {
  // Supabase-backed services
  ...campaignTemplateService,
  ...assetService,
  ...campaignService,
  ...adVariantService,
  ...adSetService,
  ...activityLogService,
  ...performanceService,
  ...assetFolderService,

  // Mock services
  ...userServiceMock,
};
