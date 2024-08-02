import statAttackData from '../../../data/games/stat-attack/stat-attack.json';
import mallsData from "../../../data/games/stat-attack/malls.json";
import citiesData from "../../../data/games/stat-attack/cities.json";
import mrtData from "../../../data/games/stat-attack/mrt.json";
import universitiesData from "../../../data/games/stat-attack/universities.json";
import animeData from "../../../data/games/stat-attack/anime.json";
import artistsData from "../../../data/games/stat-attack/artists.json";
import songsYoutubeData from "../../../data/games/stat-attack/songs-youtube.json";
import pokemonData from "../../../data/games/stat-attack/pokemon.json";
import youtubersData from "../../../data/games/stat-attack/youtubers.json";
import fastFoodData from "../../../data/games/stat-attack/fast-food.json";
import schoolData from "../../../data/games/stat-attack/schools.json";
import airportsData from "../../../data/games/stat-attack/airports.json";
import moviesData from "../../../data/games/stat-attack/movies.json";
import programmingLanguagesData from "../../../data/games/stat-attack/programming-languages.json";
import countriesData from "../../../data/games/stat-attack/countries.json";
import elementsData from "../../../data/games/stat-attack/elements.json";
import leadersData from "../../../data/games/stat-attack/leaders.json";
import videoGamesData from "../../../data/games/stat-attack/video-games.json";
import covidData from "../../../data/games/stat-attack/covid-19.json";
import laptopData from "../../../data/games/stat-attack/laptops.json";
import roadsCoordsData from "../../../data/games/stat-attack/roads-coords.json";
import roadsFeaturesData from "../../../data/games/stat-attack/roads-features.json";
import indoAttractionsData from "../../../data/games/stat-attack/indo-attractions.json";
import websitesData from "../../../data/games/stat-attack/websites.json";
import subzonesData from "../../../data/games/stat-attack/subzones.json";
import kanjiData from "../../../data/games/stat-attack/kanji.json";
import csModsData from "../../../data/games/stat-attack/cs-mods.json";
import githubData from "../../../data/games/stat-attack/github.json";
import mineralsData from "../../../data/games/stat-attack/minerals.json";
import nutritionData from "../../../data/games/stat-attack/nutrition.json";
import buildingsData from "../../../data/games/stat-attack/buildings.json";
import busStopsData from "../../../data/games/stat-attack/bus-stops.json";
import busServicesData from "../../../data/games/stat-attack/bus-services.json";
import famousPeopleData from "../../../data/games/stat-attack/famous-people.json";
import placesInSingaporeData from "../../../data/games/stat-attack/places-in-singapore.json";
import unescoData from "../../../data/games/stat-attack/unesco.json";
import colorsData from "../../../data/games/stat-attack/colors.json";
import deathsData from "../../../data/games/stat-attack/deaths.json";
import amazonData from "../../../data/games/stat-attack/amazon.json";

const deckNames = [
  "malls",
  "cities",
  "mrt",
  "countries",
  "universities",
  "anime",
  "songs-youtube",
  "pokemon",
  "youtubers",
  "fast-food",
  "schools",
  "airports",
  "movies",
  "programming",
  "elements",
  "leaders",
  "video-games",
  "covid",
  "laptops",
  "artists",
  "roads-features",
  "roads-coords",
  "indo-attractions",
  "websites",
  "subzones",
  "kanji",
  "cs-mods",
  "github",
  "minerals",
  "nutrition",
  "buildings",
  "bus-stops",
  "bus-services",
  "famous-people",
  "youtube-videos",
  "places-in-singapore",
  "unesco",
  "colors",
  "deaths",
  "amazon"
];

export const decks = deckNames.map(deckName => {
  const deck = statAttackData[deckName];
  return {
    params: {
      deck: deckName,
    },
    props: {
      title: deck.title,
      instructions: deck.instructions
    }
  };
});

export const getData = (deckName: string) => {
  switch (deckName) {
  case "malls":
    return {
      title: "Malls of Singapore",
      data: mallsData
    };
  case "cities":
    return {
      title: "Cities of the World",
      data: citiesData
    }
  case "mrt":
    return {
      title: "MRT Stations of Singapore",
      data: mrtData
    }
  case "countries":
    return {
      title: "Countries of the World",
      data: countriesData
    } // https://www.kaggle.com/datasets/nelgiriyewithana/countries-of-the-world-2023
  case "universities":
    return {
      title: "University Rankings",
      data: universitiesData
    };
  case "artists":
    return {
      title: "Music Artists",
      data: artistsData
    }
  case "anime":
    return {
      title: "Anime Ratings",
      data: animeData
    }
  case "songs-youtube":
    return {
      title: "Songs on YouTube",
      data: songsYoutubeData
    }
  case "pokemon":
    return {
      title: "Pokemon Stats",
      data: pokemonData
    };
  case "youtubers":
    return {
      title: "YouTubers",
      data: youtubersData
    }
  case "fast-food":
    return {
      title: "Fast Food Nutrition",
      data: fastFoodData
    }
  case "schools":
    return {
      title: "Schools of Singapore",
      data: schoolData
    }
  case "airports":
    return {
      title: "Airports of the World",
      data: airportsData
    }
  case "movies":
    return {
      title: "Movie Ratings",
      data: moviesData
    } // https://www.kaggle.com/datasets/prishasawhney/imdb-dataset-top-2000-movies
  case "programming":
    return {
      title: "Programming Languages",
      data: programmingLanguagesData
    } // https://www.kaggle.com/datasets/sujaykapadnis/programming-language-database
  case "elements":
    return {
      title: "Elements of the Periodic Table",
      data: elementsData // https://www.kaggle.com/datasets/jwaitze/tablesoftheelements?select=periodic_table_with_all_units.csv
    }
  case "leaders":
    return {
      title: "World Leaders",
      data: leadersData // https://www.kaggle.com/datasets/ramjasmaurya/world-leaders-and-their-election-wins?select=election_list+results.csv
    }
  case "video-games":
    return {
      title: "Video Games",
      data: videoGamesData // https://www.kaggle.com/datasets/muhammadadiltalay/imdb-video-games
    }
  case "covid":
    return {
      title: "Covid-19 Stats",
      data: covidData // https://www.kaggle.com/datasets/imdevskp/corona-virus-report
    }
  case "laptops":
    return {
      title: "Laptop Specs",
      data: laptopData // https://www.kaggle.com/datasets/muhammetvarl/laptop-price
    }
  case "roads-coords":
    return {
      title: "Roads of Singapore (Coordinates)",
      data: roadsCoordsData // https://www.kaggle.com/datasets/nelgiriyewithana/singapore-roads
    }
  case "roads-features":
    return {
      title: "Roads of Singapore (Features)",
      data: roadsFeaturesData // https://www.kaggle.com/datasets/nelgiriyewithana/singapore-roads
    }
  case "indo-attractions":
    return {
      title: "Indonesian Attractions",
      data: indoAttractionsData // https://www.kaggle.com/datasets/aprabowo/indonesia-tourism-destination?select=tourism_with_id.csv
    }
  case "websites":
    return {
      title: "Websites", // https://www.kaggle.com/datasets/ashkangoharfar/sites-information-data-from-alexacom-dataset
      data: websitesData // https://www.kaggle.com/datasets/bpali26/popular-websites-across-the-globe
    }
  case 'subzones':
    return {
      title: "Subzones of Singapore",
      data: subzonesData
    }
  case 'kanji':
    return {
      title: "Japanese Kanji",
      data: kanjiData
    }
  case 'cs-mods':
    return {
      title: "NUS School of Computing Mods",
      data: csModsData
    }
  case 'github':
    return {
      title: "GitHub Repositories",
      data: githubData
    }
  case 'minerals':
    return {
      title: "Minerals",
      data: mineralsData
    }
  case 'nutrition':
    return {
      title: "Nutrition",
      data: nutritionData
    }
  case 'buildings':
    return {
      title: "Buildings of the World",
      data: buildingsData
    }
  case 'bus-stops':
    return {
      title: "Bus Stops of Singapore",
      data: busStopsData
    }
  case 'bus-services':
    return {
      title: "Bus Services of Singapore",
      data: busServicesData
    }
  case 'famous-people':
    return {
      title: "Famous People",
      data: famousPeopleData
    }
  case "places-in-singapore":
    return {
      title: "Places in Singapore",
      data: placesInSingaporeData
    }
  case 'unesco':
    return {
      title: "UNESCO World Heritage Sites",
      data: unescoData
    }
  case 'colors':
    return {
      title: "Colors",
      data: colorsData
    }
  case 'deaths':
    return {
      title: "Deadly Events",
      data: deathsData,
    }
  case 'amazon':
    return {
      title: "Amazon Products",
      data: amazonData
    }
  default:
    return {
      title: '',
      data: []
    };
  }
}