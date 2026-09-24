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
    <div style={{ width: '100%', maxWidth: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Khung tìm kiếm & Nút chọn nguồn */}
      <div style={{ width: '100%', maxWidth: '32rem', margin: '0 auto 1.5rem', padding: '0 0.5rem' }}>
        
        {/* Form Input + Nút Tìm nằm cạnh nhau độc lập */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '12px', color: '#94a3b8', pointerEvents: 'none' }} 
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, tài liệu, website..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 18px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Tìm'}
          </button>
        </form>

        {/* 3 Nút chọn nguồn chia đều 3 cột trên cùng 1 hàng */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%' }}>
          <button
            type="button"
            onClick={() => handleEngineChange('bing')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: engine === 'bing' ? '#2563eb' : '#0f172a',
              color: engine === 'bing' ? '#ffffff' : '#94a3b8',
              border: engine === 'bing' ? '1px solid #3b82f6' : '1px solid #1e293b'
            }}
          >
            <Globe size={13} />
            <span>Nguồn 1</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleEngineChange('yandex')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: engine === 'yandex' ? '#2563eb' : '#0f172a',
              color: engine === 'yandex' ? '#ffffff' : '#94a3b8',
              border: engine === 'yandex' ? '1px solid #3b82f6' : '1px solid #1e293b'
            }}
          >
            <Layers size={13} />
            <span>Nguồn 2</span>
          </button>

          <button
            type="button"
            onClick={() => handleEngineChange('duckduckgo')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: engine === 'duckduckgo' ? '#2563eb' : '#0f172a',
              color: engine === 'duckduckgo' ? '#ffffff' : '#94a3b8',
              border: engine === 'duckduckgo' ? '1px solid #3b82f6' : '1px solid #1e293b'
            }}
          >
            <Globe size={13} />
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