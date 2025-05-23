import {createContext, useContext, useState,useCallback} from 'react';
import axiosInstance from './axiosInstance';
const ApiContext = createContext();

export const ApiProvider = ({children}) => {
 
    const requestWrapper = useCallback(async (apiCall) => {
     
        try {
            const response = await apiCall();
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } 
    }, []);
    const get = useCallback((url, config = {}) => requestWrapper(() => axiosInstance.get(url, config)), [requestWrapper]);
    const post = useCallback((url, data, config = {}) => requestWrapper(() => axiosInstance.post(url, data)), [requestWrapper]);
    const put = useCallback((url, data, config = {}) => requestWrapper(() => axiosInstance.put(url, data)), [requestWrapper]);
    const del = useCallback((url, data, config = {}) => requestWrapper(() => axiosInstance.delete(url, { data })), [requestWrapper]);

    return (
        <ApiContext.Provider value={{ get, post, put, del }}>
            {children}
        </ApiContext.Provider>
    );
}

export const useApi = () => useContext(ApiContext);