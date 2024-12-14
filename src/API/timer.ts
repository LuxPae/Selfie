import axios from "axios";
import {Timer, TimerResponse} from "./model/timer";

const BASE_URL = "http://localhost:5001/timer"; // TODO: 5000

export async function getTimer({id, token}: { id: string, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios<Timer>({
            url, method: 'GET', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getTimers({token}: { token: string }) {
    try {
        const url = `${BASE_URL}`;
        return axios<Timer[]>({
            url, method: 'GET', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getLastTimer({token}: { token: string }) {
    try {
        const url = `${BASE_URL}/last`;
        return axios<Timer>({
            url, method: 'GET', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function deleteTimer({id, token}: { id: string, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios<Timer>({
            url, method: 'DELETE', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function postTimer({data, token}: { data: Timer, token: string }) {
    try {
        const url = `${BASE_URL}`;
        return axios<TimerResponse>({
            url, method: 'POST', data: data, headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function putTimer({id, data, token}: { id: string, data: Timer, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios<TimerResponse>({
            url, method: 'PUT', data: data, headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
