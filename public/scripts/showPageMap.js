// Extract the campground ID from the current URL
const urlSegments = window.location.pathname.split("/");
const campgroundId = urlSegments[2];

let MAPBOXTOKEN;
let campground;

// GET THE CAMPGROUND OBJECT AND MAPBOX TOKEN FROM THE API
async function fetchData() {
  const response = await fetch(`/api/campground/${campgroundId}`);
  const data = await response.json();
  MAPBOXTOKEN = data.mapboxToken;
  campground = data.campground;

  // MAPBOX THINGS-----------------------------------------------------
  mapboxgl.accessToken = MAPBOXTOKEN;
  const map = new mapboxgl.Map({
    container: "campground-map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());

  new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
      )
    )
    .addTo(map);
}

fetchData();
