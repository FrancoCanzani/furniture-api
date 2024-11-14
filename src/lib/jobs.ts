import { CronJob } from 'cron';
import supabase from './supabase';

// Daily: 0 0 * * * (runs at midnight)
// Every 12 hours: 0 */12 * * * (runs at 12am and 12pm)
// Weekly: 0 0 * * 0 (runs at midnight on Sunday)

export const resetStockJob = () => {
  new CronJob(
    '0 0 * * *', // cronTime
    function () {
      resetStockLevels();
    }, // onTick
    null, // onComplete
    true, // start
    'America/Los_Angeles' // timeZone
  );
};

async function resetStockLevels() {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: 1000 })
      .neq('stock', 1000) // Only update products that don't already have stock=1000
      .select();

    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('Stock reset for', data?.length, 'products');
  } catch (error) {
    console.error('Exception:', error);
  }
}
