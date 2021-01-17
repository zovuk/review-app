import LocalList from '../data/sample.json';

const restaurants = LocalList.results.map((items) => extract(items));
console.log(restaurants.map((e) => e.name));

function extract(items) {
  return {
    location: !isNaN(items.geometry.location.lat)
      ? items.geometry.location
      : {
          lat: items.geometry.location.lat(),
          lng: items.geometry.location.lng(),
        },
    name: items.name,
    place_ID: items.place_id,
    address: items.vicinity ? items.vicinity : '',
    id: items.id,
    averageRating: items.rating ? Number(items.rating) : 0,
    totalRatings: items.user_ratings_total ? items.user_ratings_total : 0,
    reviews: items.reviews ? items.reviews : '',
  };
}

export { restaurants };
