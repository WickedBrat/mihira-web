jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveGuide, readGuide, GUIDE_STORAGE_KEY } from '@/lib/guideStore';

const mockGet = AsyncStorage.getItem as jest.Mock;
const mockSet = AsyncStorage.setItem as jest.Mock;

describe('guideStore', () => {
  describe('readGuide', () => {
    it('returns null when nothing stored', async () => {
      mockGet.mockResolvedValueOnce(null);
      expect(await readGuide()).toBeNull();
    });

    it('returns stored guide name', async () => {
      mockGet.mockResolvedValueOnce('Krishna');
      expect(await readGuide()).toBe('Krishna');
    });

    it('returns null when AsyncStorage throws', async () => {
      mockGet.mockRejectedValueOnce(new Error('disk full'));
      expect(await readGuide()).toBeNull();
    });
  });

  describe('saveGuide', () => {
    it('saves guide name to AsyncStorage', async () => {
      mockSet.mockResolvedValueOnce(undefined);
      await saveGuide('Shiva');
      expect(mockSet).toHaveBeenCalledWith(GUIDE_STORAGE_KEY, 'Shiva');
    });
  });
});
