import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Clock, Calendar, RefreshCw } from 'lucide-react';

interface ArticleDetailItem {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  read_time: number;
  created_at: string;
}

export const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles/${id}/`);
        if (response.data.article) {
          setArticle(response.data.article);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 gap-2">
        <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
        <span>Fetching article content...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <p>Article not found or has been removed.</p>
        <Link to="/health-library" className="text-sky-400 underline text-sm">Return to library</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/health-library" 
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Library</span>
        </Link>

        {/* Article Box */}
        <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-2.5 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded text-[10px] font-bold uppercase tracking-wider">
              {article.category}
            </span>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold border-b border-slate-800/80 pb-4">
              <span>By {article.author}</span>
              <span className="text-slate-800">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.read_time} min read</span>
              </span>
              <span className="text-slate-800">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published: {article.created_at}</span>
              </span>
            </div>
          </div>

          {/* Article Summary Block */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-slate-350 italic text-sm leading-relaxed">
            {article.summary}
          </div>

          {/* Full content */}
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line pt-2">
            {article.content}
          </div>
        </article>
      </div>
    </div>
  );
};
