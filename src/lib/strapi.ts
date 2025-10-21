import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL as string;

export interface StrapiImageData {
  id: number;
  attributes: {
    url: string;
  };
}

export interface HotspotAttributes {
  title: string;
  latitude: number;
  longitude: number;
  images?: {
    data: StrapiImageData[];
  };
  musicRecommendations?: {
    title: string;
    artist: string;
  }[];
}

export interface HotspotItem {
  id: number;
  attributes: HotspotAttributes;
}

export interface Hotspot {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  images: string[];
  musicRecommendations?: {
    title: string;
    artist: string;
  }[];
}

// export const getHotspots = async (): Promise<Hotspot[]> => {
//   const res = await axios.get<{ data: HotspotItem[] }>(
//     `${API_URL}/api/hotspots?populate=*`, 
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
//       },
//     }
//   );

//   return res.data.data.map((item) => ({
//     id: item.id,
//     title: item.attributes.title,
//     latitude: item.attributes.latitude,
//     longitude: item.attributes.longitude,
//     images:
//       item.attributes.images?.data?.map(
//         (img) => `${API_URL}${img.attributes.url}`
//       ) || [],
//     musicRecommendations: item.attributes.musicRecommendations,
//   }));
// };


export const getHotspots = async (): Promise<Hotspot[]> => {
  const res = await axios.get(`${API_URL}/api/hotspots?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  const hotspots = res.data.data.map((item: any) => {
    const attrs = item.attributes;

    return {
      id: item.id,
      title: attrs.title,
      latitude: parseFloat(attrs.latitude),
      longitude: parseFloat(attrs.longitude),
      images:
        attrs.images?.data?.map((img: any) => ({
          url: img.attributes.url.startsWith("http")
            ? img.attributes.url
            : `${API_URL}${img.attributes.url}`,
        })) || [],
      musicRecommendations:
        attrs.musicRecommendations?.map((rec: any) => ({
          title: rec.title,
          artist: rec.artist,
          genre: rec.genre,
          link: rec.link,
        })) || [],
    };
  });

  return hotspots;
};

export const getHotspotById = async (id: number): Promise<Hotspot> => {
  const res = await axios.get<{ data: HotspotItem }>(
    `${API_URL}/api/hotspots/${id}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    }
  );
  const item = res.data.data;

  return {
    id: item.id,
    title: item.attributes.title,
    latitude: item.attributes.latitude,
    longitude: item.attributes.longitude,
    images:
      item.attributes.images?.data?.map(
        (img) => `${API_URL}${img.attributes.url}`
      ) || [],
    musicRecommendations: item.attributes.musicRecommendations,
  };
};
