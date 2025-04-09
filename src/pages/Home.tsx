import { useEffect, useState } from 'react';
import MediaScroller from '../components/MediaScroller';
import MediaGrid from '../components/MediaGrid';
import { fetchTrending, fetchPopular, fetchTopRated } from '../services/api';
import Pagination from '../components/Pagination';
import { useTranslation } from 'react-i18next';
import GoogleAd from '../components/googleAds';
import { SEOHead } from '../components/SEOHead';

export default function Home() {
  const [trendingAll, setTrendingAll] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const {t, i18n } = useTranslation();
console.log( process.env.VITE_BASEURL)

  // Helper function to determine media type
  const getMediaType = (item: any): 'movie' | 'tv' => {
    // Check if the item has a title (movie) or name (TV show)
    return item?.title ? 'movie' : 'tv';
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [trending, popular, topRated] = await Promise.all([
          fetchTrending('all', currentPage, i18n.language),
          fetchPopular('movie', currentPage),
          fetchTopRated('movie', currentPage),
        ]);

        setTrendingAll(trending.results);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setTotalPages(Math.min(trending.total_pages, 10));
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
    window.scrollTo(0, 0);
  }, [currentPage, i18n.language]); // Added i18n.language to the dependency array

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 pt-16">
      <SEOHead
        title="StreamHub - Watch Free Movies & TV Shows Online"
        description="Stream the latest movies and TV shows for free on StreamHub"
        image="/og-image.jpg"
        url={import.meta.env.VITE_DOMAINURL}
      />
      <MediaScroller 
        items={trendingAll} 
        mediaType={trendingAll[0] ? getMediaType(trendingAll[0]) : 'movie'} 
      />
      <div className='block sm:flex w-full px-0 py-0'>
        {/* Left ad */}
        <div className='hidden lg:block w-[160px] xl:w-[200px] sticky top-20 h-[600px] mx-2'>
          <GoogleAd />
        </div>

        {/* Main content */}
        <div className="flex-1 mx-auto max-w-7xl px-2 sm:px-4 py-8">
          <section className="mb-12 text-center">
            <h2 className="mb-6  text-2xl font-bold text-white">{t("Content.popularMovies")}</h2>
            <MediaGrid items={popularMovies} mediaType="movie" />
          </section>
          
          <section className="mb-12 ">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("Content.topRated")}</h2>
            <MediaGrid items={topRatedMovies} mediaType="movie" />
          </section>

          <section className="mb-12 ">
            <h2 className="mb-6 text-2xl font-bold text-white">{t("Content.netflix")}</h2>
            <MediaGrid items={trendingAll.slice(0, 10)} mediaType="movie" />
          </section>
        </div>

        {/* Right ad */}
        <div className='hidden lg:block w-[160px] xl:w-[200px] sticky top-20 h-[600px] mx-2'>
          <GoogleAd />
        </div>
      </div>
      <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </main>
  );
}