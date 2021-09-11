import { EventEmitter } from "eventemitter3";

export default class Person extends EventEmitter{
    constructor(name, height, mass){
        super()
        this.name = name;
        this.height =height;
        this.mass = mass;
    }
}