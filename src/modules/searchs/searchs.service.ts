import { Injectable } from "@nestjs/common";
import { SpotifyService } from "../musics/spotify.service";
import axios from "axios";
import {
  transformAlbum,
  transformArtist,
  transformTrack,
} from "./util/transform";
import { AlbumDTO, ArtistDTO, TrackDTO } from "./dto/create-search.dto";

@Injectable()
export class SearchsService {
  constructor(private readonly spotifyService: SpotifyService) {}

  public async getArtist(artist_id: string): Promise<ArtistDTO> {
    const accessToken = await this.spotifyService.getAccessToken();

    const url = `https://api.spotify.com/v1/artists/${artist_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return transformArtist(response.data);
  }

  public async getAlbum(album_id: string): Promise<AlbumDTO> {
    const accessToken = await this.spotifyService.getAccessToken();

    const url = `https://api.spotify.com/v1/albums/${album_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return transformAlbum(response.data);
  }

  public async getTrack(track_id: string): Promise<TrackDTO> {
    const accessToken = await this.spotifyService.getAccessToken();

    const url = `https://api.spotify.com/v1/tracks/${track_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return transformTrack(response.data);
  }
}
