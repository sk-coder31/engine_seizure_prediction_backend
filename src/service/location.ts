import { redis } from "../setups/redis_setup"; 
import { IRegisterLocation, INearbyLocation } from "../types/type";
export async function saveLocationToRedis(location: IRegisterLocation): Promise<boolean> {
    const locationKey = `garage:${location.owner_name}:${location.garage_name}:${location.phone_number}`;

    if (await redis.exists(locationKey)) {
        console.log("Location already exists in Redis");
        return false;
    }

    const lat = Number(location.latitude);
    const lon = Number(location.longitude);

    if (lat < -85.05112878 || lat > 85.05112878 || lon < -180 || lon > 180) {
        console.error("Invalid latitude/longitude:", lat, lon);
        return false;
    }

    await redis.geoadd("garages", lon, lat, locationKey);

    await redis.hset(locationKey, {
        owner_name: location.owner_name,
        garage_name: location.garage_name,
        phone_number: location.phone_number,
        address: location.address,
        latitude: String(lat),
        longitude: String(lon)
    });

    console.log("Location saved to Redis successfully");
    return true;
}
export async function getNearbyGarages(latitude: number, longitude: number, radius: number): Promise<INearbyLocation[]> {
   
    const nearbyResults = await redis.georadius("garages", longitude, latitude, radius, "km", "WITHDIST") as Array<[string, string]>;
    
    if (!nearbyResults || nearbyResults.length === 0) {
        return [];
    }

    
    const nearbyGarages = await Promise.all(
        nearbyResults.map(async ([key, distanceStr]) => {
            const garageData = await redis.hgetall(key as string);
            const lat = garageData.latitude ? parseFloat(garageData.latitude) : 0;
            const lon = garageData.longitude ? parseFloat(garageData.longitude) : 0;
            const distance = parseFloat(distanceStr);
            
            return {
                key: key as string,
                owner_name: garageData.owner_name || "",
                garage_name: garageData.garage_name || "",
                phone_number: garageData.phone_number || "",
                address: garageData.address || "",
                latitude: lat,
                longitude: lon,
                distance: distance
            };
        })
    );

    console.log("Nearby garages:", nearbyGarages);
    return nearbyGarages;
}

