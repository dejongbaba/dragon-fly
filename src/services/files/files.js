import {api} from "@/services";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const fileToBinary = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const binaryData = reader.result;
            resolve(binaryData);
        };
        reader.onerror = () => {
            reject(new Error('Unable to read the file as binary data'));
        };
        console.log('file in reader', file)
        const blob = new Blob([file], {type: file.type})
        reader.readAsBinaryString(blob);
    });
};

const generateUrl = () => {
    return api.post('/assets/stage', false,
        {headers: {Authorization: apiKey}}).then(res => res.data)
        .catch((e) => Promise.reject(e))
}
/**
 *  upload file to aws
 *
 * @param url - unsigned url generated
 * @param key - key generated
 * @param data - file from form input
 * */
const stageFile = async (url, key, data) => {

    try {
        const res = await api.put(url, data,
            {
                headers: {'Content-Type': 'multipart/form-data', 'api-key': key},
                baseURL: ''
            })
        return res.data
    } catch (e) {
        return Promise.reject(e)
    }

}

const accessProcess = (key) => {
    return api.post(`/assets/process?key=${key}&pipeline=dragonfly-img-basic`, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: apiKey
            }
        },
    ).then((res) => res.data)
        .catch((e) => Promise.reject(e))
}

const checkFileStatus = (taskId) => {
    return api.get('/assets/status',
        {
            data: {taskId},
            headers: {
                Authorization: apiKey,
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json'
            }
        }).then(res => res.data)
        .catch((e) => Promise.reject(e))
}


export {generateUrl, stageFile, accessProcess, checkFileStatus, fileToBinary}
