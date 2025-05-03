import loadGeo from "./loadGeo";
import loadName from "./loadName";
import loadPie from "./loadPie";
import loadCat from "./loadCat";
import loadStat from "./loadStat";
import { standardiseWithoutParen } from "./standardiseName";
import quizData from "./quizzes/quizzes.json";
import swal from "sweetalert2";

function hilbertIndex(x: any, y: any, order = 16) {
    let index = 0;
    for (let i = order - 1; i >= 0; i--) {
      const rx = (x >> i) & 1;
      const ry = (y >> i) & 1;
      index += (1 << (2 * i)) * ((3 * rx) ^ ry);
      if (ry === 0) {
        if (rx === 1) {
          x = (1 << order) - 1 - x;
          y = (1 << order) - 1 - y;
        }
        [x, y] = [y, x];
      }
    }
    return index;
  }

const loadData = async (slug: string) => {
    const splitted = slug.split("-");
    const N = splitted.length;
    const game = splitted[0];
    try {
        if (N >= 2) {
            let gameAccept = (quizData as any)[game].slugs;
            gameAccept = gameAccept[gameAccept.length - 1];

            const type = splitted[1];
            let data: any;
            if (type == "g") {
                data = await loadGeo(splitted.slice(2).join("-"));
                if (gameAccept == "name") data = data?.map(([name, value]: [any, any]) => standardiseWithoutParen(name));
                if (gameAccept == "stat") {
                    let newData: any = {};
                    data?.forEach(([name, value]: [any, any]) => {
                        const newName = standardiseWithoutParen(name as any);
                        const newValue = {
                            Longitude: (value as any)[0],
                            Latitude: (value as any)[1],
                            Name: newName,
                        };

                        if ((value as any).length > 2) {
                            (newValue as any)["Population"] = (value as any)[2];
                        }

                        if (!newData[newName]) {
                            newData[newName] = newValue;
                        }
                    });
                    data = newData;
                }
                if (gameAccept == "type") {
                    for (let item of data) {
                        const h = hilbertIndex(item[1][1], item[1][0]);
                        item.push(h);
                    }
                    data = data.sort((a: any, b: any) => {
                        return a[2] - b[2];
                    });
                    data = data.map((item: any) => {
                        return standardiseWithoutParen(item[0]);
                    });
                }
            } else if (type == "n") {
                data = await loadName(splitted.slice(2).join("-"));
            } else if (type == "p") {
                data = await loadPie(splitted.slice(2).join("-"));
            } else if (type == "c") {
                data = await loadCat(splitted.slice(2).join("-"));
            } else if (type == "t") {
                // data = await loadGeo(splitted.slice(2).join("-"));
            } else if (type == "s") {
                data = await loadStat(splitted.slice(2).join("-"));
                if (gameAccept == "name" || gameAccept == "type") {
                    data = data?.map(([name, value]: [any, any]) => {
                        return standardiseWithoutParen(name).trim()
                    });
                }

                if (gameAccept == "cat") {
                    let newData = {};
                    for (const [key, value] of data) {
                        const filter = key.split("#")[1];
                        if (!(newData as any)[filter]) (newData as any)[filter] = [];
                        (newData as any)[filter].push(standardiseWithoutParen(key));
                    }
                    data = newData;
                }
            }

            return data;
        }
        if ((quizData as any)[game].slugs.length == 0) return [];
        window.location.href = `/quizzes?search=${splitted.filter(s => s.length>1).join(" ")}`;
    } catch (err) {
        if (err)
        swal.fire({
            title: "Error",
            text: "Failed to load data. Navigating away...",
            icon: "error",
        }).then(() => {
            window.location.href = `/quizzes?search=${splitted.filter(s => s.length>1).map(s => s.replaceAll("_", " ")).join(" ")}`;
        });
    };
};

export default loadData;