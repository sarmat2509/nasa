const API_URL = 'https://localhost:8000/v1';

async function httpGetPlanets() {
	const resp = await fetch(`${API_URL}/planets`)
	return await resp.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
	const resp = await fetch(`${API_URL}/launches`)
	const fetchedLaunches = await resp.json();
	return fetchedLaunches.sort((a,b) => {
		return a.flightNumber - b.flightNumber
	})
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
	try {
		return await fetch(`${API_URL}/launches`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(launch)
		})
	} catch (e) {
		return {
			ok: false,
			message: e
		}
	}
}


// Delete launch with given ID.
async function httpAbortLaunch(id) {
	try {
		return await fetch(`${API_URL}/launches/${id}`, {
			method: "DELETE"
		})
	} catch (e) {
		return {
			ok: false,
			message: e
		}
	}
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
