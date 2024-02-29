import Places from "./Places.jsx";
import { useEffect, useState } from "react";
import Error from "./Error";
import { sortPlacesByDistance } from "../loc.js";
import  { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (err) {
        console.log(err);
        setError({
          message: err.message || "Failed to fetch places,pls try again later.",
        });
      }
    }

    fetchPlaces();
    // fetch("http://localhost:3000/places")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((resData) => {
    //     console.log("name", resData);
    //     setAvailablePlaces(resData.places);
    //   });
  }, []);
  if (error) {
    return <Error title="Failed to fetch places" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place Data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
