// @app.get("/api/apps/cities/{name}") from PUBLIC_MM
export const getCities = async (name: string, code: string) => {
  return fetch(`${import.meta.env.PUBLIC_MM}/api/apps/cities?name=${name}&code=${code}`).then((res) => res.json());
}

export const getCountryBounds = async (name: string) => {
  return fetch(`${import.meta.env.PUBLIC_MM}/api/apps/cities/get-country-bound?name=${name}`).then((res) => res.json());
}