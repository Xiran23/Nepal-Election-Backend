const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    nameNepali: String,
    province: String,
    provinceNepali: String,
    area: String,
    population: String,
    totalConstituencies: Number,
    geometry: {
        type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
        coordinates: [[[Number]]] // GeoJSON format
    },
    boundaries: {
        north: String,
        south: String,
        east: String,
        west: String
    },
    neighboringDistricts: [String],
    demographics: {
        voters: {
            total: Number,
            male: Number,
            female: Number,
            other: Number
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('District', districtSchema);
