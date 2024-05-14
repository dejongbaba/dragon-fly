import {Button} from "@/components/ui/button";

export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className='font-semibold text-2xl'> Dragonfly Uploader</h1>
            <p className='text-slate-400  text-base'> Click the button below to upload a file</p>
            <div className='w-1/2 m-auto bg-slate-100 rounded-lg p-6'>
                <Button>Upload</Button>
            </div>
        </main>
    );
}
