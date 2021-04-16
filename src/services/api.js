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

    static async getUserDetail()  {
        const accessToken = window.localStorage.getItem("token")
        const res = await fetch(`${API.base_url}/auth/user`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        });
        var resJson = await res.json()
        // var deck = plainToClass(Deck, resJson.data)
        console.log(resJson.data)
        return resJson.data
    }

    static async getClassesDetail(classIds)  {
        const accessToken = window.localStorage.getItem("token")
        var classes = [];
        await Promise.all(classIds.map(async (cid) => {
            const res = await fetch(`${API.base_url}/class/${cid}`, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
                }
            });
            var resJson = await res.json()
            classes.push(resJson.data)
        }))
        
        // var deck = plainToClass(Deck, resJson.data)
        console.log(classes)
        return classes
    }

    static async getClassDetail(classId)  {
        const accessToken = window.localStorage.getItem("token")
        const res = await fetch(`${API.base_url}/class/${classId}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        });
        var resJson = await res.json()
        
        // var deck = plainToClass(Deck, resJson.data)
        console.log(resJson.data)
        return resJson.data
    }
}