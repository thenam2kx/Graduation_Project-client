import { useQuery } from '@tanstack/react-query';
import { 
  fetchDiscountProducts, 
  fetchFeaturedProducts, 
  fetchPerfumeCategories, 
  fetchListBrand,
  fetchHomepageData
} from '@/apis/apis';

export const useDiscountProducts = () => {
  return useQuery({
    queryKey: ['discountProducts'],
    queryFn: () => fetchDiscountProducts(),
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => fetchFeaturedProducts(),
  });
};

export const usePerfumeCategories = () => {
  return useQuery({
    queryKey: ['perfumeCategories'],
    queryFn: () => fetchPerfumeCategories(),
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => fetchListBrand(),
  });
};

// Hook tổng hợp để lấy tất cả dữ liệu cho trang homepage
export const useHomepageData = () => {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: () => fetchHomepageData(),
  });
};