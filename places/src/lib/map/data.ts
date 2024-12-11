'use server'

export async function getInitialPlaces() {
    const data = await fetch("http://localhost:3000/api/data", {
        cache: 'force-cache',
    })
        .then(res => res.json());

    return data
}