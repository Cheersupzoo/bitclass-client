import { createContext, useContext, useEffect, useReducer } from 'react';

const AppContext = createContext({ accessToken: "" });

// const initialState = {
//     token: window.localStorage.getItem("token")
// }

const DispatchContext = createContext({})

const reducer = (state, action) => {
    const currentState = { ...state };
    switch (action.type) {
        case "LOGIN":
            currentState.accessToken = action.payload
            window.localStorage.setItem("token", action.payload)
            return currentState;
        case "LOGOUT":
            currentState.accessToken = null
            window.localStorage.removeItem("token");
            return currentState;
        case "SETTOKEN":
            currentState.accessToken = action.payload
            return currentState;
        default:
            return { accessToken: window.localStorage.getItem("token") };
    }
}

export function AppWrapper({ children }) {
    // let sharedState = { accessToken: window.localStorage.getItem("token") }
    // var accessToken = undefined;

    var [sharedState, dispatch] = useReducer(reducer, {})
    useEffect(() => {   
        dispatch({
            type: 'SETTOKEN',
            payload: window.localStorage.getItem("token")
        })
        return () => { }
    }, [])
    return (
        <DispatchContext.Provider value={dispatch}>
            <AppContext.Provider value={sharedState}>
                {children}
            </AppContext.Provider>
        </DispatchContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
export function useDispatchContext() {
    return useContext(DispatchContext);
}