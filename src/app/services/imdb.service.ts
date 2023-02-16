import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class IMDbService {
  constructor(private http: HttpClient) {}

  public getConfig(
    config_type:
      | 'countries'
      | 'jobs'
      | 'languages'
      | 'primary_translations'
      | 'timezones'
      | '' = ''
  ): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/get-config/' + config_type
    );
  }

  public search(query: string, page: number = 1): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/search/' + query + '/' + page
    );
  }

  public getPopular(
    media_type: 'movie' | 'tv' | 'person',
    page: number = 1
  ): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/get-popular/' + media_type + '/' + page
    );
  }

  public getTrending(
    media_type: 'movie' | 'tv' | 'person' | 'all' = 'all',
    time_window: 'day' | 'week' = 'day',
    language?: string,
    region?: string,
    page?: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('media_type', media_type);
    queryParams = queryParams.append('time_window', time_window);
    queryParams = queryParams.append('language', language || '');
    queryParams = queryParams.append('region', region || '');
    queryParams = queryParams.append('page', page || 1);

    return this.http.get(environment.api_prefix + 'imdb/get-trending', {
      params: queryParams,
    });
  }

  public creditDetails(credit_id: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/get-credit-detail/' + credit_id
    );
  }

  public getGenre(media_type: 'tv' | 'movie'): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/get-genre/' + media_type
    );
  }

  public getDetail(
    media_type: 'tv' | 'movie' | 'person',
    media_id: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('media_type', media_type);
    queryParams = queryParams.append('media_id', media_id);

    return this.http.get(environment.api_prefix + 'imdb/get-detail', {
      params: queryParams,
    });
  }

  public getDetails(
    media_type: 'tv' | 'movie' | 'person',
    media_id: number,
    type:
      | 'credits'
      | 'external_ids'
      | 'images'
      | 'keywords'
      | 'recommendations'
      | 'release_dates'
      | 'reviews'
      | 'similar'
      | 'translations'
      | 'videos'
      | 'watch/providers'
      | 'movie_credits'
      | 'tv_credits'
      | 'combined_credits'
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('media_type', media_type);
    queryParams = queryParams.append('media_id', media_id);
    queryParams = queryParams.append('type', type);

    return this.http.get(environment.api_prefix + 'imdb/get-details', {
      params: queryParams,
    });
  }

  public getUpcomingMovies(
    language?: string,
    region?: string,
    page?: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('language', language || 'en-US');
    queryParams = queryParams.append('region', region || 'IN');
    queryParams = queryParams.append('page', page || 1);

    return this.http.get(environment.api_prefix + 'imdb/get-upcoming_movies', {
      params: queryParams,
    });
  }

  public getAiredEpisodes(
    time_window: 'airing_today' | 'on_the_air',
    language?: string,
    page?: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('language', language || 'en-US');
    queryParams = queryParams.append('page', page || 1);

    return this.http.get(
      environment.api_prefix + 'imdb/get-aired/' + time_window,
      { params: queryParams }
    );
  }

  public getSeasonDetail(
    tv_id: number,
    season_number: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('tv_id', tv_id);
    queryParams = queryParams.append('season_number', season_number);

    return this.http.get(environment.api_prefix + 'imdb/season/get-detail', {
      params: queryParams,
    });
  }

  public getSeasonDetails(
    tv_id: number,
    season_number: number,
    type:
      | 'account_states'
      | 'aggregate_credits'
      | 'credits'
      | 'external_ids'
      | 'images'
      | 'translations'
      | 'videos'
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('tv_id', tv_id);
    queryParams = queryParams.append('season_number', season_number);
    queryParams = queryParams.append('type', type);

    return this.http.get(environment.api_prefix + 'imdb/season/get-details', {
      params: queryParams,
    });
  }

  public getEpisodeDetail(
    tv_id: number,
    season_number: number,
    episode_number: number
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('tv_id', tv_id);
    queryParams = queryParams.append('season_number', season_number);
    queryParams = queryParams.append('episode_number', episode_number);

    return this.http.get(environment.api_prefix + 'imdb/episode/get-detail', {
      params: queryParams,
    });
  }

  public getEpisodeDetails(
    tv_id: number,
    season_number: number,
    episode_number: number,
    type: 'credits' | 'external_ids' | 'images' | 'translations' | 'videos'
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('tv_id', tv_id);
    queryParams = queryParams.append('season_number', season_number);
    queryParams = queryParams.append('episode_number', episode_number);
    queryParams = queryParams.append('type', type);

    return this.http.get(environment.api_prefix + 'imdb/episode/get-details', {
      params: queryParams,
    });
  }

  public getWatchProviders(content_type: 'tv' | 'movie'): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'imdb/watch-provides/' + content_type
    );
  }
}
