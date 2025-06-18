import React from 'react'
import './css/scrollbar.css'
import { useQuery } from '@tanstack/react-query'
import { BLOG_KEYS } from '@/services/blog-service/blog.keys'
import { fetchListCateBlog } from '@/services/blog-service/blog.apis'

interface BlogCategoriesProps {
  onSelectCategory: (categoryId: string | null) => void
  selectedCategory?: string | null
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  // Lấy danh sách danh mục
  const { data: cateData, isLoading } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_CATE_BLOG],
    queryFn: fetchListCateBlog,
    select: (res) => res.data?.results || []
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
        <div className="animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Danh mục</h3>
      <div className="max-h-[200px] overflow-y-auto pr-1">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                selectedCategory === null ? 'bg-purple-50 text-purple-600 font-medium' : ''
              }`}
            >
              Tất cả bài viết
            </button>
          </li>
          {cateData?.map((category: any) => (
            <li key={category._id}>
              <button
                onClick={() => onSelectCategory(category._id)}
                className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
                  selectedCategory === category._id ? 'bg-purple-50 text-purple-600 font-medium' : ''
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
