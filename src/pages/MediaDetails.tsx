import { useEffect, useState } from 'react';
import { useParams, useLocation, useRoutes, Router, useNavigate } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { fetchDetails, fetchSeasonDetails, fetchSimilarContent } from '../services/api';
import MediaGrid from '../components/MediaGrid';
import ServerSelector from '../components/ServerSelector';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../components/SEOHead';


interface MediaDetailsProps {
  mediaType: 'movie' | 'tv' ; 
}


export default function MediaDetails({ mediaType }: MediaDetailsProps) {
  const { id } = useParams();
  const location = useLocation();
  const [details, setDetails] = useState(location.state?.media || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isWatching, setIsWatching] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate=useNavigate()
  if (id==="225385") {
navigate("/")


    
  }
console.log(mediaType)
  const getStatusTranslation = (status: string): string => {
    const statusTranslations = t("Content.stautsmovies", { returnObjects: true }) as string[];
  
    switch (status) {
      case "Returning Series":
        return statusTranslations[0];
      case "Ended":
        return statusTranslations[2];
      case "Released":
        return statusTranslations[3];
      default:
        return statusTranslations[1]; // Fallback status
    }
  };
  
  // Usage in JSX

  


  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await fetchDetails(mediaType, id, i18n.language);
        setDetails(data);
        
        if (mediaType === 'tv') {
          const seasonData = await fetchSeasonDetails(id, selectedSeason, "en");
          setSeasonDetails(seasonData);
        }

        // Get the release year
        const year = new Date(data.release_date || data.first_air_date).getFullYear();
        
        // Get similar content with better filters
        if (data.genres) {
          const genreIds = data.genres.map(g => g.id);
          const similarContent = await fetchSimilarContent(
            mediaType,
            id,
            genreIds,
            year,
            i18n.language
          );

          // Filter out the current movie/show from results
          data.similar = {
            results: similarContent.results
              .filter(item => item.id !== parseInt(id))
              .slice(0, 12)
          };
        }

        setDetails(data);
      } catch (error) {
        console.error('Error loading details:', error);
        setError('Failed to load media details');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id, mediaType, selectedSeason, i18n.language]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">{error || 'Media not found'}</p>
        </div>
      </div>
    );
    
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SEOHead
        title={`${details.title || details.name} - StreamHub`}
        description={details.overview || 'Watch movies and TV shows on StreamHub'}
        image={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
        url={`https://${import.meta.env.VITE_DOMAINURL}/${mediaType}/${details.id}`}
      />
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-white">
              {details.title || details.name}
            </h1>
            {details.tagline && (
              <p className="mt-2 text-xl text-gray-300">{details.tagline}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-white">
                  {details.vote_average.toFixed(1)}
                </span>
              </div>
              {details.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-white">{details.runtime} min</span>
                </div>
              )}
              {details.genres && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-red-600 px-3 py-1 text-sm text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                  
                </div>
              )}
            </div>
            <button
              onClick={() => setIsWatching(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              {t("Content.watchTitle")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isWatching ? (
              <div className="space-y-4">
                {mediaType !== 'movie' && (
                  <div className="flex-col items-center gap-2">
                    <p className='text-sm py-4 px-2 font-medium text-white text-wrap'>{t("Content.shoseEpisodes")}</p>

                  
                  <div className="flex gap-4">
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(Number(e.target.value));
                        setSelectedEpisode(1);
                      }}
                      className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                    >
                      {Array.from(
                        { length: details.number_of_seasons || 0 },
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                           {t("Content.Season")}  {details.selectSeason} {i + 1}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                      className="rounded-lg bg-gray-800 px-4 py-2 text-white"
                    >
                      {seasonDetails?.episodes?.map((episode) => (
                        <option
                          key={episode.id}
                          value={episode.episode_number}
                        >
                          {episode.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                )}
                <p className='text-sm py-4 px-2 font-medium text-white text-wrap'>{t("Content.shoseServer")}</p>

                <ServerSelector
                  mediaType={mediaType}
                  mediaId={id!}
                  selectedSeason={selectedSeason}
                  selectedEpisode={selectedEpisode}
                />
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-2xl font-bold text-white">{t("Content.overview")}</h2>
                <p className="text-lg leading-relaxed text-gray-300">
                  {details.overview==""?t("Content.langugeNotSupported"):details.overview}
                </p>
              </>
            )}
          </div>
          <div className="rounded-lg bg-gray-800 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">{t("Content.status")}</h3>
                <p className="text-white">{getStatusTranslation(details.status)}</p>              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">{t("Content.releaseDate")}</h3>
                <p className="text-white">
                  {details.release_date || details.first_air_date}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">
                {t("Content.originalLanguage")}
                </h3>
                <p className="text-white">
                  {new Intl.DisplayNames([i18n.language], { type: 'language' }).of(
                    details.original_language
                  )}
                </p>
              </div>
              {mediaType === 'tv' && details.number_of_seasons && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{t("Content.Season")}</h3>
                  <p dir={`${i18n.language=== "ar"?'rtl':'ltr'}`}  className={`text-white text-left`}>
                    {details.number_of_seasons} {t("Content.Season")},{' '}
                    {details.number_of_episodes}{t("Content.episodes")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {details.similar?.results && details.similar.results.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-white">
            {t("Content.similarShows")}  
            </h2>
            <MediaGrid
              items={details.similar.results.slice(0, 10)}
              mediaType={mediaType}
            />
          </div>
        )}
      </div>
    </div>
  );
}