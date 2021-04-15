export default class API {
    static base_url = "http://localhost:4000"


    static async signin(type,token,email,name)  {
        var body = {
            "type": type,
            "token": token,
            "email": email,
            "name": name
        };
        const res = await fetch(`${API.base_url}/auth/signup`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) // body data type must match "Content-Type" header
        });
        var resJson = await res.json()
        // var deck = plainToClass(Deck, resJson.data)
        console.log(resJson)
        return resJson
    }
}