require('dotenv').config();
const mongoose = require('mongoose');
const District = require('../models/District');
const Party = require('../models/Party');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Reference to frontend data
const constituencyDataPath = path.join(__dirname, '../../../nepal-election-frontend/my-react-app/src/data/nepal-constituencies.json');
const constituencyData = JSON.parse(fs.readFileSync(constituencyDataPath, 'utf8'));

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nepal_election');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await District.deleteMany({});
        await Party.deleteMany({});
        await Candidate.deleteMany({});

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
            username: 'admin',
            email: 'admin@nepal-election.gov.np',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created.');

        // Create Parties
        const parties = [
            { name: 'Nepali Congress', nameNepali: 'नेपाली कांग्रेस', symbol: 'Tree', color: '#32CD32' },
            { name: 'CPN-UML', nameNepali: 'नेकपा (एमाले)', symbol: 'Sun', color: '#DC143C' },
            { name: 'CPN-Maoist', nameNepali: 'नेकपा (माओवादी केन्द्र)', symbol: 'Hammer and Sickle', color: '#8B0000' },
            { name: 'RSP', nameNepali: 'राष्ट्रिय स्वतन्त्र पार्टी', symbol: 'Bell', color: '#FF8C00' },
            { name: 'RPP', nameNepali: 'राष्ट्रिय प्रजातन्त्र पार्टी', symbol: 'Plow', color: '#00008B' },
            { name: 'Others', nameNepali: 'अन्य', symbol: 'Various', color: '#94A3B8' }
        ];
        const createdParties = await Party.insertMany(parties);
        console.log('Parties created.');

        // Create Districts from nepal-constituencies.json
        const districtArray = Object.values(constituencyData.districts);
        const districtDocs = districtArray.map(d => ({
            name: d.name,
            nameNepali: d.name_np,
            province: d.province,
            provinceNepali: d.province_np,
            totalConstituencies: d.total_constituencies,
            demographics: {
                voters: {
                    total: d.constituencies.reduce((acc, c) => acc + (c.voters || 0), 0)
                }
            }
        }));
        const createdDistricts = await District.insertMany(districtDocs);
        console.log(`${createdDistricts.length} Districts created.`);

        // Create Random Candidates for some districts
        const candidateTemplates = [
            { name: 'Gagan Thapa', party: 'Nepali Congress' },
            { name: 'KP Sharma Oli', party: 'CPN-UML' },
            { name: 'Pushpa Kamal Dahal', party: 'CPN-Maoist' },
            { name: 'Rabi Lamichhane', party: 'RSP' },
            { name: 'Rajendra Lingden', party: 'RPP' }
        ];

        const candidates = [];
        // Just seed first 5 districts for demo
        for (let i = 0; i < 5; i++) {
            const district = createdDistricts[i];
            for (let c = 1; c <= district.totalConstituencies; c++) {
                candidateTemplates.forEach(template => {
                    const party = createdParties.find(p => p.name === template.party);
                    candidates.push({
                        name: `${template.name} (${district.name})`,
                        party: party._id,
                        district: district._id,
                        constituency: c,
                        electionYear: 2084,
                        electionType: 'federal',
                        votes: Math.floor(Math.random() * 20000) + 5000,
                        status: Math.random() > 0.5 ? 'leading' : 'trailing'
                    });
                });
            }
        }
        const createdCandidates = await Candidate.insertMany(candidates);
        console.log('Sample candidates created.');

        // Create Results for some constituencies to populate national summary
        const Result = require('../models/Result');
        const results = [];

        // Find "leading" candidates and create a Result document for them
        const leadingCandidates = createdCandidates.filter(c => c.status === 'leading');

        for (const winner of leadingCandidates) {
            // Find its runner up in the same district/constituency
            const runnerUp = createdCandidates.find(c =>
                c.district.toString() === winner.district.toString() &&
                c.constituency === winner.constituency &&
                c._id.toString() !== winner._id.toString()
            );

            results.push({
                district: winner.district,
                constituency: winner.constituency,
                electionYear: 2084,
                winner: winner._id,
                runnerUp: runnerUp ? runnerUp._id : null,
                totalVotes: winner.votes + (runnerUp ? runnerUp.votes : 0) + 1000,
                status: 'counted',
                lastUpdated: new Date()
            });
        }
        await Result.insertMany(results);
        console.log(`${results.length} Results created.`);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
