import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, BookOpen, Clock, ArrowRight, RefreshCw } from 'lucide-react';

interface ArticleItem {
  id: number;
  title: string;
  category: string;
  summary: string;
  author: string;
  read_time: number;
  created_at: string;
}

export const HealthLibrary: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/articles/', {
        params: {
          category: selectedCategory,
          q: searchQuery
        }
      });
      if (response.data.articles) {
        setArticles(response.data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const categories = [
    "Nutrition",
    "Mental Health",
    "Preventive Care",
    "Maternal Care"
  ];

  return (
    <div className="min-h-screen bg-slate-955 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="text-sky-400 h-8 w-8" />
            <span>Health & Wellness Library</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Access verified medical articles, healthcare information guidelines, and lifestyle advice.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search health library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                selectedCategory === '' 
                  ? 'bg-sky-600 border-sky-500 text-white shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-350'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedCategory === cat 
                    ? 'bg-sky-600 border-sky-500 text-white shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-350'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
            <span>Reading article index...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
            No health articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div 
                key={art.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-750 transition-all shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-3.5">
                    <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded text-[10px] font-bold uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{art.read_time} min read</span>
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg leading-snug hover:text-sky-300 transition-colors">
                    <Link to={`/health-library/${art.id}`}>{art.title}</Link>
                  </h3>
                  
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-550">
                  <span>Author: {art.author}</span>
                  <Link 
                    to={`/health-library/${art.id}`} 
                    className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
