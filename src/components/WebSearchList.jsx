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
    <div className="w-full max-w-full flex-1 flex flex-col items-center">
      {/* Khung tìm kiếm & Nút chọn nguồn */}
      <div className="w-full max-w-xl mx-auto mb-6 px-1 flex flex-col items-center">
        {/* Form Input với icon và nút Tìm nằm lọt lòng */}
        <form onSubmit={handleSearch} className="w-full relative flex items-center">
          <Search 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
            size={18} 
          />
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
            className="w-full pl-10 pr-20 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer shadow"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : 'Tìm'}
          </button>
        </form>

        {/* 3 Nút chọn nguồn chia đều 3 cột, không bị dính sát mép trên */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 w-full">
          <button
            type="button"
            onClick={() => handleEngineChange('bing')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              engine === 'bing'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Globe size={13} className="shrink-0" />
            <span>Nguồn 1</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleEngineChange('yandex')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              engine === 'yandex'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Layers size={13} className="shrink-0" />
            <span>Nguồn 2</span>
          </button>

          <button
            type="button"
            onClick={() => handleEngineChange('duckduckgo')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              engine === 'duckduckgo'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Globe size={13} className="shrink-0" />
            <span>Nguồn 3</span>
          </button>
        </div>
      </div>

      {/* Thông tin số lượng kết quả */}
      {articles.length > 0 && (
        <div className="w-full flex justify-between items-center text-xs text-slate-400 pb-2.5 border-b border-slate-800/80 mb-4 px-1">
          <span>Tìm thấy: <strong className="text-slate-200">{articles.length}</strong> bài viết</span>
          <span>Trang: <strong>{page}</strong> • {engine === 'bing' ? 'Nguồn 1' : engine === 'yandex' ? 'Nguồn 2' : 'Nguồn 3'}</span>
        </div>
      )}

      {/* Danh sách kết quả dạng thẻ */}
      <div className="flex flex-col gap-3 w-full">
        {articles.map((item, idx) => (
          <div
            key={`${item.url}-${idx}`}
            className="p-3.5 sm:p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/90 hover:border-slate-700 transition flex flex-col gap-1.5 text-left"
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-medium text-slate-300 px-2 py-0.5 bg-slate-800 rounded">
                {item.domain}
              </span>
              <span className="truncate max-w-[200px] sm:max-w-md hidden sm:inline">{item.url}</span>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-between gap-2 leading-snug"
            >
              <span className="line-clamp-2">{item.title}</span>
              <ExternalLink size={14} className="shrink-0 text-slate-500" />
            </a>

            {item.snippet && (
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 sm:line-clamp-2">
                {item.snippet}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Nút bấm tải thêm */}
      {articles.length > 0 && hasMore && (
        <div className="text-center my-6">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl border border-slate-800 transition inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {loadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin text-blue-500" />
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
        <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
          Không tìm thấy bài viết phù hợp.
        </div>
      )}

      {!hasSearched && (
        <div className="py-16 text-center text-slate-500 text-xs sm:text-sm">
          Nhập từ khóa phía trên để bắt đầu tìm kiếm bài viết.
        </div>
      )}
    </div>
  );
}