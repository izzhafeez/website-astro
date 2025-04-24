import loadGeo from "./loadGeo";
import loadName from "./loadName";
import loadPie from "./loadPie";
import loadCat from "./loadCat";
import { standardiseWithoutParen } from "./standardiseName";
import quizData from "./quizzes/quizzes.json";
import swal from "sweetalert2";

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
            } else if (type == "n") {
                data = await loadName(splitted.slice(2).join("-"));
            } else if (type == "p") {
                data = await loadPie(splitted.slice(2).join("-"));
            } else if (type == "c") {
                data = await loadCat(splitted.slice(2).join("-"));
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