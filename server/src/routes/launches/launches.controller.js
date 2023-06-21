const {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	deleteLaunchById
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res){
	const { page, limit } = req.query;
	console.log(req.query);
	return res.status(200).json(await getAllLaunches(+page, +limit));
}

async function httpAddNewLaunch(req, res){
	const launch = req.body;
	if(!launch.mission || !launch.launchDate || !launch.rocket || !launch.destination){
		return res.status(400).json({
			error: "Missing required launch properties"
		})
	}
	if(isNaN(new Date(launch.launchDate))){
		return res.status(400).json({
			error: "Wrong launch date"
		})
	}
	await addNewLaunch(launch);
	return res.status(201).json(launch)
}

async function httpDeleteLaunch(req, res){
	const id = +req.params.id;
	const existsLaunch = await existsLaunchWithId(id);
	if(!existsLaunch){
		return res.status(404).json({
			error: "Launch ID is wrong"
		})
	}
	const abortedLaunch = await deleteLaunchById(id);
	if(!abortedLaunch){
		return res.status(404).json({
			error: "Launch not aborted"
		})
	}
	return res.status(200).json({
		ok: true
	});
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpDeleteLaunch
};
