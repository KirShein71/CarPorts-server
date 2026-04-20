import {Deviation as DeviationMapping} from './mapping.js'


class Deviation {

    async create(data) {
        const {
            device_id, 
            deviation_x_mm, 
            deviation_y_mm, 
            internal_temperature_celsius, 
            wifi_signal_strength_dbm, 
            firmware_version, 
            uptime_seconds, 
            error_code, 
            error_message, 
            measurement_timestamp 
        } = data;
          
        const deviation = await DeviationMapping.create({
            device_id, 
            deviation_x_mm, 
            deviation_y_mm, 
            internal_temperature_celsius, 
            wifi_signal_strength_dbm, 
            firmware_version, 
            uptime_seconds, 
            error_code, 
            error_message, 
            measurement_timestamp
        });
            
        const created = await DeviationMapping.findByPk(deviation.id);
        return created;
    }

}

export default new Deviation()