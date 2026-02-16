import { useQuery } from '@tanstack/react-query';
import { db } from '../config/firebase';
import { AnnouncementType } from '../types';

export const useSearchAds = (searchQuery: string) => {
  return useQuery({
    queryKey: ['ads', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return [];
      }

      const snapshot = await db.collection('Ads').get();
      
      const results: AnnouncementType[] = [];
      
      snapshot.forEach((doc) => {
        const ad = { id: doc.id, ...doc.data() } as AnnouncementType;
        if (ad.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push(ad);
        }
      });

      return results;
    },
    enabled: searchQuery.trim().length > 0,
  });
};
