import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE =
"https://st-v01.onrender.com";

export const authFetch = async (
url: string,
options: any = {}
) => {

const token =
await AsyncStorage.getItem("accessToken");

const res = await fetch(url, {

...options,

headers: {

"Content-Type": "application/json",

Authorization: `Bearer ${token}`,

...(options.headers || {})

}

});

return res;

};