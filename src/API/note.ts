import axios from "axios";
import {NoteModel} from "./model/note";

const BASE_URL = "http://localhost:5001/note"; // TODO: 5000

export async function getNote({id, token}: { id: string, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios({
            url, method: 'GET', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function getNotes({token}: { token: string }) {
    try {
        const url = `${BASE_URL}`;
        return axios<NoteModel[]>({
            url, method: 'GET', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function deleteNote({id, token}: { id: string, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios({
            url, method: 'DELETE', headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function postNotes({data, token}: { data: NoteModel, token: string }) {
    try {
        const url = `${BASE_URL}`;
        return axios({
            url, method: 'POST', data: data, headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export async function putNotes({id, data, token}: { id: string, data: NoteModel, token: string }) {
    try {
        const url = `${BASE_URL}/${id}`;
        return axios({
            url, method: 'PUT', data: data, headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error(e);
        return undefined;
    }
}