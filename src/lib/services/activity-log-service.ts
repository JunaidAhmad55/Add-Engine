
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface LogActivityPayload {
  team_id: string;
  user_id: string;
  action: string;
  details?: Json;
}

/**
 * Logs a user activity to the database.
 * This is designed to not throw an error, as logging should not block primary user actions.
 * @param payload - The activity data to log.
 * @returns The created activity log entry, or null if an error occurred.
 */
export const logActivity = async (payload: LogActivityPayload) => {
  const { data, error } = await supabase.from('activity_log').insert(payload).select().single();

  if (error) {
    console.error('Error logging activity:', error);
    return null;
  }

  return data;
};
