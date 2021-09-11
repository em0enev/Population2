import { EventEmitter } from "eventemitter3";
import config from "../../config";
import Film from "./Film";
import Planet from "./planet";

export default class StarWarsUniverse extends EventEmitter {
    constructor() {
        super();
        this.films = [];
        this.planet = null;
        this.config = config;
    }

    static get events() {
        return {
            "FILM_ADDED": "film_added",
            "UNIVERSE_POPULATED": "universe_populated"
        }
    }

    static get apiURL() {
        return {
            "PLANETS": "https://swapi.boom.dev/api/planets/",
            "PEOPLE": "https://swapi.boom.dev/api/people/"
        }
    }

    async init() {
        // const p = await this._findPlanetWithoutPopulation();
        // const firstTenPpl = await this._fetchFirstTenPpl();

        // const planet = new Planet(p.name, this.config, firstTenPpl)
        // planet.on(Planet.events.PERSON_BORN, async (data) => await this._onPersonBorn(data))
        // planet.on(Planet.events.POPULATING_COMPLETE, () => this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED))
        // this.planet = planet;
        // await planet.populate()
    }

    async _findPlanetWithoutPopulation() {
        const planets = await this._fetchAllPlanets();
        return planets.find(({ population }) => population === "0")
    }

    async _fetchAllPlanets() {
        let planets = []
        const res = await fetch(StarWarsUniverse.apiURL.PLANETS)
        let { next, results } = await res.json();

        planets = [...results]
        while (next !== null) {
            const res = await fetch(next)
            let data = await res.json();

            planets = [...planets, ...data.results]
            next = data.next
        }

        return planets
    }

    async _fetchFirstTenPpl(){
        const res = await fetch(StarWarsUniverse.apiURL.PEOPLE)
        let { results } = await res.json();

        return results
    }

    async _onPersonBorn(data){
        for (const candidate of data.filmUrls) {
            if(!this._chekIfFilmExist(candidate)){
                const film = new Film(candidate)
                this.films.push(film)
                this.emit(StarWarsUniverse.events.FILM_ADDED)
            }
        }
    }

    _chekIfFilmExist(filmUrl){
        for (const item of this.films) {
            if(filmUrl === item.filmUrl){
                return true;
            }
        }
        return false;   
    }
}