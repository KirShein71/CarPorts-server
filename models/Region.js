import {Region as RegionMapping} from './mapping.js'

class Region {
    async getAllRegion() {
        const regions = await RegionMapping.findAll()
        return regions
    }
}

export default new Region()