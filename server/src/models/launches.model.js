const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(page = 0, limit = 0){
	return launches.find({}, {
		'_id': 0,
		'__v': 0
	})
		.sort({
			flightNumber: 1
		})
		.skip(page * limit)
		.limit(limit);
}

async function saveLaunch(launch){
	await launches.findOneAndUpdate({
		flightNumber: launch.flightNumber
	}, launch, {
		upsert: true
	})
}

async function getLatestFlightNumber(){
	const latestLaunch = await launches
		.findOne()
		.sort('-flightNumber');
	
	if(!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}
	
	return latestLaunch.flightNumber;
}

async function addNewLaunch(launch){
	const planet = await planets.findOne({
		keplerName: launch.destination
	});
	if(!planet){
		throw new Error('No matching planet was found');
	}
	const latestFlightNumber = await getLatestFlightNumber();
	Object.assign(launch, {
		customers: ['ZTM', 'NASA'],
		flightNumber: latestFlightNumber + 1,
		upcoming: true,
		success: true,
		launchDate: new Date(launch.launchDate)
	});
	return saveLaunch(launch)
}

async function findLaunch(filter){
	return launches.findOne(filter);
}

async function existsLaunchWithId(id){
	return findLaunch({
		flightNumber: id
	});
}

async function deleteLaunchById(id){
	const aborted = await launches.updateOne({
		flightNumber: id
	}, {
		upcoming: false,
		success: false
	});
	return aborted.acknowledged
}

const SPACEX_LAUNCHES_API_URL = 'https://api.spacexdata.com/v5/launches/query';

async function loadLaunchesData(){
	const firstSpaceXLaunch = await findLaunch({
		flightNumber: 1,
		mission: 'FalconSat',
		rocket: 'Falcon 1'
	});
	if(firstSpaceXLaunch) return;
	
	const response = await axios.post(SPACEX_LAUNCHES_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1
					}
				},
				{
					path: "payloads",
					select: {
						customers: 1
					}
				}
			]
		}
	});
	
	if(response.status !== 200){
		console.log('Problem downloading launch data');
		throw new Error('Error loading launch data')
	}
	
	const launchesData = response.data.docs;
	
	launchesData.forEach(launchData => {
		const payloads = launchData['payloads'];
		const customers = payloads.flatMap(payload => payload['customers']);
		console.log(launchData['name']);
		const launch = {
			mission: launchData['name'],
			rocket: launchData['rocket']['name'],
			launchDate: new Date(launchData['date_local']),
			customers,
			flightNumber: launchData['flight_number'],
			upcoming: launchData['upcoming'],
			success: launchData['success'],
		}
		saveLaunch(launch);
	})
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	deleteLaunchById,
	loadLaunchesData
};
