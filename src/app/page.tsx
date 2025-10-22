// "use client";
// import { useEffect, useState } from "react";
// import { getHotspots } from "@/lib/strapi";
// import Map, { Marker, Popup } from "react-map-gl/mapbox";

// interface Hotspot {
//   id: number;
//   title: string;
//   latitude: number;
//   longitude: number;
//   images: string[];
//   musicRecommendations?: {
//     title: string;
//     artist: string;
//   }[];
// }

// export default function HomePage() {
//   const [hotspots, setHotspots] = useState<Hotspot[]>([]);
//   const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

//   useEffect(() => {
//     getHotspots().then((data) => {
//       setHotspots(data);
//     });
//   }, []);

//   return (
//     <div className="w-full h-screen">
//       <Map
//         mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
//         initialViewState={{
//           latitude: 9.082,
//           longitude: 8.6753,
//           zoom: 5.5,
//         }}
//         style={{ width: "100%", height: "100%" }}
//         mapStyle="mapbox://styles/mapbox/streets-v11"
//       >
//         {hotspots.map((spot, index) => (
//           <Marker key={index} latitude={spot.latitude} longitude={spot.longitude}>
//           <button
//             onClick={() => setSelectedHotspot(spot)}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             <img src="/pin.svg" alt="pin" />
//           </button>
//         </Marker>

//         ))}

//         {selectedHotspot && (
//           <Popup
//             latitude={selectedHotspot.latitude}
//             longitude={selectedHotspot.longitude}
//             onClose={() => setSelectedHotspot(null)}
//             closeOnClick={false}
//           >
//             <div className="p-2 max-w-[200px]">
//               <h3 className="font-bold">{selectedHotspot.title}</h3>
//               {selectedHotspot.images[0] && (
//                 <img
//                   src={selectedHotspot.images[0]}
//                   alt={selectedHotspot.title}
//                   className="mt-2 rounded"
//                 />
//               )}
//               {selectedHotspot.musicRecommendations && (
//                 <ul className="mt-2 text-sm">
//                   {selectedHotspot.musicRecommendations.map((rec, i) => (
//                     <li key={i}>
//                       🎵 {rec.title} – {rec.artist}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </Popup>
//         )}
//       </Map>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import axios from "axios";
import Image from "next/image";
import { MapPin } from "lucide-react";
import 'mapbox-gl/dist/mapbox-gl.css';
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL as string;

interface MusicRecommendation {
  title: string;
  artist: string;
  genre: string;
  link: string;
}

interface Hotspot {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  description: number;
  images: { url: string }[];
  musicRecommendations?: MusicRecommendation[];
}

export default function HomePage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getHotspots = async (): Promise<Hotspot[]> => {
    try {
      const res = await axios.get(`${API_URL}/api/hotspots?populate=*`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      });

      if (!res.data?.data) {
        console.error("❌ No data returned from API");
        return [];
      }

      const hotspots = res.data.data.map((item: any) => {
        const attrs = item;
        return {
          id: item.id,
          title: attrs.title,
          latitude: parseFloat(attrs.latitude),
          longitude: parseFloat(attrs.longitude),
          images: attrs.images,
          description: attrs.description,
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
    } catch (err: any) {
      console.error("🔥 Error fetching hotspots:", err);
      return [];
    }
  };

  useEffect(() => {
    getHotspots().then((data) => {
      const validHotspots = data.filter(
        (spot) => !isNaN(spot.latitude) && !isNaN(spot.longitude)
      );
      setHotspots(validHotspots);
    });
  }, []);

  useEffect(() => {
    if (!selectedHotspot || !selectedHotspot.images || selectedHotspot.images.length <= 1) return;
  
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === selectedHotspot.images.length - 1 ? 0 : prev + 1
      );
    }, 4000); // change every 4 seconds
  
    return () => clearInterval(interval);
  }, [selectedHotspot]);
  

  return (
    <div className="w-full h-screen">
      <div className="w-full h-screen rounded-xl overflow-hidden">
        <Map
          initialViewState={{
            longitude: -3.7038,
            latitude: 40.4168,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
          {hotspots.map((spot, i) => (
            <Marker
              key={i}
              longitude={spot.longitude}
              latitude={spot.latitude}
              anchor="bottom"
            >
              <div
                onClick={() => {
                  setSelectedHotspot(spot);
                  setCurrentImageIndex(0);
                }}
                className="cursor-pointer"
              >
                <MapPin
                  size={28}
                  className="text-orange-900 drop-shadow"
                  strokeWidth={1}
                  style={{ fill: "#7E2A0C" }}
                />
              </div>
            </Marker>
          ))}
          {selectedHotspot && (
            <Popup
              longitude={selectedHotspot.longitude}
              latitude={selectedHotspot.latitude}
              onClose={() => setSelectedHotspot(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div className="w-48">
                {/* {selectedHotspot.images[0] && (
                  <Image
                    src={selectedHotspot.images[0].url || ""}
                    alt={selectedHotspot.title}
                    className="rounded-md mb-2 w-full h-24 object-cover"
                    width={200}
                    height={120}
                  />
                )} */}
                {selectedHotspot.images && selectedHotspot.images.length > 0 && (
                  <div className="relative w-full h-32 overflow-hidden rounded-md mb-2">
                    <Image
                      src={selectedHotspot.images[currentImageIndex].url}
                      alt={selectedHotspot.title}
                      className="object-cover w-full h-full transition-all duration-500"
                      width={300}
                      height={180}
                    />
                  </div>
                )}
                <strong>{selectedHotspot.title}</strong>
                <p className="text-sm">{selectedHotspot.description}</p>
              </div>

              {selectedHotspot.musicRecommendations && (
                <div className="mt-3 text-sm">
                  <h4 className="font-semibold mb-1">
                    🎧 Music Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {selectedHotspot.musicRecommendations.map((rec, i) => (
                      <li key={i} className="border-t border-gray-200 pt-1">
                        <p>
                          <strong>🎵 Title:</strong> {rec.title}
                        </p>
                        <p>
                          <strong>👤 Artist:</strong> {rec.artist}
                        </p>
                        <p>
                          <strong>🎶 Genre:</strong> {rec.genre}
                        </p>
                        {rec.link && (
                          <p>
                            <a
                              href={rec.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              🔗 Listen here
                            </a>
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Popup>
          )}
        </Map>
        {/* <Map
          initialViewState={{
            longitude: -3.7038,
            latitude: 40.4168,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
          {hotspots.map((spot) => {
            console.log(`🎯 Rendering marker for ${spot.title} at`, spot.latitude, spot.longitude);
            return (
              <Marker
                key={spot.id}
                longitude={spot.longitude}
                latitude={spot.latitude}
                anchor="bottom"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("📌 Marker clicked:", spot.title);
                    setSelectedHotspot(spot);
                  }}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    position: 'relative',
                    zIndex: 1000,
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MapPin
                    size={36}
                    className="text-orange-900 drop-shadow-lg"
                    strokeWidth={2}
                    style={{ fill: "#EA580C", stroke: "#7E2A0C" }}
                  />
                </div>
              </Marker>
            );
          })}
          
          {selectedHotspot && (
            <Popup
              longitude={selectedHotspot.longitude}
              latitude={selectedHotspot.latitude}
              onClose={() => setSelectedHotspot(null)}
              closeOnClick={false}
              anchor="top"
              offset={15}
            >
              <div className="w-64 max-h-96 overflow-y-auto">
                {selectedHotspot.images[0] && (
                  <Image
                    src={selectedHotspot.images[0].url || ""}
                    alt={selectedHotspot.title}
                    className="rounded-md mb-2 w-full h-32 object-cover"
                    width={256}
                    height={128}
                  />
                )}
                <strong className="text-base">{selectedHotspot.title}</strong>

                {selectedHotspot.musicRecommendations && 
                 selectedHotspot.musicRecommendations.length > 0 && (
                  <div className="mt-3 text-sm">
                    <h4 className="font-semibold mb-2 text-gray-800">
                      🎧 Music Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {selectedHotspot.musicRecommendations.map((rec, i) => (
                        <li key={i} className="border-t border-gray-200 pt-2">
                          <p className="font-medium">🎵 {rec.title}</p>
                          <p className="text-gray-600">👤 {rec.artist}</p>
                          <p className="text-gray-500 text-xs">🎶 {rec.genre}</p>
                          {rec.link && (
                            <a
                              href={rec.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-xs inline-block mt-1"
                            >
                              🔗 Listen here
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map> */}
      </div>
    </div>
  );
}
