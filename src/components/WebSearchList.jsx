import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, ExternalLink, Plus, Globe, Layers } from 'lucide-react';

export default function WebSearchList() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [engine, setEngine] = useState('bing');

  const executeSearch = async (searchQuery, targetEngine) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setPage(1);
    setHasMore(true);

    try {
      const res = await axios.get(
        `https://omnisearch-backend-fxr7.onrender.com/api/web?q=${encodeURIComponent(searchQuery)}&page=1&engine=${targetEngine}`
      );
      const data = res.data.data || [];
      setArticles(data);
      if (data.length === 0 || res.data.hasMore === false) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm web:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    executeSearch(query, engine);
  };

  const handleEngineChange = (newEngine) => {
    if (newEngine === engine) return;
    setEngine(newEngine);
    if (query.trim()) {
      executeSearch(query, newEngine);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const res = await axios.get(
        `https://omnisearch-backend-fxr7.onrender.com/api/web?q=${encodeURIComponent(query)}&page=${nextPage}&engine=${engine}`
      );
      const newArticles = res.data.data || [];

      if (newArticles.length === 0 || res.data.hasMore === false) {
        setHasMore(false);
      }

      setArticles((prev) => {
        const existingUrls = new Set(prev.map((item) => item.url));
        const filteredNew = newArticles.filter((item) => !existingUrls.has(item.url));
        return [...prev, ...filteredNew];
      });

      setPage(nextPage);
    } catch (err) {
      console.error('Lỗi khi tải thêm bài viết:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Khung tìm kiếm */}
      <div className="max-w-xl mx-auto w-full mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, tài liệu, website..."
              style={{ 
    color: '#0f172a', 
    backgroundColor: '#ffffff',
    WebkitTextFillColor: '#0f172a' 
  }}
  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Tìm'}
          </button>
        </form>

        {/* Nút chọn Nguồn 1 & Nguồn 2 */}
        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => handleEngineChange('bing')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              engine === 'bing'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe size={13} />
            Nguồn 1
          </button>
          <button
            type="button"
            onClick={() => handleEngineChange('yandex')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              engine === 'yandex'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers size={13} />
            Nguồn 2
          </button>

          {/* THÊM NÚT NÀY: */}
  <button
    type="button"
    onClick={() => handleEngineChange('duckduckgo')}
    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
      engine === 'duckduckgo'
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    <Globe size={13} />
    Nguồn 3 (Mở rộng - Không giới hạn)</button>
        </div>
      </div>

      {/* Thông tin kết quả */}
      {articles.length > 0 && (
        <div className="flex justify-between items-center text-xs text-slate-500 pb-3 border-b border-slate-100 mb-5">
          <span>Tìm thấy: <strong className="text-slate-800">{articles.length}</strong> bài viết</span>
          <span>Trang: <strong>{page}</strong> • {engine === 'bing' ? 'Nguồn 1' : 'Nguồn 2'}</span>
        </div>
      )}

      {/* Danh sách kết quả dạng thẻ */}
      <div className="flex flex-col gap-3.5 w-full">
        {articles.map((item, idx) => (
          <div
            key={`${item.url}-${idx}`}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-sm hover:border-slate-300 transition duration-150 flex flex-col gap-1.5 text-left"
          >
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-600 px-2 py-0.5 bg-slate-200/60 rounded">
                {item.domain}
              </span>
              <span className="truncate max-w-md hidden sm:inline">{item.url}</span>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 leading-snug"
            >
              <span>{item.title}</span>
              <ExternalLink size={14} className="shrink-0 text-slate-400" />
            </a>

            {item.snippet && (
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {item.snippet}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Nút bấm tải thêm */}
      {articles.length > 0 && hasMore && (
        <div className="text-center my-8">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 transition inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {loadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin text-blue-600" />
                Đang nạp thêm...
              </>
            ) : (
              <>
                <Plus size={14} />
                Tải thêm kết quả
              </>
            )}
          </button>
        </div>
      )}

      {/* Trạng thái chưa tìm hoặc không có kết quả */}
      {!loading && hasSearched && articles.length === 0 && (
        <div className="py-20 text-center text-slate-400 text-sm">
          Không tìm thấy bài viết phù hợp.
        </div>
      )}

      {!hasSearched && (
        <div className="py-20 text-center text-slate-400 text-sm">
          Nhập từ khóa phía trên để bắt đầu tìm kiếm bài viết.
        </div>
      )}
    </div>
  );
}