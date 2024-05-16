'use client'
import {useEffect, useState} from "react";
import {accessProcess, checkFileStatus, generateUrl, stageFile} from "@/services/files/files";

export default function Home() {

    const [fileList, setFileList] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [processLoading, setProcessLoading] = useState(false);
    const [keys, setKeys] = useState([]);
    const [taskIds, setTaskIds] = useState([]);


    //    handle single / multiple file selection
    const handleChange = async (event) => {

        const files = event.target.files;

        if (files.length) {

            try {
                let filesArray = [];
                setLoading(true)
                for (let f of Object.entries(files)) {
                    // const binary = await fileToBinary(f)
                    const formData = new FormData();
                    formData.append("binary_data", f);
                    const {key, url} = await generateUrl();
                    // store keys to monitor file upload progress
                    setKeys([...keys, key])
                    filesArray.push(stageFile(url, key, formData))
                }

                const uploadedFiles = await Promise.allSettled(filesArray);

                setFileList(uploadedFiles);
                setLoading(false)

            } catch (e) {
                setLoading(false)
                return Promise.reject(e)
            }
        }


    }


    useEffect(() => {
        const getImageProcesses = async () => {
            try {
                setProcessLoading(true);
                const processArray = keys.map((k) => {
                    return accessProcess(k)
                })
                const processes = await Promise.allSettled(processArray)
                setTaskIds(processes)
                setProcessLoading(false);

            } catch (e) {
                setProcessLoading(false);
                return Promise.reject(e)
            }

        }

        if (keys?.length) {
            getImageProcesses()
        }

    }, [keys]);


    useEffect(() => {

        const getImageStatuses = async () => {
            try {
                setStatusLoading(true)
                const statusArray = taskIds.map((k) => {
                    return checkFileStatus(k)
                })
                const statuses = await Promise.allSettled(statusArray)
                setStatuses(statuses)
                setStatusLoading(false)
            } catch (e) {
                setStatusLoading(false)
                return Promise.reject(e)
            }
        }

        if (taskIds?.length) {
            getImageStatuses()
        }

    }, [taskIds]);


    return (
        <main className="min-h-screen max-w-lg space-y-4 p-24">
            <div className='space-y-1'>
                <h1 className='font-semibold mb-0 text-xl leading-normal'> Dragonfly Uploader</h1>
                <p className='text-slate-400  text-sm'> Click the button below to upload a file</p>
            </div>
            <div className='bg-slate-100 space-y-6 rounded-lg p-6'>
                <form className='bg-slate-200 space-y-2 p-5 rounded-lg'>
                    <input multiple={true} type="file" onChange={handleChange}/>
                    {loading && <p>Uploading file...</p>}
                </form>

                <div className='space-y-2'>
                    <h1>File Processes</h1>
                    {processLoading && <p>loading process status...</p>}
                    <div className='bg-slate-200 min-h-[100px] rounded-lg'>
                        {/*    processes would be shown here */}
                    </div>

                </div>
                <div className='space-y-2'>

                    <h1>File Statuses</h1>
                    {statusLoading && <p>loading file status...</p>}
                    <div className='bg-slate-200 min-h-[100px] rounded-lg'>
                        {/*    statuses would be shown here */}

                    </div>

                </div>

            </div>
        </main>
    );
}
