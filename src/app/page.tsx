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
import { getHotspots } from "@/lib/strapi";
import Map, { Marker, Popup } from "react-map-gl/mapbox";

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
  images: { url: string }[];
  musicRecommendations?: MusicRecommendation[];
}

export default function HomePage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  useEffect(() => {
    getHotspots().then((data) => {
      // Transform images: string[] -> { url: string }[]
      const transformed = data.map((hotspot:any) => ({
        ...hotspot,
        images: Array.isArray(hotspot.images)
          ? hotspot.images.map((img: string | { url: string }) =>
              typeof img === "string" ? { url: img } : img
            )
          : [],
      }));
      console.log(transformed, 'transformed');
      setHotspots(transformed);
    });
  }, []);
  console.log(hotspots, 'hotspot');

  return (
    <div className="w-full h-screen">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          latitude: 9.082,
          longitude: 8.6753,
          zoom: 5.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {hotspots.map((spot) => (
          <Marker key={spot.id} latitude={spot.latitude} longitude={spot.longitude}>
            <button
              onClick={() => setSelectedHotspot(spot)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src="/pin.svg" alt="pin" />
            </button>
          </Marker>
        ))}

        {selectedHotspot && (
          <Popup
            latitude={selectedHotspot.latitude}
            longitude={selectedHotspot.longitude}
            onClose={() => setSelectedHotspot(null)}
            closeOnClick={false}
          >
            <div className="p-2 max-w-[250px]">
              <h3 className="font-bold text-lg">{selectedHotspot.title}</h3>

              {selectedHotspot.images?.[0]?.url && (
                <img
                  src={selectedHotspot.images[0].url}
                  alt={selectedHotspot.title}
                  className="mt-2 rounded"
                />
              )}

              {selectedHotspot.musicRecommendations && (
                <div className="mt-3 text-sm">
                  <h4 className="font-semibold mb-1">🎧 Music Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedHotspot.musicRecommendations.map((rec, i) => (
                      <li key={i} className="border-t border-gray-200 pt-1">
                        <p><strong>🎵 Title:</strong> {rec.title}</p>
                        <p><strong>👤 Artist:</strong> {rec.artist}</p>
                        <p><strong>🎶 Genre:</strong> {rec.genre}</p>
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
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
